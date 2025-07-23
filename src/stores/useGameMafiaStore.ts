import { create } from "zustand";
import { supabase } from "../lib/supabaseClient.ts";

type Role = "mafia" | "doctor" | "police" | "civilian";
export type Phase = "lobby" | "night" | "day" | "ended";

interface Player {
  id: number;
  name: string;
  role?: Role;
  alive: boolean;
  isHost: boolean;
  isSelf?: boolean;
}

interface GameMafiaStore {
  roomId: string | null;
  players: Player[];
  phase: Phase;
  myId: string | null;
  actions: Record<string, string>; // {playerId: targetId}
  logs: string[];

  setRoomId: (id: string) => void;
  setPlayers: (
    updater: Player[] | ((prevPlayers: Player[]) => Player[])
  ) => void;
  setPhase: (phase: Phase) => void;
  setMyId: (id: string) => void;
  addLog: (msg: string) => void;
  submitAction: (targetId: string) => void;
  reset: () => void;
}

export const useMafiaGame = create<GameMafiaStore>((set, get) => ({
  roomId: null,
  players: [],
  phase: "lobby",
  myId: null, // se setea más tarde
  actions: {},
  logs: [],

  setRoomId: (id) => set({ roomId: id }),
  setPlayers: (updater) =>
    set((state) => ({
      players: typeof updater === "function" ? updater(state.players) : updater,
    })),
  setPhase: (phase) => set({ phase }),
  setMyId: (id) => set({ myId: id }),

  fetchMyId: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user?.id) {
      set({ myId: data.user.id });
    } else {
      console.error("No se pudo obtener el ID del usuario", error);
    }
  },

  addLog: (msg) => set((state) => ({ logs: [...state.logs, msg] })),

  submitAction: (targetId) => {
    const myId = get().myId;
    if (!myId) return;
    set((state) => ({
      actions: { ...state.actions, [myId]: targetId },
    }));
  },

  reset: () =>
    set({
      roomId: null,
      players: [],
      phase: "lobby",
      myId: null,
      actions: {},
      logs: [],
    }),
}));
