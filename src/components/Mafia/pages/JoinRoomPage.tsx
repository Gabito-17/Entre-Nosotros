import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  isPlayerInRoom,
  validateRoomJoin,
} from "../../../services/mafiaServices.ts";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";
import { PlayerList } from "../Players/PlayerList.tsx";

export const JoinRoomPage = () => {
  const { paramsRoomId } = useParams<{ paramsRoomId: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const userId = user?.id;

  const [playerName, setPlayerName] = useState("");

  const {
    roomId,
    players,
    hostId,
    loading,
    setRoomId,
    setHostId,
    setLoading,
    joinRoom,
    subscribeToPlayers,
    leaveRoom,
    startGame,
    addLog,
    isInGame,
    setIsInGame,
  } = useMafiaGame();

  // Al montar, configurar sala y suscribirse
  useEffect(() => {
    if (!paramsRoomId || !user?.id) return;

    const init = async () => {
      const validateRoom = await validateRoomJoin(paramsRoomId);
      if (!validateRoom.success) {
        alert(validateRoom.message || "Error al validar la sala");
        navigate("/");
        return;
      }

      setRoomId(paramsRoomId);

      const playerInRoom = await isPlayerInRoom(paramsRoomId, user.id);

      if (!playerInRoom.success) {
        setIsInGame(false);
        return;
      }

      setIsInGame(true); // Está conectado y dentro de la sala

      setHostId(null);
      const unsubscribe = subscribeToPlayers(paramsRoomId);
      return () => unsubscribe();
    };

    init();
  }, [paramsRoomId, user?.id]);

  const tryJoin = async () => {
    if (!playerName.trim()) {
      alert("Debes ingresar un nombre");
      return;
    }

    setLoading(true);
    const success = await joinRoom(roomId!, playerName);
    console.log(success);

    if (!success) {
      alert("No se pudo unir a la sala");
      setLoading(false);
      navigate("/");
      return;
    }

    setLoading(false);
  };

  const handleLeave = () => {
    leaveRoom();
    navigate("/");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace copiado al portapapeles");
  };

  const handleStartGame = async () => {
    setLoading(true);
    const success = await startGame();

    if (success) {
      addLog("La partida ha comenzado. Fase noche.");
      alert("¡Juego iniciado!");
    } else {
      alert("No se pudo iniciar la partida.");
    }

    setLoading(false);
  };

  const isHost = userId === hostId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        {!isInGame ? (
          <>
            <h1 className="text-2xl font-bold">Unirse a la sala: {roomId}</h1>
            <input
              type="text"
              placeholder="Tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={tryJoin}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            >
              {loading ? "Uniéndote..." : "Unirse"}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Sala: {roomId}</h1>

            <p className="text-gray-500">
              Jugadores conectados: {players.length}
            </p>

            <PlayerList players={players} />

            <div className="flex justify-center space-x-4 pt-4">
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Copiar enlace
              </button>

              <button
                onClick={handleLeave}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Salir
              </button>
            </div>

            {isHost && (
              <button
                onClick={handleStartGame}
                disabled={loading}
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded disabled:opacity-50"
              >
                {loading ? "Iniciando partida..." : "Iniciar juego"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
