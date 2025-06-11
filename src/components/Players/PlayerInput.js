import { ArrowPathIcon, UserPlusIcon } from "@heroicons/react/24/outline";

function PlayerInput({
  newPlayerName,
  setNewPlayerName,
  addPlayer,
  handleResetGame,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-base-200 rounded-box">
      <input
        type="text"
        placeholder="Nombre del jugador"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input input-bordered w-full sm:max-w-xs flex-1"
      />

      <button
        onClick={handleResetGame}
        className="btn btn-secondary btn-sm"
        title="Reiniciar juego"
      >
        <ArrowPathIcon className="h-5 w-5" />
      </button>

      <button
        onClick={addPlayer}
        className="btn btn-primary btn-sm"
        title="Agregar jugador"
      >
        <UserPlusIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

export default PlayerInput;
