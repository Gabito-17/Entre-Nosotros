import { supabase } from "../lib/supabaseClient";

export async function subscribeToPlayersInRoom(
  roomId: string,
  onUpdate: (players: any[]) => void
) {
  // 1. Cargar lista inicial
  const { data, error } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    console.error("Error fetching players:", error);
    onUpdate([]);
  } else {
    onUpdate(data || []);
  }

  // 2. Suscribirse a realtime
  const channel = supabase
    .channel(`room_players_${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_players",
        filter: `room_id=eq.${roomId}`,
      },
      async (payload) => {
        // Cada vez que cambia algo, volver a traer la lista completa
        const { data, error } = await supabase
          .from("room_players")
          .select("*")
          .eq("room_id", roomId);

        if (error) {
          console.error("Error fetching players realtime:", error);
          onUpdate([]);
        } else {
          onUpdate(data || []);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
