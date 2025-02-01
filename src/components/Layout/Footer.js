import SuggestionForm from "../Suggestions/SuggestionForm";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, UserGroupIcon, ClockIcon, AcademicCapIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-12 px-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        {/* Contacto */}
        <div className="flex flex-col items-center md:items-start">
        <h3 className="text-lg font-bold mb-4 text-pink-500">Contacto</h3>
        {/* <img src="/logo.png" alt="Logo" className="w-16 h-16" /> */}
        
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <PhoneIcon className="w-5 h-5 text-pink-400" />
              <span>54-3751-*1*2**</span>
            </li>
            <li className="flex items-center gap-3">
            <EnvelopeIcon className="w-5 h-5 text-pink-400" />
              <a href="mailto:jabba@huttdelivery.pizza" className="hover:text-pink-500 transition-colors">
                jabba@huttdelivery.pizza
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPinIcon className="w-5 h-5 text-pink-400" />
              <span>Mos Eisley Cantina, Tatooine 🚀🍻</span>
            </li>
          </ul>
        </div>

        {/* Especificaciones */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4 text-pink-500">Especificaciones</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <AcademicCapIcon className="w-5 h-5 text-pink-400" />
              <span>Edad: 8+ años</span>
            </li>
            <li className="flex items-center gap-3">
              <UserGroupIcon className="w-5 h-5 text-pink-400" />
              <span>Jugadores: 2-6</span>
            </li>
            <li className="flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-pink-400" />
              <span>Duración: 15-30 min</span>
            </li>
          </ul>
        </div>

        {/* Enlaces */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-bold mb-4 text-pink-500">Enlaces</h3>
          <ul className="space-y-3 text-sm">
            {["Inicio", "Nosotros", "Anotador", "Reglas"].map((link, index) => (
              <li key={index}>
                <a href={`/${link.toLowerCase()}`} className="hover:text-pink-500 transition-colors">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sugerencias */}
        <div className="flex flex-col items-center md:items-start w-full">
          <h3 className="text-lg font-bold mb-4 text-pink-500">Déjanos tu sugerencia</h3>
          <p className="text-sm mb-4 text-center md:text-left">
            Ayúdanos a mejorar tu experiencia. Déjanos un comentario o sugerencia.
          </p>
          <div className="w-full max-w-md">
            <SuggestionForm />
          </div>
        </div>
      </div>

      {/* Derechos reservados */}
      <div className="text-center mt-12 border-t border-gray-700 pt-4 text-gray-400 text-sm">
        © {new Date().getFullYear()} All rights reserved
      </div>
    </footer>
  );
};

export default Footer;
