"use client";

import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";
import { ScoreDisplay } from "./ScoreDisplay.tsx";

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

  const color =
    nombre === "NOSOTROS"
      ? "text-green-700 dark:text-green-400"
      : "text-red-700 dark:text-red-400";

  const handleChange = (delta: number) => {
    addPoint(equipo, delta);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Nombre del equipo */}
      <div className="w-full text-center bg-primary uppercase font-bold text-primary-content text-xl shadow-md">
        {nombre}
      </div>

      {/* Visualización y zona de clics */}
      <div className="relative w-full flex justify-center flex-1">
        <ScoreDisplay score={score} color={color} />
        <ScreenTouchZonesEquipo onChange={handleChange} />
      </div>

      {/* Puntaje numérico centrado */}
      <div className="w-full flex justify-center">
        <span
          className={`text-6xl select-none ${color} drop-shadow-lg z-30 my-4`}
        >
          {score}
        </span>
      </div>

      {/* Botones para sumar/restar puntos */}
      <div className="w-full flex justify-center gap-4 pb-32">
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={() => handleChange(-1)}
        >
          -1
        </button>
        <button
          className="btn btn-sm btn-outline btn-success"
          onClick={() => handleChange(+1)}
        >
          +1
        </button>
      </div>
    </div>
  );
}
