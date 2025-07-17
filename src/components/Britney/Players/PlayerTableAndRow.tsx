"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useGameBritneyStore } from "../../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import { fadeItem, staggerContainer } from "../../../lib/Animations.ts";
import DealerIcon from "../DealerIcon.tsx";

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
    if (isNaN(numericValue)) return;
    if (numericValue < 0 && roundScores[playerName] !== -10) return;
    setRoundScore(playerName, numericValue);
  };

  const handleMinusTen = (index: number) => {
    assignMinusTen(players[index].name);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentRoundIndex} // <-- fuerza re-render + animación
        className="overflow-x-auto mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
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

          <motion.tbody
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {players.map((player, index) => {
              const isDisqualified = disqualifiedSet.has(player.name);
              const score = roundScores[player.name] ?? "";
              const isDealer = currentDealer?.id === player.id;

              return (
                <motion.tr
                  key={player.id}
                  variants={fadeItem}
                  initial="hidden"
                  animate="visible"
                  custom={index * 0.1} // <-- aquí el delay dinámico
                  className={isDisqualified ? "opacity-50 bg-gray-100" : ""}
                >
                  <td>
                    <div className="flex items-center gap-2 w-full">
                      {/* Reservar espacio del ícono SIEMPRE */}
                      <div className="w-5 h-5 flex items-center justify-center">
                        <AnimatePresence>
                          {isDealer && (
                            <motion.div
                              layoutId="dealer-indicator"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                                duration: 0.3,
                              }}
                              className="text-primary"
                              title="Dealer"
                            >
                              <DealerIcon className="w-5 h-5" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        onClick={() => openModal(player)}
                        className="btn btn-sm btn-outline flex-1 text-left"
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
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </motion.div>
    </AnimatePresence>
  );
}
