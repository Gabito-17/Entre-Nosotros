import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";
import { PlayerList } from "../Players/PlayerList.tsx";

export const JoinRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  // Estado local para el input del nombre
  const [playerName, setPlayerName] = useState("");

  // Extraemos del store el estado y acciones necesarias
  const {
    players,
    hostId,
    hasJoined,
    loading,
    myId,
    setRoomId,
    setHostId,
    setHasJoined,
    setLoading,
    joinRoom,
    subscribeToPlayers,
    leaveRoom,
  } = useMafiaGame();

  const userId = user?.id;

  // Suscripción a cambios en jugadores en tiempo real cuando cambia roomId
  useEffect(() => {
    if (!roomId) return;

    // Nos suscribimos a actualizaciones de jugadores
    const unsubscribe = subscribeToPlayers(roomId);


    
    // Limpiamos la suscripción al desmontar o cambiar roomId
    return () => {
      unsubscribe();
    };
  }, [roomId, subscribeToPlayers]);

  // Función para intentar unirse a la sala
  const tryJoin = async () => {
    if (!playerName.trim()) {
      alert("Debes ingresar un nombre");
      return;
    }

    // Ejecutamos la función joinRoom del store (que ya maneja loading)
    const success = await joinRoom(roomId!, playerName);
    
    if (!success) {
      alert("No se pudo unir a la sala");
      navigate("/");
      return;
    }

    // Ya está todo seteado en el store: hasJoined, hostId, players, myId, etc
  };

  // Handler para salir de la sala y limpiar estado
  const handleLeave = () => {
    leaveRoom();
    navigate("/");
  };

  // Handler para copiar link al portapapeles
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Enlace copiado al portapapeles");
  };

  // Handler para iniciar el juego (solo host)
  const handleStartGame = () => {
    alert("¡Juego iniciado!");
  };

  // Determinar si el usuario es el host
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
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
            >
              {loading ? "Uniéndote..." : "Unirse"}
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
