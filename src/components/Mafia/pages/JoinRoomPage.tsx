import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { subscribeToPlayersInRoom } from "../../../services/gamesServices.ts";
import { joinRoomIfAllowed } from "../../../services/mafiaServices.ts";
import { ensurePlayerCreated } from "../../../services/userServices.ts";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";
import { PlayerList } from "../Players/PlayerList.tsx";

export const JoinRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [hostId, setHostId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  const players = useMafiaGame((state) => state.players);
  const setPlayers = useMafiaGame((state) => state.setPlayers);
  const setRoomId = useMafiaGame((state) => state.setRoomId);

  const userId = user?.id;

  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeToPlayersInRoom(roomId, (newPlayers) => {
      console.log("🔄 Jugadores desde suscripción:", newPlayers);
      setPlayers(newPlayers);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [roomId, setPlayers]);

  const tryJoin = async () => {
    if (!playerName.trim()) {
      alert("Debes ingresar un nombre");
      return;
    }

    setLoading(true);

    const player = await ensurePlayerCreated();

    if (!player) {
      alert("No se pudo verificar el jugador");
      setLoading(false);
      return;
    }

    const result = await joinRoomIfAllowed(roomId!, player.id, playerName);

    if (!result.success) {
      alert(result.message || "Error al unirse a la sala");
      setLoading(false);
      return navigate("/");
    }

    setRoomId(roomId!);
    setHostId(result.room?.hostId || null);

    if (result.players) {
      const myId = player.id;

      const normalizedPlayers = result.players.map((p) => ({
        id: p.player_id,
        user_id: "", // si no lo tenés, dejalo vacío
        name: p.name,
        alive: p.alive,
        isHost: p.is_host,
        role: undefined,
        isSelf: p.player_id === myId,
      }));

      setPlayers(normalizedPlayers);
    }

    setHasJoined(true);
    setLoading(false);
  };

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

  const isHost = userId === hostId;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full space-y-4 text-center">
        {!hasJoined ? (
          <>
            <h1 className="text-2xl font-bold">Entrar a la sala: {roomId}</h1>
            <input
              type="text"
              placeholder="Tu nombre"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              onClick={tryJoin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
            >
              Unirse
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Sala: {roomId}</h1>
            {loading ? (
              <p>Cargando sala...</p>
            ) : (
              <>
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
                    className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                  >
                    Iniciar juego
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
