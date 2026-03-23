'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
    MessageCircle, Image as ImageIcon,
    Clock, Check, X, ChevronRight,
    Shield, Eye, Plus, Network,
    AlertCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useArchiveRole } from
    './_hooks/useArchiveRole';

const STATUS_CONFIG = {
    pending_approval: {
        icon: Clock,
        label: 'Awaiting review',
        color: 'text-stone bg-stone/10 border-stone/20'
    },
    approved: {
        icon: Check,
        label: 'Published',
        color: 'text-sage bg-sage/10 border-sage/20'
    },
    rejected: {
        icon: X,
        label: 'Not published',
        color: 'text-charcoal/40 bg-sand/20 border-sand/30'
    }
} as const;

const TYPE_ICONS = {
    memory: MessageCircle,
    photo: ImageIcon,
    video: AlertCircle
} as const;

export default function ArchiveDashboard({
    params
}: {
    params: Promise<{ memorialId: string }>
}) {
    const { memorialId } = use(params);
    const router = useRouter();
    const { data, loading, error } =
        useArchiveRole(memorialId);

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex
        items-center justify-center">
                <Loader2 size={32}
                    className="text-mist animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-ivory flex
        items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <p className="text-charcoal/50 mb-4">
                        {error || 'Archive not found.'}
                    </p>
                    <button
                        onClick={() => router.replace('/')}
                        className="text-mist underline text-sm"
                    >
                        Return home
                    </button>
                </div>
            </div>
        );
    }

    const {
        userRole, plan, memorial,
        myContributions, pendingCount
    } = data;

    const canReview =
        userRole === 'co_guardian' ||
        userRole === 'owner';

    return (
        <div className="min-h-screen bg-ivory">

            {/* Header */}
            <div className="border-b border-sand/20
        bg-white sticky top-0 z-10 shadow-sm">
                <div className="max-w-3xl mx-auto
          px-6 py-4 flex items-center
          justify-between">

                    {/* Memorial identity */}
                    <div className="flex items-center gap-3">
                        {memorial.profilePhotoUrl ? (
                            <img
                                src={memorial.profilePhotoUrl}
                                alt={memorial.fullName}
                                className="w-10 h-10 rounded-full
                  object-cover border-2 border-sand/30"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full
                bg-gradient-to-br from-mist/20
                to-stone/20 border-2 border-sand/30
                flex items-center justify-center">
                                <span className="text-charcoal/30
                  text-sm font-serif">
                                    {memorial.fullName.charAt(0)}
                                </span>
                            </div>
                        )}
                        <div>
                            <p className="font-serif text-base
                text-charcoal leading-none mb-0.5">
                                {memorial.fullName}
                            </p>
                            <p className="text-xs text-charcoal/40
                font-sans">
                                {userRole === 'co_guardian'
                                    ? 'Co-Guardian'
                                    : userRole === 'owner'
                                        ? 'Owner'
                                        : 'Witness'}
                                {plan === 'family'
                                    ? ' · Family Archive'
                                    : ' · Personal Archive'}
                            </p>
                        </div>
                    </div>

                    {/* View archive link */}
                    <Link
                        href={`/archive/${memorialId}/view`}
                        className="flex items-center gap-1.5
              text-sm text-mist hover:text-mist/80
              transition-colors font-sans"
                    >
                        <Eye size={16} />
                        View archive
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto
        px-6 py-10 space-y-8">

                {/* Co-guardian alert banner */}
                {canReview && pendingCount > 0 && (
                        <div
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/steward`
                                )
                            }
                            className="bg-stone/5 border border-stone/20
              rounded-xl p-5 flex items-center
              justify-between cursor-pointer
              hover:bg-stone/10 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-stone/10
                rounded-lg flex items-center
                justify-center flex-shrink-0">
                                    <Shield size={18}
                                        className="text-stone" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium
                  text-charcoal">
                                        {pendingCount} contribution
                                        {pendingCount !== 1 ? 's' : ''}
                                        {' '}awaiting review
                                    </p>
                                    <p className="text-xs
                  text-charcoal/50">
                                        Witnesses are waiting for
                                        your decision
                                    </p>
                                </div>
                            </div>
                            <ChevronRight size={18}
                                className="text-charcoal/30" />
                        </div>
                    )}

                {/* Quick actions */}
                <section>
                    <h2 className="text-xs font-semibold
            text-charcoal/40 uppercase tracking-wider
            mb-4 font-sans">
                        Actions
                    </h2>
                    <div className="grid grid-cols-2
            sm:grid-cols-3 gap-3">

                        <QuickAction
                            icon={MessageCircle}
                            label="Share memory"
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/contribute`
                                )
                            }
                            primary
                        />

                        <QuickAction
                            icon={ImageIcon}
                            label="Upload photo"
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/contribute?type=photo`
                                )
                            }
                        />

                        <QuickAction
                            icon={Eye}
                            label="View archive"
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/view`
                                )
                            }
                        />

                        {plan === 'family' && (
                            <QuickAction
                                icon={Network}
                                label="Family map"
                                onClick={() =>
                                    router.push(
                                        `/archive/${memorialId}/family`
                                    )
                                }
                            />
                        )}

                        {/* Only show "Review Queue" if the user has permission */}
                        {canReview && (
                            <QuickAction
                                icon={Shield}
                                label="Review queue"
                                badge={pendingCount > 0 ? pendingCount : undefined}
                                onClick={() => router.push(`/archive/${memorialId}/steward`)}
                            />
                        )}
                    </div>
                </section>

                {/* My contributions */}
                <section>
                    <div className="flex items-center
            justify-between mb-4">
                        <h2 className="text-xs font-semibold
              text-charcoal/40 uppercase
              tracking-wider font-sans">
                            My Contributions
                        </h2>
                        <button
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/contribute`
                                )
                            }
                            className="flex items-center gap-1
                text-xs text-mist hover:text-mist/80
                transition-colors font-sans"
                        >
                            <Plus size={12} />
                            Add new
                        </button>
                    </div>

                    {myContributions.length === 0 ? (
                        <EmptyContributions
                            memorialId={memorialId}
                            onAdd={() =>
                                router.push(
                                    `/archive/${memorialId}/contribute`
                                )
                            }
                        />
                    ) : (
                        <div className="space-y-3">
                            {myContributions.map(c => (
                                <ContributionRow
                                    key={c.id}
                                    contribution={c}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────

function QuickAction({
    icon: Icon,
    label,
    onClick,
    primary = false,
    badge
}: {
    icon: any;
    label: string;
    onClick: () => void;
    primary?: boolean;
    badge?: number;
}) {
    return (
        <button
            onClick={onClick}
            className={`relative p-4 rounded-xl border
        transition-all flex flex-col items-center
        gap-2 btn-paper font-sans ${primary
                    ? 'bg-charcoal text-ivory border-charcoal hover:bg-charcoal/90'
                    : 'bg-white text-charcoal/70 border-sand/30 hover:border-sand/60 hover:bg-sand/5'
                }`}
        >
            {badge !== undefined && (
                <span className="absolute -top-1.5 -right-1.5
          w-5 h-5 bg-stone text-ivory text-xs
          rounded-full flex items-center
          justify-center font-semibold font-sans">
                    {badge}
                </span>
            )}
            <Icon size={20} />
            <span className="text-xs font-medium">
                {label}
            </span>
        </button>
    );
}

function ContributionRow({
    contribution
}: {
    contribution: {
        id: string;
        type: 'memory' | 'photo' | 'video';
        status: 'pending_approval' | 'approved' | 'rejected';
        title: string;
        createdAt: string;
    }
}) {
    const statusCfg = STATUS_CONFIG[contribution.status];
    const StatusIcon = statusCfg.icon;
    const TypeIcon = TYPE_ICONS[contribution.type];

    const timeAgo = (() => {
        const diff = Date.now() -
            new Date(contribution.createdAt).getTime();
        const days = Math.floor(diff / 86400000);
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 30) return `${days} days ago`;
        return new Date(contribution.createdAt)
            .toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
    })();

    return (
        <div className="bg-white border border-sand/30
      rounded-xl p-4 flex items-center gap-4">

            {/* Type icon */}
            <div className="w-9 h-9 bg-sand/20 rounded-lg
        flex items-center justify-center flex-shrink-0">
                <TypeIcon size={16}
                    className="text-charcoal/40" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal
          truncate font-sans">
                    {contribution.title}
                </p>
                <p className="text-xs text-charcoal/40
          font-sans mt-0.5">
                    {timeAgo}
                </p>
            </div>

            {/* Status badge */}
            <span className={`inline-flex items-center
        gap-1.5 px-2.5 py-1 rounded-full text-xs
        font-medium border font-sans flex-shrink-0
        ${statusCfg.color}`}>
                <StatusIcon size={10} />
                {statusCfg.label}
            </span>
        </div>
    );
}

function EmptyContributions({
    memorialId,
    onAdd
}: {
    memorialId: string;
    onAdd: () => void;
}) {
    return (
        <div className="bg-white border-2 border-dashed
      border-sand/40 rounded-xl p-10 text-center">
            <div className="w-12 h-12 bg-sand/20 rounded-full
        flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24}
                    className="text-charcoal/20" />
            </div>
            <p className="text-sm text-charcoal/40
        mb-4 font-sans leading-relaxed">
                You haven't contributed anything yet.
                <br />
                Your memories will appear here once submitted.
            </p>
            <button
                onClick={onAdd}
                className="inline-flex items-center gap-2
          px-5 py-2.5 bg-charcoal text-ivory
          rounded-xl text-sm font-medium
          hover:bg-charcoal/90 transition-all
          btn-paper font-sans"
            >
                <Plus size={16} />
                Share your first memory
            </button>
        </div>
    );
}