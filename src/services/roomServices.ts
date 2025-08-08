// src/services/roomService.ts
import { supabase } from "../lib/supabaseClient.ts";
import { Player, usePlayerStore } from "../stores/usePlayerStore.ts";
import { Room, RoomPlayer } from "../stores/useRoomStore.ts";
import { ensurePlayerCreated } from "./userServices.ts";

// Crea una nueva sala para un juego dado
export const createRoom = async ({
  gameId,
  roomName,
}: {
  gameId: string;
  roomName?: string;
}): Promise<{ room: Room; player: Player } | null> => {
  const player = await ensurePlayerCreated();
  if (!player) {
    console.error("No se pudo obtener el player.");
    return null;
  }

  // Crear la sala
  const { data: newRoom, error: roomError } = await supabase
    .from("rooms")
    .insert([
      {
        game_id: gameId,
        host_id: player.id,
        name: roomName,
        status: "waiting",
      },
    ])
    .select()
    .single();

  if (roomError || !newRoom) {
    console.error("Error al crear la sala:", roomError);
    return null;
  }

  // Agregar el player como host en room_players
  const { data: newRoomPlayer, error: playerInsertError } = await supabase
    .from("room_players")
    .insert([
      {
        room_id: newRoom.id,
        player_id: player.id,
        is_host: true,
        is_connect: true,
        alive: true,
      },
    ])
    .select()
    .single();

  if (playerInsertError || !newRoomPlayer) {
    console.error("Error al agregar host a la sala:", playerInsertError);
    return null;
  }

  return {
    room: newRoom,
    player: newRoomPlayer,
  };
};

//Permite al jugador unirse a una sala existente
// Retorna la sala si se unió correctamente, o null si hubo un error
// Asegura que el jugador esté creado antes de unirse
// Si el jugador ya está en la sala, simplemente retorna la sala
// Si la sala no existe o no permite unirse, retorna null
// Si la sala está en estado "waiting", permite unirse, si está en "playing" o "finished", no permite unirse
export const joinRoom = async (roomId: string): Promise<Room | null> => {
  const player = await ensurePlayerCreated();
  if (!player) {
    console.error("No se pudo obtener el player.");
    return null;
  }

  // 1. Obtener sala
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    console.error("Sala no encontrada:", roomError);
    return null;
  }

  if (room.status !== "waiting") {
    console.warn("La sala ya no permite unirse.");
    return null;
  }

  // 2. Verificar si ya está en esta sala
  const { data: existing, error: existingError } = await supabase
    .from("room_players")
    .select("*")
    .eq("room_id", roomId)
    .eq("player_id", player.id)
    .single();

  if (existing) {
    console.log("El jugador ya está en esta sala.");
    return room;
  }

  if (existingError && existingError.code !== "PGRST116") {
    console.error("Error al verificar existencia previa:", existingError);
    return null;
  }

  // 3. Insertar en room_players
  const { error: insertError } = await supabase.from("room_players").insert([
    {
      room_id: roomId,
      player_id: player.id,
      is_host: false,
      is_connect: true,
      alive: true,
    },
  ]);

  if (insertError) {
    console.error("No se pudo unir a la sala:", insertError);
    return null;
  }

  return room;
};

type ActiveRoomEntry = {
  room_id: string;
  rooms: { status: "waiting" | "playing" | "finished" };
};

// Busca la sala activa para el jugador actual
export const fetchActiveRoom = async () => {
  const player = usePlayerStore.getState().player;
  if (!player) return null;

  const { data, error } = await supabase
    .from("room_players")
    .select("room_id, rooms!inner(status)")
    .eq("player_id", player.id);

  if (error) {
    console.error("Error buscando sala activa:", error.message);
    return null;
  }

  const typedData: ActiveRoomEntry[] = (data ?? []).map((d) => ({
    room_id: d.room_id,
    rooms: Array.isArray(d.rooms) ? d.rooms[0] : d.rooms,
  }));

  const match = typedData.find((entry) =>
    ["waiting", "playing"].includes(entry.rooms.status)
  );

  return match?.room_id ?? null;
};

// Obtiene todos los jugadores de una sala
export const getRoomPlayers = async (
  roomId: string
): Promise<RoomPlayer[] | null> => {
  const { data, error } = await supabase
    .from("room_players")
    .select("player_id, is_host, is_connect, alive, players(name, avatar_url)")
    .eq("room_id", roomId);

  if (error) {
    console.error("Error al traer jugadores:", error);
    return null;
  }

  const players: RoomPlayer[] = data.map((p) => {
    const playerInfo = Array.isArray(p.players) ? p.players[0] : p.players;

    return {
      player_id: p.player_id,
      is_host: p.is_host,
      is_connect: p.is_connect,
      alive: p.alive,
      name: playerInfo?.name ?? "Sin nombre",
      avatar_url: playerInfo?.avatar_url ?? undefined,
    };
  });

  return players;
};
