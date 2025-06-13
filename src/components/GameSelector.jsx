import { useState } from "react";
import { useGamesManager } from "../hooks/useGamesManager";
import ConfirmationModal from "./Modals/ConfirmationModal";

const GameSelector = () => {
  const { games, currentGameId, createGame, deleteGame, selectGame } =
    useGamesManager();

  const [newGameName, setNewGameName] = useState("");

  const handleCreateGame = () => {
    const name = newGameName.trim() || "Nueva partida";
    createGame(name);
    setNewGameName("");
  };

  const handleDelete = (id) => {
    if (
      ConfirmationModal("¿Estás seguro de que querés eliminar esta partida?")
    ) {
      deleteGame(id);
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-xl max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">
        Gestión de Partidas
      </h2>

      <div className="mb-4">
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-2"
          placeholder="Nombre de la nueva partida"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
        />
        <button
          onClick={handleCreateGame}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md"
        >
          Crear partida
        </button>
      </div>

      <h3 className="font-semibold mb-2">Partidas guardadas:</h3>
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {Object.entries(games).length === 0 && (
          <li className="text-sm text-gray-500">No hay partidas guardadas.</li>
        )}

        {Object.entries(games).map(([id, game]) => (
          <li
            key={id}
            className={`flex items-center justify-between p-2 border rounded-md ${
              id === currentGameId ? "bg-teal-100" : ""
            }`}
          >
            <div className="flex-1">
              <button
                onClick={() => selectGame(id)}
                className="text-left w-full text-teal-700 hover:underline"
              >
                {game.name}
                <div className="text-xs text-gray-500">
                  {new Date(game.createdAt).toLocaleString()}
                </div>
              </button>
            </div>
            <button
              onClick={() => handleDelete(id)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Eliminar partida"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GameSelector;
