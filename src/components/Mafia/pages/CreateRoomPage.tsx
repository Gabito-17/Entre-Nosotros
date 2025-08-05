import { useState } from "react";
import { Navigate } from "react-router-dom";
import { createRoom } from "../../../services/mafiaServices.ts";
import { useMafiaGame } from "../../../stores/useGameMafiaStore.ts";
import { useUserStore } from "../../../stores/useUserStore.ts";
import { QrBox } from "../../QrBox.tsx";

export const CreateRoomPage = () => {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const user = useUserStore((state) => state.user);
  const setRoomId = useMafiaGame((state) => state.setRoomId);
  const roomId = useMafiaGame((state) => state.roomId);

  const roomUrl = roomId ? `${window.location.origin}/room/${roomId}` : "";

  const handleCreateRoom = async () => {
    setErrorMsg("");

    if (!user?.id)
      return setErrorMsg("Debe iniciar sesión para crear una sala");
    if (!roomName.trim()) return setErrorMsg("Ingresá un nombre para la sala");

    setLoading(true);

    try {
      const result = await createRoom(user.id, roomName);

      if ("error" in result) throw new Error(result.error);

      // Guardamos el roomId en Zustand
      setRoomId(result.roomId);

      // Por ahora NO seteamos jugadores
      // Esperamos que el host se una manualmente luego
    } catch (err: any) {
      setErrorMsg(err.message || "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      alert("Link copiado al portapapeles");
    } catch {
      alert("No se pudo copiar el link");
    }
  };
  // Navegar a la sala creada
  const goToRoom = () => {
    if (roomId) {
      return <Navigate to={roomUrl} replace />;
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Crear una sala</h1>

      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          type="text"
          placeholder="Nombre de la sala"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          disabled={loading}
        />

        {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

        <button
          className="btn btn-primary w-full"
          onClick={handleCreateRoom}
          disabled={loading}
        >
          {loading ? "Creando sala..." : "Crear sala"}
        </button>
      </div>

      {roomId && (
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Compartí este link</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
              {roomUrl}
            </code>
            <button
              onClick={copyToClipboard}
              className="btn btn-sm btn-outline"
            >
              Copiar
            </button>
          </div>
          <QrBox value={roomUrl} />{" "}
          <button onClick={goToRoom} className="mt-6 btn btn-success w-full">
            Ir a la sala
          </button>
        </div>
      )}
    </div>
  );
};
