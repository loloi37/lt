'use client';

import { useState } from 'react';
import {
    Shield, Check, ChevronRight,
    Loader2, AlertCircle, User,
    Eye, Edit, MessageCircle
} from 'lucide-react';
import { InvitationData } from '../page';

interface Props {
    invitation: InvitationData;
    token: string;
    onSuccess: (memorialId: string, role: string) => void;
}

// Role explanations — clear and non-technical
const ROLE_CONFIG = {
    witness: {
        label: 'Witness',
        color: 'bg-olive/10 text-olive border-olive/20',
        description:
            'You can share memories and photos. ' +
            'The archive owner reviews all contributions ' +
            'before they appear.',
        capabilities: [
            {
                icon: MessageCircle,
                text: 'Share memories and stories'
            },
            {
                icon: Eye,
                text: 'Read the full archive'
            },
            {
                icon: Check,
                text: 'Suggest photos (owner approves)'
            }
        ],
        cannotDo: [
            'Edit the main biography',
            'Delete content',
            'Invite others'
        ]
    },
    co_guardian: {
        label: 'Co-Guardian',
        color: 'bg-warm-muted/10 text-warm-muted border-warm-muted/20',
        description:
            'You share stewardship of this archive. ' +
            'You can review and approve contributions ' +
            'from witnesses, and edit certain sections.',
        capabilities: [
            {
                icon: Edit,
                text: 'Edit and add content directly'
            },
            {
                icon: Shield,
                text: 'Review witness contributions'
            },
            {
                icon: Eye,
                text: 'Full archive access'
            }
        ],
        cannotDo: [
            'Delete the archive',
            'Change the owner',
            'Access billing'
        ]
    }
} as const;

export default function InviteAcceptance({
    invitation,
    token,
    onSuccess
}: Props) {
    const [checkedModeration, setCheckedModeration] =
        useState(false);
    const [checkedDignity, setCheckedDignity] =
        useState(false);
    const [loading, setLoading] = useState(false);
    const [declining, setDeclining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeclineConfirm, setShowDeclineConfirm] =
        useState(false);

    const role = invitation.role;
    const roleConfig = ROLE_CONFIG[role];
    const canJoin = checkedModeration && checkedDignity;

    // Check if this is an anonymous contributor
    const anonContributor = (() => {
        try {
            const stored = sessionStorage.getItem(
                'anon_contributor'
            );
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    })();

    const handleJoin = async () => {
        setLoading(true);
        setError(null);

        try {
            const body: Record<string, string> = {};

            // If anonymous, pass their contributionId
            if (anonContributor) {
                const { data: contribution } = await fetch(
                    `/api/invite/${token}`
                ).then(r => r.json());

                // Get the contributionId from session
                // (set during OTP verification)
                const storedId = sessionStorage.getItem(
                    'anon_contribution_id'
                );
                if (storedId) body.contributionId = storedId;
            }

            const res = await fetch(
                `/api/invite/${token}/join`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(
                    data.error || 'Failed to join. Please try again.'
                );
                return;
            }

            // Clean up anonymous session data
            sessionStorage.removeItem('anon_contributor');
            sessionStorage.removeItem('anon_contribution_id');

            onSuccess(data.memorialId, data.role);

        } catch (err: any) {
            setError(
                'A network error occurred. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDecline = async () => {
        setDeclining(true);
        try {
            await fetch(`/api/invite/${token}/decline`, {
                method: 'POST'
            });
            // Redirect to a gentle "you've declined" page
            window.location.href = '/';
        } catch {
            setDeclining(false);
        }
    };

    const formatYear = (d: string | null) =>
        d ? new Date(d).getFullYear() : null;

    const birthYear = formatYear(
        invitation.memorial.birthDate
    );
    const deathYear = formatYear(
        invitation.memorial.deathDate
    );

    return (
        <div className="min-h-screen bg-gradient-to-br
      from-olive/10 via-surface-low to-warm-muted/10">

            {/* Minimal header */}
            <div className="border-b border-warm-border/20
        bg-white/60 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto px-6 py-4
          text-center">
                    <span className="text-xs tracking-widest
            uppercase text-warm-dark/30 font-sans">
                        ULUMAE
                    </span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6 py-16">

                {/* Memorial identity */}
                <div className="flex flex-col items-center
          text-center mb-12">

                    {invitation.memorial.profilePhotoUrl ? (
                        <div className="w-24 h-24 rounded-full
              overflow-hidden border-4 border-white
              shadow-lg mb-6">
                            <img
                                src={invitation.memorial.profilePhotoUrl}
                                alt={invitation.memorial.fullName}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-full
              bg-gradient-to-br from-olive/20
              to-warm-muted/20 border-4 border-white
              shadow-lg flex items-center
              justify-center mb-6">
                            <User size={36}
                                className="text-warm-dark/20" />
                        </div>
                    )}

                    <h1 className="font-serif text-4xl
            text-warm-dark mb-2">
                        {invitation.memorial.fullName}
                    </h1>

                    {(birthYear || deathYear) && (
                        <p className="font-serif italic
              text-warm-dark/40 text-lg">
                            {birthYear && deathYear
                                ? `${birthYear} — ${deathYear}`
                                : birthYear
                                    ? `Born ${birthYear}`
                                    : ''}
                        </p>
                    )}
                </div>

                {/* Main acceptance card */}
                <div className="bg-white rounded-2xl
          border border-warm-border/30 shadow-sm
          overflow-hidden mb-6">

                    {/* Invitation header */}
                    <div className="px-8 pt-8 pb-6
            border-b border-warm-border/20">
                        <p className="text-warm-dark/60
              text-base leading-relaxed">
                            <strong className="text-warm-dark">
                                {invitation.inviterName}
                            </strong>{' '}
                            has invited you to join this archive
                            as a{' '}
                            <span className={`inline-flex
                items-center gap-1 px-2.5 py-0.5
                rounded-full text-sm font-medium
                border ${roleConfig.color}`}>
                                {roleConfig.label}
                            </span>
                        </p>
                    </div>

                    {/* Role explanation */}
                    <div className="px-8 py-6
            border-b border-warm-border/20">
                        <p className="text-sm text-warm-dark/50
              leading-relaxed mb-5">
                            {roleConfig.description}
                        </p>

                        {/* Capabilities */}
                        <div className="grid grid-cols-1
              sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold
                  text-warm-dark/40 uppercase
                  tracking-wider mb-3">
                                    As a {roleConfig.label} you can
                                </p>
                                <ul className="space-y-2">
                                    {roleConfig.capabilities.map(
                                        (cap, i) => {
                                            const Icon = cap.icon;
                                            return (
                                                <li key={i}
                                                    className="flex items-center
                            gap-2.5 text-sm
                            text-warm-dark/70">
                                                    <Icon size={14}
                                                        className="text-olive
                              flex-shrink-0" />
                                                    {cap.text}
                                                </li>
                                            );
                                        }
                                    )}
                                </ul>
                            </div>

                            <div>
                                <p className="text-xs font-semibold
                  text-warm-dark/40 uppercase
                  tracking-wider mb-3">
                                    You cannot
                                </p>
                                <ul className="space-y-2">
                                    {roleConfig.cannotDo.map((item, i) => (
                                        <li key={i}
                                            className="flex items-center
                        gap-2.5 text-sm
                        text-warm-dark/40">
                                            <div className="w-3.5 h-3.5
                        flex items-center
                        justify-center flex-shrink-0">
                                                <div className="w-1.5 h-1.5
                          rounded-full
                          bg-warm-dark/20" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="px-8 py-6 space-y-4">

                        {/* Checkbox 1 — Moderation */}
                        <label className={`flex items-start
              gap-4 p-4 rounded-xl border-2
              cursor-pointer transition-all ${checkedModeration
                                ? 'border-olive/40 bg-olive/5'
                                : 'border-warm-border/30 hover:bg-warm-border/10'
                            }`}>
                            <div className={`w-5 h-5 rounded
                border-2 flex items-center
                justify-center flex-shrink-0 mt-0.5
                transition-colors ${checkedModeration
                                    ? 'bg-olive border-olive'
                                    : 'border-warm-border/60 bg-white'
                                }`}>
                                {checkedModeration && (
                                    <Check size={12}
                                        className="text-white"
                                        strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={checkedModeration}
                                onChange={e =>
                                    setCheckedModeration(e.target.checked)
                                }
                            />
                            <div>
                                <p className="text-sm font-medium
                  text-warm-dark mb-1">
                                    I understand contributions
                                    are reviewed
                                </p>
                                <p className="text-xs
                  text-warm-dark/50 leading-relaxed">
                                    Everything I share will be reviewed
                                    by the archive owner before it
                                    appears. This protects the dignity
                                    of the archive.
                                </p>
                            </div>
                        </label>

                        {/* Checkbox 2 — Dignity pledge */}
                        <label className={`flex items-start
              gap-4 p-4 rounded-xl border-2
              cursor-pointer transition-all ${checkedDignity
                                ? 'border-warm-dark/20 bg-warm-border/5'
                                : 'border-warm-border/30 hover:bg-warm-border/10'
                            }`}>
                            <div className={`w-5 h-5 rounded
                border-2 flex items-center
                justify-center flex-shrink-0 mt-0.5
                transition-colors ${checkedDignity
                                    ? 'bg-warm-dark border-warm-dark'
                                    : 'border-warm-border/60 bg-white'
                                }`}>
                                {checkedDignity && (
                                    <Check size={12}
                                        className="text-white"
                                        strokeWidth={3} />
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={checkedDignity}
                                onChange={e =>
                                    setCheckedDignity(e.target.checked)
                                }
                            />
                            <div>
                                <p className="text-sm font-medium
                  text-warm-dark mb-1">
                                    I will honour this archive with care
                                </p>
                                <p className="text-xs
                  text-warm-dark/50 leading-relaxed">
                                    I will only share memories that
                                    are truthful and respectful.
                                    I understand this is a permanent
                                    family record.
                                </p>
                            </div>
                        </label>
                    </div>

                    {/* Anonymous contributor notice */}
                    {anonContributor && (
                        <div className="mx-8 mb-6 p-4
              bg-warm-border/10 rounded-xl border
              border-warm-border/30 flex items-start gap-3">
                            <Shield size={16}
                                className="text-warm-dark/30
                  mt-0.5 flex-shrink-0" />
                            <p className="text-xs
                text-warm-dark/50 leading-relaxed">
                                You are joining as{' '}
                                <strong>{anonContributor.name}</strong>.
                                Your contributions will be visible
                                to the archive owner with your name
                                and verified email.
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="mx-8 mb-6 p-4
              bg-red-50 border border-red-200
              rounded-xl flex items-start gap-3">
                            <AlertCircle size={16}
                                className="text-red-500 mt-0.5
                  flex-shrink-0" />
                            <p className="text-sm text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="px-8 pb-8">
                        <button
                            onClick={handleJoin}
                            disabled={!canJoin || loading}
                            className={`w-full py-4 rounded-xl
                font-medium transition-all flex
                items-center justify-center gap-2
                ${canJoin && !loading
                                    ? 'glass-btn-dark shadow-lg'
                                    : 'bg-warm-border/20 text-warm-dark/30 cursor-not-allowed'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18}
                                        className="animate-spin" />
                                    Joining archive...
                                </>
                            ) : (
                                <>
                                    Join this archive
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>

                        {!canJoin && !loading && (
                            <p className="text-center text-xs
                text-warm-dark/30 mt-3">
                                Please confirm both statements above
                                to continue
                            </p>
                        )}
                    </div>
                </div>

                {/* Decline path — subtle, non-destructive */}
                {!showDeclineConfirm ? (
                    <div className="text-center">
                        <button
                            onClick={() =>
                                setShowDeclineConfirm(true)
                            }
                            className="text-sm text-warm-dark/25
                hover:text-warm-dark/50
                transition-colors"
                        >
                            I would prefer not to join
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl
            border border-warm-border/30 p-6 text-center">
                        <p className="text-sm text-warm-dark/60
              mb-4 leading-relaxed">
                            That is completely fine. You can always
                            ask{' '}
                            <strong>{invitation.inviterName}</strong>
                            {' '}for a new invitation later.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() =>
                                    setShowDeclineConfirm(false)
                                }
                                className="flex-1 py-2.5 border
                  border-warm-border/40 rounded-xl text-sm
                  text-warm-dark/60
                  hover:bg-warm-border/10 transition-all"
                            >
                                Go back
                            </button>
                            <button
                                onClick={handleDecline}
                                disabled={declining}
                                className="flex-1 py-2.5
                  bg-warm-dark/10 rounded-xl
                  text-sm text-warm-dark/60
                  hover:bg-warm-dark/20 transition-all
                  flex items-center justify-center
                  gap-2"
                            >
                                {declining ? (
                                    <Loader2 size={14}
                                        className="animate-spin" />
                                ) : (
                                    'Decline invitation'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}