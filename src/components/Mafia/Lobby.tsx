import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.ts";
import { usePlayerStore } from "../../stores/usePlayerStore.ts";
import { useRoomStore } from "../../stores/useRoomStore.ts";
import { QrBox } from "../QrBox.tsx";

export default function Lobby() {
  const navigate = useNavigate();
  const room = useRoomStore((state) => state.room);
  const playersInRoom = useRoomStore((state) => state.players);
  const player = usePlayerStore((state) => state.player);

  const [loading, setLoading] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  const isHost = playersInRoom.some(
    (p) => p.player_id === player?.id && p.is_host
  );

  const fullUrl = `http://192.168.18.3:3000/mafia/sala/${room?.id}`;

  const handleStartGame = async () => {
    if (!room) return;
    setLoading(true);

    const { error } = await supabase
      .from("rooms")
      .update({ status: "playing", phase: "night" })
      .eq("id", room.id);

    if (error) {
      console.error("Error starting game:", error.message);
    }

    setLoading(false);
  };

  const handleLeaveRoom = async () => {
    if (!room || !player) return;

    const { error } = await supabase
      .from("room_players")
      .delete()
      .eq("room_id", room.id)
      .eq("player_id", player.id);

    if (error) {
      console.error("Error leaving room:", error.message);
      return;
    }

    navigate("/mafia");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopySuccess("¡Copiado!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center flex-1">
          Sala: <span className="text-primary">{room?.id.slice(0, 6)}</span>
        </h2>
        <button
          className="btn btn-sm btn-outline"
          onClick={() => setIsQrOpen(true)}
          title="Mostrar QR"
          aria-label="Mostrar código QR"
        >
          QR
        </button>
      </header>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Jugadores en la sala</h3>
        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {playersInRoom.map((p) => (
            <div
              key={p.player_id}
              className="flex items-center gap-4 bg-base-200 p-4 rounded-lg shadow-sm"
            >
              <div className="avatar">
                <div className="w-14 h-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={p.avatar_url || "/default-avatar.png"}
                    alt={p.name}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-sm text-gray-500">
                  {p.is_host ? "Host" : p.alive ? "Jugador" : "Muerto"}
                </p>
              </div>
              <div
                className={`badge ${
                  p.is_connect ? "badge-success" : "badge-error"
                }`}
                title={p.is_connect ? "Conectado" : "Desconectado"}
              >
                {p.is_connect ? "Conectado" : "Desconectado"}
              </div>
            </div>
          ))}
          {playersInRoom.length === 0 && (
            <p className="text-center text-gray-500">No hay jugadores aún</p>
          )}
        </div>
      </section>

      <footer className="flex justify-between items-center">
        <button className="btn btn-outline" onClick={handleLeaveRoom}>
          Salir
        </button>

        {isHost && (
          <button
            className={`btn btn-primary ${loading ? "loading" : ""}`}
            onClick={handleStartGame}
            disabled={loading}
          >
            Iniciar partida
          </button>
        )}
      </footer>

      {/* Modal para QR */}
      <input
        type="checkbox"
        id="qr-modal"
        className="modal-toggle"
        checked={isQrOpen}
      />
      <div className="modal">
        <div className="modal-box relative max-w-sm">
          <label
            htmlFor="qr-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setIsQrOpen(false)}
            aria-label="Cerrar modal"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold mb-4">Código QR para la sala</h3>
          <div className="flex justify-center mb-4">
            <QrBox value={fullUrl || ""} size={180} />
          </div>
          <input
            type="text"
            className="input input-bordered w-full mb-3 text-sm"
            readOnly
            value={fullUrl || ""}
            onClick={(e) => e.currentTarget.select()}
            aria-label="Link de la sala"
          />
          <button className="btn btn-outline w-full" onClick={copyToClipboard}>
            {copySuccess ? copySuccess : "Copiar enlace"}
          </button>
        </div>
      </div>
    </div>
  );
}
