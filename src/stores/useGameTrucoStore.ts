import { create } from "zustand";
import { persist } from "zustand/middleware";

type PointStyle = "fosforo" | "lines" | "poroto";

interface GameTrucoState {
  maxScore: number;
  pointStyle: PointStyle;

  toggleMaxScore: () => void;
  setPointStyle: (style: PointStyle) => void;
}

export const useGameTrucoStore = create<GameTrucoState>()(
  persist(
    (set) => ({
      maxScore: 15,
      pointStyle: "fosforo",

      toggleMaxScore: () =>
        set((state) => ({
          maxScore: state.maxScore === 15 ? 30 : 15,
        })),

      setPointStyle: (style: PointStyle) =>
        set(() => ({
          pointStyle: style,
        })),
    }),
    {
      name: "truco-config", // clave en localStorage
    }
  )
);
