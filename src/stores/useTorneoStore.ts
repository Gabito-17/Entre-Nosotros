import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ZodTypeAny, z } from "zod";
import { generarFixtureLiga, crearRondaManualLiga, ligaCompleta } from "../utils/torneo/fixtureLiga.ts";
import {
  crearPrimeraRondaManual,
  eliminacionCompleta,
  generarPrimeraRonda,
  sincronizarLlave,
} from "../utils/torneo/llaveEliminacion.ts";
import {
  buscarPartido,
  conResultado,
  nuevoId,
  reemplazarPartido,
  validarResultado,
} from "../utils/torneo/partido.ts";
import { equiposQueNoCumplen, normalizarNombre } from "../utils/torneo/equipos.ts";
import { calcularTabla, podioEliminacion, podioLiga } from "../utils/torneo/tabla.ts";
import {
  Cruce,
  Formato,
  JugadoresPorEquipo,
  ModoCruces,
  OrigenResultado,
  PuntosPartida,
  Torneo,
} from "../utils/torneo/tipos.ts";
import { validarPrimeraRondaEliminacion, validarRondaManualLiga } from "../utils/torneo/validarCruces.ts";
import {
  equipoNombreSchema,
  participanteNombreSchema,
  torneoNombreSchema,
} from "../validation/validation.ts";
import { useUiNotificationStore } from "./useUiNotificationStore.ts";

// TIP UTIL: atajo para mostrar notificaciones
const notify = (message: string, type: "info" | "success" | "error" | "warning" = "info") => {
  useUiNotificationStore.getState().addNotification(message, type);
};

// Valida con Zod y notifica el primer error. Devuelve el valor parseado o null.
const validar = <S extends ZodTypeAny>(schema: S, valor: unknown): z.infer<S> | null => {
  const resultado = schema.safeParse(valor);
  if (!resultado.success) {
    notify(resultado.error.errors[0].message, "error");
    return null;
  }
  return resultado.data;
};

export type ConfigTorneo = {
  nombre: string;
  formato: Formato;
  modoCruces: ModoCruces;
  puntosPartida: PuntosPartida;
  jugadoresPorEquipo: JugadoresPorEquipo;
};

export type DatosEquipo = { nombre: string; participantes: string[] };

type TorneoState = {
  torneoActual: Torneo | null;
  historial: Torneo[];

  crearTorneo: (config: ConfigTorneo) => boolean;
  actualizarConfig: (cambios: Partial<ConfigTorneo>) => boolean;

  agregarEquipo: (datos: DatosEquipo) => boolean;
  editarEquipo: (id: string, datos: DatosEquipo) => boolean;
  eliminarEquipo: (id: string) => boolean;

  // En eliminación manual se pasa la 1ª ronda; en liga manual las rondas
  // se agregan después con agregarRondaManual.
  iniciarTorneo: (primeraRonda?: { cruces: Cruce[]; pasesLibres: string[] }) => boolean;
  agregarRondaManual: (cruces: Cruce[]) => boolean;

  registrarResultado: (
    partidoId: string,
    tantosA: number,
    tantosB: number,
    origen: OrigenResultado
  ) => boolean;
  corregirResultado: (partidoId: string, tantosA: number, tantosB: number) => boolean;

  estaCompleto: () => boolean;
  finalizarTorneo: () => boolean;
  abandonarTorneo: () => void;
};

// Valida un equipo: exactamente jugadoresPorEquipo participantes, que no estén
// en otro equipo, y un nombre que no se repita. Con 1 jugador por equipo el
// nombre es opcional y por defecto es el del jugador.
const validarEquipo = (torneo: Torneo, datos: DatosEquipo, idEditado?: string) => {
  const participantes: string[] = [];
  for (const p of datos.participantes.filter((p) => p.trim() !== "")) {
    const valido = validar(participanteNombreSchema, p);
    if (valido === null) return null;
    participantes.push(valido);
  }

  const n = torneo.jugadoresPorEquipo;
  if (participantes.length !== n) {
    notify(
      n === 1 ? "Cargá el nombre del jugador" : `Cada equipo tiene que tener ${n} jugadores`,
      "error"
    );
    return null;
  }

  const claves = participantes.map(normalizarNombre);
  if (new Set(claves).size !== claves.length) {
    notify("Un jugador no puede estar dos veces en el mismo equipo", "error");
    return null;
  }
  const otros = torneo.equipos.filter((e) => e.id !== idEditado);
  const ocupados = new Map(
    otros.flatMap((e) => e.participantes.map((p) => [normalizarNombre(p), e.nombre] as const))
  );
  const enOtro = participantes.find((p) => ocupados.has(normalizarNombre(p)));
  if (enOtro) {
    notify(`${enOtro} ya juega en ${ocupados.get(normalizarNombre(enOtro))}`, "error");
    return null;
  }

  const nombreIngresado = datos.nombre.trim() === "" && n === 1 ? participantes[0] : datos.nombre;
  const nombre = validar(equipoNombreSchema, nombreIngresado);
  if (nombre === null) return null;

  if (otros.some((e) => normalizarNombre(e.nombre) === normalizarNombre(nombre))) {
    notify("Ya existe un equipo con ese nombre", "error");
    return null;
  }

  return { nombre, participantes };
};

export const useTorneoStore = create<TorneoState>()(
  persist(
    (set, get) => {
      // Aplica un cambio al torneo actual solo si está en el estado indicado.
      const enEstado = (estado: Torneo["estado"], mensaje: string) => {
        const torneo = get().torneoActual;
        if (!torneo || torneo.estado !== estado) {
          notify(mensaje, "error");
          return null;
        }
        return torneo;
      };

      const guardar = (torneo: Torneo) => set({ torneoActual: torneo });

      const cargarResultado = (
        partidoId: string,
        tantosA: number,
        tantosB: number,
        origen: OrigenResultado,
        estadoEsperado: "pendiente" | "jugado"
      ) => {
        const torneo = enEstado("en_curso", "El torneo no está en curso");
        if (!torneo) return false;

        const partido = buscarPartido(torneo.rondas, partidoId);
        if (!partido || partido.estado !== estadoEsperado) {
          notify(
            estadoEsperado === "pendiente"
              ? "Ese partido no está pendiente"
              : "Ese partido todavía no tiene resultado",
            "error"
          );
          return false;
        }
        if (!partido.equipoA || !partido.equipoB) {
          notify("Todavía no se sabe quién juega ese partido", "error");
          return false;
        }

        const error = validarResultado(tantosA, tantosB, torneo.puntosPartida);
        if (error) {
          notify(error, "error");
          return false;
        }

        let rondas = reemplazarPartido(torneo.rondas, partidoId, (p) =>
          conResultado(p, tantosA, tantosB, origen)
        );
        if (torneo.formato === "eliminacion") rondas = sincronizarLlave(rondas);

        guardar({ ...torneo, rondas });
        return true;
      };

      return {
        torneoActual: null,
        historial: [],

        crearTorneo: (config) => {
          if (get().torneoActual) {
            notify("Ya hay un torneo armado. Terminalo o abandonalo primero.", "error");
            return false;
          }
          const nombre = validar(torneoNombreSchema, config.nombre);
          if (nombre === null) return false;

          guardar({
            ...config,
            id: nuevoId(),
            nombre,
            estado: "configurando",
            fecha: new Date().toISOString(),
            equipos: [],
            rondas: [],
            podio: null,
          });
          return true;
        },

        actualizarConfig: (cambios) => {
          const torneo = enEstado(
            "configurando",
            "La configuración no se puede cambiar con el torneo iniciado"
          );
          if (!torneo) return false;

          const nombre =
            cambios.nombre === undefined
              ? torneo.nombre
              : validar(torneoNombreSchema, cambios.nombre);
          if (nombre === null) return false;

          guardar({ ...torneo, ...cambios, nombre });
          return true;
        },

        agregarEquipo: (datos) => {
          const torneo = enEstado(
            "configurando",
            "Con el torneo iniciado no se pueden agregar equipos"
          );
          if (!torneo) return false;

          const equipo = validarEquipo(torneo, datos);
          if (!equipo) return false;

          guardar({ ...torneo, equipos: [...torneo.equipos, { id: nuevoId(), ...equipo }] });
          return true;
        },

        // Se puede editar también con el torneo en curso: los partidos
        // guardan el id del equipo, así que el nombre nuevo se ve en todos lados.
        editarEquipo: (id, datos) => {
          const torneo = get().torneoActual;
          if (!torneo || torneo.estado === "finalizado") {
            notify("No hay un torneo activo", "error");
            return false;
          }
          if (!torneo.equipos.some((e) => e.id === id)) {
            notify("Ese equipo no existe", "error");
            return false;
          }

          const equipo = validarEquipo(torneo, datos, id);
          if (!equipo) return false;

          guardar({
            ...torneo,
            equipos: torneo.equipos.map((e) => (e.id === id ? { ...e, ...equipo } : e)),
          });
          return true;
        },

        eliminarEquipo: (id) => {
          const torneo = enEstado(
            "configurando",
            "Con el torneo iniciado no se pueden quitar equipos"
          );
          if (!torneo) return false;

          guardar({ ...torneo, equipos: torneo.equipos.filter((e) => e.id !== id) });
          return true;
        },

        iniciarTorneo: (primeraRonda) => {
          const torneo = enEstado("configurando", "El torneo ya fue iniciado");
          if (!torneo) return false;

          if (torneo.equipos.length < 2) {
            notify("Se necesitan al menos 2 equipos para iniciar", "error");
            return false;
          }
          const incompletos = equiposQueNoCumplen(torneo.equipos, torneo.jugadoresPorEquipo);
          if (incompletos.length > 0) {
            notify(
              `Corregí los jugadores de: ${incompletos.map((e) => e.nombre).join(", ")}`,
              "error"
            );
            return false;
          }

          const ids = torneo.equipos.map((e) => e.id);
          const sortear = torneo.modoCruces === "automatico";
          let rondas: Torneo["rondas"] = [];

          if (torneo.formato === "liga") {
            // En liga manual las rondas se agregan de a una; si viene la 1ª
            // armada, se valida y se carga junto con el inicio.
            if (sortear) {
              rondas = generarFixtureLiga(ids, { sortear });
            } else if (primeraRonda) {
              const error = validarRondaManualLiga(primeraRonda.cruces, ids, []);
              if (error) {
                notify(error, "error");
                return false;
              }
              rondas = [crearRondaManualLiga(1, primeraRonda.cruces, ids)];
            }
          } else if (sortear) {
            rondas = [generarPrimeraRonda(ids, { sortear })];
          } else {
            if (!primeraRonda) {
              notify("Armá los cruces de la primera ronda", "error");
              return false;
            }
            const error = validarPrimeraRondaEliminacion(
              primeraRonda.cruces,
              primeraRonda.pasesLibres,
              ids
            );
            if (error) {
              notify(error, "error");
              return false;
            }
            rondas = [crearPrimeraRondaManual(primeraRonda.cruces, primeraRonda.pasesLibres)];
          }

          guardar({ ...torneo, estado: "en_curso", rondas });
          return true;
        },

        agregarRondaManual: (cruces) => {
          const torneo = enEstado("en_curso", "El torneo no está en curso");
          if (!torneo) return false;
          if (torneo.formato !== "liga" || torneo.modoCruces !== "manual") {
            notify("Solo en liga con cruces manuales se agregan rondas a mano", "error");
            return false;
          }

          const ids = torneo.equipos.map((e) => e.id);
          const error = validarRondaManualLiga(cruces, ids, torneo.rondas);
          if (error) {
            notify(error, "error");
            return false;
          }

          const ronda = crearRondaManualLiga(torneo.rondas.length + 1, cruces, ids);
          guardar({ ...torneo, rondas: [...torneo.rondas, ronda] });
          return true;
        },

        registrarResultado: (partidoId, tantosA, tantosB, origen) =>
          cargarResultado(partidoId, tantosA, tantosB, origen, "pendiente"),

        // En eliminación, si cambia el ganador se invalidan los partidos que
        // dependían de él (la UI pide confirmación con partidosAfectadosPorCorreccion).
        corregirResultado: (partidoId, tantosA, tantosB) =>
          cargarResultado(partidoId, tantosA, tantosB, "manual", "jugado"),

        estaCompleto: () => {
          const torneo = get().torneoActual;
          if (!torneo || torneo.estado !== "en_curso") return false;
          return torneo.formato === "liga"
            ? ligaCompleta(torneo.rondas, torneo.equipos.length)
            : eliminacionCompleta(torneo.rondas);
        },

        finalizarTorneo: () => {
          const torneo = enEstado("en_curso", "El torneo no está en curso");
          if (!torneo) return false;
          if (!get().estaCompleto()) {
            notify("Todavía quedan partidos por jugar", "error");
            return false;
          }

          const podio =
            torneo.formato === "liga"
              ? podioLiga(calcularTabla(torneo.equipos, torneo.rondas))
              : podioEliminacion(torneo.equipos, torneo.rondas);

          set((state) => ({
            torneoActual: null,
            historial: [{ ...torneo, estado: "finalizado", podio }, ...state.historial],
          }));
          return true;
        },

        abandonarTorneo: () => set({ torneoActual: null }),
      };
    },
    {
      name: "torneo-storage",
      // v1: se agrega jugadoresPorEquipo. Los torneos guardados antes quedan
      // en 2 (lo más común en truco); si algún equipo no cumple, se marca en la UI.
      version: 1,
      migrate: (persistido: any, version) => {
        if (version < 1) {
          const conJugadores = (t: Torneo | null) =>
            t && { ...t, jugadoresPorEquipo: t.jugadoresPorEquipo ?? 2 };
          return {
            ...persistido,
            torneoActual: conJugadores(persistido?.torneoActual ?? null),
            historial: (persistido?.historial ?? []).map(conJugadores),
          };
        }
        return persistido;
      },
    }
  )
);
