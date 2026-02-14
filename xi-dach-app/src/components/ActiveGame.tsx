import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Layout } from './Layout';
import { PlayerCard } from './PlayerCard';
import { Plus, Save } from 'lucide-react';
import { motion } from 'framer-motion';

export const ActiveGame: React.FC = () => {
    const { state, dispatch } = useGame();
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');

    if (!state.currentEvent) return null;

    const { players, name } = state.currentEvent;

    // Determine winners/losers
    const maxScore = Math.max(...players.map(p => p.currentScore));
    const minScore = Math.min(...players.map(p => p.currentScore));

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlayerName.trim()) {
            dispatch({ type: 'ADD_PLAYER', payload: { name: newPlayerName } });
            setNewPlayerName('');
            setShowAddPlayer(false);
        }
    };

    return (
        <Layout>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-primary-500">Event:</span> {name}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Started at {new Date(state.currentEvent.createdAt).toLocaleTimeString()}
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => dispatch({ type: 'RESET_EVENT' })}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                        <Save size={16} /> End & Save
                    </button>
                </div>
            </header>

            {/* Stats/Summary Bar (Optional) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase tracking-wider">Total Players</div>
                <div className="text-xl font-bold">{players.length}</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Total Money/Score</div>
                <div className="text-xl font-bold flex items-center gap-2">
                    {players.reduce((sum, p) => sum + p.currentScore, 0)}
                    <span className="text-xs text-slate-500 font-normal">(Should be 0)</span>
                </div>
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map(player => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        isWinner={players.length > 1 && player.currentScore === maxScore && maxScore > 0}
                        isLoser={players.length > 1 && player.currentScore === minScore && minScore < 0}
                    />
                ))}

                {/* Add Player Card */}
                <motion.div
                    layout
                    onClick={() => setShowAddPlayer(true)}
                    className="glass-panel p-6 flex flex-col items-center justify-center min-h-[300px] cursor-pointer hover:bg-white/10 transition-colors border-dashed border-2 border-white/20 hover:border-white/40 group"
                >
                    {!showAddPlayer ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={32} className="text-slate-400 group-hover:text-white" />
                            </div>
                            <span className="text-slate-400 font-medium group-hover:text-white">Add Player</span>
                        </>
                    ) : (
                        <form onSubmit={handleAddPlayer} className="w-full" onClick={e => e.stopPropagation()}>
                            <label className="block text-sm text-slate-400 mb-2">Player Name</label>
                            <input
                                type="text"
                                value={newPlayerName}
                                onChange={e => setNewPlayerName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:border-primary-500"
                                autoFocus
                                placeholder="Name..."
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-primary-500 text-black font-bold py-2 rounded">Add</button>
                                <button type="button" onClick={() => setShowAddPlayer(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded">Cancel</button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </Layout>
    );
};
