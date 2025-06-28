"use client";

import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, KeyboardEvent } from "react";
import { useGameBritneyStore } from "../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";

export default function AddPlayer() {
  const newPlayerName = useGameBritneyStore((state) => state.newPlayerName);
  const setNewPlayerName = useGameBritneyStore(
    (state) => state.setNewPlayerName
  );
  const addPlayer = useGameBritneyStore((state) => state.addPlayer);
  const resetGame = useGameBritneyStore((state) => state.resetSession);
  const resetScores = useGameBritneyStore((state) => state.resetScores);
  const roundScoresHistory = useGameBritneyStore(
    (state) => state.roundScoresHistory
  );

  const openConfirmationModal = useUiStore(
    (state) => state.openConfirmationModal
  );

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
      openConfirmationModal({
        title: "Estas son horas de llegar?",
        message: "¿Seguro que querés agregar un jugador?",
        onConfirm: () => addPlayer(),
      });
    } else {
      addPlayer();
    }
  };

  const handleResetClick = () => {
    if (isGameInProgress) {
      openConfirmationModal({
        title: "Baaaah que paso pao?",
        message: "¿Querés reiniciar la partida?",
        actions: [
          {
            label: "Misma banda, cuenta nueva",
            className: "btn btn-warning",
            onClick: () => resetScores(),
          },
          {
            label: "Sí, se va todo a la p...",
            className: "btn btn-error",
            onClick: () => resetGame(),
          },
          {
            label: "Cancelar",
            className: "btn btn-secondary",
            onClick: () => {},
          },
        ],
      });
    } else {
      openConfirmationModal({
        title: "Baaaah que paso pao?",
        message: "¿Querés eliminar a todos los jugadores actuales?",
        actions: [
          {
            label: "Eliminar Jugadores",
            className: "btn btn-error",
            onClick: () => resetGame(),
          },
          {
            label: "Cancelar",
            className: "btn btn-secondary",
            onClick: () => {},
          },
        ],
      });
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
    </div>
  );
}
