"use client";

import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";
import { ScoreDisplay } from "./ScoreDisplay.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { scoreChange } from "../../lib/Animations.ts"; // nuevo

interface PanelEquipoProps {
  equipo: "equipo1" | "equipo2";
  nombre: string;
}

function ScreenTouchZonesEquipo({
  onChange,
}: {
  onChange: (delta: number) => void;
}) {
  return (
    <div className="absolute inset-0 z-30 grid grid-rows-2 w-full h-full">
      <button
        className="w-full h-full bg-transparent pointer-events-auto"
        onClick={() => onChange(-1)}
      />
      <button
        className="w-full h-full bg-transparent pointer-events-auto"
        onClick={() => onChange(+1)}
      />
    </div>
  );
}

export default function PanelEquipo({ equipo, nombre }: PanelEquipoProps) {
  const score = useGameTrucoStore((state) =>
    equipo === "equipo1" ? state.score1 : state.score2
  );
  const addPoint = useGameTrucoStore((state) => state.addPoint);

  const color = nombre === "NOSOTROS" ? "text-primary" : "text-secondary";

  const handleChange = (delta: number) => {
    addPoint(equipo, delta);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Nombre */}
      <div className="w-full text-center bg-primary uppercase font-bold text-primary-content text-xl shadow-md">
        {nombre}
      </div>

      {/* ScoreDisplay */}
      <div className="w-full flex justify-center overflow-y-auto">
        <ScoreDisplay score={score} color={color} />
      </div>

      {/* Puntaje grande con animación */}
      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={score}
            className={`text-6xl select-none ${color} drop-shadow-lg z-30 my-4`}
            variants={scoreChange}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Botones */}
      <div className="w-full flex justify-center gap-4 mb-4">
        <button
          className="btn btn-md btn-outline btn-secondary"
          onClick={() => handleChange(-1)}
        >
          -
        </button>
        <button
          className="btn btn-md btn-outline btn-primary"
          onClick={() => handleChange(+1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
