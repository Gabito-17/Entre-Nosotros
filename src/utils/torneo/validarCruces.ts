import { esPotenciaDe2, siguientePotenciaDe2 } from "./llaveEliminacion.ts";
import { claveCruce } from "./partido.ts";
import { Cruce, Ronda } from "./tipos.ts";

// Todas las validaciones devuelven un mensaje de error, o null si está todo bien.

const validarBasico = (cruces: Cruce[], equipoIds: string[]): string | null => {
  if (cruces.length === 0) return "Armá al menos un partido";

  const existentes = new Set(equipoIds);
  const vistos = new Set<string>();
  for (const [a, b] of cruces) {
    if (!existentes.has(a) || !existentes.has(b)) return "Hay un equipo que no existe";
    if (a === b) return "Un equipo no puede jugar contra sí mismo";
    for (const id of [a, b]) {
      if (vistos.has(id)) return "Un equipo no puede jugar dos veces en la misma ronda";
      vistos.add(id);
    }
  }
  return null;
};

// Ronda manual de liga: además, ningún cruce puede repetirse (liga a una vuelta).
export const validarRondaManualLiga = (
  cruces: Cruce[],
  equipoIds: string[],
  rondasPrevias: Ronda[]
): string | null => {
  const error = validarBasico(cruces, equipoIds);
  if (error) return error;

  const jugados = new Set(
    rondasPrevias.flatMap((r) => r.partidos).map((p) => claveCruce(p.equipoA, p.equipoB))
  );
  if (cruces.some(([a, b]) => jugados.has(claveCruce(a, b)))) {
    return "Ese cruce ya está en el fixture";
  }
  return null;
};

// Primera ronda manual de eliminación: cada equipo aparece exactamente una vez
// (en un partido o con pase libre) y la cantidad de lugares que avanzan a la
// 2ª ronda tiene que ser potencia de 2 para que la llave cierre.
export const validarPrimeraRondaEliminacion = (
  cruces: Cruce[],
  pasesLibres: string[],
  equipoIds: string[]
): string | null => {
  const error = validarBasico(cruces, equipoIds);
  if (error) return error;

  const enCruces = new Set(cruces.flat());
  const existentes = new Set(equipoIds);
  const pases = new Set<string>();
  for (const id of pasesLibres) {
    if (!existentes.has(id)) return "Hay un equipo que no existe";
    if (enCruces.has(id) || pases.has(id)) {
      return "Un equipo no puede jugar dos veces en la misma ronda";
    }
    pases.add(id);
  }

  if (enCruces.size + pases.size !== equipoIds.length) {
    return "Todos los equipos tienen que jugar o tener pase libre";
  }
  if (!esPotenciaDe2(cruces.length + pasesLibres.length)) {
    const n = equipoIds.length;
    const pasesNecesarios = siguientePotenciaDe2(n) - n;
    return pasesNecesarios === 0
      ? `Con ${n} equipos no puede haber pases libres`
      : `Con ${n} equipos tiene que haber ${pasesNecesarios} pases libres`;
  }
  return null;
};
