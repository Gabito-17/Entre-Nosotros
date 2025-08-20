// hooks/UserProvider.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.ts";
import { useUserStore } from "../stores/useUserStore.ts";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener usuario:", error.message);
        setUser(null);
      } else {
        setUser(data.user ?? null);
      }
      setLoading(false);
    };

    loadUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [setUser]);

  if (loading) {
    return <div>Cargando usuario...</div>; // o spinner
  }

  return <>{children}</>;
}
