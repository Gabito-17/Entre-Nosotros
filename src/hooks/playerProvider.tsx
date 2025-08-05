import { useEffect } from "react";
import { ensurePlayerCreated } from "../services/userServices.ts";
import { usePlayerStore } from "../stores/usePlayerStore.ts";
import { useUserStore } from "../stores/useUserStore.ts";

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const user = useUserStore((state) => state.user);
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  useEffect(() => {
    async function loadPlayer() {
      if (!user) {
        // Si no hay usuario, limpiamos el jugador
        setPlayer(null);
        return;
      }
      const player = await ensurePlayerCreated();
      setPlayer(player);
    }
    loadPlayer();
  }, [user, setPlayer]);

  return <>{children}</>;
}
