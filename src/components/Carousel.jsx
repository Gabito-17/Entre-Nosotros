import { useState } from "react";

const features = [
  {
    image: "/assets/images/i1.webp",
    title: "Memoria Estratégica",
    description:
      "Los jugadores deben recordar las cartas visibles y las jugadas anteriores para descartar eficientemente.",
  },
  {
    image: "/assets/images/i2.webp",
    title: "Habilidades Especiales",
    description:
      "Las cartas 7, 8 y 9 tienen habilidades únicas que añaden un elemento estratégico al juego.",
  },
  {
    image: "/assets/images/i3.webp",
    title: "Sistema de Penalización",
    description:
      "Los jugadores pueden recoger cartas si cometen errores, lo que agrega un nivel de riesgo a cada jugada.",
  },
  {
    image: "/assets/images/i4.webp",
    title: "Juego Dinámico",
    description:
      "Cada turno trae nuevas decisiones, manteniendo a los jugadores en alerta y comprometidos.",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + features.length) % features.length
    );
  };

  return (
    <div className="text-white text-center">
      <h2 className="text-3xl font-bold mb-6">Características del Juego</h2>
      <div className="relative w-full max-w-xl mx-auto overflow-hidden rounded-lg shadow-lg bg-gray-800 p-6">
        <div className="w-full h-48 md:h-64 overflow-hidden rounded-lg mb-4">
          <img
            src={features[currentIndex].image}
            alt={features[currentIndex].title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {features[currentIndex].title}
        </h3>
        <p className="text-gray-300">{features[currentIndex].description}</p>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        <button
          onClick={handlePrev}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Carousel;
