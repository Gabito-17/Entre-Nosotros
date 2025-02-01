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
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Preparación
          </h2>
        </div>
        <div className="collapse-content space-y-4 p-4">
          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-secondary">Paso 1</h3>
            <p className="text-sm mt-2">
              Barajar todas las cartas antes de comenzar el juego para asegurar
              una distribución aleatoria.
            </p>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-secondary">Paso 2</h3>
            <p className="text-sm mt-2">
              Cada jugador recibe{" "}
              <button className="btn btn-xs btn-secondary">4 cartas</button>{" "}
              boca abajo y puede mirar{" "}
              <button className="btn btn-xs btn-accent">2</button> de ellas al
              inicio del juego.
            </p>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-secondary">Paso 3</h3>
            <p className="text-sm mt-2">
              Colocar una carta boca arriba en el centro de la mesa y dejar el
              resto del mazo boca abajo al lado de esta carta.
            </p>
          </div>
        </div>
      </div>

      {/* Primera Ronda */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Primera Ronda
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <div className="space-y-4">
            <p className="text-sm">
              Comienza el jugador a la derecha del repartidor. En cada turno, el
              jugador tiene dos opciones:
            </p>
            <ul className="list-disc list-inside ml-4 text-sm space-y-2">
              <li>
                <span className="font-semibold">Opción 1:</span> Tomar la carta
                que está boca arriba en el mazo de descarte y cambiarla por una
                de sus propias cartas.
              </li>
              <li>
                <span className="font-semibold">Opción 2:</span> Levantar una
                carta del mazo boca abajo y cambiarla por una de sus cartas.
              </li>
            </ul>
            <p className="text-sm">
              El objetivo es siempre intentar reducir el valor total de sus
              cartas.
            </p>

            {/* Condiciones especiales */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-info">
              <h3 className="text-md font-bold text-info">
                Condiciones Especiales
              </h3>
              <p className="text-sm mt-2">
                Si un jugador descarta una carta especial (7, 8 o 9), puede
                optar por realizar la acción correspondiente a esa carta:
              </p>
              <ul className="list-disc list-inside ml-4 text-sm mt-1 space-y-1">
                <li>
                  <span className="font-bold">7:</span> Permite al jugador ver
                  una de sus propias cartas.
                </li>
                <li>
                  <span className="font-bold">8:</span> Permite al jugador ver
                  la carta de otro jugador.
                </li>
                <li>
                  <span className="font-bold">9:</span> Permite intercambiar una
                  carta de la mesa con una de sus cartas o con la de otro
                  jugador.
                </li>
              </ul>
            </div>

            {/* Quema de cartas */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary mt-4">
              <h3 className="text-md font-bold text-secondary">
                Quema de Cartas
              </h3>
              <p className="text-sm mt-2">
                En cualquier momento, si un jugador tiene una carta con el mismo
                número o símbolo que la carta superior en el mazo de descarte,
                puede "quemarla" descartándola directamente en el mazo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Finalización del Juego */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />{" "}
            Finalización del Juego
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-lg font-semibold">
            Existen dos formas de finalizar un set del juego:
          </p>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-primary mt-4">
            <h3 className="text-md font-bold text-primary">
              1. Un jugador se queda sin cartas
            </h3>
            <p className="text-sm mt-2">
              Si un jugador se queda sin cartas en su turno, el juego termina de
              inmediato.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 text-sm space-y-1">
              <li>
                El jugador recibe un puntaje de{" "}
                <span className="font-bold">0</span>.
              </li>
              <li>
                Los demás jugadores suman el valor de sus cartas restantes.
              </li>
            </ul>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary mt-4">
            <h3 className="text-md font-bold text-secondary">
              2. Cantar "Britney"
            </h3>
            <p className="text-sm mt-2">
              Un jugador puede cantar{" "}
              <span className="font-bold text-primary">"Britney"</span>,
              apostando a tener el valor más bajo en sus cartas.
            </p>
            <ul className="list-disc list-inside ml-4 mt-1 text-sm space-y-1">
              <li>
                Se juega una{" "}
                <span className="font-bold">última ronda completa</span>.
              </li>
              <li>
                Cuando el turno vuelve, se revelan todas las cartas y se suman
                sus valores.
              </li>
            </ul>
            <p className="text-sm mt-1">
              <span className="font-bold">Resultado:</span>
            </p>
            <ul className="list-disc list-inside ml-4 text-sm">
              <li>
                Si el jugador tiene el menor valor, recibe{" "}
                <span className="font-bold">-10 puntos</span>.
              </li>
              <li>Si no, recibe la puntuación del jugador con mayor valor.</li>
            </ul>
          </div>

          <p className="ml-2 mt-4 text-md ">
            La partida finzaliza cuando un jugador consigue la suma de
            <span className="font-bold"> 100 puntos </span>
            quedando éste descalificado. Los jugadores restantes pueden optar
            seguir jugando sin la presencia del reciente eliminado.
          </p>
        </div>
      </div>

      {/* Cartas Especiales */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-warning" /> Cartas Especiales
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <div className="space-y-4">
            <p className="text-sm">
              Las cartas especiales{" "}
              <button className="btn btn-xs btn-error">7</button>,{" "}
              <button className="btn btn-xs btn-warning">8</button>, y{" "}
              <button className="btn btn-xs btn-info">9</button> tienen
              habilidades que pueden alterar el juego:
            </p>

            {/* Detalles de Cartas Especiales */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-warning mt-4">
              <h3 className="text-md font-bold text-warning">
                Habilidades de Cartas Especiales
              </h3>
              <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
                <li>
                  <span className="font-bold">7</span>: Permite al jugador ver
                  una de sus propias cartas.
                </li>
                <li>
                  <span className="font-bold">8</span>: Permite al jugador ver
                  la carta de otro jugador.
                </li>
                <li>
                  <span className="font-bold">9</span>: Permite al jugador
                  cambiar una carta en la mesa con una de sus cartas o con la de
                  otro jugador.
                </li>
              </ul>
            </div>

            {/* Notas adicionales */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary mt-4">
              <h3 className="text-md font-bold text-secondary">Nota</h3>
              <p className="text-sm mt-2">
                Los jugadores pueden optar por no usar las habilidades de estas
                cartas especiales si prefieren mantener sus estrategias.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Penalizaciones */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <ExclamationCircleIcon className="w-6 h-6 text-error" />{" "}
            Penalizaciones
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <div className="space-y-4">
            <p className="text-sm">
              Si un jugador comete un error, como quemar una carta incorrecta o
              mirar una carta que no debía, deberá recoger una carta adicional
              como penalización.
            </p>

            {/* Detalles de Penalizaciones */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-error mt-4">
              <h3 className="text-md font-bold text-error">
                Errores Comunes y Penalizaciones
              </h3>
              <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
                <li>
                  <span className="font-bold">Quemar una carta incorrecta</span>
                  : El jugador recibe una carta adicional como penalización.
                </li>
                <li>
                  <span className="font-bold">
                    Mirar una carta que no debía
                  </span>
                  : El jugador recibe una carta adicional y pierde su turno.
                </li>
                <li>
                  <span className="font-bold">Jugar fuera de turno</span>: El
                  jugador deberá recibir una carta de penalización.
                </li>
              </ul>
            </div>

            {/* Nota de Clarificación */}
            <div className="bg-base-100 rounded-lg p-3 border-l-4 border-warning mt-4">
              <h3 className="text-md font-bold text-warning">Nota</h3>
              <p className="text-sm mt-2">
                Las penalizaciones están diseñadas para mantener la integridad
                del juego. Los jugadores deben ser cuidadosos y respetar las
                reglas para evitar sanciones adicionales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesSteps;
