import { useGameTrucoStore } from "./useGameTrucoStore.ts";

const ESTADO_INICIAL = {
  maxScore: 15,
  score1: 0,
  score2: 0,
  winner: null,
  nombre1: "NOSOTROS",
  nombre2: "ELLOS",
  partidoTorneo: null,
  partidaLibreGuardada: null,
};

const partido = {
  torneoId: "t1",
  partidoId: "p1",
  nombre1: "Los Pibes",
  nombre2: "Las Pibas",
  maxScore: 30,
};

const get = () => useGameTrucoStore.getState();

beforeEach(() => {
  localStorage.clear();
  useGameTrucoStore.setState(ESTADO_INICIAL);
});

describe("iniciarPartidoTorneo", () => {
  it("guarda la partida libre y carga nombres, puntaje y tantos del torneo", () => {
    useGameTrucoStore.setState({ maxScore: 18, score1: 7, score2: 3, nombre1: "YO", nombre2: "VOS" });

    get().iniciarPartidoTorneo(partido);

    expect(get().partidaLibreGuardada).toEqual({
      maxScore: 18,
      score1: 7,
      score2: 3,
      winner: null,
      nombre1: "YO",
      nombre2: "VOS",
    });
    expect(get()).toMatchObject({
      partidoTorneo: { torneoId: "t1", partidoId: "p1" },
      nombre1: "Los Pibes",
      nombre2: "Las Pibas",
      maxScore: 30,
      score1: 0,
      score2: 0,
      winner: null,
    });
  });

  it("guarda también una partida libre ya terminada", () => {
    useGameTrucoStore.setState({ score1: 15, winner: "equipo1" });
    get().iniciarPartidoTorneo(partido);
    expect(get().partidaLibreGuardada).toMatchObject({ score1: 15, winner: "equipo1" });
    expect(get().winner).toBeNull();
  });

  it("no pisa la partida libre si ya había un partido de torneo abierto", () => {
    useGameTrucoStore.setState({ score1: 7, score2: 3 });
    get().iniciarPartidoTorneo(partido);
    get().addPoint("equipo1", 4);

    get().iniciarPartidoTorneo({ ...partido, partidoId: "p2" });

    expect(get().partidaLibreGuardada).toMatchObject({ score1: 7, score2: 3, maxScore: 15 });
    expect(get().partidoTorneo).toEqual({ torneoId: "t1", partidoId: "p2" });
    expect(get().score1).toBe(0);
  });

  it("los puntos se cuentan con el máximo del torneo", () => {
    get().iniciarPartidoTorneo(partido);
    get().addPoint("equipo2", 29);
    expect(get().winner).toBeNull();
    get().addPoint("equipo2");
    expect(get().winner).toBe("equipo2");
  });
});

describe("salirPartidoTorneo", () => {
  it("restaura la partida libre y limpia el contexto", () => {
    useGameTrucoStore.setState({ maxScore: 18, score1: 7, score2: 3, nombre1: "YO", nombre2: "VOS" });
    get().iniciarPartidoTorneo(partido);
    get().addPoint("equipo1", 10);

    get().salirPartidoTorneo();

    expect(get()).toMatchObject({
      maxScore: 18,
      score1: 7,
      score2: 3,
      winner: null,
      nombre1: "YO",
      nombre2: "VOS",
      partidoTorneo: null,
      partidaLibreGuardada: null,
    });
  });

  it("sin partida guardada (contexto viejo) solo limpia el contexto", () => {
    useGameTrucoStore.setState({
      partidoTorneo: { torneoId: "viejo", partidoId: "x" },
      partidaLibreGuardada: null,
      score1: 4,
      nombre1: "A",
    });

    get().salirPartidoTorneo();

    expect(get().partidoTorneo).toBeNull();
    expect(get().score1).toBe(4);
    expect(get().nombre1).toBe("A");
  });

  it("es idempotente: salir dos veces no vuelve a pisar la partida", () => {
    useGameTrucoStore.setState({ score1: 7 });
    get().iniciarPartidoTorneo(partido);
    get().salirPartidoTorneo();
    get().addPoint("equipo1");

    get().salirPartidoTorneo();

    expect(get().score1).toBe(8);
  });
});

describe("persistencia", () => {
  it("guarda el contexto de torneo en localStorage", () => {
    get().iniciarPartidoTorneo(partido);
    const guardado = JSON.parse(localStorage.getItem("truco-config") as string);
    expect(guardado.state.partidoTorneo).toEqual({ torneoId: "t1", partidoId: "p1" });
    expect(guardado.state.partidaLibreGuardada).toMatchObject({ nombre1: "NOSOTROS" });
  });

  it("al recargar retoma el partido y sigue pudiendo restaurar la partida libre", async () => {
    useGameTrucoStore.setState({ score1: 7, score2: 3 });
    get().iniciarPartidoTorneo(partido);
    get().addPoint("equipo2", 5);
    const snapshot = localStorage.getItem("truco-config") as string;

    // Simula cerrar y reabrir la app: memoria limpia, storage intacto
    useGameTrucoStore.setState(ESTADO_INICIAL);
    localStorage.setItem("truco-config", snapshot);
    await useGameTrucoStore.persist.rehydrate();

    expect(get()).toMatchObject({
      partidoTorneo: { torneoId: "t1", partidoId: "p1" },
      nombre1: "Los Pibes",
      maxScore: 30,
      score2: 5,
    });

    get().salirPartidoTorneo();
    expect(get()).toMatchObject({ score1: 7, score2: 3, maxScore: 15, partidoTorneo: null });
  });
});
