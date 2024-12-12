import React from "react";
import i5 from "../assets/i5.jpg";
import Carousel from "../components/Carousel";

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
          ¡Empieza a usar Britney hoy!
        </h2>
        <p className="text-md sm:text-lg mb-6 sm:mb-8">
          Simplifica la forma en que juegas y mantén todo organizado con
          Britney.
        </p>
        <a href="/anotador" className="btn btn-primary btn-lg">
          Utilizar anotador
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-10">
  <div className="container mx-auto lg:px-20">
    {/* Sección superior: enlaces rápidos y contacto */}
    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start  lg:space-y-0">
      {/* Enlaces rápidos */}
      <div className="text-center lg:text-left">
        <h3 className="text-lg font-bold mb-4">Enlaces Rápidos</h3>
        <ul className="space-y-2">
          <li><a href="/reglas" className="hover:underline">Reglas</a></li>
          <li><a href="/anotador" className="hover:underline">Anotador</a></li>
          <li><a href="/sugerencias" className="hover:underline">Sugerencias</a></li>
        </ul>
      </div>

      {/* Contacto */}
      <div className="text-center lg:text-left">
        <h3 className="text-lg font-bold mb-4">Contacto</h3>
        <p className="text-sm">📧 <a href="mailto:juangabrielpavon@gmail.com" className="hover:underline">juangabrielpavon@gmail.com</a></p>
        <p className="text-sm">📞 +54 3751 312279</p>
        <div className="mt-4 flex justify-center lg:justify-start space-x-4">
          <a href="#" className="text-white hover:text-gray-200"><i className="fab fa-facebook"></i></a>
          <a href="#" className="text-white hover:text-gray-200"><i className="fab fa-twitter"></i></a>
          <a href="#" className="text-white hover:text-gray-200"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    {/* Separador */}
    <div className="border-t border-white border-opacity-50 my-8"></div>

    {/* Sección inferior: derechos reservados */}
    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-center">
      <p>© 2024 Britney. Todos los derechos reservados.</p>
      <p className="mt-4 md:mt-0">Diseñado con ❤️ por el equipo Britney.</p>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;
