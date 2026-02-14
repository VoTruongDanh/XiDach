import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Layout } from './Layout';
import { Play, Users } from 'lucide-react';

interface EventSetupProps {
    onCancel: () => void;
    hasHistory: boolean;
}

export const EventSetup: React.FC<EventSetupProps> = ({ onCancel, hasHistory }) => {
    const { dispatch } = useGame();

    // Initialize state from localStorage if available
    const [eventName, setEventName] = useState(() => localStorage.getItem('v3_setup_eventName') || '');
    const [initialPlayers, setInitialPlayers] = useState(() => localStorage.getItem('v3_setup_initialPlayers') || '');

    // Save to localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('v3_setup_eventName', eventName);
    }, [eventName]);

    React.useEffect(() => {
        localStorage.setItem('v3_setup_initialPlayers', initialPlayers);
    }, [initialPlayers]);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventName.trim()) return;

        // Create Session
        // Regex divides by newline or comma
        const playersList = initialPlayers.split(/[\n,]+/).map(p => p.trim()).filter(Boolean);

        dispatch({
            type: 'CREATE_SESSION',
            payload: {
                name: eventName,
                initialPlayers: playersList
            }
        });

        // Clear form for next time
        setEventName('');
        setInitialPlayers('');
        localStorage.removeItem('v3_setup_eventName');
        localStorage.removeItem('v3_setup_initialPlayers');
    };

    return (
        <Layout className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-primary-600 mb-4 tracking-tight">
                    XI DÁCH
                </h1>
                <p className="text-slate-400 text-lg">Next-gen Scorekeeper</p>
            </div>

            <div className="w-full max-w-md glass-panel p-8 animate-in fade-in zoom-in duration-500">
                <form onSubmit={handleStart} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 uppercase tracking-wider">Table Name</label>
                        <input
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            placeholder="e.g. Lunar New Year 2026"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all text-lg"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Users size={16} /> Initial Players (1 name per line)
                        </label>
                        <textarea
                            value={initialPlayers}
                            onChange={(e) => setInitialPlayers(e.target.value)}
                            placeholder="Tuan&#10;Huy&#10;Lan"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all min-h-[150px] leading-relaxed"
                        />
                    </div>

                    <div className="flex gap-3">
                        {hasHistory && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-slate-300 font-bold py-4 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!eventName.trim()}
                            className="flex-[2] bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            <Play size={20} fill="currentColor" />
                            CREATE TABLE
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};
