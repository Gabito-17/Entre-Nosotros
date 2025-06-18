"use client";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useGameStore } from "../../stores/useGameStore.ts";

export default function RoundControls() {
  const currentRoundIndex = useGameStore((state) => state.currentRoundIndex);
  const confirmRound = useGameStore((state) => state.confirmRound);
  const reverseRound = useGameStore((state) => state.reverseRound);

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={reverseRound}
        className="btn btn-circle btn-sm btn-outline btn-error"
        title="Corregir ronda anterior"
        disabled={currentRoundIndex === 0}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => {
          console.count("Confirmar ronda clickeado");
          confirmRound();
        }}
        className="btn btn-circle btn-sm btn-outline btn-success"
        title="Confirmar ronda actual"
      >
        <ArrowUturnRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
