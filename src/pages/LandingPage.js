import React from "react";
import i5 from "../assets/images/i5.jpg";
import Carousel from "../components/Carousel";
import Footer from "../components/Layout/Footer"

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
      {/* Introducción */}
      <section className="py-8">
        <div className="container rounded-lg mx-auto text-center px-4 lg:text-left lg:flex lg:items-center lg:space-x-8 overflow-x-hidden">
          {/* Texto descriptivo */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
              ¿Qué es Britney?
            </h2>
            <p className="text-md sm:text-lg mb-6 sm:mb-8">
  <strong>Britney</strong> es un emocionante juego de cartas que mezcla 
  <strong> estrategia</strong>, <strong>memoria</strong> y habilidades únicas. 
  Con solo <strong>cuatro cartas iniciales</strong>, los jugadores deben recordar, gestionar y descartar inteligentemente, mientras aprovechan habilidades especiales como las del <strong>7, 8 y 9</strong>. 
  ¡Evita penalizaciones, reduce tus cartas y canta <strong>"Britney"</strong> para ganar!
</p>

            <button className="btn btn-accent mt-4 sm:mt-6">
              <a href="/reglas">Aprender a jugar</a>
            </button>
          </div>

          {/* Imagen */}
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <img
              src={i5}
              alt="Britney preview"
              className="mx-auto rounded-lg shadow-xl w-full max-w-full"
            />
          </div>
        </div>
      </section>

      {/* Características */}
      <section className="py-12 sm:py-16 ">
        <div className="mx-auto px-4">
          <div className="flex justify-center content">
            <Carousel />
          </div>
        </div>
      </section>

      {/* Llamado a la acción */}
      <section className="py-12 sm:py-16 text-center px-4">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-6">
          ¡Empieza a jugar Britney hoy!
        </h2>
        <p className="text-md sm:text-lg mb-6 sm:mb-8"> 
          Simplifica la forma en que juegas y mantén todo organizado.
        </p>
        <a href="/anotador" className="btn btn-primary btn-lg">
          Utilizar anotador
        </a>
      </section>

      {/* Footer */}
      <Footer/>


    </div>
  );
};

export default LandingPage;
