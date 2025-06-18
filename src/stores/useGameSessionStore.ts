import { create } from "zustand";
import {
  playerNameSchema,
  scoreOrMinusTenSchema,
} from "../validation/validation.ts";

type Player = { id: string; name: string };
type RoundScore = Record<string, number>;
type TotalScores = Record<string, number>;

// Definimos el estado completo
type GameSessionState = {
  players: Player[];
  newPlayerName: string;
  currentRoundIndex: number;
  roundScoresHistory: RoundScore[];
  totalScores: TotalScores;
  disqualifiedPlayers: string[];
  currentDealerIndex: number;

  setNewPlayerName: (name: string) => void;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  resetSession: () => void;

  setRoundScore: (playerName: string, score: number) => void;
  assignMinusTen: (playerName: string) => void;
  confirmRound: () => void;
  reverseRound: () => void;

  exportSessionState: () => SessionSnapshot;
};

// Definimos un tipo auxiliar solo con el estado (sin métodos)
type SessionSnapshot = {
  players: Player[];
  newPlayerName: string;
  currentRoundIndex: number;
  roundScoresHistory: RoundScore[];
  totalScores: TotalScores;
  disqualifiedPlayers: string[];
  currentDealerIndex: number;
};

export const useGameSessionStore = create<GameSessionState>((set, get) => ({
  players: [],
  newPlayerName: "",
  currentRoundIndex: 0,
  roundScoresHistory: [],
  totalScores: {},
  disqualifiedPlayers: [],
  currentDealerIndex: 0,

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
    const { players, totalScores, roundScoresHistory, disqualifiedPlayers } =
      get();
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
  },

  resetSession: () => {
    set({
      players: [],
      newPlayerName: "",
      currentRoundIndex: 0,
      roundScoresHistory: [],
      totalScores: {},
      disqualifiedPlayers: [],
      currentDealerIndex: 0,
    });
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
          alert("Solo se puede asignar -10 puntos a un jugador por ronda");
          return;
        }
      }
    }

    const updatedTotals = { ...totalScores };
    players.forEach((player) => {
      updatedTotals[player.name] =
        (updatedTotals[player.name] || 0) + (currentRound[player.name] || 0);
    });

    const disqualifiedSet = new Set(disqualifiedPlayers);
    let nextDealerIndex = currentDealerIndex;
    const allDisqualified = players.every((p) => disqualifiedSet.has(p.name));

    if (!allDisqualified) {
      do {
        nextDealerIndex = (nextDealerIndex + 1) % players.length;
      } while (disqualifiedSet.has(players[nextDealerIndex].name));
    } else {
      nextDealerIndex = -1;
    }

    set({
      totalScores: updatedTotals,
      currentRoundIndex: currentRoundIndex + 1,
      currentDealerIndex: nextDealerIndex,
    });
  },

  reverseRound: () => {
    const { currentRoundIndex, roundScoresHistory, totalScores, players } =
      get();

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
      newTotals[player.name] = (newTotals[player.name] || 0) - scoreToSubtract;
    });

    const newHistory = [...roundScoresHistory];
    newHistory.splice(roundToRemoveIndex, 1);

    set({
      totalScores: newTotals,
      roundScoresHistory: newHistory,
      currentRoundIndex: roundToRemoveIndex,
    });
  },

  exportSessionState: () => {
    const {
      players,
      newPlayerName,
      currentRoundIndex,
      roundScoresHistory,
      totalScores,
      disqualifiedPlayers,
      currentDealerIndex,
    } = get();
    return {
      players,
      newPlayerName,
      currentRoundIndex,
      roundScoresHistory,
      totalScores,
      disqualifiedPlayers,
      currentDealerIndex,
    };
  },
}));
