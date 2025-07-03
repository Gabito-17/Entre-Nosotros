"use client";

import RoundControls from "../components/Britney/Game/RoundControls.jsx";
import AddPlayer from "../components/Britney/Players/AddPlayer.tsx";
import PlayerTableAndRow from "../components/Britney/Players/PlayerTableAndRow.tsx";
import ConfirmationModal from "../components/Modals/ConfirmationModal.tsx";
import GameOverModal from "../components/Modals/GameOverBritneyModal.tsx";
import PlayerModal from "../components/Modals/PlayerModal.jsx";
import TotalScoresModal from "../components/Modals/TotalScoresModal.jsx";
import Toaster from "../components/Toaster.tsx";
import { useGameBritneyStore } from "../stores/useGameBritneyStore.ts";
import { useUiStore } from "../stores/useUiStore.ts";

export default function Game() {
  const players = useGameBritneyStore((state) => state.players);
  const roundScoresHistory = useGameBritneyStore(
    (state) => state.roundScoresHistory
  );
  const resetSession = useGameBritneyStore((state) => state.resetSession);

  const setSelectedPlayer = useUiStore((state) => state.setSelectedPlayer);

  const openModal = (player: { name: string }) => {
    const scores = roundScoresHistory.map((round) => round[player.name] ?? 0);
    setSelectedPlayer({ ...player, scores });
  };

  const handleContinueGame = () => {
    useUiStore.getState().popDisqualificationQueue();
  };

  const handleEndGame = () => {
    resetSession();
  };

  return (
    <div className="flex justify-center">
      <div className="rounded-lg shadow-lg p-4 max-w-lg w-full">
        <h1 className="text-4xl font-bold text-center mb-8 text-secondary">
          Britney
        </h1>
        <AddPlayer />
        {players.length > 0 && (
          <>
            <PlayerTableAndRow openModal={openModal} />

            <RoundControls />
          </>
        )}
        <PlayerModal />
        <TotalScoresModal />
        <GameOverModal
          handleContinueGame={handleContinueGame}
          handleEndGame={handleEndGame}
        />
        <ConfirmationModal />
        <Toaster />
      </div>
    </div>
  );
}
