import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { GameState, Player, Transaction, GameEvent } from '../types';

// --- Actions ---
type Action =
    | { type: 'CREATE_SESSION'; payload: { name: string; initialPlayers: string[] } }
    | { type: 'ACTIVATE_SESSION'; payload: { sessionId: string | null } } // null to go to dashboard
    | { type: 'DELETE_SESSION'; payload: { sessionId: string } }
    | { type: 'ADD_PLAYER'; payload: { name: string } }
    | { type: 'REMOVE_PLAYER'; payload: { playerId: string } }
    | { type: 'UPDATE_SCORE'; payload: { playerId: string; amount: number; note?: string } }
    | { type: 'LOAD_STATE'; payload: GameState };

// --- Initial State ---
const initialState: GameState = {
    sessions: [],
    activeSessionId: null,
    currentEvent: null,
    history: [],
};

// --- Helper: Calculate Scores ---
const calculatePlayerScore = (playerId: string, transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.playerId === playerId)
        .reduce((sum, t) => sum + t.amount, 0);
};

// --- Reducer ---
function gameReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case 'CREATE_SESSION':
            const newSession: GameEvent = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                createdAt: Date.now(),
                players: action.payload.initialPlayers.map(name => ({
                    id: crypto.randomUUID(),
                    name: name.trim(),
                    currentScore: 0
                })),
                transactions: [],
                isActive: true,
            };
            return {
                ...state,
                sessions: [newSession, ...state.sessions],
                activeSessionId: newSession.id, // Auto-activate
            };

        case 'ACTIVATE_SESSION':
            return {
                ...state,
                activeSessionId: action.payload.sessionId,
            };

        case 'DELETE_SESSION':
            return {
                ...state,
                sessions: state.sessions.filter(s => s.id !== action.payload.sessionId),
                activeSessionId: state.activeSessionId === action.payload.sessionId ? null : state.activeSessionId,
            };

        // --- Game Actions (Apply to ACTIVE session) ---
        case 'ADD_PLAYER': {
            if (!state.activeSessionId) return state;

            const newPlayer: Player = {
                id: crypto.randomUUID(),
                name: action.payload.name,
                currentScore: 0,
            };

            return {
                ...state,
                sessions: state.sessions.map(s => {
                    if (s.id === state.activeSessionId) {
                        return { ...s, players: [...s.players, newPlayer] };
                    }
                    return s;
                })
            };
        }

        case 'REMOVE_PLAYER': {
            if (!state.activeSessionId) return state;
            return {
                ...state,
                sessions: state.sessions.map(s => {
                    if (s.id === state.activeSessionId) {
                        return { ...s, players: s.players.filter(p => p.id !== action.payload.playerId) };
                    }
                    return s;
                })
            };
        }

        case 'UPDATE_SCORE': {
            if (!state.activeSessionId) return state;

            return {
                ...state,
                sessions: state.sessions.map(s => {
                    if (s.id !== state.activeSessionId) return s;

                    const transaction: Transaction = {
                        id: crypto.randomUUID(),
                        playerId: action.payload.playerId,
                        amount: action.payload.amount,
                        note: action.payload.note,
                        timestamp: Date.now(),
                        type: 'SCORE_CHANGE',
                    };

                    const updatedPlayers = s.players.map(p => {
                        if (p.id === action.payload.playerId) {
                            return { ...p, currentScore: p.currentScore + action.payload.amount };
                        }
                        return p;
                    });

                    return {
                        ...s,
                        players: updatedPlayers,
                        transactions: [...s.transactions, transaction]
                    };
                })
            };
        }

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
    activeSession: GameEvent | undefined;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// --- Provider ---
const STORAGE_KEY = 'xi-dach-pro-state-v3'; // Increment version to force fresh start

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(gameReducer, initialState, (defaultState) => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : defaultState;
        } catch (e) {
            console.error("Failed to load state", e);
            return defaultState;
        }
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const activeSession = state.sessions.find(s => s.id === state.activeSessionId);

    return (
        <GameContext.Provider value={{ state, dispatch, activeSession }}>
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
