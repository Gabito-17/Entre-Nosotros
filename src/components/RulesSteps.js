import React from "react";
import { InformationCircleIcon, StarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const RulesSteps = () => {
  return (
    <div className="content max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Reglas del Juego
      </h1>

      <div className="collapse collapse-arrow bg-gradient-to-r from-purple-500 to-indigo-500 text-white mb-4 shadow-lg">
        <input type="radio" name="accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-semibold">
          <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Preparación
        </div>
        <div className="collapse-content">
          <p>
            Cada jugador recibe <span className="badge badge-secondary">4 cartas</span> boca abajo. Solo puede mirar <span className="badge badge-accent">2</span> de esas 4 cartas al inicio del juego. El objetivo es recordar las cartas y tratar de descartar las más altas.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-gradient-to-r from-green-500 to-teal-500 text-white mb-4 shadow-lg">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-semibold">
          <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Primera Ronda
        </div>
        <div className="collapse-content">
          <p>
            Los jugadores, en cada turno, pueden tomar una carta del mazo central y decidir si la descartan o la cambian por una de sus cartas. La idea es intercambiar cartas más altas por cartas más bajas.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-gradient-to-r from-yellow-500 to-orange-500 text-white mb-4 shadow-lg">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-semibold">
          <StarIcon className="inline-block w-6 h-6 mr-2" /> Cartas Especiales
        </div>
        <div className="collapse-content">
          <p>
            Las cartas <span className="badge badge-error">7</span>, <span className="badge badge-warning">8</span>, y <span className="badge badge-info">9</span> tienen habilidades especiales que permiten modificar el curso del juego. El <span className="font-bold">7</span> puede cambiar una carta, el <span className="font-bold">8</span> permite ver una carta oculta y el <span className="font-bold">9</span> puede anular el turno de otro jugador.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-gradient-to-r from-pink-500 to-red-500 text-white mb-4 shadow-lg">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-semibold">
          <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Finalización del Juego
        </div>
        <div className="collapse-content">
          <p>
            El juego termina cuando un jugador canta "<span className="font-bold text-primary">Britney</span>", declarando que tiene las cartas más bajas, o cuando un jugador se queda sin cartas. Si se canta "<span className="font-bold text-primary">Britney</span>" y es incorrecto, el jugador es penalizado.
          </p>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-semibold">
          <ExclamationTriangleIcon className="inline-block w-6 h-6 mr-2" /> Penalizaciones
        </div>
        <div className="collapse-content">
          <p>
            Si un jugador comete un error, como quemar mal una carta o mirar una que no debía, deberá recoger más cartas, lo que aumenta sus probabilidades de perder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesSteps;
