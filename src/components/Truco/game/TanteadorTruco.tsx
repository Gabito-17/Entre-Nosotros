"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { fadeLeft, fadeRight, fadeUp } from "../../../lib/Animations.ts";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { useTorneoStore } from "../../../stores/useTorneoStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import { nombreRondaEliminacion } from "../../../utils/torneo/llaveEliminacion.ts";
import ConfirmationModal from "../../Modals/ConfirmationModal.tsx";
import GameOverTrucoModal from "../../Modals/GameOverTrucoModal.tsx";
import Toaster from "../../Toaster.tsx";
import ConfigurationBar from "./ConfigurationBar.tsx";
import PanelEquipo from "./PanelEquipo.tsx";

export default function TanteadorTruco() {
  const winner = useGameTrucoStore((state) => state.winner);
  const resetScores = useGameTrucoStore((state) => state.resetScores);
  const nombre1 = useGameTrucoStore((state) => state.nombre1);
  const nombre2 = useGameTrucoStore((state) => state.nombre2);
  const score1 = useGameTrucoStore((state) => state.score1);
  const score2 = useGameTrucoStore((state) => state.score2);
  const partidoTorneo = useGameTrucoStore((state) => state.partidoTorneo);
  const salirPartidoTorneo = useGameTrucoStore((state) => state.salirPartidoTorneo);
  const openGameOverModal = useUiStore((s) => s.openGameOverModal);
  const modalAbierto = useUiStore((s) => s.isGameOverModalOpen);
  const torneoActual = useTorneoStore((s) => s.torneoActual);
  const registrarResultado = useTorneoStore((s) => s.registrarResultado);
  const navigate = useNavigate();

  // Ronda y partido del torneo; null si el contexto quedó viejo (torneo
  // abandonado o partido que ya se jugó a mano).
  const ronda =
    partidoTorneo && torneoActual?.id === partidoTorneo.torneoId
      ? torneoActual.rondas.find((r) =>
          r.partidos.some((p) => p.id === partidoTorneo.partidoId && p.estado === "pendiente")
        )
      : undefined;
  const contextoVigente = !partidoTorneo || !!ronda;

  useEffect(() => {
    if (!contextoVigente) salirPartidoTorneo();
  }, [contextoVigente, salirPartidoTorneo]);

  useEffect(() => {
    if (winner) {
      openGameOverModal(winner === "equipo1" ? nombre1 : nombre2);
    }
  }, [winner, nombre1, nombre2, openGameOverModal]);

  const nombreRonda =
    ronda && torneoActual
      ? torneoActual.formato === "liga"
        ? `Ronda ${ronda.numero}`
        : nombreRondaEliminacion(ronda.numero, torneoActual.rondas)
      : "";

  const handleVolver = () => {
    salirPartidoTorneo();
    navigate("/truco/torneo");
  };

  // Registra el resultado y vuelve al torneo. Si no se pudo registrar, el
  // partido sigue abierto (el store ya avisó el motivo).
  const handleGuardarResultado = () => {
    if (!partidoTorneo) return;
    const ok = registrarResultado(partidoTorneo.partidoId, score1, score2, "anotador");
    if (!ok) return;
    salirPartidoTorneo();
    navigate("/truco/torneo");
  };

  return (
    <div className="w-full flex flex-col gap-4 min-w-0">
      {partidoTorneo && ronda && torneoActual && (
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-primary truncate">{torneoActual.nombre}</p>
            <p className="text-sm text-base-content/70">{nombreRonda}</p>
          </div>
          <button className="btn btn-sm btn-outline flex-nowrap whitespace-nowrap" onClick={handleVolver}>
            <ArrowLeftIcon className="h-4 w-4" /> Volver al torneo
          </button>
        </div>
      )}

      {/* Se cerró el modal con "Seguir anotando" y el marcador sigue con ganador */}
      {partidoTorneo && ronda && winner && !modalAbierto && (
        <button
          className="btn btn-success"
          onClick={() => openGameOverModal(winner === "equipo1" ? nombre1 : nombre2)}
        >
          Terminó el partido · Guardar resultado
        </button>
      )}

      {/* La barra de configuración */}
      <motion.div
        className="relative z-40"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <ConfigurationBar />
      </motion.div>

      {/* Paneles con scores */}
      <div className="grid grid-cols-2 divide-x divide-neutral w-full min-w-0">
        <motion.div
          className="w-full min-w-0"
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
        >
          <PanelEquipo equipo="equipo1" />
        </motion.div>

        <motion.div
          className="w-full min-w-0"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
        >
          <PanelEquipo equipo="equipo2" />
        </motion.div>
      </div>

      {/* Modales */}
      {winner && (
        <GameOverTrucoModal
          handleEndGame={partidoTorneo ? handleGuardarResultado : () => resetScores()}
          handleContinueGame={() => resetScores()}
          labelAccion={partidoTorneo ? "Guardar resultado" : undefined}
          labelSeguir={partidoTorneo ? "Seguir anotando" : undefined}
        />
      )}

      <ConfirmationModal />
      <Toaster />
    </div>
  );
}
