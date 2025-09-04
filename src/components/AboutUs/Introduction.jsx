import { motion } from "framer-motion";
import { fadeLeft, fadeRight } from "../../lib/Animations.ts";

const Introduction = () => {
  return (
    <section className="py-8 text-center lg:text-left lg:flex lg:space-x-12 px-6 container mx-auto">
      <motion.div
        className="lg:w-1/2 lg:mt-0 flex justify-center items-center"
        variants={fadeLeft}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="rounded-md shadow-lg w-full h-128 object-cover"
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = 1.5)}
        >
          <source src="/assets/videos/couple-playing.mp4" type="video/mp4" />
        </video>
      </motion.div>

      <motion.div
        className="lg:w-1/2"
        variants={fadeRight}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <h1 className="text-4xl font-bold py-6 text-primary">
          Jueguen entre ustedes
        </h1>
        <p className="text-lg leading-relaxed mb-6 text-base-content">
          Esta plataforma nació como un proyecto entre amigos con la idea de
          hacer más divertidas y fáciles de organizar nuestras partidas de
          juegos de cartas. Queremos que jugar a esos juegos sociales, incluso
          los más raros o inventados por nosotros, sea simple y entretenido para
          todos.
        </p>
        <p className="text-lg leading-relaxed mb-6 text-base-content">
          Acá vas a encontrar anotadores digitales, reglas explicadas de
          distintos juegos y herramientas pensadas para que tus partidas sean
          más ordenadas y divertidas, tanto si jugás en familia como con amigos.
        </p>
        <p className="text-lg leading-relaxed text-base-content">
          Lo que empezó como una solución casera para no perder la cuenta de los
          puntos terminó creciendo en un proyecto que busca acercar a más
          personas a los juegos mencionados. Nuestro objetivo es que cada
          partida sea más disfrutable, dejando de lado las complicaciones y
          enfocándonos en lo más importante: divertirse juntos.
        </p>
      </motion.div>
    </section>
  );
};

export default Introduction;
