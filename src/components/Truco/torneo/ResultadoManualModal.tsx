"use client";

import { ExclamationTriangleIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { validarResultado } from "../../../utils/torneo/partido.ts";

type Props = {
  titulo: string;
  subtitulo?: string;
  nombreA: string;
  nombreB: string;
  puntosPartida: number;
  // Al corregir: el resultado que ya estaba cargado
  inicial?: { tantosA: number; tantosB: number };
  // Resultados que se pierden si se guarda este marcador (eliminación).
  // Si devuelve alguno, se pide confirmación antes de guardar.
  afectados?: (tantosA: number, tantosB: number) => string[];
  onGuardar: (tantosA: number, tantosB: number) => boolean;
  onCerrar: () => void;
};

const aNumero = (valor: string) => (valor.trim() === "" ? null : Number(valor));

export default function ResultadoManualModal({
  titulo,
  subtitulo,
  nombreA,
  nombreB,
  puntosPartida,
  inicial,
  afectados,
  onGuardar,
  onCerrar,
}: Props) {
  const [tantos, setTantos] = useState<[string, string]>([
    inicial ? String(inicial.tantosA) : "",
    inicial ? String(inicial.tantosB) : "",
  ]);
  const [perdidos, setPerdidos] = useState<string[] | null>(null);

  const tantosA = aNumero(tantos[0]);
  const tantosB = aNumero(tantos[1]);
  const completo = tantosA !== null && tantosB !== null;
  const error = completo ? validarResultado(tantosA, tantosB, puntosPartida) : null;
  const sinCambios =
    !!inicial && tantosA === inicial.tantosA && tantosB === inicial.tantosB;
  const puedeGuardar = completo && !error && !sinCambios;

  const cambiar = (lado: 0 | 1, valor: string) => {
    // Solo dígitos: el teclado numérico del celular a veces deja pasar "." o "-"
    const limpio = valor.replace(/\D/g, "").slice(0, 2);
    setTantos((t) => (lado === 0 ? [limpio, t[1]] : [t[0], limpio]));
  };

  // "Ganó": pone al equipo en el puntaje de la partida. Si el otro también
  // lo tenía, se vacía para que cargue cuántos hizo.
  const marcarGanador = (lado: 0 | 1) => {
    const max = String(puntosPartida);
    setTantos((t) => {
      const otro = t[1 - lado] === max ? "" : t[1 - lado];
      return lado === 0 ? [max, otro] : [otro, max];
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!puedeGuardar || tantosA === null || tantosB === null) return;
    if (!perdidos && afectados) {
      const lista = afectados(tantosA, tantosB);
      if (lista.length > 0) return setPerdidos(lista);
    }
    if (onGuardar(tantosA, tantosB)) onCerrar();
  };

  const filaEquipo = (lado: 0 | 1, nombre: string, color: string) => {
    const gano = tantos[lado] === String(puntosPartida);
    return (
      <div className="flex items-center gap-2">
        <span className={`flex-1 min-w-0 truncate font-semibold ${color}`}>{nombre}</span>
        <button
          type="button"
          onClick={() => marcarGanador(lado)}
          className={`btn btn-sm ${gano ? "btn-success" : "btn-outline"}`}
          aria-pressed={gano}
        >
          <TrophyIcon className="h-4 w-4" /> Ganó
        </button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          aria-label={`Tantos de ${nombre}`}
          placeholder="0"
          value={tantos[lado]}
          onChange={(e) => cambiar(lado, e.target.value)}
          className="input input-bordered w-16 text-center text-xl font-bold"
        />
      </div>
    );
  };

  return (
    <div className="modal modal-open modal-bottom sm:modal-middle" role="dialog" aria-modal="true">
      <form className="modal-box flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <h3 className="font-bold text-lg">{titulo}</h3>
          {subtitulo && <p className="text-sm text-base-content/60">{subtitulo}</p>}
        </div>

        {perdidos ? (
          <div role="alert" className="alert alert-warning flex flex-col items-start text-left text-sm">
            <span className="flex items-center gap-2 font-semibold">
              <ExclamationTriangleIcon className="h-5 w-5" /> Cambia el ganador
            </span>
            <span>
              Estos resultados dependían de este partido y se van a borrar. Esos partidos se vuelven a
              armar con el nuevo ganador:
            </span>
            <ul className="list-disc pl-5">
              {perdidos.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <p className="text-sm text-base-content/70">
              Partida a {puntosPartida}: el ganador llega a {puntosPartida} y el otro queda por debajo.
            </p>
            {filaEquipo(0, nombreA, "text-primary")}
            {filaEquipo(1, nombreB, "text-secondary")}
            {/* Altura fija para que el modal no salte al aparecer el error */}
            <p className="text-sm text-error min-h-5" role="status">
              {error ?? (sinCambios ? "Es el mismo resultado que ya estaba cargado." : "")}
            </p>
          </>
        )}

        <div className="modal-action mt-0">
          {perdidos ? (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setPerdidos(null)}>
                Volver
              </button>
              <button type="submit" className="btn btn-error">
                Corregir igual
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={onCerrar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={!puedeGuardar}>
                Guardar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
