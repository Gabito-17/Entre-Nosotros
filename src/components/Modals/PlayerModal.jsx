import { XMarkIcon } from "@heroicons/react/24/outline";

function PlayerModal({ selectedPlayer, closeModal }) {
  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">
            {selectedPlayer.name} - Historial de Puntajes
          </h2>
          <button className="btn btn-sm btn-circle" onClick={closeModal}>
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <ul className="mt-4">
          {selectedPlayer.scores.map((score, index) => (
            <li key={index} className="py-1">
              Ronda {index + 1}: {score}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default PlayerModal;
