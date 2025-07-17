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

  nombre1: string;
  nombre2: string;

  setMaxScore: (score: number) => void;  // <-- nuevo método
  setPointStyle: (style: PointStyle) => void;

  addPoint: (team: "equipo1" | "equipo2", amount?: number) => void;
  resetScores: () => void;

  setNombre: (team: "equipo1" | "equipo2", nombre: string) => void;
}

export const useGameTrucoStore = create<GameTrucoState>()(
  persist(
    (set, get) => ({
      maxScore: 15,
      pointStyle: "fosforo",
      score1: 0,
      score2: 0,
      winner: null,

      nombre1: "NOSOTROS",
      nombre2: "ELLOS",

      setMaxScore: (score) => {
        // Reiniciamos los puntajes al cambiar el maxScore para evitar inconsistencias
        set({
          maxScore: score,
          score1: 0,
          score2: 0,
          winner: null,
        });
      },

      setPointStyle: (style) => set({ pointStyle: style }),

      addPoint: (team, amount = 1) =>
        set((state) => {
          const rawScore1 =
            team === "equipo1" ? state.score1 + amount : state.score1;
          const rawScore2 =
            team === "equipo2" ? state.score2 + amount : state.score2;

          const max = state.maxScore; // usamos maxScore actual

          const newScore1 = Math.min(Math.max(rawScore1, 0), max);
          const newScore2 = Math.min(Math.max(rawScore2, 0), max);

          const winner =
            newScore1 >= max
              ? "equipo1"
              : newScore2 >= max
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

      setNombre: (team, nombre) =>
        set((state) =>
          team === "equipo1"
            ? { nombre1: nombre }
            : { nombre2: nombre }
        ),
    }),
    {
      name: "truco-config",
    }
  )
);
