import React, { useEffect, useState } from "react";

function Party() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [roundScores, setRoundScores] = useState([]);
  const [totalScores, setTotalScores] = useState({});

  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [losingPlayer, setLosingPlayer] = useState(null); // Guardar el jugador que ha perdido

  const [isPlay, setIsPlay] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    Object.keys(totalScores).forEach((playerName) => {
      if (totalScores[playerName] >= 100) {
        setLosingPlayer(playerName); // Guardar el jugador que ha perdido
        setIsGameOverModalOpen(true); // Abrir el modal
      }
    });
  }, [totalScores]);

  const addPlayer = () => {
    if (newPlayerName.trim() !== "") {
      if (isPlay) {
        alert("Esta Partida ya está en curso");
      } else {
        setPlayers([{ name: newPlayerName, scores: [] }, ...players]);
        setNewPlayerName("");
        setTotalScores((prev) => ({ ...prev, [newPlayerName]: 0 }));
      }
    }
  };

  const handleContinueGame = () => {
    // Cerrar el modal
    setIsGameOverModalOpen(false);

    // Eliminar el jugador que ha perdido
    setPlayers((prevPlayers) =>
      prevPlayers.filter((player) => player.name !== losingPlayer)
    );

    // Eliminar el puntaje acumulado de ese jugador
    setTotalScores((prevTotalScores) => {
      const newScores = { ...prevTotalScores };
      delete newScores[losingPlayer];
      return newScores;
    });

    // Limpiar el jugador perdedor
    setLosingPlayer(null);
  };

  const handleEndGame = () => {
    // Puedes reiniciar el juego, redirigir a otra página, etc.
    setPlayers([]); // O reiniciar el estado de jugadores
    setTotalScores({});
    setRoundScores([]);
    setIsGameOverModalOpen(false);
    setLosingPlayer(null);
  };

  const handleInputChange = (e, index, playerName) => {
    const value = Number(e.target.value);
    setRoundScores((prev) => {
      const newScores = [...prev];
      newScores[index] = { ...newScores[index], [playerName]: value };
      return newScores;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  const loadRound = () => {
    if (!isPlay) {
      setIsPlay(true);
    }
    let hasNegativeTen = false; // Para rastrear si ya se ha utilizado el -10

    // Validación: Recorrer primero todos los puntajes y asegurarse de que son válidos
    for (let index = 0; index < roundScores.length; index++) {
      const playerName = players[index].name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      // Validación: permitir números entre 0 y 100, o solo un -10
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
    }

    // Si todas las validaciones pasaron, ahora sí actualizamos los puntajes
    const newPlayers = [...players];

    for (let index = 0; index < roundScores.length; index++) {
      const playerName = players[index].name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      // Añadir el puntaje al jugador
      newPlayers[index].scores.push(roundScore);
      setTotalScores((prev) => ({
        ...prev,
        [playerName]: (prev[playerName] || 0) + roundScore,
      }));
    }

    // Actualizar el estado de jugadores y limpiar los puntajes de la ronda
    setPlayers(newPlayers);
    setRoundScores([]);
  };

  const setBritney = (index, playerName) => {
    setRoundScores((prev) => {
      const newScores = [...prev];
      newScores[index] = { ...newScores[index], [playerName]: -10 };
      return newScores;
    });
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
    <div className="rounded-lg shadow-lg p-4 w-full max-w-lg border">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Jugador"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded"
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={addPlayer}
          className="font-bold font-serif mb-2 bg-blue-700 text-center text-white p-1 rounded"
        >
          Add Player
        </button>
      </div>
      {players.length > 0 && (
        <div className="mt-2">
          <h2 className="text-xl font-semibold mb-2">Scores Input</h2>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Player</th>
                <th className="border p-2">
                  Round {players[0]?.scores.length + 1}
                </th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index}>
                  <td className="border p-2">
                    <button
                      onClick={() => openModal(player)}
                      className="font-bold font-serif  text-blue-950 underline border-2 rounded-md bg-blue-300 pr-2 pl-2"
                    >
                      {player.name}
                    </button>
                  </td>
                  <td className="border p-2 flex justify-between">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={(roundScores[index] || {})[player.name] || ""}
                      onChange={(e) => handleInputChange(e, index, player.name)}
                      className="w-full p-1 border border-gray-300 rounded"
                    />
                    <button
                      onClick={() => setBritney(index, player.name)}
                      className="font-bold font-serif ml-2 bg-yellow-400 text-yellow-800 p-1 rounded"
                    >
                      -10
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isGameOverModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {losingPlayer} ha perdido. ¿Seguirán jugando?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => handleContinueGame()}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Sí
              </button>
              <button
                onClick={() => handleEndGame()}
                className="bg-red-500 text-white p-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isGameOverModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {losingPlayer} ha perdido. ¿Quieres seguir jugando?
            </h2>
            <div className="flex justify-end">
              <button
                onClick={() => handleContinueGame()}
                className="bg-green-500 text-white p-2 rounded mr-2"
              >
                Sí
              </button>
              <button
                onClick={() => handleEndGame()}
                className="bg-red-500 text-white p-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {players.length > 0 && (
        <div className="my-4">
          <h2 className="text-xl font-semibold">Score History</h2>
          <div className="my-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{`Players Count: ${players.length}`}</h3>
              <button
                onClick={loadRound}
                className="font-bold font-serif bg-green-500 text-white p-2 rounded"
              >
                Load Round
              </button>
            </div>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Player</th>
                <th className="border p-2">Last Round</th>
                <th className="border p-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, playerIndex) => (
                <tr key={playerIndex}>
                  <td className="border p-2">
                    <button
                      onClick={() => openModal(player)}
                      className="font-bold font-serif  text-blue-950 underline border-2 rounded-md bg-blue-300 pr-2 pl-2"
                    >
                      {player.name}
                    </button>
                  </td>
                  <td className="border p-2">
                    {player.scores[player.scores.length - 1] || 0}
                  </td>
                  <td className="border p-2">
                    {totalScores[player.name] || 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isModalOpen && selectedPlayer && (
        <PlayerHistoryModal player={selectedPlayer} onClose={closeModal} />
      )}
    </div>
  );
}

const PlayerHistoryModal = ({ player, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{`${player.name}'s Score History`}</h2>
        <ul className="list-disc pl-5">
          {player.scores.map((score, index) => (
            <li key={index}>
              Round {index + 1}: {score}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white p-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Party;
