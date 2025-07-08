"use client";

import { motion } from "framer-motion";
import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, KeyboardEvent } from "react";
import { useGameBritneyStore } from "../../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" },
};

const buttonHoverTap = {
  whileHover: { scale: 1.1, boxShadow: "0px 0px 8px rgba(0,0,0,0.15)" },
  whileTap: { scale: 0.95 },
};

export default function AddPlayer() {
  const newPlayerName = useGameBritneyStore((state) => state.newPlayerName);
  const setNewPlayerName = useGameBritneyStore(
    (state) => state.setNewPlayerName
  );
  const addPlayer = useGameBritneyStore((state) => state.addPlayer);
  const resetGame = useGameBritneyStore((state) => state.resetSession);
  const resetScores = useGameBritneyStore((state) => state.resetScores);
  const roundScoresHistory = useGameBritneyStore(
    (state) => state.roundScoresHistory
  );

  const openConfirmationModal = useUiStore(
    (state) => state.openConfirmationModal
  );

  const isGameInProgress = roundScoresHistory.length > 0;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddPlayer();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPlayerName(e.target.value);
  };

  const handleAddPlayer = () => {
    if (isGameInProgress) {
      openConfirmationModal({
        title: "Estas son horas de llegar?",
        message: "¿Seguro que querés agregar un jugador?",
        onConfirm: () => addPlayer(),
      });
    } else {
      addPlayer();
    }
  };

  const handleResetClick = () => {
    if (isGameInProgress) {
      openConfirmationModal({
        title: "Baaaah que paso pao?",
        message: "¿Querés reiniciar la partida?",
        actions: [
          {
            label: "Misma banda, cuenta nueva",
            className: "btn btn-warning",
            onClick: () => resetScores(),
          },
          {
            label: "Sí, se va todo a la p...",
            className: "btn btn-error",
            onClick: () => resetGame(),
          },
          {
            label: "Cancelar",
            className: "btn btn-secondary",
            onClick: () => {},
          },
        ],
      });
    } else {
      openConfirmationModal({
        title: "Baaaah que paso pao?",
        message: "¿Querés eliminar a todos los jugadores actuales?",
        actions: [
          {
            label: "Eliminar Jugadores",
            className: "btn btn-error",
            onClick: () => resetGame(),
          },
          {
            label: "Cancelar",
            className: "btn btn-secondary",
            onClick: () => {},
          },
        ],
      });
    }
  };

  return (
    <motion.div
      className="flex flex-wrap items-center gap-4 p-4 rounded-box"
      initial="initial"
      animate="animate"
      variants={fadeUp}
    >
      <motion.input
        type="text"
        placeholder="Nombre del jugador"
        value={newPlayerName}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="input input-bordered w-full sm:max-w-xs flex-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className="flex flex-wrap items-center gap-2 rounded-box justify-end"
        initial="initial"
        animate="animate"
        transition={{ staggerChildren: 0.15 }}
      >
        <motion.button
          onClick={handleResetClick}
          className="btn btn-secondary btn-sm"
          title="Reiniciar partida"
          {...buttonHoverTap}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <ArrowPathIcon className="h-5 w-5" />
        </motion.button>

        <motion.button
          onClick={handleAddPlayer}
          className="btn btn-primary btn-sm"
          title="Agregar jugador"
          {...buttonHoverTap}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <UserPlusIcon className="h-5 w-5" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
