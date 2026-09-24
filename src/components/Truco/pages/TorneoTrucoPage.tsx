"use client";

import { ArrowRightIcon, PlusIcon, TrashIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";
import { fadeUp } from "../../../lib/Animations.ts";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import {
  nombreRondaEliminacion,
  partidosAfectadosPorCorreccion,
} from "../../../utils/torneo/llaveEliminacion.ts";
import { Partido } from "../../../utils/torneo/tipos.ts";
import Toaster from "../../Toaster.tsx";
import EquiposAbm from "../torneo/EquiposAbm.tsx";
import LlaveEliminacion from "../torneo/LlaveEliminacion.tsx";
import ResultadoManualModal from "../torneo/ResultadoManualModal.tsx";
import RondasLiga from "../torneo/RondasLiga.tsx";

type Edicion = { partido: Partido; contexto: string; corrigiendo: boolean };

// Torneo en curso: rondas con resultados y equipos. La tabla, el podio y el
// historial llegan en F6.
export default function TorneoTrucoPage() {
  const torneo = useTorneoStore((s) => s.torneoActual);
  const abandonarTorneo = useTorneoStore((s) => s.abandonarTorneo);
  const registrarResultado = useTorneoStore((s) => s.registrarResultado);
  const corregirResultado = useTorneoStore((s) => s.corregirResultado);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);
  const [edicion, setEdicion] = useState<Edicion | null>(null);

  const nombreEquipo = (id: string | null) =>
    torneo?.equipos.find((e) => e.id === id)?.nombre ?? "A definir";

  const handleAbandonar = () => {
    openConfirmationModal({
      title: "¿Abandonar torneo?",
      message: "Se pierden el fixture y todos los resultados cargados. No se puede deshacer.",
      onConfirm: abandonarTorneo,
    });
  };

  if (!torneo || torneo.estado !== "en_curso") {
    return (
      <motion.section
        className="py-16 text-center flex flex-col items-center gap-4"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
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
        <Toaster />
      </motion.section>
    );
  }

  const esLiga = torneo.formato === "liga";

  const acciones = {
    nombre: nombreEquipo,
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
