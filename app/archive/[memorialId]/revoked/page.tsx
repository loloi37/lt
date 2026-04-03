// app/archive/[memorialId]/revoked/page.tsx
'use client';

import { use } from 'react';
import Link from 'next/link';
import { ShieldOff, ArrowLeft, Home } from 'lucide-react';

export default function AccessRevokedPage({ params }: { params: Promise<{ memorialId: string }> }) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.memorialId;

    return (
        <div className="min-h-screen bg-surface-low flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center">
                {/* Solemn Icon */}
                <div className="w-20 h-20 bg-warm-muted/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldOff size={40} className="text-warm-dark/30" />
                </div>

                {/* Message */}
                <h1 className="font-serif text-3xl text-warm-dark mb-4">
                    Access Removed
                </h1>
                <p className="text-warm-dark/60 leading-relaxed mb-10 font-sans">
                    You no longer have permission to view this specific archive.
                    This can occur if the archive owner has updated member permissions or if the session has expired.
                </p>

                {/* Actions */}
                <div className="space-y-4">
                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 w-full py-4 bg-warm-dark text-surface-low rounded-xl font-medium shadow-lg hover:bg-warm-dark/90 transition-all active:scale-[0.98]"
                    >
                        <Home size={18} />
                        Return to my dashboard
                    </Link>

                    <Link
                        href="/contact"
                        className="flex items-center justify-center gap-2 w-full py-3 text-sm text-warm-dark/40 hover:text-warm-dark transition-colors font-serif italic"
                    >
                        Contact support if you believe this is an error
                    </Link>
                </div>

                {/* Identification for support */}
                <p className="mt-12 text-[10px] text-warm-dark/20 font-mono uppercase tracking-widest">
                    Ref ID: {memorialId.slice(0, 8)}
                </p>
            </div>
        </div>
    );
}