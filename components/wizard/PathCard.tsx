// components/wizard/PathCard.tsx
import { PathId, PathStatus } from '@/types/paths';
import { Lock, CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface PathCardProps {
    id: PathId;
    title: string;
    description: string;
    status: PathStatus;
    onClick: (id: PathId) => void;
}

export default function PathCard({ id, title, description, status, onClick }: PathCardProps) {
    const isLocked = status === 'locked';

    const statusStyles = {
        locked: "opacity-50 cursor-not-allowed border-sand/20 bg-sand/5",
        empty: "border-sand/40 bg-white hover:border-mist/60 hover:shadow-md",
        in_progress: "border-mist/40 bg-mist/5 hover:border-mist/60 hover:shadow-md",
        completed: "border-mist bg-white hover:shadow-md"
    };

    return (
        <button
            disabled={isLocked}
            onClick={() => onClick(id)}
            className={`relative w-full p-8 rounded-2xl border-2 transition-all text-left flex flex-col h-full ${statusStyles[status]}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-xl ${isLocked ? 'bg-sand/20' : 'bg-ivory'}`}>
                    {status === 'completed' && <CheckCircle className="text-mist" size={24} />}
                    {status === 'in_progress' && <PlayCircle className="text-mist" size={24} />}
                    {status === 'empty' && <Circle className="text-sand" size={24} />}
                    {status === 'locked' && <Lock className="text-charcoal/40" size={24} />}
                </div>
                {status === 'completed' && (
                    <span className="text-[10px] uppercase tracking-widest text-mist font-bold">Chapter Complete</span>
                )}
            </div>

            <h3 className="font-serif text-2xl text-charcoal mb-2">{title}</h3>
            <p className="text-sm text-charcoal/60 leading-relaxed mb-8 flex-1">{description}</p>

            <div className="mt-auto pt-4 border-t border-sand/20 flex items-center justify-between">
                <span className="text-xs font-medium text-charcoal/40">
                    {isLocked ? "Complete 2 other paths to unlock" : "Step inside →"}
                </span>
            </div>
        </button>
    );
}