"use client";

import { useState } from "react";
import RoundControls from "../components/Game/RoundControls.jsx";
import PlayerModal from "../components/Modals/PlayerModal.jsx";
import AddPlayer from "../components/Players/AddPlayer.tsx";
import PlayerTable from "../components/Players/PlayerTable.tsx";
import { useGameStore } from "../stores/useGameStore.ts";

export default function Game() {
  const players = useGameStore((state) => state.players);
  const roundScoresHistory = useGameStore((state) => state.roundScoresHistory);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Esta función construye el array con los puntajes del jugador en todas las rondas
  const getScoresForPlayer = (playerName) => {
    return roundScoresHistory.map((round) => round[playerName] ?? 0);
  };

  // Cuando abrimos el modal, le agregamos al jugador el array "scores"
  const openModal = (player) => {
    const scores = getScoresForPlayer(player.name);
    setSelectedPlayer({ ...player, scores });
  };

  const closeModal = () => setSelectedPlayer(null);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="rounded-lg shadow-lg p-4 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-secondary">
          Anotador
        </h1>

        <AddPlayer />

        {players.length > 0 && (
          <div className="mt-4">
            <PlayerTable openModal={openModal} />
            <RoundControls />
          </div>
        )}

        {selectedPlayer && (
          <PlayerModal selectedPlayer={selectedPlayer} closeModal={closeModal} />
        )}
      </div>
    </div>
  );
}
