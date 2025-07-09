import {
  AcademicCapIcon,
  ClockIcon,
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content p-6">
      <div className="container mx-auto grid grid-cols-1 md:justify-items-center md:grid-cols-3 gap-10">
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
              <a
                href="mailto:juangabrielpavon@gmail.com"
                className="link-hover"
              >
                juangabrielpavon@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5 text-secondary" />
              <span>Misiones, Argentina 🚀</span>
            </li>
          </ul>
        </div>

        {/* Información general */}
        <div>
          <h3 className="footer-title text-primary">Plataforma</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 text-secondary" />
              <span>Ideal para juegos sociales</span>
            </li>
            <li className="flex items-center gap-2">
              <UserGroupIcon className="w-5 h-5 text-secondary" />
              <span>Jugadores: 2-8+</span>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-secondary" />
              <span>Partidas: 10 a 60 min</span>
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
              { name: "Sugerencias", href: "/sugerencias" },
              { name: "Britney", href: "/britney" },
              { name: "Truco", href: "/truco" },
            ].map((link, index) => (
              <li key={index}>
                <a href={link.href} className="link-hover">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Todos los derechos reservados
      </div>
    </footer>
  );
};

export default Footer;
