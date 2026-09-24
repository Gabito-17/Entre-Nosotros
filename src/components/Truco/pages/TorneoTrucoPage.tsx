"use client";

import { ArrowRightIcon, PlusIcon, TrashIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { fadeUp } from "../../../lib/Animations.ts";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import Toaster from "../../Toaster.tsx";
import EquiposAbm from "../torneo/EquiposAbm.tsx";

// Versión mínima para F3: muestra el estado del torneo y deja editar nombres.
// El fixture con resultados, la tabla, el podio y el historial llegan en F4-F6.
export default function TorneoTrucoPage() {
  const torneo = useTorneoStore((s) => s.torneoActual);
  const abandonarTorneo = useTorneoStore((s) => s.abandonarTorneo);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);

  const nombreEquipo = (id: string | null) =>
    torneo?.equipos.find((e) => e.id === id)?.nombre ?? "A definir";

  const handleAbandonar = () => {
    openConfirmationModal({
      title: "¿Abandonar torneo?",
      message: "Se pierden el fixture y los resultados cargados.",
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

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">{torneo.nombre}</h1>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="badge badge-primary">A {torneo.puntosPartida}</span>
            <span className="badge badge-secondary">
              {torneo.formato === "liga" ? "Liga" : "Eliminación directa"}
            </span>
          </div>
        </div>

        <section className="card bg-base-100 shadow-lg p-4 sm:p-6">
          <h2 className="text-xl font-bold text-secondary mb-4">Rondas</h2>
          {torneo.rondas.length === 0 ? (
            <p className="text-base-content/60">Todavía no hay rondas armadas.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {torneo.rondas.map((ronda) => (
                <div key={ronda.numero}>
                  <h3 className="font-semibold mb-1">Ronda {ronda.numero}</h3>
                  <ul className="flex flex-col gap-1">
                    {ronda.partidos.map((p) => (
                      <li key={p.id} className="rounded-box bg-base-200 px-3 py-1 text-sm">
                        {p.estado === "pase_libre"
                          ? `${nombreEquipo(p.equipoA)} · pase libre`
                          : `${nombreEquipo(p.equipoA)} vs ${nombreEquipo(p.equipoB)}`}
                      </li>
                    ))}
                    {ronda.equipoLibre && (
                      <li className="px-3 text-sm text-base-content/60">
                        Libre: {nombreEquipo(ronda.equipoLibre)}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
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

        <Toaster />
      </div>
    </div>
  );
}
