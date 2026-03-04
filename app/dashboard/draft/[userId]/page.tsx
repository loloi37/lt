'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, FileEdit, Loader2, ArrowLeft, RefreshCcw, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Memorial } from '@/lib/supabase';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function DraftDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;
    const router = useRouter();
    const auth = useAuth();
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [deletedMemorials, setDeletedMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);

    // Auth guard: verify user identity and redirect if they have a paid plan
    useEffect(() => {
        if (auth.loading) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        if (auth.user && auth.user.id !== userId) {
            router.replace(`/dashboard/draft/${auth.user.id}`);
            return;
        }
        // If user has upgraded to a paid plan, redirect to the correct dashboard
        if (auth.hasPaid && auth.user) {
            router.replace(`/dashboard/${auth.plan}/${auth.user.id}`);
            return;
        }
    }, [auth.loading, auth.authenticated, auth.user, auth.hasPaid, auth.plan, userId, router]);

    useEffect(() => {
        loadMemorials();
    }, [userId]);

    const loadMemorials = async () => {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .eq('user_id', userId)
            .eq('mode', 'draft')
            .order('updated_at', { ascending: false });

        if (error) console.error('Error:', error);

        if (data) {
            setMemorials(data.filter(m => !m.deleted));
            setDeletedMemorials(data.filter(m => m.deleted));
        }
        setLoading(false);
    };

    // Refetch when user navigates back via browser back button or tab switch
    useEffect(() => {
        const handlePopState = () => loadMemorials();
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') loadMemorials();
        };
        window.addEventListener('popstate', handlePopState);
        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            window.removeEventListener('popstate', handlePopState);
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [userId]);

    const handleCreate = () => {
        window.location.href = '/create?mode=draft';
    };

    // Upgrade a specific draft memorial to Personal
    // Opens target dashboard in a NEW window (clean history, no back-button),
    // then navigates current window to confirmation → payment flow
    const handleUpgrade = (memorialId: string) => {
        window.open(`/dashboard/personal/${userId}?upgrading=true`, '_blank');
        window.location.href = `/personal-confirmation?memorialId=${memorialId}&popup=true`;
    };

    const softDeleteMemorial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this draft? It will be moved to the trash for 30 days.')) return;

        const supabase = createClient();
        const { error } = await supabase
            .from('memorials')
            .update({ deleted: true, deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            alert('Error deleting draft');
            console.error(error);
        } else {
            loadMemorials();
        }
    };

    const restoreMemorial = async (id: string) => {
        const supabase = createClient();
        const { error } = await supabase
            .from('memorials')
            .update({ deleted: false, deleted_at: null })
            .eq('id', id);

        if (error) {
            alert('Error restoring draft');
            console.error(error);
        } else {
            loadMemorials();
        }
    };

    const getDaysRemaining = (deletedAt: string) => {
        const deleteDate = new Date(deletedAt);
        const expiryDate = new Date(deleteDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const now = new Date();
        const diff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diff > 0 ? diff : 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-charcoal/5 via-ivory to-sand/20">
            <div className="bg-white border-b border-sand/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/choice-pricing" className="p-2 hover:bg-sand/10 rounded-lg">
                                    <ArrowLeft size={20} className="text-charcoal/60" />
                                </Link>
                                <h1 className="font-serif text-4xl text-charcoal">My Drafts</h1>
                                <span className="px-3 py-1 bg-charcoal/10 text-charcoal/60 text-xs font-semibold rounded-full uppercase tracking-wide">
                                    Free Plan
                                </span>
                            </div>
                            <p className="text-charcoal/60">Your draft memorials — upgrade to Personal to publish</p>
                            <p className="text-xs text-charcoal/40 mt-1">ID: {userId.slice(0, 8)}...</p>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Upgrade CTA */}
                            <button
                                onClick={() => router.push('/choice-pricing')}
                                className="btn-paper px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 border-2 border-sage text-sage hover:bg-sage/10 transition-all text-sm"
                            >
                                <ArrowUpCircle size={18} />
                                Upgrade to Personal
                            </button>

                            <button
                                onClick={handleCreate}
                                className="btn-paper px-6 py-3 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-charcoal/80 to-charcoal hover:shadow-lg text-ivory"
                            >
                                <Plus size={20} />
                                New Draft
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Banner */}
            <div className="max-w-7xl mx-auto px-6 pt-8">
                <div className="bg-gradient-to-r from-mist/10 to-stone/10 border border-mist/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <p className="font-semibold text-charcoal mb-1">Ready to publish your memorial?</p>
                        <p className="text-sm text-charcoal/60">
                            Upgrade to the <strong>Personal</strong> plan ($1,470) to remove watermarks, unlock HD media, and get lifetime hosting.
                        </p>
                    </div>
                    <button
                        onClick={() => memorials.length > 0 ? handleUpgrade(memorials[0].id) : router.push('/personal-confirmation')}
                        className="btn-paper ml-6 flex-shrink-0 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-semibold transition-all flex items-center gap-2"
                    >
                        <ArrowUpCircle size={18} />
                        Upgrade Now ($1,470)
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="text-charcoal/30 animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileEdit size={48} className="text-charcoal/30" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Start Your First Draft</h2>
                        <p className="text-charcoal/50 mb-6 max-w-sm mx-auto">
                            Build your memorial at your own pace. No payment required to get started.
                        </p>
                        <button onClick={handleCreate} className="btn-paper inline-flex items-center gap-2 px-6 py-3 bg-charcoal/80 hover:bg-charcoal text-ivory rounded-lg font-semibold">
                            <Plus size={20} />
                            Create Draft
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorials.map((memorial) => (
                            <div key={memorial.id} className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                                {/* Draft watermark overlay on thumbnail */}
                                <div className="relative h-48 bg-gradient-to-br from-charcoal/5 to-charcoal/10">
                                    {memorial.profile_photo_url ? (
                                        <>
                                            <img src={memorial.profile_photo_url} alt="" className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-charcoal/40 font-bold text-xl tracking-widest rotate-[-20deg] select-none pointer-events-none">
                                                    DRAFT
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FileEdit size={64} className="text-charcoal/20" />
                                        </div>
                                    )}
                                    {/* Draft badge */}
                                    <div className="absolute top-3 left-3 px-2 py-1 bg-charcoal/70 text-ivory text-xs font-semibold rounded-md">
                                        DRAFT
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-2xl text-charcoal mb-2">{memorial.full_name || 'Untitled Draft'}</h3>
                                    <p className="text-xs text-charcoal/40 mb-4">
                                        Last edited: {new Date(memorial.updated_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-2 mb-3">
                                        <Link
                                            href={`/create?id=${memorial.id}&mode=draft`}
                                            className="btn-paper flex-1 py-2 px-3 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal rounded-lg font-medium text-center text-sm"
                                        >
                                            <Edit size={16} className="inline mr-1" />Edit
                                        </Link>
                                        <button
                                            onClick={() => softDeleteMemorial(memorial.id)}
                                            className="btn-paper py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                            title="Delete draft"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    {/* Per-memorial upgrade button */}
                                    <button
                                        onClick={() => handleUpgrade(memorial.id)}
                                        className="btn-paper w-full py-2.5 px-3 bg-gradient-to-r from-sage to-sage/90 hover:shadow-md text-ivory rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                                    >
                                        <ArrowUpCircle size={16} />
                                        Upgrade to Personal ($1,470)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Deleted Archives */}
                {deletedMemorials.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/30">
                        <h3 className="text-xl font-serif text-charcoal mb-6 flex items-center gap-2">
                            <Trash2 size={20} className="text-charcoal/40" />
                            Deleted Drafts (Trash)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedMemorials.map((memorial) => (
                                <div key={memorial.id} className="bg-sand/10 rounded-xl border border-sand/30 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-charcoal">{memorial.full_name || 'Untitled Draft'}</p>
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(memorial.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restoreMemorial(memorial.id)}
                                        className="p-2 bg-white border border-charcoal/20 text-charcoal/60 rounded-lg hover:bg-charcoal/10 transition-colors"
                                        title="Restore"
                                    >
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
