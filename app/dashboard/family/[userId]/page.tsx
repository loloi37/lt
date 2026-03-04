// app/dashboard/family/[userId]/page.tsx

'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, Network, X, Search, Filter, RefreshCcw, AlertTriangle, Archive, Clock, Shield } from 'lucide-react';
import { supabase, Memorial } from '@/lib/supabase';
import FamilyLinker from '@/components/FamilyLinker';
import SuccessorSettings from '@/components/SuccessorSettings';
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

    // Auth guard: verify the URL userId matches the authenticated user
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
    }, [auth.loading, auth.authenticated, auth.user, userId, router]);

    useEffect(() => {
        loadMemorials();
        if (searchParams.get('welcome') === 'true') {
            setShowWelcome(true);
            window.history.replaceState({}, '', `/dashboard/family/${userId}`);
            setTimeout(() => setShowWelcome(false), 5000);
        }
    }, [userId, searchParams]);

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

    // UPDATED: Soft Delete with Contributor Check (Step 5.2.4)
    const softDeleteMemorial = async (id: string) => {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/5 via-ivory to-mist/10">
            {showWelcome && (
                <div className="animate-fadeIn" style={{ backgroundColor: '#1a2332' }}>
                    <div className="max-w-7xl mx-auto px-6 py-4 text-center">
                        <p className="text-sm" style={{ color: 'rgba(253,246,240,0.60)', letterSpacing: '0.04em' }}>
                            When you are ready, everything is here.
                        </p>
                    </div>
                </div>
            )}
            <div className="bg-white border-b border-sand/30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/choice-pricing" className="p-2 hover:bg-sand/10 rounded-lg">
                                    <ArrowLeft size={20} className="text-charcoal/60" />
                                </Link>
                                <h1 className="font-serif text-4xl text-charcoal">Family Memorials</h1>
                            </div>
                            <p className="text-charcoal/60">Your private dashboard</p>
                            <p className="text-xs text-charcoal/40 mt-1">ID: {userId.slice(0, 8)}...</p>
                        </div>

                        <div className="flex gap-3">
                            <Link
                                href={`/dashboard/family/${userId}/tree`}
                                className="btn-paper px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border-2 border-sage/20 text-sage hover:bg-sage/5 transition-all"
                            >
                                <Network size={20} />
                                View Constellation
                            </Link>
                            <button
                                onClick={handleCreate}
                                className="btn-paper px-6 py-3 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-sage to-sage/90 hover:shadow-lg text-ivory"
                            >
                                <Plus size={20} />
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
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-sand/20 focus:border-mist/50 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={20} />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="pl-12 pr-8 py-3 rounded-xl border-2 border-sand/20 focus:border-mist/50 focus:outline-none bg-white appearance-none cursor-pointer"
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
                        <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 && deletedMemorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-mist/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-mist" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Create Your First Memorial</h2>
                        <button onClick={handleCreate} className="btn-paper inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-semibold">
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMemorials.map((memorial) => (
                            <div key={memorial.id} className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-mist/10 to-mist/20">
                                    {memorial.profile_photo_url ? (
                                        <img src={memorial.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={64} className="text-charcoal/20" />
                                        </div>
                                    )}
                                    {memorial.paid && (
                                        <div className="absolute top-3 right-3">
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-charcoal/50 border border-sand/30">
                                                <Archive size={10} />
                                                Sealed
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-2xl text-charcoal mb-4">{memorial.full_name || 'Untitled'}</h3>
                                    <div className="flex gap-2">
                                        <Link href={`/person/${memorial.id}`} className="btn-paper flex-1 py-2 px-3 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg font-medium text-center text-sm flex items-center justify-center gap-1">
                                            <Eye size={16} /> View
                                        </Link>
                                        <Link href={`/create?id=${memorial.id}`} className="btn-paper flex-1 py-2 px-3 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg font-medium text-center text-sm flex items-center justify-center gap-1">
                                            <Edit size={16} /> Edit
                                        </Link>
                                        <button
                                            onClick={() => setManagingId(memorial.id)}
                                            className="btn-paper py-2 px-3 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal rounded-lg"
                                            title="Manage Connections"
                                        >
                                            <Network size={16} />
                                        </button>
                                        <button onClick={() => softDeleteMemorial(memorial.id)} className="btn-paper py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* NEW: DELETED ARCHIVES SECTION */}
                {deletedMemorials.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/30 animate-fadeIn">
                        <h3 className="text-xl font-serif text-charcoal mb-6 flex items-center gap-2">
                            <Trash2 size={20} className="text-charcoal/40" />
                            Deleted Archives (Trash)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedMemorials.map((memorial) => (
                                <div key={memorial.id} className="bg-sand/10 rounded-xl border border-sand/30 p-4 flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-charcoal">{memorial.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(memorial.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restoreMemorial(memorial.id)}
                                        className="p-2 bg-white border border-mist/30 text-mist rounded-lg hover:bg-mist/10 transition-colors"
                                        title="Restore"
                                    >
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ARCHIVE HEALTH — Status overview */}
                {memorials.some(m => m.paid) && (
                    <div className="mt-16 pt-10 border-t border-sand/30">
                        <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-6 font-medium">
                            Status of your archive
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl border border-sand/30 p-5 flex items-start gap-3">
                                <Archive size={16} className="text-charcoal/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-charcoal/40 mb-0.5">Publication status</p>
                                    <p className="text-sm font-medium text-charcoal">
                                        Sealed — {memorials.filter(m => m.paid).length} active archive{memorials.filter(m => m.paid).length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-sand/30 p-5 flex items-start gap-3">
                                <Clock size={16} className="text-charcoal/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-charcoal/40 mb-0.5">Last modification</p>
                                    <p className="text-sm font-medium text-charcoal">
                                        {memorials.length > 0
                                            ? new Date(memorials[0].updated_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : '—'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl border border-sand/30 p-5 flex items-start gap-3">
                                <Shield size={16} className="text-charcoal/30 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-charcoal/40 mb-0.5">Successor designated</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-charcoal">Not set</p>
                                        <Link
                                            href="/succession/request"
                                            className="text-xs text-mist underline hover:text-mist/80 transition-colors"
                                        >
                                            Set up
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* SUCCESSION MANAGEMENT SECTION */}
                <div className="mt-16 pt-12 border-t border-sand/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <h2 className="font-serif text-3xl text-charcoal mb-4">Account Stewardship</h2>
                            <p className="text-charcoal/60 leading-relaxed">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-fadeIn">
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
                                userId={userId}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}