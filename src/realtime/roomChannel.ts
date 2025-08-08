import { supabase } from "../lib/supabaseClient.ts";
import { useRoomStore } from "../stores/useRoomStore.ts";

export const subscribeToRoom = (roomId: string) => {
  const { updateRoom } = useRoomStore.getState();

  const channel = supabase
    .channel(`room:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // insert | update | delete
        schema: "public",
        table: "rooms",
        filter: `id=eq.${roomId}`,
      },
      (payload) => {
        if (payload.eventType === "UPDATE") {
          const newRoom = payload.new;
          updateRoom(newRoom);
        }
        // Podés manejar "DELETE" si querés detectar que la sala fue cerrada.
      }
    )
    .subscribe();

  return channel;
};
