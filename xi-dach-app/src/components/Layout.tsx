import React from 'react';
import { cn } from '../lib/utils';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-primary-500/30 relative overflow-hidden">
            {/* Background Gradients/Glows */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[128px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

            {/* Content */}
            <div className={cn("relative z-10 container mx-auto px-4 py-6 max-w-5xl", className)}>
                {children}
            </div>
        </div>
    );
};
