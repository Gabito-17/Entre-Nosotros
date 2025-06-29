"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import { useUiStore } from "../../stores/useUiStore.ts";

interface GameOverTrucoModalProps {
  handleContinueGame: () => void;
  handleEndGame: () => void;
}

export default function GameOverTrucoModal({
  handleContinueGame,
  handleEndGame,
}: GameOverTrucoModalProps) {
  const isOpen = useUiStore((state) => state.isGameOverModalOpen);
  const losingPlayer = useUiStore((state) => state.losingPlayer); // En este contexto, lo usamos para mostrar el ganador
  const closeGameOverModal = useUiStore((state) => state.closeGameOverModal);

  if (!isOpen || !losingPlayer) return null;

  const equipoGanador = losingPlayer;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box w-full max-w-md text-center">
        <h2 className="font-bold text-xl text-success mb-4 flex items-center justify-center gap-2">
          <TrophyIcon className="h-6 w-6 text-yellow-500" />
          ¡Ganó {equipoGanador}!
        </h2>
        <p className="py-2">
          El equipo <strong>{equipoGanador}</strong> alcanzó el puntaje máximo y
          ha ganado la partida.
        </p>
        <div className="modal-action flex justify-center gap-2">
          <button
            className="btn btn-error"
            onClick={() => {
              handleEndGame();
              closeGameOverModal();
            }}
          >
            ¡Revancha!
          </button>
        </div>
      </div>
    </div>
  );
}
