import { crearRondaManualLiga, estadoCrucesLiga, generarFixtureLiga, ligaCompleta } from "./fixtureLiga.ts";
import { ids, jugar, randomConSemilla, todosLosPartidos } from "./helpersTest.ts";

describe("generarFixtureLiga (método del círculo)", () => {
  test.each([2, 3, 4, 5, 6, 7, 8])("%i equipos: cada cruce una vez y nadie juega dos veces por ronda", (n) => {
    const equipos = ids(n);
    const rondas = generarFixtureLiga(equipos);

    expect(rondas).toHaveLength(n % 2 === 0 ? n - 1 : n);

    for (const ronda of rondas) {
      const enJuego = ronda.partidos.flatMap((p) => [p.equipoA, p.equipoB]);
      expect(new Set(enJuego).size).toBe(enJuego.length);
      expect(enJuego).not.toContain(ronda.equipoLibre ?? "sin-libre");
    }

    const cruces = todosLosPartidos(rondas).map((p) => [p.equipoA, p.equipoB].sort().join("|"));
    expect(cruces).toHaveLength((n * (n - 1)) / 2);
    expect(new Set(cruces).size).toBe(cruces.length);
  });

  test.each([3, 5, 7])("%i equipos: cada equipo queda libre exactamente una vez", (n) => {
    const libres = generarFixtureLiga(ids(n)).map((r) => r.equipoLibre);
    expect([...libres].sort()).toEqual(ids(n).sort());
  });

  test("con cantidad par no hay equipo libre", () => {
    expect(generarFixtureLiga(ids(6)).every((r) => r.equipoLibre === null)).toBe(true);
  });

  test("el sorteo cambia el orden pero el fixture sigue siendo válido", () => {
    const sinSorteo = generarFixtureLiga(ids(6));
    const conSorteo = generarFixtureLiga(ids(6), { sortear: true, random: randomConSemilla(42) });
    const primeros = (rs: typeof sinSorteo) => rs[0].partidos.map((p) => `${p.equipoA}-${p.equipoB}`);

    expect(primeros(conSorteo)).not.toEqual(primeros(sinSorteo));
    expect(new Set(todosLosPartidos(conSorteo).map((p) => [p.equipoA, p.equipoB].sort().join("|"))).size).toBe(15);
  });

  test("numera las rondas desde 1", () => {
    expect(generarFixtureLiga(ids(4)).map((r) => r.numero)).toEqual([1, 2, 3]);
  });
});

describe("crearRondaManualLiga", () => {
  test("registra como libre al único equipo que no juega", () => {
    const ronda = crearRondaManualLiga(2, [["e1", "e2"]], ids(3));
    expect(ronda.numero).toBe(2);
    expect(ronda.equipoLibre).toBe("e3");
  });

  test("si quedan varios sin jugar no marca equipo libre", () => {
    expect(crearRondaManualLiga(1, [["e1", "e2"]], ids(4)).equipoLibre).toBeNull();
  });
});

describe("ligaCompleta", () => {
  test("solo está completa cuando se jugaron todos los cruces", () => {
    const rondas = generarFixtureLiga(ids(4));
    expect(ligaCompleta(rondas, 4)).toBe(false);

    const jugadas = rondas.map((r) => ({ ...r, partidos: r.partidos.map((p) => jugar(p)) }));
    expect(ligaCompleta(jugadas, 4)).toBe(true);
    expect(ligaCompleta(jugadas.slice(0, 2), 4)).toBe(false);
  });
});

describe("estadoCrucesLiga", () => {
  test("sin rondas: faltan todos los cruces", () => {
    expect(estadoCrucesLiga(ids(4), [])).toMatchObject({ total: 6, jugados: 0, rondasMinimas: 3 });
    expect(estadoCrucesLiga(ids(4), []).sinArmar).toHaveLength(6);
    // Impar: entran 2 partidos por ronda, así que 10 cruces son 5 rondas
    expect(estadoCrucesLiga(ids(5), []).rondasMinimas).toBe(5);
  });

  test("una ronda incompleta deja atrasados a los que no jugaron", () => {
    const rondas = [crearRondaManualLiga(1, [["e1", "e2"]], ids(4))];
    const estado = estadoCrucesLiga(ids(4), rondas);

    expect(estado.sinArmar).toHaveLength(5);
    expect(estado.sinArmar).not.toContainEqual(["e1", "e2"]);
    // e3 y e4 todavía tienen 3 rivales cada uno
    expect(estado.rondasMinimas).toBe(3);
  });

  test("un cruce armado al revés cuenta igual", () => {
    const rondas = [crearRondaManualLiga(1, [["e2", "e1"]], ids(3))];
    expect(estadoCrucesLiga(ids(3), rondas).sinArmar).not.toContainEqual(["e1", "e2"]);
  });

  test("con el fixture completo no falta armar nada y cuenta los jugados", () => {
    const rondas = generarFixtureLiga(ids(4));
    const jugadas = [{ ...rondas[0], partidos: rondas[0].partidos.map((p) => jugar(p)) }, ...rondas.slice(1)];
    expect(estadoCrucesLiga(ids(4), jugadas)).toEqual({ total: 6, jugados: 2, sinArmar: [], rondasMinimas: 0 });
  });
});
