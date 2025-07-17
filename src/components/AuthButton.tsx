"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import {
  ArrowRightEndOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useUserStore } from "../stores/useUserStore.ts"; // <-- importá el store

export default function AuthButton() {
  const [loading, setLoading] = useState(true);
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };

    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="animate-pulse h-10 w-24 bg-base-300 rounded-md" />;
  }

  if (user) {
    const avatar = user.user_metadata?.avatar_url ?? "/default-avatar.png";
    const fullName = user.user_metadata?.full_name ?? "Usuario";

    return (
      <div className="flex items-center gap-2">
        <div className="tooltip tooltip-bottom" data-tip={fullName}>
          <img
            src={avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm tooltip"
          data-tip="Cerrar sesión"
        >
          <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleLogin}
      className="btn btn-primary btn-sm flex items-center gap-2 tooltip"
      data-tip="Iniciar sesión con Google"
    >
      <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
      <span className="hidden sm:inline">Login</span>
    </button>
  );
}
