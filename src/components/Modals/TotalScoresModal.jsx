import { useGameSessionStore } from "../../stores/useGameSessionStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";

const TotalScoresModal = () => {
  const isOpen = useUiStore((state) => state.isTotalScoresModalOpen);
  const closeModal = useUiStore((state) => state.closeTotalScoresModal);

  const players = useGameSessionStore((state) => state.players);
  const totalScores = useGameSessionStore((state) => state.totalScores);

  if (!isOpen) return null;

  const sortedPlayers = [...players].sort(
    (b, a) => totalScores[b.name] - totalScores[a.name]
  );

  const topScore = totalScores[sortedPlayers[0]?.name] ?? 0;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg text-center mb-4">Ranking</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Jugador</th>
                <th className="text-right">Puntaje Total</th>
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
          <button className="btn btn-primary" onClick={closeModal}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalScoresModal;
