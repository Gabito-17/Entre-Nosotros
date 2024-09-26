import React from "react";

const RulesPage = () => {
  return (
    <div className="min-h-screen bg-base-100 py-12 flex flex-col items-center">
      {/* Título */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">Reglas del Juego: Britney</h1>
        <p className="text-lg mt-4">Sigue estos pasos para aprender a jugar.</p>
      </section>

      {/* Paso a Paso */}
      <section className="container mx-auto px-4">
        <ul className="steps steps-vertical w-full lg:w-3/4 mx-auto">
          {/* Paso 1 */}
          <li className="step step-primary">
            <div className="card bg-base-100 shadow-md p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Paso 1: Preparación</h2>
              <p className="text-lg">
                Cada jugador recibe 4 cartas boca abajo. Solo puede mirar 2 de
                esas 4 cartas al inicio del juego. El objetivo es recordar las
                cartas y tratar de descartar las más altas.
              </p>
            </div>
          </li>

          {/* Paso 2 */}
          <li className="step step-primary">
            <div className="card bg-base-100 shadow-md p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                Paso 2: Desarrollo del Juego
              </h2>
              <p className="text-lg">
                Los jugadores, en cada turno, pueden tomar una carta del mazo
                central y decidir si la descartan o la cambian por una de sus
                cartas. La idea es intercambiar cartas más altas por cartas más
                bajas.
              </p>
            </div>
          </li>

          {/* Paso 3 */}
          <li className="step step-primary">
            <div className="card bg-base-100 shadow-md p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                Paso 3: Habilidades Especiales
              </h2>
              <p className="text-lg">
                Las cartas 7, 8 y 9 tienen habilidades especiales que permiten
                modificar el curso del juego. Por ejemplo, el 7 puede cambiar
                una carta, el 8 permite ver una carta oculta y el 9 puede anular
                el turno de otro jugador.
              </p>
            </div>
          </li>

          {/* Paso 4 */}
          <li className="step step-primary">
            <div className="card bg-base-100 shadow-md p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Paso 4: Fin del Juego</h2>
              <p className="text-lg">
                El juego termina cuando un jugador canta "Britney", declarando
                que tiene las cartas más bajas, o cuando un jugador se queda sin
                cartas. Si se canta "Britney" y es incorrecto, el jugador es
                penalizado.
              </p>
            </div>
          </li>

          {/* Paso 5 */}
          <li className="step step-primary">
            <div className="card bg-base-100 shadow-md p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-2">
                Paso 5: Penalizaciones
              </h2>
              <p className="text-lg">
                Si un jugador comete un error, como quemar mal una carta o mirar
                una que no debía, deberá recoger más cartas, lo que aumenta sus
                probabilidades de perder.
              </p>
            </div>
          </li>
        </ul>
      </section>

      {/* Llamado a la Acción */}
      <section className="text-center mt-12">
        <a href="/anotador" className="btn btn-primary btn-lg">
          Comienza a Jugar Ahora
        </a>
      </section>
    </div>
  );
};

export default RulesPage;
