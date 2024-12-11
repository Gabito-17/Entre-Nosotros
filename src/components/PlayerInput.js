import { UserPlusIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

function PlayerInput({ newPlayerName, setNewPlayerName, addPlayer, handleResetGame }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPlayer();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <input
        type="text"
        placeholder="Jugador"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
        className="input input-bordered w-full max-w-xs"
        onKeyDown={handleKeyDown}
      /> 
      <button onClick={handleResetGame} className="btn btn-primary btn-sm ml-4">
  <ArrowPathIcon className="h-6 w-6" />
</button>

      <button onClick={addPlayer} className="btn btn-primary btn-sm ml-4">
        <UserPlusIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default PlayerInput;
