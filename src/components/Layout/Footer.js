import {
  AcademicCapIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import SuggestionForm from "../Suggestions/SuggestionForm";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Contacto */}
        <div>
          <h3 className="footer-title text-primary">Contacto</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5 text-secondary" />
              <span>54-3751-*1*2**</span>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 text-secondary" />
              <a href="mailto:jabba@huttdelivery.pizza" className="link-hover">
                jabba@huttdelivery.pizza
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-secondary" />
              <span>Mos Eisley Cantina, Tatooine 🚀🍻</span>
            </li>
          </ul>
        </div>

        {/* Especificaciones */}
        <div>
          <h3 className="footer-title text-primary">Especificaciones</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-secondary" />
              <span>Edad: 8+ años</span>
            </li>
            <li className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-secondary" />
              <span>Jugadores: 2-8</span>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-secondary" />
              <span>Duración: 30-45 min</span>
            </li>
          </ul>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="footer-title text-primary">Enlaces</h3>
          <ul className="text-sm space-y-2">
            {[
              { name: "Inicio", href: "/" },
              { name: "Nosotros", href: "/nosotros" },
              { name: "Anotador", href: "/anotador" },
              { name: "Reglas", href: "/reglas" },
            ].map((link, index) => (
              <li key={index}>
                <a href={link.href} className="link-hover">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sugerencias */}
        <div>
          <h3 className="footer-title text-primary">Déjanos tu sugerencia</h3>
          <p className="text-sm mb-4">
            Ayúdanos a mejorar tu experiencia. Déjanos un comentario o
            sugerencia.
          </p>
          <SuggestionForm />
        </div>
      </div>

      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
