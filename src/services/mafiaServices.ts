import { v4 as uuidv4 } from "uuid";
import { supabase } from "../lib/supabaseClient.ts";

export const createRoom = async (
  userId: string,
  roomName: string
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
      name: roomName,
      status: "preparing",
    },
  ]);

  if (roomError) {
    console.error(roomError);
    return { error: "No se pudo crear la sala" };
  }

  return { roomId: newRoomId };
};

// Verifica si el jugador está en la sala y si está conectado
export const isPlayerInRoom = async (
  roomId: string,
  playerId: string
): Promise<{ success: boolean; isConnected?: boolean; message?: string }> => {
  const { data: roomPlayer, error } = await supabase
    .from("room_players")
    .select("player_id, isConnect")
    .eq("room_id", roomId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (error) {
    return { success: false, message: "Error al consultar la sala o jugador" };
  }

  if (!roomPlayer) {
    return { success: false, message: "Jugador no encontrado en la sala" };
  }

  return {
    success: true,
    isConnected: roomPlayer.isConnect,
  };
};

// Ingresar jugador a sala (si es posible), y marcar como conectado
export const joinRoom = async (
  roomId: string,
  playerId: string,
  playerName: string
): Promise<{
  success: boolean;
  players?: any[];
  room?: any;
  message?: string;
}> => {
  // 1. Verificar que la sala existe y esté en preparación y que el jugador no este en otra sala
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("id, status, host_id")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    return { success: false, message: "Sala no encontrada" };
  }

  if (room.status !== "preparing") {
    return { success: false, message: "La sala ya está en curso o finalizada" };
  }

  // 2. Verificar si el jugador ya está en la sala
  const { data: existingPlayer, error: existingError } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", roomId)
    .eq("player_id", playerId)
    .maybeSingle();

  if (existingError) {
    return { success: false, message: "Error al verificar jugador" };
  }

  if (!existingPlayer) {
    // Si no está, lo insertamos como nuevo
    const { error: insertError } = await supabase.from("room_players").insert([
      {
        room_id: roomId,
        player_id: playerId,
        name: playerName,
        joined_at: new Date().toISOString(),
        is_host: false,
        alive: true,
        isConnect: true, // 👈 importante: lo marcamos como conectado
      },
    ]);

    if (insertError) {
      return { success: false, message: "No se pudo unir a la sala" };
    }
  }
  // 3. Obtener todos los jugadores de la sala
  const { data: roomPlayers, error: playersError } = await supabase
    .from("room_players")
    .select("player_id, name, is_host, alive, joined_at, isConnect")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (playersError) {
    return { success: false, message: "Error al obtener jugadores" };
  }

  return {
    success: true,
    players: roomPlayers,
    room: {
      id: room.id,
      status: room.status,
      hostId: room.host_id,
    },
  };
};

// Valida si una sala permite unirse
export const validateRoomJoin = async (
  roomId: string
): Promise<{ success: boolean; message?: string }> => {
  // Buscar la sala
  const { data: room, error } = await supabase
    .from("rooms")
    .select("status")
    .eq("id", roomId)
    .single();

  if (error || !room) {
    return { success: false, message: "La sala no existe" };
  }

  if (room.status !== "preparing") {
    return {
      success: false,
      message: "La sala ya está en curso o fue finalizada",
    };
  }

  // (Opcional) Validar cantidad máxima de jugadores
  const { count, error: countError } = await supabase
    .from("room_players")
    .select("*", { count: "exact", head: true })
    .eq("room_id", roomId);

  if (countError) {
    return { success: false, message: "No se pudo validar la sala" };
  }

  const MAX_PLAYERS = 10;
  if (count !== null && count >= MAX_PLAYERS) {
    return { success: false, message: "La sala está llena" };
  }

  return { success: true };
};

//Iniciar Partida

export const startGame = async (
  roomId: string,
  hostId: string
): Promise<{
  success: boolean;
  players?: any[];
  phase?: string;
  message?: string;
}> => {
  // 1. Verificar que la sala existe y obtener datos importantes
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("host_id, status, phase")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    return { success: false, message: "Sala no encontrada" };
  }

  // 2. Verificar que quien llama es el host
  if (room.host_id !== hostId) {
    return { success: false, message: "Solo el host puede iniciar la partida" };
  }

  // 3. Verificar que la sala esté en estado 'preparing' (no iniciada)
  if (room.status !== "preparing") {
    return {
      success: false,
      message: "La partida ya ha comenzado o finalizado",
    };
  }

  // 4. Obtener jugadores activos en la sala
  const { data: players, error: playersError } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", roomId);

  if (playersError || !players) {
    return { success: false, message: "Error al obtener jugadores" };
  }

  // 5. Validar mínimo de jugadores para iniciar (ejemplo 4)
  if (players.length < 4) {
    return {
      success: false,
      message: "No hay suficientes jugadores para iniciar",
    };
  }

  // 6. Asignar roles aleatoriamente
  const rolesPool = ["mafia", "mafia", "doctor", "police"];

  while (rolesPool.length < players.length) {
    rolesPool.push("civilian");
  }

  // Shuffle rolesPool
  for (let i = rolesPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rolesPool[i], rolesPool[j]] = [rolesPool[j], rolesPool[i]];
  }

  // 7. Actualizar roles y estado de los jugadores (alive = true)
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    const role = rolesPool[i];

    const { error: updateError } = await supabase
      .from("room_players")
      .update({ role, alive: true })
      .eq("player_id", player.player_id)
      .eq("room_id", roomId);

    if (updateError) {
      console.error(
        "Error al actualizar rol de jugador",
        player.player_id,
        updateError
      );
      return { success: false, message: "Error actualizando roles" };
    }
  }

  // 8. Actualizar fase y estado de la sala a en curso (started)
  const { error: updateRoomError } = await supabase
    .from("rooms")
    .update({ phase: "night", status: "started" })
    .eq("id", roomId);

  if (updateRoomError) {
    return { success: false, message: "Error actualizando estado de la sala" };
  }

  return {
    success: true,
    players: players.map((p, i) => ({
      player_id: p.player_id,
      role: rolesPool[i],
      alive: true,
      name: p.name,
      is_host: p.is_host,
    })),
    phase: "night",
  };
};
