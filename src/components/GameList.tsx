import { motion } from "framer-motion";
import { fadeContainer, fadeItem } from "../lib/Animations.ts";
import { PuzzlePieceIcon, BoltIcon } from "@heroicons/react/24/outline";
import { FC, JSX } from "react";

interface Game {
  name: string;
  description: string;
  image: string;
  href: string;
  icon: JSX.Element;
}

const games: Game[] = [
  {
    name: "Truco Argentino",
    description: "Clásico juego de cartas con señas, mentiras y equipos.",
    image: "/assets/images/truco.png",
    href: "/truco/anotador",
    icon: <PuzzlePieceIcon className="w-8 h-8" />,
  },
  {
    name: "Britney",
    description: "Juego original de estrategia, memoria y diversión.",
    image: "/assets/images/i5.webp",
    href: "/britney/anotador",
    icon: <BoltIcon className="w-8 h-8" />,
  },
];

const GameList: FC = () => {
  return (
    <div className="text-base-content py-16 bg-base-100">
      <h2 className="text-3xl font-bold mb-10 text-center text-primary">
        Juegos disponibles
      </h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 container mx-auto px-6"
        variants={fadeContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {games.map((game, index) => (
          <motion.a
            key={index}
            href={game.href}
            className="card bg-base-200 shadow-xl hover:scale-[1.02] hover:shadow-2xl transition-all cursor-pointer"
            variants={fadeItem}
            custom={index * 0.3}
          >
            <figure>
              <img
                src={game.image}
                alt={game.name}
                className="h-40 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <div className="flex items-center gap-3 mb-2 text-primary">
                {game.icon}
                <h3 className="text-lg font-bold">{game.name}</h3>
              </div>
              <p className="text-sm text-base-content">{game.description}</p>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
};

export default GameList;
