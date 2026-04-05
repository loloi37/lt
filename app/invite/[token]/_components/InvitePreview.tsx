'use client';

import { Shield, Check, X, User } from 'lucide-react';
import { InvitationData } from '../page';

interface Props {
    invitation: InvitationData;
    onContinue: () => void;
}

const PREVIEW_COPY = {
    witness: {
        roleLabel: 'Witness',
        intro: 'You have been invited to contribute stories and photos to this private archive.',
        can: [
            'Read the full archive',
            'Share memories and stories',
            'Upload photos for review'
        ],
        cannot: [
            'Edit the main biography directly',
            'Publish contributions instantly',
            'Invite other people'
        ]
    },
    co_guardian: {
        roleLabel: 'Co-Guardian',
        intro: 'You have been invited to help steward this family archive alongside the owner.',
        can: [
            'Read and edit memorial content',
            'Review witness contributions',
            'Invite witnesses and readers'
        ],
        cannot: [
            'Delete the archive',
            'Change the owner',
            'Manage billing'
        ]
    },
    reader: {
        roleLabel: 'Reader',
        intro: 'You have been invited to privately read and explore this archive.',
        can: [
            'Read the published archive',
            'View preserved memories and photos',
            'Return to the archive whenever you wish'
        ],
        cannot: [
            'Share memories or photos',
            'Edit archive content',
            'Invite other people'
        ]
    }
} as const;

export default function InvitePreview({
    invitation,
    onContinue
}: Props) {
    const { memorial, inviterName, personalMessage, plan, role, inviteeEmail } = invitation;
    const roleCopy = PREVIEW_COPY[role as keyof typeof PREVIEW_COPY];

    const formatYear = (date: string | null) =>
        date ? new Date(date).getFullYear() : null;

    const birthYear = formatYear(memorial.birthDate);
    const deathYear = formatYear(memorial.deathDate);

    const dateRange = birthYear
        ? deathYear
            ? `${birthYear} - ${deathYear}`
            : `Born ${birthYear}`
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br
      from-olive/10 via-surface-low to-warm-muted/10">
            <div className="border-b border-warm-border/20
        bg-white/60 backdrop-blur-sm">
                <div className="max-w-2xl mx-auto px-6
          py-4 text-center">
                    <span className="text-xs tracking-widest
            uppercase text-warm-dark/30 font-sans">
                        ULUMAE
                    </span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-6
        py-16 flex flex-col items-center">
                <div className="mb-8">
                    {memorial.profilePhotoUrl ? (
                        <div className="w-32 h-32 rounded-full
              overflow-hidden border-4 border-white
              shadow-xl">
                            <img
                                src={memorial.profilePhotoUrl}
                                alt={memorial.fullName}
                                className="w-full h-full
                  object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-32 h-32 rounded-full
              bg-gradient-to-br from-olive/20
              to-warm-muted/20 border-4 border-white
              shadow-xl flex items-center
              justify-center">
                            <User size={48}
                                className="text-warm-dark/20" />
                        </div>
                    )}
                </div>

                <h1 className="font-serif text-4xl
          text-warm-dark text-center mb-2">
                    {memorial.fullName}
                </h1>
                {dateRange && (
                    <p className="text-warm-dark/40
            font-serif italic text-lg mb-10">
                        {dateRange}
                    </p>
                )}

                <div className="w-full bg-white rounded-2xl
          border border-warm-border/30 shadow-sm
          overflow-hidden mb-8">
                    <div className="px-8 pt-8 pb-0">
                        <span className={`inline-flex
              items-center gap-1.5 px-3 py-1
              rounded-full text-xs font-medium
              border ${plan === 'family'
                                ? 'bg-warm-muted/10 text-warm-muted border-warm-muted/20'
                                : 'bg-olive/10 text-olive border-olive/20'
                            }`}>
                            {plan === 'family'
                                ? 'Family Archive'
                                : 'Personal Archive'}
                        </span>
                    </div>

                    <div className="px-8 py-6">
                        <p className="text-lg text-warm-dark
              leading-relaxed mb-6">
                            <strong>{inviterName}</strong> has
                            invited you to join the private archive of{' '}
                            <strong>{memorial.fullName}</strong>.
                        </p>

                        <div className="mb-6 rounded-2xl border border-warm-border/30 bg-surface-low/50 p-5">
                            <div className="mb-2 flex items-center gap-2 text-sm text-warm-dark/60">
                                <Shield size={15} className="text-olive" />
                                Invitation for <strong>{inviteeEmail}</strong>
                            </div>
                            <p className="text-sm leading-relaxed text-warm-dark/60">
                                You are joining as a <strong>{roleCopy.roleLabel}</strong>. {roleCopy.intro}
                            </p>
                        </div>

                        {personalMessage && (
                            <div className="border-l-4
                border-olive/30 pl-6 mb-6">
                                <p className="text-xs
                  text-warm-dark/40 uppercase
                  tracking-wider mb-2">
                                    A message from {inviterName}
                                </p>
                                <p className="font-serif italic
                  text-warm-dark/80 text-base
                  leading-relaxed">
                                    "{personalMessage}"
                                </p>
                            </div>
                        )}

                        <p className="text-sm text-warm-dark/50
              leading-relaxed">
                            This is a private, permanent family
                            archive. It is not a social network
                            or public profile.
                        </p>
                    </div>

                    <div className="grid grid-cols-2
            border-t border-warm-border/20">
                        <div className="px-8 py-6
              border-r border-warm-border/20">
                            <h3 className="text-xs font-semibold
                text-warm-dark/50 uppercase
                tracking-wider mb-3 flex
                items-center gap-1.5">
                                <Check size={14}
                                    className="text-olive" />
                                You can
                            </h3>
                            <ul className="space-y-2 text-sm
                text-warm-dark/70">
                                {roleCopy.can.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="px-8 py-6">
                            <h3 className="text-xs font-semibold
                text-warm-dark/50 uppercase
                tracking-wider mb-3 flex
                items-center gap-1.5">
                                <X size={14}
                                    className="text-warm-muted" />
                                You cannot
                            </h3>
                            <ul className="space-y-2 text-sm
                text-warm-dark/70">
                                {roleCopy.cannot.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onContinue}
                    className="w-full py-4 glass-btn-dark
            rounded-xl font-medium transition-all
            shadow-lg mb-4"
                >
                    Continue to join this archive
                </button>

                <p className="text-xs text-warm-dark/30 text-center leading-relaxed">
                    You will create or access a free account with the invited email so this archive access stays linked to you over time.
                </p>
            </div>
        </div>
    );
}
