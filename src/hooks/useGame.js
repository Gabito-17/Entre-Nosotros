import { useLocalStorageState } from "./useLocalStorageState";

const useGame = (
  players,
  currentRoundIndex,
  setPlayers,
  setCurrentRoundIndex,
  setRoundScores,
  currentDealerIndex,
  setCurrentDealerIndex,
  isPlay,
  setIsPlay
) => {
  const [totalScores, setTotalScores] = useLocalStorageState("totalScores", {});
  const [roundScoresHistory, setRoundScoresHistory] = useLocalStorageState(
    "roundScoresHistory",
    []
  );
  const [disqualifiedPlayers, setDisqualifiedPlayers] = useLocalStorageState(
    "disqualifiedPlayers",
    []
  );

  // También sincronizamos `isPlay`
  useLocalStorageState("isPlay", isPlay); // no usamos el setter, solo forzamos sincronización

  const loadRound = (roundScores) => {
    let hasNegativeTen = false;
    const updatedScores = {};

    players.forEach((player) => {
      updatedScores[player.name] = 0;
    });

    for (let index = 0; index < roundScores.length; index++) {
      const playerName = players[index].name;
      const roundScore = Number(roundScores[index]?.[playerName] || 0);

      if (!Number.isInteger(roundScore) && roundScore !== -10) {
        alert(
          `Número inválido para ${playerName}: debe ser un entero entre 0 y 100 o -10`
        );
        return;
      }

      if (roundScore === -10) {
        if (hasNegativeTen) {
          alert(
            `Solo un jugador puede tener -10 en una ronda. Error en ${playerName}`
          );
          return;
        }
        hasNegativeTen = true;
      } else if (roundScore < 0 || roundScore > 100) {
        alert(
          `Número inválido para ${playerName}: debe ser entre 0 y 100 o -10`
        );
        return;
      }

      updatedScores[playerName] = roundScore;
    }

    if (
      Object.values(updatedScores).filter((score) => score === -10).length > 1
    ) {
      alert(
        "Solo un jugador puede tener -10 en esta ronda. Corrige la entrada."
      );
      return;
    }

    setIsPlay(true);

    setRoundScoresHistory((prev) => {
      const newHistory = [...prev];
      newHistory[currentRoundIndex] = updatedScores;
      return newHistory;
    });

    setTotalScores((prev) => {
      const newTotalScores = { ...prev };
      Object.keys(updatedScores).forEach((playerName) => {
        newTotalScores[playerName] =
          (newTotalScores[playerName] || 0) + updatedScores[playerName];
      });
      return newTotalScores;
    });

    const updatedPlayers = players.map((player) => {
      const playerRoundScore = updatedScores[player.name];
      return {
        ...player,
        scores: [
          ...player.scores,
          playerRoundScore === -10 && hasNegativeTen ? -10 : playerRoundScore,
        ],
      };
    });

    setPlayers(updatedPlayers);
    setRoundScores([]);
    setCurrentRoundIndex((prev) => prev + 1);

    updateDealer();
  };

  const updateDealer = () => {
    const allDisqualified = players.every((player) =>
      disqualifiedPlayers.includes(player.name)
    );

    if (allDisqualified) {
      console.warn("Todos los jugadores están descalificados.");
      return;
    }

    let nextIndex = currentDealerIndex;

    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length;
      } while (disqualifiedPlayers.includes(players[nextIndex].name));
    }

    setCurrentDealerIndex(nextIndex);
  };

  const endGame = () => {
    setIsPlay(false);
  };

  const resetGame = () => {
    const resetScores = players.reduce((acc, player) => {
      acc[player.name] = 0;
      return acc;
    }, {});

    const resetPlayersList = players.map((player) => ({
      ...player,
      scores: [],
    }));

    setPlayers(resetPlayersList);
    setRoundScores([]);
    setCurrentRoundIndex(0);
    setTotalScores(resetScores);
    setDisqualifiedPlayers([]);
    setCurrentDealerIndex(0);

    // Limpiar localStorage
    localStorage.removeItem("totalScores");
    localStorage.removeItem("roundScoresHistory");
    localStorage.removeItem("disqualifiedPlayers");
    localStorage.removeItem("isPlay");
  };

  return {
    totalScores,
    roundScoresHistory,
    disqualifiedPlayers,
    isPlay,
    setDisqualifiedPlayers,
    loadRound,
    resetGame,
    endGame,
    setTotalScores,
    setRoundScoresHistory,
  };
};

export default useGame;
