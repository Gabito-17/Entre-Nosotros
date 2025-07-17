import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "../../lib/Animations.ts";

const MafiaIntroduction = () => {
  return (
    <motion.section
      className="py-8 px-6 container mx-auto text-center lg:text-left lg:flex lg:items-center lg:gap-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div className="lg:w-1/2" variants={fadeLeft}>
        <h2 className="text-4xl font-bold mb-6 text-primary">
          Jugá a La Mafia
        </h2>
        <p className="text-lg leading-relaxed mb-6">
          <strong>La Mafia</strong> es un juego grupal de roles ocultos donde cada jugador asume una identidad: 
          <strong> mafioso</strong>, <strong>policía</strong>, <strong>doctor</strong> o 
          <strong> civil</strong>. A través de turnos divididos en noche y día, los jugadores deben debatir, acusar, proteger o eliminar a otros,
          ¡todo mientras ocultan su verdadero rol!
        </p>
        <a href="/mafia/reglas" className="btn btn-primary">
          Aprender a jugar
        </a>
      </motion.div>

      <motion.div className="lg:w-1/2 mt-8 lg:mt-0" variants={fadeRight}>
        <motion.img
          src="/assets/svgs/undraw_secret_identity_re_9jjc.svg"
          alt="Mafia preview"
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

export default MafiaIntroduction;
