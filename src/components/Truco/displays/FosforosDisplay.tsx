"use client";

import { UserGroupIcon } from "@heroicons/react/16/solid";
import { use } from "framer-motion/client";
import { useEffect, useState } from "react";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { number } from "zod/v4";

interface FosforosDisplayProps {
  count: number; // puntaje total (1 a 30)
}

export default function FosforosDisplay({ count }: FosforosDisplayProps) {
  const [show, setShow] = useState(false);
  const maxScore = useGameTrucoStore((state) => state.maxScore);
  

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timeout);
  }, [count]);

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

  const fullGroups = Math.floor(count / groupSize);
  const remaining = count % groupSize;
  const totalGroups = Math.ceil(maxScore / groupSize);


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
      {Array.from({ length: totalGroups }).map((_, i) => {
        // Calcula cuántos fósforos tiene este grupo
        const start = i * groupSize;
        const end = start + groupSize;
        const fosforosEnGrupo = Math.max(
          0,
          Math.min(count - start, groupSize)
        );
        // Si no hay fósforos en este grupo, dibuja vacío
        if (fosforosEnGrupo <= 0) {
          return (
            <div
              key={`empty-${i}`}
              style={{ width: squareSize, height: squareSize }}
            />
          );
        }
        // Si hay fósforos, dibuja el grupo con la cantidad correspondiente
        return renderMontanita(`grupo-${i}`, fosforosEnGrupo);
      })}
    </div>
  );
}
