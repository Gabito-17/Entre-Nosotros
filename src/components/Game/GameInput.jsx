import { UserPlusIcon } from "@heroicons/react/24/outline";

const GameInput = ({
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  handleResetGame,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md max-w-md mx-auto mb-4">
      <h2 className="text-lg font-semibold mb-2 text-center">
        Agregar jugadores
      </h2>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newPlayerName}
          onChange={(e) => setNewPlayerName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nombre de la partida"
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />

        <div className="flex gap-2 justify-end">
          <button
            onClick={addPlayer}
            title="Agregar jugador"
            className="p-2 rounded-md bg-teal-600 text-white hover:bg-teal-700"
          >
            <UserPlusIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameInput;
