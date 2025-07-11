const Introduction = () => {
  return (
    <section className="py-16 text-center lg:text-left lg:flex lg:space-x-12 px-6 container mx-auto">
      <div className="lg:w-1/2 lg:mt-0">
        <img
          src={"/assets/images/i3.webp"}
          alt="Ilustración de juegos sociales"
          className="rounded-lg shadow-lg w-full"
        />
      </div>
      <div className="lg:w-1/2">
        <h1 className="text-4xl font-bold py-6 text-primary">
          Jueguen entre ustedes
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-base-content">
          Esta plataforma nació como un proyecto entre amigos con la idea de
          crear una herramienta digital para mejorar la experiencia de nuestras
          partidas con juegos de cartas. Queremos lograr que jugar a juegos
          sociales raros nuestros sea mas sencillo.
        </p>
        <p className="text-lg leading-relaxed text-base-content">
          Acá vas a encontrar anotadores digitales, reglas de distintos juegos y
          utilidades diseñadas para que tus partidas sean más organizadas, tanto
          si estás en una reunión familiar como entre amigos.
        </p>
      </div>
    </section>
  );
};

export default Introduction;
