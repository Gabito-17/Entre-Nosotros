"use client";

import RoundControls from "../components/Game/RoundControls";
import PlayerModal from "../components/Modals/PlayerModal";
import TotalScoresModal from "../components/Modals/TotalScoresModal";
import AddPlayer from "../components/Players/AddPlayer.tsx";
import PlayerTable from "../components/Players/PlayerTable.tsx";

import { useGameSessionStore } from "../stores/useGameSessionStore.ts";
import { useUiStore } from "../stores/useUiStore.ts";

export default function Game() {
  const players = useGameSessionStore((state) => state.players);
  const roundScoresHistory = useGameSessionStore(
    (state) => state.roundScoresHistory
  );

  const setSelectedPlayer = useUiStore((state) => state.setSelectedPlayer);

  const openModal = (player: { name: string }) => {
    const scores = roundScoresHistory.map((round) => round[player.name] ?? 0);
    setSelectedPlayer({ ...player, scores });
  };

  return (
    <div className="min-h-screen flex justify-center items-start">
      <div className="rounded-lg shadow-lg p-4 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-secondary">
          Anotador
        </h1>

        <AddPlayer />
        {players.length > 0 && (
          <>
            <div className="mt-2">
              <PlayerTable openModal={openModal} />
            </div>

            <RoundControls />
          </>
        )}

        <PlayerModal />
        <TotalScoresModal />
      </div>
    </div>
  );
}
