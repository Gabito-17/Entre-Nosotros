import { TrashIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { useGameBritneyStore } from "../../stores/useGameBritneyStore.ts";
import { useUiStore } from "../../stores/useUiStore.ts";

export default function PlayerModal() {
  const selectedPlayer = useUiStore((state) => state.selectedPlayer);
  const closePlayerModal = useUiStore((state) => state.closePlayerModal);
  const removePlayer = useGameBritneyStore((state) => state.removePlayer);

  const contadorRef = useRef(0);
  const [clickCount, setClickCount] = useState(0);

  if (!selectedPlayer) return null;

  const colorClasses = [
    "btn-error", // después del primer click
    "btn-error",
  ];

  const scaleValues = [1, 1.05];
  const currentColor =
    colorClasses[Math.min(clickCount, colorClasses.length - 1)];
  const currentScale =
    scaleValues[Math.min(clickCount, scaleValues.length - 1)];

  const totalClicks = 3;
  const isShaking = clickCount === totalClicks - 1;

  const handleRemovePlayer = () => {
    contadorRef.current += 1;
    setClickCount((prev) => prev + 1);

    if (contadorRef.current >= totalClicks) {
      removePlayer(selectedPlayer.id);
      closePlayerModal();
      contadorRef.current = 0;
      setClickCount(0);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex justify-between gap-4 mb-4">
          <h3 className="text-lg">
            Puntajes de <text className="font-bold">{selectedPlayer.name}</text>
          </h3>
          <button
            className={`btn btn-sm ${
              clickCount === 0 ? "btn-outline" : ""
            } ${currentColor} ${isShaking ? "animate-tilt-shake" : ""}`}
            onClick={handleRemovePlayer}
            style={{
              transform: `scale(${currentScale})`,
              transition: "transform 0.4s ease, background-color 0.4s ease",
            }}
          >
            <TrashIcon className="h-4" />
            Eliminar Jugador
          </button>
        </div>

        {selectedPlayer.scores.length === 0 ? (
          <p>No hay puntajes registrados.</p>
        ) : (
          <table className="table-auto w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr>
                <th className="border border-gray-300 px-2 py-1">Ronda</th>
                <th className="border border-gray-300 px-2 py-1">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {selectedPlayer.scores.map((score, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-2 py-1">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              closePlayerModal();
              setClickCount(0);
              contadorRef.current = 0;
            }}
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Animación tilt-shake personalizada */}
      <style>
        {`
          .animate-tilt-shake {
            animation: tilt-shake 0.4s infinite;
          }
          @keyframes tilt-shake {
            0% { transform: scale(1.1) rotate(0deg);}
            20% { transform: scale(1.1) rotate(-3deg);}
            40% { transform: scale(1.1) rotate(3deg);}
            60% { transform: scale(1.1) rotate(-3deg);}
            80% { transform: scale(1.1) rotate(3deg);}
            100% { transform: scale(1.1) rotate(0deg);}
          }
        `}
      </style>
    </div>
  );
}
