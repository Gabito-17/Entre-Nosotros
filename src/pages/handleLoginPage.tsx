import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient.ts";

export default function HandleLoginPage() {
  useEffect(() => {
    const syncAndRedirect = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user) {
        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");
        window.location.href = redirectTo;
      }
    };

    syncAndRedirect();
  }, []);

  return <p>Redireccionando...</p>;
}
