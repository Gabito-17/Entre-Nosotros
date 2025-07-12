import { motion } from "framer-motion";
import Features from "../BritneyFeatures.jsx";
import Introduction from "../BritneyIntroduction.jsx";
import Footer from "../../Layout/Footer.jsx";
import { fadeUp } from "../../../lib/Animations.ts";

const BritneyPage = () => {
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
          ¡Empieza a jugar Britney hoy!
        </h2>
        <p className="text-lg mb-6">
          Simplifica la forma en que juegas y mantén todo organizado.
        </p>
        <a href="/britney/anotador" className="btn btn-primary">
          Utilizar anotador
        </a>
      </motion.section>

      <Footer />
    </div>
  );
};

export default BritneyPage;
