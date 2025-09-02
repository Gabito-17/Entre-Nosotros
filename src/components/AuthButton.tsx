"use client";

import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import { ensurePlayerCreated } from "../services/userServices.ts"; // crea o fetchéa player
import { usePlayerStore } from "../stores/usePlayerStore.ts";
import { useUiStore } from "../stores/useUiStore.ts";

export default function AuthButton() {
  const [loading, setLoading] = useState(true);
  const player = usePlayerStore((state) => state.player);
  const setPlayer = usePlayerStore((state) => state.setPlayer);
  const openConfirmationModal = useUiStore(
    (state) => state.openConfirmationModal
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /** --- Effects --- **/
  useEffect(() => {
    const fetchAndSetPlayer = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setPlayer(null);
      } else {
        const newPlayer = await ensurePlayerCreated();
        setPlayer(newPlayer);
      }
      setLoading(false);
    };
    fetchAndSetPlayer();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session?.user) {
          setPlayer(null);
        } else {
          ensurePlayerCreated().then(setPlayer);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [setPlayer]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** --- Actions --- **/
  const handleLogin = async () => {
    const currentPath = window.location.pathname + window.location.search;
    localStorage.setItem("redirectAfterLogin", currentPath);
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPlayer(null);
  };

  /** --- UI States --- **/
  if (loading) {
    return <div className="animate-pulse h-10 w-24 bg-base-300 rounded-md" />;
  }

  if (!player) {
    return (
      <button
        onClick={handleLogin}
        className="btn btn-primary btn-sm flex items-center gap-2 tooltip tooltip-bottom"
        data-tip="Iniciar sesión con Google"
      >
        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Login</span>
      </button>
    );
  }

  const avatar = player.avatar_url || "/default-avatar.png";
  const nickname = player.name || "Jugador";

  /** --- Render --- **/
  return (
    <div className="relative" ref={menuRef}>
      <img
        src={avatar}
        alt="Avatar"
        className="w-8 h-8 rounded-full object-cover border cursor-pointer"
        onClick={() => setMenuOpen((prev) => !prev)}
      />

      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-base-100 rounded shadow-md z-50"
          role="menu"
        >
          <div className="p-2 text-sm font-semibold border-b text-gray-700">
            {nickname}
          </div>

          <button
            onClick={() => {
              setMenuOpen(false);
              // TODO: cambiar por navegación de react-router-dom si lo usás
              window.location.href = "/perfil/settings";
            }}
            className="flex items-center w-full px-4 py-2 hover:bg-base-200"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Editar perfil
          </button>

          <button
            onClick={() =>
              openConfirmationModal({
                title: "¿Cerrar sesión?",
                message: "¿Estás seguro de que querés cerrar sesión?",
                onConfirm: handleLogout,
                actions: [
                  { label: "Cancelar", className: "btn btn-ghost" },
                  {
                    label: "Cerrar sesión",
                    className: "btn btn-error",
                    onClick: handleLogout,
                  },
                ],
              })
            }
            className="flex items-center w-full px-4 py-2 hover:bg-base-200"
          >
            <ArrowRightEndOnRectangleIcon className="w-4 h-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
