// components/wizard/PathCard.tsx
// Emotional state-aware path cards with depth-based visual evolution
'use client';

import { PathId, PathStatus } from '@/types/paths';
import { EmotionalState, DepthLevel } from '@/lib/emotionalState';
import { Lock, Circle } from 'lucide-react';

interface PathCardProps {
    id: PathId;
    title: string;
    subtitle?: string;
    description: string;
    status: PathStatus;
    onClick: (id: PathId) => void;
    emotionalState?: EmotionalState;
    depth?: DepthLevel;
}

export default function PathCard({ id, title, subtitle, description, status, onClick, emotionalState = 'void', depth = 'untouched' }: PathCardProps) {
    const isLocked = status === 'locked';

    // Visual evolution based on emotional state and depth
    const depthStyles: Record<DepthLevel, string> = {
        untouched: 'border-warm-border/20 bg-white hover:border-warm-dark/15 hover:shadow-sm',
        shallow: 'border-warm-border/30 bg-white hover:border-olive/30 hover:shadow-md',
        meaningful: 'border-olive/25 bg-olive/[0.02] hover:border-olive/40 hover:shadow-md',
        embodied: 'border-warm-dark/15 bg-olive/[0.03] hover:shadow-lg',
    };

    const statusLabel: Record<DepthLevel, string> = {
        untouched: 'Awaiting your voice',
        shallow: 'Their story stirs',
        meaningful: 'Growing deeper',
        embodied: 'Honored',
    };

    const circleStyle: Record<DepthLevel, { fill: boolean; color: string }> = {
        untouched: { fill: false, color: 'text-warm-border/40' },
        shallow: { fill: true, color: 'text-warm-dark/20' },
        meaningful: { fill: true, color: 'text-olive/40' },
        embodied: { fill: true, color: 'text-warm-dark/50' },
    };

    const effectiveDepth = isLocked ? 'untouched' : depth;
    const circle = circleStyle[effectiveDepth];

    return (
        <button
            disabled={isLocked}
            onClick={() => onClick(id)}
            className={`relative w-full p-8 rounded-2xl border transition-all duration-500 text-left flex flex-col h-full ${
                isLocked
                    ? 'opacity-50 cursor-not-allowed border-warm-border/20 bg-warm-border/5'
                    : depthStyles[effectiveDepth]
            }`}
        >
            {/* Depth indicator */}
            <div className="flex justify-between items-start mb-6">
                <div className={`p-2 rounded-full transition-all duration-500 ${
                    isLocked ? 'bg-warm-border/10' : effectiveDepth === 'embodied' ? 'bg-olive/8' : 'bg-warm-border/10'
                }`}>
                    {isLocked ? (
                        <Lock className="text-warm-dark/25" size={18} />
                    ) : (
                        <Circle
                            className={`${circle.color} transition-all duration-500`}
                            size={18}
                            fill={circle.fill ? 'currentColor' : 'none'}
                            strokeWidth={circle.fill ? 0 : 1.5}
                        />
                    )}
                </div>
            </div>

            <h3 className="font-serif text-2xl text-warm-dark mb-1">{title}</h3>
            {subtitle && (
                <p className="text-xs text-warm-dark/30 italic mb-3 tracking-wide">{subtitle}</p>
            )}
            <p className="text-sm text-warm-dark/50 leading-relaxed mb-8 flex-1">{description}</p>

            <div className="mt-auto pt-4 border-t border-warm-border/15 flex items-center justify-between">
                <span className="text-xs text-warm-dark/30 transition-all duration-500">
                    {isLocked ? 'Explore two other paths to reveal' : `${statusLabel[effectiveDepth]} \u2192`}
                </span>
            </div>
        </button>
    );
}
