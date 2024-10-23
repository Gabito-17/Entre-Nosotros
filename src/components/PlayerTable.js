// PlayerTable.js
import React from "react";
import PlayerRow from "./PlayerRow";

// Función auxiliar para encontrar el próximo dealer válido
const getNextValidDealerIndex = (
  currentDealerIndex,
  players,
  disqualifiedPlayers
) => {
  let nextIndex = currentDealerIndex;

  // Recorremos la lista hasta encontrar un jugador que no esté descalificado
  do {
    nextIndex = (nextIndex + 1) % players.length;
  } while (disqualifiedPlayers.includes(players[nextIndex].name));

  return nextIndex;
};

function PlayerTable({
  players,
  roundScores,
  totalScores,
  currentDealerIndex,
  setRoundScores,
  loadRound,
  openModal,
  disqualifiedPlayers,
  currentRoundIndex,
}) {
  // Calculamos el próximo dealer válido
  const nextValidDealerIndex = getNextValidDealerIndex(
    currentDealerIndex,
    players,
    disqualifiedPlayers
  );

  return (
    <table className="mt-4 table  w-full">
      <thead>
        <tr>
          <th></th>
          <th>Jugador</th>
          <th className="text-center">Puntaje Ronda {currentRoundIndex + 1}</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, index) => (
          <PlayerRow
            key={player.name}
            player={player}
            index={index}
            currentDealerIndex={nextValidDealerIndex}
            roundScores={roundScores}
            totalScores={totalScores}
            setRoundScores={setRoundScores}
            openModal={openModal}
            disqualifiedPlayers={disqualifiedPlayers}
          />
        ))}
      </tbody>
    </table>
  );
}

export default PlayerTable;
