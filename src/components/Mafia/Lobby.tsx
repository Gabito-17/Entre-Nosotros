import { HeartIcon, KeyIcon, UserMinusIcon } from "@heroicons/react/24/solid"; // o /outline si preferís el estilo outline
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

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-base-100 rounded-lg shadow-lg">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-center flex-1">
          Sala: <span className="text-primary">{room?.name}</span>
        </h2>
        <label
          htmlFor="qr-modal"
          className="btn btn-sm btn-outline"
          title="Mostrar QR"
        >
          QR
        </label>
      </header>

      <section className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Jugadores en la sala</h3>
        <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
          {playersInRoom.length === 0 && (
            <p className="text-center text-gray-500">No hay jugadores aún</p>
          )}

          {playersInRoom.map((p) => (
            <div
              key={p.player_id}
              className={`card w-full transition-all duration-200 border ${
                p.is_connect
                  ? "border-green-200 bg-green-50/50"
                  : "border-gray-200 bg-gray-50/50 opacity-75"
              } ${!p.alive ? "border-red-200 bg-red-50/50" : ""}`}
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="avatar relative w-12 h-12 rounded-full overflow-hidden bg-primary/10 text-primary flex items-center justify-center font-semibold text-lg select-none">
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt={p.name} />
                      ) : (
                        getInitials(p.name)
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm truncate">
                        {p.name}
                      </h3>
                      {p.is_host && (
                        <span className="badge badge-sm badge-primary text-xs flex items-center">
                          <KeyIcon className="h-3 w-3 mr-1" />
                          Host
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-1">
                      <span
                        className={`badge badge-sm ${
                          p.alive ? "badge-primary" : "badge-error"
                        } text-xs flex items-center`}
                      >
                        {p.alive ? (
                          <>
                            <HeartIcon className="h-3 w-3 mr-1" /> Alive
                          </>
                        ) : (
                          <>
                            <UserMinusIcon className="h-3 w-3 mr-1" />{" "}
                            Eliminated
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
      <input type="checkbox" id="qr-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative max-w-sm">
          <label
            htmlFor="qr-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
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
  