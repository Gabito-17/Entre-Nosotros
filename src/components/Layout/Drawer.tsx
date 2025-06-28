import { XMarkIcon } from "@heroicons/react/24/outline";
import ThemeSelector from "../ThemeSelector";

const menuItems = [
  { label: "Nosotros", href: "/nosotros" },
  { label: "Anotador", href: "/anotador" },
  { label: "Reglas", href: "/reglas" },
];

export default function Drawer() {
  return (
    <>
      {/* Overlay para cerrar el drawer */}
      <label htmlFor="my-drawer" className="drawer-overlay cursor-pointer" />

      {/* Contenedor drawer */}
      <aside className="w-64 bg-base-200 h-screen flex flex-col justify-between shadow-lg">
        {/* Botón cerrar */}
        <div className="flex justify-start p-4">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="w-6 h-6" />
          </label>
        </div>

        {/* Menú */}
        <ul className="menu px-4 flex-grow space-y-2">
          {menuItems.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="block rounded px-3 py-2 hover:bg-primary hover:text-primary-content transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <footer className="border-t p-4 space-y-4">
          <ThemeSelector />
          <div className="text-center">
            <span className="text-sm text-base-content/60 block">
              ¡Ayudanos a mantener la app!
            </span>
            <a
              href="https://cafecito.app/truqito"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Invitame un café en cafecito.app"
              className="inline-block mt-2"
            >
              <img
                srcSet="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x"
                src="https://cdn.cafecito.app/imgs/buttons/button_5.png"
                alt="Invitame un café en cafecito.app"
                className="mx-auto"
              />
            </a>
          </div>
        </footer>
      </aside>
    </>
  );
}
