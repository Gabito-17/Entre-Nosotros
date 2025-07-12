import { useSoundStore } from "./useSoundStore.ts";

export function usePlaySound() {
  const isMuted = useSoundStore((state) => state.isMuted);

  const play = (sound: string | HTMLAudioElement, volume = 1) => {
    if (isMuted) return;

    const audio =
      typeof sound === "string" ? new Audio(sound) : (sound as HTMLAudioElement);

    audio.volume = volume;
    audio.play().catch((err) => {
      console.warn("Error al reproducir sonido:", err);
    });
  };

  return play;
}
