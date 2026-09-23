import { Partido, Ronda } from "./tipos.ts";

export const nuevoId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const crearPartido = (
  equipoA: string | null,
  equipoB: string | null
): Partido => ({
  id: nuevoId(),
  equipoA,
  equipoB,
  tantosA: null,
  tantosB: null,
  ganador: null,
  estado: "pendiente",
  origen: null,
});

export const crearPaseLibre = (equipo: string): Partido => ({
  ...crearPartido(equipo, null),
  ganador: equipo,
  estado: "pase_libre",
});

// Devuelve un mensaje de error, o null si el resultado es válido.
// En truco el ganador llega exactamente al puntaje de la partida
// (el anotador no deja pasarse) y el perdedor queda por debajo.
export const validarResultado = (
  tantosA: number,
  tantosB: number,
  puntosPartida: number
): string | null => {
  if (![tantosA, tantosB].every((t) => Number.isInteger(t) && t >= 0)) {
    return "Los tantos deben ser números enteros positivos";
  }
  const max = Math.max(tantosA, tantosB);
  const min = Math.min(tantosA, tantosB);
  if (max !== puntosPartida) {
    return `El ganador tiene que llegar a ${puntosPartida} tantos`;
  }
  if (min >= puntosPartida) {
    return "Solo un equipo puede llegar al puntaje de la partida";
  }
  return null;
};

export const conResultado = (
  partido: Partido,
  tantosA: number,
  tantosB: number,
  origen: Partido["origen"]
): Partido => ({
  ...partido,
  tantosA,
  tantosB,
  ganador: tantosA > tantosB ? partido.equipoA : partido.equipoB,
  estado: "jugado",
  origen,
});

export const sinResultado = (partido: Partido): Partido => ({
  ...partido,
  tantosA: null,
  tantosB: null,
  ganador: null,
  estado: "pendiente",
  origen: null,
});

// Mezcla Fisher-Yates. `random` es inyectable para tests.
export const mezclar = <T>(items: T[], random: () => number = Math.random) => {
  const copia = [...items];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
};

export const buscarPartido = (rondas: Ronda[], partidoId: string) =>
  rondas.flatMap((r) => r.partidos).find((p) => p.id === partidoId) ?? null;

export const reemplazarPartido = (
  rondas: Ronda[],
  partidoId: string,
  actualizar: (partido: Partido) => Partido
): Ronda[] =>
  rondas.map((r) => ({
    ...r,
    partidos: r.partidos.map((p) => (p.id === partidoId ? actualizar(p) : p)),
  }));
