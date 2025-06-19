"use client";

import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, KeyboardEvent, useState } from "react";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts";
import ConfirmationModal from "../Modals/ConfirmationModal.jsx";

export default function AddPlayer() {
  const newPlayerName = useGameSessionStore((state) => state.newPlayerName);
  const setNewPlayerName = useGameSessionStore(
    (state) => state.setNewPlayerName
  );
  const addPlayer = useGameSessionStore((state) => state.addPlayer);
  const resetGame = useGameSessionStore((state) => state.resetSession);
  const resetScores = useGameSessionStore((state) => state.resetScores);
  const roundScoresHistory = useGameSessionStore(
    (state) => state.roundScoresHistory
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Helper: check if game is in progress (at least one round or scores entered)
  const isGameInProgress = roundScoresHistory.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(e.target.value);
  };

  const handleAddPlayer = () => {
    if (isGameInProgress) {
      setShowConfirm(true);
    } else {
      addPlayer();
    }
  };

  const handleConfirmAddPlayer = async () => {
    addPlayer();
    setShowConfirm(false);
  };

  const handleResetClick = () => {
    if (isGameInProgress) {
      setShowResetConfirm(true);
    } else {
      resetGame();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 rounded-box">
      <input
        type="text"
        placeholder="Nombre del jugador"
        value={newPlayerName}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="input input-bordered w-full sm:max-w-xs flex-1"
      />
      <div className="flex flex-wrap items-center gap-2 rounded-box justify-end">
        <button
          onClick={handleResetClick}
          className="btn btn-secondary btn-sm"
          title="Reiniciar partida"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>

        <button
          onClick={handleAddPlayer}
          className="btn btn-primary btn-sm"
          title="Agregar jugador"
        >
          <UserPlusIcon className="h-5 w-5" />
        </button>
      </div>
      {showConfirm && (
        <ConfirmationModal
          title="Estas son horas de llegar?"
          message={`¿Seguro que querés agregar un jugador?`}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleConfirmAddPlayer}
          actions={{}}
        />
      )}
      {showResetConfirm && (
        <ConfirmationModal
          title="Baaaah que paso pao?"
          message="¿Querés reiniciar la partida?"
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {}}
          actions={[
            {
              label: "Misma banda, cuenta nueva",
              className: "btn btn-warning",
              onClick: () => {
                resetScores();
                setShowResetConfirm(false);
              },
            },
            {
              label: "Sí, se va todo a la p...",
              className: "btn btn-error",
              onClick: () => {
                resetGame();
                setShowResetConfirm(false);
              },
            },
            {
              label: "Cancelar",
              className: "btn btn-secondary",
              onClick: () => setShowResetConfirm(false),
            },
          ]}
        />
      )}
    </div>
  );
}
