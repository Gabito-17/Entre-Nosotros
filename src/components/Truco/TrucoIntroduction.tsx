import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "../../lib/Animations.ts";

const TrucoIntroduction = () => {
  return (
    <motion.section
      className="py-8 px-6 container mx-auto text-center lg:text-left lg:flex lg:items-center lg:gap-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="lg:w-1/2" variants={fadeLeft}>
        <h2 className="text-4xl font-bold mb-6 text-primary">
          Jugá al Truco Argentino
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          El <strong>Truco Argentino</strong> es un clásico juego de cartas lleno de
          <strong> estrategia</strong>, <strong>engaños</strong> y <strong>señas</strong>. Jugado en equipos o individual,
          pone a prueba tu capacidad para <strong>mentir con convicción</strong>,
          <strong>interpretar señales</strong> y saber cuándo decir <strong>“¡Quiero retruco!”</strong>.
          ¡Sumá puntos, ganá manos y convertite en el más vivo de la mesa!
        </p>
        <a href="/truco/reglas" className="btn btn-primary">
          Aprender a jugar
        </a>
      </motion.div>

      <motion.div className="lg:w-1/2 mt-8 lg:mt-0" variants={fadeRight}>
        <motion.img
          src="/assets/svgs/undraw_card-game.svg"
          alt="Truco Argentino preview"
          className="rounded-box shadow-xl w-full transition-all duration-300 ease-out"
          loading="eager"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </motion.div>
    </motion.section>
  );
};

export default TrucoIntroduction;
