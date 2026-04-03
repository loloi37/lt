// app/archive/[memorialId]/_components/RoleBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function RoleBanner() {
    const [changeInfo, setChangeInfo] = useState<{ newRole: string } | null>(null);

    useEffect(() => {
        const handleRoleChange = (e: any) => {
            setChangeInfo({ newRole: e.detail.newRole });
        };

        window.addEventListener('ulumae:role-changed', handleRoleChange);
        return () => window.removeEventListener('ulumae:role-changed', handleRoleChange);
    }, []);

    if (!changeInfo) return null;

    return (
        <div className="fixed top-0 inset-x-0 z-[100] animate-fadeIn">
            <div className="bg-warm-dark text-surface-low px-6 py-3 shadow-2xl flex items-center justify-between border-b border-olive/30">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-warm-brown/20 rounded-full flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-warm-brown" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">
                            ROLE UPDATED: You are now a <span className="capitalize text-olive">{changeInfo.newRole}</span> on this archive.
                        </p>
                        <p className="text-xs text-surface-low/50">
                            Your permissions have been updated. Please reload the page to continue.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 bg-olive hover:bg-olive/90 text-surface-low rounded-lg text-sm font-medium transition-all shadow-md active:scale-95"
                >
                    <RefreshCw size={16} />
                    Reload to apply
                </button>
            </div>
        </div>
    );
}