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
                <div className="flex items-center gap-1.5 text-charcoal/25 transition-opacity">
                    <Loader2 size={12} className="animate-spin" />
                </div>
            )}

            {status === 'saved' && (
                <div className="flex items-center gap-1.5 text-charcoal/30 animate-fadeIn">
                    <Check size={12} />
                    <span>Saved</span>
                </div>
            )}

            {status === 'offline' && (
                <div className="flex items-center gap-1.5 text-charcoal/25">
                    <WifiOff size={12} />
                    <span>Saved locally</span>
                </div>
            )}

            {status === 'reconnected' && (
                <div className="flex items-center gap-1.5 text-mist/60 animate-fadeIn">
                    <Check size={12} />
                    <span>Connection restored. Your changes have been saved.</span>
                </div>
            )}

            {status === 'error' && (
                <div className="flex items-center gap-1.5 text-stone/60">
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
