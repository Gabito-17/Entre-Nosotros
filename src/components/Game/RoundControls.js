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
  setRoundScoresHistory, // 👈 nuevo prop
  setPlayers, // <-- RECIBIMOS setPlayers AQUÍ
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

    // 1. Restar los puntajes del total
    setTotalScores((prevTotals) => {
      const newTotals = { ...prevTotals };
      players.forEach((player) => {
        const scoreToSubtract = roundToRemove[player.name] || 0;
        newTotals[player.name] =
          (newTotals[player.name] || 0) - scoreToSubtract;
      });
      return newTotals;
    });

    // 2. Eliminar la ronda del historial
    setRoundScoresHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      newHistory.splice(roundToRemoveIndex, 1);
      return newHistory;
    });

    // 3. Eliminar el score de esa ronda del array `scores` de cada jugador
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => ({
        ...player,
        scores: player.scores.slice(0, roundToRemoveIndex),
      }))
    );

    // 4. Cargar los puntajes previos en el input para poder editarlos
    setRoundScores(
      players.map((player) => ({
        [player.name]: roundToRemove[player.name] || 0,
      }))
    );

    // 5. Retroceder el índice de ronda
    setCurrentRoundIndex(roundToRemoveIndex);
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={handleRoundReverse}
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
