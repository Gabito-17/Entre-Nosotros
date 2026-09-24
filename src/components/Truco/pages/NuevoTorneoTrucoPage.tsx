"use client";

import {
  ExclamationTriangleIcon,
  PencilSquareIcon,
  PlayIcon,
  TrashIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fadeUp } from "../../../lib/Animations.ts";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import Toaster from "../../Toaster.tsx";
import ConfigTorneoForm from "../torneo/ConfigTorneoForm.tsx";
import CrucesManualesEditor, {
  SELECCION_VACIA,
  SeleccionCruces,
} from "../torneo/CrucesManualesEditor.tsx";
import EquiposAbm from "../torneo/EquiposAbm.tsx";
import { equiposQueNoCumplen } from "../../../utils/torneo/equipos.ts";

const Seccion = ({ titulo, children, accion }: { titulo: string; children: ReactNode; accion?: ReactNode }) => (
  <motion.section
    className="card bg-base-100 shadow-lg p-4 sm:p-6"
    variants={fadeUp}
    initial="hidden"
    animate="visible"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold text-secondary">{titulo}</h2>
      {accion}
    </div>
    {children}
  </motion.section>
);

export default function NuevoTorneoTrucoPage() {
  const torneo = useTorneoStore((s) => s.torneoActual);
  const crearTorneo = useTorneoStore((s) => s.crearTorneo);
  const actualizarConfig = useTorneoStore((s) => s.actualizarConfig);
  const iniciarTorneo = useTorneoStore((s) => s.iniciarTorneo);
  const abandonarTorneo = useTorneoStore((s) => s.abandonarTorneo);
  const openConfirmationModal = useUiStore((s) => s.openConfirmationModal);
  const navigate = useNavigate();

  const [editandoConfig, setEditandoConfig] = useState(false);
  const [seleccion, setSeleccion] = useState<SeleccionCruces>(SELECCION_VACIA);

  const formato = torneo?.formato;
  const equipos = torneo?.equipos ?? [];
  const incompletos = torneo ? equiposQueNoCumplen(equipos, torneo.jugadoresPorEquipo).length : 0;

  // Los cruces armados no sirven si cambia el formato
  useEffect(() => setSeleccion(SELECCION_VACIA), [formato]);

  if (torneo?.estado === "en_curso") return <Navigate to="/truco/torneo" replace />;

  // Si se borró un equipo, se descartan los cruces donde aparecía
  const ids = new Set(equipos.map((e) => e.id));
  const seleccionVigente: SeleccionCruces = {
    cruces: seleccion.cruces.filter(([a, b]) => ids.has(a) && ids.has(b)),
    pasesLibres: seleccion.pasesLibres.filter((id) => ids.has(id)),
  };

  const handleIniciar = () => {
    const manual = torneo?.modoCruces === "manual";
    if (iniciarTorneo(manual ? seleccionVigente : undefined)) navigate("/truco/torneo");
  };

  const handleDescartar = () => {
    openConfirmationModal({
      title: "¿Descartar torneo?",
      message: "Se pierden la configuración y los equipos cargados.",
      onConfirm: () => {
        abandonarTorneo();
        setEditandoConfig(false);
        setSeleccion(SELECCION_VACIA);
      },
    });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-2xl w-full flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-center text-primary flex items-center justify-center gap-2">
          <TrophyIcon className="h-9 w-9" /> Nuevo torneo
        </h1>

        {!torneo ? (
          <Seccion titulo="Configuración">
            <ConfigTorneoForm textoBoton="Crear y cargar equipos" onGuardar={crearTorneo} />
          </Seccion>
        ) : (
          <>
            <Seccion
              titulo="Configuración"
              accion={
                !editandoConfig && (
                  <button
                    className="btn btn-sm btn-ghost"
                    onClick={() => setEditandoConfig(true)}
                    title="Editar configuración"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>
                )
              }
            >
              {editandoConfig ? (
                <ConfigTorneoForm
                  inicial={{
                    nombre: torneo.nombre,
                    formato: torneo.formato,
                    modoCruces: torneo.modoCruces,
                    puntosPartida: torneo.puntosPartida,
                    jugadoresPorEquipo: torneo.jugadoresPorEquipo,
                  }}
                  textoBoton="Guardar"
                  onCancelar={() => setEditandoConfig(false)}
                  onGuardar={(config) => {
                    const ok = actualizarConfig(config);
                    if (ok) setEditandoConfig(false);
                    return ok;
                  }}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-2xl font-semibold">{torneo.nombre}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="badge badge-primary">A {torneo.puntosPartida}</span>
                    <span className="badge badge-accent">
                      {torneo.jugadoresPorEquipo}{" "}
                      {torneo.jugadoresPorEquipo === 1 ? "jugador" : "jugadores"} por equipo
                    </span>
                    <span className="badge badge-secondary">
                      {torneo.formato === "liga" ? "Liga" : "Eliminación directa"}
                    </span>
                    <span className="badge badge-outline">
                      Cruces {torneo.modoCruces === "automatico" ? "por sorteo" : "manuales"}
                    </span>
                  </div>
                </div>
              )}
            </Seccion>

            <Seccion titulo={`Equipos (${equipos.length})`}>
              <EquiposAbm equipos={equipos} jugadoresPorEquipo={torneo.jugadoresPorEquipo} />
            </Seccion>

            {torneo.modoCruces === "manual" && equipos.length >= 2 && (
              <Seccion titulo="Cruces de la primera ronda">
                <CrucesManualesEditor
                  equipos={equipos}
                  formato={torneo.formato}
                  seleccion={seleccionVigente}
                  onChange={setSeleccion}
                />
              </Seccion>
            )}

            {incompletos > 0 && (
              <div role="alert" className="alert alert-warning text-sm">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>
                  {incompletos === 1 ? "Hay 1 equipo" : `Hay ${incompletos} equipos`} que no tienen{" "}
                  {torneo.jugadoresPorEquipo}{" "}
                  {torneo.jugadoresPorEquipo === 1 ? "jugador" : "jugadores"}. Corregilos para poder iniciar.
                </span>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2">
              <button className="btn btn-outline btn-error" onClick={handleDescartar}>
                <TrashIcon className="h-5 w-5" /> Descartar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleIniciar}
                disabled={equipos.length < 2 || incompletos > 0 || editandoConfig}
              >
                <PlayIcon className="h-5 w-5" /> Iniciar torneo
              </button>
            </div>
          </>
        )}

        <Toaster />
      </div>
    </div>
  );
}
