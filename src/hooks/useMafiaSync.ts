import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import { useMafiaGame } from "../stores/useGameMafiaStore.ts";

export function useMafiaSync(roomCode: string, userId: string) {
  const {
    setRoomId,
    setPlayers,
    setPhase,
    setMyId,
    reset,
  } = useMafiaGame();

  useEffect(() => {
    if (!roomCode || !userId) return;

    let currentRoomId: string | null = null;

    // Cargar sala y jugadores inicialmente
    const loadInitialData = async () => {
      // Obtener la sala
      const { data: roomData, error: roomErr } = await supabase
        .from("rooms")
        .select("id, phase")
        .eq("code", roomCode)
        .single();

      if (roomErr || !roomData) {
        console.error("Error al cargar sala", roomErr);
        return;
      }

      currentRoomId = roomData.id;
      setRoomId(roomData.id);
      setPhase(roomData.phase);

      // Obtener jugadores
      const { data: playersData, error: playersErr } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomData.id);

      if (playersErr) {
        console.error("Error al cargar jugadores", playersErr);
        return;
      }

      setPlayers(
        playersData.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          alive: p.alive,
          isHost: p.is_host,
          isSelf: p.user_id === userId,
        }))
      );

      // Establecer tu ID de jugador
      const myPlayer = playersData.find((p) => p.user_id === userId);
      if (myPlayer) setMyId(myPlayer.id);
    };

    loadInitialData();

    // Subscripción realtime a cambios en players y room
    const roomChannel = supabase
      .channel(`room-${roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${currentRoomId}` },
        () => {
          loadInitialData();
        }
      )
      .on(
  "postgres_changes",
  { event: "*", schema: "public", table: "rooms", filter: `code=eq.${roomCode}` },
  (payload) => {
    const newData = payload.new as { phase?: string };

if (
  newData.phase === 'lobby' ||
  newData.phase === 'night' ||
  newData.phase === 'day' ||
  newData.phase === 'ended'
) {
  setPhase(newData.phase);
}
  }
)
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      reset();
    };
  }, [roomCode, userId]);
}
