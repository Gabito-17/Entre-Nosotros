import { create } from "zustand";

interface SoundStore {
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (value: boolean) => void;
}

export const useSoundStore = create<SoundStore>((set) => ({
  isMuted: false,

  toggleMute: () =>
    set((state) => {
      const newValue = !state.isMuted;
      localStorage.setItem("isMuted", JSON.stringify(newValue));
      return { isMuted: newValue };
    }),

  setMuted: (value) => {
    localStorage.setItem("isMuted", JSON.stringify(value));
    set({ isMuted: value });
  },
}));
