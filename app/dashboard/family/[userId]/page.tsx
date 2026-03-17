// app/dashboard/family/[userId]/page.tsx

'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, Network, X, Search, Filter, RefreshCcw, AlertTriangle, Archive, Clock, Shield, Wifi } from 'lucide-react';
import { supabase, Memorial } from '@/lib/supabase';
import FamilyLinker from '@/components/FamilyLinker';
import SuccessorSettings from '@/components/SuccessorSettings';
import AnchorPanel from '@/components/AnchorPanel';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function FamilyDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;
    const auth = useAuth();
    const router = useRouter();
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [deletedMemorials, setDeletedMemorials] = useState<Memorial[]>([]); // NEW: Deleted state
    const [loading, setLoading] = useState(true);
    const [managingId, setManagingId] = useState<string | null>(null);
    const [showWelcome, setShowWelcome] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');

    const searchParams = useSearchParams();

    // Auth guard: verify the URL userId matches the authenticated user + plan enforcement
    useEffect(() => {
        if (auth.loading) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        if (auth.user && auth.user.id !== userId) {
            router.replace(`/dashboard/family/${auth.user.id}`);
            return;
        }
        // PLAN ENFORCEMENT: Personal-only users cannot access family dashboard
        if (auth.plan === 'personal') {
            console.log('[Plan Guard] User attempted Family access with Personal plan. Redirecting.');
            router.replace(`/dashboard/personal/${userId}`);
            return;
        }
        // Draft users go to draft dashboard
        if (auth.plan === 'draft' || auth.plan === 'none') {
            router.replace(`/dashboard/draft/${userId}`);
            return;
        }
    }, [auth.loading, auth.authenticated, auth.user, auth.plan, userId, router]);

    useEffect(() => {
        loadMemorials();
        if (searchParams.get('welcome') === 'true') {
            setShowWelcome(true);
            window.history.replaceState({}, '', `/dashboard/family/${userId}`);
            setTimeout(() => setShowWelcome(false), 5000);
        }
    }, [userId, searchParams]);

    // Refetch when user navigates back via browser back button or tab switch
    // Without this, bfcache can show stale data after editing a memorial
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

    const loadMemorials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memorials')
            .select('*, payment_confirmed_at')
            .eq('user_id', userId)
            .eq('mode', 'family')
            .order('updated_at', { ascending: false });

        if (error) console.error('Error:', error);

        if (data) {
            // Split active vs deleted
            setMemorials(data.filter(m => !m.deleted));
            setDeletedMemorials(data.filter(m => m.deleted));
        }
        setLoading(false);
    };

    const handleCreate = () => {
        window.location.href = '/create?mode=family';
    };

    // Soft Delete with Contributor Check — blocks preserved archives
    const softDeleteMemorial = async (id: string) => {
        // 0. Block deletion of preserved (blockchain) archives
        const target = memorials.find(m => m.id === id);
        if (target && (target as any).preservation_state === 'preserved') {
            alert('This archive has been permanently preserved on the blockchain and cannot be removed.');
            return;
        }
        // 1. Check for contributions first
        const { count } = await supabase
            .from('memorial_contributions')
            .select('*', { count: 'exact', head: true })
            .eq('memorial_id', id)
            .neq('user_id', userId); // Don't count owner's contributions

        let confirmMessage = 'Are you sure you want to delete this memorial? It will be moved to the trash for 30 days.';

        if (count && count > 0) {
            confirmMessage = `WARNING: This archive contains contributions from ${count} other people.\n\nAre you sure you want to delete it? They will lose access to their contributions.`;
        }

        if (!confirm(confirmMessage)) return;

        const { error } = await supabase
            .from('memorials')
            .update({
                deleted: true,
                deleted_at: new Date().toISOString()
            })
            .eq('id', id);

        if (error) {
            alert('Error deleting memorial');
            console.error(error);
        } else {
            loadMemorials();
        }
    };

    // NEW: Restore Function
    const restoreMemorial = async (id: string) => {
        const { error } = await supabase
            .from('memorials')
            .update({
                deleted: false,
                deleted_at: null
            })
            .eq('id', id);

        if (error) {
            alert('Error restoring memorial');
            console.error(error);
        } else {
            loadMemorials();
        }
    };

    // Permanent delete
    const permanentDeleteMemorial = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this memorial? This action cannot be undone.')) return;
        if (!confirm('This is irreversible. The memorial and all its content will be lost forever. Continue?')) return;
        try {
            const res = await fetch(`/api/memorials/${id}/permanent-delete`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Operation failed');
            loadMemorials();
        } catch {
            alert('Error permanently deleting memorial. Please try again.');
        }
    };

    // Helper for days remaining
    const getDaysRemaining = (deletedAt: string) => {
        const deleteDate = new Date(deletedAt);
        const expiryDate = new Date(deleteDate.getTime() + (30 * 24 * 60 * 60 * 1000));
        const now = new Date();
        const diff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diff > 0 ? diff : 0;
    };

    // Filter Active Memorials
    const filteredMemorials = memorials.filter(m => {
        const matchesSearch = (m.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all'
            ? true
            : filterStatus === 'published'
                ? m.status === 'published'
                : m.status === 'draft';
        return matchesSearch && matchesFilter;
    });

    // Derive family name from first memorial's last name
    const deriveFamilyName = (): string => {
        if (memorials.length === 0) return 'Your';
        const firstName = memorials[0];
        const fullName = firstName?.full_name || '';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length > 1) {
            return parts[parts.length - 1];
        }
        return fullName || 'Your';
    };

    const familyName = deriveFamilyName();

    const firstPaidMemorial = memorials.find(m => m.paid);

    // Count unique members (from memorial contributor relationships or just active memorials)
    const memberCount = memorials.length;

    // BLOCK RENDERING until auth checks pass
    const hasAccess = auth.plan === 'family' || auth.plan === 'concierge';
    if (auth.loading || !auth.authenticated || !hasAccess) {
        return (
            <div className="dark-dashboard min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-vault-border border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="vault-muted text-sm font-sans">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dark-dashboard min-h-screen">
            {/* Welcome banner */}
            {showWelcome && (
                <div className="animate-fadeIn vault-dark border-b vault-border">
                    <div className="max-w-7xl mx-auto px-6 py-4 text-center">
                        <p className="text-sm font-sans vault-muted tracking-wide">
                            When you are ready, everything is here.
                        </p>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="vault-dark border-b vault-border">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Link href="/choice-pricing" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <ArrowLeft size={20} className="vault-muted" />
                                </Link>
                                <h1 className="font-serif text-4xl vault-text">
                                    The {familyName} Legacy Archive
                                </h1>
                                <span className="live-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold">
                                    Live
                                </span>
                            </div>
                            <p className="vault-muted font-sans text-sm tracking-wide ml-12">
                                {memorials.length} memorial{memorials.length !== 1 ? 's' : ''} &bull; {memberCount} member{memberCount !== 1 ? 's' : ''} &bull; 0 devices anchored
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/dashboard/family/${userId}/tree`}
                                className="dark-card-hover px-5 py-3 rounded-lg font-sans font-semibold flex items-center gap-2 vault-border border vault-text text-sm transition-all"
                            >
                                <Network size={18} />
                                View Constellation
                            </Link>
                            <button
                                onClick={handleCreate}
                                className="px-5 py-3 rounded-lg font-sans font-semibold flex items-center gap-2 bg-gold text-black text-sm hover:bg-gold/90 transition-all"
                            >
                                <Plus size={18} />
                                Create Memorial
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* SEARCH & FILTER TOOLBAR */}
                {!loading && memorials.length > 0 && (
                    <div className="flex flex-col md:flex-row gap-4 mb-8">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 vault-muted" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl dark-card vault-border border vault-text font-sans focus:border-gold/50 focus:outline-none transition-all bg-transparent placeholder:text-white/30"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 vault-muted" size={20} />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="pl-12 pr-8 py-3 rounded-xl dark-card vault-border border vault-text font-sans focus:border-gold/50 focus:outline-none bg-transparent appearance-none cursor-pointer"
                            >
                                <option value="all">All Memorials</option>
                                <option value="draft">Drafts</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="gold animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 && deletedMemorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="vault-muted" />
                        </div>
                        <h2 className="font-serif text-3xl vault-text mb-3">Create Your First Memorial</h2>
                        <p className="vault-muted font-sans mb-6">Begin preserving your family&apos;s legacy</p>
                        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-lg font-sans font-semibold hover:bg-gold/90 transition-all">
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                ) : (
                    <>
                        {/* FAMILY ROW: Visual Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMemorials.map((memorial) => (
                                <div key={memorial.id} className="dark-card dark-card-hover vault-border border rounded-xl overflow-hidden transition-all group">
                                    {/* Profile Photo */}
                                    <div className="relative h-48 bg-gradient-to-br from-white/5 to-white/[0.02]">
                                        {memorial.profile_photo_url ? (
                                            <img src={memorial.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={64} className="text-white/10" />
                                            </div>
                                        )}
                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            {memorial.paid ? (
                                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm gold vault-border border font-sans">
                                                    <Archive size={10} />
                                                    Active
                                                </span>
                                            ) : memorial.status === 'published' ? (
                                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-green-500/10 backdrop-blur-sm text-green-400 border border-green-500/20 font-sans">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm vault-muted vault-border border font-sans">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-5">
                                        <h3 className="font-serif text-xl vault-text mb-1">{memorial.full_name || 'Untitled'}</h3>
                                        <p className="text-xs vault-muted font-sans mb-4">
                                            {memorial.birth_date || '?'} &mdash; {memorial.death_date || 'Present'}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link href={`/person/${memorial.id}`} className="flex-1 py-2 px-3 vault-dark rounded-lg font-sans font-medium text-center text-sm flex items-center justify-center gap-1 vault-text hover:bg-white/10 transition-colors">
                                                <Eye size={14} /> View
                                            </Link>
                                            <Link href={`/create?id=${memorial.id}&mode=family`} className="flex-1 py-2 px-3 vault-dark rounded-lg font-sans font-medium text-center text-sm flex items-center justify-center gap-1 vault-text hover:bg-white/10 transition-colors">
                                                <Edit size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => setManagingId(memorial.id)}
                                                className="py-2 px-3 vault-dark rounded-lg vault-muted hover:bg-white/10 transition-colors"
                                                title="Manage Connections"
                                            >
                                                <Network size={14} />
                                            </button>
                                            {(memorial as any).preservation_state !== 'preserved' && (
                                                <button onClick={() => softDeleteMemorial(memorial.id)} className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* + Add Memorial Card */}
                            <button
                                onClick={handleCreate}
                                className="dark-card dark-card-hover vault-border border border-dashed rounded-xl overflow-hidden transition-all flex flex-col items-center justify-center min-h-[320px] group cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                                    <Plus size={28} className="vault-muted group-hover:text-gold transition-colors" />
                                </div>
                                <p className="font-sans font-semibold vault-muted group-hover:vault-text text-sm transition-colors">Add Memorial</p>
                            </button>
                        </div>
                    </>
                )}

                {/* ANCHOR PANEL — Device Sync Display */}
                {firstPaidMemorial && (
                    <div className="mt-12">
                        <AnchorPanel memorialId={firstPaidMemorial.id} />
                    </div>
                )}

                {/* Note: Blockchain preservation (Arweave) is available on the Personal plan only */}

                {/* OFFLINE ACCESS GUARANTEE */}
                <div className="mt-8">
                    <div className="dark-card vault-border border rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Wifi size={16} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold vault-text font-sans mb-1">Offline Access Guarantee</h3>
                                <p className="text-sm vault-muted font-sans leading-relaxed">
                                    Every anchored device holds a complete, verified copy of your family&apos;s memorial data.
                                    Your legacy remains accessible even without an internet connection &mdash; no subscription,
                                    no server dependency. Once anchored, it&apos;s yours forever.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* REMOVED ARCHIVES */}
                {deletedMemorials.length > 0 && (
                    <div className="mt-16 pt-10 border-t vault-border animate-fadeIn">
                        <h3 className="text-xl font-serif vault-text mb-2 flex items-center gap-2">
                            <Archive size={20} className="vault-muted" />
                            Removed Archives
                        </h3>
                        <p className="text-sm vault-muted font-sans mb-6">
                            Archives are kept for 30 days before permanent deletion.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedMemorials.map((memorial) => (
                                <div key={memorial.id} className="dark-card vault-border border rounded-xl p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-sans font-medium vault-text">{memorial.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-sans">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(memorial.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => restoreMemorial(memorial.id)}
                                            className="p-2 dark-card vault-border border vault-text rounded-lg hover:bg-white/10 transition-colors"
                                            title="Restore"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button
                                            onClick={() => permanentDeleteMemorial(memorial.id)}
                                            className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SUCCESSION MANAGEMENT SECTION */}
                <div className="mt-16 pt-12 border-t vault-border">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <h2 className="font-serif text-3xl vault-text mb-4">Account Stewardship</h2>
                            <p className="vault-muted font-sans leading-relaxed">
                                Legacy is not just what you create, but how you ensure it survives. Use this section to designate the person who will care for these archives when you no longer can.
                            </p>
                        </div>
                        <div className="lg:col-span-2">
                            <SuccessorSettings userId={userId} />
                        </div>
                    </div>
                </div>

            </div>

            {/* CONNECTION MANAGER MODAL */}
            {managingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="dark-card vault-border border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fadeIn">
                        <div className="p-4 border-b vault-border flex justify-between items-center vault-dark">
                            <h3 className="font-serif text-lg vault-text">Manage Family Connections</h3>
                            <button
                                onClick={() => setManagingId(null)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} className="vault-muted" />
                            </button>
                        </div>
                        <div className="p-6">
                            <FamilyLinker
                                currentMemorialId={managingId}
                                userId={userId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
