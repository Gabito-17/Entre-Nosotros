import React from "react";
import Carousel from "../components/Carousel";
import i1 from "../resources/i1.jpg";
import backgroundImage from "../resources/i4.jpg";

const LandingPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Introducción */}
      <section className="py-8 bg-base-100 bg-opacity-55">
        <div className="container rounded-lg mx-auto text-center px-4 lg:text-left lg:flex lg:items-center lg:space-x-8 overflow-x-hidden">
          {/* Texto descriptivo */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              ¿Qué es Britney?
            </h2>
            <p className="text-md sm:text-lg mb-6 sm:mb-8">
              Britney es un dinámico juego de cartas que combina estrategia,
              memoria y el emocionante toque de habilidades especiales. Los
              jugadores comienzan con cuatro cartas, de las cuales solo pueden
              ver dos al inicio. A lo largo de la partida, deben gestionar su
              mano con inteligencia, descartando las cartas más altas y
              aprovechando oportunidades para quemar cartas si recuerdan
              correctamente lo que tienen. Cartas como el 7, 8 y 9 poseen
              habilidades únicas que pueden cambiar el curso del juego. Los
              jugadores deben tener cuidado, ya que cometer errores, como quemar
              mal una carta o mirar una carta sin autorización, resultará en
              penalizaciones. El objetivo final: quedarse con la menor cantidad
              de cartas posibles y evitar ser superado por los demás. ¡Canta
              "Britney" cuando estés seguro de tu victoria!
            </p>
            <button className="btn btn-accent mt-4 sm:mt-6">
              <a href="/reglas">Aprender a jugar</a>
            </button>
          </div>

          {/* Imagen */}
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={i1}
              alt="Britney preview"
              className="mx-auto rounded-lg shadow-xl w-full max-w-full"
            />
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-12 sm:py-16 bg-base-200 bg-opacity-55">
        <div className="mx-auto px-4">
          <div className="flex justify-center content">
            <Carousel />
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="py-12 sm:py-16 bg-base-100 bg-opacity-55 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
          ¡Empieza a usar Britney hoy!
        </h2>
        <p className="text-md sm:text-lg mb-6 sm:mb-8">
          Simplifica la forma en que juegas y mantén todo organizado con
          Britney.
        </p>
        <button className="btn btn-primary btn-lg">Regístrate ahora</button>
      </section>

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-6 bg-opacity-75 text-center">
        <div className="container mx-auto px-4">
          <p>© 2024 Britney. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
