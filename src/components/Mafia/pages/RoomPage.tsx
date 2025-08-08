import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { subscribeToRoomPlayers } from "../../../realtime/playerChannel.ts";
import { getRoomPlayers, joinRoom } from "../../../services/roomServices.ts";
import { usePlayerStore } from "../../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../../stores/useRoomStore.ts";
import Lobby from "../Lobby.tsx";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const { setRoom, setPlayers } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);

  useEffect(() => {
    if (!roomId) return;

    let hasJoined = false;
    let playerChannel: any;

    const waitForPlayer = async () => {
      while (!usePlayerStore.getState().player) {
        await new Promise((r) => setTimeout(r, 100));
      }

      const player = usePlayerStore.getState().player;
      if (!player || hasJoined) return;
      hasJoined = true;

      const room = await joinRoom(roomId);
      if (!room) {
        setRoomNotFound(true);
        return;
      }

      setRoom(room);

      const players = await getRoomPlayers(roomId);
      if (players) setPlayers(players);

      playerChannel = subscribeToRoomPlayers(roomId);
    };

    waitForPlayer().finally(() => setLoading(false));

    return () => {
      if (playerChannel) {
        playerChannel.unsubscribe().then(() => {
          console.log("🧹 Canal desuscripto correctamente");
        });
      }
    };
  }, [roomId, setRoom, setPlayers]);

  if (loading) return <div className="text-center mt-10">Cargando sala...</div>;
  if (roomNotFound)
    return (
      <div className="text-center mt-10 text-red-500">Sala no encontrada</div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <Lobby />
    </div>
  );
}
