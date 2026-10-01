// Utilidades compartidas por los tests del motor de torneo
import { conResultado } from "./partido.ts";
import { Partido, Ronda } from "./tipos.ts";

export const ids = (n: number) => Array.from({ length: n }, (_, i) => `e${i + 1}`);

// Random determinístico (LCG) para que el sorteo sea reproducible
export const randomConSemilla = (semilla: number) => {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 2 ** 32;
    return s / 2 ** 32;
  };
};

export const todosLosPartidos = (rondas: Ronda[]) => rondas.flatMap((r) => r.partidos);

// Juega un partido: gana A 15 a `perdedor` o, si ganaB, al revés
export const jugar = (p: Partido, ganaB = false, perdedor = 10): Partido =>
  ganaB ? conResultado(p, perdedor, 15, "manual") : conResultado(p, 15, perdedor, "manual");
