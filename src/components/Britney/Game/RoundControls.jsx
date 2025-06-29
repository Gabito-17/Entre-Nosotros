"use client";

import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import { useGameBritneyStore } from "../../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../../stores/useUiStore.ts";

export default function RoundControls() {
  const currentRoundIndex = useGameBritneyStore(
    (state) => state.currentRoundIndex
  );
  const confirmRound = useGameBritneyStore((state) => state.confirmRound);
  const reverseRound = useGameBritneyStore((state) => state.reverseRound);

  const openConfirmationModal = useUiStore(
    (state) => state.openConfirmationModal
  );

  const handleReverseRound = () => {
    openConfirmationModal({
      title: "¿Revertir ronda?",
      message: `¿Seguro que querés revertir la ronda ${currentRoundIndex}?`,
      onConfirm: () => reverseRound(),
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
        onClick={confirmRound}
        className="btn btn-circle btn-sm btn-outline btn-success"
        title="Confirmar ronda actual"
      >
        <ArrowUturnRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
