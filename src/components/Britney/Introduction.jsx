import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "../../lib/Animations.ts";

const Introduction = () => {
  return (
    <motion.section
      className="py-8 px-6 container mx-auto text-center lg:text-left lg:flex lg:items-center lg:gap-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div
        className="lg:w-1/2"
        variants={fadeLeft}
      >
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
          canta <strong>"Britney"</strong> para ganar!
        </p>
        <a href="/britney/reglas" className="btn btn-primary">
          Aprender a jugar
        </a>
      </motion.div>

      <motion.div
        className="lg:w-1/2 mt-8 lg:mt-0"
        variants={fadeRight}
      >
        <motion.img
          src="/assets/images/i5.webp"
          alt="Britney preview"
          className="rounded-box shadow-xl w-full transition-all duration-300 ease-out"
          loading="eager"
          fetchpriority="high"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>
    </motion.section>
  );
};

export default Introduction;