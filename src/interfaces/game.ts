export interface Player {
  id: string;
  name: string;
  disqualified: boolean;
}

export interface Score {
  playerId: string;
  score: number;
}

export interface Round {
  roundNumber: number;
  scores: Score[];
}

export interface GameStore {
  players: Player[];
  rounds: Round[];
  newPlayerName: string;

  setNewPlayerName: (name: string) => void;
  addPlayer: () => void;
  removePlayer: (playerId: string) => void;
  disqualifyPlayer: (playerId: string) => void;
  qualifyPlayer: (playerId: string) => void;
  addNewRound: () => void;
  updatePlayerScore: (playerId: string, score: number) => void;
  handleResetGame: () => void;
}
