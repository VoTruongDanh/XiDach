import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { Layout } from './Layout';
import { Play, Users } from 'lucide-react';

export const EventSetup: React.FC = () => {
    const { dispatch } = useGame();

    // Initialize state from localStorage if available
    const [eventName, setEventName] = useState(() => localStorage.getItem('v2_setup_eventName') || '');
    const [initialPlayers, setInitialPlayers] = useState(() => localStorage.getItem('v2_setup_initialPlayers') || '');

    // Save to localStorage whenever state changes
    React.useEffect(() => {
        localStorage.setItem('v2_setup_eventName', eventName);
    }, [eventName]);

    React.useEffect(() => {
        localStorage.setItem('v2_setup_initialPlayers', initialPlayers);
    }, [initialPlayers]);

    const handleStart = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventName.trim()) return;

        // Start Event
        dispatch({ type: 'START_EVENT', payload: { name: eventName } });

        // Add Players - Split by newline OR comma
        // Regex: /[\n,]+/ handles both newlines and commas
        const players = initialPlayers.split(/[\n,]+/).map(p => p.trim()).filter(Boolean);

        players.forEach(name => {
            dispatch({ type: 'ADD_PLAYER', payload: { name } });
        });
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

                    <button
                        type="submit"
                        disabled={!eventName.trim()}
                        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-400 hover:to-primary-500 text-slate-950 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        <Play size={20} fill="currentColor" />
                        START GAME
                    </button>
                </form>
            </div>
        </Layout>
    );
};
