"use client";

import { useEffect, useState } from "react";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import PorotosDisplay from "./CoffeeDisplay.tsx";
import FosforosDisplay from "./FosforosDisplay.tsx";

interface ScoreDisplayProps {
  score: number;
  color: string;
}

export function ScoreDisplay({ score, color }: ScoreDisplayProps) {
  const [displayedScore, setDisplayedScore] = useState(score);
  const pointStyle = useGameTrucoStore((state) => state.pointStyle);

  useEffect(() => {
    setDisplayedScore(score);
  }, [score]);

  const renderScore = () => {
    if (pointStyle === "fosforo") {
      return <FosforosDisplay count={displayedScore} />;
    }

    if (pointStyle === "cafe") {
      return <PorotosDisplay count={displayedScore} />;
    }

    if (pointStyle !== "lines") {
      return (
        <div className="flex justify-center animate-fade-in">
          {Array.from({ length: displayedScore }).map((_, i) => (
            <img
              key={i}
              src={`/assets/truco/${pointStyle}.png`}
              alt={`punto ${i}`}
              className="w-6 h-6 object-contain"
            />
          ))}
        </div>
      );
    }

    // Estilo "lines" (SVG clásico) - ocupar todo el alto del contenedor
    const groups = Math.floor(displayedScore / 5);
    const remaining = displayedScore % 5;
    const totalGroups = 6; // Para 30 puntos, 6 filas
    const groupSize = 80;
    const elements: JSX.Element[] = [];

    // Grupos completos
    for (let i = 0; i < groups; i++) {
      elements.push(
        <div
          key={`group-${i}`}
          className="flex justify-center w-full"
          style={{ width: groupSize, height: groupSize }}
        >
          <svg
            width={groupSize}
            height={groupSize}
            viewBox="0 0 45 45"
            className={color}
          >
            {[9, 18, 27, 36].map((x, idx) => (
              <line
                key={idx}
                x1={x}
                y1="8"
                x2={x}
                y2="37"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
            <line
              x1="5"
              y1="40"
              x2="40"
              y2="10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    // Grupo parcial
    if (remaining > 0) {
      elements.push(
        <div
          key="remaining"
          className="flex justify-center w-full"
          style={{ width: groupSize, height: groupSize }}
        >
          <svg
            width={groupSize}
            height={groupSize}
            viewBox="0 0 45 45"
            className={color}
          >
            {Array.from({ length: remaining }).map((_, i) => (
              <line
                key={i}
                x1={9 + i * 9}
                y1="8"
                x2={9 + i * 9}
                y2="37"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </svg>
        </div>
      );
    }

    // Relleno para que siempre haya 6 filas
    const emptyRows = totalGroups - groups - (remaining > 0 ? 1 : 0);
    for (let i = 0; i < emptyRows; i++) {
      elements.push(
        <div
          key={`empty-${i}`}
          className="w-full"
          style={{ width: groupSize, height: groupSize }}
        />
      );
    }

    return <div>{elements}</div>;
  };

  return <div key={score}>{renderScore()}</div>;
}
