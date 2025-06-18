"use client";

import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, KeyboardEvent } from "react";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts";

export default function AddPlayer() {
  const newPlayerName = useGameSessionStore((state) => state.newPlayerName);
  const setNewPlayerName = useGameSessionStore(
    (state) => state.setNewPlayerName
  );
  const addPlayer = useGameSessionStore((state) => state.addPlayer);
  const resetGame = useGameSessionStore((state) => state.resetSession);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(e.target.value);
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
          onClick={resetGame}
          className="btn btn-secondary btn-sm"
          title="Reiniciar juego"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>

        <button
          onClick={addPlayer}
          className="btn btn-primary btn-sm"
          title="Agregar jugador"
        >
          <UserPlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
