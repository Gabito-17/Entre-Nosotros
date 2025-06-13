import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const useGamesManager = () => {
  const [games, setGames] = useState({});
  const [currentGameId, setCurrentGameId] = useState(null);

  // Cargar al iniciar
  useEffect(() => {
    const storedGames = JSON.parse(localStorage.getItem("games")) || {};
    const storedCurrentId = localStorage.getItem("currentGameId");
    setGames(storedGames);
    setCurrentGameId(storedCurrentId);
  }, []);

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem("games", JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    if (currentGameId) {
      localStorage.setItem("currentGameId", currentGameId);
    }
  }, [currentGameId]);

  const createGame = (name = "Nueva partida") => {
    const id = uuidv4();
    const newGame = {
      name,
      createdAt: new Date().toISOString(),
      data: {
        players: [],
        roundScoresHistory: [],
        totalScores: {},
        disqualifiedPlayers: [],
        currentRoundIndex: 0,
        currentDealerIndex: 0,
        isPlay: false,
      },
    };

    setGames((prev) => ({ ...prev, [id]: newGame }));
    setCurrentGameId(id);
    return id;
  };

  const deleteGame = (id) => {
    const { [id]: _, ...rest } = games;
    setGames(rest);
    if (currentGameId === id) {
      setCurrentGameId(null);
      localStorage.removeItem("currentGameId");
    }
  };

  const selectGame = (id) => {
    if (games[id]) {
      setCurrentGameId(id);
    }
  };

  return {
    games,
    currentGameId,
    currentGame: games[currentGameId]?.data || null,
    createGame,
    deleteGame,
    selectGame,
  };
};
