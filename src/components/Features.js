import React from "react";
import i1 from "../assets/images/i1.jpg";
import i2 from "../assets/images/i2.jpg";
import i3 from "../assets/images/i3.jpg";
import i4 from "../assets/images/i4.jpg";
import { CogIcon, HeartIcon, LightBulbIcon, UsersIcon } from "@heroicons/react/24/outline";

const features = [
  {
    image: i1,
    title: "Memoria Estratégica",
    description:
      "Los jugadores deben recordar las cartas visibles y las jugadas anteriores para descartar eficientemente.",
    icon: <CogIcon className="w-8 h-8 text-pink-500" />
  },
  {
    image: i2,
    title: "Habilidades Especiales",
    description:
      "Las cartas 7, 8 y 9 tienen habilidades únicas que añaden un elemento estratégico al juego.",
    icon: <LightBulbIcon className="w-8 h-8 text-pink-500" />
  },
  {
    image: i3,
    title: "Sistema de Penalización",
    description:
      "Los jugadores pueden recoger cartas si cometen errores, lo que agrega un nivel de riesgo a cada jugada.",
    icon: <HeartIcon className="w-8 h-8 text-pink-500" />
  },
  {
    image: i4,
    title: "Juego Dinámico",
    description:
      "Cada turno trae nuevas decisiones, manteniendo a los jugadores en alerta y comprometidos.",
    icon: <UsersIcon className="w-8 h-8 text-pink-500" />
  },
];

const Features = () => {
  return (
    <div className="text-base-content py-12">
      <h2 className="text-3xl font-bold mb-6 text-center text-pink-500">Características del Juego</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-6">
        {features.map((feature, index) => (
          <div key={index} className="card bg-base-200 shadow-xl rounded-lg overflow-hidden">
            <figure>
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-40 object-cover"
              />
            </figure>
            <div className="card-body p-4">
              <div className="flex items-center gap-4 mb-4">
                {feature.icon}
                <h3 className="text-lg font-semibold mb-2 text-pink-500">{feature.title}</h3>
              </div>
              <p className="text-md">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
