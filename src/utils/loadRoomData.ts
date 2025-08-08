import { supabase } from "../lib/supabaseClient";
import { useRoomStore } from "../stores/useRoomStore";
import { getRoomPlayers } from "../services/roomServices";

// Carga la sala y sus jugadores en el store
export const loadRoomData = async (roomId: string) => {
  const { setRoom, setPlayers } = useRoomStore.getState();

  // 1. Obtener datos de la sala
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  if (roomError || !room) {
    console.error("Error cargando sala:", roomError);
    return null;
  }

  setRoom(room);

  // 2. Obtener jugadores de la sala
  const players = await getRoomPlayers(roomId);

  if (!players) {
    console.error("Error cargando jugadores.");
    return null;
  }

  setPlayers(players);

  return { room, players };
};