import { create } from "zustand";
import { persist } from "zustand/middleware";

type PointStyle = "fosforo" | "lines" | "cafe";
type Winner = "equipo1" | "equipo2" | null;

type PartidoTorneo = { torneoId: string; partidoId: string };

// Partida libre que se guarda mientras se juega un partido del torneo
type PartidaLibre = {
  maxScore: number;
  score1: number;
  score2: number;
  winner: Winner;
  nombre1: string;
  nombre2: string;
};

interface GameTrucoState {
  maxScore: number;
  pointStyle: PointStyle;
  score1: number;
  score2: number;
  winner: Winner;

  nombre1: string;
  nombre2: string;

  // Contexto de torneo: mientras hay un partido abierto, la partida libre queda guardada
  partidoTorneo: PartidoTorneo | null;
  partidaLibreGuardada: PartidaLibre | null;
  iniciarPartidoTorneo: (datos: {
    torneoId: string;
    partidoId: string;
    nombre1: string;
    nombre2: string;
    maxScore: number;
  }) => void;
  salirPartidoTorneo: () => void;

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

      partidoTorneo: null,
      partidaLibreGuardada: null,

      // Si ya hay un partido de torneo abierto, la partida libre ya está guardada
      // y no se pisa con el avance de ese partido.
      iniciarPartidoTorneo: ({ torneoId, partidoId, nombre1, nombre2, maxScore }) =>
        set((state) => ({
          partidaLibreGuardada: state.partidoTorneo
            ? state.partidaLibreGuardada
            : {
                maxScore: state.maxScore,
                score1: state.score1,
                score2: state.score2,
                winner: state.winner,
                nombre1: state.nombre1,
                nombre2: state.nombre2,
              },
          partidoTorneo: { torneoId, partidoId },
          nombre1,
          nombre2,
          maxScore,
          score1: 0,
          score2: 0,
          winner: null,
        })),

      salirPartidoTorneo: () =>
        set((state) => ({
          ...(state.partidaLibreGuardada ?? {}),
          partidoTorneo: null,
          partidaLibreGuardada: null,
        })),

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
