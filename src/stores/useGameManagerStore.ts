import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useGameSessionStore } from "./useGameSessionStore.ts";

type Player = { id: string; name: string };
type RoundScore = Record<string, number>;
type TotalScores = Record<string, number>;

type PersistedState = {
  players: Player[];
  currentRoundIndex: number;
  roundScoresHistory: RoundScore[];
  totalScores: TotalScores;
  disqualifiedPlayers: string[];
  currentDealerIndex: number;
};

type SavedGame = {
  id: string;
  name: string;
  finishedAt: string; // fecha ISO string
  state: SessionSnapshot;
};


type GameManagerState = {
  savedGames: Record<string, SavedGame>;
  activeGameId: string | null;

  createNewGame: (name: string) => void;
  saveCurrentGame: (name?: string) => void;
  loadGame: (id: string) => void;
  deleteGame: (id: string) => void;
};

export const useGameManagerStore = create<GameManagerState>()(
  persist(
    (set, get) => ({
      savedGames: {},
      activeGameId: null,

      createNewGame: (name) => {
        const id = crypto.randomUUID();
        const emptyState: PersistedState = {
          players: [],
          currentRoundIndex: 0,
          roundScoresHistory: [],
          totalScores: {},
          disqualifiedPlayers: [],
          currentDealerIndex: 0,
        };

        set((state) => ({
          savedGames: {
            ...state.savedGames,
            [id]: { id, name, state: emptyState },
          },
          activeGameId: id,
        }));

        // Resetea el Session Store
        useGameSessionStore.getState().resetSession();
      },

      saveCurrentGame: (name) => {
        const { activeGameId, savedGames } = get();
        if (!activeGameId) {
          alert("No hay partida activa para guardar");
          return;
        }

        const sessionState = useGameSessionStore
          .getState()
          .exportSessionState();

        const updatedGames = {
          ...savedGames,
          [activeGameId]: {
            id: activeGameId,
            name:
              name || savedGames[activeGameId]?.name || "Partida sin nombre",
            state: sessionState,
          },
        };

        set({ savedGames: updatedGames });
      },

      loadGame: (id) => {
        const { savedGames } = get();
        const game = savedGames[id];
        if (!game) {
          alert("Partida no encontrada");
          return;
        }

        set({ activeGameId: id });
        useGameSessionStore.setState({
          ...game.state,
          newPlayerName: "", // Siempre limpio el input de nuevo jugador
        });
      },

      deleteGame: (id) => {
        const { savedGames, activeGameId } = get();
        if (!savedGames[id]) {
          alert("Partida no encontrada");
          return;
        }

        const { [id]: _, ...rest } = savedGames;

        if (activeGameId === id) {
          set({
            savedGames: rest,
            activeGameId: null,
          });
          useGameSessionStore.getState().resetSession();
        } else {
          set({ savedGames: rest });
        }
      },
    }),
    { name: "britneySavedGames" }
  )
);
