export interface Transaction {
    id: string;
    playerId: string;
    amount: number;
    note?: string;
    timestamp: number;
    type: 'SCORE_CHANGE' | 'MANUAL_ADJUSTMENT' | 'RESET';
}

export interface Player {
    id: string;
    name: string;
    currentScore: number;
    isDealer?: boolean; // In case we want to track a dealer separately, though usually one player is dealer
}

export interface GameEvent {
    id: string;
    name: string;
    createdAt: number;
    players: Player[];
    transactions: Transaction[];
    isActive: boolean;
}

export interface GameState {
    currentEvent: GameEvent | null;
    history: GameEvent[]; // Archived events
}
