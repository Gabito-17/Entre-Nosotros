import { motion } from "framer-motion";
import Features from "../components/Features";
import Introduction from "../components/Introduction";
import Footer from "../components/Layout/Footer.jsx";
import { fadeUp } from "../lib/Animations.ts";
import { fadeContainer } from "../lib/Animations.ts";

const LandingPage = () => {
  return (
    <div>
      <Introduction />

      <motion.section
        className="bg-base-200"
        variants={fadeUp}
        transition={{ duration: 0.5 }}
      >
        <Features />
      </motion.section>

      <motion.section
        className="py-16 text-center"
        variants={fadeUp}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold mb-4 text-primary">
          ¡Empieza a jugar Britney hoy!
        </h2>
        <p className="text-lg text-gray-700 mb-6">
          Simplifica la forma en que juegas y mantén todo organizado.
        </p>
        <a href="/anotador" className="btn btn-primary">
          Utilizar anotador
        </a>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;