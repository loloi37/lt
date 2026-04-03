'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield, Check, X, MessageCircle,
    ImageIcon, ArrowLeft, Loader2,
    AlertTriangle, Clock
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useArchiveRole } from '../_hooks/useArchiveRole';
import { useRoleSync } from '../_hooks/useRoleSync';

interface PendingContribution {
    id: string;
    type: 'memory' | 'photo' | 'video';
    witness_name: string;
    contributor_email: string | null;
    content: {
        title?: string;
        content?: string;
        caption?: string;
        url?: string;
        relationship?: string;
        year?: string;
    };
    created_at: string;
    is_anonymous: boolean;
}

export default function StewardPage({
    params
}: {
    params: Promise<{ memorialId: string }>
}) {
    const { memorialId } = use(params);
    const router = useRouter();
    const supabase = createClient();

    const [contributions, setContributions] =
        useState<PendingContribution[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] =
        useState<string | null>(null);
    const [error, setError] = useState<string | null>(
        null
    );

    const { data: roleData, loading: roleLoading } =
        useArchiveRole(memorialId);

    useRoleSync(memorialId, roleData?.currentUserId || '', roleData?.userRole || 'witness');

    // Access control: only owners and co-guardians can review
    useEffect(() => {
        if (roleLoading || !roleData) return;
        if (
            roleData.userRole !== 'owner' &&
            roleData.userRole !== 'co_guardian'
        ) {
            router.push(`/archive/${memorialId}`);
        }
    }, [roleData, roleLoading, memorialId, router]);

    // Load pending contributions + subscribe to real-time changes
    useEffect(() => {
        loadPending();

        const channel = supabase
            .channel(`steward-${memorialId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'memorial_contributions',
                    filter: `memorial_id=eq.${memorialId}`,
                },
                () => { loadPending(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [memorialId]);

    const loadPending = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memorial_contributions')
            .select('*')
            .eq('memorial_id', memorialId)
            .eq('status', 'pending_approval')
            .order('created_at', { ascending: true });

        if (error) setError(error.message);
        else setContributions(data || []);
        setLoading(false);
    };

    const handleDecision = async (
        id: string,
        decision: 'approved' | 'rejected'
    ) => {
        setProcessing(id);
        try {
            const { error } = await supabase
                .from('memorial_contributions')
                .update({ status: decision })
                .eq('id', id);

            if (error) throw error;

            // Remove from local state immediately
            setContributions(prev =>
                prev.filter(c => c.id !== id)
            );
        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="min-h-screen bg-surface-low">

            {/* Header */}
            <div className="border-b border-warm-border/20
        bg-white sticky top-0 z-10">
                <div className="max-w-3xl mx-auto
          px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() =>
                            router.push(`/archive/${memorialId}`)
                        }
                        className="p-2 hover:bg-warm-border/10
              rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20}
                            className="text-warm-dark/60" />
                    </button>
                    <div>
                        <h1 className="font-serif text-xl
              text-warm-dark">
                            Review Queue
                        </h1>
                        {!loading && (
                            <p className="text-xs
                text-warm-dark/40 font-sans">
                                {contributions.length === 0
                                    ? 'All clear'
                                    : `${contributions.length} awaiting your decision`}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10">

                {(loading || roleLoading) ? (
                    <div className="flex justify-center py-20">
                        <Loader2 size={32}
                            className="text-olive animate-spin" />
                    </div>
                ) : error ? (
                    <div className="p-4 bg-red-50
            border border-red-200 rounded-xl">
                        <p className="text-sm text-red-700
              font-sans">{error}</p>
                    </div>
                ) : contributions.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-olive/10
              rounded-full flex items-center
              justify-center mx-auto mb-4">
                            <Check size={32}
                                className="text-olive" />
                        </div>
                        <h2 className="font-serif text-2xl
              text-warm-dark mb-2">
                            All clear
                        </h2>
                        <p className="text-sm text-warm-dark/40
              font-sans">
                            No contributions are waiting
                            for review.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {contributions.map(c => (
                            <ContributionCard
                                key={c.id}
                                contribution={c}
                                processing={processing === c.id}
                                onApprove={() =>
                                    handleDecision(c.id, 'approved')
                                }
                                onReject={() =>
                                    handleDecision(c.id, 'rejected')
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ContributionCard({
    contribution: c,
    processing,
    onApprove,
    onReject
}: {
    contribution: PendingContribution;
    processing: boolean;
    onApprove: () => void;
    onReject: () => void;
}) {
    const [showRejectConfirm, setShowRejectConfirm] =
        useState(false);

    const timeAgo = (() => {
        const diff = Date.now() -
            new Date(c.created_at).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    })();

    return (
        <div className="bg-white border border-warm-border/30
      rounded-2xl overflow-hidden shadow-sm">

            {/* Card header */}
            <div className="px-6 pt-6 pb-4
        border-b border-warm-border/20">
                <div className="flex items-start
          justify-between gap-4">
                    <div>
                        <div className="flex items-center
              gap-2 mb-1">
                            {c.type === 'memory'
                                ? <MessageCircle size={14}
                                    className="text-warm-dark/40" />
                                : <ImageIcon size={14}
                                    className="text-warm-dark/40" />
                            }
                            <span className="text-xs
                text-warm-dark/40 uppercase
                tracking-wider font-sans">
                                {c.type}
                            </span>
                        </div>
                        <h3 className="font-serif text-lg
              text-warm-dark">
                            {c.content.title || 'Untitled'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5
            text-xs text-warm-dark/30
            flex-shrink-0 font-sans">
                        <Clock size={12} />
                        {timeAgo}
                    </div>
                </div>

                {/* Contributor */}
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-6 h-6 bg-warm-border/30
            rounded-full flex items-center
            justify-center flex-shrink-0">
                        <span className="text-xs
              text-warm-dark/50 font-serif">
                            {c.witness_name.charAt(0)}
                        </span>
                    </div>
                    <p className="text-xs text-warm-dark/50
            font-sans">
                        <strong>{c.witness_name}</strong>
                        {c.content.relationship && (
                            <span className="text-warm-dark/30">
                                {' '}· {c.content.relationship}
                            </span>
                        )}
                        {c.is_anonymous && (
                            <span className="ml-1.5 px-1.5 py-0.5
                bg-warm-border/30 text-warm-dark/30
                rounded text-[10px]">
                                no account
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Content preview */}
            <div className="px-6 py-5">
                {c.type === 'memory' && c.content.content && (
                    <p className="font-serif text-warm-dark/70
            text-base leading-relaxed line-clamp-4">
                        {c.content.content}
                    </p>
                )}

                {c.type === 'photo' && c.content.url && (
                    <div className="space-y-3">
                        <img
                            src={c.content.url}
                            alt={c.content.caption || 'Photo'}
                            className="w-full max-h-64
                object-cover rounded-xl
                border border-warm-border/30"
                        />
                        {c.content.caption && (
                            <p className="text-sm
                text-warm-dark/60 font-sans italic">
                                "{c.content.caption}"
                                {c.content.year && (
                                    <span className="not-italic
                    text-warm-dark/30 ml-2">
                                        {c.content.year}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-6 pb-6">
                {!showRejectConfirm ? (
                    <div className="flex gap-3">
                        <button
                            onClick={onApprove}
                            disabled={processing}
                            className="flex-1 py-3 bg-olive
                hover:bg-olive/90 text-white
                rounded-xl font-medium text-sm
                transition-all flex items-center
                justify-center gap-2
                font-sans disabled:opacity-50"
                        >
                            {processing ? (
                                <Loader2 size={16}
                                    className="animate-spin" />
                            ) : (
                                <Check size={16} />
                            )}
                            Honor this contribution
                        </button>
                        <button
                            onClick={() =>
                                setShowRejectConfirm(true)
                            }
                            disabled={processing}
                            className="px-5 py-3 border
                border-warm-border/40 text-warm-dark/50
                rounded-xl text-sm transition-all
                hover:bg-warm-border/10 font-sans
                disabled:opacity-50"
                        >
                            Set aside with care
                        </button>
                    </div>
                ) : (
                    <div className="bg-warm-border/10 rounded-xl
            p-4 space-y-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle size={14}
                                className="text-warm-muted mt-0.5
                  flex-shrink-0" />
                            <p className="text-sm text-warm-dark/60
                font-sans leading-relaxed">
                                This contribution won't appear in
                                the archive. The contributor won't
                                be notified.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() =>
                                    setShowRejectConfirm(false)
                                }
                                className="flex-1 py-2.5 border
                  border-warm-border/40 rounded-lg text-sm
                  text-warm-dark/50 hover:bg-warm-border/10
                  transition-all font-sans"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onReject}
                                disabled={processing}
                                className="flex-1 py-2.5
                  bg-warm-dark/10 rounded-lg text-sm
                  text-warm-dark/60 hover:bg-warm-dark/20
                  transition-all font-sans
                  disabled:opacity-50 flex items-center
                  justify-center gap-2"
                            >
                                {processing ? (
                                    <Loader2 size={14}
                                        className="animate-spin" />
                                ) : (
                                    <X size={14} />
                                )}
                                I understand
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
