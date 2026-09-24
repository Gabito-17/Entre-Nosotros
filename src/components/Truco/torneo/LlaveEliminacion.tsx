"use client";

import { LockClosedIcon, TrophyIcon } from "@heroicons/react/24/outline";
import {
  eliminacionCompleta,
  nombreRondaEliminacion,
  totalRondasEliminacion,
} from "../../../utils/torneo/llaveEliminacion.ts";
import { Partido, Torneo } from "../../../utils/torneo/tipos.ts";
import RondaDesplegable from "./RondaDesplegable.tsx";

type Props = {
  torneo: Torneo;
  nombre: (id: string | null) => string;
  onCargar: (partido: Partido, contexto: string) => void;
  onCorregir: (partido: Partido, contexto: string) => void;
};

// Llave por rondas, una debajo de la otra (una llave horizontal no entra en
// el celular). Las rondas que todavía no se armaron se muestran bloqueadas.
export default function LlaveEliminacion({ torneo, nombre, onCargar, onCorregir }: Props) {
  const { rondas } = torneo;
  const totalRondas = totalRondasEliminacion(rondas);
  // Cada partido real elimina a un equipo: hay n − 1 partidos en total
  const totalPartidos = torneo.equipos.length - 1;
  const jugados = rondas.flatMap((r) => r.partidos).filter((p) => p.estado === "jugado").length;

  const final = eliminacionCompleta(rondas) ? rondas[rondas.length - 1].partidos[0] : null;
  const rondaActual = rondas.find((r) => r.partidos.some((p) => p.estado === "pendiente"));
  const futuras = Array.from(
    { length: totalRondas - rondas.length },
    (_, i) => rondas.length + i + 1
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span>
            {jugados} {jugados === 1 ? "partido jugado" : "partidos jugados"}
          </span>
          <span className="text-base-content/60">de {totalPartidos}</span>
        </div>
        <progress className="progress progress-primary w-full" value={jugados} max={totalPartidos} />
      </div>

      {final && (
        <div role="alert" className="alert alert-success">
          <TrophyIcon className="h-6 w-6" />
          <span>
            <b>¡Se jugó la final!</b> Ganó {nombre(final.ganador)}.
          </span>
        </div>
      )}

      {rondas.map((ronda) => (
        <RondaDesplegable
          key={ronda.numero}
          titulo={nombreRondaEliminacion(ronda.numero, rondas)}
          ronda={ronda}
          abierta={ronda === rondaActual}
          nombre={nombre}
          onCargar={onCargar}
          onCorregir={onCorregir}
        />
      ))}

      {futuras.map((numero) => (
        <div
          key={numero}
          className="flex items-center gap-2 rounded-box border border-dashed border-base-300 px-4 py-3 text-base-content/50"
        >
          <LockClosedIcon className="h-4 w-4" />
          <span className="font-semibold flex-1">{nombreRondaEliminacion(numero, rondas)}</span>
          <span className="text-xs">Se arma al terminar la ronda anterior</span>
        </div>
      ))}
    </div>
  );
}
