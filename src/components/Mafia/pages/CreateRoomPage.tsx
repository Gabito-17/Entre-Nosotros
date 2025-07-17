import React, { useState } from "react";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { v4 as uuidv4 } from "uuid";

export const CreateRoomPage = () => {
  const [name, setName] = useState("");
  const setRoomId = useMafiaGame((state) => state.setRoomId);
  const setPlayers = useMafiaGame((state) => state.setPlayers);
  const myId = useMafiaGame((state) => state.myId);
  const roomId = useMafiaGame((state) => state.roomId);

  const handleCreateRoom = () => {
    if (!name.trim()) return alert("Ingresá tu nombre");

    const newRoomId = uuidv4().slice(0, 6); // ID corto
    setRoomId(newRoomId);

    setPlayers([
      {
        id: myId!,
        name,
        alive: true,
        isHost: true,
        isSelf: true,
      },
    ]);
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

      <button className="btn btn-primary w-full" onClick={handleCreateRoom}>
        Crear sala
      </button>

      {roomId && (
        <div className="mt-4">
          <p>Sala creada con ID:</p>
          <code className="font-mono text-lg">{roomId}</code>
        </div>
      )}
    </div>
  );
};
