import React, { useEffect, useState } from "react";
import GameOverModal from "./GameOverModal";
import PlayerInput from "./PlayerInput";
import PlayerModal from "./PlayerModal";
import PlayerTable from "./PlayerTable";
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

  // Lógica para verificar si un jugador ha perdido
  useEffect(() => {
    players
      .filter((player) => !disqualifiedPlayers.includes(player.name))
      .forEach((player) => {
        if (totalScores[player.name] >= 100) {
          setLosingPlayer(player.name);
          setIsGameOverModalOpen(true);
        }
      });
  }, [totalScores, players, disqualifiedPlayers]);

  // Función para añadir jugadores
  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    const maxPlayers = 10;

    // Verificar si ya existe un jugador con el mismo nombre
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
        { name: trimmedName, scores: [] },
        ...prevPlayers,
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

  const loadRound = () => {
    let hasNegativeTen = false;

    // Inicializa los puntajes de la ronda, asegurando que todos los jugadores tengan un puntaje
    const updatedScores = {};
    players.forEach((player) => {
      updatedScores[player.name] = 0; // Inicializa el puntaje a 0
    });

    // Validación: Recorrer primero todos los puntajes y asegurarse de que son válidos
    for (let index = 0; index < roundScores.length; index++) {
      const playerName = players[index].name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      // Validación: Asegurarse de que el valor sea un entero entre 0 y 100, o solo un -10
      if (!Number.isInteger(roundScore) && roundScore !== -10) {
        alert(
          `Número inválido para ${playerName}: debe ser un entero entre 0 y 100 o -10`
        );
        return; // Salir de la función si el valor no es válido
      }

      if (roundScore === -10) {
        if (hasNegativeTen) {
          alert(
            `Solo un jugador puede tener -10 en una ronda. Error en ${playerName}`
          );
          return; // Salir de la función si ya hay un -10 registrado
        }
        hasNegativeTen = true; // Marcar que ya se usó el -10
      } else if (roundScore < 0 || roundScore > 100) {
        alert(
          `Número inválido para ${playerName}: debe ser entre 0 y 100 o -10`
        );
        return; // Salir de la función si el número no es válido
      }

      // Copia el puntaje válido al objeto de puntajes actualizados
      updatedScores[playerName] = roundScore;
    }

    // Verifica cuántos jugadores tienen -10
    const playersWithNegativeTen = Object.values(updatedScores).filter(
      (score) => score === -10
    );

    if (playersWithNegativeTen.length > 1) {
      alert(
        "Solo un jugador puede tener -10 en esta ronda. Corrige la entrada."
      );
      return; // Salir de la función para evitar la carga de la ronda
    }

    setIsPlay(true);

    // Actualiza el historial de puntajes
    setRoundScoresHistory((prev) => {
      const newHistory = [...prev];
      newHistory[currentRoundIndex] = updatedScores; // Reemplaza la ronda actual
      return newHistory;
    });

    // Actualiza la totalScores
    setTotalScores((prev) => {
      const newTotalScores = { ...prev };
      Object.keys(updatedScores).forEach((playerName) => {
        newTotalScores[playerName] =
          (newTotalScores[playerName] || 0) + updatedScores[playerName];
      });
      return newTotalScores;
    });

    // Actualiza la lista de jugadores
    const updatedPlayers = players.map((player) => {
      const playerRoundScore = updatedScores[player.name];
      return {
        ...player,
        scores: [
          ...player.scores,
          playerRoundScore === -10 && playersWithNegativeTen.length === 0
            ? -10
            : playerRoundScore,
        ],
      };
    });

    setPlayers(updatedPlayers);
    setRoundScores([]); // Reinicia los puntajes de la ronda
    setCurrentDealerIndex((prevIndex) => (prevIndex + 1) % players.length);
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
              <PlayerTable
                players={players}
                roundScores={roundScores}
                totalScores={totalScores}
                currentDealerIndex={currentDealerIndex}
                setRoundScores={setRoundScores}
                loadRound={loadRound}
                openModal={openModal}
                disqualifiedPlayers={disqualifiedPlayers} // Pasa disqualifiedPlayers a PlayerTable
                currentRoundIndex={currentDealerIndex}
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
