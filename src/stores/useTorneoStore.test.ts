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
  store().crearTorneo({ nombre: "Copa Asado", formato, modoCruces, puntosPartida: 15 });
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
    expect(store().crearTorneo({ nombre: "  Copa  ", formato: "liga", modoCruces: "automatico", puntosPartida: 18 })).toBe(true);
    expect(torneo()).toMatchObject({ nombre: "Copa", estado: "configurando", puntosPartida: 18, equipos: [] });
  });

  test("no deja crear otro torneo si ya hay uno", () => {
    crearConEquipos("liga", "automatico", 0);
    expect(store().crearTorneo({ nombre: "Otro", formato: "liga", modoCruces: "automatico", puntosPartida: 15 })).toBe(false);
  });

  test("valida nombres y no permite equipos repetidos", () => {
    crearConEquipos("liga", "automatico", 1);
    expect(store().agregarEquipo({ nombre: "equipo 1", participantes: [] })).toBe(false);
    expect(ultimoAviso()).toMatch(/Ya existe/);
    expect(store().agregarEquipo({ nombre: "   ", participantes: [] })).toBe(false);
    expect(torneo().equipos).toHaveLength(1);
  });

  test("descarta participantes vacíos", () => {
    crearConEquipos("liga", "automatico", 0);
    store().agregarEquipo({ nombre: "Los Pibes", participantes: ["Ana", " ", ""] });
    expect(torneo().equipos[0].participantes).toEqual(["Ana"]);
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

    expect(store().agregarEquipo({ nombre: "Tarde", participantes: [] })).toBe(false);
    expect(store().eliminarEquipo(primero.id)).toBe(false);
    expect(store().editarEquipo(primero.id, { nombre: "Renombrado", participantes: [] })).toBe(true);
    expect(torneo().equipos[0].nombre).toBe("Renombrado");
    expect(store().actualizarConfig({ puntosPartida: 30 })).toBe(false);
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
    expect(store().agregarRondaManual([[b, a]])).toBe(false);
    store().agregarRondaManual([[a, c]]);
    store().agregarRondaManual([[b, c]]);

    jugarPendientes();
    expect(store().finalizarTorneo()).toBe(true);
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
