"use client";

import {
  // TableCellsIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";

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
  const openTotalScoresModal = useUiStore(
    (state) => state.openTotalScoresModal
  );

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
          <tr className="text-sm font-semibold">
            <th>
              <div className="flex items-center gap-2">
                <span>Dealer</span>
              </div>
            </th>
            <th>
              <div className="flex items-center gap-2">
                <UserGroupIcon className="h-5 w-5" />
                <span>{players.length}</span>
              </div>
            </th>

            <th>
              <span>Puntaje ronda {currentRoundIndex + 1}</span>
            </th>

            <th>
              <button
                className="flex items-center gap-2 w-full p-2"
                onClick={openTotalScoresModal}
              >
                <span>Total</span>
                <div className="btn btn-primary btn-xs btn-circle">
                  <PlusIcon className="w-4 h-4" />
                </div>
              </button>
            </th>
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
                <td>
                  <div className="flex items-center gap-2">
                    <button
                      className="btn btn-circle btn-sm btn-outline btn-error"
                      onClick={() => removePlayer(player.id)}
                      title="Eliminar jugador"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                    {currentDealerIndex === index && <span>🟢</span>}
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openModal(player)}
                      className="btn btn-sm btn-outline"
                    >
                      {player.name}
                    </button>
                  </div>
                </td>

                <td>
                  <div className="flex items-center gap-2">
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

                <td className="font-semibold text-center w-[80px]">
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
