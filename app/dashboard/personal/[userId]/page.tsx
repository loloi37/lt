'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    ChevronRight, Lock, Unlock, Clock, Shield, Search, Filter,
    Archive, Download, Users
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';

function computeStats(memorial: Memorial) {
    const step7 = memorial.step7 as any;
    const step8 = memorial.step8 as any;
    const step9 = memorial.step9 as any;
    const step6 = memorial.step6 as any;
    return {
        photos: (step8?.gallery?.length || 0) + (step8?.interactiveGallery?.length || 0),
        videos: step9?.videos?.length || 0,
        memories: (step7?.sharedMemories?.length || 0) + (step7?.impactStories?.length || 0),
        chapters: step6?.lifeChapters?.length || 0,
    };
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
}

async function apiSoftDelete(id: string, action: 'delete' | 'restore') {
    const res = await fetch(`/api/memorials/${id}/soft-delete`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error('Operation failed');
}

export default function PersonalDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;
    const auth = useAuth();
    const router = useRouter();

    const [paidArchive, setPaidArchive] = useState<Memorial | null>(null);
    const [draftArchives, setDraftArchives] = useState<Memorial[]>([]);
    const [deletedArchives, setDeletedArchives] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [copied, setCopied] = useState(false);
    const [searchDrafts, setSearchDrafts] = useState('');
    const [filterDrafts, setFilterDrafts] = useState<'all' | 'recent' | 'oldest'>('all');
    const searchParams = useSearchParams();

    // Auth guard: verify the URL userId matches the authenticated user
    useEffect(() => {
        if (auth.loading) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        // If the URL userId doesn't match the authenticated user, redirect to their own dashboard
        if (auth.user && auth.user.id !== userId) {
            router.replace(`/dashboard/personal/${auth.user.id}`);
            return;
        }
        // If user's actual plan is family (upgraded), redirect to family dashboard
        if (auth.plan === 'family' && auth.user) {
            router.replace(`/dashboard/family/${auth.user.id}`);
            return;
        }
    }, [auth.loading, auth.authenticated, auth.user, auth.plan, userId, router]);

    useEffect(() => {
        fetch('/api/user/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });
        if (searchParams.get('checkin') === 'true') {
            setShowCheckinSuccess(true);
            window.history.replaceState({}, '', `/dashboard/personal/${userId}`);
            setTimeout(() => setShowCheckinSuccess(false), 5000);
        }
        if (searchParams.get('welcome') === 'true') {
            setShowWelcome(true);
            window.history.replaceState({}, '', `/dashboard/personal/${userId}`);
            setTimeout(() => setShowWelcome(false), 5000);
        }
        loadMemorials();
    }, [userId, searchParams]);

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

    const loadMemorials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memorials')
            .select('*, payment_confirmed_at')
            .eq('user_id', userId)
            .eq('mode', 'personal')
            .order('updated_at', { ascending: false });

        if (error) console.error('Error:', error);
        if (data) {
            const active = data.filter(m => !m.deleted);
            const deleted = data.filter(m => m.deleted);
            setPaidArchive(active.find(m => m.paid) || null);
            setDraftArchives(active.filter(m => !m.paid));
            setDeletedArchives(deleted);
        }
        setLoading(false);
    };

    const handleCreate = () => {
        if (paidArchive) {
            alert('You already have an active Personal Archive. Each account supports one personal archive.');
            return;
        }
        window.location.href = '/create?mode=personal';
    };

    const softDelete = async (id: string) => {
        if (!confirm('Move this archive to the trash? It will be permanently deleted after 30 days.')) return;
        try {
            await apiSoftDelete(id, 'delete');
            loadMemorials();
        } catch {
            alert('Error deleting archive. Please try again.');
        }
    };

    const restore = async (id: string) => {
        try {
            await apiSoftDelete(id, 'restore');
            loadMemorials();
        } catch {
            alert('Error restoring archive. Please try again.');
        }
    };

    const getDaysRemaining = (deletedAt: string) => {
        const expiry = new Date(new Date(deletedAt).getTime() + 30 * 86400000);
        return Math.max(Math.ceil((expiry.getTime() - Date.now()) / 86400000), 0);
    };

    const copyShareLink = (id: string) => {
        const url = `${window.location.origin}/person/${id}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const filteredDrafts = draftArchives.filter(m => {
        const matchesSearch = (m.full_name || '').toLowerCase().includes(searchDrafts.toLowerCase());
        return matchesSearch;
    }).sort((a, b) => {
        if (filterDrafts === 'recent') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
        if (filterDrafts === 'oldest') return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        return 0;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-sand/5 via-ivory to-sand/10">
            {showCheckinSuccess && (
                <div className="bg-charcoal text-ivory px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-semibold text-sm">Verification successful</p>
                        <p className="text-xs opacity-70">Your Dead Man&apos;s Switch timer has been reset for another year.</p>
                    </div>
                </div>
            )}
            {showWelcome && (
                <div className="animate-fadeIn" style={{ backgroundColor: '#1a2332' }}>
                    <div className="max-w-6xl mx-auto px-6 py-4 text-center">
                        <p className="text-sm" style={{ color: 'rgba(253,246,240,0.60)', letterSpacing: '0.04em' }}>
                            When you are ready, everything is here.
                        </p>
                    </div>
                </div>
            )}

            {/* Header — styled like Family */}
            <div className="bg-white border-b border-sand/30 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link href="/choice-pricing" className="p-2 hover:bg-sand/10 rounded-lg transition-colors">
                                    <ArrowLeft size={20} className="text-charcoal/60" />
                                </Link>
                                <h1 className="font-serif text-4xl text-charcoal">Personal Archive</h1>
                            </div>
                            <p className="text-charcoal/60">Your private dashboard</p>
                            <p className="text-xs text-charcoal/40 mt-1">ID: {userId.slice(0, 8)}...</p>
                        </div>
                        {!paidArchive && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-charcoal to-charcoal/90 text-ivory rounded-lg font-semibold hover:shadow-lg transition-all"
                            >
                                <Plus size={20} />
                                Create Archive
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="text-charcoal/30 animate-spin mx-auto mb-4" />
                    </div>
                ) : paidArchive ? (
                    <ActiveArchive
                        archive={paidArchive}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                        userId={userId}
                        paymentConfirmedAt={paidArchive.payment_confirmed_at ?? null}
                    />
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-sand/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-charcoal/20" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">No active archive yet</h2>
                        <p className="text-charcoal/50 mb-8 max-w-md mx-auto leading-relaxed">
                            Create your Personal Archive to begin preserving your life story, memories, and legacy.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-charcoal to-charcoal/90 text-ivory rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            <Plus size={20} />
                            Create my archive
                        </button>
                    </div>
                )}

                {/* Upgrade to Family prompt — shown after completing at least 2 paths */}
                {paidArchive && (
                    <div className="mt-10 bg-gradient-to-r from-stone/5 to-mist/5 border border-stone/15 rounded-2xl p-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <p className="font-serif text-lg text-charcoal mb-1">Would you like to create an archive for another family member?</p>
                                <p className="text-sm text-charcoal/50">
                                    Upgrade to the Family plan. You only pay the difference: <strong>$1,470</strong> (Family $2,940 &minus; Personal $1,470 already paid).
                                </p>
                            </div>
                            <button
                                onClick={async () => {
                                    try {
                                        const res = await fetch('/api/upgrade-plan', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ userId, targetPlan: 'family' }),
                                        });
                                        const data = await res.json();
                                        if (data.url) window.location.href = data.url;
                                        else alert(data.error || 'Could not start upgrade');
                                    } catch {
                                        alert('Upgrade failed. Please try again.');
                                    }
                                }}
                                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-stone hover:bg-stone/90 text-ivory rounded-lg font-semibold transition-all"
                            >
                                <Users size={18} />
                                Discover the Family plan
                            </button>
                        </div>
                    </div>
                )}

                {/* Unpaid drafts — card grid like Family */}
                {draftArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/30">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-serif text-2xl text-charcoal mb-1">Unpublished Drafts</h3>
                                <p className="text-sm text-charcoal/50">
                                    Started but not yet sealed. Complete one to activate it.
                                </p>
                            </div>
                        </div>

                        {/* Search & Filter for drafts (show when 2+) */}
                        {draftArchives.length > 1 && (
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search drafts..."
                                        value={searchDrafts}
                                        onChange={(e) => setSearchDrafts(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl border-2 border-sand/20 focus:border-charcoal/30 focus:outline-none transition-all text-sm"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
                                    <select
                                        value={filterDrafts}
                                        onChange={(e) => setFilterDrafts(e.target.value as any)}
                                        className="pl-11 pr-8 py-2.5 rounded-xl border-2 border-sand/20 focus:border-charcoal/30 focus:outline-none bg-white appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="all">All Drafts</option>
                                        <option value="recent">Most Recent</option>
                                        <option value="oldest">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDrafts.map(m => (
                                <div
                                    key={m.id}
                                    className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden"
                                >
                                    {/* Draft card photo area */}
                                    <div className="relative h-40 bg-gradient-to-br from-sand/10 to-sand/20">
                                        {m.profile_photo_url ? (
                                            <img src={m.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={48} className="text-charcoal/15" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-charcoal/60 border border-sand/30">
                                                <Lock size={10} />
                                                Draft
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-serif text-xl text-charcoal mb-1">
                                            {m.full_name || 'Untitled draft'}
                                        </h4>
                                        <p className="text-xs text-charcoal/40 mb-4 flex items-center gap-1">
                                            <Clock size={11} />
                                            Last edited {timeAgo(m.updated_at)}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/create?id=${m.id}&mode=personal`}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal rounded-lg font-medium text-sm transition-all"
                                            >
                                                <Edit size={14} />
                                                Continue
                                            </Link>
                                            <button
                                                onClick={() => softDelete(m.id)}
                                                className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                title="Delete draft"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trash — styled like Family */}
                {deletedArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/30">
                        <h3 className="text-xl font-serif text-charcoal mb-6 flex items-center gap-2">
                            <Trash2 size={20} className="text-charcoal/40" />
                            Deleted Archives (Trash)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="bg-sand/10 rounded-xl border border-sand/30 p-5 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-charcoal">{m.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(m.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restore(m.id)}
                                        className="p-2 bg-white border border-sand/30 text-charcoal/50 hover:text-charcoal rounded-lg transition-colors"
                                        title="Restore"
                                    >
                                        <RefreshCcw size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Succession & Stewardship — styled like Family */}
                <div className="mt-16 pt-12 border-t border-sand/20">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-1">
                            <h2 className="font-serif text-3xl text-charcoal mb-4">Account Stewardship</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Legacy is not just what you create, but how you ensure it survives. Designate someone to manage and transmit this archive when the time comes.
                            </p>
                        </div>
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            {/* Succession card */}
                            <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-sand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Shield size={24} className="text-charcoal/40" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-xl text-charcoal mb-2">Succession</h3>
                                        <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                                            Choose a trusted person who will inherit stewardship of your archive. They will be able to manage, update, and preserve it in your name.
                                        </p>
                                        <Link
                                            href="/succession/request"
                                            className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-charcoal/15 text-charcoal rounded-lg text-sm font-medium hover:bg-sand/10 transition-all"
                                        >
                                            <ChevronRight size={16} />
                                            Set up succession
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Dead Man's Switch card */}
                            <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-sand/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Clock size={24} className="text-charcoal/40" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-serif text-xl text-charcoal mb-2">Dead Man&apos;s Switch</h3>
                                        <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                                            An annual check-in ensures your archive is cared for. If no check-in is received, your designated successor will be notified and granted access.
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-charcoal/40 flex items-center gap-1.5">
                                                <CheckCircle size={14} className="text-sage" />
                                                Active — next check-in in 12 months
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ActiveArchive({
    archive,
    onDelete,
    onCopyLink,
    copied,
    userId,
    paymentConfirmedAt,
}: {
    archive: Memorial;
    onDelete: (id: string) => void;
    onCopyLink: (id: string) => void;
    copied: boolean;
    userId: string;
    paymentConfirmedAt: string | null;
}) {
    const stats = computeStats(archive);
    const birthYear = archive.birth_date ? new Date(archive.birth_date).getFullYear() : null;
    const deathYear = archive.death_date ? new Date(archive.death_date).getFullYear() : null;
    const dates = birthYear
        ? deathYear ? `${birthYear} – ${deathYear}` : `Born ${birthYear}`
        : null;
    const sealedDate = paymentConfirmedAt
        ? new Date(paymentConfirmedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    return (
        <div className="flex flex-col gap-8">

            {/* Hero card — wider with larger photo like Family */}
            <div className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-64 md:h-auto bg-gradient-to-br from-sand/10 to-sand/20 flex-shrink-0">
                        {archive.profile_photo_url ? (
                            <img
                                src={archive.profile_photo_url}
                                alt={archive.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={64} className="text-charcoal/15" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h2 className="font-serif text-3xl text-charcoal leading-tight">
                                    {archive.full_name || 'Unnamed Archive'}
                                </h2>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border-2 bg-sage/5 text-sage border-sage/20 font-medium">
                                        <Unlock size={12} />
                                        Active
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-charcoal/15 text-charcoal/50 bg-sand/10 font-medium">
                                        <Archive size={11} />
                                        Sealed Archive
                                        {sealedDate && <span className="text-charcoal/35 ml-1">· {sealedDate}</span>}
                                    </span>
                                </div>
                            </div>
                            {dates && <p className="text-charcoal/50 text-base mb-1">{dates}</p>}
                            <p className="text-sm text-charcoal/35 flex items-center gap-1.5">
                                <Clock size={13} />
                                Last edited {timeAgo(archive.updated_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Link
                                href={`/person/${archive.id}`}
                                className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-charcoal to-charcoal/90 text-ivory rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
                            >
                                <Eye size={15} />
                                View archive
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-charcoal/15 text-charcoal rounded-lg text-sm font-medium hover:bg-sand/10 transition-all"
                            >
                                <Edit size={15} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-charcoal/15 text-charcoal rounded-lg text-sm font-medium hover:bg-sand/10 transition-all"
                            >
                                <Share2 size={15} />
                                {copied ? 'Copied!' : 'Share link'}
                            </button>
                            <button
                                onClick={() => onDelete(archive.id)}
                                className="flex items-center gap-1.5 px-3 py-2.5 text-charcoal/30 hover:text-red-500 rounded-lg text-sm transition-colors ml-auto"
                                title="Delete archive"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content stats — grid cards like Family style */}
            <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-4 font-medium">Archive Content</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Image} count={stats.photos} label="Photos" color="from-sand/10 to-sand/5" />
                    <StatCard icon={Video} count={stats.videos} label="Videos" color="from-mist/10 to-mist/5" />
                    <StatCard icon={Heart} count={stats.memories} label="Memories" color="from-terracotta/10 to-terracotta/5" />
                    <StatCard icon={BookOpen} count={stats.chapters} label="Chapters" color="from-sage/10 to-sage/5" />
                </div>
            </div>

            {/* Archive Health — always visible, fact-based, no score */}
            <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-5 font-medium">
                    Status of your archive
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <HealthRow
                        label="Publication status"
                        value="Sealed"
                        icon={<Archive size={14} />}
                    />
                    <HealthRow
                        label="Sealed on"
                        value={sealedDate || 'Unknown'}
                        icon={<Clock size={14} />}
                    />
                    <HealthRow
                        label="Last modification"
                        value={timeAgo(archive.updated_at)}
                        icon={<Edit size={14} />}
                    />
                    <HealthRow
                        label="Successor designated"
                        value="Not set"
                        icon={<Shield size={14} />}
                        action={
                            <Link
                                href="/succession/request"
                                className="text-xs text-mist underline hover:text-mist/80 transition-colors"
                            >
                                Set up
                            </Link>
                        }
                    />
                    <HealthRow
                        label="Witnesses invited"
                        value={`${stats.memories} contributor${stats.memories !== 1 ? 's' : ''}`}
                        icon={<Users size={14} />}
                    />
                    <HealthRow
                        label="Ark export"
                        value="Generate a portable copy"
                        icon={<Download size={14} />}
                        action={
                            <Link
                                href={`/api/arche/generate?id=${archive.id}`}
                                className="text-xs text-mist underline hover:text-mist/80 transition-colors"
                                target="_blank"
                            >
                                Download
                            </Link>
                        }
                    />
                </div>
            </div>

            {/* Action cards grid — 2 columns like Family's sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Continue editing */}
                <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-charcoal/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Edit size={20} className="text-charcoal/40" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">Continue Editing</h3>
                            <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                                Add and update the sections of your archive.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-charcoal/15 text-charcoal text-sm rounded-lg font-medium hover:bg-sand/10 transition-all"
                            >
                                <Edit size={14} />
                                Open editor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Witnesses */}
                <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-charcoal/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-charcoal/40" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">Witnesses & Contributors</h3>
                            <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                                Invite people to contribute memories, photos, and stories.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal&step=7`}
                                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-charcoal/15 text-charcoal text-sm rounded-lg font-medium hover:bg-sand/10 transition-all"
                            >
                                <Plus size={14} />
                                Invite witnesses
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, count, label, color }: { icon: any; count: number; label: string; color: string }) {
    return (
        <div className={`bg-gradient-to-br ${color} rounded-xl border border-sand/20 p-5`}>
            <Icon size={22} className="text-charcoal/30 mb-3" />
            <div className="font-serif text-3xl text-charcoal leading-none mb-1">{count}</div>
            <div className="text-xs text-charcoal/45 font-medium">{label}</div>
        </div>
    );
}

function HealthRow({
    label,
    value,
    icon,
    action,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 text-charcoal/30 flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-charcoal/40 mb-0.5">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-charcoal font-medium truncate">{value}</p>
                    {action && action}
                </div>
            </div>
        </div>
    );
}
