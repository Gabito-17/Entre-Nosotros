import Drawer from "./Drawer.tsx";
import NavBar from "./NavBar.tsx";
import { useEffect } from "react";
import { useSoundStore } from "../../stores/useSoundStore.ts"; // ajustá el path si es distinto
import ConfirmationModal from "../Modals/ConfirmationModal.tsx";

export default function Layout({ children }: { children: React.ReactNode }) {
  const setMuted = useSoundStore((state) => state.setMuted);

  useEffect(() => {
    const saved = localStorage.getItem("isMuted");
    if (saved !== null) {
      setMuted(JSON.parse(saved));
    }
  }, [setMuted]);

  return (
    <div className="drawer drawer-end">
      {/* Checkbox que controla el drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* Contenido principal */}
      <div className="drawer-content flex flex-col min-h-svh">
        <NavBar />

        {/* Contenedor centrado con límite de ancho */}
        <main className="flex-1 pt-16 px-4">
          <div className="w-full max-w-screen-xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Drawer lateral */}
      <div className="drawer-side z-[60]">
        <Drawer />
      </div>
      <ConfirmationModal />
    </div>
  );
}
