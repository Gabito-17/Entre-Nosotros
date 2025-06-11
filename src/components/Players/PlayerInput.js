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
    <div className="flex items-center justify-between p-4 rounded-lg ">
      <input
        type="text"
        placeholder="Jugador"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        className="input input-bordered w-full max-w-xs transition-all duration-200 rounded-lg"
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleResetGame}
        className="btn text-white btn-sm ml-4 rounded-lg shadow transition-all duration-200"
      >
        <ArrowPathIcon className="h-6 w-6" />
      </button>

      <button
        onClick={addPlayer}
        className="btn text-white btn-sm ml-4 rounded-lg shadow transition-all duration-200"
      >
        <UserPlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default PlayerInput;
