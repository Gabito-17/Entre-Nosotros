import { mezclar, validarResultado } from "./partido.ts";
import { randomConSemilla } from "./helpersTest.ts";

describe("validarResultado", () => {
  test("acepta un ganador que llega justo al puntaje y un perdedor por debajo", () => {
    expect(validarResultado(15, 0, 15)).toBeNull();
    expect(validarResultado(29, 30, 30)).toBeNull();
  });

  test("rechaza resultados imposibles", () => {
    expect(validarResultado(15, 15, 15)).toMatch(/Solo un equipo/);
    expect(validarResultado(14, 10, 15)).toMatch(/llegar a 15/);
    expect(validarResultado(16, 10, 15)).toMatch(/llegar a 15/);
    expect(validarResultado(15, -1, 15)).toMatch(/enteros/);
    expect(validarResultado(15, 2.5, 15)).toMatch(/enteros/);
  });
});

test("mezclar devuelve una permutación sin modificar el original", () => {
  const original = ["a", "b", "c", "d", "e"];
  const mezclado = mezclar(original, randomConSemilla(7));
  expect([...mezclado].sort()).toEqual(original);
  expect(original).toEqual(["a", "b", "c", "d", "e"]);
});
