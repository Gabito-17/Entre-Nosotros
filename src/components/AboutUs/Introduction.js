import i3 from "../../assets/images/i7.jpg";

const Introduction = () => {
  return (
    <section className="py-16 text-center lg:text-left lg:flex lg:space-x-12 px-6 container mx-auto">
      {" "}
      <div className="lg:w-1/2 mt-8 lg:mt-0">
        <img
          src={i3}
          alt="No carga :'("
          className="rounded-lg shadow-lg w-full"
        />
      </div>
      <div className="lg:w-1/2">
        <h1 className="text-4xl font-bold mb-6 text-primary">Sobre Nosotros</h1>
        <p className="text-lg leading-relaxed mb-6 text-base-content">
          Britney nació como una idea entre amigos que buscaban un juego de
          cartas dinámico y entretenido. Con cuatro creadores detrás, hemos
          diseñado un sistema de juego fácil de aprender pero difícil de
          dominar.
        </p>
        <p className="text-lg leading-relaxed text-base-content">
          Para mejorar la experiencia, desarrollamos esta web, que incluye un
          anotador digital para que cada partida sea aún más divertida y
          organizada.
        </p>
      </div>
    </section>
  );
};

export default Introduction;
