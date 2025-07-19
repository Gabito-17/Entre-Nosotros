import { supabase } from "../lib/supabaseClient.ts";

export const getAllGames = async () => {
  const { data, error } = await supabase
    .from("games")
    .select("*");

  if (error) {
    console.error("Error al obtener los juegos:", error);
    return;
  }

  console.log("Juegos disponibles:", data);
};