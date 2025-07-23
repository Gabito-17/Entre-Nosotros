import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient.ts";

export const createRoomWithHost = async (
  userId: string,
  name: string
): Promise<{ roomId: string } | { error: string }> => {
  // Obtener ID del juego
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("id")
    .eq("slug", "la-mafia")
    .single();

  if (gameError || !game) return { error: "Juego no encontrado" };

  const newRoomId = uuidv4();

  // Crear la sala
  const { error: roomError } = await supabase.from("rooms").insert([
    {
      id: newRoomId,
      game_id: game.id,
      host_id: userId,
      phase: "lobby",
      name: name,
      status: "preparing",
    },
  ]);

  if (roomError) {
    console.error(roomError);
    return { error: "No se pudo crear la sala" };
  }

  // Ya aseguramos que el player existe antes de esta función, así que lo buscamos directamente
  const { data: player, error: fetchError } = await supabase
    .from("players")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (fetchError || !player) {
    console.error(fetchError);
    return { error: "No se pudo obtener el jugador existente" };
  }
  // Relacionar player con room
  const { error: linkError } = await supabase.from("room_players").insert([
    {
      room_id: newRoomId,
      player_id: player.id,
    },
  ]);

  if (linkError) {
    console.error(linkError);
    return { error: "No se pudo vincular el jugador a la sala" };
  }

  return { roomId: newRoomId };
};

export const joinRoomIfAllowed = async (
  roomId: string,
  playerId: number
): Promise<{ success: boolean; players?: any[]; message?: string }> => {
  // 1. Verificar sala
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, status")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    return { success: false, message: "Sala no encontrada" };
  }
  console.log("Room found:", room);

  if (room.status !== "preparing") {
    return { success: false, message: "La sala ya está en curso o finalizada" };
  }

  // 2. Verificar si el jugador ya está en la sala
  const { data: existing, error: existingError } = await supabase
    .from("room_players")
    .select("id")
    .eq("room_id", roomId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (existingError) {
    return { success: false, message: "Error al verificar el jugador" };
  }

  // 3. Insertar jugador si no existe
  if (!existing) {
    const { error: insertError } = await supabase.from("room_players").insert([
      {
        room_id: roomId,
        player_id: playerId,
      },
    ]);

    if (insertError) {
      return { success: false, message: "No se pudo unir a la sala" };
    }
  }

  // 4. Obtener lista actual de jugadores para devolver
  const { data: players, error: playersError } = await supabase
    .from("room_players")
    .select(
      `
    player_id,
    joined_at,
    players (
      id,
      name,
      alive,
      avatar_url
    )
  `
    )
    .eq("room_id", roomId);

  if (playersError) {
    return { success: false, message: "Error al obtener jugadores" };
  }

  // Formatear para devolver solo lo necesario

  return { success: true, players };
};
