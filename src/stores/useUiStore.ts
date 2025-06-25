import { create } from "zustand";

type PlayerWithScores = {
  name: string;
  scores: number[];
};

type ConfirmationModalAction = {
  label: string;
  className?: string;
  onClick?: () => void;
};

type ConfirmationModalConfig = {
  title: string;
  message: string;
  onConfirm?: () => void;
  actions?: ConfirmationModalAction[];
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

  // Modal de confirmación
  confirmationModal: ConfirmationModalConfig | null;
  openConfirmationModal: (config: ConfirmationModalConfig) => void;
  closeConfirmationModal: () => void;

  disqualificationQueue: string[]; // NUEVO
  addToDisqualificationQueue: (player: string) => void;
  popDisqualificationQueue: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  // Modal de totales
  isTotalScoresModalOpen: false,
  openTotalScoresModal: () => set({ isTotalScoresModalOpen: true }),
  closeTotalScoresModal: () => set({ isTotalScoresModalOpen: false }),

  // Modal de detalle de jugador
  selectedPlayer: null,
  setSelectedPlayer: (player) => set({ selectedPlayer: player }),
  closePlayerModal: () => set({ selectedPlayer: null }),

  // Modal de Game Over
  isGameOverModalOpen: false,
  losingPlayer: null,
  openGameOverModal: (losingPlayer) =>
    set({ isGameOverModalOpen: true, losingPlayer }),
  closeGameOverModal: () =>
    set({ isGameOverModalOpen: false, losingPlayer: null }),

  // Modal de confirmación
  confirmationModal: null,
  openConfirmationModal: (config) => set({ confirmationModal: config }),
  closeConfirmationModal: () => set({ confirmationModal: null }),

  disqualificationQueue: [],

  addToDisqualificationQueue: (player) => {
    set((state) => ({
      disqualificationQueue: [...state.disqualificationQueue, player],
      isGameOverModalOpen: true, // abrir modal si es el primero
      losingPlayer:
        state.disqualificationQueue.length === 0 ? player : state.losingPlayer,
    }));
  },

  popDisqualificationQueue: () => {
    set((state) => {
      const [, ...rest] = state.disqualificationQueue;
      return {
        disqualificationQueue: rest,
        losingPlayer: rest[0] || null,
        isGameOverModalOpen: rest.length > 0,
      };
    });
  },
}));
