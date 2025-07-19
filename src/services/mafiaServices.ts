import { supabase } from "../lib/supabaseClient.ts";
import {v4 as uuidv4} from "uuid";

export const getGameIdBySlug = async (slug: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from("games")
    .select("id")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error al obtener el ID del juego:", error);
    return null;
  }

  return data.id;
};

export const createRoomWithHost = async (
  userId: string,
  name: string
): Promise<{ roomId: string } | { error: string }> => {
  const { data: game } = await supabase
    .from("games")
    .select("id")
    .eq("slug", "la-mafia")
    .single();

  if (!game) return { error: "Juego no encontrado" };

  const newRoomId = uuidv4();

  const { error: roomError } = await supabase.from("rooms").insert([
    {
      id: newRoomId,
      game_id: game.id,
      host_id: userId,
      phase: "lobby",
    },
  ]);

  if (roomError) {
    console.error(roomError);
    return { error: "No se pudo crear la sala" };
  }

  const { error: playerError } = await supabase.from("players").insert([
    {
      room_id: newRoomId,
      user_id: userId,
      name,
    },
  ]);

  if (playerError) {
    console.error(playerError);
    return { error: "No se pudo registrar al jugador" };
  }

  return { roomId: newRoomId };
};
