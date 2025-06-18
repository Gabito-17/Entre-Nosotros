"use client";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useGameSessionStore } from "../../stores/useGameSessionStore.ts"; // O la ruta correspondiente

export default function RoundControls() {
  const currentRoundIndex = useGameSessionStore(
    (state) => state.currentRoundIndex
  );
  const confirmRound = useGameSessionStore((state) => state.confirmRound);
  const reverseRound = useGameSessionStore((state) => state.reverseRound);

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={reverseRound}
        className="btn btn-circle btn-sm btn-outline btn-error"
        title="Revertir ronda anterior"
        disabled={currentRoundIndex === 0}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </button>

      <button
        onClick={() => {
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
