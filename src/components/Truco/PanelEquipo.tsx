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
    <div className="flex-1 flex flex-col items-center space-y-4">
      {/* Encabezado del equipo */}
      <div className="w-full text-center bg-primary uppercase font-bold text-primary-content text-xl shadow-md">
        {nombre}
      </div>

      {/* Contenedor del score con espacio fijo para que empuje los botones */}
      <div className="h-[540px] overflow-y-auto overflow-x-hidden w-full px-2 flex justify-center items-center">
        <ScoreDisplay score={puntaje} color={color} />
      </div>

      {/* Puntaje numérico */}
      <div
        className={`text-5xl font-extrabold select-none ${color} drop-shadow-lg`}
        aria-label={`Puntaje de ${nombre}`}
      >
        {puntaje}
      </div>

      {/* Botones de suma y resta siempre abajo */}
      <div className="flex gap-4 mt-auto">
        <button
          onClick={() => onChange(-1)}
          className="btn btn-circle btn-primary text-2xl hover:btn-secondary transition"
          aria-label={`Disminuir puntaje de ${nombre}`}
        >
          –
        </button>
        <button
          onClick={() => onChange(1)}
          className="btn btn-circle btn-primary text-2xl hover:btn-secondary transition"
          aria-label={`Aumentar puntaje de ${nombre}`}
        >
          +
        </button>
      </div>
    </div>
  );
}
