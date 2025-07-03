"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import ThemeSelector from "../ThemeSelector.tsx";
import Title from "./Title/Title";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkbox = document.getElementById("my-drawer") as HTMLInputElement;
    const updateState = () => setIsDrawerOpen(checkbox.checked);
    checkbox?.addEventListener("change", updateState);
    return () => checkbox?.removeEventListener("change", updateState);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-base-200 shadow-md z-50 flex items-center px-4">
      <div className="navbar w-full max-w-screen-xl mx-auto px-4">
        <div className="navbar-start">
          <Title />
        </div>
        <div className="navbar-center hidden lg:flex" /> <ThemeSelector />
        <div className="navbar-end">
          <label
            htmlFor="my-drawer"
            className="btn btn-square btn-ghost"
            aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
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
  );
}
