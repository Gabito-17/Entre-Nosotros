import { useCallback } from "react";

function useRound({
  players,
  currentRoundIndex,
  roundScoresHistory,
  setCurrentRoundIndex,
  setRoundScores,
  setTotalScores,
  setRoundScoresHistory,
  setPlayers,
}) {
  const handleRoundReverse = useCallback(() => {
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
  }, [
    currentRoundIndex,
    roundScoresHistory,
    setCurrentRoundIndex,
    setRoundScores,
    setTotalScores,
    setRoundScoresHistory,
    setPlayers,
    players,
  ]);

  return { handleRoundReverse };
}

export default useRound;
