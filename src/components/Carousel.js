import React, { useState } from "react";
import i1 from "../resources/i5.jpg";
import i2 from "../resources/i5.jpg";
import i3 from "../resources/i5.jpg";
import i4 from "../resources/i5.jpg"; // Asegúrate de tener una imagen para la cuarta característica

const features = [
  {
    image: i1,
    title: "Memoria Estratégica",
    description: "Los jugadores deben recordar las cartas visibles y las jugadas anteriores para descartar eficientemente.",
  },
  {
    image: i2,
    title: "Habilidades Especiales",
    description: "Las cartas 7, 8 y 9 tienen habilidades únicas que añaden un elemento estratégico al juego.",
  },
  {
    image: i3,
    title: "Sistema de Penalización",
    description: "Los jugadores pueden recoger cartas si cometen errores, lo que agrega un nivel de riesgo a cada jugada.",
  },
  {
    image: i4,
    title: "Juego Dinámico",
    description: "Cada turno trae nuevas decisiones, manteniendo a los jugadores en alerta y comprometidos.",
  },
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + features.length) % features.length);
  };

  return (
    <div className="features-section w-full md:w-3/4 lg:w-1/2 mx-auto py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        Características del Juego
      </h2>
      <div className="carousel carousel-center w-full space-x-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`carousel-item p-4 rounded-lg shadow-lg flex flex-col items-center text-center transition-transform duration-300 ${index === currentIndex ? 'block' : 'hidden'}`}
          >
            <div className="w-full h-32 md:h-40 overflow-hidden rounded-lg mb-4">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
      {/* Controles del carrusel */}
      <div className="flex justify-between mt-4">
        <button onClick={handlePrev} className="btn btn-outline btn-primary">Anterior</button>
        <button onClick={handleNext} className="btn btn-outline btn-primary">Siguiente</button>
      </div>
    </div>
  );
};

export default Carousel;
