"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { fadeLeft, fadeRight, fadeUp } from "../../lib/Animations.ts";
import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";
import ConfirmationModal from "../Modals/ConfirmationModal.tsx";
import GameOverTrucoModal from "../Modals/GameOverTrucoModal.tsx";
import Toaster from "../Toaster.tsx";
import ConfigurationBar from "./ConfigurationBar.tsx";
import PanelEquipo from "./PanelEquipo.tsx";

export default function TanteadorTruco() {
  const winner = useGameTrucoStore((state) => state.winner);
  const resetScores = useGameTrucoStore((state) => state.resetScores);
  const openGameOverModal = useUiStore((s) => s.openGameOverModal);

  useEffect(() => {
    if (winner) {
      const nombre = winner === "equipo1" ? "NOSOTROS" : "ELLOS";
      openGameOverModal(nombre);
    }
  }, [winner, openGameOverModal]);

  return (
    <div>
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
      <div className="flex flex-row divide-x divide-neutral">
        <motion.div
          className="flex-1"
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
        >
          <PanelEquipo equipo="equipo1" />
        </motion.div>

        <motion.div
          className="flex-1"
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
          handleEndGame={() => resetScores()}
          handleContinueGame={() => resetScores()}
        />
      )}

      <ConfirmationModal />
      <Toaster />
    </div>
  );
}
