import { generarFixtureLiga } from "./fixtureLiga.ts";
import { ids } from "./helpersTest.ts";
import { validarPrimeraRondaEliminacion, validarRondaManualLiga } from "./validarCruces.ts";

describe("validarRondaManualLiga", () => {
  test("acepta una ronda válida", () => {
    expect(validarRondaManualLiga([["e1", "e2"], ["e3", "e4"]], ids(4), [])).toBeNull();
  });

  test.each([
    ["ronda vacía", [], /al menos un partido/],
    ["equipo que no existe", [["e1", "e9"]], /no existe/],
    ["equipo contra sí mismo", [["e1", "e1"]], /sí mismo/],
    ["equipo dos veces en la ronda", [["e1", "e2"], ["e1", "e3"]], /dos veces/],
  ])("rechaza %s", (_, cruces, error) => {
    expect(validarRondaManualLiga(cruces as [string, string][], ids(4), [])).toMatch(error as RegExp);
  });

  test("rechaza un cruce que ya está en el fixture, en cualquier orden", () => {
    const previas = generarFixtureLiga(ids(4)).slice(0, 1); // e1-e4, e2-e3
    expect(validarRondaManualLiga([["e4", "e1"]], ids(4), previas)).toMatch(/ya está/);
  });
});

describe("validarPrimeraRondaEliminacion", () => {
  test("6 equipos con 2 pases libres y 2 partidos es válido", () => {
    expect(validarPrimeraRondaEliminacion([["e1", "e2"], ["e3", "e4"]], ["e5", "e6"], ids(6))).toBeNull();
  });

  test("avisa cuántos pases libres hacen falta", () => {
    expect(validarPrimeraRondaEliminacion([["e1", "e2"], ["e3", "e4"], ["e5", "e6"]], [], ids(6))).toMatch(
      /tiene que haber 2 pases libres/
    );
    expect(validarPrimeraRondaEliminacion([["e1", "e2"]], ["e3", "e4"], ids(4))).toMatch(
      /no puede haber pases libres/
    );
  });

  test("todos los equipos tienen que estar y una sola vez", () => {
    expect(validarPrimeraRondaEliminacion([["e1", "e2"]], ["e3"], ids(4))).toMatch(/Todos los equipos/);
    expect(validarPrimeraRondaEliminacion([["e1", "e2"]], ["e2"], ids(3))).toMatch(/dos veces/);
    expect(validarPrimeraRondaEliminacion([["e1", "e2"]], ["e3", "e3"], ids(3))).toMatch(/dos veces/);
  });

  test("no alcanza con solo pases libres", () => {
    expect(validarPrimeraRondaEliminacion([], ids(4), ids(4))).toMatch(/al menos un partido/);
  });
});
