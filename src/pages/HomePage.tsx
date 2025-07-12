import Acknowledgements from "../components/AboutUs/Acknowledgements.jsx";
import Introduction from "../components/AboutUs/Introduction.jsx";
import GameList from "../components/GameList.tsx";
import Footer from "../components/Layout/Footer.jsx";
import { motion } from "framer-motion";
import { fadeUp } from "../lib/Animations.ts";

const HomePage = () => {
  return (
    <div className="bg-base-100 text-base-content">
      {/* Introducción animada */}
      <motion.section
        className="bg-base-200"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Introduction />
      </motion.section>

      {/* Lista de Juegos animada */}
      <motion.section
        className="bg-base-200"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <GameList />
      </motion.section>

      {/* Agradecimientos */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <Acknowledgements />
      </motion.section>

      <Footer />
    </div>
  );
};

export default HomePage;
