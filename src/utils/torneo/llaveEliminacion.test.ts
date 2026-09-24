import { ids, jugar, randomConSemilla, todosLosPartidos } from "./helpersTest.ts";
import {
  crearPrimeraRondaManual,
  eliminacionCompleta,
  generarPrimeraRonda,
  nombreRondaEliminacion,
  partidosAfectadosPorCorreccion,
  sincronizarLlave,
  siguientePotenciaDe2,
  totalRondasEliminacion,
} from "./llaveEliminacion.ts";
import { reemplazarPartido } from "./partido.ts";
import { Ronda } from "./tipos.ts";

// Juega el primer partido pendiente con los dos equipos definidos
const jugarSiguiente = (rondas: Ronda[], ganaB = false): Ronda[] => {
  const p = todosLosPartidos(rondas).find(
    (x) => x.estado === "pendiente" && x.equipoA && x.equipoB
  );
  if (!p) throw new Error("No hay partido para jugar");
  return sincronizarLlave(reemplazarPartido(rondas, p.id, (x) => jugar(x, ganaB)));
};

const jugarTodo = (rondas: Ronda[]) => {
  let r = rondas;
  while (!eliminacionCompleta(r)) r = jugarSiguiente(r);
  return r;
};

describe("generarPrimeraRonda", () => {
  test.each([
    [2, 0, 1],
    [3, 1, 1],
    [5, 3, 1],
    [6, 2, 2],
    [7, 1, 3],
    [8, 0, 4],
  ])("%i equipos → %i pases libres y %i partidos", (n, pases, partidos) => {
    const ronda = generarPrimeraRonda(ids(n));
    expect(ronda.partidos.filter((p) => p.estado === "pase_libre")).toHaveLength(pases);
    expect(ronda.partidos.filter((p) => p.estado === "pendiente")).toHaveLength(partidos);
    // Los que avanzan a la 2ª ronda son potencia de 2
    expect(ronda.partidos).toHaveLength(siguientePotenciaDe2(n) / 2);
    // Cada equipo aparece una sola vez
    const enJuego = ronda.partidos.flatMap((p) => [p.equipoA, p.equipoB]).filter(Boolean);
    expect([...enJuego].sort()).toEqual(ids(n).sort());
  });

  test("6 equipos: los pases libres se intercalan para no cruzarse entre sí", () => {
    const estados = generarPrimeraRonda(ids(6)).partidos.map((p) => p.estado);
    expect(estados).toEqual(["pase_libre", "pendiente", "pase_libre", "pendiente"]);
  });

  test("el sorteo mezcla quién recibe pase libre", () => {
    const sinSorteo = generarPrimeraRonda(ids(6));
    const conSorteo = generarPrimeraRonda(ids(6), { sortear: true, random: randomConSemilla(3) });
    const pases = (r: Ronda) => r.partidos.filter((p) => p.estado === "pase_libre").map((p) => p.equipoA);
    expect(pases(conSorteo)).not.toEqual(pases(sinSorteo));
  });
});

describe("sincronizarLlave", () => {
  test("no agrega ronda hasta que la actual está resuelta", () => {
    const r1 = generarPrimeraRonda(ids(6));
    expect(sincronizarLlave([r1])).toHaveLength(1);
    const unaJugada = jugarSiguiente([r1]);
    expect(unaJugada).toHaveLength(1);
    const ambas = jugarSiguiente(unaJugada);
    expect(ambas).toHaveLength(2);
    expect(ambas[1].partidos).toHaveLength(2);
  });

  test("6 equipos: los ganadores cruzan contra los que tuvieron pase libre", () => {
    const r = jugarSiguiente(jugarSiguiente([generarPrimeraRonda(ids(6))]));
    // orden sin sortear: pases e1, e2; partidos e3-e4, e5-e6 (gana A)
    expect(r[1].partidos.map((p) => [p.equipoA, p.equipoB])).toEqual([
      ["e1", "e3"],
      ["e2", "e5"],
    ]);
  });

  test.each([2, 3, 5, 6, 8])("%i equipos: se juega hasta la final con n-1 partidos", (n) => {
    const rondas = jugarTodo([generarPrimeraRonda(ids(n))]);
    expect(rondas).toHaveLength(Math.log2(siguientePotenciaDe2(n)));
    expect(todosLosPartidos(rondas).filter((p) => p.estado === "jugado")).toHaveLength(n - 1);
    expect(eliminacionCompleta(rondas)).toBe(true);
  });
});

describe("corrección con invalidación en cascada", () => {
  const llaveDe4Jugada = () => jugarTodo([generarPrimeraRonda(ids(4))]);

  test("si cambia el ganador de una semi, la final se invalida y se rearma", () => {
    const rondas = llaveDe4Jugada();
    const semi1 = rondas[0].partidos[0]; // e1 15 - 10 e2
    const final = rondas[1].partidos[0];

    const afectados = partidosAfectadosPorCorreccion(rondas, semi1.id, 12, 15);
    expect(afectados.map((p) => p.id)).toEqual([final.id]);

    const corregidas = sincronizarLlave(reemplazarPartido(rondas, semi1.id, (p) => jugar(p, true, 12)));
    const nuevaFinal = corregidas[1].partidos[0];
    expect(nuevaFinal.id).toBe(final.id);
    expect(nuevaFinal.equipoA).toBe("e2");
    expect(nuevaFinal.estado).toBe("pendiente");
    expect(corregidas[0].partidos[1]).toEqual(rondas[0].partidos[1]); // la otra semi no se toca
    expect(eliminacionCompleta(corregidas)).toBe(false);
  });

  test("si el ganador no cambia, no se invalida nada", () => {
    const rondas = llaveDe4Jugada();
    expect(partidosAfectadosPorCorreccion(rondas, rondas[0].partidos[0].id, 15, 3)).toEqual([]);
  });

  test("la invalidación sigue varias rondas hacia adelante", () => {
    const rondas = jugarTodo([generarPrimeraRonda(ids(8))]);
    const cuartos1 = rondas[0].partidos[0];
    const afectados = partidosAfectadosPorCorreccion(rondas, cuartos1.id, 0, 15);
    expect(afectados.map((p) => p.id)).toEqual([rondas[1].partidos[0].id, rondas[2].partidos[0].id]);
  });
});

test("crearPrimeraRondaManual respeta los cruces y los pases elegidos", () => {
  const ronda = crearPrimeraRondaManual(
    [
      ["e1", "e6"],
      ["e2", "e5"],
    ],
    ["e3", "e4"]
  );
  expect(ronda.partidos.map((p) => [p.equipoA, p.equipoB, p.estado])).toEqual([
    ["e3", null, "pase_libre"],
    ["e1", "e6", "pendiente"],
    ["e4", null, "pase_libre"],
    ["e2", "e5", "pendiente"],
  ]);
});

describe("nombres de las rondas", () => {
  test.each([
    [2, ["Final"]],
    [3, ["Semifinales", "Final"]],
    [6, ["Cuartos de final", "Semifinales", "Final"]],
    [16, ["Octavos de final", "Cuartos de final", "Semifinales", "Final"]],
    [17, ["Ronda 1", "Octavos de final", "Cuartos de final", "Semifinales", "Final"]],
  ])("%i equipos", (n, nombres) => {
    const rondas = [generarPrimeraRonda(ids(n))];
    expect(totalRondasEliminacion(rondas)).toBe(nombres.length);
    expect(nombres.map((_, i) => nombreRondaEliminacion(i + 1, rondas))).toEqual(nombres);
  });
});
