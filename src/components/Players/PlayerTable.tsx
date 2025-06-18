"use client";

import { TrashIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts";

export default function PlayerTableAndRow({ openModal }) {
  const players = useGameSessionStore((state) => state.players);
  const currentRoundIndex = useGameSessionStore(
    (state) => state.currentRoundIndex
  );
  const roundScoresHistory = useGameSessionStore(
    (state) => state.roundScoresHistory
  );
  const totalScores = useGameSessionStore((state) => state.totalScores);
  const disqualifiedPlayers = useGameSessionStore(
    (state) => state.disqualifiedPlayers
  );
  const currentDealerIndex = useGameSessionStore(
    (state) => state.currentDealerIndex
  );
  const setRoundScore = useGameSessionStore((state) => state.setRoundScore);
  const assignMinusTen = useGameSessionStore((state) => state.assignMinusTen);
  const removePlayer = useGameSessionStore((state) => state.removePlayer);

  const disqualifiedSet = new Set(disqualifiedPlayers);
  const roundScores = roundScoresHistory[currentRoundIndex] || {};

  const handleScoreChange = (playerName: string, value: string) => {
    if (value === "") {
      setRoundScore(playerName, 0);
      return;
    }
    const numericValue = Number(value);
    if (isNaN(numericValue) || numericValue < 0) return;
    setRoundScore(playerName, numericValue);
  };

  const handleMinusTen = (index: number) => {
    assignMinusTen(players[index].name);
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
            const isDisqualified = disqualifiedSet.has(player.name);
            const score = roundScores[player.name] ?? "";

            return (
              <tr
                key={player.id}
                className={isDisqualified ? "opacity-50" : ""}
              >
                <td className="flex items-center justify-between gap-2">
                  <button
                    className="btn btn-circle btn-sm btn-outline btn-error"
                    onClick={() => removePlayer(player.id)}
                    title="Eliminar jugador"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  {currentDealerIndex === index && <span>🟢</span>}
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
                      onChange={(e) =>
                        handleScoreChange(player.name, e.target.value)
                      }
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
