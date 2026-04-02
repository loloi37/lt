'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import type { SmartUpsellState } from '@/hooks/useSmartUpsell';

interface SmartUpsellBannerProps {
  upsell: SmartUpsellState;
}

export function SmartUpsellBanner({ upsell }: SmartUpsellBannerProps) {
  if (!upsell.shouldShow) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm animate-fade-in-up">
      <div className="bg-white border border-warm-border/30 rounded-xl shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={upsell.dismiss}
          className="absolute top-3 right-3 p-1 text-warm-outline hover:text-warm-dark transition-colors rounded-lg hover:bg-surface-mid"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Message */}
        <p className="font-serif text-lg text-warm-dark mb-3 pr-6 leading-snug">
          Invite your loved ones to contribute
        </p>
        <p className="text-sm text-warm-muted font-sans leading-relaxed mb-5">
          Would you like to invite your loved ones to contribute as well?
          Upgrade to the Family plan to create an even richer shared memory.
        </p>

        {/* Primary action */}
        <Link
          href="/choice-pricing"
          className="block w-full text-center py-2.5 glass-btn-primary text-sm font-sans font-medium rounded-lg mb-3"
        >
          Explore Family Plan
        </Link>

        {/* Secondary controls */}
        <div className="flex items-center justify-between text-xs font-sans">
          <button
            onClick={upsell.remindLater}
            className="text-warm-muted hover:text-warm-dark transition-colors"
          >
            Remind me later
          </button>
          <button
            onClick={upsell.dontShowAgain}
            className="text-warm-outline hover:text-warm-dark transition-colors"
          >
            Don&apos;t show again
          </button>
        </div>
      </div>
    </div>
  );
}
