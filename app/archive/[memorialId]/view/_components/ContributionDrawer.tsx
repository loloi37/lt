'use client';
import { useState, useEffect } from 'react';
import {
    X, Check, MessageCircle,
    ImageIcon, Clock, AlertTriangle,
    Loader2, Shield, ChevronDown
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
    useDrawer,
    PendingContribution,
    DrawerSection
} from '../_context/DrawerContext';

const SECTION_LABELS: Record<DrawerSection, string> = {
    biography: 'Biography',
    photos: 'Photos',
    memories: 'Memories',
    videos: 'Videos',
    all: 'All contributions'
};

export default function ContributionDrawer({
    memorialId
}: {
    memorialId: string
}) {
    const {
        isOpen, activeSection,
        contributions, closeDrawer,
        removeContribution
    } = useDrawer();

    const [processing, setProcessing] =
        useState<string | null>(null);
    const [error, setError] =
        useState<string | null>(null);

    const supabase = createClient();

    // Filter to active section
    const visible = contributions.filter(c => {
        if (!activeSection || activeSection === 'all')
            return true;
        if (activeSection === 'memories')
            return c.type === 'memory';
        if (activeSection === 'photos')
            return c.type === 'photo';
        if (activeSection === 'videos')
            return c.type === 'video';
        return true;
    });

    const handleDecision = async (
        id: string,
        decision: 'approved' | 'rejected'
    ) => {
        setProcessing(id);
        setError(null);
        try {
            const { error: err } = await supabase
                .from('memorial_contributions')
                .update({ status: decision })
                .eq('id', id);
            if (err) throw err;
            removeContribution(id);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setProcessing(null);
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-warm-dark/20
          backdrop-blur-sm z-40 transition-opacity
          duration-300 ${isOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeDrawer}
            />

            {/* Drawer panel */}
            <div className={`fixed right-0 top-0 h-full
        w-full max-w-md bg-surface-low border-l
        border-warm-border/30 shadow-2xl z-50
        transition-transform duration-300
        ease-in-out flex flex-col ${isOpen
                    ? 'translate-x-0'
                    : 'translate-x-full'
                }`}
            >
                {/* Drawer header */}
                <div className="border-b border-warm-border/20
          bg-white px-6 py-5 flex items-center
          justify-between flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-2">
                            <Shield size={16}
                                className="text-warm-muted" />
                            <h2 className="font-serif text-lg
                text-warm-dark">
                                Review
                            </h2>
                        </div>
                        {activeSection && (
                            <p className="text-xs text-warm-dark/40
                font-sans mt-0.5">
                                {SECTION_LABELS[activeSection]}
                                {' · '}
                                {visible.length} pending
                            </p>
                        )}
                    </div>
                    <button
                        onClick={closeDrawer}
                        className="p-2 hover:bg-warm-border/10
              rounded-lg transition-colors"
                    >
                        <X size={20}
                            className="text-warm-dark/50" />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-4 mt-4 p-3
            bg-red-50 border border-red-200
            rounded-xl">
                        <p className="text-xs text-red-700
              font-sans">{error}</p>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-y-auto
          p-4 space-y-4">
                    {visible.length === 0 ? (
                        <div className="flex flex-col
              items-center justify-center h-full
              text-center py-20">
                            <div className="w-14 h-14 bg-olive/10
                rounded-full flex items-center
                justify-center mb-4">
                                <Check size={28}
                                    className="text-olive" />
                            </div>
                            <p className="font-serif text-lg
                text-warm-dark mb-1">
                                All clear
                            </p>
                            <p className="text-xs
                text-warm-dark/40 font-sans">
                                No pending contributions here.
                            </p>
                        </div>
                    ) : (
                        visible.map(c => (
                            <DrawerCard
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
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Drawer Card ──────────────────────────────────

function DrawerCard({
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
    const [expanded, setExpanded] = useState(true);
    const [confirmReject, setConfirmReject] =
        useState(false);

    const timeAgo = (() => {
        const diff = Date.now() -
            new Date(c.created_at).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        return `${days}d ago`;
    })();

    return (
        <div className="bg-white rounded-2xl
      border border-warm-border/30 overflow-hidden
      shadow-sm">

            {/* Card header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-5 pt-5 pb-4
          flex items-start justify-between gap-3
          text-left hover:bg-warm-border/5 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center
            gap-2 mb-1">
                        {c.type === 'memory'
                            ? <MessageCircle size={12}
                                className="text-warm-dark/30" />
                            : <ImageIcon size={12}
                                className="text-warm-dark/30" />
                        }
                        <span className="text-[10px]
              text-warm-dark/30 uppercase
              tracking-wider font-sans">
                            {c.type}
                        </span>
                        <span className="text-[10px]
              text-warm-dark/25 font-sans">
                            · {timeAgo}
                        </span>
                    </div>
                    <p className="font-serif text-base
            text-warm-dark leading-snug truncate">
                        {c.content.title || 'Untitled'}
                    </p>
                    <p className="text-xs text-warm-dark/40
            font-sans mt-0.5">
                        {c.witness_name}
                        {c.content.relationship && (
                            <span className="text-warm-dark/25">
                                {' · '}{c.content.relationship}
                            </span>
                        )}
                        {c.is_anonymous && (
                            <span className="ml-1.5 px-1.5 py-0.5
                bg-warm-border/30 text-warm-dark/30
                rounded text-[9px]">
                                no account
                            </span>
                        )}
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-warm-dark/30 flex-shrink-0
            mt-1 transition-transform ${expanded
                            ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {/* Expandable content */}
            {expanded && (
                <div className="px-5 pb-5 space-y-4">

                    {/* Content preview */}
                    <div className="bg-warm-border/10 rounded-xl p-4">
                        {c.type === 'memory' && c.content.content && (
                            <p className="font-serif text-sm
                text-warm-dark/70 leading-relaxed
                line-clamp-6">
                                {c.content.content}
                            </p>
                        )}
                        {c.type === 'photo' && c.content.url && (
                            <div className="space-y-2">
                                <img
                                    src={c.content.url}
                                    alt={c.content.caption || 'Photo'}
                                    className="w-full max-h-48
                    object-cover rounded-lg
                    border border-warm-border/30"
                                />
                                {c.content.caption && (
                                    <p className="text-xs italic
                    text-warm-dark/50 font-sans">
                                        "{c.content.caption}"
                                        {c.content.year && (
                                            <span className="not-italic
                        text-warm-dark/30 ml-1">
                                                {c.content.year}
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {!confirmReject ? (
                        <div className="flex gap-2">
                            <button
                                onClick={onApprove}
                                disabled={processing}
                                className="flex-1 py-2.5
                  bg-olive hover:bg-olive/90
                  text-white rounded-xl text-sm
                  font-medium transition-all
                  flex items-center justify-center
                  gap-1.5 font-sans
                  disabled:opacity-50"
                            >
                                {processing
                                    ? <Loader2 size={14}
                                        className="animate-spin" />
                                    : <Check size={14} />
                                }
                                Approve
                            </button>
                            <button
                                onClick={() => setConfirmReject(true)}
                                disabled={processing}
                                className="px-4 py-2.5 border
                  border-warm-border/40 text-warm-dark/50
                  rounded-xl text-sm transition-all
                  hover:bg-warm-border/10 font-sans
                  disabled:opacity-50"
                            >
                                Decline
                            </button>
                        </div>
                    ) : (
                        <div className="bg-warm-border/10 rounded-xl
              p-3 space-y-3">
                            <div className="flex items-start gap-2">
                                <AlertTriangle size={13}
                                    className="text-warm-muted mt-0.5
                  flex-shrink-0" />
                                <p className="text-xs
                  text-warm-dark/60 font-sans
                  leading-relaxed">
                                    This won't appear in the archive.
                                    The contributor won't be notified.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() =>
                                        setConfirmReject(false)
                                    }
                                    className="flex-1 py-2 border
                    border-warm-border/40 rounded-lg
                    text-xs text-warm-dark/50
                    hover:bg-warm-border/10 transition-all
                    font-sans"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onReject}
                                    disabled={processing}
                                    className="flex-1 py-2
                    bg-warm-dark/10 rounded-lg
                    text-xs text-warm-dark/60
                    hover:bg-warm-dark/20 transition-all
                    font-sans disabled:opacity-50
                    flex items-center justify-center
                    gap-1.5"
                                >
                                    {processing
                                        ? <Loader2 size={12}
                                            className="animate-spin" />
                                        : <X size={12} />
                                    }
                                    Confirm
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}