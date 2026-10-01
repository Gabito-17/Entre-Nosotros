"use client";

import { ArrowRightIcon, FlagIcon, PlayIcon, PlusIcon, TrashIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fadeUp } from "../../../lib/Animations.ts";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import {
  nombreRondaEliminacion,
  partidosAfectadosPorCorreccion,
} from "../../../utils/torneo/llaveEliminacion.ts";
import { calcularTabla, podioEliminacion, podioLiga } from "../../../utils/torneo/tabla.ts";
import { Partido, Torneo } from "../../../utils/torneo/tipos.ts";
import Toaster from "../../Toaster.tsx";
import EquiposAbm from "../torneo/EquiposAbm.tsx";
import HistorialTorneos from "../torneo/HistorialTorneos.tsx";
import LlaveEliminacion from "../torneo/LlaveEliminacion.tsx";
import Podio from "../torneo/Podio.tsx";
import ResultadoManualModal from "../torneo/ResultadoManualModal.tsx";
import RondasLiga from "../torneo/RondasLiga.tsx";
import TablaPosiciones from "../torneo/TablaPosiciones.tsx";

type Edicion = { partido: Partido; contexto: string; corrigiendo: boolean };

// Torneo en curso: posiciones (liga), rondas con resultados y equipos. Sin
// torneo en curso muestra el inicio con el historial de torneos terminados.
export default function TorneoTrucoPage() {
  const torneo = useTorneoStore((s) => s.torneoActual);
  const abandonarTorneo = useTorneoStore((s) => s.abandonarTorneo);
  const finalizarTorneo = useTorneoStore((s) => s.finalizarTorneo);
  const completo = useTorneoStore((s) => s.estaCompleto());
  const registrarResultado = useTorneoStore((s) => s.registrarResultado);
  const corregirResultado = useTorneoStore((s) => s.corregirResultado);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);
  const partidoTorneo = useGameTrucoStore((s) => s.partidoTorneo);
  const score1 = useGameTrucoStore((s) => s.score1);
  const score2 = useGameTrucoStore((s) => s.score2);
  const iniciarPartidoTorneo = useGameTrucoStore((s) => s.iniciarPartidoTorneo);
  const salirPartidoTorneo = useGameTrucoStore((s) => s.salirPartidoTorneo);
  const navigate = useNavigate();
  const [edicion, setEdicion] = useState<Edicion | null>(null);
  // Torneo que se acaba de finalizar en esta pantalla, para mostrar su podio
  const [terminado, setTerminado] = useState<Torneo | null>(null);

  const nombreEquipo = (id: string | null) =>
    torneo?.equipos.find((e) => e.id === id)?.nombre ?? "A definir";

  const handleAbandonar = () => {
    openConfirmationModal({
      title: "¿Abandonar torneo?",
      message: "Se pierden el fixture y todos los resultados cargados. No se puede deshacer.",
      onConfirm: () => {
        // Si había un partido abierto, se devuelve la partida libre
        if (partidoTorneo) salirPartidoTorneo();
        abandonarTorneo();
      },
    });
  };

  const handleFinalizar = () => {
    if (!torneo) return;
    const podio =
      torneo.formato === "liga"
        ? podioLiga(calcularTabla(torneo.equipos, torneo.rondas))
        : podioEliminacion(torneo.equipos, torneo.rondas);
    const campeon = nombreEquipo(podio?.primero ?? null);
    openConfirmationModal({
      title: "¿Finalizar el torneo?",
      message: `Ganó ${campeon}. Después de finalizar no se pueden corregir resultados ni volver atrás.`,
      actions: [
        {
          label: "Finalizar torneo",
          className: "btn-primary",
          onClick: () => {
            // Un partido ya cargado a mano puede seguir abierto en el anotador
            if (partidoTorneo) salirPartidoTorneo();
            if (finalizarTorneo()) setTerminado(useTorneoStore.getState().historial[0]);
          },
        },
        { label: "Todavía no", className: "btn-ghost" },
      ],
    });
  };

  if (!torneo || torneo.estado !== "en_curso") {
    return (
      <motion.section
        className="py-8 sm:py-16 text-center flex flex-col items-center gap-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        {terminado && (
          <div className="card bg-base-100 shadow-lg p-4 sm:p-6 w-full max-w-2xl flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-primary break-words">¡{terminado.nombre} terminó!</h2>
            <Podio podio={terminado.podio} equipos={terminado.equipos} />
          </div>
        )}
        <TrophyIcon className="h-16 w-16 text-primary" />
        <h1 className="text-3xl font-bold text-primary">Torneo de Truco</h1>
        {torneo ? (
          <>
            <p className="text-lg">
              Tenés <b>{torneo.nombre}</b> en preparación.
            </p>
            <a href="/truco/torneo/nuevo" className="btn btn-primary">
              Seguir configurando <ArrowRightIcon className="h-5 w-5" />
            </a>
          </>
        ) : (
          <>
            <p className="text-lg max-w-md">
              Armá una liga o una eliminación directa, cargá los equipos y usá el anotador en cada partido.
            </p>
            <a href="/truco/torneo/nuevo" className="btn btn-primary">
              <PlusIcon className="h-5 w-5" /> Crear torneo
            </a>
          </>
        )}
        <HistorialTorneos excluirId={terminado?.id} />
        <Toaster />
      </motion.section>
    );
  }

  const esLiga = torneo.formato === "liga";

  // Partido abierto en el anotador que todavía sigue pendiente en este torneo
  const partidoEnCurso =
    partidoTorneo && partidoTorneo.torneoId === torneo.id
      ? torneo.rondas
          .flatMap((r) => r.partidos)
          .find((p) => p.id === partidoTorneo.partidoId && p.estado === "pendiente")
      : undefined;

  const abrirAnotador = (partido: Partido) => {
    const abrir = () => {
      iniciarPartidoTorneo({
        torneoId: torneo.id,
        partidoId: partido.id,
        nombre1: nombreEquipo(partido.equipoA),
        nombre2: nombreEquipo(partido.equipoB),
        maxScore: torneo.puntosPartida,
      });
      navigate("/truco/anotador");
    };

    if (partidoEnCurso && partidoEnCurso.id === partido.id) {
      navigate("/truco/anotador");
    } else if (partidoEnCurso && (score1 > 0 || score2 > 0)) {
      openConfirmationModal({
        title: "¿Cambiar de partido?",
        message: "Tenés otro partido del torneo a medias. Se pierde su avance.",
        onConfirm: abrir,
      });
    } else {
      abrir();
    }
  };

  const acciones = {
    nombre: nombreEquipo,
    onAnotador: abrirAnotador,
    onCargar: (partido: Partido, contexto: string) =>
      setEdicion({ partido, contexto, corrigiendo: false }),
    onCorregir: (partido: Partido, contexto: string) =>
      setEdicion({ partido, contexto, corrigiendo: true }),
  };

  // En eliminación, si la corrección cambia al ganador se pierden los
  // resultados que dependían de él: se listan para pedir confirmación.
  const afectados = (partido: Partido) => (tantosA: number, tantosB: number) => {
    const etapa = new Map(
      torneo.rondas.flatMap((r) =>
        r.partidos.map((p) => [p.id, nombreRondaEliminacion(r.numero, torneo.rondas)] as const)
      )
    );
    return partidosAfectadosPorCorreccion(torneo.rondas, partido.id, tantosA, tantosB).map(
      (p) =>
        `${etapa.get(p.id)}: ${nombreEquipo(p.equipoA)} ${p.tantosA} – ${p.tantosB} ${nombreEquipo(p.equipoB)}`
    );
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary break-words">{torneo.nombre}</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="badge badge-primary">A {torneo.puntosPartida}</span>
            <span className="badge badge-secondary">
              {torneo.formato === "liga" ? "Liga" : "Eliminación directa"}
            </span>
            <span className="badge badge-outline">
              Cruces {torneo.modoCruces === "automatico" ? "por sorteo" : "manuales"}
            </span>
          </div>
        </div>

        {partidoEnCurso && (
          <div role="alert" className="alert alert-info flex-wrap">
            <span className="flex-1 min-w-0">
              Hay un partido en curso: <b>{nombreEquipo(partidoEnCurso.equipoA)}</b> {score1} –{" "}
              {score2} <b>{nombreEquipo(partidoEnCurso.equipoB)}</b>
            </span>
            <button className="btn btn-sm btn-primary" onClick={() => navigate("/truco/anotador")}>
              <PlayIcon className="h-4 w-4" /> Continuar partido en curso
            </button>
          </div>
        )}

        {esLiga && (
          <section className="card bg-base-100 shadow-lg p-3 sm:p-6">
            <h2 className="text-xl font-bold text-secondary mb-3">Posiciones</h2>
            <TablaPosiciones equipos={torneo.equipos} rondas={torneo.rondas} />
          </section>
        )}

        <section className="card bg-base-100 shadow-lg p-3 sm:p-6">
          <h2 className="text-xl font-bold text-secondary mb-3">
            {esLiga ? "Rondas" : "Llave"}
          </h2>
          {esLiga ? (
            <RondasLiga torneo={torneo} {...acciones} />
          ) : (
            <LlaveEliminacion torneo={torneo} {...acciones} />
          )}
        </section>

        <section className="card bg-base-100 shadow-lg p-4 sm:p-6 flex flex-col gap-3">
          <h2 className="text-xl font-bold text-secondary">Finalizar torneo</h2>
          <p className="text-sm text-base-content/70">
            {completo
              ? "Ya se jugó todo. Al finalizar se arma el podio y no se pueden corregir resultados."
              : esLiga
                ? "Se habilita cuando jugaron todos contra todos."
                : "Se habilita cuando se juega la final."}
          </p>
          <button className="btn btn-primary w-full sm:w-auto sm:self-start" disabled={!completo} onClick={handleFinalizar}>
            <FlagIcon className="h-5 w-5" /> Finalizar torneo
          </button>
        </section>

        <section className="card bg-base-100 shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-bold text-secondary mb-4">Equipos</h2>
          <EquiposAbm
            equipos={torneo.equipos}
            jugadoresPorEquipo={torneo.jugadoresPorEquipo}
            bloqueado
          />
        </section>

        <div className="flex justify-start">
          <button className="btn btn-outline btn-error" onClick={handleAbandonar}>
            <TrashIcon className="h-5 w-5" /> Abandonar torneo
          </button>
        </div>

        {edicion && (
          <ResultadoManualModal
            key={edicion.partido.id}
            titulo={edicion.corrigiendo ? "Corregir resultado" : "Cargar resultado"}
            subtitulo={edicion.contexto}
            nombreA={nombreEquipo(edicion.partido.equipoA)}
            nombreB={nombreEquipo(edicion.partido.equipoB)}
            puntosPartida={torneo.puntosPartida}
            inicial={
              edicion.corrigiendo
                ? { tantosA: edicion.partido.tantosA ?? 0, tantosB: edicion.partido.tantosB ?? 0 }
                : undefined
            }
            afectados={edicion.corrigiendo && !esLiga ? afectados(edicion.partido) : undefined}
            onGuardar={(tantosA, tantosB) =>
              edicion.corrigiendo
                ? corregirResultado(edicion.partido.id, tantosA, tantosB)
                : registrarResultado(edicion.partido.id, tantosA, tantosB, "manual")
            }
            onCerrar={() => setEdicion(null)}
          />
        )}

        <Toaster />
      </div>
    </div>
  );
}
