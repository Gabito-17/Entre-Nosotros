import { motion } from "framer-motion";

const names = [
  "Alexis", "Ger", "Facu", "Coco", "Flopy", "Dai", "Juany", "Guille", "Lauro", "Patricia", "Panchito",
];

const Acknowledgements = () => {
  const duplicatedNames = [...names, ...names]; // Duplicamos para efecto continuo

  return (
    <motion.div
      className="mx-auto text-center py-8 px-6"
      variants={{ initial: {}, animate: { transition: { staggerChildren: 0.3 } } }}
      initial="initial"
      animate="animate"
    >
      <motion.p
        className="text-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6 } }}
      >
        Agradezco a la valiosa comunidad de los pibes por probar la aplicación y brindar su valiosa retroalimentación... ídolos.
      </motion.p>

      <motion.p
        className="text-3xl font-bold mb-8 text-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.3 } }}
      >
        Muchas Gracias
      </motion.p>

      <div className="relative overflow-hidden w-full max-w-2xl mx-auto rounded-box shadow-inner p-4">
        <motion.div
          className="flex gap-8 whitespace-nowrap text-lg font-semibold text-primary"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: duplicatedNames.length * 1.5, // Ajusta la velocidad
            ease: "linear",
            repeat: Infinity
          }}
          style={{ width: "max-content" }}
        >
          {duplicatedNames.map((name, idx) => (
            <span key={idx} className="px-4">
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Acknowledgements;
