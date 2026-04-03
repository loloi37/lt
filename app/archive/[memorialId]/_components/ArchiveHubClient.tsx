// app/archive/[memorialId]/_components/ArchiveHubClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    MessageCircle, Image as ImageIcon, Clock, Check, X,
    ChevronRight, Shield, Eye, Plus, Network, AlertCircle
} from 'lucide-react';
import { useRoleSync } from '../_hooks/useRoleSync';
import RoleBanner from './RoleBanner';
import type { WitnessRole } from '@/types/roles';

interface ArchiveHubClientProps {
  roleData: {
    userRole: WitnessRole;
    plan: string;
    memorial: {
      id: string;
      fullName: string;
      profilePhotoUrl: string | null;
    };
    pendingCount: number;
    myContributions: any[];
  };
  memorialId: string;
  userId: string;
}

const STATUS_CONFIG = {
    pending_approval: {
        icon: Clock,
        label: 'Awaiting review',
        color: 'text-warm-muted bg-warm-muted/10 border-warm-muted/20'
    },
    approved: {
        icon: Check,
        label: 'Published',
        color: 'text-olive bg-olive/10 border-olive/20'
    },
    rejected: {
        icon: X,
        label: 'Not published',
        color: 'text-warm-dark/40 bg-warm-border/20 border-warm-border/30'
    }
} as const;

const TYPE_ICONS = {
    memory: MessageCircle,
    photo: ImageIcon,
    video: AlertCircle
} as const;

export default function ArchiveHubClient({ roleData, memorialId, userId }: ArchiveHubClientProps) {
    const router = useRouter();

    // Activate Realtime Role Security (From Step 7)
    useRoleSync(memorialId, userId, roleData.userRole);

    const { userRole, plan, memorial, myContributions, pendingCount } = roleData;
    const canReview = userRole === 'co_guardian' || userRole === 'owner';

    return (
        <div className="min-h-screen bg-surface-low">
            <RoleBanner /> {/* Sticky banner if role changes mid-session */}

            {/* Header */}
            <div className="border-b border-warm-border/20 bg-white sticky top-0 z-10 shadow-sm">
                <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {memorial.profilePhotoUrl ? (
                            <img src={memorial.profilePhotoUrl} alt={memorial.fullName} className="w-10 h-10 rounded-full object-cover border-2 border-warm-border/30" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-olive/20 to-warm-muted/20 border-2 border-warm-border/30 flex items-center justify-center">
                                <span className="text-warm-dark/30 text-sm font-serif">{memorial.fullName?.charAt(0) || 'M'}</span>
                            </div>
                        )}
                        <div>
                            <p className="font-serif text-base text-warm-dark leading-none mb-0.5">{memorial.fullName}</p>
                            <p className="text-xs text-warm-dark/40 font-sans capitalize">
                                {userRole.replace('_', ' ')} • {plan} Archive
                            </p>
                        </div>
                    </div>
                    <Link href={`/archive/${memorialId}/view`} className="flex items-center gap-1.5 text-sm text-olive hover:text-olive/80 transition-colors font-sans">
                        <Eye size={16} /> View archive
                    </Link>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

                {/* Co-guardian alert banner */}
                {canReview && pendingCount > 0 && (
                    <div onClick={() => router.push(`/archive/${memorialId}/steward`)} className="bg-warm-muted/5 border border-warm-muted/20 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-warm-muted/10 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-warm-muted/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield size={18} className="text-warm-muted" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-warm-dark">{pendingCount} contribution{pendingCount !== 1 ? 's' : ''} awaiting review</p>
                                <p className="text-xs text-warm-dark/50">Witnesses are waiting for your decision</p>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-warm-dark/30" />
                    </div>
                )}

                {/* Quick actions */}
                <section>
                    <h2 className="text-xs font-semibold text-warm-dark/40 uppercase tracking-wider mb-4 font-sans">Actions</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <QuickAction icon={MessageCircle} label="Share memory" onClick={() => router.push(`/archive/${memorialId}/contribute`)} primary />
                        <QuickAction icon={ImageIcon} label="Add a photo" onClick={() => router.push(`/archive/${memorialId}/contribute?type=photo`)} />
                        <QuickAction icon={Eye} label="View archive" onClick={() => router.push(`/archive/${memorialId}/view`)} />
                        {plan === 'family' && (
                            <QuickAction icon={Network} label="Family map" onClick={() => router.push(`/archive/${memorialId}/family`)} />
                        )}
                        {canReview && (
                            <QuickAction icon={Shield} label="Review queue" badge={pendingCount > 0 ? pendingCount : undefined} onClick={() => router.push(`/archive/${memorialId}/steward`)} />
                        )}
                    </div>
                </section>

                {/* My contributions */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xs font-semibold text-warm-dark/40 uppercase tracking-wider font-sans">My Contributions</h2>
                        <button onClick={() => router.push(`/archive/${memorialId}/contribute`)} className="flex items-center gap-1 text-xs text-olive hover:text-olive/80 transition-colors font-sans">
                            <Plus size={12} /> Add new
                        </button>
                    </div>

                    {myContributions.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-warm-border/40 rounded-xl p-10 text-center">
                            <MessageCircle size={24} className="text-warm-dark/20 mx-auto mb-4" />
                            <p className="text-sm text-warm-dark/40 mb-4 font-sans">You haven't contributed anything yet.</p>
                            <button onClick={() => router.push(`/archive/${memorialId}/contribute`)} className="inline-flex items-center gap-2 px-5 py-2.5 glass-btn-dark rounded-xl text-sm font-medium transition-all font-sans">
                                <Plus size={16} /> Share your first memory
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {myContributions.map((c: any) => (
                                <ContributionRow key={c.id} contribution={c} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// --- Sub Components ---
function QuickAction({ icon: Icon, label, onClick, primary = false, badge }: any) {
    return (
        <button onClick={onClick} className={`relative p-4 rounded-xl border transition-all flex flex-col items-center gap-2 font-sans ${primary ? 'glass-btn-dark' : 'bg-white text-warm-dark/70 border-warm-border/30 hover:border-warm-border/60 hover:bg-warm-border/5'}`}>
            {badge !== undefined && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-warm-muted text-white text-xs rounded-full flex items-center justify-center font-semibold font-sans">{badge}</span>
            )}
            <Icon size={20} />
            <span className="text-xs font-medium">{label}</span>
        </button>
    );
}

function ContributionRow({ contribution: c }: any) {
    const statusCfg = STATUS_CONFIG[c.status as keyof typeof STATUS_CONFIG];
    const StatusIcon = statusCfg.icon;
    const TypeIcon = TYPE_ICONS[c.type as keyof typeof TYPE_ICONS];

    return (
        <div className="bg-white border border-warm-border/30 rounded-xl p-4 flex items-center gap-4">
            <div className="w-9 h-9 bg-warm-border/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <TypeIcon size={16} className="text-warm-dark/40" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warm-dark truncate font-sans">{c.title}</p>
                <p className="text-xs text-warm-dark/40 font-sans mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border font-sans flex-shrink-0 ${statusCfg.color}`}>
                <StatusIcon size={10} />
                {statusCfg.label}
            </span>
        </div>
    );
}