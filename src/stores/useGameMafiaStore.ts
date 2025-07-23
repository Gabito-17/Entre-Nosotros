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
  setRoomId: (id: string) => void;
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

export const useMafiaGame = create<GameMafiaStore>((set, get) => ({
  roomId: null,
  players: [],
  phase: "lobby",
  myId: null,
  hostId: null,
  hasJoined: false,
  loading: false,
  actions: {},
  logs: [],

  setRoomId: (id) => set({ roomId: id }),
  setPlayers: (updater) =>
    set((state) => ({
      players: typeof updater === "function" ? updater(state.players) : updater,
    })),
  setPhase: (phase) => set({ phase }),
  setMyId: (id) => set({ myId: id }),
  setHostId: (id) => set({ hostId: id }),
  setHasJoined: (joined) => set({ hasJoined: joined }),
  setLoading: (loading) => set({ loading }),

  // Obtiene el ID del usuario autenticado desde Supabase
  fetchMyId: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user?.id) {
      set({ myId: data.user.id });
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

    // Aquí se asume que `ensurePlayerCreated` retorna objeto {id, ...}
    // si el jugador está creado o creado al momento
    const player = await ensurePlayerCreated();
    if (!player) {
      set({ loading: false });
      return false;
    }

    // Llamada backend para unirse a la sala
    const result = await joinRoomIfAllowed(roomId, player.id, playerName);

    if (!result.success) {
      set({ loading: false });
      return false;
    }

    const myId = player.id;

    // Normalizar jugadores recibidos para el estado
    const normalizedPlayers = result.players.map((p) => ({
      id: p.player_id,
      user_id: "", // completar si disponible
      name: p.name,
      alive: p.alive,
      isHost: p.is_host,
      role: undefined,
      isSelf: p.player_id === myId,
    }));

    // Actualizar estado con datos recibidos
    set({
      roomId,
      hostId: result.room?.hostId || null,
      myId,
      players: normalizedPlayers,
      hasJoined: true,
      loading: false,
    });

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
        }
      )
      .subscribe();

    // Función para desuscribir
    return () => {
      supabase.removeChannel(channel);
    };
  },

  /**
   * Limpia el estado del store, dejando todo en valores iniciales.
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
  },

  // Agrega un mensaje a los logs
  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),

  // Registra una acción del jugador actual contra un target
  submitAction: (targetId) => {
    const myId = get().myId;
    if (!myId) return;
    set((state) => ({
      actions: { ...state.actions, [myId]: targetId },
    }));
  },

  // Avanza la fase del juego en secuencia
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
  },

  // Resetea todo el store
  reset: () =>
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
    }),
}));
