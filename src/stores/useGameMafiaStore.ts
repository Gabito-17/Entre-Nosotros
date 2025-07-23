import { create } from "zustand";
import { supabase } from "../lib/supabaseClient.ts";
import { joinRoomIfAllowed } from "../services/mafiaServices.ts";
import { ensurePlayerCreated } from "../services/userServices.ts";

// Roles posibles de los jugadores
type Role = "mafia" | "doctor" | "police" | "civilian";

// Fases del juego
export type Phase = "lobby" | "night" | "day" | "ended";

// Definición del jugador
interface Player {
  id: string;
  user_id: string;
  name: string;
  role?: Role;
  alive: boolean;
  isHost: boolean;
  isSelf?: boolean;
}

// Definición completa del store Zustand para el juego Mafia
interface GameMafiaStore {
  roomId: string | null; // ID de la sala actual
  players: Player[]; // Lista de jugadores en la sala
  phase: Phase; // Fase actual del juego
  myId: string | null; // ID del usuario actual
  hostId: string | null; // ID del host de la sala
  hasJoined: boolean; // Indica si el usuario ya se unió a la sala
  loading: boolean; // Estado de carga para UI
  actions: Record<string, string>; // Acciones de los jugadores: {playerId: targetId}
  logs: string[]; // Logs o mensajes del juego

  // Setters básicos para actualizar estado
  setRoomId: (id: string | null) => void;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setPhase: (phase: Phase) => void;
  setMyId: (id: string | null) => void;
  setHostId: (id: string | null) => void;
  setHasJoined: (joined: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Funciones de lógica de juego y negocio
  fetchMyId: () => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  subscribeToPlayers: (roomId: string) => () => void;
  leaveRoom: () => void;
  addLog: (msg: string) => void;
  submitAction: (targetId: string) => void;
  nextPhase: () => void;
  reset: () => void;
}

/**
 * Llaves usadas para persistir en localStorage
 */
const LS_KEYS = {
  roomId: "gameMafia_roomId",
  players: "gameMafia_players",
  phase: "gameMafia_phase",
  myId: "gameMafia_myId",
  hostId: "gameMafia_hostId",
  hasJoined: "gameMafia_hasJoined",
};

/**
 * Función helper para cargar JSON del localStorage con fallback seguro
 */
const loadFromLS = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

/**
 * Función helper para guardar en localStorage con JSON stringify
 */
const saveToLS = (key: string, value: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Puede fallar en navegadores que no soporten localStorage o modo incógnito
  }
};

export const useMafiaGame = create<GameMafiaStore>((set, get) => ({
  // Inicializamos estado intentando cargar desde localStorage para persistencia simple
  roomId:
    typeof window !== "undefined"
      ? loadFromLS<string | null>(LS_KEYS.roomId, null)
      : null,
  players:
    typeof window !== "undefined"
      ? loadFromLS<Player[]>(LS_KEYS.players, [])
      : [],
  phase:
    typeof window !== "undefined"
      ? loadFromLS<Phase>(LS_KEYS.phase, "lobby")
      : "lobby",
  myId:
    typeof window !== "undefined"
      ? loadFromLS<string | null>(LS_KEYS.myId, null)
      : null,
  hostId:
    typeof window !== "undefined"
      ? loadFromLS<string | null>(LS_KEYS.hostId, null)
      : null,
  hasJoined:
    typeof window !== "undefined"
      ? loadFromLS<boolean>(LS_KEYS.hasJoined, false)
      : false,
  loading: false,
  actions: {},
  logs: [],

  // Setters sincronizan estado con localStorage para persistencia

  setRoomId: (id) => {
    set({ roomId: id });
    saveToLS(LS_KEYS.roomId, id);
  },
  setPlayers: (players) =>
    set((state) => {
      const newPlayers =
        typeof players === "function" ? players(state.players) : players;
      saveToLS(LS_KEYS.players, newPlayers);
      return { players: newPlayers };
    }),
  setPhase: (phase) => {
    set({ phase });
    saveToLS(LS_KEYS.phase, phase);
  },
  setMyId: (id) => {
    set({ myId: id });
    saveToLS(LS_KEYS.myId, id);
  },
  setHostId: (id) => {
    set({ hostId: id });
    saveToLS(LS_KEYS.hostId, id);
  },
  setHasJoined: (joined) => {
    set({ hasJoined: joined });
    saveToLS(LS_KEYS.hasJoined, joined);
  },
  setLoading: (loading) => set({ loading }),

  // Obtiene el ID del usuario autenticado desde Supabase
  fetchMyId: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user?.id) {
      set({ myId: data.user.id });
      saveToLS(LS_KEYS.myId, data.user.id);
    } else {
      console.error("No se pudo obtener el ID del usuario", error);
    }
  },

  /**
   * Intenta unirse a la sala con nombre dado.
   * Realiza llamada a backend, carga jugadores iniciales y actualiza estado.
   * Retorna true si pudo unirse, false si hubo error.
   */
  joinRoom: async (roomId, playerName) => {
    set({ loading: true });

    const player = await ensurePlayerCreated();
    if (!player) {
      set({ loading: false });
      return false;
    }

    const result = await joinRoomIfAllowed(roomId, player.id, playerName);

    if (!result.success) {
      set({ loading: false });
      return false;
    }

    const myId = player.id;

    const normalizedPlayers = result.players.map((p) => ({
      id: p.player_id,
      user_id: "", // completar si disponible
      name: p.name,
      alive: p.alive,
      isHost: p.is_host,
      role: undefined,
      isSelf: p.player_id === myId,
    }));

    // Actualizar estado y persistir
    set({
      roomId,
      hostId: result.room?.hostId || null,
      myId,
      players: normalizedPlayers,
      hasJoined: true,
      loading: false,
    });
    saveToLS(LS_KEYS.roomId, roomId);
    saveToLS(LS_KEYS.hostId, result.room?.hostId || null);
    saveToLS(LS_KEYS.myId, myId);
    saveToLS(LS_KEYS.players, normalizedPlayers);
    saveToLS(LS_KEYS.hasJoined, true);

    return true;
  },

  /**
   * Suscribe a cambios en jugadores de la sala en Supabase.
   * Actualiza el estado local con datos nuevos en tiempo real.
   * Retorna función para desuscribir la suscripción.
   */
  subscribeToPlayers: (roomId) => {
    const channel = supabase
      .channel(`room_players_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_players",
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          // Al detectar cambios, recarga lista completa de jugadores
          const { data } = await supabase
            .from("room_players")
            .select("*")
            .eq("room_id", roomId);

          const normalized = (data || []).map((p) => ({
            id: p.player_id,
            user_id: "", // completar si disponible
            name: p.name,
            alive: p.alive,
            isHost: p.is_host,
            role: undefined,
            isSelf: false,
          }));

          set({ players: normalized });
          saveToLS(LS_KEYS.players, normalized);
        }
      )
      .subscribe();

    // Función para desuscribir
    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Limpia el estado del store y localStorage, dejando todo en valores iniciales.
   */
  leaveRoom: () => {
    set({
      roomId: null,
      players: [],
      phase: "lobby",
      myId: null,
      hostId: null,
      hasJoined: false,
      loading: false,
      actions: {},
      logs: [],
    });

    // Limpiar localStorage para que no quede nada persistido
    Object.values(LS_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignorar errores
      }
    });
  },

  // Agrega un mensaje a los logs (no persistido)
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),

  // Registra una acción del jugador actual contra un target (no persistido)
  submitAction: (targetId) => {
    const myId = get().myId;
    if (!myId) return;
    set((state) => ({
      actions: { ...state.actions, [myId]: targetId },
    }));
  },

  // Avanza la fase del juego en secuencia y persiste el nuevo estado
  nextPhase: () => {
    const phase = get().phase;
    const next =
      phase === "lobby"
        ? "night"
        : phase === "night"
        ? "day"
        : phase === "day"
        ? "night"
        : "ended";

    set({ phase: next, actions: {} });
    saveToLS(LS_KEYS.phase, next);
  },

  // Resetea todo el store y localStorage a valores iniciales
  reset: () => {
    set({
      roomId: null,
      players: [],
      phase: "lobby",
      myId: null,
      hostId: null,
      hasJoined: false,
      loading: false,
      actions: {},
      logs: [],
    });
    Object.values(LS_KEYS).forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
  },
}));
