import React, { useState } from 'react';
import type { Player } from '../types';
import { useGame } from '../contexts/GameContext';
import { Plus, Minus, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface PlayerCardProps {
    player: Player;
    isWinner?: boolean;
    isLoser?: boolean;
    isLocked?: boolean;
    scoreButtons: number[];
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, isWinner, isLoser, isLocked, scoreButtons }) => {
    const { dispatch } = useGame();
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customAmount, setCustomAmount] = useState('');

    const handleScore = (amount: number) => {
        if (isLocked) return;
        dispatch({ type: 'UPDATE_SCORE', payload: { playerId: player.id, amount } });
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLocked) return;
        const amount = parseInt(customAmount);
        if (!isNaN(amount) && amount !== 0) {
            handleScore(amount);
        }
        setCustomAmount('');
        setShowCustomInput(false);
    };

    const handleReset = () => {
        if (isLocked) return;
        if (player.currentScore === 0) return;
        if (window.confirm(`Reset "${player.name}" về 0?`)) {
            dispatch({ type: 'RESET_PLAYER_SCORE', payload: { playerId: player.id } });
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "glass-panel p-3 md:p-6 relative overflow-hidden group transition-all duration-300",
                isWinner && "ring-2 ring-primary-500 shadow-glow",
                isLoser && "ring-1 ring-danger-500/50 opacity-90",
                isLocked && "opacity-60 pointer-events-none select-none"
            )}
        >
            {isWinner && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-transparent pointer-events-none" />
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
                <h3 className="font-bold text-sm md:text-lg text-slate-200 truncate pr-2">{player.name}</h3>
                <div className="flex gap-1.5 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleReset}
                        title="Reset về 0"
                        className="text-slate-500 hover:text-primary-500 transition-colors"
                    >
                        <RotateCcw size={14} />
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'REMOVE_PLAYER', payload: { playerId: player.id } })}
                        className="text-slate-500 hover:text-danger-500 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            </div>

            {/* Score Display */}
            <div className="text-center py-1 mb-3 md:mb-6 relative z-10">
                <motion.div
                    key={player.currentScore}
                    initial={{ scale: 1.2, color: '#fff' }}
                    animate={{ scale: 1, color: isWinner ? '#eab308' : player.currentScore < 0 ? '#ef4444' : '#fff' }}
                    className={cn(
                        "text-4xl md:text-6xl font-black tracking-tighter tabular-nums",
                        isWinner ? "text-gradient-gold" : "text-white"
                    )}
                >
                    {player.currentScore > 0 ? `+${player.currentScore}` : player.currentScore}
                </motion.div>
            </div>

            {/* Score Buttons - Dynamic from settings */}
            <div className="grid grid-cols-2 gap-1.5 md:gap-2 relative z-10">
                {scoreButtons.map((val, i) => (
                    <button
                        key={i}
                        onClick={() => handleScore(val)}
                        className={cn(
                            "font-bold py-2 md:py-3 rounded-lg flex items-center justify-center gap-0.5 transition-colors text-xs md:text-base",
                            val > 0
                                ? "bg-accent-500/10 hover:bg-accent-500/20 text-accent-500"
                                : "bg-danger-500/10 hover:bg-danger-500/20 text-danger-500"
                        )}
                    >
                        {val > 0 ? <Plus size={12} className="md:w-4 md:h-4" /> : <Minus size={12} className="md:w-4 md:h-4" />}
                        {Math.abs(val)}
                    </button>
                ))}
            </div>

            {/* Custom - separate row */}
            <div className="mt-1.5 md:mt-2 relative z-10">
                <button
                    onClick={() => !isLocked && setShowCustomInput(!showCustomInput)}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-1.5 md:py-2 rounded-lg text-xs md:text-sm transition-colors"
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
                                placeholder="Nhập số điểm..."
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
