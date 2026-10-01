import { eliminacionCompleta } from "./llaveEliminacion.ts";
import { Equipo, Podio, Ronda } from "./tipos.ts";

export type FilaTabla = {
  equipoId: string;
  nombre: string;
  pj: number;
  pg: number;
  pp: number;
  tantosFavor: number;
  tantosContra: number;
  diferencia: number;
};

const porNombre = (a: string, b: string) => a.localeCompare(b, "es");

// Tabla de posiciones: partidos ganados → diferencia de tantos → tantos a favor.
// Si aún así empatan, se ordena por nombre para que el orden sea estable.
export const calcularTabla = (equipos: Equipo[], rondas: Ronda[]): FilaTabla[] => {
  const filas = new Map<string, FilaTabla>(
    equipos.map((e) => [
      e.id,
      {
        equipoId: e.id,
        nombre: e.nombre,
        pj: 0,
        pg: 0,
        pp: 0,
        tantosFavor: 0,
        tantosContra: 0,
        diferencia: 0,
      },
    ])
  );

  const sumar = (id: string | null, favor: number, contra: number, gano: boolean) => {
    const fila = id ? filas.get(id) : undefined;
    if (!fila) return;
    fila.pj += 1;
    fila.pg += gano ? 1 : 0;
    fila.pp += gano ? 0 : 1;
    fila.tantosFavor += favor;
    fila.tantosContra += contra;
    fila.diferencia = fila.tantosFavor - fila.tantosContra;
  };

  for (const p of rondas.flatMap((r) => r.partidos)) {
    if (p.estado !== "jugado" || p.tantosA === null || p.tantosB === null) continue;
    sumar(p.equipoA, p.tantosA, p.tantosB, p.ganador === p.equipoA);
    sumar(p.equipoB, p.tantosB, p.tantosA, p.ganador === p.equipoB);
  }

  return [...filas.values()].sort(
    (a, b) =>
      b.pg - a.pg ||
      b.diferencia - a.diferencia ||
      b.tantosFavor - a.tantosFavor ||
      porNombre(a.nombre, b.nombre)
  );
};

export const podioLiga = (tabla: FilaTabla[]): Podio => ({
  primero: tabla[0]?.equipoId ?? null,
  segundo: tabla[1]?.equipoId ?? null,
  tercero: tabla[2]?.equipoId ?? null,
});

// 1° y 2° salen de la final. El 3° es el perdedor de semis con mejor
// diferencia de tantos en su semifinal (empate → tantos a favor en esa semi).
// "Semis" es la ronda anterior a la final: con 3 equipos es la 1ª ronda y
// hay un solo perdedor; con 2 equipos no hay semis ni 3° puesto.
export const podioEliminacion = (equipos: Equipo[], rondas: Ronda[]): Podio | null => {
  if (!eliminacionCompleta(rondas)) return null;

  const final = rondas[rondas.length - 1].partidos[0];
  const primero = final.ganador;
  const segundo = final.ganador === final.equipoA ? final.equipoB : final.equipoA;

  const nombre = (id: string) => equipos.find((e) => e.id === id)?.nombre ?? "";
  const semis = rondas.length >= 2 ? rondas[rondas.length - 2].partidos : [];
  const perdedores = semis
    .filter((p) => p.estado === "jugado")
    .map((p) => {
      const perdioA = p.ganador !== p.equipoA;
      const favor = (perdioA ? p.tantosA : p.tantosB) ?? 0;
      const contra = (perdioA ? p.tantosB : p.tantosA) ?? 0;
      return {
        equipoId: (perdioA ? p.equipoA : p.equipoB) as string,
        diferencia: favor - contra,
        favor,
      };
    })
    .sort(
      (a, b) =>
        b.diferencia - a.diferencia ||
        b.favor - a.favor ||
        porNombre(nombre(a.equipoId), nombre(b.equipoId))
    );

  return { primero, segundo, tercero: perdedores[0]?.equipoId ?? null };
};
