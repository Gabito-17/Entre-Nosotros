"use client";

import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";

interface FosforosDisplayProps {
  count: number; // puntaje total (1 a 30)
}

export default function FosforosDisplay({ count }: FosforosDisplayProps) {
  const maxScore = useGameTrucoStore((state) => state.maxScore);

  const fosforoImg = "/assets/truco/fosforo.svg"; // ⚠️ Ruta relativa desde public/
  const squareSize = 80;
  const fosforoSize = 45;

  // Determina el tamaño del grupo y posiciones según maxScore
  const groupSize = maxScore === 18 ? 3 : 5;
  const montanitaPositions =
    groupSize === 3
      ? [
          { top: 10, left: 5, rotate: "35deg" },
          { top: 28, left: 18, rotate: "90deg" },
          { top: 10, left: 30, rotate: "-35deg" },
        ]
      : [
          { top: 20, left: -5, rotate: "0deg" },
          { top: 20, left: 45, rotate: "180deg" },
          { top: -5, left: 20, rotate: "90deg" },
          { top: 45, left: 20, rotate: "-90deg" },
          { top: 20, left: 20, rotate: "45deg" },
        ];

  const totalVisualGroups = 6;

  const renderMontanita = (keyPrefix: string, fosforosCount: number) => (
    <div
      key={keyPrefix}
      className="relative "
      style={{ width: squareSize, height: squareSize }}
    >
      {montanitaPositions.slice(0, fosforosCount).map((pos, i) => (
        <img
          key={i}
          src={fosforoImg}
          alt={`fosforo ${i}`}
          style={{
            width: fosforoSize,
            height: fosforoSize,
            position: "absolute",
            top: pos.top,
            left: pos.left,
            transform: `rotate(${pos.rotate})`,
            transformOrigin: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      {Array.from({ length: totalVisualGroups }).map((_, i) => {
        const start = i * groupSize;
        const fosforosEnGrupo = Math.max(0, Math.min(count - start, groupSize));

        if (fosforosEnGrupo <= 0) {
          return (
            <div
              key={`empty-${i}`}
              style={{ width: squareSize, height: squareSize }}
            />
          );
        }

        return renderMontanita(`grupo-${i}`, fosforosEnGrupo);
      })}
    </div>
  );
}
