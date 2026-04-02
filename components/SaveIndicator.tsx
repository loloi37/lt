// components/SaveIndicator.tsx
// Step 1.1.3: Minimal, silent auto-save indicator
// Shows status briefly then disappears. Never intrusive.

'use client';

import { Check, Loader2, WifiOff } from 'lucide-react';
import { SaveStatus } from '@/hooks/useAutoSave';

interface SaveIndicatorProps {
    status: SaveStatus;
    lastSavedAt: Date | null;
    error: string | null;
    onRetry?: () => void;
}

export default function SaveIndicator({ status, lastSavedAt, error, onRetry }: SaveIndicatorProps) {
    // Step 1.1.3: Most of the time, show nothing. The save is silent.
    if (status === 'idle') return null;

    return (
        <div className="flex items-center gap-1.5 text-xs">
            {status === 'saving' && (
                <div className="flex items-center gap-1.5 text-warm-outline transition-opacity">
                    <Loader2 size={12} className="animate-spin" />
                </div>
            )}

            {status === 'saved' && (
                <div className="flex items-center gap-1.5 text-warm-outline animate-fadeIn">
                    <Check size={12} />
                    <span>Preserved</span>
                </div>
            )}

            {status === 'offline' && (
                <div className="flex items-center gap-1.5 text-warm-outline">
                    <WifiOff size={12} />
                    <span>Held safely</span>
                </div>
            )}

            {status === 'reconnected' && (
                <div className="flex items-center gap-1.5 text-olive/60 animate-fadeIn">
                    <Check size={12} />
                    <span>Reconnected. Everything is preserved.</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-1.5 text-warm-brown/60">
                    <span>Could not preserve</span>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="underline hover:text-warm-brown/80 transition-colors ml-1"
                        >
                            Try again
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
