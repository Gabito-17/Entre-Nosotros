"use client";

import { useEffect, useState } from "react";

interface PorotosDisplayProps {
  count: number; // puntaje total (1 a 30)
}

export default function PorotosDisplay({ count }: PorotosDisplayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timeout);
  }, [count]);

  const porotoImg = "/assets/truco/poroto.png"; // ruta a la imagen poroto
  const squareSize = 80; // tamaño del contenedor cuadrado
  const porotoSize = 30; // tamaño individual del poroto

  // Posiciones "montañita" para hasta 5 porotos
  // Intenté simular una pequeña pirámide visual
  const montanitaPositions = [
    { top: 40, left: 0 },   // base izquierda
    { top: 40, left: 50 },  // base derecha
    { top: 20, left: 25 },  // centro medio arriba
    { top: 0, left: 10 },   // pico izquierdo
    { top: 0, left: 40 },   // pico derecho
  ];

  const fullGroups = Math.floor(count / 5);
  const remaining = count % 5;

  const matchClass = `absolute object-contain transition-opacity duration-700 ${
    show ? "opacity-100" : "opacity-0"
  }`;

  const renderMontanita = (keyPrefix: string, porotosCount: number) => (
    <div
      key={keyPrefix}
      className="relative mb-2"
      style={{ width: squareSize, height: squareSize }}
    >
      {montanitaPositions.slice(0, porotosCount).map((pos, i) => (
        <img
          key={i}
          src={porotoImg}
          alt={`poroto ${i}`}
          className={matchClass}
          style={{
            width: porotoSize,
            height: porotoSize,
            position: "absolute",
            top: pos.top,
            left: pos.left,
          }}
        />
      ))}
    </div>
  );

  // Para que el espacio siempre sea fijo, reservamos espacio para 6 montañitas (30 porotos)
  const totalGroups = 6;

  return (
    <div
      className="flex flex-col items-center space-y-2"
      style={{ minHeight: totalGroups * (squareSize + 8) }} // espacio total aprox
    >
      {/* montañitas completas */}
      {Array.from({ length: fullGroups }).map((_, i) =>
        renderMontanita(`full-${i}`, 5)
      )}
      {/* montañita parcial */}
      {remaining > 0 && renderMontanita("partial", remaining)}
      {/* espacios vacíos para reservar el layout */}
      {Array.from({
        length: totalGroups - fullGroups - (remaining > 0 ? 1 : 0),
      }).map((_, i) => (
        <div key={`empty-${i}`} style={{ width: squareSize, height: squareSize }} className="mb-2" />
      ))}
    </div>
  );
}
