import React, { useEffect, useState } from "react";
import GameOverModal from "../Modals/GameOverModal";
import PlayerInput from "../Players/PlayerInput";
import PlayerModal from "../Players/PlayerModal";
import PlayerTableAndRow from "../Players/PlayerTableAndRow";
import RoundControls from "./RoundControls";
import usePlayers from "../../hooks/usePlayers";
import useGame from "../../hooks/useGame";

function Party() {
  const [currentDealerIndex, setCurrentDealerIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [losingPlayer, setLosingPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlay, setIsPlay] = useState(false);

  const {
    players,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    setPlayers,
  } = usePlayers(isPlay);

  const {
    totalScores,
    roundScoresHistory,
    disqualifiedPlayers,
    loadRound,
    setDisqualifiedPlayers,
    resetGame,
  } = useGame(
    players,
    currentRoundIndex,
    setPlayers,
    setCurrentRoundIndex,
    setRoundScores,
    currentDealerIndex,
    setCurrentDealerIndex,
    isPlay,
    setIsPlay
  );

  useEffect(() => {
    const playerWhoLost = players.find(
      (player) =>
        !disqualifiedPlayers.includes(player.name) &&
        totalScores[player.name] >= 100
    );

    if (playerWhoLost) {
      setLosingPlayer(playerWhoLost.name);
      setIsGameOverModalOpen(true);
    }
  }, [totalScores, players, disqualifiedPlayers]);

  const handleContinueGame = () => {
    setIsGameOverModalOpen(false);
    setDisqualifiedPlayers((prev) => [...prev, losingPlayer]);
  };

  const handleResetGame = () => {
    const confirmReset = window.confirm(
      "¿Estás seguro de que deseas reiniciar la partida? Los puntajes y rondas se perderán."
    );
    if (confirmReset) {
      resetGame();
      setIsPlay(false);
    }
  };

  const openModal = (player) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-base-100 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Anotador
      </h1>
      <div className="flex justify-center items-start">
        <div className="rounded-lg shadow-lg p-4 max-w-lg w-full bg-base-100">
          <PlayerInput
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            addPlayer={addPlayer}
            handleResetGame={handleResetGame}
          />

          {isGameOverModalOpen && (
            <GameOverModal
              losingPlayer={losingPlayer}
              handleContinueGame={handleContinueGame}
              handleEndGame={resetGame} // Usamos resetGame como handleEndGame
            />
          )}

          {players.length > 0 && (
            <>
              <h2 className="text-xl mt-8 mb-4">Ingresar Puntajes</h2>
              <PlayerTableAndRow
                players={players}
                roundScores={roundScores}
                totalScores={totalScores}
                currentDealerIndex={currentDealerIndex}
                setRoundScores={setRoundScores}
                openModal={openModal}
                disqualifiedPlayers={disqualifiedPlayers}
                currentRoundIndex={currentRoundIndex}
              />
              <RoundControls
                loadRound={() => loadRound(roundScores)}
                roundScoresHistory={roundScoresHistory}
                currentRoundIndex={currentRoundIndex}
                setRoundScores={setRoundScores}
                players={players}
                setCurrentRoundIndex={setCurrentRoundIndex}
              />
            </>
          )}

          {isModalOpen && selectedPlayer && (
            <PlayerModal
              selectedPlayer={selectedPlayer}
              closeModal={closeModal}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Party;