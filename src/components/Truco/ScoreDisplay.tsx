"use client";

import { useEffect, useState } from "react";
import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";
import FosforosDisplay from "./FosforosDisplay.tsx";
import PorotosDisplay from "./PorotoDisplay.tsx";

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

    if (pointStyle === "poroto") {
      return <PorotosDisplay count={displayedScore} />;
    }

    if (pointStyle !== "lines") {
      return (
        <div className="flex flex-wrap justify-center gap-1 animate-fade-in">
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

    // Estilo "lines" (SVG clásico)
    const groups = Math.floor(displayedScore / 5);
    const remaining = displayedScore % 5;
    const elements: JSX.Element[] = [];

    for (let i = 0; i < groups; i++) {
      elements.push(
        <div key={`group-${i}`} className="relative ">
          <svg width="35" height="45" viewBox="0 0 35 45" className={color}>
            {[6, 13, 20, 27].map((x, idx) => (
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
              x1="3"
              y1="32"
              x2="30"
              y2="13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    }

    if (remaining > 0) {
      elements.push(
        <div key="remaining" className="relative ">
          <svg width="35" height="45" viewBox="0 0 35 45" className={color}>
            {Array.from({ length: remaining }).map((_, i) => (
              <line
                key={i}
                x1={6 + i * 7}
                y1="8"
                x2={6 + i * 7}
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

    return elements.length > 0 ? (
      elements
    ) : (
      <div className="text-2xl opacity-30">-</div>
    );
  };

  return <div key={score}>{renderScore()}</div>;
}
