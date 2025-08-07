import { motion } from "framer-motion";
import Features from "../MafiaFeatures.tsx";
import Introduction from "../MafiaIntroduction.tsx";
import Footer from "../../Layout/Footer.jsx";
import { fadeUp } from "../../../lib/Animations.ts";

const MafiaPage = () => {
  return (
    <div>
      <Introduction />

      <motion.section
        className="bg-base-200"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Features />
      </motion.section>

      <motion.section
        className="py-16 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-primary">
          ¡Comenzá a jugar La Mafia ahora!
        </h2>
        <p className="text-lg mb-6">
          Jugá sin necesidad de un Game Master y viví la experiencia con tus
          amigos de forma organizada y automática.
        </p>
        <a href="/mafia/crear-sala" className="btn btn-primary">
          Iniciar partida
        </a>
      </motion.section>

      <Footer />
    </div>
  );
};

export default MafiaPage;
