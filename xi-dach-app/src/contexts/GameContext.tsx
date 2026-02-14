import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GameState, Player, Transaction } from '../types';

// --- Actions ---
type Action =
    | { type: 'START_EVENT'; payload: { name: string } }
    | { type: 'ADD_PLAYER'; payload: { name: string } }
    | { type: 'REMOVE_PLAYER'; payload: { playerId: string } }
    | { type: 'UPDATE_SCORE'; payload: { playerId: string; amount: number; note?: string } }
    | { type: 'UNDO_TRANSACTION'; payload: { transactionId: string } }
    | { type: 'RESET_EVENT' }
    | { type: 'LOAD_STATE'; payload: GameState };

// --- Initial State ---
const initialState: GameState = {
    currentEvent: null,
    history: [],
};

// --- Helper: Calculate Scores ---
// We re-calculate scores from transactions to ensure consistency
const calculatePlayerScore = (playerId: string, transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.playerId === playerId)
        .reduce((sum, t) => sum + t.amount, 0);
};

// --- Reducer ---
function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'START_EVENT':
            return {
                ...state,
                currentEvent: {
                    id: crypto.randomUUID(),
                    name: action.payload.name,
                    createdAt: Date.now(),
                    players: [],
                    transactions: [],
                    isActive: true,
                },
            };

        case 'ADD_PLAYER':
            if (!state.currentEvent) return state;
            const newPlayer: Player = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                currentScore: 0,
            };
            return {
                ...state,
                currentEvent: {
                    ...state.currentEvent,
                    players: [...state.currentEvent.players, newPlayer],
                },
            };

        case 'REMOVE_PLAYER':
            if (!state.currentEvent) return state;
            return {
                ...state,
                currentEvent: {
                    ...state.currentEvent,
                    players: state.currentEvent.players.filter(p => p.id !== action.payload.playerId),
                    // We might want to keep transactions for history, or filter them out. 
                    // For now, let's keep them but they won't be shown if player is gone.
                },
            };

        case 'UPDATE_SCORE':
            if (!state.currentEvent) return state;
            const transaction: Transaction = {
                id: crypto.randomUUID(),
                playerId: action.payload.playerId,
                amount: action.payload.amount,
                note: action.payload.note,
                timestamp: Date.now(),
                type: 'SCORE_CHANGE',
            };

            const updatedTransactions = [...state.currentEvent.transactions, transaction];

            const updatedPlayers = state.currentEvent.players.map(p => {
                if (p.id === action.payload.playerId) {
                    return { ...p, currentScore: p.currentScore + action.payload.amount };
                }
                return p;
            });

            return {
                ...state,
                currentEvent: {
                    ...state.currentEvent,
                    players: updatedPlayers,
                    transactions: updatedTransactions,
                },
            };

        case 'UNDO_TRANSACTION':
            if (!state.currentEvent) return state;
            // Find transaction to undo
            const txToUndo = state.currentEvent.transactions.find(t => t.id === action.payload.transactionId);
            if (!txToUndo) return state;

            // Filter out the transaction
            const remainingTransactions = state.currentEvent.transactions.filter(t => t.id !== action.payload.transactionId);

            // Recalculate score for the affected player
            const affectedPlayerScore = calculatePlayerScore(txToUndo.playerId, remainingTransactions);

            const playersAfterUndo = state.currentEvent.players.map(p => {
                if (p.id === txToUndo.playerId) {
                    return { ...p, currentScore: affectedPlayerScore };
                }
                return p;
            });

            return {
                ...state,
                currentEvent: {
                    ...state.currentEvent,
                    players: playersAfterUndo,
                    transactions: remainingTransactions,
                }
            };

        case 'RESET_EVENT':
            if (!state.currentEvent) return state;
            const finishedEvent = { ...state.currentEvent, isActive: false };
            return {
                ...state,
                history: [finishedEvent, ...state.history],
                currentEvent: null,
            };

        case 'LOAD_STATE':
            return action.payload;

        default:
            return state;
    }
}

// --- Context ---
interface GameContextType {
    state: GameState;
    dispatch: React.Dispatch<Action>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// --- Provider ---
const STORAGE_KEY = 'xi-dach-pro-state';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Lazy initialization to load state immediately and avoid overwriting with empty state
    const [state, dispatch] = useReducer(gameReducer, initialState, (defaultState) => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            console.error("Failed to load state", e);
            return defaultState;
        }
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);


    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
};

// --- Hook ---
export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
