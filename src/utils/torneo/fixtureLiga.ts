import { crearPartido, mezclar } from "./partido.ts";
import { Partido, Ronda } from "./tipos.ts";

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
