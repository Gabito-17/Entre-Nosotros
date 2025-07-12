import { motion } from "framer-motion";
import TrucoIntroduction from "../TrucoIntroduction.tsx"; // Asegurate de que esté bien el path
import FeaturesTruco from "../TrucoFeatures.tsx";         // Asegurate de que esté bien el path
import Footer from "../../Layout/Footer.jsx";
import { fadeUp } from "../../../lib/Animations.ts";

const TrucoPage = () => {
  return (
    <div>
      {/* Introducción animada */}
      <TrucoIntroduction />

      {/* Características del truco */}
      <motion.section
        className="bg-base-200"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <FeaturesTruco />
      </motion.section>

      {/* CTA para usar el anotador */}
      <motion.section
        className="py-16 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-primary">
          ¡Empezá a jugar Truco ahora!
        </h2>
        <p className="text-lg mb-6">
          Usá nuestro anotador digital para llevar la cuenta de los puntos con comodidad y claridad.
        </p>
        <a href="/truco/anotador" className="btn btn-primary">
          Utilizar anotador
        </a>
      </motion.section>

      <Footer />
    </div>
  );
};

export default TrucoPage;
