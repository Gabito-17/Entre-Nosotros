"use client";

import { ScoreDisplay } from "./ScoreDisplay.tsx";

interface PanelEquipoProps {
  nombre: string;
  puntaje: number;
  onChange: (delta: number) => void;
}

function ScreenTouchZonesEquipo({ onChange }: { onChange: (delta: number) => void }) {
  return (
    <div className="absolute inset-0 z-30 grid grid-rows-2 w-full h-full">
      {/* Zona superior: +1 */}
      <button
        className="w-full h-full bg-transparent pointer-events-auto"
        onClick={() => onChange(-1)}
      />
      {/* Zona inferior: -1 */}
      <button
        className="w-full h-full bg-transparent pointer-events-auto"
        onClick={() => onChange(+1)}
      />
    </div>
  );
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

      {/* Zona central: ScoreDisplay y zona táctil */}
      <div className="relative w-full flex justify-center min-h-0">
        <ScoreDisplay score={puntaje} color={color} />
        {<ScreenTouchZonesEquipo onChange={onChange} />}
      </div>
      {/* Puntaje grande, por encima de la zona táctil */}
      <span className={`text-6xl select-none ${color} drop-shadow-lg z-30 my-8 text-center w-full`}>
        {puntaje}
      </span>
    </div>
  );
}