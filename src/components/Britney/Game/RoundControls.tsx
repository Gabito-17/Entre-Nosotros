"use client";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";
import { useGameBritneyStore } from "../../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";
import { usePlaySound } from "../../../stores/usePlaySound.ts"; // Ajustá si el path es distinto

export default function RoundControls() {
  const currentRoundIndex = useGameBritneyStore(
    (state) => state.currentRoundIndex
  );
  const confirmRound = useGameBritneyStore((state) => state.confirmRound);
  const reverseRound = useGameBritneyStore((state) => state.reverseRound);

  const openConfirmationModal = useUiStore(
    (state) => state.openConfirmationModal
  );

  // Refs para los sonidos
  const confirmSound = useRef<HTMLAudioElement | null>(null);
  const revertSound = useRef<HTMLAudioElement | null>(null);

  const playSound = usePlaySound();

  useEffect(() => {
    confirmSound.current = new Audio(
      "/assets/sounds/shuffling-playing-cards.wav"
    );
    revertSound.current = new Audio("/assets/sounds/whoosh-sound.wav");
  }, []);

  const handleConfirmRound = () => {
    if (confirmSound.current) playSound(confirmSound.current);
    confirmRound();
  };

  const handleReverseRound = () => {
    openConfirmationModal({
      title: "¿Revertir ronda?",
      message: `¿Seguro que querés revertir la ronda ${currentRoundIndex}?`,
      onConfirm: () => {
        if (revertSound.current) playSound(revertSound.current);
        reverseRound();
      },
    });
  };

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={handleReverseRound}
        className="btn btn-circle btn-sm btn-outline btn-error"
        title="Revertir ronda anterior"
        disabled={currentRoundIndex === 0}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </button>

      <button
        onClick={handleConfirmRound}
        className="btn btn-circle btn-sm btn-outline btn-success"
        title="Confirmar ronda actual"
      >
        <ArrowUturnRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
