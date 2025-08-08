import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../stores/useRoomStore.ts";

export default function Lobby() {
  const navigate = useNavigate();
  const room = useRoomStore((state) => state.room);
  const playersInRoom = useRoomStore((state) => state.players);
  const player = usePlayerStore((state) => state.player);

  const [loading, setLoading] = useState(false);

  const isHost = playersInRoom.find(
    (p) => p.player_id === player?.id && p.is_host
  );

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
