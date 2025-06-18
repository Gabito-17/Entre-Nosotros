import { useUiStore } from "../../stores/useUiStore.ts";

export default function PlayerModal() {
  const selectedPlayer = useUiStore((state) => state.selectedPlayer);
  const closePlayerModal = useUiStore((state) => state.closePlayerModal);

  if (!selectedPlayer) {
    // Evitamos renderizar nada si no hay jugador seleccionado
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Detalles de {selectedPlayer.name}
        </h3>

        <p className="mb-2">Partidas jugadas: {selectedPlayer.scores.length}</p>

        {selectedPlayer.scores.length === 0 ? (
          <p>No hay puntajes registrados.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  Ronda
                </th>
                <th className="border border-gray-300 px-2 py-1 text-left">
                  Puntaje
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedPlayer.scores.map((score, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-action">
          <button className="btn" onClick={closePlayerModal}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
