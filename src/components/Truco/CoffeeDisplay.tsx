"use client";

interface CoffeeDisplayProps {
  count: number; // puntaje total (1 a 30)
}

export default function CoffeeDisplay({ count }: CoffeeDisplayProps) {
  const cafeImg = "/assets/truco/cafe.svg"; // ruta a la imagen cafe
  const squareSize = 72; // tamaño del contenedor cuadrado
  const cafeSize = 35; // tamaño individual del cafe

  // Posiciones "montañita" para hasta 5 cafes
  // Intenté simular una pequeña pirámide visual
  const montanitaPositions = [
    { top: 30, left: 35 }, // base derecha
    { top: 5, left: 0 }, // pico izquierdo
    { top: 30, left: 0 }, // base izquierda
    { top: 5, left: 35 }, // pico derecho

    { top: 20, left: 20 }, // centro medio arriba
  ];

  const fullGroups = Math.floor(count / 5);
  const remaining = count % 5;
  const cafeRotations = [-75, 90, 15, -8, 16]; // grados para cada café en la montañita

  const renderMontanita = (keyPrefix: string, cafesCount: number) => (
    <div
      key={keyPrefix}
      className="relative"
      style={{ width: squareSize, height: squareSize }}
    >
      {montanitaPositions.slice(0, cafesCount).map((pos, i) => (
        <img
          key={i}
          src={cafeImg}
          alt={`cafe ${i}`}
          style={{
            width: cafeSize,
            height: cafeSize,
            position: "absolute",
            top: pos.top,
            left: pos.left,
            filter: "drop-shadow(-3px 4px 4px rgba(0,0,0,0.25))",
            transform: `rotate(${cafeRotations[i % cafeRotations.length]}deg)`,
          }}
        />
      ))}
    </div>
  );

  // Para que el espacio siempre sea fijo, reservamos espacio para 6 montañitas (30 cafes)
  const totalGroups = 6;

  return (
    <div
      className="flex flex-col items-center"
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
        <div
          key={`empty-${i}`}
          style={{ width: squareSize, height: squareSize }}
          className="mb-2"
        />
      ))}
    </div>
  );
}
