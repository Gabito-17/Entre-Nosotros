import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useSoundStore } from "../../stores/useSoundStore.ts";

const sections = [
  {
    title: "Britney",
    items: [
      { label: "Acerca de", href: "/britney" },
      { label: "Anotador", href: "/britney/anotador" },
      { label: "Reglas", href: "/britney/reglas" },
    ],
  },
  {
    title: "Truco",
    items: [
      { label: "Acerca de", href: "/truco" },
      { label: "Anotador", href: "/truco/anotador" },
      { label: "Reglas", href: "/truco/reglas" },
    ],
  },
  {
    title: "Mafia",
    items: [
      { label: "Acerca de", href: "/mafia" },
      { label: "Jugar", href: "/mafia/anotador" },
      { label: "Reglas", href: "/mafia/reglas" },
    ],
  },
];

export default function Drawer() {
  const isMuted = useSoundStore((state) => state.isMuted);
  const toggleMute = useSoundStore((state) => state.toggleMute);
  return (
    <>
      <label htmlFor="my-drawer" className="drawer-overlay cursor-pointer" />

      <aside className="w-64 bg-base-200 min-h-svh flex flex-col justify-between shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b pr-4">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-5 w-5" />
          </label>
        </div>

        {/* Menu */}
        <nav className="px-4 py-4 flex-grow space-y-6">
          {sections.map(({ title, items }) => (
            <div key={title}>
              <h3 className="text-xs uppercase text-base-content/50 mb-1 pl-2 tracking-wide">
                {title}
              </h3>
              <ul className="menu space-y-1">
                {items.map(({ label, href }) => (
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
            </div>
          ))}
        </nav>
        {/* Mute toggle */}
        <div className="border-t px-4 py-4">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 text-sm text-base-content hover:text-primary transition"
            aria-label={isMuted ? "Activar sonido" : "Desactivar sonido"}
          >
            {isMuted ? (
              <>
                <SpeakerXMarkIcon className="h-5 w-5" />
                Sonido desactivado
              </>
            ) : (
              <>
                <SpeakerWaveIcon className="h-5 w-5" />
                Sonido activado
              </>
            )}
          </button>
        </div>
        {/* Footer */}
        <footer className="border-t w-full py-8">
          <div className="text-center">
            <span className="text-sm text-base-content/60 block">
              ¡Ayudanos a mantener la app!
            </span>
            <a
              href="https://cafecito.app/pavongabriel"
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
