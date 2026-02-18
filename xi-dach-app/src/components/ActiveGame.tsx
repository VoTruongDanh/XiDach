import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Layout } from './Layout';
import { PlayerCard } from './PlayerCard';
import { Plus, Save, Lock, Unlock, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY_BUTTONS = 'xi-dach-score-buttons';
const DEFAULT_BUTTONS = [-2, 2, -5, 5, -10, 10];

function loadButtons(): number[] {
    try {
        const saved = localStorage.getItem(STORAGE_KEY_BUTTONS);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length === 6) return parsed;
        }
    } catch { /* ignore */ }
    return DEFAULT_BUTTONS;
}

export const ActiveGame: React.FC = () => {
    const { dispatch, activeSession } = useGame();
    const [showAddPlayer, setShowAddPlayer] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [scoreButtons, setScoreButtons] = useState<number[]>(loadButtons);
    const [editButtons, setEditButtons] = useState<string[]>(scoreButtons.map(String));

    if (!activeSession) return null;

    const { players, name } = activeSession;

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

    const openSettings = () => {
        setEditButtons(scoreButtons.map(String));
        setShowSettings(true);
    };

    const saveSettings = () => {
        const parsed = editButtons.map(v => {
            const n = parseInt(v);
            return isNaN(n) ? 0 : n;
        }).map(v => v === 0 ? 1 : v); // fallback 0 -> 1

        setScoreButtons(parsed);
        localStorage.setItem(STORAGE_KEY_BUTTONS, JSON.stringify(parsed));
        setShowSettings(false);
    };

    const resetDefaults = () => {
        setEditButtons(DEFAULT_BUTTONS.map(String));
    };

    return (
        <Layout>
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="text-primary-500">🎴</span> {name}
                    </h1>
                    <p className="text-slate-400 text-sm">
                        {new Date(activeSession.createdAt).toLocaleDateString('vi-VN')} • {players.length} người chơi
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={openSettings}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors text-sm"
                    >
                        <Settings size={16} />
                    </button>
                    <button
                        onClick={() => setIsLocked(!isLocked)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${isLocked
                            ? 'bg-danger-500/20 text-danger-400 ring-1 ring-danger-500/50'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300'
                            }`}
                    >
                        {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                        {isLocked ? 'Locked' : 'Lock'}
                    </button>
                    <button
                        onClick={() => dispatch({ type: 'ACTIVATE_SESSION', payload: { sessionId: null } })}
                        className="bg-white/5 hover:bg-white/10 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
                    >
                        <Save size={16} /> Back
                    </button>
                </div>
            </header>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-black/20 p-4 rounded-xl border border-white/5">
                <div className="text-slate-400 text-xs uppercase tracking-wider">Người chơi</div>
                <div className="text-xl font-bold">{players.length}</div>
                <div className="text-slate-400 text-xs uppercase tracking-wider">Tổng điểm</div>
                <div className="text-xl font-bold flex items-center gap-2">
                    {players.reduce((sum, p) => sum + p.currentScore, 0)}
                    <span className="text-xs text-slate-500 font-normal">(= 0)</span>
                </div>
            </div>

            {/* Player Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {players.map(player => (
                    <PlayerCard
                        key={player.id}
                        player={player}
                        isWinner={players.length > 1 && player.currentScore === maxScore && maxScore > 0}
                        isLoser={players.length > 1 && player.currentScore === minScore && minScore < 0}
                        isLocked={isLocked}
                        scoreButtons={scoreButtons}
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
                            <span className="text-slate-400 font-medium group-hover:text-white">Thêm người chơi</span>
                        </>
                    ) : (
                        <form onSubmit={handleAddPlayer} className="w-full" onClick={e => e.stopPropagation()}>
                            <label className="block text-sm text-slate-400 mb-2">Tên người chơi</label>
                            <input
                                type="text"
                                value={newPlayerName}
                                onChange={e => setNewPlayerName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white mb-4 focus:outline-none focus:border-primary-500"
                                autoFocus
                                placeholder="Nhập tên..."
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-primary-500 text-black font-bold py-2 rounded">Thêm</button>
                                <button type="button" onClick={() => setShowAddPlayer(false)} className="flex-1 bg-white/10 text-white font-bold py-2 rounded">Huỷ</button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>

            {/* Settings Modal */}
            <AnimatePresence>
                {showSettings && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSettings(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Settings size={20} /> Cài đặt điểm
                                </h2>
                                <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <p className="text-slate-400 text-sm mb-4">
                                Tuỳ chỉnh giá trị 6 nút điểm. Dùng số âm cho trừ điểm, số dương cho cộng điểm.
                            </p>

                            <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6">
                                {editButtons.map((val, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <span className="text-slate-500 text-xs">Nút {i + 1}</span>
                                        <input
                                            type="number"
                                            value={val}
                                            onChange={e => {
                                                const next = [...editButtons];
                                                next[i] = e.target.value;
                                                setEditButtons(next);
                                            }}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-center font-bold focus:outline-none focus:border-primary-500 transition-colors"
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={resetDefaults}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-3 rounded-xl transition-colors text-sm"
                                >
                                    Mặc định
                                </button>
                                <button
                                    onClick={saveSettings}
                                    className="flex-[2] bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-slate-950 font-bold py-3 rounded-xl transition-all"
                                >
                                    Lưu cài đặt
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Layout>
    );
};
