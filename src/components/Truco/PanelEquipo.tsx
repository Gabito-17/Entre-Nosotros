"use client";

import { useEffect, useRef, useState } from "react";
import { useGameTrucoStore } from "../../stores/useGameTrucoStore.ts";
import { ScoreDisplay } from "./ScoreDisplay.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { scoreUp, scoreDown } from "../../lib/Animations.ts";

interface PanelEquipoProps {
  equipo: "equipo1" | "equipo2";
  nombre: string;
}

export default function PanelEquipo({ equipo, nombre }: PanelEquipoProps) {
  const score = useGameTrucoStore((state) =>
    equipo === "equipo1" ? state.score1 : state.score2
  );
  const addPoint = useGameTrucoStore((state) => state.addPoint);

  const [animationKey, setAnimationKey] = useState(score);
  const [isIncrement, setIsIncrement] = useState(true);
  const prevScoreRef = useRef(score);

  const color = nombre === "NOSOTROS" ? "text-primary" : "text-secondary";

  // Audio refs
  const upSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    upSound.current = new Audio("/assets/sounds/point-Sound.wav");
  }, []);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      const isUp = score > prevScoreRef.current;
      setIsIncrement(isUp);
      setAnimationKey(score);

      const sound = isUp ? upSound.current : upSound.current;
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }

      prevScoreRef.current = score;
    }
  }, [score]);

  const handleChange = (delta: number) => {
    addPoint(equipo, delta);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="w-full text-center bg-primary uppercase font-bold text-primary-content text-xl shadow-md">
        {nombre}
      </div>

      <div className="w-full flex justify-center overflow-y-auto">
        <ScoreDisplay score={score} color={color} />
      </div>

      <div className="w-full flex justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={animationKey}
            className={`text-6xl select-none ${color} drop-shadow-lg z-30 my-4`}
            variants={isIncrement ? scoreUp : scoreDown}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="w-full flex justify-center gap-4 mb-4">
        <button
          className="btn btn-md btn-outline btn-secondary"
          onClick={() => handleChange(-1)}
        >
          -
        </button>
        <button
          className="btn btn-md btn-outline btn-primary"
          onClick={() => handleChange(+1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
