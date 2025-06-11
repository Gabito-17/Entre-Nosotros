import { useEffect, useState } from "react";
import RoundControls from "../components/Game/RoundControls";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import GameOverModal from "../components/Modals/GameOverModal";
import PlayerInput from "../components/Players/PlayerInput";
import PlayerModal from "../components/Players/PlayerModal";
import PlayerTableAndRow from "../components/Players/PlayerTableAndRow";
import useGame from "../hooks/useGame";
import usePlayers from "../hooks/usePlayers";

function Annotator() {
  const [currentDealerIndex, setCurrentDealerIndex] = useState(0);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const openConfirmationModal = (title, message, onConfirmAction) => {
    setModalConfig({ title, message, onConfirm: onConfirmAction });
    setIsConfirmationModalOpen(true);
  };
  const [losingPlayer, setLosingPlayer] = useState(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isPlay, setIsPlay] = useState(false);

  const {
    players,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    setPlayers,
    removePlayer,
  } = usePlayers(isPlay);

  const {
    totalScores,
    setTotalScores,
    roundScoresHistory,
    setRoundScoresHistory,
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

  const handleRemovePlayer = (playerName) => {
    openConfirmationModal(
      "Eliminar Jugador",
      `¿Estás seguro de que quieres eliminar a ${playerName}?`,
      () => {
        removePlayer(playerName);
        setIsConfirmationModalOpen(false);
      }
    );
  };

  const handleContinueGame = () => {
    setIsGameOverModalOpen(false);
    setDisqualifiedPlayers((prev) => [...prev, losingPlayer]);
  };

  const handleResetGame = () => {
    openConfirmationModal(
      "Reiniciar Partida",
      "¿Estás seguro de que deseas reiniciar la partida? Los puntajes y rondas se perderán.",
      () => {
        resetGame();
        setIsPlay(false);
        setIsConfirmationModalOpen(false);
      }
    );
  };

  const openModal = (player) => {
    setSelectedPlayer(player);
    setIsPlayerModalOpen(true);
  };

  const closeModal = () => {
    setIsPlayerModalOpen(false);
    setSelectedPlayer(null);
  };

  return (
    <div className="min-h-screen bg-base-100">
      <h1 className="text-4xl font-bold text-center mb-8 text-secondary">
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
          {isConfirmationModalOpen && (
            <ConfirmationModal
              onClose={() => setIsConfirmationModalOpen(false)}
              onConfirm={modalConfig.onConfirm} // ✅ Ahora sí usa la acción correcta
              title={modalConfig.title}
              message={modalConfig.message}
            />
          )}
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
                handleRemovePlayer={(playerName) =>
                  handleRemovePlayer(playerName)
                }
              />
              <RoundControls
                loadRound={() => loadRound(roundScores)}
                roundScoresHistory={roundScoresHistory}
                currentRoundIndex={currentRoundIndex}
                setRoundScores={setRoundScores}
                players={players}
                setCurrentRoundIndex={setCurrentRoundIndex}
                setTotalScores={setTotalScores}
                setRoundScoresHistory={setRoundScoresHistory}
                setPlayers={setPlayers}
              />
            </>
          )}

          {isPlayerModalOpen && selectedPlayer && (
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

export default Annotator;
