import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const RulesTruco = () => {
  return (
    <div className="py-8 content max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Reglas del Truco Argentino
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
            <h3 className="text-md font-bold text-primary">Paso 1</h3>
            <p className="text-sm mt-2">
              Se reparten <span className="font-bold">3 cartas</span> a cada jugador. Se juega en parejas o individual.
            </p>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-primary">Paso 2</h3>
            <p className="text-sm mt-2">
              Determinar quién será el <span className="font-bold">mano</span> y el <span className="font-bold">pie</span> en la ronda.
            </p>
          </div>
        </div>
      </div>

      {/* Desarrollo del Juego */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Desarrollo del Juego
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-sm mb-4">
            El juego se divide en tres etapas: <strong>truco</strong>, <strong>envido</strong> y <strong>flor</strong>. Cada jugador puede cantar para sumar puntos o responder.
          </p>
          <ul className="list-disc list-inside ml-4 text-sm space-y-1">
            <li><strong>Envido:</strong> Se canta antes de jugar la primera carta. Se puede aceptar o rechazar.</li>
            <li><strong>Flor:</strong> Solo si se tiene las 3 cartas del mismo palo. Se canta antes del envido.</li>
            <li><strong>Truco:</strong> Se puede cantar durante la partida. El rival debe aceptar o rechazar.</li>
          </ul>
        </div>
      </div>

      {/* Valores de Cartas */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-warning" /> Valores de Cartas
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-sm">
            El orden de las cartas de mayor a menor es:
          </p>
          <ul className="list-decimal list-inside ml-4 text-sm mt-2 space-y-1">
            <li>1 de Espada</li>
            <li>1 de Basto</li>
            <li>7 de Espada</li>
            <li>7 de Oro</li>
            <li>3</li>
            <li>2</li>
            <li>1 de Copas / Oros</li>
            <li>12</li>
            <li>11</li>
            <li>10</li>
            <li>7 de Copas / Basto</li>
            <li>6</li>
            <li>5</li>
            <li>4</li>
          </ul>
        </div>
      </div>

      {/* Finalización del Juego */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Finalización del Juego
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-sm">
            El juego termina cuando un equipo alcanza los <span className="font-bold">30 puntos</span> (partida corta) o <span className="font-bold">15 puntos</span> (reducida).
          </p>
        </div>
      </div>

      {/* Penalizaciones */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <ExclamationCircleIcon className="w-6 h-6 text-error" /> Penalizaciones
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <ul className="list-disc list-inside ml-4 text-sm space-y-2">
            <li>Cantar envido fuera de turno: resta de puntos.</li>
            <li>No respetar el orden de juego: pierde el punto.</li>
            <li>Mostrar cartas antes de tiempo: penalización a criterio del grupo.</li>
          </ul>
          <p className="text-sm mt-4">
            Las reglas pueden ajustarse por consenso según la modalidad de juego acordada (amistoso, torneo, etc.).
          </p>
        </div>
      </div>
    </div>
  );
};

export default RulesTruco;