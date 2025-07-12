"use client";

import { useEffect, useRef, useState } from "react";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { ScoreDisplay } from "../displays/ScoreDisplay.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { scoreUp, scoreDown } from "../../../lib/Animations.ts";
import { PencilIcon } from "@heroicons/react/24/outline";

interface PanelEquipoProps {
  equipo: "equipo1" | "equipo2";
}

export default function PanelEquipo({ equipo }: PanelEquipoProps) {
  const score = useGameTrucoStore((state) =>
    equipo === "equipo1" ? state.score1 : state.score2
  );
  const nombre = useGameTrucoStore((state) =>
    equipo === "equipo1" ? state.nombre1 : state.nombre2
  );
  const setNombre = useGameTrucoStore((state) => state.setNombre);
  const addPoint = useGameTrucoStore((state) => state.addPoint);

  const [editing, setEditing] = useState(false);
  const [tempNombre, setTempNombre] = useState(nombre);

  const [animationKey, setAnimationKey] = useState(score);
  const [isIncrement, setIsIncrement] = useState(true);
  const prevScoreRef = useRef(score);

  const inputRef = useRef<HTMLInputElement>(null);
  const upSound = useRef<HTMLAudioElement | null>(null);

  const color = nombre === "NOSOTROS" ? "text-primary" : "text-secondary";

  useEffect(() => {
    upSound.current = new Audio("/assets/sounds/point-Sound.wav");
  }, []);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      const isUp = score > prevScoreRef.current;
      setIsIncrement(isUp);
      setAnimationKey(score);

      const sound = upSound.current;
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

  const handleEdit = () => {
    setTempNombre(nombre); // reset to current in case it was changed elsewhere
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const confirmEdit = () => {
    setEditing(false);
    if (tempNombre.trim() !== "") {
      setNombre(equipo, tempNombre.trim());
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="w-full bg-primary text-primary-content text-xl shadow-md px-4 py-2 flex items-center justify-between uppercase font-bold">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            className="input input-sm text-black w-full mr-2"
            value={tempNombre}
            onChange={(e) => setTempNombre(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmEdit();
            }}
          />
        ) : (
          <>
            <span>{nombre}</span>
            <button onClick={handleEdit} className="ml-2">
              <PencilIcon className="h-5 w-5 text-white hover:text-base-300" />
            </button>
          </>
        )}
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
