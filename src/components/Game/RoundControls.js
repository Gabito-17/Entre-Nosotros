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
}) {
  const navigateRound = (direction) => {
    setCurrentRoundIndex((prevIndex) => {
      const newIndex = prevIndex + direction;
      // Asegúrate de no salir de los límites del array
      if (newIndex < 0 || newIndex >= roundScoresHistory.length)
        return prevIndex;

      // Carga los puntajes de la ronda seleccionada en los inputs
      const currentScores = roundScoresHistory[newIndex] || {};
      setRoundScores(
        players.map((player) => ({
          [player.name]: currentScores[player.name] || 0,
        }))
      );
      return newIndex;
    });
  };

  return (
    <div className="flex justify-end">
      <button
        onClick={() => navigateRound(-1)}
        className="btn btn-primary btn-circle btn-sm mr-4"
      >
        <ArrowUturnLeftIcon className="w-6 h-6" />
      </button>
      <button onClick={loadRound} className="btn btn-accent btn-circle btn-sm">
        <ArrowUturnRightIcon className="w-6 h-6" />
      </button>
    </div>
  );
}

export default RoundControls;
