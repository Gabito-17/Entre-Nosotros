import { motion } from "framer-motion";
import {
  CogIcon,
  HeartIcon,
  LightBulbIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { fadeItem, fadeContainer } from "../../lib/Animations.ts";

const features = [
  {
    image: "/assets/images/i1.webp",
    title: "Memoria Estratégica",
    description:
      "Los jugadores deben recordar las cartas visibles y las jugadas anteriores para descartar eficientemente.",
    icon: <CogIcon className="w-8 h-8 " />,
  },
  {
    image: "/assets/images/i2.webp",
    title: "Habilidades Especiales",
    description:
      "Las cartas 7, 8 y 9 tienen habilidades únicas que añaden un elemento estratégico al juego.",
    icon: <LightBulbIcon className="w-8 h-8 " />,
  },
  {
    image: "/assets/images/i3.webp",
    title: "Sistema de Penalización",
    description:
      "Los jugadores pueden recoger cartas si cometen errores, lo que agrega un nivel de riesgo a cada jugada.",
    icon: <HeartIcon className="w-8 h-8" />,
  },
  {
    image: "/assets/images/i4.webp",
    title: "Juego Dinámico",
    description:
      "Cada turno trae nuevas decisiones, manteniendo a los jugadores en alerta y comprometidos.",
    icon: <UsersIcon className="w-8 h-8 " />,
  },
];

const Features = () => {
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
            custom={index * 0.15} // Más fluido
          >
            <figure className="bg-base-200">
              <img
                src={feature.image}
                alt={feature.title}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2 text-primary">
                {feature.icon}
                <h3 className="text-lg font-bold ">{feature.title}</h3>
              </div>
              <p className="text-sm">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;
