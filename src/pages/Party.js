import { UserPlusIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

function Anotador() {
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
    <div className="min-h-screen bg-base-100 py-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Anotador
      </h1>
      <div className="flex justify-center items-start">
        <div className="rounded-lg shadow-lg p-4 max-w-lg w-full bg-base-100">
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Jugador"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="input input-bordered w-full max-w-xs"
              onKeyDown={handleKeyDown}
            />

            <button onClick={addPlayer} className="btn btn-primary btn-sm">
              <UserPlusIcon className="h-6 w-6 " />
            </button>
          </div>

          {players.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4 text-center">
                Ingresar Puntajes
              </h2>

              <table className="table table-xs w-full">
                <thead>
                  <tr>
                    <th className="border p-2 text-center">Jugador</th>
                    <th className="border p-2 text-center">
                      Ronda {players[0]?.scores.length + 1}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={index} className="hover">
                      <td className="border p-2 text-center">
                        <p>{player.name}</p>
                      </td>
                      <td className="flex justify-center items-center border p-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={(roundScores[index] || {})[player.name] || ""}
                          onChange={(e) =>
                            handleInputChange(e, index, player.name)
                          }
                          className="input input-bordered w-20"
                        />
                        <button
                          onClick={() => setBritney(index, player.name)}
                          className="btn btn-warning btn-circle ml-2"
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
            <div className="modal modal-open">
              <div className="modal-box">
                <h2 className="font-bold text-lg">
                  {losingPlayer} ha perdido. ¿Quieres seguir jugando?
                </h2>
                <div className="modal-action">
                  <button
                    onClick={handleContinueGame}
                    className="btn btn-success"
                  >
                    Sí
                  </button>
                  <button onClick={handleEndGame} className="btn btn-error">
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          {players.length > 0 && (
            <div className="my-6">
              <h2 className="text-xl font-semibold text-center">
                Historial de Puntajes
              </h2>
              <div className="my-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">{`Total de Jugadores: ${players.length}`}</h3>
                <button onClick={loadRound} className="btn btn-accent">
                  Cargar Ronda
                </button>
              </div>

              <table className="table table-xs w-full">
                <thead>
                  <tr>
                    <th className="border p-2 text-center">Jugador</th>
                    <th className="border p-2 text-center">Última Ronda</th>
                    <th className="border p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, playerIndex) => (
                    <tr key={playerIndex}>
                      <td className="border p-2 text-center">
                        <button
                          onClick={() => openModal(player)}
                          className="btn btn-link text-blue-500 underline"
                        >
                          {player.name}
                        </button>
                      </td>
                      <td className="border p-2 text-center">
                        {player.scores[player.scores.length - 1] || 0}
                      </td>
                      <td className="border p-2 text-center">
                        {totalScores[player.name] || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isModalOpen && selectedPlayer && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h2 className="font-bold text-lg">{`${selectedPlayer.name}'s Score History`}</h2>
                <ul className="list-disc pl-5">
                  {selectedPlayer.scores.map((score, index) => (
                    <li key={index}>
                      Ronda {index + 1}: {score}
                    </li>
                  ))}
                </ul>
                <div className="modal-action">
                  <button onClick={closeModal} className="btn btn-error">
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Anotador;
