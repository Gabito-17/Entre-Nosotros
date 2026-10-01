"use client";

import { CheckIcon, ForwardIcon, PencilSquareIcon, PlayIcon } from "@heroicons/react/24/outline";
import { Partido } from "../../../utils/torneo/tipos.ts";

type Props = {
  partido: Partido;
  nombre: (id: string | null) => string;
  onAnotador: (partido: Partido) => void;
  onCargar: (partido: Partido) => void;
  onCorregir: (partido: Partido) => void;
};

// Un partido del torneo. Los equipos van uno debajo del otro para que los
// nombres largos entren en el celular.
export default function PartidoCard({ partido, nombre, onAnotador, onCargar, onCorregir }: Props) {
  const { equipoA, equipoB, tantosA, tantosB, ganador, estado, origen } = partido;

  if (estado === "pase_libre") {
    return (
      <div className="flex items-center gap-2 rounded-box border border-dashed border-base-300 px-3 py-2">
        <span className="flex-1 min-w-0 truncate font-semibold">{nombre(equipoA)}</span>
        <span className="badge badge-secondary badge-outline gap-1">
          <ForwardIcon className="h-3 w-3" /> pase libre
        </span>
      </div>
    );
  }

  const jugado = estado === "jugado";
  const definido = !!equipoA && !!equipoB;

  const fila = (id: string | null, tantos: number | null, color: string) => {
    const gano = jugado && ganador === id;
    return (
      <div className="flex items-center gap-2">
        <span
          className={`flex-1 min-w-0 truncate ${
            id ? `font-semibold ${color}` : "italic text-base-content/50"
          } ${jugado && !gano ? "opacity-60" : ""}`}
        >
          {nombre(id)}
        </span>
        {gano && <CheckIcon className="h-4 w-4 text-success" aria-label="Ganador" />}
        <span className={`w-8 text-right text-lg tabular-nums ${gano ? "font-bold" : ""}`}>
          {jugado ? tantos : "–"}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`rounded-box px-3 py-2 flex flex-col gap-1 ${
        jugado ? "bg-base-200" : "bg-base-100 border border-base-300"
      }`}
    >
      {fila(equipoA, tantosA, "text-primary")}
      {fila(equipoB, tantosB, "text-secondary")}

      <div className="flex items-center justify-between gap-2 pt-1 min-h-8">
        <span className="text-xs text-base-content/60">
          {jugado
            ? origen === "anotador"
              ? "Desde el anotador"
              : "Cargado a mano"
            : definido
            ? "Por jugar"
            : "Espera al ganador de la ronda anterior"}
        </span>
        {jugado && (
          <button className="btn btn-sm btn-ghost" onClick={() => onCorregir(partido)}>
            <PencilSquareIcon className="h-4 w-4" /> Corregir
          </button>
        )}
      </div>

      {!jugado && (
        <div className="grid grid-cols-2 gap-2">
          <button
            className="btn btn-sm btn-primary flex-nowrap whitespace-nowrap px-2"
            disabled={!definido}
            onClick={() => onAnotador(partido)}
          >
            <PlayIcon className="h-4 w-4" /> Anotador
          </button>
          <button
            className="btn btn-sm btn-outline flex-nowrap whitespace-nowrap px-2"
            disabled={!definido}
            onClick={() => onCargar(partido)}
          >
            <PencilSquareIcon className="h-4 w-4" /> Cargar a mano
          </button>
        </div>
      )}
    </div>
  );
}
