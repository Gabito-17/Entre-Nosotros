"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import { Equipo, Podio as PodioTipo } from "../../../utils/torneo/tipos.ts";

type Props = {
  podio: PodioTipo | null;
  equipos: Equipo[];
};

const PUESTOS = [
  { clave: "segundo", numero: 2, alto: "h-20", color: "bg-base-300" },
  { clave: "primero", numero: 1, alto: "h-28", color: "bg-primary text-primary-content" },
  { clave: "tercero", numero: 3, alto: "h-14", color: "bg-secondary/40" },
] as const;

// Podio clásico (2°, 1°, 3°). Con 2 equipos no hay 3°: se omite ese puesto.
export default function Podio({ podio, equipos }: Props) {
  if (!podio) return null;
  const buscar = (id: string | null) => equipos.find((e) => e.id === id);
  const sinTercero = !podio.tercero;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-center gap-2">
        {PUESTOS.filter((p) => !(p.clave === "tercero" && sinTercero)).map(({ clave, numero, alto, color }) => {
          const equipo = buscar(podio[clave]);
          return (
            <div key={clave} className="flex flex-col items-center flex-1 min-w-0 max-w-40">
              {numero === 1 && <TrophyIcon className="h-8 w-8 text-warning" />}
              <span className="font-bold text-center break-words w-full text-sm sm:text-base">
                {equipo?.nombre ?? "—"}
              </span>
              {equipo && equipo.participantes.length > 1 && (
                <span className="text-xs text-base-content/60 text-center break-words w-full">
                  {equipo.participantes.join(", ")}
                </span>
              )}
              <div className={`${alto} ${color} w-full rounded-t-box mt-1 flex items-center justify-center text-3xl font-bold`}>
                {numero}°
              </div>
            </div>
          );
        })}
      </div>
      {sinTercero && (
        <p className="text-center text-xs text-base-content/60">Con 2 equipos no hay 3° puesto.</p>
      )}
    </div>
  );
}
