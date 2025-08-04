import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabaseClient.ts";
import { joinRoom, startGame } from "../services/mafiaServices.ts";
import { ensurePlayerCreated } from "../services/userServices.ts";

// Tipos de roles posibles en el juego
type Role = "mafia" | "doctor" | "police" | "civilian";

// Fases del juego
export type Phase = "lobby" | "night" | "day" | "ended";

// Representa a un jugador en la sala
interface Player {
  id: string;
  user_id: string;
  name: string;
  role?: Role;
  alive: boolean;
  isHost: boolean;
  isSelf?: boolean;
}

// Estado del store principal de Mafia
interface GameMafiaStore {
  roomId: string | null;
  players: Player[];
  phase: Phase;
  myId: string | null;
  hostId: string | null;
  isInGame: boolean;
  loading: boolean;
  actions: Record<string, string>;
  logs: string[];
  playerName: string;

  // Setters básicos
  setRoomId: (id: string) => void;
  setPlayers: (players: Player[] | ((prev: Player[]) => Player[])) => void;
  setPhase: (phase: Phase) => void;
  setMyId: (id: string | null) => void;
  setHostId: (id: string | null) => void;
  setIsInGame: (joined: boolean) => void;
  setLoading: (loading: boolean) => void;
  setPlayerName: (name: string) => void;

  // Funciones principales
  fetchMyId: () => Promise<void>;
  joinRoom: (roomId: string, playerName: string) => Promise<boolean>;
  subscribeToPlayers: (roomId: string) => () => void;
  leaveRoom: () => Promise<void>;
  addLog: (msg: string) => void;
  submitAction: (targetId: string) => void;
  nextPhase: () => void;
  reset: () => void;
  startGame: () => Promise<boolean>;
}

export const useMafiaGame = create<GameMafiaStore>()(
  persist(
    (set, get) => ({
      roomId: null,
      players: [],
      phase: "lobby",
      myId: null,
      hostId: null,
      isInGame: false,
      loading: false,
      actions: {},
      logs: [],
      playerName: "",

      // Setters
      setRoomId: (id) => set({ roomId: id }),
      setPlayers: (updater) =>
        set((state) => ({
          players:
            typeof updater === "function" ? updater(state.players) : updater,
        })),
      setPhase: (phase) => set({ phase }),
      setMyId: (id) => set({ myId: id }),
      setHostId: (id) => set({ hostId: id }),
      setIsInGame: (joined) => set({ isInGame: joined }),
      setLoading: (loading) => set({ loading }),
      setPlayerName: (name: string) => set({ playerName: name }),

      // 🔐 Obtiene ID del usuario actual logueado
      fetchMyId: async () => {
        const { data, error } = await supabase.auth.getUser();
        if (data?.user?.id) {
          set({ myId: data.user.id });
        } else {
          console.error("No se pudo obtener el ID del usuario", error);
        }
      },

      // 🚪 Unirse a una sala
      joinRoom: async (roomId, playerName) => {
        set({ loading: true });

        const player = await ensurePlayerCreated();
        if (!player) {
          set({ loading: false });
          return false;
        }

        const result = await joinRoom(roomId, player.id, playerName);
        if (!result.success) {
          set({ loading: false });
          return false;
        }

        const myId = player.id;

        // Normalizar jugadores
        const normalizedPlayers = result.players?.map((p) => ({
          id: p.player_id,
          user_id: p.user_id || "", // se puede completar si viene del backend
          name: p.name,
          alive: p.alive,
          isHost: p.is_host,
          role: p.role,
          isSelf: p.player_id === myId,
        }));

        const isJoined = normalizedPlayers?.some((p) => p.id === myId);

        set({
          roomId,
          hostId: result.room?.hostId || null,
          myId,
          players: normalizedPlayers,
          isInGame: isJoined,
          playerName,
          loading: false,
        });

        return true;
      },

      // 📡 Subscripción en tiempo real a cambios en jugadores de la sala
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
              const { data } = await supabase
                .from("room_players")
                .select("*")
                .eq("room_id", roomId);

              const myId = get().myId;

              const normalized = (data || []).map((p) => ({
                id: p.player_id,
                user_id: p.user_id || "",
                name: p.name,
                alive: p.alive,
                isHost: p.is_host,
                role: p.role,
                isSelf: p.player_id === myId,
              }));

              set({
                players: normalized,
                isInGame: normalized.some((p) => p.id === myId),
              });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      },

      // ❌ Salida limpia de sala
      leaveRoom: async () => {
        // Aquí podrías implementar también lógica de salida en Supabase si es necesario.
        set({
          roomId: null,
          players: [],
          phase: "lobby",
          hostId: null,
          isInGame: false,
          loading: false,
          actions: {},
          logs: [],
        });
      },

      // 📝 Agrega un log al historial
      addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),

      // 🎯 Jugador realiza acción (votar, curar, matar, etc)
      submitAction: (targetId) => {
        const myId = get().myId;
        if (!myId) return;
        set((state) => ({
          actions: { ...state.actions, [myId]: targetId },
        }));
      },

      // 🔁 Avanza a la siguiente fase
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

      // 🚀 Inicia el juego (solo host)
      startGame: async () => {
        const { roomId, myId } = get();
        if (!roomId || !myId) return false;

        set({ loading: true });

        try {
          const res = await startGame(roomId, myId);
          if (!res.success) {
            get().addLog(`Error al iniciar la partida: ${res.message}`);
            set({ loading: false });
            return false;
          }

          set({
            players: res.players?.map((p) => ({
              id: p.player_id,
              user_id: p.user_id || "",
              name: p.name,
              alive: p.alive,
              isHost: p.is_host,
              role: p.role,
              isSelf: p.player_id === myId,
            })),
            phase: res.phase as Phase,
            loading: false,
          });

          get().addLog("La partida ha comenzado. Fase noche.");
          return true;
        } catch (error) {
          console.error("Error en startGame", error);
          set({ loading: false });
          return false;
        }
      },

      // 🔄 Reset completo del estado (por ejemplo, al salir del juego)
      reset: () =>
        set({
          roomId: null,
          players: [],
          phase: "lobby",
          myId: null,
          hostId: null,
          isInGame: false,
          loading: false,
          actions: {},
          logs: [],
          playerName: "",
        }),
    }),
    {
      name: "mafia-game-store",
      partialize: (state) => ({
        roomId: state.roomId,
        myId: state.myId,
        hostId: state.hostId,
        players: state.players,
        isInGame: state.isInGame,
        phase: state.phase,
        logs: state.logs,
        actions: state.actions,
        playerName: state.playerName,
      }),
    }
  )
);
