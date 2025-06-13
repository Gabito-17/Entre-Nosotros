import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";
import useRound from "../../hooks/useRound";

function RoundControls({
  loadRound,
  roundScoresHistory,
  currentRoundIndex,
  setRoundScores,
  players,
  setCurrentRoundIndex,
  setTotalScores,
  setRoundScoresHistory,
  setPlayers,
}) {
  const { handleRoundReverse } = useRound({
    players,
    currentRoundIndex,
    roundScoresHistory,
    setCurrentRoundIndex,
    setRoundScores,
    setTotalScores,
    setRoundScoresHistory,
    setPlayers,
  });

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        onClick={handleRoundReverse}
        className="btn btn-circle btn-sm btn-outline btn-error"
        title="Corregir ronda anterior"
        disabled={currentRoundIndex === 0}
      >
        <ArrowUturnLeftIcon className="w-5 h-5" />
      </button>
      <button
        onClick={loadRound}
        className="btn btn-circle btn-sm btn-outline btn-success"
        title="Cargar siguiente ronda"
      >
        <ArrowUturnRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
}

export default RoundControls;
