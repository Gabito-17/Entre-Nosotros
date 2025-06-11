import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

function GameOverModal({ losingPlayer, handleContinueGame, handleEndGame }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-box w-full max-w-md">
        <h2 className="font-bold text-lg flex items-center">
          <ExclamationCircleIcon className="h-6 w-6 text-error mr-2" />
          ¡Juego terminado!
        </h2>
        <p className="py-4">
          El jugador <strong>{losingPlayer}</strong> ha alcanzado 100 puntos y
          ha perdido la partida. ¿Qué te gustaría hacer?
        </p>
        <div className="modal-action">
          <button className="btn btn-error" onClick={handleEndGame}>
            Terminar Juego
          </button>
          <button className="btn btn-primary" onClick={handleContinueGame}>
            Continuar sin {losingPlayer}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameOverModal;
