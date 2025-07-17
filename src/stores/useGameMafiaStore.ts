import { create } from "zustand";
import { getOrCreateUserId } from '../utils/getOrCreateUserId.ts';

type Role = 'mafia' | 'doctor' | 'police' | 'civilian';
export type Phase = 'lobby' | 'night' | 'day' | 'ended';

interface Player {
  id: string;
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
  setPlayers: (players: Player[]) => void;
  setPhase: (phase: Phase) => void;
  setMyId: (id: string) => void;
  addLog: (msg: string) => void;
  submitAction: (targetId: string) => void;
  reset: () => void;
}

export const useMafiaGame = create<GameMafiaStore>((set, get) => ({
  roomId: null,
  players: [],
  phase: 'lobby',
  myId: getOrCreateUserId(), // ✅ Acá sí podés ejecutar la función
  actions: {},
  logs: [],

  setRoomId: (id) => set({ roomId: id }),
  setPlayers: (players) => set({ players }),
  setPhase: (phase) => set({ phase }),
  setMyId: (id) => set({ myId: id }),

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
      phase: 'lobby',
      myId: getOrCreateUserId(), // ✅ Genera un nuevo ID si reseteás el juego
      actions: {},
      logs: [],
    }),
}));
