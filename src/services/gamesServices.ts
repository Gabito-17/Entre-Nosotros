import { supabase } from "../lib/supabaseClient.ts";

export const getAllGames = async () => {
  const { data, error } = await supabase.from("games").select("*");

  if (error) {
    console.error("Error al obtener los juegos:", error);
    return;
  }

  console.log("Juegos disponibles:", data);
};

export const fetchPlayersInRoom = async (roomId: string) => {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("room_id", roomId);

  if (error) {
    console.error("Error fetching players:", error.message);
    return [];
  }

  return data;
};

export const getHostPlayer = async (hostId: string) => {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("host_id", hostId)
    .eq("is_host", true);
  if (error) {
    console.error("Error fetching host player:", error.message);
  }
  if (data) {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("id", hostId);
    if (!error) {
      return error;
    }
    return data;
  }
};
export const subscribeToPlayersInRoom = (
  roomId: string,
  onChange: (players: any[]) => void
) => {
  const channel = supabase
    .channel(`players-room-${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "players",
        filter: `room_id=eq.${roomId}`,
      },
      async () => {
        // Volvés a pedir la lista completa actualizada
        const { data } = await supabase
          .from("players")
          .select("*")
          .eq("room_id", roomId);

        onChange(data || []);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
