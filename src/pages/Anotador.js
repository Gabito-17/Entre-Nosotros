import React, { useState } from "react";

const Anotador = () => {
  const [step, setStep] = useState(1); // 1: Agregar jugadores, 2: Cargar puntajes
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(null);

  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState({});

  // Agregar jugadores
  const addPlayer = () => {
    if (playerName.trim()) {
      setPlayers([...players, playerName.trim()]);
      setPlayerName("");
    }
  };

  const startScoring = () => {
    if (players.length > 0) {
      setStep(2);
      setScores(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
      setCurrentRound(0);
    }
  };

  // Manejo de puntajes
  const updateScore = (player, value) => {
    setScores({ ...scores, [player]: parseInt(value, 10) || 0 });
  };

  const submitScores = () => {
    const newRounds = [...rounds];
    if (currentRound === rounds.length) {
      newRounds.push(scores);
    } else {
      newRounds[currentRound] = scores;
    }
    setRounds(newRounds);
    setCurrentRound(newRounds.length);
    setScores(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
  };

  const editLastRound = () => {
    if (rounds.length > 0) {
      setScores(rounds[rounds.length - 1]);
      setCurrentRound(rounds.length - 1);
    }
  };

  // Navegación entre rondas
  const navigateRounds = (direction) => {
    let newRound = currentRound + direction;
    if (newRound >= 0 && newRound < rounds.length) {
      setCurrentRound(newRound);
      setScores(rounds[newRound]);
    }
  };

  return (
    <div className="score-tracker">
      
      <div className="mt-20 text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-pink-500">Sobre Nosotros</h1>
        </div>

      {step === 1 ? (
        <div>
          <h1>Agregar Jugadores</h1>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Nombre del jugador"
          />
          <button onClick={addPlayer}>Agregar</button>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}</li>
            ))}
          </ul>
          <button onClick={startScoring} disabled={players.length === 0}>
            Iniciar Rondas
          </button>
        </div>
      ) : (
        <div>
          <h1>Ronda {currentRound + 1}</h1>
          {players.map((player) => (
            <div key={player}>
              <span>{player}: </span>
              <input
                type="number"
                value={scores[player]}
                onChange={(e) => updateScore(player, e.target.value)}
              />
            </div>
          ))}
          {currentRound === rounds.length - 1 ? (
            <button onClick={submitScores}>Actualizar Última Ronda</button>
          ) : (
            <button onClick={submitScores}>Registrar Ronda</button>
          )}
          <h2>Navegar entre rondas</h2>
          <div>
            <button
              onClick={() => navigateRounds(-1)}
              disabled={currentRound === 0}
            >
              Anterior
            </button>
            <button
              onClick={() => navigateRounds(1)}
              disabled={currentRound === rounds.length - 1}
            >
              Siguiente
            </button>
          </div>
          {rounds.length > 0 && (
            <button onClick={editLastRound}>Editar Última Ronda</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Anotador;
