import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient.ts";
import { getRoomPlayers } from "../services/roomServices.ts";
import { useRoomStore } from "../stores/useRoomStore.ts";

let activeChannels: Record<string, RealtimeChannel> = {};

export const subscribeToRoomPlayers = (roomId: string) => {
  if (activeChannels[roomId]) {
    console.log("🔁 Ya existe una subscripción activa para:", roomId);
    return activeChannels[roomId];
  }

  console.log("📡 Subscribing to room_players for room:", roomId);

  const { setPlayers } = useRoomStore.getState();

  const channel = supabase
    .channel(`room_players:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_players",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        console.log("📥 Evento recibido en room_players:", payload);
        const players = await getRoomPlayers(roomId);
        if (players) {
          console.log("✅ Jugadores actualizados:", players);
          setPlayers(players);
        }
      }
    )
    .subscribe();

  activeChannels[roomId] = channel;

  return channel;
};

export const unsubscribeFromRoomPlayers = (roomId: string) => {
  const channel = activeChannels[roomId];
  if (channel) {
    console.log("🧹 Desuscribiendo de:", roomId);
    channel.unsubscribe();
    delete activeChannels[roomId];
  }
};
