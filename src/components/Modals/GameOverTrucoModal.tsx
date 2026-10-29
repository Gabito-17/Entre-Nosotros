"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import { useUiStore } from "../../stores/useUiStore.ts";
// 1. Importa el gif (asegúrate de que la ruta relativa sea la correcta según tu proyecto)
import gohanGif from "../../../public/assets/images/gohan.gif"; 

interface GameOverTrucoModalProps {
  handleContinueGame: () => void;
  handleEndGame: () => void;
  labelAccion?: string;
  labelSeguir?: string;
}

export default function GameOverTrucoModal({
  handleContinueGame,
  handleEndGame,
  labelAccion = "¡Revancha!",
  labelSeguir,
}: GameOverTrucoModalProps) {
  const isOpen = useUiStore((state) => state.isGameOverModalOpen);
  const losingPlayer = useUiStore((state) => state.losingPlayer);
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

        {/* 2. Contenedor para el GIF de Gohan */}
        <div className="my-4 flex justify-center">
          <img 
            src={gohanGif.src || gohanGif} 
            alt="Gohan celebrando" 
            className="w-48 h-auto rounded-lg shadow-md"
          />
        </div>

        <div className="modal-action flex justify-center gap-2">
          {labelSeguir && (
            <button className="btn btn-outline" onClick={closeGameOverModal}>
              {labelSeguir}
            </button>
          )}
          <button
            className="btn btn-error"
            onClick={() => {
              handleEndGame();
              closeGameOverModal();
            }}
          >
            {labelAccion}
          </button>
        </div>
      </div>
    </div>
  );
}

