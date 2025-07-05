import { motion } from "framer-motion";
import { fadeUp, fadeItem, staggerContainer } from "../../lib/Animations.ts"; // ajustá la ruta según tu estructura

const Acknowledgements = () => {
  return (
    <motion.div
      className="mx-auto text-center"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.h2
        className="text-3xl font-bold mb-8 text-primary"
        variants={fadeUp}
        transition={{ duration: 0.6 }}
      >
        Agradecimientos
      </motion.h2>

      <motion.p className="text-lg mb-6" variants={fadeItem(0.3)}>
        Queremos agradecer a .. ¿?
      </motion.p>

      <motion.p className="text-lg" variants={fadeItem(0.5)}>
        También agradecemos a la valiosa comunidad de los pibes por probar el
        juego y brindar su valiosa retroalimentación.. ídolos.
      </motion.p>
    </motion.div>
  );
};

export default Acknowledgements;
