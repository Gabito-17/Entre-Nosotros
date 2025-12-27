import { motion } from "framer-motion";

const names = [
  "Alexis",
  "Coco",
  "Dai",
  "Facu",
  "Flopy",
  "Guille",
  "Ger",
  "Juany",
  "Lauro",
  "Patricia",
  "Panchito",
];

const Acknowledgements = () => {
  const duplicatedNames = [...names, ...names];

  return (
    <section className="mx-auto text-center py-8 px-6 overflow-x-hidden">
      <p className="text-lg mb-6">
        Agradezco a la valiosa comunidad de los pibes por probar la aplicación y
        brindar su valiosa retroalimentación... ídolos.
      </p>

      <p className="text-3xl font-bold mb-8 text-primary">
        Muchas Gracias
      </p>

      {/* CONTENEDOR */}
      <div className="relative w-full max-w-2xl mx-auto overflow-hidden rounded-box shadow-inner p-6">
        {/* CARRIL */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-8 whitespace-nowrap text-lg font-semibold text-primary"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: duplicatedNames.length * 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {duplicatedNames.map((name, idx) => (
            <span key={idx} className="px-4 shrink-0">
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Acknowledgements;
