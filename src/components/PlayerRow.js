// PlayerRow.js
function PlayerRow({
  player,
  index,
  currentDealerIndex,
  roundScores,
  totalScores,
  setRoundScores,
  openModal,
  disqualifiedPlayers,
}) {
  const handleScoreChange = (e) => {
    const { value } = e.target;

    // Actualiza el puntaje del jugador cuando se cambia el valor en el input
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = { [player.name]: value };
      return updatedScores;
    });
  };

  const handleMinusTen = () => {
    // Asigna -10 al puntaje del jugador cuando se presiona el botón
    setRoundScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index] = { [player.name]: -10 }; // Asigna -10 directamente
      return updatedScores;
    });
  };
  return (
    <tr>
      <td className="text-center">
        {currentDealerIndex === index && "🟢"}{" "}
        {/* Mostramos el dealer solo si es el índice válido */}
      </td>
      <td className="text-center">
        <button onClick={() => openModal(player)} className="btn btn-sm">
          {player.name}
        </button>
      </td>
      <td className="text-center">
        <button
          className="btn btn-warning btn-circle btn-sm mr-2 "
          onClick={handleMinusTen}
          disabled={disqualifiedPlayers.includes(player.name)} // Deshabilitar si el jugador está descalificado
        >
          -10
        </button>
        <input
          type="number"
          value={roundScores[index]?.[player.name] || ""}
          onChange={handleScoreChange}
          className="input input-bordered input-xs"
          min="0" // Evita que se ingresen números negativos manualmente
          disabled={disqualifiedPlayers.includes(player.name)} // Deshabilitar si el jugador está descalificado
        />
      </td>
      <td className="text-center">{totalScores[player.name] || 0}</td>
    </tr>
  );
}

export default PlayerRow;
