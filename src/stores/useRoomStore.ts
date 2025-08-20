// useRoomStore.ts (lo que ya tenés, pero explicando cómo usarlo)

import { create } from "zustand";

export type RoomStatus = "waiting" | "playing" | "finished";
export type Phase = "lobby" | "night" | "day" | "ended";

export interface Action {
  id: string;
  room_id: string;
  from_player_id: string;
  to_player_id: string;
  type: string;
  phase: Phase;
  created_at: string;
}

export interface Room {
  name: string;
  id: string;
  code: string;
  status: RoomStatus;
  created_at: string;
  phase: Phase; // "day" | "night"
};

export interface RoomPlayer {
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
  actions: Action[]; // acciones actuales en la sala
  setActions: (actions: Action[]) => void; // para setear todas las acciones
  addAction: (action: Action) => void; // para agregar una acción nueva
  clearActions: () => void; // limpiar acciones (ej: al cambiar fase)
  setRoom: (room: Room | null) => void;
  setPlayers: (players: RoomPlayer[]) => void;
  updateRoom: (updates: Partial<Room>) => void;
  clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  players: [],
  actions: [],

  setRoom: (room) => set({ room }), // room debe contener name, id, code, status, created_at
  setPlayers: (players) => set({ players }),
  setActions: (actions) => set({ actions }),
  addAction: (action) =>
    set((state) => ({
      actions: [...state.actions, action],
    })),
  clearActions: () => set({ actions: [] }),

  updateRoom: (updates) =>
    set((state) => ({
      room: state.room ? { ...state.room, ...updates } : null,
    })),

  clearRoom: () => set({ room: null }),
}));
