// components/wizard/PathCard.tsx
// Step 1.3.2 + 1.3.3: Redesigned as contemplation card with poetic language
import { PathId, PathStatus } from '@/types/paths';
import { Lock, Circle } from 'lucide-react';

interface PathCardProps {
    id: PathId;
    title: string;
    subtitle?: string;
    description: string;
    status: PathStatus;
    onClick: (id: PathId) => void;
}

export default function PathCard({ id, title, subtitle, description, status, onClick }: PathCardProps) {
    const isLocked = status === 'locked';

    const statusStyles = {
        locked: "opacity-50 cursor-not-allowed border-sand/20 bg-sand/5",
        empty: "border-sand/30 bg-white hover:border-charcoal/20 hover:shadow-md",
        in_progress: "border-mist/30 bg-white hover:border-mist/50 hover:shadow-md",
        completed: "border-charcoal/15 bg-white hover:shadow-md"
    };

    // Step 1.3.1: Qualitative status — filled/empty circles, no percentages
    const statusLabel = {
        locked: 'Explore two other paths to reveal',
        empty: 'A path to discover',
        in_progress: 'Path begun',
        completed: 'Path traveled',
    };

    return (
        <button
            disabled={isLocked}
            onClick={() => onClick(id)}
            className={`relative w-full p-8 rounded-2xl border transition-all text-left flex flex-col h-full ${statusStyles[status]}`}
        >
            {/* Step 1.3.1: Simple circle indicator instead of gamified icons */}
            <div className="flex justify-between items-start mb-6">
                <div className={`p-2 rounded-full ${isLocked ? 'bg-sand/10' : status === 'completed' ? 'bg-charcoal/5' : 'bg-sand/10'}`}>
                    {status === 'locked' ? (
                        <Lock className="text-charcoal/25" size={18} />
                    ) : (
                        <Circle
                            className={status === 'completed' ? 'text-charcoal/40' : status === 'in_progress' ? 'text-mist/50' : 'text-sand/60'}
                            size={18}
                            fill={status === 'completed' ? 'currentColor' : status === 'in_progress' ? 'currentColor' : 'none'}
                            strokeWidth={status === 'empty' ? 1.5 : 0}
                        />
                    )}
                </div>
            </div>

            <h3 className="font-serif text-2xl text-charcoal mb-1">{title}</h3>
            {/* Step 1.3.3: Poetic subtitle */}
            {subtitle && (
                <p className="text-xs text-charcoal/30 italic mb-3 tracking-wide">{subtitle}</p>
            )}
            <p className="text-sm text-charcoal/50 leading-relaxed mb-8 flex-1">{description}</p>

            {/* Step 1.3.2: "Step inside" instead of gamified language */}
            <div className="mt-auto pt-4 border-t border-sand/15 flex items-center justify-between">
                <span className="text-xs text-charcoal/30">
                    {isLocked ? statusLabel.locked : `${statusLabel[status]} \u2192`}
                </span>
            </div>
        </button>
    );
}
