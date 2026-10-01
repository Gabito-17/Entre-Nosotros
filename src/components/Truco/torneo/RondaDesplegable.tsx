"use client";

import { ReactNode } from "react";
import { Partido, Ronda } from "../../../utils/torneo/tipos.ts";
import PartidoCard from "./PartidoCard.tsx";

type Props = {
  titulo: string;
  ronda: Ronda;
  abierta: boolean;
  nombre: (id: string | null) => string;
  onAnotador: (partido: Partido) => void;
  onCargar: (partido: Partido, contexto: string) => void;
  onCorregir: (partido: Partido, contexto: string) => void;
  children?: ReactNode; // equipo libre, acciones de la ronda
};

// Una ronda plegable: en el celular solo queda abierta la que se está jugando.
export default function RondaDesplegable({
  titulo,
  ronda,
  abierta,
  nombre,
  onAnotador,
  onCargar,
  onCorregir,
  children,
}: Props) {
  const reales = ronda.partidos.filter((p) => p.estado !== "pase_libre");
  const jugados = reales.filter((p) => p.estado === "jugado").length;
  const completa = jugados === reales.length;

  return (
    <details className="collapse collapse-arrow bg-base-200/50 border border-base-300" open={abierta}>
      <summary className="collapse-title flex items-center gap-2 pr-10 min-h-0 py-3">
        <span className="font-semibold flex-1">{titulo}</span>
        <span className={`badge ${completa ? "badge-success" : "badge-ghost"}`}>
          {jugados}/{reales.length}
        </span>
      </summary>
      <div className="collapse-content flex flex-col gap-2">
        {ronda.partidos.map((p) => (
          <PartidoCard
            key={p.id}
            partido={p}
            nombre={nombre}
            onAnotador={onAnotador}
            onCargar={(partido) => onCargar(partido, titulo)}
            onCorregir={(partido) => onCorregir(partido, titulo)}
          />
        ))}
        {children}
      </div>
    </details>
  );
}
