import { create } from "zustand";

export type RoomStatus = "waiting" | "playing" | "finished";

export type Room = {
  id: string;
  code: string;
  status: RoomStatus;
  created_at: string;
};

export type RoomPlayer = {
  player_id: string;
  name: string;
  avatar_url?: string;
  is_host: boolean;
  is_connect: boolean;
  alive: boolean;
};

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
