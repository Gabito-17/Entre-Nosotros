"use client";

import { useEffect, useState } from "react";

interface FosforosDisplayProps {
  count: number; // puntaje total (1 a 30)
}

export default function FosforosDisplay({ count }: FosforosDisplayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timeout);
  }, [count]);

  const fosforoImg = "/assets/truco/fosforo.svg"; // ⚠️ Ruta relativa desde public/
  const squareSize = 80;
  const fosforoSize = 45;

  const montanitaPositions = [
    { top: 20, left: -5, rotate: "0deg" },
    { top: 20, left: 45, rotate: "180deg" },
    { top: -5, left: 20, rotate: "90deg" },
    { top: 45, left: 20, rotate: "-90deg" },

    { top: 20, left: 20, rotate: "45deg" },
  ];

  const fullGroups = Math.floor(count / 5);
  const remaining = count % 5;

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

  const totalGroups = 6;

  return (
    <div
      className="flex flex-col items-center"
      style={{ minHeight: totalGroups * (squareSize + 8) }}
    >
      {Array.from({ length: fullGroups }).map((_, i) =>
        renderMontanita(`full-${i}`, 5)
      )}
      {remaining > 0 && renderMontanita("partial", remaining)}
      {Array.from({
        length: totalGroups - fullGroups - (remaining > 0 ? 1 : 0),
      }).map((_, i) => (
        <div
          key={`empty-${i}`}
          style={{ width: squareSize, height: squareSize }}
          className="mb-2"
        />
      ))}
    </div>
  );
}
