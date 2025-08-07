import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, fetchActiveRoom } from "../../../services/roomServices.ts";
import { usePlayerStore } from "../../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../../stores/useRoomStore.ts";

export default function CreateRoomPage() {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const player = usePlayerStore((state) => state.player);
  const setRoom = useRoomStore((state) => state.setRoom);

  const navigate = useNavigate();

  useEffect(() => {
    const checkActiveRoom = async () => {
      if (!player) return;

      const roomId = await fetchActiveRoom();

      if (roomId) {
        navigate(`/mafia/sala/${roomId}`);
      }
    };

    checkActiveRoom();
  }, [player, navigate]);

  const handleCreateRoom = async () => {
    if (!player) {
      setError("No se encontró el jugador.");
      return;
    }

    if (roomName.trim() === "") {
      setError("Por favor, ingresá un nombre para la sala.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await createRoom({
      gameId: "2081b21e-f5ec-49d0-b245-b255c7d2dd64", // ID del juego de Mafia
      roomName: roomName,
    });

    if (error || !res) {
      console.error("Error creando la sala:", error);
      setError("No se pudo crear la sala.");
      setLoading(false);
      return;
    }

    setRoom(res.room);
    setLoading(false);
    navigate(`/mafia/sala/${res.room.id}`);
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-3xl">Crear nueva sala</h2>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Nombre de la sala</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Mafia nocturna #1"
              className="input input-bordered"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-error mt-4 text-sm">{error}</div>
          )}

          <div className="card-actions mt-6 justify-end">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={handleCreateRoom}
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear sala"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
