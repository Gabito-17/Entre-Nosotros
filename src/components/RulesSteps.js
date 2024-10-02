import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const RulesSteps = () => {
  return (
    <div className="content max-w-lg mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Reglas del Juego
      </h1>

      {/* Preparación */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Preparación
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            Cada jugador recibe{" "}
            <button className="btn btn-xs btn-secondary">4 cartas</button> boca
            abajo. Solo puede mirar{" "}
            <button className="btn btn-xs btn-accent">2</button> de esas 4
            cartas al inicio del juego. El objetivo es recordar las cartas y
            tratar de descartar las más altas.
          </p>
        </div>
      </div>

      {/* Primera Ronda */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Primera Ronda
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            Los jugadores, en cada turno, pueden tomar una carta del mazo
            central y decidir si la descartan o la cambian por una de sus
            cartas. La idea es intercambiar cartas más altas por cartas más
            bajas.
          </p>
        </div>
      </div>

      {/* Cartas Especiales */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <StarIcon className="inline-block w-6 h-6 mr-2" /> Cartas Especiales
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            Las cartas <button className="btn btn-xs btn-error">7</button>,{" "}
            <button className="btn btn-xs btn-warning">8</button>, y{" "}
            <button className="btn btn-xs btn-info">9</button> tienen
            habilidades especiales que permiten modificar el curso del juego. El{" "}
            <span className="font-bold">7</span> puede cambiar una carta, el{" "}
            <span className="font-bold">8</span> permite ver una carta oculta y
            el <span className="font-bold">9</span> puede anular el turno de
            otro jugador.
          </p>
        </div>
      </div>

      {/* Finalización del Juego */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" /> Finalización del Juego
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            El juego termina cuando un jugador canta "<span className="font-bold text-primary">Britney</span>", declarando
            que tiene las cartas más bajas, o cuando un jugador se queda sin
            cartas. Si se canta "<span className="font-bold text-primary">Britney</span>" y es incorrecto, el jugador es penalizado.
          </p>
        </div>
      </div>

      {/* Penalizaciones */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <ExclamationCircleIcon className="inline-block w-6 h-6 mr-2" /> Penalizaciones
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            Si un jugador comete un error, como quemar mal una carta o mirar una
            que no debía, deberá recoger más cartas, lo que aumenta sus
            probabilidades de perder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesSteps;
