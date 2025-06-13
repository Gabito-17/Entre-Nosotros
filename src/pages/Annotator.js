import { TableCellsIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import RoundControls from "../components/Game/RoundControls";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import GameOverModal from "../components/Modals/GameOverModal";
import PlayerModal from "../components/Modals/PlayerModal";
import TotalScoresModal from "../components/Modals/TotalScoresModal";
import PlayerInput from "../components/Players/PlayerInput";
import PlayerTableAndRow from "../components/Players/PlayerTableAndRow";
import useGame from "../hooks/useGame";
import usePlayers from "../hooks/usePlayers";

function Annotator() {
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });
  const openConfirmationModal = (title, message, onConfirmAction) => {
    setModalConfig({ title, message, onConfirm: onConfirmAction });
    setIsConfirmationModalOpen(true);
  };
  const [losingPlayer, setLosingPlayer] = useState(null);
  const [isTotalScoresModalOpen, setIsTotalScoresModalOpen] = useState(false);

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [currentDealerIndex, setCurrentDealerIndex] = useState(() => {
    const saved = localStorage.getItem("currentDealerIndex");
    return saved ? JSON.parse(saved) : 0;
  });

  const [currentRoundIndex, setCurrentRoundIndex] = useState(() => {
    const saved = localStorage.getItem("currentRoundIndex");
    return saved ? JSON.parse(saved) : 0;
  });

  const [roundScores, setRoundScores] = useState(() => {
    const saved = localStorage.getItem("roundScores");
    return saved ? JSON.parse(saved) : [];
  });

  const [isPlay, setIsPlay] = useState(() => {
    const saved = localStorage.getItem("isPlay");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(
      "currentDealerIndex",
      JSON.stringify(currentDealerIndex)
    );
  }, [currentDealerIndex]);

  useEffect(() => {
    localStorage.setItem(
      "currentRoundIndex",
      JSON.stringify(currentRoundIndex)
    );
  }, [currentRoundIndex]);

  useEffect(() => {
    localStorage.setItem("roundScores", JSON.stringify(roundScores));
  }, [roundScores]);

  useEffect(() => {
    localStorage.setItem("isPlay", JSON.stringify(isPlay));
  }, [isPlay]);

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
    endGame,
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

  const handleEndGame = () => {
    setIsGameOverModalOpen(false);
    setDisqualifiedPlayers((prev) => [...prev, losingPlayer]);
    endGame();
    setIsTotalScoresModalOpen(true);
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
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-secondary">
        Anotador
      </h1>
      <div className="flex justify-center ">
        <div className="rounded-lg shadow-lg p-4 max-w-lg w-full ">
          <PlayerInput
            newPlayerName={newPlayerName}
            setNewPlayerName={setNewPlayerName}
            addPlayer={addPlayer}
            handleResetGame={handleResetGame}
          />
          {isConfirmationModalOpen && (
            <ConfirmationModal
              onClose={() => setIsConfirmationModalOpen(false)}
              onConfirm={modalConfig.onConfirm}
              title={modalConfig.title}
              message={modalConfig.message}
            />
          )}
          {isGameOverModalOpen && (
            <GameOverModal
              losingPlayer={losingPlayer}
              handleContinueGame={handleContinueGame}
              handleEndGame={handleEndGame}
            />
          )}

          {players.length > 0 && (
            <>
              <div className="flex items-center gap-2 mt-2">
                <h2 className="text-xl">Ingresar Puntajes</h2>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsTotalScoresModalOpen(true)}
                >
                  <TableCellsIcon className="w-5 h-5" />
                </button>
              </div>

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

          <TotalScoresModal
            isOpen={isTotalScoresModalOpen}
            onClose={() => {
              setIsTotalScoresModalOpen(false);
              endGame();
            }}
            players={players}
            totalScores={totalScores}
          />
        </div>
      </div>
    </div>
  );
}

export default Annotator;
