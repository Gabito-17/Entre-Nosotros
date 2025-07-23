import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { subscribeToPlayersInRoom } from "../../../services/gamesServices.ts";
import { joinRoomIfAllowed } from "../../../services/mafiaServices.ts";
import { ensurePlayerCreated } from "../../../services/userServices.ts";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";

export const JoinRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [hostId, setHostId] = useState<string | null>(null);
  const players = useMafiaGame((state) => state.players);
  const setPlayers = useMafiaGame((state) => state.setPlayers);
  const setRoomId = useMafiaGame((state) => state.setRoomId);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const tryJoin = async () => {
      if (!roomId) {
        console.log("Room ID is not provided");
        return;
      }
      console.log("Unirse a sala:", roomId);

      const player = await ensurePlayerCreated();
      if (player){
        console.log("Jugador asegurado:", player);
      }
      if (!player) return alert("No se pudo verificar el jugador");

      const result = await joinRoomIfAllowed(roomId, player.id);
      if ("error" in result) {
        alert(result.error);
        return navigate("/");
      }

      setRoomId(roomId);

      if (result.players) setPlayers(result.players);

      setLoading(false);

      unsubscribe = subscribeToPlayersInRoom(roomId, (newPlayers) => {
        setPlayers(newPlayers);
      });

      return result.players;
    };

    tryJoin();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [roomId]);

  const userId = user?.id;
  const isHost = userId === hostId;

  const handleStartGame = () => {
    alert("¡Juego iniciado!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace copiado al portapapeles");
  };

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        <h1 className="text-3xl font-bold">Sala: {roomId}</h1>

        {loading ? (
          <p>Cargando sala...</p>
        ) : (
          <>
            <p className="text-gray-500">
              Jugadores conectados: {players.length}
            </p>

            <ul className="bg-white rounded-lg shadow-md p-4 text-left space-y-2">
              {players.map((p) => (
                <li
                  key={p.id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>{p.name || p.id}</span>
                  {p && (
                    <span className="text-xs text-green-600 font-semibold">
                      Host
                    </span>
                  )}
                </li>
              ))}
            </ul>

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
                className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
              >
                Iniciar juego
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
