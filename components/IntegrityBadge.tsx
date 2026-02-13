'use client';

import { ShieldCheck } from 'lucide-react';

interface IntegrityBadgeProps {
    hash?: string;
    className?: string;
}

export default function IntegrityBadge({ hash, className = '' }: IntegrityBadgeProps) {
    if (!hash) return null;

    const shortHash = hash.substring(0, 8) + '...';

    return (
        <div className={`absolute top-2 left-2 z-20 group ${className}`}>
            {/* The Badge Icon */}
            <div className="bg-white/90 backdrop-blur-sm text-sage p-1.5 rounded-full shadow-sm border border-sage/20 cursor-help transition-transform hover:scale-110">
                <ShieldCheck size={14} />
            </div>

            {/* The Tooltip (appears on hover) */}
            <div className="absolute top-0 left-8 w-64 bg-charcoal text-ivory text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none translate-x-2 group-hover:translate-x-0 duration-200">
                <p className="font-semibold mb-1 flex items-center gap-1">
                    <ShieldCheck size={12} /> Authenticity Verified
                </p>
                <p className="opacity-80 leading-relaxed">
                    This media is cryptographically signed.
                </p>
                <div className="mt-2 pt-2 border-t border-white/10 font-mono text-[10px] opacity-60 break-all">
                    SHA-256: {hash}
                </div>
            </div>
        </div>
    );
}