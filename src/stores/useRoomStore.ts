import { create } from "zustand";

export interface Room {
  id: string;
  host_id: string;
  created_at?: string;
  game_id: string;
  status?: "waiting" | "playing" | "finished";
  phase?: string;
}

export interface RoomPlayer {
  player_id: string;
  is_host: boolean;
  is_connect: boolean;
  alive: boolean;
  players: {
    name: string;
    avatar_url?: string;
  };
}

interface RoomStore {
  room: Room | null;
  players: RoomPlayer[];
  setRoom: (room: Room | null) => void;
  setPlayers: (players: RoomPlayer[]) => void;
  updateRoom: (updates: Partial<Room>) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  players: [],
  setRoom: (room) => set({ room }),
  setPlayers: (players) => set({ players }),

  updateRoom: (updates) =>
    set((state) => ({
      room: state.room ? { ...state.room, ...updates } : null,
    })),

  clearRoom: () => set({ room: null }),
}));
