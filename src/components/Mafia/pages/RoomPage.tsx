import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../../lib/supabaseClient.ts";
import { joinRoom } from "../../../services/roomServices.ts";
import { usePlayerStore } from "../../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../../stores/useRoomStore.ts";
import Lobby from "../Lobby.tsx";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  const player = usePlayerStore((state) => state.player);
  const setRoom = useRoomStore((state) => state.setRoom);
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);

  useEffect(() => {
    const enterRoom = async () => {
      if (!roomId || !player) return; // Esperamos a tener player

      const room = await joinRoom(roomId);

      if (!room) {
        setRoomNotFound(true);
        setLoading(false);
        return;
      }

      setRoom(room);

      // Obtener todos los jugadores de la sala
      const { data: players, error: playersError } = await supabase
        .from("room_players")
        .select(
          `
        player_id,
        is_host,
        is_connect,
        alive,
        players (
          name,
          avatar_url
        )
      `
        )
        .eq("room_id", roomId);

      if (playersError) {
        console.error("Error cargando jugadores:", playersError);
        return;
      }

      setRoomPlayers(players);
      setLoading(false);
    };

    // Solo llamamos si player ya existe
    if (player) {
      enterRoom();
    }
  }, [roomId, player]);

  if (loading) return <div className="text-center mt-10">Cargando sala...</div>;
  if (roomNotFound)
    return (
      <div className="text-center mt-10 text-red-500">Sala no encontrada</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Lobby players={roomPlayers} />
    </div>
  );
}
