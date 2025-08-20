import { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient.ts";
import { Action, useRoomStore } from "../stores/useRoomStore.ts";

let activeActionsChannels: Record<string, RealtimeChannel> = {};

export const subscribeToRoomActions = (roomId: string) => {
  if (activeActionsChannels[roomId]) {
    console.log(
      "🔁 Ya existe subscripción activa para actions en room:",
      roomId
    );
    return activeActionsChannels[roomId];
  }

  const { addAction } = useRoomStore.getState();

  const channel = supabase
    .channel(`room_actions:${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "actions",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        const action = payload.new as Action;
        console.log("📥 Nueva acción recibida:", payload.new);
        addAction(action);
      }
    )
    .subscribe();

  activeActionsChannels[roomId] = channel;

  return channel;
};

export const unsubscribeFromRoomActions = (roomId: string) => {
  const channel = activeActionsChannels[roomId];
  if (channel) {
    console.log("🧹 Desuscribiendo acciones de room:", roomId);
    channel.unsubscribe();
    delete activeActionsChannels[roomId];
  }
};
