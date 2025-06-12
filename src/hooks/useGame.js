import { useEffect, useState } from "react";

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
  const [totalScores, setTotalScores] = useState(() => {
    const saved = localStorage.getItem("totalScores");
    return saved ? JSON.parse(saved) : {};
  });

  const [roundScoresHistory, setRoundScoresHistory] = useState(() => {
    const saved = localStorage.getItem("roundScoresHistory");
    return saved ? JSON.parse(saved) : [];
  });

  const [disqualifiedPlayers, setDisqualifiedPlayers] = useState(() => {
    const saved = localStorage.getItem("disqualifiedPlayers");
    return saved ? JSON.parse(saved) : [];
  });

  // Para isPlay es booleano
  const [localIsPlay, setLocalIsPlay] = useState(() => {
    const saved = localStorage.getItem("isPlay");
    return saved ? JSON.parse(saved) : false;
  });
  // Guardamos localIsPlay en isPlay y viceversa para mantener coherencia
  useEffect(() => {
    setIsPlay(localIsPlay);
  }, [localIsPlay]);

  useEffect(() => {
    setLocalIsPlay(isPlay);
  }, [isPlay]);

  useEffect(() => {
    localStorage.setItem("totalScores", JSON.stringify(totalScores));
  }, [totalScores]);

  useEffect(() => {
    localStorage.setItem(
      "roundScoresHistory",
      JSON.stringify(roundScoresHistory)
    );
  }, [roundScoresHistory]);

  useEffect(() => {
    localStorage.setItem(
      "disqualifiedPlayers",
      JSON.stringify(disqualifiedPlayers)
    );
  }, [disqualifiedPlayers]);

  useEffect(() => {
    localStorage.setItem("isPlay", JSON.stringify(localIsPlay));
  }, [localIsPlay]);

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
      return; // Detiene la función si todos están descalificados
    }

    let nextIndex = currentDealerIndex;

    if (currentRoundIndex !== 0) {
      do {
        nextIndex = (nextIndex + 1) % players.length;
      } while (disqualifiedPlayers.includes(players[nextIndex].name));
    }

    setCurrentDealerIndex(nextIndex);
  };

  const resetGame = () => {
    const resetScores = players.reduce((acc, player) => {
      acc[player.name] = 0;
      return acc;
    }, {});

    const resetPlayersList = players.map((player) => ({
      ...player,
      scores: [], // Resetear puntajes
    }));

    setPlayers(resetPlayersList); // Resetear jugadores
    setRoundScores([]); // Resetear los puntajes de la ronda
    setCurrentRoundIndex(0); // Reiniciar el índice de ronda
    setTotalScores(resetScores); // Reiniciar puntajes totales
    setDisqualifiedPlayers([]); // Eliminar jugadores descalificados
    setCurrentDealerIndex(0); // Resetear el índice del dealer
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
    setTotalScores,
    setRoundScoresHistory,
  };
};

export default useGame;
