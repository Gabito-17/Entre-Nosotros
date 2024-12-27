import React, { useEffect, useState } from "react";
import GameOverModal from "./GameOverModal";
import PlayerInput from "./Players/PlayerInput";
import PlayerModal from "./Players/PlayerModal";
import PlayerTableAndRow from "./Players/PlayerTableAndRow";
import RoundControls from "./RoundControls";

function Party() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [disqualifiedPlayers, setDisqualifiedPlayers] = useState([]);
  const [currentDealerIndex, setCurrentDealerIndex] = useState(0);
  const [roundScoresHistory, setRoundScoresHistory] = useState([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [totalScores, setTotalScores] = useState({});
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [losingPlayer, setLosingPlayer] = useState(null);
  const [isPlay, setIsPlay] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    const maxPlayers = 10;

    const playerExists = players.some(
      (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (trimmedName === "") {
      alert("El nombre del jugador no puede estar vacío.");
    } else if (trimmedName.length > 12) {
      alert("El nombre del jugador puede contener como máximo 12 caracteres.");
    } else if (players.length >= maxPlayers) {
      alert("Se ha alcanzado el máximo de jugadores permitidos.");
    } else if (playerExists) {
      alert("Ya existe un jugador con ese nombre. Elige otro.");
    } else if (isPlay) {
      alert(
        "Esta partida ya está en curso, no se puede añadir un nuevo jugador."
      );
    } else {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { name: trimmedName, scores: [] },
        
      ]);
      setNewPlayerName("");
      setTotalScores((prevScores) => ({ ...prevScores, [trimmedName]: 0 }));
    }
  };

  const handleContinueGame = () => {
    setIsGameOverModalOpen(false);
    setDisqualifiedPlayers((prev) => [...prev, losingPlayer]);
    setIsPlay(true);
  };

  const handleEndGame = () => {
    setPlayers([]);
    setTotalScores({});
    setRoundScores([]);
    setIsPlay(false);
    setIsGameOverModalOpen(false);
    setLosingPlayer(null);
    setDisqualifiedPlayers([]);
    setCurrentDealerIndex(0);
  };

  const handleResetGame = () => {
    const confirmReset = window.confirm(
      "¿Estás seguro de que deseas reiniciar la partida? Los puntajes y rondas se perderán."
    );
    if (confirmReset) {
      resetGame();
    }
  };
  

  const resetGame = () => {
    // Restablece los puntajes totales a 0
    const resetScores = players.reduce((acc, player) => {
      acc[player.name] = 0;
      return acc;
    }, {});
  
    // Restablece los jugadores con puntajes vacíos
    const resetPlayers = players.map((player) => ({
      ...player,
      scores: [],
    }));
  
    setTotalScores(resetScores);
    setPlayers(resetPlayers);
    setRoundScores([]);
    setRoundScoresHistory([]);
    setCurrentRoundIndex(0);
    setDisqualifiedPlayers([]);
    setIsPlay(false);
    setCurrentDealerIndex(0);
  };
  

  const loadRound = () => {
    let hasNegativeTen = false;
    const updatedScores = {};

    players.forEach((player) => {
      updatedScores[player.name] = 0;
    });

    for (let index = 0; index < roundScores.length; index++) {
      const playerName = players[index].name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      if (!Number.isInteger(roundScore) && roundScore !== -10) {
        alert(
          `Número inválido para ${playerName}: debe ser un entero entre 0 y 100 o -10`
        );
        return;
      }

      if (roundScore === -10) {
        if (hasNegativeTen) {
          alert(
            `Solo un jugador puede tener -10 en una ronda. Error en ${playerName}`
          );
          return;
        }
        hasNegativeTen = true;
      } else if (roundScore < 0 || roundScore > 100) {
        alert(
          `Número inválido para ${playerName}: debe ser entre 0 y 100 o -10`
        );
        return;
      }

      updatedScores[playerName] = roundScore;
    }

    if (
      Object.values(updatedScores).filter((score) => score === -10).length > 1
    ) {
      alert(
        "Solo un jugador puede tener -10 en esta ronda. Corrige la entrada."
      );
      return;
    }

    setIsPlay(true);

    setRoundScoresHistory((prev) => {
      const newHistory = [...prev];
      newHistory[currentRoundIndex] = updatedScores;
      return newHistory;
    });

    setTotalScores((prev) => {
      const newTotalScores = { ...prev };
      Object.keys(updatedScores).forEach((playerName) => {
        newTotalScores[playerName] =
          (newTotalScores[playerName] || 0) + updatedScores[playerName];
      });
      return newTotalScores;
    });

    const updatedPlayers = players.map((player) => {
      const playerRoundScore = updatedScores[player.name];
      return {
        ...player,
        scores: [
          ...player.scores,
          playerRoundScore === -10 && hasNegativeTen ? -10 : playerRoundScore,
        ],
      };
    });

    setPlayers(updatedPlayers);
    setRoundScores([]);
    setCurrentRoundIndex((prev) => prev + 1);

    updateDealer();
  };

  const updateDealer = () => {
    const allDisqualified = players.every((player) =>
      disqualifiedPlayers.includes(player.name)
    );

    if (allDisqualified) {
      console.warn("Todos los jugadores están descalificados.");
      return; // Detiene la función si todos están descalificados
    }

    let nextIndex = currentDealerIndex;

    // Avanza al siguiente dealer válido si no es la primera ronda
    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length;
      } while (disqualifiedPlayers.includes(players[nextIndex].name));
    }

    // Actualiza el dealer al siguiente índice válido
    setCurrentDealerIndex(nextIndex);
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
              handleEndGame={handleEndGame}
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
                loadRound={loadRound}
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
