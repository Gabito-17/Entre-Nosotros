import { create } from "zustand";

type PlayerWithScores = {
  name: string;
  scores: number[];
};

type UiState = {
  isTotalScoresModalOpen: boolean;
  openTotalScoresModal: () => void;
  closeTotalScoresModal: () => void;

  selectedPlayer: PlayerWithScores | null;
  setSelectedPlayer: (player: PlayerWithScores) => void;
  closePlayerModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isTotalScoresModalOpen: false,
  openTotalScoresModal: () => set({ isTotalScoresModalOpen: true }),
  closeTotalScoresModal: () => set({ isTotalScoresModalOpen: false }),

  selectedPlayer: null,
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  closePlayerModal: () => set({ selectedPlayer: null }),
}));
