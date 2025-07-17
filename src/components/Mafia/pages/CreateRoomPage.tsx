import React, { useState } from 'react';
import { useMafiaGame } from '../../../stores/useGameMafiaStore.ts';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeSVG } from 'qrcode.react';

export const CreateRoomPage = () => {
  const [name, setName] = useState('');
  const setRoomId = useMafiaGame((state) => state.setRoomId);
  const setPlayers = useMafiaGame((state) => state.setPlayers);
  const myId = useMafiaGame((state) => state.myId);
  const roomId = useMafiaGame((state) => state.roomId);

  const handleCreateRoom = () => {
    if (!name.trim()) return alert('Ingresá tu nombre');

    const newRoomId = uuidv4().slice(0, 6);
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

  const roomUrl = `${window.location.origin}/room/${roomId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      alert('Link copiado al portapapeles');
    } catch (err) {
      alert('No se pudo copiar el link');
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
      >
        Crear sala
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
            <QRCodeSVG value={roomUrl} size={128} />
          </div>
        </div>
      )}
    </div>
  );
};
