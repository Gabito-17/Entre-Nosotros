import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";

function PlayerTableAndRow({
  players,
  roundScores,
  totalScores,
  currentDealerIndex,
  setRoundScores,
  openModal,
  disqualifiedPlayers,
  currentRoundIndex,
  handleRemovePlayer,
}) {
  const disqualifiedPlayersSet = new Set(disqualifiedPlayers);

  const getNextValidDealerIndex = (
    currentDealerIndex,
    players,
    disqualifiedPlayersSet
  ) => {
    const allDisqualified = players.every((player) =>
      disqualifiedPlayersSet.has(player.name)
    );
    if (allDisqualified) return -1;

    let nextIndex = currentDealerIndex;
    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length;
      } while (disqualifiedPlayersSet.has(players[nextIndex].name));
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
    if (isNaN(numericValue) || numericValue < 0) return;
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
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = {
        ...updatedScores[index],
        [players[index].name]: -10,
      };
      return updatedScores;
    });
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th className="text-center">Dealer</th>
            <th>
              <div className="flex justify-center items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-sm font-medium">{players.length}</span>
              </div>
            </th>
            <th className="text-center">
              Puntaje Ronda {currentRoundIndex + 1}
            </th>
            <th className="text-end">Puntaje Total</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const isDisqualified = disqualifiedPlayersSet.has(player.name);
            const score = roundScores[index]?.[player.name] ?? "";

            return (
              <tr
                key={player.name}
                className={isDisqualified ? "opacity-50" : ""}
              >
                <td className="flex items-center justify-between gap-2">
                  <button
                    className="btn btn-circle btn-sm btn-outline btn-error"
                    onClick={() => handleRemovePlayer(player.name)}
                    title="Eliminar jugador"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  {nextValidDealerIndex === index && <span>🟢</span>}
                </td>

                <td className="text-center">
                  <button
                    onClick={() => openModal(player)}
                    className="btn btn-sm btn-outline"
                  >
                    {player.name}
                  </button>
                </td>

                <td className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="btn btn-warning btn-circle btn-sm"
                      onClick={() => handleMinusTen(index)}
                      disabled={isDisqualified}
                      title="-10 puntos"
                    >
                      -10
                    </button>
                    <input
                      type="number"
                      min="0"
                      className="input input-bordered input-sm w-20"
                      value={score}
                      onChange={(e) => handleScoreChange(index, e.target.value)}
                      disabled={isDisqualified}
                    />
                  </div>
                </td>

                <td className="text-end font-semibold">
                  {totalScores[player.name] || 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default PlayerTableAndRow;
