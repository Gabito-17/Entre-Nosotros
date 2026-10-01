import { generarPrimeraRonda, sincronizarLlave } from "./llaveEliminacion.ts";
import { conResultado, crearPartido, reemplazarPartido } from "./partido.ts";
import { calcularTabla, podioEliminacion, podioLiga } from "./tabla.ts";
import { ids } from "./helpersTest.ts";
import { Equipo, Ronda } from "./tipos.ts";

const equipos = (nombres: string[]): Equipo[] =>
  nombres.map((nombre, i) => ({ id: `e${i + 1}`, nombre, participantes: [] }));

const partidoJugado = (a: string, b: string, tantosA: number, tantosB: number) =>
  conResultado(crearPartido(a, b), tantosA, tantosB, "manual");

describe("calcularTabla", () => {
  test("cuenta PJ, PG, PP, tantos y diferencia", () => {
    const rondas: Ronda[] = [
      { numero: 1, equipoLibre: null, partidos: [partidoJugado("e1", "e2", 15, 7)] },
    ];
    const [primero, segundo] = calcularTabla(equipos(["A", "B"]), rondas);
    expect(primero).toMatchObject({ equipoId: "e1", pj: 1, pg: 1, pp: 0, tantosFavor: 15, tantosContra: 7, diferencia: 8 });
    expect(segundo).toMatchObject({ equipoId: "e2", pj: 1, pg: 0, pp: 1, tantosFavor: 7, tantosContra: 15, diferencia: -8 });
  });

  test("ordena por ganados → diferencia → tantos a favor → nombre", () => {
    // W gana 2. X e Y ganan 1 con diferencia 0, pero Y tiene más tantos a favor.
    const eqs = equipos(["X", "Y", "Z", "W"]);
    const rondas: Ronda[] = [
      {
        numero: 1,
        equipoLibre: null,
        partidos: [
          partidoJugado("e1", "e3", 15, 0), // X gana a Z
          partidoJugado("e1", "e4", 0, 15), // W gana a X
          partidoJugado("e2", "e3", 15, 10), // Y gana a Z
          partidoJugado("e2", "e4", 10, 15), // W gana a Y
        ],
      },
    ];
    expect(calcularTabla(eqs, rondas).map((f) => f.nombre)).toEqual(["W", "Y", "X", "Z"]);
  });

  test("con todo empatado desempata por nombre", () => {
    expect(calcularTabla(equipos(["Zorros", "Águilas", "Lobos"]), []).map((f) => f.nombre)).toEqual([
      "Águilas",
      "Lobos",
      "Zorros",
    ]);
  });

  test("ignora partidos pendientes", () => {
    const rondas: Ronda[] = [{ numero: 1, equipoLibre: null, partidos: [crearPartido("e1", "e2")] }];
    expect(calcularTabla(equipos(["A", "B"]), rondas).every((f) => f.pj === 0)).toBe(true);
  });
});

test("podioLiga toma los 3 primeros de la tabla (con 2 equipos no hay 3°)", () => {
  const tabla = calcularTabla(equipos(["A", "B"]), [
    { numero: 1, equipoLibre: null, partidos: [partidoJugado("e1", "e2", 3, 15)] },
  ]);
  expect(podioLiga(tabla)).toEqual({ primero: "e2", segundo: "e1", tercero: null });
});

describe("podioEliminacion", () => {
  // Juega la llave en orden con los resultados dados (tantos del perdedor; si es negativo gana B)
  const jugarLlave = (n: number, resultados: [number, number][]) => {
    let rondas = [generarPrimeraRonda(ids(n))];
    for (const [tA, tB] of resultados) {
      const p = rondas.flatMap((r) => r.partidos).find((x) => x.estado === "pendiente" && x.equipoA && x.equipoB)!;
      rondas = sincronizarLlave(reemplazarPartido(rondas, p.id, (x) => conResultado(x, tA, tB, "manual")));
    }
    return rondas;
  };

  test("devuelve null si la final no se jugó", () => {
    expect(podioEliminacion(equipos(["A", "B", "C", "D"]), jugarLlave(4, [[15, 10]]))).toBeNull();
  });

  test("4 equipos: el 3° es el perdedor de semis con mejor diferencia en su semi", () => {
    // Semis: e1 15-10 e2 (e2: -5), e3 15-12 e4 (e4: -3). Final: e1 15-8 e3.
    const rondas = jugarLlave(4, [
      [15, 10],
      [15, 12],
      [15, 8],
    ]);
    expect(podioEliminacion(equipos(["A", "B", "C", "D"]), rondas)).toEqual({
      primero: "e1",
      segundo: "e3",
      tercero: "e4",
    });
  });

  test("con la misma diferencia en semis desempata por nombre", () => {
    const rondas = jugarLlave(4, [
      [15, 10],
      [15, 10],
      [15, 8],
    ]);
    expect(podioEliminacion(equipos(["A", "Zeta", "C", "Beta"]), rondas)?.tercero).toBe("e4");
  });

  test("3 equipos: el 3° es el perdedor de la primera ronda", () => {
    // e1 tiene pase libre; e2 15-4 e3; final e1 vs e2
    const rondas = jugarLlave(3, [
      [15, 4],
      [9, 15],
    ]);
    expect(podioEliminacion(equipos(["A", "B", "C"]), rondas)).toEqual({
      primero: "e2",
      segundo: "e1",
      tercero: "e3",
    });
  });

  test("2 equipos: no hay 3° puesto", () => {
    expect(podioEliminacion(equipos(["A", "B"]), jugarLlave(2, [[15, 2]]))).toEqual({
      primero: "e1",
      segundo: "e2",
      tercero: null,
    });
  });
});
