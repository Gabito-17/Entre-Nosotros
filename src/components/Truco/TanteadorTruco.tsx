"use client";

import { useEffect } from "react";
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
  }, [winner]);

 return (
    <div className="flex flex-col h-[100dvh] bg-base-200 pt-16 overflow-hidden">
      {/* La barra de configuración */}
      <div className="relative z-50">
        <ConfigurationBar />
      </div>

      {/* Paneles con scores */}
      <div className="flex flex-row flex-1 divide-x divide-neutral">
        <PanelEquipo equipo="equipo1" nombre="NOSOTROS" />
        <PanelEquipo equipo="equipo2" nombre="ELLOS" />
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
