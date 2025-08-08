// src/components/pages/RoomPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { QrBox } from "../../../components/QrBox.tsx";
import { subscribeToRoomPlayers } from "../../../realtime/playerChannel.ts";
import { getRoomPlayers, joinRoom } from "../../../services/roomServices.ts";
import { usePlayerStore } from "../../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../../stores/useRoomStore.ts";
import Lobby from "../Lobby.tsx";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const player = usePlayerStore((state) => state.player);
  const { setRoom, setPlayers } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);

  useEffect(() => {
    if (!roomId || !player) return;

    let playerChannel: ReturnType<typeof subscribeToRoomPlayers> | null = null;

    const setupRoom = async () => {
      const room = await joinRoom(roomId);
      if (!room) {
        setRoomNotFound(true);
        return;
      }

      setRoom(room);
      const players = await getRoomPlayers(roomId);
      setPlayers(players);

      playerChannel = subscribeToRoomPlayers(roomId);
    };

    setupRoom().finally(() => setLoading(false));

    return () => {
      playerChannel?.unsubscribe();
    };
  }, [roomId, player]);

  if (loading) return <div className="text-center mt-10">Cargando sala...</div>;
  if (roomNotFound)
    return (
      <div className="text-center mt-10 text-red-500">Sala no encontrada</div>
    );

  const fullUrl = `http://192.168.18.3:3000/mafia/sala/${roomId}`;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <QrBox value={fullUrl} />
      <Lobby />
    </div>
  );
}
