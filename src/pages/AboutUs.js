import React from "react";
import Footer from "../components/Layout/Footer";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <section className="min-h-screen bg-base-100 text-base-content p-8 md:p-16">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-pink-500">Sobre Nosotros</h1>
        </div>

        {/* Sección de Contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nuestra Historia */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Nuestra Historia</h2>
            <p className="leading-relaxed mb-4">
              Britney surgió como una respuesta creativa al aburrimiento entre
              amigos ingeniosos. Con cuatro amigos como arquitectos de la idea,
              el juego fue diseñado para ser disfrutado por grupos de dos a 8
              personas, ofreciendo siempre una experiencia fresca y emocionante.
            </p>
            <p className="leading-relaxed">
              En nuestra búsqueda de mejorar la experiencia de juego, decidimos
              crear esta página web. Así nació el anotador de Britney,
              facilitando la organización de las partidas y llevando el juego a
              un nuevo nivel de accesibilidad.
            </p>
          </div>

          {/* Qué es Britney */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">¿Qué es Britney?</h2>
            <p className="leading-relaxed mb-4">
              Britney no es solo un juego de cartas, es una experiencia que
              combina estrategia, memoria y diversión. Nuestro objetivo es
              convertir cada partida en un buen recuerdo. Para lograrlo, hemos
              incorporado herramientas esenciales en esta página web:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-bold">Anotador:</span> Mantén tus partidas
                organizadas fácilmente.
              </li>
              <li>
                <span className="font-bold">Reglas:</span> Aprende a jugar con
                una guía clara y accesible.
              </li>
              <li>
                <span className="font-bold">Modo Oscuro/Claro:</span> Ajusta la
                interfaz según tus preferencias.
              </li>
              <li>
                <span className="font-bold">Sugerencias:</span> Tu opinión nos
                ayuda a mejorar constantemente.
              </li>
            </ul>
          </div>

          {/* Filosofía y Compromiso */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Nuestra Filosofía</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <span className="font-bold">Simplicidad:</span> Britney está
                diseñado para ser intuitivo y fácil de usar.
              </li>
              <li>
                <span className="font-bold">Accesibilidad:</span> Cualquiera
                puede disfrutarlo, sin importar su experiencia previa.
              </li>
            </ul>
          </div>

          {/* Nuestro Compromiso */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Nuestro Compromiso</h2>
            <p className="leading-relaxed">
              Nos comprometemos a garantizar la diversión y satisfacción de
              nuestros jugadores. Valoramos tus sugerencias para seguir
              mejorando cada día.
            </p>
          </div>

          {/* Agradecimientos */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-pink-500">Agradecimientos</h2>
            <p className="leading-relaxed">
              Agradecemos a nuestro grupo de amigos por dar vida a Britney. Su
              creatividad, confianza y entusiasmo han sido el motor detrás de
              este proyecto.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AboutUs;
