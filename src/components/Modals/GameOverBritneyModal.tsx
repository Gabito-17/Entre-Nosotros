"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useUiStore } from "../../stores/useUiStore.ts";

interface GameOverModalProps {
  message?: string; // opcional, si no viene usamos uno por defecto
  handleContinueGame: () => void;
  handleEndGame: () => void;
}

export default function GameOverModal({
  message,
  handleContinueGame,
  handleEndGame,
}: GameOverModalProps) {
  const isOpen = useUiStore((state) => state.isGameOverModalOpen);
  const losingPlayer = useUiStore((state) => state.losingPlayer);
  const closeGameOverModal = useUiStore((state) => state.closeGameOverModal);

  if (!isOpen || !losingPlayer) return null;

  const finalMessage =
    message ??
    `El jugador ${losingPlayer} ha alcanzado el puntaje límite y ha perdido la partida. ¿Qué te gustaría hacer?`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box w-full max-w-md">
        <h2 className="font-bold text-lg flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-error mr-2" />
          ¡Juego terminado!
        </h2>
        <p className="py-4">{finalMessage}</p>
        <div className="modal-action">
          <button
            className="btn btn-error"
            onClick={() => {
              handleEndGame();
              closeGameOverModal();
            }}
          >
            Terminar Juego
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              handleContinueGame();
              closeGameOverModal();
            }}
          >
            Continuar sin {losingPlayer}
          </button>
        </div>
      </div>
    </div>
  );
}
