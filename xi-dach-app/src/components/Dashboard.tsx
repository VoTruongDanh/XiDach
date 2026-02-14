import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Layout } from './Layout';
import { Plus, Trash2, Play, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';


export const Dashboard: React.FC<{ onCreateNew: () => void }> = ({ onCreateNew }) => {
    const { state, dispatch } = useGame();

    const handleResume = (sessionId: string) => {
        dispatch({ type: 'ACTIVATE_SESSION', payload: { sessionId } });
    };

    const handleDelete = (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this table?')) {
            dispatch({ type: 'DELETE_SESSION', payload: { sessionId } });
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 tracking-tight mb-2">
                        XI DÁCH
                    </h1>
                    <p className="text-slate-400">Game Dashboard</p>
                </div>

                <button
                    onClick={onCreateNew}
                    className="bg-primary-500 hover:bg-primary-400 text-slate-950 font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-primary-500/20"
                >
                    <Plus size={20} /> New Table
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active Sessions List */}
                {state.sessions.map((session) => (
                    <motion.div
                        key={session.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleResume(session.id)}
                        className="glass-panel p-6 cursor-pointer group hover:border-primary-500/50 transition-all relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl text-white group-hover:text-primary-400 transition-colors truncate pr-8">
                                    {session.name}
                                </h3>
                                <button
                                    onClick={(e) => handleDelete(session.id, e)}
                                    className="text-slate-500 hover:text-danger-500 p-2 -mr-2 -mt-2 rounded-full hover:bg-white/5 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-3 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{new Date(session.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={14} />
                                    <span>{session.players.length} Players</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-primary-500 font-medium">
                                <span>Total Score: {session.players.reduce((sum, p) => sum + p.currentScore, 0)}</span>
                                <Play size={16} className="transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Empty State */}
                {state.sessions.length === 0 && (
                    <div className="col-span-full text-center py-20 text-slate-500 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                        <p className="text-lg mb-4">No active tables found.</p>
                        <button
                            onClick={onCreateNew}
                            className="text-primary-500 hover:underline hover:text-primary-400 transition-colors"
                        >
                            Create your first table
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
};
