import React, { useEffect, useState } from "react";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";
import { QrBox } from "../../QrBox.tsx";
import { createRoomWithHost } from "../../../services/mafiaServices.ts";
import { getAllGames } from "../../../services/gamesServices.ts";

export const CreateRoomPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useUserStore((state) => state.user);
  const setRoomId = useMafiaGame((state) => state.setRoomId);
  const setPlayers = useMafiaGame((state) => state.setPlayers);
  const roomId = useMafiaGame((state) => state.roomId);

  const handleCreateRoom = async () => {
    if (!user) return alert("Debe iniciar sesión para crear una sala");
    if (!name.trim()) return alert("Ingresá tu nombre");

    setLoading(true);
    const result = await createRoomWithHost(user.id, name);
    setLoading(false);

    if ("error" in result) {
      alert(result.error);
      return;
    }

    setRoomId(result.roomId);
    setPlayers([
      {
        id: user.id,
        name,
        alive: true,
        isHost: true,
        isSelf: true,
      },
    ]);
  };

  const roomUrl = roomId ? `${window.location.origin}/room/${roomId}` : "";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      alert("Link copiado al portapapeles");
    } catch (err) {
      alert("No se pudo copiar el link");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Crear una sala</h1>

      <input
        className="input input-bordered w-full mb-4"
        type="text"
        placeholder="Tu nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button
        className="btn btn-primary w-full"
        onClick={handleCreateRoom}
        disabled={loading}
      >
        {loading ? "Creando..." : "Crear sala"}
      </button>

      {roomId && (
        <div className="mt-6">
          <p className="font-semibold mb-2">Compartí este link:</p>
          <div className="flex items-center justify-center gap-2 mb-2">
            <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
              {roomUrl}
            </code>
            <button onClick={copyToClipboard} className="btn btn-sm">
              Copiar
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <QrBox value={roomUrl} />
          </div>
        </div>
      )}
    </div>
  );
};
