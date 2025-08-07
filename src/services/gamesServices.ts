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
