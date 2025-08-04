import { create } from "zustand";

interface Player {
  id: string;
  user_id: string;
  name?: string;
  avatar_url?: string | null;
}

interface PlayerStore {
  player: Player | null;
  setPlayer: (player: Player) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  clearPlayer: () => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  player: null,

  setPlayer: (player) => set({ player }),

  updatePlayer: (updates) =>
    set((state) => ({
      player: state.player ? { ...state.player, ...updates } : null,
    })),

  clearPlayer: () => set({ player: null }),
}));
