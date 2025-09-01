"use client";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Title from "./Title/Title";
import { useUserStore } from "../../stores/useUserStore.ts";
import { supabase } from "../../lib/supabaseClient.ts";

export default function NavBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const handleLogin = async () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const checkbox = document.getElementById("my-drawer") as HTMLInputElement;
    const updateState = () => setIsDrawerOpen(checkbox.checked);
    checkbox?.addEventListener("change", updateState);
    return () => checkbox?.removeEventListener("change", updateState);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full h-16 bg-base-200 shadow-md z-50 flex items-center px-4">
      <div className="navbar w-full max-w-screen-xl mx-auto px-4">
        <div className="navbar-start"></div>
        <div className="navbar-center hidden lg:flex" /> <Title />
        <div className="navbar-end">
          {" "}
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
                  <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
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
