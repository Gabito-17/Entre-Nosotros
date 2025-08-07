import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import { RoomPlayer, useRoomStore } from "../../stores/useRoomStore.ts";

export default function Lobby() {
  const navigate = useNavigate();
  const room = useRoomStore((state) => state.room);
  const setRoom = useRoomStore((state) => state.setRoom);
  const player = usePlayerStore((state) => state.player);

  const [playersInRoom, setPlayersInRoom] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(false);

  const isHost = playersInRoom.find(
    (p) => p.player_id === player?.id && p.is_host
  );

  // 👉 Obtiene los jugadores actuales en la sala
  const fetchRoomPlayers = async () => {
    if (!room) return;
    const { data, error } = await supabase
      .from("room_players")
      .select(
        "player_id, is_host, is_connect, alive, players(name, avatar_url)"
      )
      .eq("room_id", room.id);

    if (!error && data) {
      setPlayersInRoom(data);
    } else {
      console.error("Error fetching room players:", error?.message);
    }
  };

  // 👉 Escucha cambios en room_players y en la room (para detectar el inicio del juego)
  useEffect(() => {
    if (!room?.id) return;

    fetchRoomPlayers();

    const roomPlayersChannel = supabase
      .channel("room-players-lobby")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
          filter: `room_id=eq.${room.id}`,
        },
        fetchRoomPlayers
      )
      .subscribe();

    const roomStatusChannel = supabase
      .channel("room-status-listener")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${room.id}`,
        },
        async (payload) => {
          const newStatus = payload.new.status;
          const newPhase = payload.new.phase;

          setRoom({
            ...room,
            status: newStatus,
            phase: newPhase,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomPlayersChannel);
      supabase.removeChannel(roomStatusChannel);
    };
  }, [room?.id]);

  const handleStartGame = async () => {
    if (!room) return;
    setLoading(true);

    const { error } = await supabase
      .from("rooms")
      .update({ status: "playing", phase: "night" })
      .eq("id", room.id);

    if (error) {
      console.error("Error starting game:", error.message);
    }

    setLoading(false);
  };

  const handleLeaveRoom = async () => {
    if (!room || !player) return;

    await supabase
      .from("room_players")
      .delete()
      .eq("room_id", room.id)
      .eq("player_id", player.id);

    navigate("/mafia");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sala: {room?.id.slice(0, 6)}
      </h2>

      <div className="grid gap-4">
        {playersInRoom.map((p) => (
          <div
            key={p.player_id}
            className="flex items-center gap-4 bg-base-200 p-4 rounded-lg"
          >
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={p.players.avatar_url || "/default-avatar.png"} />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{p.players.name}</p>
              <p className="text-sm text-gray-500">
                {p.is_host ? "Host" : p.alive ? "Jugador" : "Muerto"}
              </p>
            </div>
            <div
              className={`badge ${
                p.is_connect ? "badge-success" : "badge-error"
              }`}
            >
              {p.is_connect ? "Conectado" : "Desconectado"}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button className="btn btn-outline" onClick={handleLeaveRoom}>
          Salir
        </button>

        {isHost && (
          <button
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            onClick={handleStartGame}
            disabled={loading}
          >
            Iniciar partida
          </button>
        )}
      </div>
    </div>
  );
}
