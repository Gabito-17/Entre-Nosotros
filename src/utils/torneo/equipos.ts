import { Equipo } from "./tipos.ts";

// Clave para comparar nombres: sin distinguir mayúsculas ni espacios de más.
export const normalizarNombre = (nombre: string) =>
  nombre.trim().replace(/\s+/g, " ").toLowerCase();

// Un equipo cumple si tiene exactamente la cantidad de jugadores del torneo.
export const cumpleJugadores = (equipo: Equipo, jugadoresPorEquipo: number) =>
  equipo.participantes.length === jugadoresPorEquipo;

export const equiposQueNoCumplen = (equipos: Equipo[], jugadoresPorEquipo: number) =>
  equipos.filter((e) => !cumpleJugadores(e, jugadoresPorEquipo));
