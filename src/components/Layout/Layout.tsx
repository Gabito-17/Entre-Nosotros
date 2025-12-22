import { useEffect } from "react";
import { useSoundStore } from "../../stores/useSoundStore.ts";
import ConfirmationModal from "../Modals/ConfirmationModal.tsx";
import Drawer from "./Drawer.tsx";
import NavBar from "./NavBar.tsx";
import Footer from "./Footer.jsx";

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
      {/* Control del drawer */}
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />

      {/* App */}
      <div className="flex min-h-screen flex-col bg-base-100">
        <NavBar />

        {/* MAIN */}
        <main className="flex-1">
          {/* Container global */}
          <div className="
            mx-auto
            w-full
            max-w-7xl
            px-4
            sm:px-6
            lg:px-8
            py-6
          ">
            {children}
          </div>
        </main>
        <Footer/>
      </div>

      {/* Drawer */}
      <div className="drawer-side z-[60]">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <Drawer />
      </div>

      <ConfirmationModal />
    </div>
  );
}
