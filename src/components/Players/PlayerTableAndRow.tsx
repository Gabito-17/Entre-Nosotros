"use client";

import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useGameBritneyStore } from "../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";

export default function PlayerTableAndRow({ openModal }) {
  const players = useGameBritneyStore((state) => state.players);
  const currentRoundIndex = useGameBritneyStore(
    (state) => state.currentRoundIndex
  );
  const roundScoresHistory = useGameBritneyStore(
    (state) => state.roundScoresHistory
  );
  const totalScores = useGameBritneyStore((state) => state.totalScores);
  const getDisqualifiedPlayers = useGameBritneyStore(
    (state) => state.getDisqualifiedPlayers
  );
  const getCurrentDealer = useGameBritneyStore(
    (state) => state.getCurrentDealer
  );
  const setRoundScore = useGameBritneyStore((state) => state.setRoundScore);
  const assignMinusTen = useGameBritneyStore((state) => state.assignMinusTen);
  const openTotalScoresModal = useUiStore(
    (state) => state.openTotalScoresModal
  );

  const disqualifiedPlayers = getDisqualifiedPlayers();
  const disqualifiedSet = new Set(disqualifiedPlayers);
  const roundScores = roundScoresHistory[currentRoundIndex] || {};
  const currentDealer = getCurrentDealer();

  const handleScoreChange = (playerName: string, value: string) => {
    if (value === "") {
      setRoundScore(playerName, undefined as unknown as number);
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
                <UserGroupIcon className="h-5 w-5" />
                <span>{players.length}</span>
              </div>
            </th>
            <th>Puntaje ronda {currentRoundIndex + 1}</th>
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
            const isDealer = currentDealer?.id === player.id;

            return (
              <tr
                key={player.id}
                className={isDisqualified ? "opacity-50 bg-gray-100" : ""}
              >
                <td>
                  <div className="relative flex items-center gap-2">
                    {isDealer && (
                      <span className="absolute left-0 -translate-x-4 w-3 h-3 rounded-full bg-green-500"></span>
                    )}
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
                      value={score === undefined ? "" : score}
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
