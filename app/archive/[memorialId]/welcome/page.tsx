'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
    BookOpen, Image as ImageIcon, MessageCircle,
    Network, Shield, ChevronRight, Loader2,
    Eye, User, ArrowRight
} from 'lucide-react';

interface WelcomeData {
    memorial: {
        id: string;
        fullName: string;
        birthDate: string | null;
        deathDate: string | null;
        profilePhotoUrl: string | null;
    };
    userRole: 'witness' | 'co_guardian';
    plan: 'personal' | 'family';
    archiveRichness: 'empty' | 'partial' | 'rich';
    stats: {
        photoCount: number;
        memoryCount: number;
        videoCount: number;
        hasBiography: boolean;
    };
    linkedCount: number;
    joinedAt: string;
}

function WelcomeContent({
    memorialId
}: {
    memorialId: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Role can come from URL param (set by the
    // join success handler) or from the API
    const roleFromUrl = searchParams.get('role') as
        'witness' | 'co_guardian' | null;

    const [data, setData] =
        useState<WelcomeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/archive/${memorialId}/welcome-data`)
            .then(r => r.json())
            .then(d => {
                if (d.error) throw new Error(d.error);
                setData(d);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [memorialId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-low flex
        items-center justify-center">
                <div className="w-10 h-10 border-2
          border-warm-border/30 border-t-warm-dark/40
          rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-surface-low flex
        items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <p className="text-warm-dark/50 mb-4">
                        {error || 'This archive could not be loaded.'}
                    </p>
                    <button
                        onClick={() => router.replace('/')}
                        className="text-olive underline text-sm"
                    >
                        Return home
                    </button>
                </div>
            </div>
        );
    }

    const {
        memorial, userRole, plan,
        archiveRichness, stats, linkedCount
    } = data;

    const role = roleFromUrl || userRole;

    const formatYear = (d: string | null) =>
        d ? new Date(d).getFullYear() : null;

    const birthYear = formatYear(memorial.birthDate);
    const deathYear = formatYear(memorial.deathDate);

    return (
        <div className="min-h-screen bg-gradient-to-br
      from-olive/10 via-surface-low to-warm-muted/10">

            {/* Minimal header */}
            <div className="border-b border-warm-border/20
        bg-white/60 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-6 py-4
          flex items-center justify-between">
                    <span className="text-xs tracking-widest
            uppercase text-warm-dark/30 font-sans">
                        Legacy Vault
                    </span>
                    {/* Role badge */}
                    <span className={`text-xs px-3 py-1
            rounded-full font-medium border
            font-sans ${role === 'co_guardian'
                            ? 'bg-warm-muted/10 text-warm-muted border-warm-muted/20'
                            : 'bg-olive/10 text-olive border-olive/20'
                        }`}>
                        {role === 'co_guardian'
                            ? 'Co-Guardian'
                            : 'Witness'}
                    </span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">

                {/* Welcome hero */}
                <WelcomeHero
                    memorial={memorial}
                    birthYear={birthYear}
                    deathYear={deathYear}
                    role={role}
                    plan={plan}
                />

                {/* Action cards */}
                <div className="grid grid-cols-1
          sm:grid-cols-2 gap-4 mb-8">

                    {/* Always: Read the archive */}
                    <ActionCard
                        icon={BookOpen}
                        iconColor="text-olive"
                        iconBg="bg-olive/10"
                        title="Read the archive"
                        description={
                            archiveRichness === 'empty'
                                ? "The owner is still building this. Check back soon."
                                : archiveRichness === 'partial'
                                    ? `${stats.hasBiography ? 'A biography is written.' : ''} ${stats.photoCount > 0 ? `${stats.photoCount} photos added.` : ''}`
                                    : `${stats.photoCount} photos, ${stats.memoryCount} memories, ${stats.videoCount} videos.`
                        }
                        ctaLabel="View archive"
                        ctaDisabled={archiveRichness === 'empty'}
                        disabledNote="Content coming soon"
                        onClick={() =>
                            router.push(
                                `/archive/${memorialId}/view`
                            )
                        }
                        primary={archiveRichness !== 'empty'}
                    />

                    {/* Always: Share a memory */}
                    <ActionCard
                        icon={MessageCircle}
                        iconColor="text-warm-muted"
                        iconBg="bg-warm-muted/10"
                        title="Share a memory"
                        description={
                            role === 'co_guardian'
                                ? "Add a memory directly — no approval needed."
                                : "Share a story or memory. The owner will review it before it appears."
                        }
                        ctaLabel="Add a memory"
                        onClick={() =>
                            router.push(
                                `/archive/${memorialId}/contribute`
                            )
                        }
                        primary={archiveRichness === 'empty'}
                    />

                    {/* Family plan only: Family map */}
                    {plan === 'family' && (
                        <ActionCard
                            icon={Network}
                            iconColor="text-warm-dark/50"
                            iconBg="bg-warm-border/20"
                            title="See the family map"
                            description={
                                linkedCount > 0
                                    ? `${linkedCount} linked archive${linkedCount !== 1 ? 's' : ''} in this family vault.`
                                    : "The owner is still connecting family archives."
                            }
                            ctaLabel="View family map"
                            ctaDisabled={linkedCount === 0}
                            disabledNote="No links yet"
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/family`
                                )
                            }
                        />
                    )}

                    {/* Co-guardian only: Steward tools */}
                    {role === 'co_guardian' && (
                        <ActionCard
                            icon={Shield}
                            iconColor="text-warm-muted"
                            iconBg="bg-warm-muted/10"
                            title="Review contributions"
                            description="See and approve memories submitted by witnesses."
                            ctaLabel="Open steward tools"
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}/steward`
                                )
                            }
                        />
                    )}

                    {/* Upload a photo — always shown */}
                    <ActionCard
                        icon={ImageIcon}
                        iconColor="text-warm-dark/40"
                        iconBg="bg-warm-border/20"
                        title="Share a photo"
                        description="Upload a photo you own. The owner will review it."
                        ctaLabel="Upload photo"
                        onClick={() =>
                            router.push(
                                `/archive/${memorialId}/contribute?type=photo`
                            )
                        }
                    />
                </div>

                {/* Footer note */}
                <div className="text-center">
                    <p className="text-xs text-warm-dark/25
            leading-relaxed max-w-md mx-auto">
                        Your contributions are private to this
                        archive. They are reviewed before they
                        appear. You can see the status of
                        everything you've submitted at any time.
                    </p>
                    <button
                        onClick={() =>
                            router.push(`/archive/${memorialId}`)
                        }
                        className="mt-4 text-sm text-warm-dark/30
              hover:text-warm-dark/50 transition-colors
              flex items-center gap-1.5 mx-auto"
                    >
                        Go to your archive dashboard
                        <ArrowRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Sub-components ───────────────────────────────

function WelcomeHero({
    memorial,
    birthYear,
    deathYear,
    role,
    plan
}: {
    memorial: WelcomeData['memorial'];
    birthYear: number | null;
    deathYear: number | null;
    role: string;
    plan: string;
}) {
    // Copy varies by plan
    const headline = plan === 'family'
        ? `You have joined the ${memorial.fullName} family vault`
        : `You have joined the archive of ${memorial.fullName}`;

    const subline = role === 'co_guardian'
        ? "As a Co-Guardian, your contributions appear immediately. You can also review and approve memories from witnesses."
        : "As a Witness, your memories and photos will be reviewed by the owner before they appear. This protects the archive's integrity.";

    return (
        <div className="text-center mb-12">
            {/* Profile photo */}
            <div className="mb-8">
                {memorial.profilePhotoUrl ? (
                    <div className="w-28 h-28 rounded-full
            overflow-hidden border-4 border-white
            shadow-xl mx-auto">
                        <img
                            src={memorial.profilePhotoUrl}
                            alt={memorial.fullName}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-28 h-28 rounded-full
            bg-gradient-to-br from-olive/20
            to-warm-muted/20 border-4 border-white
            shadow-xl flex items-center
            justify-center mx-auto">
                        <User size={40}
                            className="text-warm-dark/20" />
                    </div>
                )}
            </div>

            {/* Name + dates */}
            <h1 className="font-serif text-4xl
        text-warm-dark mb-2">
                {memorial.fullName}
            </h1>
            {(birthYear || deathYear) && (
                <p className="font-serif italic
          text-warm-dark/40 text-lg mb-8">
                    {birthYear && deathYear
                        ? `${birthYear} — ${deathYear}`
                        : birthYear
                            ? `Born ${birthYear}`
                            : ''}
                </p>
            )}

            {/* Welcome message */}
            <div className="max-w-xl mx-auto
        bg-white rounded-2xl border border-warm-border/30
        shadow-sm p-8">
                <div className="w-12 h-12 bg-olive/10
          rounded-full flex items-center
          justify-center mx-auto mb-5">
                    <Shield size={24} className="text-olive" />
                </div>
                <h2 className="font-serif text-2xl
          text-warm-dark mb-3">
                    {headline}
                </h2>
                <p className="text-sm text-warm-dark/50
          leading-relaxed">
                    {subline}
                </p>
            </div>
        </div>
    );
}

function ActionCard({
    icon: Icon,
    iconColor,
    iconBg,
    title,
    description,
    ctaLabel,
    ctaDisabled = false,
    disabledNote,
    onClick,
    primary = false
}: {
    icon: any;
    iconColor: string;
    iconBg: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaDisabled?: boolean;
    disabledNote?: string;
    onClick: () => void;
    primary?: boolean;
}) {
    return (
        <div className={`bg-white rounded-2xl
      border shadow-sm p-6 flex flex-col
      transition-all ${primary
                ? 'border-olive/30 ring-1 ring-olive/10'
                : 'border-warm-border/30 hover:border-warm-border/50'
            }`}>

            {/* Icon */}
            <div className={`w-10 h-10 ${iconBg}
        rounded-xl flex items-center
        justify-center mb-4`}>
                <Icon size={20} className={iconColor} />
            </div>

            {/* Title */}
            <h3 className="font-serif text-lg
        text-warm-dark mb-2">
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-warm-dark/50
        leading-relaxed mb-5 flex-1">
                {description}
            </p>

            {/* CTA */}
            {ctaDisabled ? (
                <div className="text-xs text-warm-dark/25
          flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full
            bg-warm-dark/20" />
                    {disabledNote}
                </div>
            ) : (
                <button
                    onClick={onClick}
                    className={`w-full py-2.5 rounded-xl
            text-sm font-medium transition-all
            flex items-center justify-center
            gap-1.5 ${primary
                            ? 'glass-btn-dark'
                            : 'border border-warm-border/40 text-warm-dark/70 hover:bg-warm-border/10'
                        }`}
                >
                    {ctaLabel}
                    <ChevronRight size={14} />
                </button>
            )}
        </div>
    );
}

// ─── Page export with Suspense ────────────────────

export default function WelcomePage({
    params
}: {
    params: Promise<{ memorialId: string }>
}) {
    const unwrapped = use(params);

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface-low
        flex items-center justify-center">
                <div className="w-10 h-10 border-2
          border-warm-border/30 border-t-warm-dark/40
          rounded-full animate-spin" />
            </div>
        }>
            <WelcomeContent
                memorialId={unwrapped.memorialId}
            />
        </Suspense>
    );
}