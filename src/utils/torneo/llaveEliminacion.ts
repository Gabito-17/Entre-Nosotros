import {
  conResultado,
  crearPartido,
  crearPaseLibre,
  mezclar,
  reemplazarPartido,
  sinResultado,
} from "./partido.ts";
import { Cruce, Partido, Ronda } from "./tipos.ts";

// La llave es posicional: el partido j de la ronda r+1 lo juegan los ganadores
// de los partidos 2j y 2j+1 de la ronda r. Los pases libres son "partidos"
// ya resueltos, así que entran en esa misma cuenta.

export const esPotenciaDe2 = (n: number) => n > 0 && (n & (n - 1)) === 0;

export const siguientePotenciaDe2 = (n: number) => {
  let p = 1;
  while (p < n) p *= 2;
  return p;
};

// Intercala pases libres y partidos para que, mientras alcance, cada equipo
// con pase libre cruce en la 2ª ronda contra un ganador y no contra otro pase.
const intercalar = (pases: Partido[], partidos: Partido[]): Partido[] => {
  const resultado: Partido[] = [];
  for (let i = 0; i < Math.max(pases.length, partidos.length); i++) {
    if (i < pases.length) resultado.push(pases[i]);
    if (i < partidos.length) resultado.push(partidos[i]);
  }
  return resultado;
};

// Primera ronda automática. Con n equipos y P la potencia de 2 siguiente:
// P - n pases libres y n - P/2 partidos, así la 2ª ronda queda con P/2 equipos.
export const generarPrimeraRonda = (
  equipoIds: string[],
  opciones: { sortear?: boolean; random?: () => number } = {}
): Ronda => {
  const base = opciones.sortear
    ? mezclar(equipoIds, opciones.random)
    : [...equipoIds];
  const cantidadPases = siguientePotenciaDe2(base.length) - base.length;

  const pases = base.slice(0, cantidadPases).map(crearPaseLibre);
  const resto = base.slice(cantidadPases);
  const partidos: Partido[] = [];
  for (let i = 0; i < resto.length; i += 2) {
    partidos.push(crearPartido(resto[i], resto[i + 1]));
  }

  return { numero: 1, partidos: intercalar(pases, partidos), equipoLibre: null };
};

// Primera ronda armada a mano (validar antes con validarPrimeraRondaEliminacion).
export const crearPrimeraRondaManual = (
  cruces: Cruce[],
  pasesLibres: string[]
): Ronda => ({
  numero: 1,
  partidos: intercalar(
    pasesLibres.map(crearPaseLibre),
    cruces.map(([a, b]) => crearPartido(a, b))
  ),
  equipoLibre: null,
});

const rondaResuelta = (ronda: Ronda) =>
  ronda.partidos.every((p) => p.estado !== "pendiente");

// Recalcula quién juega cada partido a partir de la ronda anterior.
// Si en un partido cambió algún equipo, se borra su resultado; eso deja su
// ganador en null y la invalidación sigue en cascada hacia las rondas siguientes.
// Cuando la última ronda queda resuelta y no es la final, se agrega la próxima.
export const sincronizarLlave = (rondas: Ronda[]): Ronda[] => {
  if (rondas.length === 0) return rondas;

  const resultado: Ronda[] = [rondas[0]];
  for (let r = 1; r < rondas.length; r++) {
    const anterior = resultado[r - 1].partidos;
    const partidos = rondas[r].partidos.map((p, j) => {
      const a = anterior[2 * j]?.ganador ?? null;
      const b = anterior[2 * j + 1]?.ganador ?? null;
      if (p.equipoA === a && p.equipoB === b) return p;
      return sinResultado({ ...p, equipoA: a, equipoB: b });
    });
    resultado.push({ ...rondas[r], partidos });
  }

  const ultima = resultado[resultado.length - 1];
  if (ultima.partidos.length > 1 && rondaResuelta(ultima)) {
    const partidos: Partido[] = [];
    for (let j = 0; j < ultima.partidos.length; j += 2) {
      partidos.push(
        crearPartido(ultima.partidos[j].ganador, ultima.partidos[j + 1].ganador)
      );
    }
    resultado.push({ numero: ultima.numero + 1, partidos, equipoLibre: null });
  }

  return resultado;
};

// Partidos ya jugados que perderían su resultado si se carga este marcador.
// Sirve para pedir confirmación antes de corregir.
export const partidosAfectadosPorCorreccion = (
  rondas: Ronda[],
  partidoId: string,
  tantosA: number,
  tantosB: number
): Partido[] => {
  const simuladas = sincronizarLlave(
    reemplazarPartido(rondas, partidoId, (p) =>
      conResultado(p, tantosA, tantosB, p.origen)
    )
  );
  const estadoNuevo = new Map(
    simuladas.flatMap((r) => r.partidos).map((p) => [p.id, p.estado])
  );
  return rondas
    .flatMap((r) => r.partidos)
    .filter(
      (p) =>
        p.id !== partidoId &&
        p.estado === "jugado" &&
        estadoNuevo.get(p.id) !== "jugado"
    );
};

export const eliminacionCompleta = (rondas: Ronda[]) => {
  const ultima = rondas[rondas.length - 1];
  return (
    !!ultima &&
    ultima.partidos.length === 1 &&
    ultima.partidos[0].estado === "jugado"
  );
};

// Rondas que tiene la llave completa: la 1ª ronda (con pases libres) ocupa
// una potencia de 2 de lugares y cada ronda los reduce a la mitad.
export const totalRondasEliminacion = (rondas: Ronda[]) =>
  rondas.length === 0 ? 0 : Math.log2(rondas[0].partidos.length) + 1;

const NOMBRES_POR_PARTIDOS: Record<number, string> = {
  1: "Final",
  2: "Semifinales",
  4: "Cuartos de final",
  8: "Octavos de final",
};

// Nombre de la ronda según cuántos partidos (o pases libres) tiene.
export const nombreRondaEliminacion = (numero: number, rondas: Ronda[]) => {
  const partidos = rondas.length === 0 ? 0 : rondas[0].partidos.length / 2 ** (numero - 1);
  return NOMBRES_POR_PARTIDOS[partidos] ?? `Ronda ${numero}`;
};
