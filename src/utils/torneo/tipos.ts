// Modelo de datos del módulo Torneo (ver docs/torneo-spec.md)

export type Formato = "liga" | "eliminacion";
export type ModoCruces = "automatico" | "manual";
export type PuntosPartida = 15 | 18 | 30;
export type EstadoTorneo = "configurando" | "en_curso" | "finalizado";
export type EstadoPartido = "pendiente" | "jugado" | "pase_libre";
export type OrigenResultado = "anotador" | "manual";

export type Equipo = {
  id: string;
  nombre: string;
  participantes: string[];
};

// En eliminación, un pase libre es un Partido con estado "pase_libre":
// equipoA avanza solo y equipoB queda en null.
// En una llave, equipoA/equipoB pueden ser null mientras no se conozca
// al ganador del partido anterior.
export type Partido = {
  id: string;
  equipoA: string | null;
  equipoB: string | null;
  tantosA: number | null;
  tantosB: number | null;
  ganador: string | null;
  estado: EstadoPartido;
  origen: OrigenResultado | null;
};

export type Ronda = {
  numero: number;
  partidos: Partido[];
  equipoLibre: string | null; // solo liga
};

export type Podio = {
  primero: string | null;
  segundo: string | null;
  tercero: string | null;
};

export type Torneo = {
  id: string;
  nombre: string;
  formato: Formato;
  modoCruces: ModoCruces;
  puntosPartida: PuntosPartida;
  estado: EstadoTorneo;
  fecha: string; // ISO
  equipos: Equipo[];
  rondas: Ronda[];
  podio: Podio | null;
};

// Cruce elegido a mano: [equipoA, equipoB]
export type Cruce = [string, string];
