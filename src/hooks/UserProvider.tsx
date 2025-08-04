import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient.ts"; // ajustá la ruta si hace falta
import { useUserStore } from "../stores/useUserStore.ts";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener el usuario:", error.message);
        return;
      }
      setUser(data.user ?? null);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setUser]);

  return <>{children}</>;
}
