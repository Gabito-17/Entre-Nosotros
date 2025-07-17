import { motion } from "framer-motion";
import {
  UserGroupIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { fadeItem, fadeContainer } from "../../lib/Animations.ts";

const features = [
  {
    image: "/assets/svgs/undraw_night_calls_re_4q21.svg",
    title: "Fases de Día y Noche",
    description:
      "Durante la noche, los mafiosos atacan en secreto. Durante el día, los jugadores debaten y votan para expulsar sospechosos.",
    icon: <EyeSlashIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_team_spirit_re_yl1v.svg",
    title: "Juego en Equipo",
    description:
      "Cada bando tiene su objetivo. Civiles y roles especiales deben cooperar para descubrir a los mafiosos.",
    icon: <UserGroupIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_doctor_kw5l.svg",
    title: "Roles Especiales",
    description:
      "El doctor puede proteger, la policía investigar, y los mafiosos eliminar. ¡Cada rol cambia el rumbo del juego!",
    icon: <ShieldCheckIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/svgs/undraw_investigating_re_fdbq.svg",
    title: "Acusaciones y Estrategia",
    description:
      "Convencer, mentir y deducir: el juego gira en torno a la persuasión y el análisis social.",
    icon: <ScaleIcon className="w-8 h-8" />,
  },
];

const MafiaFeatures = () => {
  return (
    <div className="text-base-content py-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-primary">
        Características del Juego
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

export default MafiaFeatures;
