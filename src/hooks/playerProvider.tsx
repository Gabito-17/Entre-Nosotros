import { useEffect } from "react";
import { ensurePlayerCreated } from "../services/userServices.ts";
import { usePlayerStore } from "../stores/usePlayerStore.ts";

export function PlayerProvider({ children }) {
  const setPlayer = usePlayerStore((state) => state.setPlayer);

  useEffect(() => {
    async function loadPlayer() {
      const player = await ensurePlayerCreated();
      if (player) setPlayer(player);
    }
    loadPlayer();
  }, [setPlayer]);

  return <>{children}</>;
}
