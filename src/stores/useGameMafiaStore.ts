"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import { useMafiaGame } from "../stores/useGameMafiaStore.ts";

interface PlayerFromDB {
  id: string;
  name: string;
  role?: string;
  alive: boolean;
  is_host: boolean;
  user_id: string;
}

interface RoomFromDB {
  id: string;
  code: string;
  phase: string;
}

interface MafiaGamePageProps {
  roomCode: string;
  userId: string;
}

export default function MafiaGamePage({ roomCode, userId }: MafiaGamePageProps) {
  const {
    setRoomId,
    setPlayers,
    setPhase,
    setMyId,
    reset,
    players,
    phase,
  } = useMafiaGame();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomCode || !userId) return;

    const loadInitialData = async () => {
      setLoading(true);

      // Obtener la sala
      const { data: roomData, error: roomErr } = await supabase
        .from<RoomFromDB>("rooms")
        .select("id, phase")
        .eq("code", roomCode)
        .single();

      if (roomErr || !roomData) {
        console.error("Sala no encontrada", roomErr);
        setLoading(false);
        return;
      }

      setRoomId(roomData.id);
      setPhase(roomData.phase);

      // Obtener jugadores
      const { data: playersData, error: playersErr } = await supabase
        .from<PlayerFromDB>("players")
        .select("*")
        .eq("room_id", roomData.id);

      if (playersErr) {
        console.error("Error cargando jugadores", playersErr);
        setLoading(false);
        return;
      }

      setPlayers(
        playersData.map((p) => ({
          id: p.id,
          name: p.name,
          role: p.role as any,
          alive: p.alive,
          isHost: p.is_host,
          isSelf: p.user_id === userId,
        }))
      );

      const myPlayer = playersData.find((p) => p.user_id === userId);
      if (myPlayer) setMyId(myPlayer.id);

      setLoading(false);
    };

    loadInitialData();

    // Suscripciones realtime
    const roomChannel = supabase
      .channel(`room-${roomCode}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players", filter: `room_id=eq.${roomCode}` },
        () => {
          loadInitialData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rooms", filter: `code=eq.${roomCode}` },
        (payload) => {
          if (payload.new?.phase) {
            setPhase(payload.new.phase as any);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      reset();
    };
  }, [roomCode, userId]);

  if (loading) return <div>Cargando sala...</div>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Sala {roomCode}</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Jugadores</h2>
        <ul className="space-y-2">
          {players.map((p) => (
            <li
              key={p.id}
              className="p-2 rounded bg-base-200 flex justify-between"
            >
              <span>{p.name}</span>
              <span className="text-sm opacity-70">{p.alive ? "🟢" : "⚰️"}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <p>
          Fase actual: <strong>{phase}</strong>
        </p>
      </section>

      <section className="mt-8">
        {/* Aquí podés agregar botones para controlar el flujo de juego */}
        <button className="btn btn-accent">Iniciar partida</button>
      </section>
    </div>
  );
}
