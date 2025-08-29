"use client";

import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  ChevronDownIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../../lib/supabaseClient.ts";
import { useSoundStore } from "../../stores/useSoundStore.ts";
import { useUserStore } from "../../stores/useUserStore.ts";
import ThemeSelector from "../ThemeSelector.tsx";
import { useState } from "react";

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
      { label: "Jugar", href: "/mafia/crear-sala" },
      { label: "Reglas", href: "/mafia/reglas" },
    ],
  },
];

export default function Drawer() {
  const isMuted = useSoundStore((state) => state.isMuted);
  const toggleMute = useSoundStore((state) => state.toggleMute);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [openSection, setOpenSection] = useState<string | null>(null);

  const handleLogin = async () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <>
      <label htmlFor="my-drawer" className="drawer-overlay cursor-pointer" />

      <aside className="w-64 bg-base-200 min-h-svh flex flex-col justify-between shadow-lg overflow-y-auto">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-5 w-5" />
          </label>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <img
                  src={user.user_metadata?.avatar_url || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover border"
                />
                <button
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm tooltip tooltip-bottom"
                  data-tip="Cerrar sesión"
                >
                  <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn btn-primary btn-sm flex items-center gap-2 tooltip tooltip-bottom"
                data-tip="Iniciar sesión con Google"
              >
                <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* NAVIGATION (ACCORDION) */}
        <nav className="px-4 py-4 flex-grow space-y-2">
          {sections.map(({ title, items }) => {
            const isOpen = openSection === title;
            return (
              <div key={title}>
                <button
                  className="w-full flex justify-between items-center px-3 py-2 text-left font-semibold hover:bg-base-300 transition"
                  onClick={() => setOpenSection(isOpen ? null : title)}
                >
                  {title}
                  <ChevronDownIcon
                    className={`h-5 w-5 transform transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <ul className="menu bg-base-100 rounded-b-lg">
                    {items.map(({ label, href }) => (
                      <li key={label}>
                        <a
                          href={href}
                          className="block px-5 py-2 hover:bg-primary hover:text-primary-content transition-colors"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <ThemeSelector />

        {/* MUTE */}
        <div className="border-t px-4 py-3">
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

        {/* FOOTER */}
        <footer className="border-t w-full py-6 px-4 text-center">
          <span className="text-sm text-base-content/60 block mb-2">
            ¡Ayúdanos a mantener la app!
          </span>
          <a
            href="https://cafecito.app/pavongabriel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Invítame un café en cafecito.app"
          >
            <img
              srcSet="https://cdn.cafecito.app/imgs/buttons/button_5.png 1x, https://cdn.cafecito.app/imgs/buttons/button_5_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_5_3.75x.png 3.75x"
              src="https://cdn.cafecito.app/imgs/buttons/button_5.png"
              alt="Invítame un café en cafecito.app"
              className="mx-auto"
            />
          </a>
        </footer>
      </aside>
    </>
  );
}
