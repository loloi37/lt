// components/role/AccessRequestButton.tsx
'use client';

import { useState } from 'react';
import { Lock, Check, Loader2, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface AccessRequestButtonProps {
    memorialId: string;
    memorialName: string;
}

export default function AccessRequestButton({ memorialId, memorialName }: AccessRequestButtonProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent'>('idle');

    const handleRequest = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation if the button is inside a card

        setStatus('loading');
        try {
            const res = await fetch(`/api/memorials/${memorialId}/access-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ requestMessage: `I would like to help build the memorial for ${memorialName}.` }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send request');
            }

            setStatus('sent');
            toast.success('Access request sent to the owner', {
                icon: '🛡️',
                style: { borderRadius: '12px', background: '#393830', color: '#fff' }
            });
        } catch (err: any) {
            setStatus('idle');
            toast.error(err.message);
        }
    };

    if (status === 'sent') {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-olive/10 border border-olive/20 rounded-lg">
                <Check size={14} className="text-olive" />
                <span className="text-xs text-olive font-serif italic">
                    Request sent — awaiting approval
                </span>
            </div>
        );
    }

    return (
        <button
            onClick={handleRequest}
            disabled={status === 'loading'}
            className="group relative flex items-center gap-2 px-4 py-2 bg-warm-dark text-surface-low rounded-lg text-xs font-medium transition-all hover:bg-warm-dark/90 active:scale-95 disabled:opacity-50"
        >
            {status === 'loading' ? (
                <Loader2 size={14} className="animate-spin" />
            ) : (
                <Lock size={14} className="text-olive group-hover:rotate-12 transition-transform" />
            )}
            <span>Request Access to {memorialName}</span>
        </button>
    );
}