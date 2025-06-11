import { useState } from "react";

const usePlayers = (isPlay) => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    const maxPlayers = 10;

    const playerExists = players.some(
      (player) => player.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (trimmedName === "") {
      alert("El nombre del jugador no puede estar vacío.");
    } else if (/\d/.test(trimmedName)) {
      alert("El nombre del jugador no puede contener números.");
    } else if (!/^\p{L}+$/u.test(trimmedName)) {
      alert("El nombre del jugador no puede contener caracteres especiales.");
    } else if (trimmedName.length > 12) {
      alert("El nombre del jugador puede contener como máximo 12 caracteres.");
    } else if (players.length >= maxPlayers) {
      alert("Se ha alcanzado el máximo de jugadores permitidos.");
    } else if (playerExists) {
      alert("Ya existe un jugador con ese nombre. Elige otro.");
    } else if (isPlay) {
      alert(
        "Esta partida ya está en curso, no se puede añadir un nuevo jugador."
      );
    } else {
      setPlayers((prevPlayers) => [
        ...prevPlayers,
        { name: trimmedName, scores: [] },
      ]);
      setNewPlayerName("");
    }
  };

  const resetPlayers = () => {
    setPlayers([]);
  };

  const removePlayer = (playerName) => {
    setPlayers((prev) => prev.filter((player) => player.name !== playerName));
  };

  return {
    players,
    newPlayerName,
    setNewPlayerName,
    addPlayer,
    resetPlayers,
    setPlayers,
    removePlayer,
  };
};

export default usePlayers;
