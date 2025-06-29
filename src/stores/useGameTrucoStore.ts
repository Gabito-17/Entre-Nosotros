import { create } from "zustand";
import { persist } from "zustand/middleware";

type PointStyle = "fosforo" | "lines" | "cafe";
type Winner = "equipo1" | "equipo2" | null;

interface GameTrucoState {
  maxScore: number;
  pointStyle: PointStyle;
  score1: number;
  score2: number;
  winner: Winner;

  toggleMaxScore: () => void;
  setPointStyle: (style: PointStyle) => void;

  addPoint: (team: "equipo1" | "equipo2", amount?: number) => void;
  resetScores: () => void;
}

export const useGameTrucoStore = create<GameTrucoState>()(
  persist(
    (set, get) => ({
      maxScore: 15,
      pointStyle: "fosforo",
      score1: 0,
      score2: 0,
      winner: null,

      toggleMaxScore: () => {
        const newMax = get().maxScore === 15 ? 30 : 15;
        set({ maxScore: newMax });
      },

      setPointStyle: (style) => set({ pointStyle: style }),

      addPoint: (team, amount = 1) =>
        set((state) => {
          const rawScore1 =
            team === "equipo1" ? state.score1 + amount : state.score1;
          const rawScore2 =
            team === "equipo2" ? state.score2 + amount : state.score2;

          const newScore1 = Math.min(Math.max(rawScore1, 0), 30);
          const newScore2 = Math.min(Math.max(rawScore2, 0), 30);

          const winner =
            newScore1 >= state.maxScore
              ? "equipo1"
              : newScore2 >= state.maxScore
              ? "equipo2"
              : null;

          return {
            score1: newScore1,
            score2: newScore2,
            winner,
          };
        }),

      resetScores: () =>
        set({
          score1: 0,
          score2: 0,
          winner: null,
        }),
    }),
    {
      name: "truco-config",
    }
  )
);
