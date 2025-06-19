"use client";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts"; // O la ruta correspondiente
import ConfirmationModal from "../Modals/ConfirmationModal.jsx";

export default function RoundControls() {
  const currentRoundIndex = useGameSessionStore(
    (state) => state.currentRoundIndex
  );
  const confirmRound = useGameSessionStore((state) => state.confirmRound);
  const reverseRound = useGameSessionStore((state) => state.reverseRound);

  const [showReverseRoundConfirm, setShowReverseRoundConfirm] = useState(false);

  const handleReverseRound = () => {
    setShowReverseRoundConfirm(true);
  };

  const handleConfirmReverseRound = () => {
    reverseRound();
    setShowReverseRoundConfirm(false);
  };

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={handleReverseRound}
        className="btn btn-circle btn-sm btn-outline btn-error"
        title="Revertir ronda anterior"
        disabled={currentRoundIndex === 0}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => {
          confirmRound();
        }}
        className="btn btn-circle btn-sm btn-outline btn-success"
        title="Confirmar ronda actual"
      >
        <ArrowUturnRightIcon className="w-5 h-5" />
      </button>

      {showReverseRoundConfirm && (
        <ConfirmationModal
          title="Vo decí che?"
          message="¿Seguro que querés regresar a la ronda anterior?"
          onClose={() => setShowReverseRoundConfirm(false)}
          onConfirm={handleConfirmReverseRound}
          actions={null}
        />
      )}
    </div>
  );
}
