import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Title from "./Title/Title";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <>
      {/* Barra de navegación fija */}
      <nav className="fixed top-0 left-0 w-full h-16 bg-base-200 shadow-md z-50 flex items-center px-4">
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
