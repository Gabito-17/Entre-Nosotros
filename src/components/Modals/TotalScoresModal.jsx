const TotalScoresModal = ({ isOpen, onClose, players, totalScores }) => {
  if (!isOpen) return null;

  // Ordenar jugadores por puntaje descendente
  const sortedPlayers = [...players].sort(
    (b, a) => totalScores[b.name] - totalScores[a.name]
  );

  const topScore = totalScores[sortedPlayers[0].name];

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-center mb-4">Puntajes Totales</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Jugador</th>
                <th className="text-right">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {sortedPlayers.map((player) => (
                <tr key={player.name}>
                  <td>
                    {player.name}{" "}
                    {totalScores[player.name] === topScore && (
                      <span className="ml-1">👑</span>
                    )}
                  </td>
                  <td className="text-right">{totalScores[player.name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalScoresModal;
