import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import React from "react";

function PlayerTableAndRow({
  players,
  roundScores,
  totalScores,
  currentDealerIndex,
  setRoundScores,
  openModal,
  disqualifiedPlayers,
  currentRoundIndex,
  removePlayer,
}) {
  // Convertimos disqualifiedPlayers a un Set para búsquedas más eficientes
  const disqualifiedPlayersSet = new Set(disqualifiedPlayers);

  const getNextValidDealerIndex = (
    currentDealerIndex,
    players,
    disqualifiedPlayersSet
  ) => {
    const allDisqualified = players.every((player) =>
      disqualifiedPlayersSet.has(player.name)
    );

    if (allDisqualified) {
      console.warn("Todos los jugadores están descalificados.");
      return -1; // Retorna -1 si no hay jugadores válidos
    }

    let nextIndex = currentDealerIndex;

    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length; // Avanza al siguiente índice
      } while (disqualifiedPlayersSet.has(players[nextIndex].name)); // Encuentra el siguiente dealer válido
    }
    return nextIndex;
  };

  const nextValidDealerIndex = getNextValidDealerIndex(
    currentDealerIndex,
    players,
    disqualifiedPlayersSet
  );

  const handleScoreChange = (index, value) => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < 0) return; // Evitar valores inválidos
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = {
        ...updatedScores[index],
        [players[index].name]: numericValue,
      };
      return updatedScores;
    });
  };

  const handleMinusTen = (index) => {
    const confirmMinusTen = window.confirm(
      `¿Estás seguro de asignar -10 puntos a ${players[index].name}?`
    );
    if (!confirmMinusTen) return;

    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = {
        ...updatedScores[index],
        [players[index].name]: -10,
      }; // Asigna -10 directamente
      return updatedScores;
    });
  };

  return (
    <table className="mt-4 table w-full">
      <thead>
        <tr>
          <th className="text-center">Dealer</th>
          <th>
            <div className="flex justify-center items-center">
              <UserGroupIcon className="h-5 w-5" />
              <h3 className="text-sm">{`${players.length}`}</h3>
            </div>
          </th>
          <th className="text-center">Puntaje Ronda {currentRoundIndex + 1}</th>
          <th className="text-end">Puntaje Total</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr
            key={player.name}
            className={
              disqualifiedPlayersSet.has(player.name) ? "opacity-50" : ""
            }
          >
            {/* Indica si es el dealer actual */}
            <td className="flex items-center justify-between">
              <button
                className="btn btn-circle btn-sm"
                onClick={() => removePlayer(player.name)}
              >
                <TrashIcon className="h-5 w-5" />
              </button>

              {nextValidDealerIndex === index && "🟢"}
            </td>
            {/* Nombre del jugador */}
            <td className="text-center">
              <button onClick={() => openModal(player)} className="btn btn-sm">
                {player.name}
              </button>
            </td>
            {/* Puntaje de la ronda actual */}
            <td className="text-center">
              <button
                className="btn btn-warning btn-circle btn-sm mr-2"
                onClick={() => handleMinusTen(index)}
                disabled={disqualifiedPlayersSet.has(player.name)} // Deshabilitar si el jugador está descalificado
              >
                -10
              </button>
              <input
                type="number"
                value={roundScores[index]?.[player.name] || ""}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                className="input input-bordered input-sm w-16"
                min="0" // Evita que se ingresen números negativos manualmente
                disabled={disqualifiedPlayersSet.has(player.name)} // Deshabilitar si el jugador está descalificado
              />
            </td>
            {/* Puntaje total del jugador */}
            <td className="text-end">{totalScores[player.name] || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlayerTableAndRow;
