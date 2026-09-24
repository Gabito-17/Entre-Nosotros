"use client";

import {
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ForwardIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { estadoCrucesLiga } from "../../../utils/torneo/fixtureLiga.ts";
import { siguientePotenciaDe2 } from "../../../utils/torneo/llaveEliminacion.ts";
import { claveCruce } from "../../../utils/torneo/partido.ts";
import { Cruce, Equipo, Formato, Ronda } from "../../../utils/torneo/tipos.ts";
import {
  validarPrimeraRondaEliminacion,
  validarRondaManualLiga,
} from "../../../utils/torneo/validarCruces.ts";

export type SeleccionCruces = { cruces: Cruce[]; pasesLibres: string[] };

export const SELECCION_VACIA: SeleccionCruces = { cruces: [], pasesLibres: [] };

// Mensaje de error de la selección actual, o null si se puede confirmar.
export const errorSeleccion = (
  formato: Formato,
  seleccion: SeleccionCruces,
  equipoIds: string[],
  rondasPrevias: Ronda[] = []
) =>
  formato === "liga"
    ? validarRondaManualLiga(seleccion.cruces, equipoIds, rondasPrevias)
    : validarPrimeraRondaEliminacion(seleccion.cruces, seleccion.pasesLibres, equipoIds);

type Props = {
  equipos: Equipo[];
  // Liga: se arma una ronda (el que sobra queda libre).
  // Eliminación: se arma la 1ª ronda, con sus pases libres.
  formato: Formato;
  seleccion: SeleccionCruces;
  onChange: (seleccion: SeleccionCruces) => void;
  // Solo liga: rondas ya armadas, para no repetir cruces
  rondasPrevias?: Ronda[];
};

export default function CrucesManualesEditor({
  equipos,
  formato,
  seleccion,
  onChange,
  rondasPrevias = [],
}: Props) {
  const [elegido, setElegido] = useState<string | null>(null);
  const { cruces, pasesLibres } = seleccion;

  const nombre = (id: string) => equipos.find((e) => e.id === id)?.nombre ?? "?";
  const asignados = new Set([...cruces.flat(), ...pasesLibres]);
  const sinAsignar = equipos.filter((e) => !asignados.has(e.id));

  const yaJugados = new Set(
    rondasPrevias
      .flatMap((r) => r.partidos)
      .filter((p) => p.equipoA && p.equipoB)
      .map((p) => claveCruce(p.equipoA, p.equipoB))
  );
  const puedenJugar = (a: string, b: string) => a !== b && !yaJugados.has(claveCruce(a, b));

  // Liga: equipos que ya jugaron con todos los que quedan sin asignar, y
  // cruces pendientes entre los que van a quedar sin jugar esta ronda.
  const esLiga = formato === "liga";
  const sinRival = esLiga
    ? sinAsignar.filter((e) => !sinAsignar.some((o) => puedenJugar(e.id, o.id)))
    : [];
  const podrianJugar: Cruce[] = [];
  if (esLiga && cruces.length > 0) {
    sinAsignar.forEach((e, i) =>
      sinAsignar.slice(i + 1).forEach((o) => {
        if (puedenJugar(e.id, o.id)) podrianJugar.push([e.id, o.id]);
      })
    );
  }
  const crucesRestantes = esLiga
    ? estadoCrucesLiga(
        equipos.map((e) => e.id),
        rondasPrevias
      ).sinArmar.length - cruces.length
    : 0;

  const n = equipos.length;
  const pasesNecesarios = siguientePotenciaDe2(n) - n;
  const error = errorSeleccion(
    formato,
    seleccion,
    equipos.map((e) => e.id),
    rondasPrevias
  );

  const handleElegir = (id: string) => {
    if (elegido === null) return setElegido(id);
    if (elegido === id) return setElegido(null);
    onChange({ ...seleccion, cruces: [...cruces, [elegido, id]] });
    setElegido(null);
  };

  const darPaseLibre = () => {
    if (!elegido) return;
    onChange({ ...seleccion, pasesLibres: [...pasesLibres, elegido] });
    setElegido(null);
  };

  const quitarCruce = (i: number) =>
    onChange({ ...seleccion, cruces: cruces.filter((_, j) => j !== i) });

  const quitarPase = (id: string) =>
    onChange({ ...seleccion, pasesLibres: pasesLibres.filter((p) => p !== id) });

  const limpiar = () => {
    setElegido(null);
    onChange(SELECCION_VACIA);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-base-content/70">
        Tocá un equipo y después su rival para armar un partido.{" "}
        {formato === "liga"
          ? n % 2 === 1 && "Con cantidad impar de equipos, el que quede sin rival queda libre esta ronda."
          : pasesNecesarios > 0
          ? `Con ${n} equipos tiene que haber ${pasesNecesarios} ${
              pasesNecesarios === 1 ? "pase libre" : "pases libres"
            }: tocá un equipo y elegí "Pase libre".`
          : `Con ${n} equipos no hay pases libres.`}
      </p>

      {/* Equipos sin asignar */}
      <div>
        <h4 className="font-semibold mb-2">Sin asignar</h4>
        {sinAsignar.length === 0 ? (
          <p className="text-sm text-base-content/60">Todos los equipos tienen lugar.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sinAsignar.map((e) => {
              const repetido = elegido !== null && elegido !== e.id && yaJugados.has(claveCruce(elegido, e.id));
              const agotado = elegido === null && sinRival.includes(e);
              return (
                <button
                  key={e.id}
                  type="button"
                  disabled={repetido || agotado}
                  title={
                    repetido
                      ? "Ese cruce ya está en el fixture"
                      : agotado
                      ? "Ya jugó con todos los que quedan sin asignar"
                      : undefined
                  }
                  onClick={() => handleElegir(e.id)}
                  className={`btn btn-sm ${elegido === e.id ? "btn-primary" : "btn-outline"}`}
                >
                  {e.nombre}
                </button>
              );
            })}
          </div>
        )}

        {/* En el celular no hay tooltips: el motivo se explica en texto */}
        {sinRival.length > 0 && !elegido && (
          <p className="text-xs text-base-content/60 mt-2">
            {sinRival.map((e) => e.nombre).join(", ")}{" "}
            {sinRival.length === 1 ? "ya jugó" : "ya jugaron"} con todos los que quedan sin asignar.
          </p>
        )}

        {elegido && (
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
            <span>
              Elegí el rival de <b>{nombre(elegido)}</b>
            </span>
            {formato === "eliminacion" && pasesNecesarios > 0 && (
              <button type="button" className="btn btn-xs btn-secondary" onClick={darPaseLibre}>
                <ForwardIcon className="h-4 w-4" /> Pase libre
              </button>
            )}
          </div>
        )}
      </div>

      {/* Partidos armados */}
      {(cruces.length > 0 || pasesLibres.length > 0) && (
        <ul className="flex flex-col gap-2">
          {cruces.map(([a, b], i) => (
            <li
              key={`${a}-${b}`}
              className="flex items-center gap-2 rounded-box bg-base-200 px-3 py-2"
            >
              <span className="flex-1 min-w-0 truncate text-right font-semibold text-primary">{nombre(a)}</span>
              <span className="badge badge-neutral">vs</span>
              <span className="flex-1 min-w-0 truncate font-semibold text-secondary">{nombre(b)}</span>
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-square"
                onClick={() => quitarCruce(i)}
                aria-label="Quitar partido"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
          {pasesLibres.map((id) => (
            <li
              key={id}
              className="flex items-center gap-2 rounded-box border border-dashed border-base-300 px-3 py-2"
            >
              <span className="flex-1 min-w-0 truncate font-semibold">{nombre(id)}</span>
              <span className="badge badge-secondary badge-outline">pase libre</span>
              <button
                type="button"
                className="btn btn-xs btn-ghost btn-square"
                onClick={() => quitarPase(id)}
                aria-label="Quitar pase libre"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {podrianJugar.length > 0 && (
        <p className="text-sm text-base-content/70">
          Sin jugar esta ronda, pero todavía se deben un partido:{" "}
          {podrianJugar
            .slice(0, 3)
            .map(([a, b]) => `${nombre(a)} vs ${nombre(b)}`)
            .join(", ")}
          {podrianJugar.length > 3 && ` y ${podrianJugar.length - 3} más`}.
        </p>
      )}

      <div className="flex items-center gap-2">
        {error ? (
          <div role="alert" className="alert alert-warning py-2 text-sm flex-1">
            <ExclamationTriangleIcon className="h-5 w-5" />
            <span>{error}</span>
          </div>
        ) : (
          <div role="alert" className="alert alert-success py-2 text-sm flex-1">
            <CheckCircleIcon className="h-5 w-5" />
            <span>
              Cruces listos
              {esLiga && sinAsignar.length === 1 && ` · ${sinAsignar[0].nombre} queda libre`}
              {esLiga &&
                ` · ${
                  crucesRestantes === 0
                    ? "con esta ronda se completan todos los cruces"
                    : `después ${crucesRestantes === 1 ? "queda 1 cruce" : `quedan ${crucesRestantes} cruces`} por armar`
                }`}
            </span>
          </div>
        )}
        <button type="button" className="btn btn-sm btn-ghost" onClick={limpiar} title="Empezar de nuevo">
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
