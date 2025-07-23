import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient.ts";

/**
 * Función para crear una nueva sala de juego con un host.
 *
 * @param userId - ID del usuario que será el host
 * @param roomName - Nombre para la nueva sala
 * @param playerName - Nombre del jugador host (puede ser distinto del usuario)
 * @returns Un objeto con el roomId si se creó exitosamente o un error si falló
 */
export const createRoomWithHost = async (
  userId: string,
  roomName: string,
  playerName: string
): Promise<{ roomId: string } | { error: string }> => {
  // Buscar el ID del juego 'la-mafia' en la tabla "games"
  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("id")
    .eq("slug", "la-mafia")
    .single();

  // Si hubo error o no se encontró el juego, devolver error
  if (gameError || !game) return { error: "Juego no encontrado" };

  // Generar un UUID único para la nueva sala
  const newRoomId = uuidv4();

  // Insertar la nueva sala en la tabla "rooms"
  const { error: roomError } = await supabase.from("rooms").insert([
    {
      id: newRoomId, // ID único generado
      game_id: game.id, // Relacionar con el juego 'la-mafia'
      host_id: userId, // Usuario que crea la sala es el host
      phase: "lobby", // Estado inicial de la sala
      name: roomName, // Nombre dado para la sala
      status: "preparing", // Estado de la sala (preparándose)
    },
  ]);

  // Si falla la creación de la sala, devolver error
  if (roomError) {
    console.error(roomError);
    return { error: "No se pudo crear la sala" };
  }

  // Buscar al jugador existente que corresponde al usuario host en "players"
  const { data: player, error: fetchError } = await supabase
    .from("players")
    .select("id")
    .eq("user_id", userId)
    .single();

  // Si no se pudo obtener el jugador, devolver error
  if (fetchError || !player) {
    console.error(fetchError);
    return { error: "No se pudo obtener el jugador existente" };
  }

  // Insertar el jugador en la sala creada en "room_players" y marcarlo como host
  const { error: linkError } = await supabase.from("room_players").insert([
    {
      room_id: newRoomId, // Sala creada
      player_id: player.id, // ID del jugador host
      name: playerName, // Nombre que puso el host
      alive: true, // Estado inicial vivo
      is_host: true, // Marcado como host
    },
  ]);

  // Si falla la vinculación del jugador con la sala, devolver error
  if (linkError) {
    console.error(linkError);
    return { error: "No se pudo vincular el jugador a la sala" };
  }

  // Si todo sale bien, devolver el ID de la sala creada
  return { roomId: newRoomId };
};

/**
 * Función para unirse a una sala si se cumplen las condiciones
 *
 * @param roomId - ID de la sala a unirse
 * @param playerId - ID del jugador que quiere unirse
 * @param playerName - Nombre con el que se une el jugador
 * @returns Objeto indicando éxito, lista de jugadores y detalles de la sala o mensaje de error
 */
export const joinRoomIfAllowed = async (
  roomId: string,
  playerId: string,
  playerName: string
): Promise<{
  success: boolean;
  players?: any[];
  room?: any;
  message?: string;
}> => {
  // Obtener información básica de la sala (incluyendo host_id)
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, status, host_id") // Se agrega host_id para saber quién es el host
    .eq("id", roomId)
    .single();

  // Si la sala no existe o error, devolver fallo
  if (roomError || !room) {
    return { success: false, message: "Sala no encontrada" };
  }

  // Comprobar que la sala esté en estado "preparing" para permitir unirse
  if (room.status !== "preparing") {
    return { success: false, message: "La sala ya está en curso o finalizada" };
  }

  // Verificar si el jugador ya está vinculado a la sala (para evitar duplicados)
  const { data: existingPlayer, error: existingError } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", roomId)
    .eq("player_id", playerId)
    .maybeSingle();

  // Si hay error al verificar, devolver fallo
  if (existingError) {
    return { success: false, message: "Error al verificar jugador" };
  }

  // Si el jugador no estaba en la sala, insertarlo como nuevo jugador no host
  if (!existingPlayer) {
    const { error: insertError } = await supabase.from("room_players").insert([
      {
        room_id: roomId,
        player_id: playerId,
        name: playerName,
        joined_at: new Date().toISOString(), // Fecha actual
        is_host: false, // No es host
        alive: true, // Estado inicial vivo
      },
    ]);

    // Si falla la inserción, devolver fallo
    if (insertError) {
      return { success: false, message: "No se pudo unir a la sala" };
    }
  }

  // Obtener lista de jugadores ordenados por fecha de ingreso
  const { data: roomPlayers, error: playersError } = await supabase
    .from("room_players")
    .select("player_id, name, is_host, alive, joined_at") // Campos importantes
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  // Si hay error al obtener jugadores, devolver fallo
  if (playersError) {
    return { success: false, message: "Error al obtener jugadores" };
  }

  // Si el jugador ya está en la sala, devolver éxito sin hacer nada
  if (existingPlayer) {
    console.log("Jugador ya estaba en la sala, no se hizo nada");
    return {
      success: true,
      players: roomPlayers,
      room: { id: roomId, status: room.status, hostId: room.host_id },
    };
  }
  // Todo OK: devolver éxito, lista de jugadores y datos de la sala con hostId
  console.log("Jugadores en la sala:", roomPlayers);
  return {
    success: true,
    players: roomPlayers,
    room: {
      id: roomId,
      status: room.status,
      hostId: room.host_id, // ID del host para usar en el frontend
    },
  };
};
