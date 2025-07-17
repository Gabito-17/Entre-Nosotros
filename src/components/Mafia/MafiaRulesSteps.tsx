import {
  InformationCircleIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const RulesSteps = () => {
  return (
    <div className="py-8 content max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Reglas de La Mafia
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
              Reunir al menos <span className="font-bold">5 jugadores</span>.
              Cuantos más jugadores, más entretenido.
            </p>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-primary">Paso 2</h3>
            <div className="text-sm mt-2 space-y-2">
              <p>
                El sistema asignará los roles de forma aleatoria según la
                cantidad de jugadores:
              </p>
              <div>
                <span className="font-medium">
                  Una cuarta parte de los jugadores (si son impar se redondea
                  para abajo)
                </span>{" "}
                serán{" "}
                <button className="btn btn-xs btn-secondary">Mafiosos</button>.
              </div>
              <div>
                <span className="font-medium">
                  La cantidad de mafiosos menos uno
                </span>{" "}
                serán{" "}
                <button className="btn btn-xs btn-accent">Policías</button>.
              </div>
              <div>
                <span className="font-medium">Un jugador</span> será{" "}
                <button className="btn btn-xs btn-success">Doctor</button>.
              </div>
              <div>
                El resto serán{" "}
                <button className="btn btn-xs">Ciudadanos</button>.
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-lg p-3 border-l-4 border-secondary">
            <h3 className="text-md font-bold text-primary">Paso 3</h3>
            <p className="text-sm mt-2">
              Cada jugador ve su rol en secreto. El juego se divide en fases de{" "}
              <span className="font-bold">noche</span> y{" "}
              <span className="font-bold">día</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Fase de Noche */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Fase de Noche
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-sm">
            Durante la noche, cada rol especial realiza su acción en secreto:
          </p>
          <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
            <li>
              <span className="font-bold text-error">Mafia:</span> Elige en
              secreto a un jugador para eliminar.
            </li>
            <li>
              <span className="font-bold text-accent">Policía:</span> Puede
              investigar a un jugador para saber si es mafia.
            </li>
            <li>
              <span className="font-bold text-success">Doctor:</span> Elige a un
              jugador para proteger esa noche.
            </li>
          </ul>
          <p className="text-sm mt-2">
            La aplicación automatiza las decisiones y muestra los resultados al
            comenzar el día.
          </p>
        </div>
      </div>

      {/* Fase de Día */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <InformationCircleIcon className="w-6 h-6 text-primary" />
            Fase de Día
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <p className="text-sm">
            Todos los jugadores debaten y votan quién creen que es parte de la
            mafia.
          </p>
          <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
            <li>El jugador más votado es eliminado y su rol se revela.</li>
            <li>Se continúa con la siguiente noche.</li>
          </ul>
          <p className="text-sm mt-2">
            El juego sigue alternando noche y día hasta que se cumpla una
            condición de victoria.
          </p>
        </div>
      </div>

      {/* Condiciones de Victoria */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-warning" />
            Condiciones de Victoria
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
            <li>
              <span className="font-bold text-success">
                Ganan los ciudadanos
              </span>{" "}
              si eliminan a todos los mafiosos.
            </li>
            <li>
              <span className="font-bold text-error">Gana la mafia</span> si
              quedan en igual número que los demás jugadores.
            </li>
          </ul>
        </div>
      </div>

      {/* Roles Especiales */}
      <div className="collapse collapse-arrow bg-base-100 shadow-xl mb-4">
        <input type="radio" name="accordion-1" />
        <div className="collapse-title text-xl font-medium">
          <h2 className="card-title flex items-center gap-2">
            <StarIcon className="w-6 h-6 text-warning" /> Roles Especiales
          </h2>
        </div>
        <div className="collapse-content p-4 text-base-content">
          <div className="space-y-4">
            <ul className="list-disc list-inside ml-4 text-sm mt-2 space-y-2">
              <li>
                <span className="font-bold">Mafioso:</span> Eliminan jugadores
                cada noche.
              </li>
              <li>
                <span className="font-bold">Policía:</span> Puede descubrir si
                un jugador es mafioso.
              </li>
              <li>
                <span className="font-bold">Doctor:</span> Protege a un jugador
                por noche del ataque de la mafia.
              </li>
              <li>
                <span className="font-bold">Ciudadano:</span> No tiene
                habilidades, pero participa en votaciones.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesSteps;
