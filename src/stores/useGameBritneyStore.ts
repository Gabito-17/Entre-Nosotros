import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playerNameSchema, scoreSchema } from "../validation/validation.ts";
import { useUiStore } from "./useUiStore.ts";
import { useUiNotificationStore } from "./useUiNotificationStore.ts";

// TIP UTIL: atajo para mostrar notificaciones
const notify = (message: string, type: "info" | "success" | "error" | "warning" = "info") => {
  useUiNotificationStore.getState().addNotification(message, type);
};

type Player = { id: string; name: string };
type RoundScore = Record<string, number>;
type TotalScores = Record<string, number>;

type GameSessionState = {
  players: Player[];
  newPlayerName: string;
  currentRoundIndex: number;
  roundScoresHistory: RoundScore[];
  totalScores: TotalScores;
  dealerAbsoluteIndex: number;

  setNewPlayerName: (name: string) => void;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  resetSession: () => void;
  resetScores: () => void;

  setRoundScore: (playerName: string, score: number) => void;
  assignMinusTen: (playerName: string) => void;
  confirmRound: () => void;
  reverseRound: () => void;

  getDisqualifiedPlayers: () => string[];
  getCurrentDealer: () => Player | null;
  exportSessionState: () => SessionSnapshot;
};

type SessionSnapshot = {
  players: Player[];
  newPlayerName: string;
  currentRoundIndex: number;
  roundScoresHistory: RoundScore[];
  totalScores: TotalScores;
  dealerAbsoluteIndex: number;
};

export const useGameBritneyStore = create<GameSessionState>()(
  persist(
    (set, get) => ({
      players: [],
      newPlayerName: "",
      currentRoundIndex: 0,
      roundScoresHistory: [],
      totalScores: {},
      dealerAbsoluteIndex: 0,

      setNewPlayerName: (name) => set({ newPlayerName: name }),

      addPlayer: () => {
        const { players, newPlayerName, totalScores } = get();
        const trimmedName = newPlayerName.trim();

        const result = playerNameSchema.safeParse(trimmedName);
        if (!result.success) {
          notify(result.error.errors[0].message, "error");
          return;
        }

        const exists = players.some(
          (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (exists) {
          notify("El jugador ya existe", "warning");
          return;
        }

        const newPlayer = {
          id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: trimmedName,
        };
        set({
          players: [...players, newPlayer],
          newPlayerName: "",
          totalScores: { ...totalScores, [newPlayer.name]: 0 },
        });
      },

      removePlayer: (id) => {
        const {
          players,
          totalScores,
          roundScoresHistory,
          dealerAbsoluteIndex,
        } = get();
        const playerToRemove = players.find((p) => p.id === id);
        if (!playerToRemove) return;

        const newPlayers = players.filter((p) => p.id !== id);
        const newTotals = { ...totalScores };
        delete newTotals[playerToRemove.name];
        const newHistory = roundScoresHistory.map((round) => {
          const { [playerToRemove.name]: __, ...rest } = round;
          return rest;
        });

        let newDealerIndex = dealerAbsoluteIndex;
        const removedIndex = players.findIndex((p) => p.id === id);
        if (removedIndex < dealerAbsoluteIndex) {
          newDealerIndex -= 1;
        } else if (removedIndex === dealerAbsoluteIndex) {
          newDealerIndex = dealerAbsoluteIndex % Math.max(newPlayers.length, 1);
        }

        set({
          players: newPlayers,
          totalScores: newTotals,
          roundScoresHistory: newHistory,
          dealerAbsoluteIndex: newDealerIndex,
        });
      },

      resetSession: () => {
        set({
          players: [],
          newPlayerName: "",
          currentRoundIndex: 0,
          roundScoresHistory: [],
          totalScores: {},
          dealerAbsoluteIndex: 0,
        });
        useUiStore.getState().closeGameOverModal();
        useUiStore.getState().closeTotalScoresModal();
        useUiStore.getState().closePlayerModal();
        useUiStore.getState().closeConfirmationModal();
        setTimeout(() => {
          useUiStore.getState().popDisqualificationQueue();
        }, 0);

        localStorage.removeItem("game-session-storage");
      },

      resetScores: () => {
        set({
          totalScores: {},
          roundScoresHistory: [],
          currentRoundIndex: 0,
          dealerAbsoluteIndex: 0,
        });
      },

      setRoundScore: (playerName, score) => {
        const {
          roundScoresHistory,
          currentRoundIndex,
          getDisqualifiedPlayers,
        } = get();
        if (getDisqualifiedPlayers().includes(playerName)) {
          notify(`No se puede asignar puntaje a ${playerName} porque está descalificado`, "warning");
          return;
        }

        const updatedHistory = [...roundScoresHistory];
        if (!updatedHistory[currentRoundIndex]) {
          updatedHistory[currentRoundIndex] = {};
        }
        updatedHistory[currentRoundIndex] = {
          ...updatedHistory[currentRoundIndex],
          [playerName]: score,
        };

        set({ roundScoresHistory: updatedHistory });
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
          dealerAbsoluteIndex,
        } = get();

        let currentRound = roundScoresHistory[currentRoundIndex] || {};
        players.forEach((player) => {
          if (currentRound[player.name] === undefined) {
            currentRound = { ...currentRound, [player.name]: 0 };
          }
        });

        let minusTenCount = 0;
        for (const player of players) {
          let score = currentRound[player.name] ?? 0;
          const result = scoreSchema.safeParse(score);
          if (!result.success) {
            notify(
              `Puntaje inválido para ${player.name}: ${result.error.errors[0].message}`,
              "error"
            );
            return;
          }
          if (score === -10) {
            minusTenCount++;
            if (minusTenCount > 1) {
              notify("Solo se puede asignar -10 puntos a un jugador por ronda", "error");
              return;
            }
          }
        }

        const updatedTotals = { ...totalScores };
        players.forEach((player) => {
          updatedTotals[player.name] =
            (updatedTotals[player.name] || 0) +
            (currentRound[player.name] || 0);
        });

        const disqualifiedNow = players.filter(
          (p) => updatedTotals[p.name] >= 100
        );
        const uiStore = useUiStore.getState();

        disqualifiedNow.forEach((player) => {
          if (!get().getDisqualifiedPlayers().includes(player.name)) {
            uiStore.addToDisqualificationQueue(player.name);
          }
        });

        const newHistory = [...roundScoresHistory];
        newHistory[currentRoundIndex] = currentRound;

        set({
          totalScores: updatedTotals,
          currentRoundIndex: currentRoundIndex + 1,
          roundScoresHistory: newHistory,
          dealerAbsoluteIndex: (dealerAbsoluteIndex + 1) % players.length,
        });
      },

      reverseRound: () => {
        const {
          currentRoundIndex,
          roundScoresHistory,
          totalScores,
          players,
          dealerAbsoluteIndex,
        } = get();
        if (currentRoundIndex === 0) return;

        const roundToRemoveIndex = currentRoundIndex - 1;
        const roundToRemove = roundScoresHistory[roundToRemoveIndex] || {};
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
          dealerAbsoluteIndex:
            (dealerAbsoluteIndex - 1 + players.length) % players.length,
        });
      },

      getDisqualifiedPlayers: () => {
        const { players, totalScores } = get();
        return players
          .filter((player) => totalScores[player.name] >= 100)
          .map((p) => p.name);
      },

      getCurrentDealer: () => {
        const { players, dealerAbsoluteIndex, getDisqualifiedPlayers } = get();
        const disqualified = getDisqualifiedPlayers();

        for (let i = 0; i < players.length; i++) {
          const index = (dealerAbsoluteIndex + i) % players.length;
          if (!disqualified.includes(players[index].name)) {
            return players[index];
          }
        }
        return null;
      },

      exportSessionState: () => {
        const {
          players,
          newPlayerName,
          currentRoundIndex,
          roundScoresHistory,
          totalScores,
          dealerAbsoluteIndex,
        } = get();
        return {
          players,
          newPlayerName,
          currentRoundIndex,
          roundScoresHistory,
          totalScores,
          dealerAbsoluteIndex,
        };
      },
    }),
    {
      name: "game-session-storage",
      partialize: (state) => ({
        players: state.players,
        newPlayerName: state.newPlayerName,
        currentRoundIndex: state.currentRoundIndex,
        roundScoresHistory: state.roundScoresHistory,
        totalScores: state.totalScores,
        dealerAbsoluteIndex: state.dealerAbsoluteIndex,
      }),
    }
  )
);
