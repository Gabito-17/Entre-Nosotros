"use client";

import { useEffect, useRef, useState } from "react";
import { useGameTrucoStore } from "../../../stores/useGameTrucoStore.ts";
import { ScoreDisplay } from "../displays/ScoreDisplay.tsx";
import { motion, AnimatePresence } from "framer-motion";
import { scoreUp, scoreDown } from "../../../lib/Animations.ts";
import { PencilIcon } from "@heroicons/react/24/outline";
import { usePlaySound } from "../../../stores/usePlaySound.ts";

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

  const playSound = usePlaySound();

  const color = nombre === "NOSOTROS" ? "text-primary" : "text-secondary";

  useEffect(() => {
    upSound.current = new Audio("/assets/sounds/point-Sound.wav");
  }, []);

  useEffect(() => {
    if (score !== prevScoreRef.current) {
      const isUp = score > prevScoreRef.current;
      setIsIncrement(isUp);
      setAnimationKey(score);

      if (upSound.current) {
        upSound.current.currentTime = 0;
        playSound(upSound.current);
      }

      prevScoreRef.current = score;
    }
  }, [score, playSound]);

  const handleChange = (delta: number) => {
    addPoint(equipo, delta);
  };

  const handleEdit = () => {
    setTempNombre(nombre);
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
    <div className="flex-1 flex flex-col bg-base-100  shadow-lg overflow-hidden max-w-sm mx-auto">
      {/* Header con nombre y edición */}
      <div className="bg-primary text-primary-content px-6 py-3 flex items-center justify-between uppercase font-extrabold tracking-wider text-lg">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            className="input input-md w-full max-w-xs text-black"
            value={tempNombre}
            onChange={(e) => setTempNombre(e.target.value)}
            onBlur={confirmEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") confirmEdit();
            }}
          />
        ) : (
          <>
            <span className="truncate">{nombre}</span>
            <button
              onClick={handleEdit}
              className="ml-3 p-1 rounded hover:bg-primary-focus transition"
              aria-label="Editar nombre"
            >
              <PencilIcon className="h-5 w-5 text-white" />
            </button>
          </>
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center p-6 min-h-[200px] w-full">
        {/* Área "Malas" */}
        <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center pointer-events-none">
          <span
            className="font-bold select-none user-select-none text-5xl"
            style={{ color: "rgba(220, 38, 38, 0.25)" }} // rojo más transparente
          >
            Malas
          </span>
        </div>

        {/* Área "Buenas" */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 flex items-center justify-center pointer-events-none">
          <span
            className="font-bold select-none user-select-none text-5xl"
            style={{ color: "rgba(34, 197, 94, 0.25)" }} // verde más transparente
          >
            Buenas
          </span>
        </div>
        {/* Línea divisoria */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 border-t-2 border-primary opacity-40 rounded w-3/5 pointer-events-none"
          style={{ filter: "drop-shadow(0 0 3px rgba(0,0,0,0.1))" }}
        />

        {/* ScoreDisplay */}
        <ScoreDisplay score={score} color={color} />
      </div>

      {/* Número grande con animación */}
      <div className="flex justify-center my-2 px-4 select-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={animationKey}
            className={`text-7xl font-extrabold ${color} drop-shadow-lg`}
            variants={isIncrement ? scoreUp : scoreDown}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Botones */}
      <div className="flex justify-center gap-6 mb-6 px-4">
        <button
          className="btn btn-md btn-outline btn-secondary w-20"
          onClick={() => handleChange(-1)}
          aria-label="Restar punto"
        >
          −
        </button>
        <button
          className="btn btn-md btn-outline btn-primary w-20"
          onClick={() => handleChange(1)}
          aria-label="Sumar punto"
        >
          +
        </button>
      </div>
    </div>
  );
}
