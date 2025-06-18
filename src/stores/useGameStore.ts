import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  playerNameSchema,
  scoreOrMinusTenSchema,
} from "../validation/validation.ts";

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
  state: PersistedState;
};

type PersistedGames = Record<string, SavedGame>;

type GameState = PersistedState & {
  newPlayerName: string;
  savedGames: PersistedGames;
  activeGameId: string | null;

  // Estado general
  setNewPlayerName: (name: string) => void;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  handleResetGame: () => void;

  setRoundScore: (playerName: string, score: number) => void;
  assignMinusTen: (playerName: string) => void;

  confirmRound: () => void;
  reverseRound: () => void;

  // Manejo de partidas
  createNewGame: (name: string) => void;
  loadGame: (id: string) => void;
  saveCurrentGame: (name?: string) => void;
  deleteGame: (id: string) => void;
};

const STORAGE_KEY = "britneyGameState";

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => {
      // Función interna para persistir cambios a savedGames
      const persistSavedGames = (games: PersistedGames) => {
        set({ savedGames: games });
      };

      const persistActiveGame = () => {
        const {
          activeGameId,
          savedGames,
          players,
          currentRoundIndex,
          roundScoresHistory,
          totalScores,
          disqualifiedPlayers,
          currentDealerIndex,
        } = get();

        if (!activeGameId) return;

        const updatedSavedGames = {
          ...savedGames,
          [activeGameId]: {
            id: activeGameId,
            name: savedGames[activeGameId]?.name || "Partida sin nombre",
            state: {
              players,
              currentRoundIndex,
              roundScoresHistory,
              totalScores,
              disqualifiedPlayers,
              currentDealerIndex,
            },
          },
        };

        persistSavedGames(updatedSavedGames);
      };

      return {
        players: [],
        currentRoundIndex: 0,
        roundScoresHistory: [],
        totalScores: {},
        disqualifiedPlayers: [],
        currentDealerIndex: 0,

        newPlayerName: "",
        savedGames: {},
        activeGameId: null,

        setNewPlayerName: (name) => set({ newPlayerName: name }),

        addPlayer: () => {
          const { players, newPlayerName, totalScores } = get();
          const trimmedName = newPlayerName.trim();

          const result = playerNameSchema.safeParse(trimmedName);
          if (!result.success) {
            alert(result.error.errors[0].message);
            return;
          }

          const exists = players.some(
            (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
          );
          if (exists) {
            alert("El jugador ya existe");
            return;
          }

          const newPlayer = { id: crypto.randomUUID(), name: trimmedName };
          set((state) => {
            const updatedTotals = { ...state.totalScores, [newPlayer.name]: 0 };
            return {
              players: [...state.players, newPlayer],
              newPlayerName: "",
              totalScores: updatedTotals,
            };
          });
          persistActiveGame();
        },

        removePlayer: (id) => {
          const {
            players,
            totalScores,
            roundScoresHistory,
            disqualifiedPlayers,
          } = get();
          const playerToRemove = players.find((p) => p.id === id);
          if (!playerToRemove) return;

          const newPlayers = players.filter((p) => p.id !== id);
          const { [playerToRemove.name]: _, ...newTotals } = totalScores;

          const newHistory = roundScoresHistory.map((round) => {
            const { [playerToRemove.name]: __, ...rest } = round;
            return rest;
          });

          const newDisqualified = disqualifiedPlayers.filter(
            (name) => name !== playerToRemove.name
          );

          set({
            players: newPlayers,
            totalScores: newTotals,
            roundScoresHistory: newHistory,
            disqualifiedPlayers: newDisqualified,
          });
          persistActiveGame();
        },

        handleResetGame: () => {
          set({
            players: [],
            newPlayerName: "",
            currentRoundIndex: 0,
            roundScoresHistory: [],
            totalScores: {},
            disqualifiedPlayers: [],
            currentDealerIndex: 0,
          });
          persistActiveGame();
        },

        setRoundScore: (playerName, score) => {
          const { roundScoresHistory, currentRoundIndex } = get();
          const updatedHistory = [...roundScoresHistory];

          if (!updatedHistory[currentRoundIndex]) {
            updatedHistory[currentRoundIndex] = {};
          }

          updatedHistory[currentRoundIndex] = {
            ...updatedHistory[currentRoundIndex],
            [playerName]: score,
          };

          set({ roundScoresHistory: updatedHistory });
          persistActiveGame();
        },

        assignMinusTen: (playerName) => {
          get().setRoundScore(playerName, -10);
        },

        confirmRound: () => {
          const {
            roundScoresHistory,
            currentRoundIndex,
            totalScores,
            players,
            disqualifiedPlayers,
            currentDealerIndex,
          } = get();
          const currentRound = roundScoresHistory[currentRoundIndex] || {};

          let minusTenCount = 0;
          for (const player of players) {
            const score = currentRound[player.name];

            if (score === undefined) {
              alert(`Falta puntaje para ${player.name}`);
              return;
            }

            const result = scoreOrMinusTenSchema.safeParse(score);
            if (!result.success) {
              alert(
                `Puntaje inválido para ${player.name}: ${result.error.errors[0].message}`
              );
              return;
            }

            if (score === -10) {
              minusTenCount++;
              if (minusTenCount > 1) {
                alert(
                  "Solo se puede asignar -10 puntos a un jugador por ronda"
                );
                return;
              }
            }
          }

          // Suma los puntajes al total
          const updatedTotals = { ...totalScores };
          players.forEach((player) => {
            updatedTotals[player.name] =
              (updatedTotals[player.name] || 0) +
              (currentRound[player.name] || 0);
          });

          // Calcular siguiente dealer válido (no descalificado)
          const disqualifiedSet = new Set(disqualifiedPlayers);
          let nextDealerIndex = currentDealerIndex;
          const allDisqualified = players.every((p) =>
            disqualifiedSet.has(p.name)
          );

          if (!allDisqualified) {
            do {
              nextDealerIndex = (nextDealerIndex + 1) % players.length;
            } while (disqualifiedSet.has(players[nextDealerIndex].name));
          } else {
            nextDealerIndex = -1; // no hay dealer válido
          }

          set({
            totalScores: updatedTotals,
            currentRoundIndex: currentRoundIndex + 1,
            roundScoresHistory,
            currentDealerIndex: nextDealerIndex,
          });
          persistActiveGame();
        },

        reverseRound: () => {
          const {
            currentRoundIndex,
            roundScoresHistory,
            totalScores,
            players,
          } = get();

          if (currentRoundIndex === 0) return;

          const roundToRemoveIndex = currentRoundIndex - 1;
          const roundToRemove = roundScoresHistory[roundToRemoveIndex] || {};

          const confirmReverse = window.confirm(
            `¿Seguro que querés revertir la ronda ${roundToRemoveIndex + 1}?`
          );
          if (!confirmReverse) return;

          const newTotals = { ...totalScores };
          players.forEach((player) => {
            const scoreToSubtract = roundToRemove[player.name] || 0;
            newTotals[player.name] =
              (newTotals[player.name] || 0) - scoreToSubtract;
          });

          const newHistory = [...roundScoresHistory];
          newHistory.splice(roundToRemoveIndex, 1);

          set({
            totalScores: newTotals,
            roundScoresHistory: newHistory,
            currentRoundIndex: roundToRemoveIndex,
          });
          persistActiveGame();
        },

        // Manejo partidas

        createNewGame: (name) => {
          const { savedGames } = get();
          const id = crypto.randomUUID();
          const emptyState: PersistedState = {
            players: [],
            currentRoundIndex: 0,
            roundScoresHistory: [],
            totalScores: {},
            disqualifiedPlayers: [],
            currentDealerIndex: 0,
          };

          const newSavedGames = {
            ...savedGames,
            [id]: { id, name, state: emptyState },
          };

          set({
            savedGames: newSavedGames,
            activeGameId: id,
            ...emptyState,
            newPlayerName: "",
          });
          // persistActiveGame() será llamado automáticamente por persist middleware
        },

        loadGame: (id) => {
          const { savedGames } = get();
          const game = savedGames[id];
          if (!game) {
            alert("Partida no encontrada");
            return;
          }
          set({
            activeGameId: id,
            ...game.state,
            newPlayerName: "",
          });
        },

        saveCurrentGame: (name) => {
          const {
            activeGameId,
            savedGames,
            players,
            currentRoundIndex,
            roundScoresHistory,
            totalScores,
            disqualifiedPlayers,
            currentDealerIndex,
          } = get();
          if (!activeGameId) {
            alert("No hay partida activa para guardar");
            return;
          }

          const gameName =
            name || savedGames[activeGameId]?.name || "Partida sin nombre";

          const updatedGames = {
            ...savedGames,
            [activeGameId]: {
              id: activeGameId,
              name: gameName,
              state: {
                players,
                currentRoundIndex,
                roundScoresHistory,
                totalScores,
                disqualifiedPlayers,
                currentDealerIndex,
              },
            },
          };

          set({ savedGames: updatedGames });
          // No hace falta llamar a saveAllGamesToStorage porque persist lo hace
        },

        deleteGame: (id) => {
          const { savedGames, activeGameId } = get();
          if (!savedGames[id]) {
            alert("Partida no encontrada");
            return;
          }

          const { [id]: _, ...rest } = savedGames;

          if (activeGameId === id) {
            const nextId = Object.keys(rest)[0] || null;
            if (nextId) {
              const nextGame = rest[nextId];
              set({
                activeGameId: nextId,
                ...nextGame.state,
                newPlayerName: "",
                savedGames: rest,
              });
            } else {
              set({
                activeGameId: null,
                players: [],
                currentRoundIndex: 0,
                roundScoresHistory: [],
                totalScores: {},
                disqualifiedPlayers: [],
                currentDealerIndex: 0,
                newPlayerName: "",
                savedGames: {},
              });
            }
          } else {
            set({ savedGames: rest });
          }
        },
      };
    },
    {
      name: STORAGE_KEY,
      // Puedes usar getStorage para cambiar el storage si quieres
      // getStorage: () => localStorage,
      // Partialize para guardar solo partes necesarias (opcional)
      // partialize: (state) => ({
      //   savedGames: state.savedGames,
      //   activeGameId: state.activeGameId,
      //   players: state.players,
      //   currentRoundIndex: state.currentRoundIndex,
      //   roundScoresHistory: state.roundScoresHistory,
      //   totalScores: state.totalScores,
      //   disqualifiedPlayers: state.disqualifiedPlayers,
      //   currentDealerIndex: state.currentDealerIndex,
      // }),
    }
  )
);
