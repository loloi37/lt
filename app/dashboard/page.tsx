// app/dashboard/page.tsx — Unified memorial dashboard
// Shows all memorials with family features when plan = 'family'
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Shield, Clock, ExternalLink, Network, X } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import FamilyLinker from '@/components/FamilyLinker';
import type { MemorialState } from '@/types/memorial';

interface DashboardMemorial {
    id: string;
    state: MemorialState;
    plan: string | null;
    stories: any;
    full_name: string | null;
    profile_photo_url: string | null;
    updated_at: string;
    paid: boolean;
    arweave_tx_id: string | null;
    arweave_status: string | null;
    certificate_url: string | null;
}

const STATE_LABELS: Record<MemorialState, { label: string; color: string }> = {
    creating: { label: 'In Progress', color: 'bg-sand/30 text-charcoal/60' },
    private: { label: 'Private', color: 'bg-lavender/20 text-lavender' },
    live: { label: 'Live', color: 'bg-sage/20 text-sage' },
    preserved: { label: 'Preserved', color: 'bg-charcoal/10 text-charcoal' },
};

function DashboardContent() {
    const router = useRouter();
    const auth = useAuth();
    const [memorials, setMemorials] = useState<DashboardMemorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [managingId, setManagingId] = useState<string | null>(null);

    const hasFamily = memorials.some(m => m.plan === 'family');

    useEffect(() => {
        if (auth.loading) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        loadMemorials();
    }, [auth.loading, auth.authenticated]);

    const loadMemorials = async () => {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('memorials')
            .select('id, state, plan, stories, full_name, profile_photo_url, updated_at, paid, arweave_tx_id, arweave_status, certificate_url')
            .eq('user_id', auth.user!.id)
            .eq('deleted', false)
            .order('updated_at', { ascending: false });

        if (data && !error) {
            setMemorials(data as DashboardMemorial[]);
        }
        setLoading(false);
    };

    if (auth.loading || loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin mx-auto" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="font-serif text-3xl text-charcoal mb-1">Your Archives</h1>
                        <p className="text-sm text-charcoal/40">
                            {memorials.length === 0
                                ? 'Start preserving what matters.'
                                : `${memorials.length} memorial${memorials.length > 1 ? 's' : ''}`}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/create')}
                        className="px-5 py-2.5 bg-charcoal text-ivory rounded-lg font-medium text-sm hover:bg-charcoal/90 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} /> New Memorial
                    </button>
                </div>

                {/* Family badge */}
                {hasFamily && (
                    <div className="mb-8 p-4 bg-mist/5 border border-mist/20 rounded-xl flex items-center gap-3">
                        <Network size={18} className="text-mist flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-charcoal">Family Legacy Network</p>
                            <p className="text-xs text-charcoal/40">
                                Link memorials together using the connection button on each card.
                            </p>
                        </div>
                    </div>
                )}

                {/* Memorial cards */}
                {memorials.length === 0 ? (
                    <div className="text-center py-24">
                        <BookOpen size={48} className="mx-auto text-charcoal/10 mb-6" />
                        <h2 className="font-serif text-2xl text-charcoal/60 mb-3">No memorials yet</h2>
                        <p className="text-charcoal/40 mb-8 max-w-md mx-auto">
                            Create your first memorial to begin preserving a life story.
                        </p>
                        <button
                            onClick={() => router.push('/create')}
                            className="px-8 py-3 bg-charcoal text-ivory rounded-lg font-medium hover:bg-charcoal/90 transition-colors"
                        >
                            Create Memorial
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {memorials.map((memorial) => {
                            const stateConfig = STATE_LABELS[memorial.state] || STATE_LABELS.creating;
                            const name = memorial.full_name || memorial.stories?.fullName || 'Untitled Memorial';
                            const updatedDate = new Date(memorial.updated_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            });
                            const isFamily = memorial.plan === 'family';

                            return (
                                <div
                                    key={memorial.id}
                                    onClick={() => router.push(`/create?id=${memorial.id}`)}
                                    className="p-6 bg-white border border-sand/20 rounded-xl hover:border-charcoal/15 hover:shadow-sm transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Profile photo */}
                                        <div className="w-14 h-14 rounded-full bg-sand/20 flex-shrink-0 overflow-hidden">
                                            {memorial.profile_photo_url ? (
                                                <img
                                                    src={memorial.profile_photo_url}
                                                    alt={name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-charcoal/20 font-serif text-xl">
                                                    {name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-serif text-lg text-charcoal truncate">{name}</h3>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${stateConfig.color}`}>
                                                    {stateConfig.label}
                                                </span>
                                                {isFamily && (
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-mist/10 text-mist border border-mist/20">
                                                        Family
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-charcoal/30">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={11} /> {updatedDate}
                                                </span>
                                                {memorial.arweave_status === 'confirmed' && (
                                                    <span className="flex items-center gap-1 text-sage">
                                                        <Shield size={11} /> Permanently preserved
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Family: connection manager button */}
                                            {isFamily && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setManagingId(memorial.id); }}
                                                    className="p-2 hover:bg-mist/10 rounded-lg text-mist/60 hover:text-mist"
                                                    title="Manage Family Connections"
                                                >
                                                    <Network size={16} />
                                                </button>
                                            )}
                                            {memorial.state === 'live' || memorial.state === 'preserved' ? (
                                                <a
                                                    href={`/person/${memorial.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 hover:bg-sand/10 rounded-lg text-charcoal/30 hover:text-charcoal/60"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            ) : null}
                                            {memorial.certificate_url && (
                                                <a
                                                    href={memorial.certificate_url}
                                                    onClick={(e) => e.stopPropagation()}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-3 py-1 text-xs border border-sand/30 rounded text-charcoal/40 hover:bg-sand/10"
                                                >
                                                    Certificate
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Family Connection Manager Modal */}
            {managingId && auth.user && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-sand/20 flex justify-between items-center bg-ivory">
                            <h3 className="font-serif text-lg text-charcoal">Manage Family Connections</h3>
                            <button
                                onClick={() => setManagingId(null)}
                                className="p-2 hover:bg-sand/20 rounded-full transition-colors"
                            >
                                <X size={20} className="text-charcoal/60" />
                            </button>
                        </div>
                        <div className="p-6">
                            <FamilyLinker
                                currentMemorialId={managingId}
                                userId={auth.user.id}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin mx-auto" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
