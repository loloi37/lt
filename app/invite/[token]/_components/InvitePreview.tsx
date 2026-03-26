'use client';

import { Shield, Check, X, User } from 'lucide-react';
import { InvitationData } from '../page';

interface Props {
    invitation: InvitationData;
    onContinue: () => void;
}

export default function InvitePreview({
    invitation,
    onContinue
}: Props) {
    const { memorial, inviterName,
        personalMessage, plan } = invitation;

    const formatYear = (date: string | null) =>
        date ? new Date(date).getFullYear() : null;

    const birthYear = formatYear(memorial.birthDate);
    const deathYear = formatYear(memorial.deathDate);

    const dateRange = birthYear
        ? deathYear
            ? `${birthYear} — ${deathYear}`
            : `Born ${birthYear}`
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br
      from-olive/10 via-surface-low to-warm-muted/10">

            {/* Minimal header — no navigation */}
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

                {/* Profile photo or placeholder */}
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

                {/* Name and dates */}
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

                {/* The invitation card */}
                <div className="w-full bg-white rounded-2xl
          border border-warm-border/30 shadow-sm
          overflow-hidden mb-8">

                    {/* Plan badge */}
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

                {/* Invitation text */}
                <div className="px-8 py-6">
                    <p className="text-lg text-warm-dark
              leading-relaxed mb-6">
                        <strong>{inviterName}</strong> has
                        invited you to contribute to the
                        private archive of{' '}
                        <strong>{memorial.fullName}</strong>.
                    </p>

                    {/* Personal message */}
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

                    {/* What this is */}
                    <p className="text-sm text-warm-dark/50
              leading-relaxed">
                        This is a private, permanent family
                        archive. It is not a social network
                        or public profile.
                    </p>
                </div>

                {/* Can / Cannot grid */}
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
                            <li>Share memories & stories</li>
                            <li>Upload photos you own</li>
                            <li>Suggest corrections</li>
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
                            <li>Post publicly</li>
                            <li>Edit the main story</li>
                            <li>Be charged to participate</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Primary CTA */}
            <button
                onClick={onContinue}
                className="w-full py-4 glass-btn-dark
            rounded-xl font-medium transition-all
            shadow-lg mb-4"
            >
                Continue to join this archive →
            </button>

            {/* Reassurance microcopy */}
            <p className="text-xs text-warm-dark/30 text-center leading-relaxed">
                You will need a free account so your
                contributions stay linked to you over
                time. You will never be asked for payment.
            </p>

        </div>
    </div >
  );
}