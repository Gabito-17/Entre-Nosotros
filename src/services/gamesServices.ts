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
  onChange: (payload: any) => void
) => {
  const channel = supabase
    .channel(`players-room-${roomId}`)
    .on(
      "postgres_changes",
      {
        event: "*", // INSERT, UPDATE, DELETE
        schema: "public",
        table: "players_in_room",
        filter: `room_id=eq.${roomId}`,
      },
      (payload) => {
        onChange(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel); // cleanup
  };
};
