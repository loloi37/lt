'use client';

import {
    AlertCircle, Clock,
    X, CheckCircle, Trash2
} from 'lucide-react';
import Link from 'next/link';
import { TerminalReason } from '../page';

const TERMINAL_CONTENT: Record<TerminalReason, {
    icon: any;
    iconColor: string;
    title: string;
    message: (meta: Record<string, string>) => string;
    action?: (meta: Record<string, string>)
        => { label: string; href: string } | null;
}> = {
    NOT_FOUND: {
        icon: AlertCircle,
        iconColor: 'text-stone',
        title: 'Invitation not found',
        message: () =>
            'This invitation link is invalid or does not exist.',
        action: () => null
    },
    EXPIRED: {
        icon: Clock,
        iconColor: 'text-stone',
        title: 'This invitation has expired',
        message: ({ inviterName }) =>
            `Contact ${inviterName || 'the archive owner'} 
       to request a new invitation.`,
        action: ({ inviteeEmail }) =>
            inviteeEmail
                ? {
                    label: 'Return to home',
                    href: '/'
                }
                : null
    },
    DECLINED: {
        icon: X,
        iconColor: 'text-charcoal/40',
        title: 'You previously declined',
        message: ({ inviterName }) =>
            `Contact ${inviterName || 'the archive owner'} 
       if you would like a new invitation.`,
        action: () => ({
            label: 'Return to home',
            href: '/'
        })
    },
    USED_BY_OTHER: {
        icon: AlertCircle,
        iconColor: 'text-stone',
        title: 'This invitation has already been used',
        message: ({ inviterName }) =>
            `Someone else has joined using this link. 
       Ask ${inviterName || 'the owner'} for 
       a new invitation.`,
        action: () => null
    },
    MEMORIAL_DELETED: {
        icon: Trash2,
        iconColor: 'text-charcoal/30',
        title: 'This archive is no longer available',
        message: ({ inviterName }) =>
            `The owner may have removed it. Contact 
       ${inviterName || 'the archive owner'} 
       for more information.`,
        action: () => ({
            label: 'Return to home',
            href: '/'
        })
    },
    ALREADY_JOINED: {
        icon: CheckCircle,
        iconColor: 'text-sage',
        title: "You've already joined",
        message: () =>
            'Redirecting you to the archive...',
        action: () => null
    }
};

interface Props {
    reason: TerminalReason;
    meta: Record<string, string>;
}

export default function InviteTerminal({
    reason,
    meta
}: Props) {
    const content = TERMINAL_CONTENT[reason];
    const Icon = content.icon;
    const action = content.action?.(meta);

    return (
        <div className="min-h-screen bg-ivory flex 
      items-center justify-center p-6">
            <div className="max-w-md w-full text-center">

                <div className="w-16 h-16 bg-sand/20 
          rounded-full flex items-center 
          justify-center mx-auto mb-6">
                    <Icon size={32}
                        className={content.iconColor} />
                </div>

                <h1 className="font-serif text-2xl 
          text-charcoal mb-3">
                    {content.title}
                </h1>

                <p className="text-charcoal/50 text-sm 
          leading-relaxed mb-8">
                    {content.message(meta)}
                </p>

                {action && (
                    <Link
                        href={action.href}
                        className="inline-block px-6 py-3 
              bg-charcoal text-ivory rounded-xl 
              text-sm font-medium 
              hover:bg-charcoal/90 transition-all"
                    >
                        {action.label}
                    </Link>
                )}

            </div>
        </div>
    );
}
