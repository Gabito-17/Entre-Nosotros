"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Title from "./Title/Title.jsx";
import AuthButton from "../AuthButton.tsx";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const checkbox = document.getElementById("my-drawer") as HTMLInputElement;
    if (!checkbox) return;

    const updateState = () => setIsDrawerOpen(checkbox.checked);
    checkbox.addEventListener("change", updateState);
    return () => checkbox.removeEventListener("change", updateState);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 bg-base-200 shadow-md">
      <div
        className="
          mx-auto
          h-full
          max-w-7xl
          px-4
          sm:px-6
          lg:px-8
          flex
          items-center
        "
      >
        <div className="navbar w-full">
          <div className="navbar-start" />

          <div className="navbar-center flex">
            <Title />
          </div>

          <div className="navbar-end gap-2">
            <AuthButton />
            <label
              htmlFor="my-drawer"
              className="btn btn-square btn-ghost"
              aria-label={isDrawerOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isDrawerOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </label>
          </div>
        </div>
      </div>
    </nav>
  );
}
