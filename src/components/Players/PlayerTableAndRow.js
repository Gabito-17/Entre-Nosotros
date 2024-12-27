import { UserGroupIcon } from "@heroicons/react/24/outline";
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
}) {
  const getNextValidDealerIndex = (
    currentDealerIndex,
    players,
    disqualifiedPlayers
  ) => {
    const allDisqualified = players.every((player) =>
      disqualifiedPlayers.includes(player.name)
    );

    if (allDisqualified) {
      console.warn("Todos los jugadores están descalificados.");
      return -1; // Retorna -1 si no hay jugadores válidos
    }

    let nextIndex = currentDealerIndex;

    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length; // Avanza al siguiente índice
      } while (disqualifiedPlayers.includes(players[nextIndex].name)); // Encuentra el siguiente dealer válido
    }
    return nextIndex;
  };

  const nextValidDealerIndex = getNextValidDealerIndex(
    currentDealerIndex,
    players,
    disqualifiedPlayers
  );

  const handleScoreChange = (index, value) => {
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = { [players[index].name]: value };
      return updatedScores;
    });
  };

  const handleMinusTen = (index) => {
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = { [players[index].name]: -10 }; // Asigna -10 directamente
      return updatedScores;
    });
  };

  return (
    <table className="mt-4 table w-full">
      <thead>
        <tr>
          <th>
            <div className="flex justify-center items-center">
              <UserGroupIcon className="h-5 w-5" />
              <h3 className="text-sm">{`${players.length}`}</h3>
            </div>
          </th>
          <th className="text-center">Jugador</th>
          <th className="text-center">Puntaje Ronda {currentRoundIndex + 1}</th>
          <th className="text-end">Total</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <tr key={player.name}>
            <td className="text-center">
              {nextValidDealerIndex === index && "🟢"}
            </td>
            <td className="text-center">
              <button onClick={() => openModal(player)} className="btn btn-sm">
                {player.name}
              </button>
            </td>
            <td className="text-center">
              <button
                className="btn btn-warning btn-circle btn-sm mr-2"
                onClick={() => handleMinusTen(index)}
                disabled={disqualifiedPlayers.includes(player.name)} // Deshabilitar si el jugador está descalificado
              >
                -10
              </button>
              <input
                type="number"
                value={roundScores[index]?.[player.name] || ""}
                onChange={(e) => handleScoreChange(index, e.target.value)}
                className="input input-bordered input-sm w-16"
                min="0" // Evita que se ingresen números negativos manualmente
                disabled={disqualifiedPlayers.includes(player.name)} // Deshabilitar si el jugador está descalificado
              />
            </td>
            <td className="text-end">{totalScores[player.name] || 0}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PlayerTableAndRow;
