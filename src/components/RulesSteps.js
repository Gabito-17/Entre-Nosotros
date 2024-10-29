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
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" />{" "}
            Preparación
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
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" />{" "}
            Primera Ronda
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
            <span className="font-bold">7</span> te deja ver una de tus cartas,
            el <span className="font-bold">8</span> permite ver la carta de otro
            jugador, y el <span className="font-bold">9</span> permite cambiar
            una carta en la mesa por otra, ya sea tuya o de otro jugador.
          </p>
        </div>
      </div>

      {/* Finalización del Juego */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <InformationCircleIcon className="inline-block w-6 h-6 mr-2" />{" "}
            Finalización del Juego
          </h2>
        </div>
        <div className="collapse w-full max-w-lg mx-auto bg-base-200 shadow-lg rounded-lg">
  <input type="checkbox" className="peer" />
  <div className="collapse-title text-lg font-bold text-primary-focus">
    ¿Cómo finalizar el juego "Britney"?
  </div>
  <div className="collapse-content p-4 text-base-content">
    <div className="space-y-4">
      <p className="text-lg font-semibold">Existen dos formas de finalizar el juego:</p>

      {/* Forma 1: Quedarse sin cartas */}
      <div className="bg-base-100 rounded-lg p-3 border-l-4 border-primary">
        <h3 className="text-md font-bold text-primary">1. Un jugador se queda sin cartas</h3>
        <p className="text-sm mt-2">
          Si un jugador se queda sin cartas en su turno, el juego termina de inmediato. 
        </p>
        <ul className="list-disc list-inside ml-4 mt-1 text-sm">
          <li>El jugador que se quedó sin cartas recibe un puntaje de <span className="font-bold">0</span>.</li>
          <li>Los demás jugadores suman el valor de sus cartas restantes y anotan esa cantidad.</li>
        </ul>
      </div>

      {/* Forma 2: Cantar Britney */}
      <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
        <h3 className="text-md font-bold text-secondary">2. Un jugador canta "Britney"</h3>
        <p className="text-sm mt-2">
          Un jugador puede cantar <span className="font-bold text-primary">"Britney"</span> en su turno, apostando a tener el valor total de cartas más bajo.
        </p>
        <ul className="list-disc list-inside ml-4 mt-1 text-sm">
          <li>Después de cantar "Britney", se juega una <span className="font-bold">última ronda completa</span>.</li>
          <li>Cuando el turno vuelve al jugador que cantó, se revelan todas las cartas y se suman sus valores.</li>
        </ul>
        <p className="text-sm mt-1">
          <span className="font-bold">Resultado:</span>
        </p>
        <ul className="list-disc list-inside ml-4 text-sm">
          <li>Si el jugador que cantó "Britney" tiene el menor valor en sus cartas (sin empate), recibe <span className="font-bold">-10 puntos</span>.</li>
          <li>Si no tiene el menor valor, se le asigna la puntuación del jugador con el valor de cartas más alto.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

      </div>

      {/* Penalizaciones */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title">
            <ExclamationCircleIcon className="inline-block w-6 h-6 mr-2" />{" "}
            Penalizaciones
          </h2>
        </div>
        <div className="collapse-content">
          <p>
            Si un jugador comete un error, como quemar mal una carta o mirar una
            que no debía, deberá recoger una carta en forma de penalizacion, lo
            que aumenta sus probabilidades de perder.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesSteps;
