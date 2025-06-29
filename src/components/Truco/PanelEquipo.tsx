"use client";

import { ScoreDisplay } from "./ScoreDisplay.tsx";

interface PanelEquipoProps {
  nombre: string;
  puntaje: number;
  onChange: (delta: number) => void;
}

export default function PanelEquipo({
  nombre,
  puntaje,
  onChange,
}: PanelEquipoProps) {
  const color =
    nombre === "NOSOTROS"
      ? "text-green-700 dark:text-green-400"
      : "text-red-700 dark:text-red-400";

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Encabezado */}
      <div className="w-full text-center bg-primary uppercase font-bold text-primary-content text-xl shadow-md">
        {nombre}
      </div>

      {/* Zona central con scroll si es necesario */}
      <div className="overflow-y-auto w-full flex justify-center items-center">
        <ScoreDisplay score={puntaje} color={color} />
      </div>

      {/* Puntaje numérico */}
      <div
        className={`text-5xl font-extrabold select-none text-center ${color} drop-shadow-lg`}
      >
        {puntaje}
      </div>

      {/* Botones siempre abajo */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => onChange(-1)}
          className="btn btn-circle btn-primary text-2xl hover:btn-secondary"
        >
          –
        </button>
        <button
          onClick={() => onChange(1)}
          className="btn btn-circle btn-primary text-2xl hover:btn-secondary"
        >
          +
        </button>
      </div>
    </div>
  );
}
