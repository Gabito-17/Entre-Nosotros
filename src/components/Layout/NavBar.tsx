import { useState } from "react";
import Title from "./Title/Title";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  return (
    <>   

      {/* Barra de navegación fija */}
      <nav className="fixed top-0 left-0 w-full bg-base-200 shadow-md z-50 h-16 flex items-center">
        <div className="navbar w-full max-w-screen-xl mx-auto px-4">
          <div className="navbar-start">
            <Title />
          </div>
          <div className="navbar-center hidden lg:flex" />
          <div className="navbar-end">
            <label
              htmlFor="my-drawer"
              className="btn btn-square btn-ghost"
              aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={toggleDrawer}
            >
              {isDrawerOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </label>
          </div>
        </div>
      </nav>
    </>
  );
}
