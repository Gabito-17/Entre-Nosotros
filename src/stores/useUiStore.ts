import { create } from "zustand";

type PlayerWithScores = {
  name: string;
  scores: number[];
};

type UiState = {
  // Modal de totales
  isTotalScoresModalOpen: boolean;
  openTotalScoresModal: () => void;
  closeTotalScoresModal: () => void;

  // Modal de detalle de jugador
  selectedPlayer: PlayerWithScores | null;
  setSelectedPlayer: (player: PlayerWithScores) => void;
  closePlayerModal: () => void;

  // Modal de Game Over
  isGameOverModalOpen: boolean;
  losingPlayer: string | null;
  openGameOverModal: (losingPlayer: string) => void;
  closeGameOverModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  // Estado inicial de cada modal
  isTotalScoresModalOpen: false,
  openTotalScoresModal: () => set({ isTotalScoresModalOpen: true }),
  closeTotalScoresModal: () => set({ isTotalScoresModalOpen: false }),

  selectedPlayer: null,
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  closePlayerModal: () => set({ selectedPlayer: null }),

  isGameOverModalOpen: false,
  losingPlayer: null,
  openGameOverModal: (losingPlayer) =>
    set({ isGameOverModalOpen: true, losingPlayer }),
  closeGameOverModal: () =>
    set({ isGameOverModalOpen: false, losingPlayer: null }),
}));
