// components/SaveIndicator.tsx
// Shows auto-save status: idle, saving, saved, error
// Place this in your wizard header/toolbar area

'use client';

import { Cloud, CloudOff, Check, Loader2, AlertTriangle } from 'lucide-react';
import { SaveStatus } from '@/hooks/useAutoSave';

interface SaveIndicatorProps {
    status: SaveStatus;
    lastSavedAt: Date | null;
    error: string | null;
    onRetry?: () => void;
}

export default function SaveIndicator({ status, lastSavedAt, error, onRetry }: SaveIndicatorProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex items-center gap-2 text-xs">
            {status === 'idle' && lastSavedAt && (
                <div className="flex items-center gap-1.5 text-charcoal/40 transition-opacity">
                    <Cloud size={14} />
                    <span>Saved at {formatTime(lastSavedAt)}</span>
                </div>
            )}

            {status === 'idle' && !lastSavedAt && (
                <div className="flex items-center gap-1.5 text-charcoal/30">
                    <Cloud size={14} />
                    <span>Auto-save active</span>
                </div>
            )}

            {status === 'saving' && (
                <div className="flex items-center gap-1.5 text-mist animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                </div>
            )}

            {status === 'saved' && (
                <div className="flex items-center gap-1.5 text-mist transition-opacity">
                    <Check size={14} />
                    <span>All changes saved</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-1.5 text-stone">
                    <AlertTriangle size={14} />
                    <span>Save failed</span>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="underline hover:text-stone/80 transition-colors ml-1"
                        >
                            Retry
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}