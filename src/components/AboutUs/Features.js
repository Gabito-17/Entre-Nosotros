const Features = () => {
  return (
    <div className="p-16 mx-auto text-center">
      <h2 className="text-3xl font-bold mb-8 ">¿Qué es Britney?</h2>
      <p className="text-lg mb-6">
        Britney es más que un simple juego de cartas, es una combinación de
        estrategia y memoria con herramientas digitales para mejorar la
        experiencia:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 ">🎯 Anotador</h3>
          <p className="">
            Registra y gestiona cada partida sin complicaciones.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 ">📜 Reglas</h3>
          <p className="">
            Consulta las reglas en cualquier momento de forma clara y rápida.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2 ">🌙 Modo Oscuro</h3>
          <p className="">
            Personaliza tu experiencia con un diseño adaptable.
          </p>
        </div>

        <div className="p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-2 ">💡 Sugerencias</h3>
          <p className="">Tu opinión es clave para seguir mejorando Britney.</p>
        </div>
      </div>
    </div>
  );
};

export default Features;
