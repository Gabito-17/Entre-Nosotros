import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  UserGroupIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

function Anotador() {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [disqualifiedPlayers, setDisqualifiedPlayers] = useState([]);
  const [currentDealerIndex, setCurrentDealerIndex] = useState(0);

  const [roundScores, setRoundScores] = useState([]);
  const [totalScores, setTotalScores] = useState({});

  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState(false);
  const [losingPlayer, setLosingPlayer] = useState(null);

  const [isPlay, setIsPlay] = useState(false);

  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    players
      .filter((player) => !disqualifiedPlayers.includes(player.name))
      .forEach((player) => {
        if (totalScores[player.name] >= 100) {
          setLosingPlayer(player.name); // Guardar el jugador que ha perdido
          setIsGameOverModalOpen(true); // Abrir el modal
        }
      });
  }, [totalScores, players, disqualifiedPlayers]);

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim(); // Elimina espacios en blanco innecesarios
    const maxPlayers = 10; // Define un límite máximo de jugadores

    if (
      trimmedName !== "" &&
      players.length < maxPlayers &&
      newPlayerName.length <= 12
    ) {
      if (isPlay) {
        // Aquí podrías usar una mejor notificación, como un modal o snackbar
        alert(
          "Esta Partida ya está en curso, NO se puede añadir un nuevo jugador. Si desea añadir un nuevo jugador, finalice la partida."
        );
      } else {
        setPlayers((prevPlayers) => [
          { name: trimmedName, scores: [] },
          ...prevPlayers,
        ]);
        setNewPlayerName(""); // Resetea el campo del nombre
        setTotalScores((prevScores) => ({ ...prevScores, [trimmedName]: 0 }));
      }
    } else if (players.length >= maxPlayers) {
      // Si alcanzas el límite de jugadores
      alert("Se ha alcanzado el máximo de jugadores permitidos.");
    } else if (trimmedName === "") {
      // Si el nombre está vacío o es inválido
      alert("El nombre del jugador no puede estar vacío.");
    } else if (newPlayerName.length > 12) {
      alert("El nombre del jugador puede contener como máximo 12 caracteres.");
    }
  };

  const handleContinueGame = (losingPlayer) => {
    // Cerrar el modal
    setIsGameOverModalOpen(false);

    // Añadir el jugador a la lista de descalificados
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
    const newPlayers = players.map((player, index) => {
      const playerName = player.name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      return {
        ...player,
        // Crear una copia del array de puntajes antes de agregar el nuevo puntaje
        scores: [...player.scores, roundScore],
      };
    });

    // Actualizar el estado de totalScores
    setTotalScores((prev) => {
      const newTotalScores = { ...prev };
      newPlayers.forEach((player, index) => {
        const playerName = player.name;
        const roundScore = Number(roundScores[index]?.[playerName] || 0);
        newTotalScores[playerName] =
          (newTotalScores[playerName] || 0) + roundScore;
      });
      return newTotalScores;
    });

    // Actualizar el estado de jugadores y limpiar los puntajes de la ronda
    setPlayers(newPlayers);
    setRoundScores([]);
    // Mover al siguiente repartidor
    setCurrentDealerIndex((prevIndex) => (prevIndex + 1) % players.length);
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
          <div className="flex items-center ">
            <input
              type="text"
              placeholder="Jugador"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              className="input input-bordered w-full max-w-xs"
              onKeyDown={handleKeyDown}
            />
            <button onClick={addPlayer} className="btn btn-primary btn-sm ml-4">
              <UserPlusIcon className="h-6 w-6 " />
            </button>
          </div>

          {players.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl mb-4">Ingresar Puntajes</h2>

              <table className="table table-sm w-full">
                <thead>
                  <tr>
                    <th className=" p-2 text-left"></th>
                    <th className=" p-2 text-left">Jugador</th>
                    <th className=" p-2 text-right ">Puntaje</th>
                  </tr>
                </thead>
                <tbody>
                  {players
                    .filter(
                      (player) => !disqualifiedPlayers.includes(player.name)
                    )
                    .map((player, index) => (
                      <tr key={index} className="hover">
                        <td className="flex  items-center  p-2">
                          <button className="btn btn-error btn-circle btn-sm mr-2 ">
                            X
                          </button>
                        </td>
                        <td className=" p-2 text-center">
                          <p>{player.name}</p>
                        </td>
                        <td className="flex justify-end items-center  p-2">
                          <button
                            onClick={() => setBritney(index, player.name)}
                            className="btn btn-warning btn-circle btn-sm mr-2 "
                          >
                            -10
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={
                              (roundScores[index] || {})[player.name] || ""
                            }
                            onChange={(e) =>
                              handleInputChange(e, index, player.name)
                            }
                            className="input input-bordered w-20"
                          />
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
                    onClick={() => handleContinueGame(losingPlayer)}
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
              <h2 className="text-xl ">Historial de Puntajes</h2>
              <div className="my-4 flex justify-between items-center">
                <div className="flex justify">
                  <UserGroupIcon className="h-8 w-8" />
                  <h3 className="text-lg font-semibold ml-2 mt-1">{`${players.length}`}</h3>
                </div>
                <div>
                  <button className="btn btn-primary btn-circle btn-sm mr-4 ">
                    <ArrowUturnLeftIcon className="w-6 h-6" />
                  </button>
                  <button
                    onClick={loadRound}
                    className="btn btn-accent btn-circle btn-sm"
                  >
                    <ArrowUturnRightIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <table className="table table-xs w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Reparte</th>
                    <th className="p-2 text-center">Jugador</th>
                    <th className="p-2 text-center">Última Ronda</th>
                    <th className="p-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, playerIndex) => (
                    <tr key={playerIndex}>
                      <td>{currentDealerIndex === playerIndex ? "🟢" : ""}</td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => openModal(player)}
                          className="btn btn-link text-blue-500 underline"
                        >
                          {player.name}
                        </button>
                      </td>
                      <td className="p-2 text-center">
                        {player.scores[player.scores.length - 1] || 0}
                      </td>
                      <td className="p-2 text-center">
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
      </div>-
    </div>
  );
}

export default Anotador;
