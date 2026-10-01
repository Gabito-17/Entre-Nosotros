import { claveCruce, crearPartido, mezclar } from "./partido.ts";
import { Cruce, Partido, Ronda } from "./tipos.ts";

// Fixture de liga a una sola vuelta por el método del círculo.
// Se fija el primer equipo y el resto rota una posición por ronda.
// Con cantidad impar se agrega un "fantasma" (null): quien le toca contra él
// queda libre, y como el fantasma cruza a todos exactamente una vez,
// cada equipo queda libre una sola vez.
export const generarFixtureLiga = (
  equipoIds: string[],
  opciones: { sortear?: boolean; random?: () => number } = {}
): Ronda[] => {
  const base = opciones.sortear
    ? mezclar(equipoIds, opciones.random)
    : [...equipoIds];
  const lista: (string | null)[] = base.length % 2 === 0 ? base : [...base, null];
  const m = lista.length;
  const rondas: Ronda[] = [];

  let orden = lista;
  for (let r = 0; r < m - 1; r++) {
    const partidos: Partido[] = [];
    let equipoLibre: string | null = null;

    for (let i = 0; i < m / 2; i++) {
      const a = orden[i];
      const b = orden[m - 1 - i];
      if (a === null || b === null) {
        equipoLibre = a ?? b;
      } else {
        partidos.push(crearPartido(a, b));
      }
    }

    rondas.push({ numero: r + 1, partidos, equipoLibre });
    // Rotación: el primero queda fijo, el último pasa al segundo lugar
    orden = [orden[0], orden[m - 1], ...orden.slice(1, m - 1)];
  }

  return rondas;
};

// Arma una ronda manual de liga. Si queda exactamente un equipo sin jugar,
// se registra como libre.
export const crearRondaManualLiga = (
  numero: number,
  cruces: [string, string][],
  equipoIds: string[]
): Ronda => {
  const enJuego = new Set(cruces.flat());
  const sinJugar = equipoIds.filter((id) => !enJuego.has(id));
  return {
    numero,
    partidos: cruces.map(([a, b]) => crearPartido(a, b)),
    equipoLibre: sinJugar.length === 1 ? sinJugar[0] : null,
  };
};

// Liga terminada: se jugaron todos los cruces posibles y no queda nada pendiente.
export const ligaCompleta = (rondas: Ronda[], cantidadEquipos: number) => {
  const partidos = rondas.flatMap((r) => r.partidos);
  if (partidos.some((p) => p.estado === "pendiente")) return false;
  const cruces = new Set(
    partidos.map((p) => [p.equipoA, p.equipoB].sort().join("|"))
  );
  return cruces.size === (cantidadEquipos * (cantidadEquipos - 1)) / 2;
};

export type EstadoCrucesLiga = {
  total: number; // cruces de la liga: n·(n−1)/2
  jugados: number;
  sinArmar: Cruce[]; // cruces que todavía no están en ninguna ronda
  // Mínimo de rondas para armar los que faltan. Es una cota: si en alguna
  // ronda quedan equipos sin jugar, hacen falta más.
  rondasMinimas: number;
};

// En liga manual la cantidad de rondas no es fija, pero sí la de cruces.
// Cada equipo juega como máximo una vez por ronda y en una ronda entran
// ⌊n/2⌋ partidos, así que faltan al menos max(rivales pendientes del equipo
// más atrasado, ⌈cruces sin armar / ⌊n/2⌋⌉) rondas.
export const estadoCrucesLiga = (equipoIds: string[], rondas: Ronda[]): EstadoCrucesLiga => {
  const partidos = rondas.flatMap((r) => r.partidos);
  const armados = new Set(partidos.map((p) => claveCruce(p.equipoA, p.equipoB)));

  const sinArmar: Cruce[] = [];
  const pendientesPorEquipo = new Map<string, number>();
  for (let i = 0; i < equipoIds.length; i++) {
    for (let j = i + 1; j < equipoIds.length; j++) {
      const [a, b] = [equipoIds[i], equipoIds[j]];
      if (armados.has(claveCruce(a, b))) continue;
      sinArmar.push([a, b]);
      for (const id of [a, b]) pendientesPorEquipo.set(id, (pendientesPorEquipo.get(id) ?? 0) + 1);
    }
  }

  const n = equipoIds.length;
  const porMesa = Math.floor(n / 2);
  const rondasMinimas =
    sinArmar.length === 0
      ? 0
      : Math.max(...pendientesPorEquipo.values(), Math.ceil(sinArmar.length / porMesa));

  return {
    total: (n * (n - 1)) / 2,
    jugados: partidos.filter((p) => p.estado === "jugado").length,
    sinArmar,
    rondasMinimas,
  };
};
