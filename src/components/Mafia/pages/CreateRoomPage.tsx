import React, { useState } from "react";
import { supabase } from "../../../lib/supabaseClient.ts";
import { useNavigate } from "react-router-dom"; // Si usás react-router-dom

export default function CreateRoomPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateRoomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from({ length: 4 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const handleCreateRoom = async () => {
    if (!name.trim()) return;
    setLoading(true);

    const code = generateRoomCode();

    // Crear sala
    const { data: roomData, error: roomErr } = await supabase
      .from("rooms")
      .insert([{ code, phase: "lobby" }])
      .select()
      .single();

    if (roomErr || !roomData) {
      console.error("Error creando la sala:", roomErr);
      setLoading(false);
      return;
    }

    // Crear jugador
    const { data: playerData, error: playerErr } = await supabase
      .from("players")
      .insert([
        {
          name,
          room_id: roomData.id,
          is_host: true,
          alive: true,
          user_id: crypto.randomUUID(), // O tu lógica de autenticación
        },
      ])
      .select()
      .single();

    if (playerErr || !playerData) {
      console.error("Error creando jugador:", playerErr);
      setLoading(false);
      return;
    }

    // Navegar a la sala
    navigate(`/mafia/${code}?userId=${playerData.user_id}`);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">Crear sala de Mafia</h1>

      <label className="block mb-2">Tu nombre</label>
      <input
        className="input input-bordered w-full mb-4"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Escribe tu nombre"
      />

      <button
        className="btn btn-primary w-full"
        onClick={handleCreateRoom}
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear sala"}
      </button>
    </div>
  );
}
