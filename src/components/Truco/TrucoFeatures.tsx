import { motion } from "framer-motion";
import {
  EyeIcon,
  HandRaisedIcon,
  SpeakerWaveIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { fadeItem, fadeContainer } from "../../lib/Animations.ts";

const features = [
  {
    image: "/assets/svgs/undraw_team_spirit_re_yl1v.svg",
    title: "Juego en Equipo",
    description:
      "Jugá en pareja y desarrollá complicidad con tu compañero usando señas y estrategias compartidas.",
    icon: <UsersIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_voice_interface_eckp.svg",
    title: "Señas y Mentiras",
    description:
      "El arte del engaño es clave: dominá las señas y mentí con seguridad para llevarte la ronda.",
    icon: <SpeakerWaveIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_mindfulness_scgo.svg",
    title: "Atención al Juego",
    description:
      "Prestá atención a cada jugada y anticipá los movimientos del rival para tomar las mejores decisiones.",
    icon: <EyeIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_playing-cards_yoqo.svg",
    title: "Cartas con Jerarquía",
    description:
      "Del ancho de espadas al cuatro de copas: aprendé el orden de las cartas y usalo a tu favor.",
    icon: <HandRaisedIcon className="w-8 h-8" />,
  },
];

const FeaturesTruco = () => {
  return (
    <div className="text-base-content py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        Características del Truco
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 container mx-auto px-6"
        variants={fadeContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="card bg-base-100 shadow-xl"
            variants={fadeItem}
            custom={index * 0.15}
          >
            <figure className="flex justify-center items-center h-40 bg-base-200">
              <motion.img
                src={feature.image}
                alt={feature.title}
                className="h-full w-auto max-h-36 object-contain"
                loading="lazy"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </figure>

            <div className="card-body">
              <div className="flex items-center gap-3 mb-2 text-primary">
                {feature.icon}
                <h3 className="text-lg font-bold">{feature.title}</h3>
              </div>
              <p className="text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FeaturesTruco;
