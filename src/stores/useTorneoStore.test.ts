import { useTorneoStore } from "./useTorneoStore.ts";
import { useUiNotificationStore } from "./useUiNotificationStore.ts";

const store = () => useTorneoStore.getState();
const torneo = () => store().torneoActual!;
const ultimoAviso = () => useUiNotificationStore.getState().notifications.at(-1)?.message;

// Juega todos los partidos pendientes que ya tienen rival (gana A 15 a 10)
const jugarPendientes = () => {
  let pendiente;
  while (
    (pendiente = torneo()
      .rondas.flatMap((r) => r.partidos)
      .find((p) => p.estado === "pendiente" && p.equipoA && p.equipoB))
  ) {
    expect(store().registrarResultado(pendiente.id, 15, 10, "anotador")).toBe(true);
  }
};

const crearConEquipos = (formato: "liga" | "eliminacion", modoCruces: "automatico" | "manual", n: number) => {
  store().crearTorneo({ nombre: "Copa Asado", formato, modoCruces, puntosPartida: 15, jugadoresPorEquipo: 2 });
  for (let i = 1; i <= n; i++) {
    store().agregarEquipo({ nombre: `Equipo ${i}`, participantes: [`Jugador ${i}a`, `Jugador ${i}b`] });
  }
};

beforeEach(() => {
  jest.useFakeTimers();
  useTorneoStore.setState({ torneoActual: null, historial: [] });
  useUiNotificationStore.setState({ notifications: [] });
  localStorage.clear();
});

afterEach(() => jest.useRealTimers());

describe("configuración y ABM de equipos", () => {
  test("crea el torneo en estado configurando", () => {
    expect(store().crearTorneo({ nombre: "  Copa  ", formato: "liga", modoCruces: "automatico", puntosPartida: 18, jugadoresPorEquipo: 3 })).toBe(true);
    expect(torneo()).toMatchObject({ nombre: "Copa", estado: "configurando", puntosPartida: 18, jugadoresPorEquipo: 3, equipos: [] });
  });

  test("no deja crear otro torneo si ya hay uno", () => {
    crearConEquipos("liga", "automatico", 0);
    expect(store().crearTorneo({ nombre: "Otro", formato: "liga", modoCruces: "automatico", puntosPartida: 15, jugadoresPorEquipo: 2 })).toBe(false);
  });

  test("valida nombres y no permite equipos repetidos", () => {
    crearConEquipos("liga", "automatico", 1);
    expect(store().agregarEquipo({ nombre: " EQUIPO   1 ", participantes: ["Ana", "Beto"] })).toBe(false);
    expect(ultimoAviso()).toMatch(/Ya existe/);
    expect(store().agregarEquipo({ nombre: "   ", participantes: ["Ana", "Beto"] })).toBe(false);
    expect(torneo().equipos).toHaveLength(1);
  });

  test("descarta participantes vacíos", () => {
    crearConEquipos("liga", "automatico", 0);
    store().agregarEquipo({ nombre: "Los Pibes", participantes: ["Ana", " ", "Beto", ""] });
    expect(torneo().equipos[0].participantes).toEqual(["Ana", "Beto"]);
  });

  test("se necesitan al menos 2 equipos para iniciar", () => {
    crearConEquipos("liga", "automatico", 1);
    expect(store().iniciarTorneo()).toBe(false);
    expect(ultimoAviso()).toMatch(/al menos 2 equipos/);
  });

  test("iniciado el torneo, no se agregan ni quitan equipos pero sí se editan", () => {
    crearConEquipos("liga", "automatico", 3);
    store().iniciarTorneo();
    const [primero] = torneo().equipos;
    const { participantes } = primero;

    expect(store().agregarEquipo({ nombre: "Tarde", participantes: ["Zoe", "Yago"] })).toBe(false);
    expect(store().eliminarEquipo(primero.id)).toBe(false);
    expect(store().editarEquipo(primero.id, { nombre: "Renombrado", participantes })).toBe(true);
    expect(torneo().equipos[0].nombre).toBe("Renombrado");
    expect(store().actualizarConfig({ puntosPartida: 30 })).toBe(false);
  });
});

describe("jugadores por equipo", () => {
  const crear = (jugadoresPorEquipo: 1 | 2 | 3) =>
    store().crearTorneo({ nombre: "Copa", formato: "liga", modoCruces: "automatico", puntosPartida: 15, jugadoresPorEquipo });

  test("exige exactamente la cantidad configurada", () => {
    crear(2);
    expect(store().agregarEquipo({ nombre: "Solos", participantes: ["Ana"] })).toBe(false);
    expect(ultimoAviso()).toMatch(/2 jugadores/);
    expect(store().agregarEquipo({ nombre: "Muchos", participantes: ["Ana", "Beto", "Caro"] })).toBe(false);
    expect(store().agregarEquipo({ nombre: "Justos", participantes: ["Ana", "Beto"] })).toBe(true);
  });

  test("con 1 jugador el nombre del equipo es opcional y por defecto es el del jugador", () => {
    crear(1);
    expect(store().agregarEquipo({ nombre: "  ", participantes: ["  Ana  "] })).toBe(true);
    expect(store().agregarEquipo({ nombre: "El Tano", participantes: ["Beto"] })).toBe(true);
    expect(torneo().equipos.map((e) => e.nombre)).toEqual(["Ana", "El Tano"]);
    // El nombre por defecto también cuenta para no repetir equipos
    expect(store().agregarEquipo({ nombre: "", participantes: ["El Tano"] })).toBe(false);
    expect(ultimoAviso()).toMatch(/Ya existe/);
  });

  test("con más de 1 jugador el nombre del equipo es obligatorio", () => {
    crear(2);
    expect(store().agregarEquipo({ nombre: "", participantes: ["Ana", "Beto"] })).toBe(false);
  });

  test("un participante no puede estar en dos equipos (sin distinguir mayúsculas ni espacios)", () => {
    crear(2);
    store().agregarEquipo({ nombre: "A", participantes: ["Juan Pablo", "Beto"] });
    expect(store().agregarEquipo({ nombre: "B", participantes: ["  juan   PABLO ", "Caro"] })).toBe(false);
    expect(ultimoAviso()).toMatch(/ya juega en A/);
    expect(store().agregarEquipo({ nombre: "B", participantes: ["Caro", "caro"] })).toBe(false);
    expect(torneo().equipos).toHaveLength(1);
  });

  test("al editar, el equipo puede conservar sus propios participantes", () => {
    crear(2);
    store().agregarEquipo({ nombre: "A", participantes: ["Ana", "Beto"] });
    store().agregarEquipo({ nombre: "B", participantes: ["Caro", "Dani"] });
    const [a] = torneo().equipos;
    expect(store().editarEquipo(a.id, { nombre: "A2", participantes: ["Beto", "ana"] })).toBe(true);
    expect(store().editarEquipo(a.id, { nombre: "A2", participantes: ["Beto", "Dani"] })).toBe(false);
  });

  test("si cambia la cantidad, no se puede iniciar hasta corregir los equipos", () => {
    crear(2);
    store().agregarEquipo({ nombre: "A", participantes: ["Ana", "Beto"] });
    store().agregarEquipo({ nombre: "B", participantes: ["Caro", "Dani"] });
    expect(store().actualizarConfig({ jugadoresPorEquipo: 3 })).toBe(true);
    expect(torneo().equipos).toHaveLength(2);

    expect(store().iniciarTorneo()).toBe(false);
    expect(ultimoAviso()).toMatch(/Corregí los jugadores de: A, B/);

    const [a, b] = torneo().equipos;
    store().editarEquipo(a.id, { nombre: "A", participantes: ["Ana", "Beto", "Eli"] });
    expect(store().iniciarTorneo()).toBe(false);
    expect(ultimoAviso()).toMatch(/de: B$/);

    store().editarEquipo(b.id, { nombre: "B", participantes: ["Caro", "Dani", "Fede"] });
    expect(store().iniciarTorneo()).toBe(true);
  });

  test("migra torneos guardados sin jugadoresPorEquipo", async () => {
    localStorage.setItem(
      "torneo-storage",
      JSON.stringify({
        version: 0,
        state: {
          torneoActual: { id: "t", nombre: "Viejo", formato: "liga", modoCruces: "automatico", puntosPartida: 15, estado: "configurando", fecha: "", equipos: [], rondas: [], podio: null },
          historial: [],
        },
      })
    );
    await useTorneoStore.persist.rehydrate();
    expect(torneo().jugadoresPorEquipo).toBe(2);
  });
});

describe("liga", () => {
  test("automática: genera el fixture, carga resultados y termina con podio en el historial", () => {
    crearConEquipos("liga", "automatico", 3);
    expect(store().iniciarTorneo()).toBe(true);
    expect(torneo().rondas).toHaveLength(3);
    expect(store().finalizarTorneo()).toBe(false);

    jugarPendientes();
    expect(store().estaCompleto()).toBe(true);
    expect(store().finalizarTorneo()).toBe(true);

    expect(store().torneoActual).toBeNull();
    const [terminado] = store().historial;
    expect(terminado.estado).toBe("finalizado");
    expect(terminado.podio?.primero).toBeTruthy();
    expect(terminado.podio?.tercero).toBeTruthy();
  });

  test("rechaza resultados inválidos y partidos ya jugados", () => {
    crearConEquipos("liga", "automatico", 2);
    store().iniciarTorneo();
    const partido = torneo().rondas[0].partidos[0];

    expect(store().registrarResultado(partido.id, 15, 15, "manual")).toBe(false);
    expect(store().registrarResultado(partido.id, 10, 5, "manual")).toBe(false);
    expect(store().registrarResultado(partido.id, 15, 5, "manual")).toBe(true);
    expect(store().registrarResultado(partido.id, 15, 5, "manual")).toBe(false);
    expect(ultimoAviso()).toMatch(/no está pendiente/);
  });

  test("corregir cambia el resultado y marca el origen manual", () => {
    crearConEquipos("liga", "automatico", 2);
    store().iniciarTorneo();
    const { id, equipoB } = torneo().rondas[0].partidos[0];
    store().registrarResultado(id, 15, 5, "anotador");

    expect(store().corregirResultado(id, 8, 15)).toBe(true);
    expect(torneo().rondas[0].partidos[0]).toMatchObject({ tantosA: 8, tantosB: 15, ganador: equipoB, origen: "manual" });
  });

  test("manual: se arma ronda por ronda sin repetir cruces", () => {
    crearConEquipos("liga", "manual", 3);
    store().iniciarTorneo();
    const [a, b, c] = torneo().equipos.map((e) => e.id);
    expect(torneo().rondas).toHaveLength(0);

    expect(store().agregarRondaManual([[a, b]])).toBe(true);
    expect(torneo().rondas[0].equipoLibre).toBe(c);
    jugarPendientes();
    expect(store().agregarRondaManual([[b, a]])).toBe(false);
    expect(store().agregarRondaManual([[a, c]])).toBe(true);
    jugarPendientes();
    expect(store().agregarRondaManual([[b, c]])).toBe(true);

    jugarPendientes();
    expect(store().finalizarTorneo()).toBe(true);
  });

  test("manual: la próxima ronda se arma cuando termina la actual", () => {
    crearConEquipos("liga", "manual", 4);
    const [a, b, c, d] = torneo().equipos.map((e) => e.id);
    store().iniciarTorneo({ cruces: [[a, b], [c, d]], pasesLibres: [] });
    store().registrarResultado(torneo().rondas[0].partidos[0].id, 15, 3, "manual");

    expect(store().agregarRondaManual([[a, c]])).toBe(false);
    expect(ultimoAviso()).toMatch(/Terminá la ronda 1/);
    jugarPendientes();
    expect(store().agregarRondaManual([[a, c]])).toBe(true);
  });

  test("manual: se deshace la última ronda solo si no tiene resultados", () => {
    crearConEquipos("liga", "manual", 4);
    const [a, b, c, d] = torneo().equipos.map((e) => e.id);
    store().iniciarTorneo({ cruces: [[a, b], [c, d]], pasesLibres: [] });
    jugarPendientes();
    store().agregarRondaManual([[a, c], [b, d]]);

    expect(store().quitarUltimaRonda()).toBe(true);
    expect(torneo().rondas).toHaveLength(1);

    // La ronda 1 ya tiene resultados: no se puede quitar
    expect(store().quitarUltimaRonda()).toBe(false);
    expect(ultimoAviso()).toMatch(/ya tiene resultados/);
    expect(torneo().rondas).toHaveLength(1);
  });

  test("automática: no se quitan rondas", () => {
    crearConEquipos("liga", "automatico", 3);
    store().iniciarTorneo();
    expect(store().quitarUltimaRonda()).toBe(false);
    expect(torneo().rondas).toHaveLength(3);
  });

  test("automática: se cargan resultados de cualquier ronda", () => {
    crearConEquipos("liga", "automatico", 4);
    store().iniciarTorneo();
    const ultimo = torneo().rondas[2].partidos[0];
    expect(store().registrarResultado(ultimo.id, 15, 7, "manual")).toBe(true);
  });

  test("manual: puede iniciar con la 1ª ronda armada", () => {
    crearConEquipos("liga", "manual", 3);
    const [a, b, c] = torneo().equipos.map((e) => e.id);

    expect(store().iniciarTorneo({ cruces: [[a, a]], pasesLibres: [] })).toBe(false);
    expect(torneo().estado).toBe("configurando");
    expect(store().iniciarTorneo({ cruces: [[a, b]], pasesLibres: [] })).toBe(true);
    expect(torneo().rondas).toHaveLength(1);
    expect(torneo().rondas[0].equipoLibre).toBe(c);
  });
});

describe("eliminación", () => {
  test("automática con 6 equipos: 2 pases libres y se juega hasta la final", () => {
    crearConEquipos("eliminacion", "automatico", 6);
    store().iniciarTorneo();
    expect(torneo().rondas[0].partidos.filter((p) => p.estado === "pase_libre")).toHaveLength(2);

    jugarPendientes();
    expect(torneo().rondas).toHaveLength(3);
    expect(store().finalizarTorneo()).toBe(true);
    expect(store().historial[0].podio).toEqual(
      expect.objectContaining({ primero: expect.any(String), segundo: expect.any(String), tercero: expect.any(String) })
    );
  });

  test("manual: exige cruces válidos para la primera ronda", () => {
    crearConEquipos("eliminacion", "manual", 3);
    const [a, b, c] = torneo().equipos.map((e) => e.id);

    expect(store().iniciarTorneo()).toBe(false);
    expect(store().iniciarTorneo({ cruces: [[a, b]], pasesLibres: [] })).toBe(false);
    expect(store().iniciarTorneo({ cruces: [[a, b]], pasesLibres: [c] })).toBe(true);
    expect(torneo().rondas[0].partidos.map((p) => p.estado)).toEqual(["pase_libre", "pendiente"]);
  });

  test("corregir una semi invalida la final ya jugada", () => {
    crearConEquipos("eliminacion", "automatico", 4);
    store().iniciarTorneo();
    jugarPendientes();
    const semi = torneo().rondas[0].partidos[0];

    expect(store().corregirResultado(semi.id, 3, 15)).toBe(true);
    expect(torneo().rondas[1].partidos[0]).toMatchObject({ equipoA: semi.equipoB, estado: "pendiente" });
    expect(store().estaCompleto()).toBe(false);
  });
});

test("persiste el torneo en localStorage", () => {
  crearConEquipos("liga", "automatico", 2);
  expect(JSON.parse(localStorage.getItem("torneo-storage")!).state.torneoActual.nombre).toBe("Copa Asado");
});

// Simula cerrar y reabrir la app: memoria limpia, storage intacto
const recargar = async () => {
  const snapshot = localStorage.getItem("torneo-storage") as string;
  useTorneoStore.setState({ torneoActual: null, historial: [] });
  localStorage.setItem("torneo-storage", snapshot);
  await useTorneoStore.persist.rehydrate();
};

describe("retomar al recargar", () => {
  test("configurando: conserva config y equipos", async () => {
    crearConEquipos("liga", "manual", 3);
    await recargar();
    expect(torneo()).toMatchObject({ estado: "configurando", nombre: "Copa Asado" });
    expect(torneo().equipos).toHaveLength(3);
    expect(store().iniciarTorneo()).toBe(true);
  });

  test("liga a mitad: conserva rondas y resultados, y se puede seguir hasta finalizar", async () => {
    crearConEquipos("liga", "automatico", 4);
    store().iniciarTorneo();
    const primero = torneo().rondas[0].partidos[0];
    store().registrarResultado(primero.id, 15, 7, "manual");
    await recargar();

    const jugados = torneo().rondas.flatMap((r) => r.partidos).filter((p) => p.estado === "jugado");
    expect(jugados).toHaveLength(1);
    expect(jugados[0]).toMatchObject({ tantosA: 15, tantosB: 7 });
    expect(store().estaCompleto()).toBe(false);
    jugarPendientes();
    expect(store().finalizarTorneo()).toBe(true);
  });

  test("eliminación después de corregir y a mitad de llave", async () => {
    crearConEquipos("eliminacion", "automatico", 6);
    store().iniciarTorneo();
    jugarPendientes();
    const semi = torneo().rondas[1].partidos[0];
    store().corregirResultado(semi.id, 10, 15);
    await recargar();

    expect(torneo().estado).toBe("en_curso");
    expect(store().estaCompleto()).toBe(false);
    jugarPendientes();
    expect(store().finalizarTorneo()).toBe(true);
  });

  test("finalizado: el historial conserva el podio y no queda torneo en curso", async () => {
    crearConEquipos("eliminacion", "automatico", 2);
    store().iniciarTorneo();
    jugarPendientes();
    store().finalizarTorneo();
    await recargar();

    expect(store().torneoActual).toBeNull();
    expect(store().historial).toHaveLength(1);
    const podio = store().historial[0].podio!;
    expect(podio.primero).toBeTruthy();
    expect(podio.segundo).toBeTruthy();
    expect(podio.tercero).toBeNull();
  });

  test("no se puede finalizar dos veces ni corregir después de finalizar", () => {
    crearConEquipos("liga", "automatico", 2);
    store().iniciarTorneo();
    jugarPendientes();
    const partido = torneo().rondas[0].partidos[0];
    expect(store().finalizarTorneo()).toBe(true);
    expect(store().finalizarTorneo()).toBe(false);
    expect(store().corregirResultado(partido.id, 15, 0)).toBe(false);
    expect(store().historial).toHaveLength(1);
  });
});
