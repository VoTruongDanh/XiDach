import React, { useState } from 'react';
import type { Player } from '../types';
import { useGame } from '../contexts/GameContext';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface PlayerCardProps {
    player: Player;
    isWinner?: boolean;
    isLoser?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isWinner, isLoser }) => {
    const { dispatch } = useGame();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customAmount, setCustomAmount] = useState('');

    const handleScore = (amount: number) => {
        dispatch({ type: 'UPDATE_SCORE', payload: { playerId: player.id, amount } });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseInt(customAmount);
        if (!isNaN(amount) && amount !== 0) {
            handleScore(amount);
        }
        setCustomAmount('');
        setShowCustomInput(false);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "glass-panel p-6 relative overflow-hidden group transition-all duration-300",
                isWinner && "ring-2 ring-primary-500 shadow-glow",
                isLoser && "ring-1 ring-danger-500/50 opacity-90"
            )}
        >
            {/* Background Gradient for Winner */}
            {isWinner && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none" />
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <h3 className="font-bold text-lg text-slate-200 truncate pr-4">{player.name}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => dispatch({ type: 'REMOVE_PLAYER', payload: { playerId: player.id } })}
                        className="text-slate-500 hover:text-danger-500 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>

            {/* Score Display */}
            <div className="text-center py-2 mb-6 relative z-10">
                <motion.div
                    key={player.currentScore}
                    initial={{ scale: 1.2, color: '#fff' }}
                    animate={{ scale: 1, color: isWinner ? '#eab308' : player.currentScore < 0 ? '#ef4444' : '#fff' }}
                    className={cn(
                        "text-6xl font-black tracking-tighter tabular-nums",
                        isWinner ? "text-gradient-gold" : "text-white"
                    )}
                >
                    {player.currentScore > 0 ? `+${player.currentScore}` : player.currentScore}
                </motion.div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
                <button
                    onClick={() => handleScore(1)}
                    className="bg-accent-500/10 hover:bg-accent-500/20 text-accent-500 font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                    <Plus size={16} /> 1
                </button>
                <button
                    onClick={() => handleScore(-1)}
                    className="bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                    <Minus size={16} /> 1
                </button>

                <button
                    onClick={() => handleScore(2)}
                    className="bg-accent-500/10 hover:bg-accent-500/20 text-accent-500 font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                    <Plus size={16} /> 2
                </button>
                <button
                    onClick={() => handleScore(-2)}
                    className="bg-danger-500/10 hover:bg-danger-500/20 text-danger-500 font-bold py-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                    <Minus size={16} /> 2
                </button>

                <button
                    onClick={() => handleScore(10)}
                    className="col-span-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                    +10
                </button>
                <button
                    onClick={() => setShowCustomInput(!showCustomInput)}
                    className="col-span-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                    Custom
                </button>
            </div>

            {/* Custom Input Drawer */}
            <AnimatePresence>
                {showCustomInput && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2"
                    >
                        <form onSubmit={handleCustomSubmit} className="flex gap-2 pt-2">
                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Amount"
                                className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm focus:outline-none focus:border-primary-500"
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="bg-primary-500 text-slate-950 px-3 py-1 rounded text-sm font-bold"
                            >
                                OK
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
