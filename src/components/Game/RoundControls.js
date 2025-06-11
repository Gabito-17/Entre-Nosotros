import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from "@heroicons/react/24/outline";

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
  function handleRoundReverse() {
    if (currentRoundIndex === 0) return;

    const roundToRemoveIndex = currentRoundIndex - 1;
    const roundToRemove = roundScoresHistory[roundToRemoveIndex] || {};

    const confirmReverse = window.confirm(
      `¿Estás seguro de que querés corregir la ronda ${
        roundToRemoveIndex + 1
      }? Esta acción eliminará los puntajes registrados y permitirá volver a ingresarlos.`
    );

    if (!confirmReverse) return;

    setTotalScores((prevTotals) => {
      const newTotals = { ...prevTotals };
      players.forEach((player) => {
        const scoreToSubtract = roundToRemove[player.name] || 0;
        newTotals[player.name] =
          (newTotals[player.name] || 0) - scoreToSubtract;
      });
      return newTotals;
    });

    setRoundScoresHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.splice(roundToRemoveIndex, 1);
      return newHistory;
    });

    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        scores: player.scores.slice(0, roundToRemoveIndex),
      }))
    );

    setRoundScores(
      players.map((player) => ({
        [player.name]: roundToRemove[player.name] || 0,
      }))
    );

    setCurrentRoundIndex(roundToRemoveIndex);
  }

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
