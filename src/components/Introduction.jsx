import i5 from "../assets/images/i5.jpg"; // Asegúrate de tener la imagen correctamente importada

const Introduction = () => {
  return (
    <section className="py-16 px-6 container mx-auto text-center lg:text-left lg:flex lg:items-center lg:gap-12">
      <div className="lg:w-1/2">
        <h2 className="text-4xl font-bold mb-6 text-primary">
          Divertite con Britney
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          <strong>Britney</strong> es un juego de cartas que mezcla{" "}
          <strong>estrategia</strong>, <strong>memoria</strong> y habilidades
          únicas. Con solo <strong>cuatro cartas iniciales</strong>, los
          jugadores deben recordar, gestionar y descartar inteligentemente,
          mientras aprovechan habilidades especiales como las del{" "}
          <strong>7, 8 y 9</strong>. ¡Evita penalizaciones, reduce tus cartas y
          canta
          <strong> "Britney"</strong> para ganar!
        </p>
        <a href="/reglas" className="btn btn-primary">
          Aprender a jugar
        </a>
      </div>
      <div className="lg:w-1/2 mt-8 lg:mt-0">
        <img
          src={i5}
          alt="Britney preview"
          className="rounded-box shadow-xl w-full"
        />
      </div>
    </section>
  );
};

export default Introduction;
