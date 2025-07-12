import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "../../lib/Animations.ts";

const Introduction = () => {
  return (
    <section className="py-8 text-center lg:text-left lg:flex lg:space-x-12 px-6 container mx-auto">
      <motion.div
        className="lg:w-1/2 lg:mt-0"
        variants={fadeLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <img
          src={"/assets/svgs/undraw_having-fun_kkeu.svg"}
          alt="Ilustración de juegos sociales"
          className="rounded-lg shadow-lg w-full"
          loading="lazy"
        />
      </motion.div>

      <motion.div
        className="lg:w-1/2"
        variants={fadeRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className="text-4xl font-bold py-6 text-primary">
          Jueguen entre ustedes
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-base-content">
          Esta plataforma nació como un proyecto entre amigos con la idea de
          crear una herramienta digital para mejorar la experiencia de nuestras
          partidas con juegos de cartas. Queremos lograr que jugar a juegos
          sociales raros nuestros sea más sencillo.
        </p>
        <p className="text-lg leading-relaxed text-base-content">
          Acá vas a encontrar anotadores digitales, reglas de distintos juegos y
          utilidades diseñadas para que tus partidas sean más organizadas, tanto
          si estás en una reunión familiar como entre amigos.
        </p>
      </motion.div>
    </section>
  );
};

export default Introduction;
