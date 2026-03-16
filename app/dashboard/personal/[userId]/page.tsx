'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    ChevronRight, Lock, Unlock, Clock, Shield, Search, Filter,
    Archive, Download, Users, Copy, Mail, QrCode, Camera, FileText
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import PreservationStatus from '@/components/PreservationStatus';
import SuccessionSetup from '@/components/SuccessionSetup';

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

    // SECURITY: Force a fresh auth check on mount to prevent bfcache from showing stale state.
    // Without this, a user who upgraded to family can hit back and see the personal dashboard
    // with working "Create Archive" buttons for ~200ms before the popstate revalidation completes.
    const [planVerified, setPlanVerified] = useState(false);
    const verifyRef = useRef(false);

    useEffect(() => {
        if (verifyRef.current) return;
        verifyRef.current = true;
        auth.revalidate().then(() => setPlanVerified(true));
    }, []);

    // Auth guard: verify the URL userId matches the authenticated user
    useEffect(() => {
        if (auth.loading || !planVerified) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        // If the URL userId doesn't match the authenticated user, redirect to their own dashboard
        if (auth.user && auth.user.id !== userId) {
            router.replace(`/dashboard/personal/${auth.user.id}`);
            return;
        }
        // Draft/free users cannot access personal dashboard
        if ((auth.plan === 'draft' || auth.plan === 'none') && auth.user) {
            router.replace(`/dashboard/draft/${auth.user.id}`);
            return;
        }
        // If user's actual plan is family (upgraded), redirect to family dashboard
        if (auth.plan === 'family' && auth.user) {
            router.replace(`/dashboard/family/${auth.user.id}`);
            return;
        }
    }, [auth.loading, auth.authenticated, auth.user, auth.plan, userId, router, planVerified]);

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
        // Double-check: block if user has already upgraded to family
        if (auth.plan === 'family') {
            router.replace(`/dashboard/family/${userId}`);
            return;
        }
        // Block creation if user already has a paid archive (active OR soft-deleted).
        // A soft-deleted paid archive still counts — the plan is permanent.
        const hasAnyPaidArchive = paidArchive || deletedArchives.some(m => m.paid);
        if (hasAnyPaidArchive) {
            alert('You already have a Personal Archive. Each account supports one personal archive. Check your trash if you recently deleted it.');
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

    const permanentDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this archive? This action cannot be undone.')) return;
        if (!confirm('This is irreversible. The archive and all its content will be lost forever. Continue?')) return;
        try {
            const res = await fetch(`/api/memorials/${id}/permanent-delete`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Operation failed');
            loadMemorials();
        } catch {
            alert('Error permanently deleting archive. Please try again.');
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

    // BLOCK RENDERING until auth checks pass — prevents flash of dashboard content
    // for users who don't belong here (draft users, family-upgraded users, etc.)
    const hasPersonalAccess = planVerified && !auth.loading && auth.authenticated && auth.plan === 'personal';
    if (!hasPersonalAccess) {
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
            {showCheckinSuccess && (
                <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} className="text-green-400" />
                    <div>
                        <p className="font-semibold text-sm font-sans text-vault-text">Verification successful</p>
                        <p className="text-xs vault-muted font-sans">Your Dead Man&apos;s Switch timer has been reset for another year.</p>
                    </div>
                </div>
            )}
            {showWelcome && (
                <div className="animate-fadeIn border-b border-vault-border">
                    <div className="max-w-6xl mx-auto px-6 py-4 text-center">
                        <p className="text-sm font-sans vault-muted tracking-wide">
                            When you are ready, everything is here.
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="vault-dark border-b vault-border">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Link href="/choice-pricing" className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                                    <ArrowLeft size={20} className="vault-muted" />
                                </Link>
                                <h1 className="font-serif text-4xl text-vault-text">
                                    {paidArchive?.full_name || 'Personal Archive'}
                                </h1>
                                <span className="live-badge flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold font-sans">
                                    Live
                                </span>
                            </div>
                            {paidArchive && (
                                <p className="vault-muted font-serif text-lg ml-12">
                                    {paidArchive.birth_date && paidArchive.death_date
                                        ? `${new Date(paidArchive.birth_date).getFullYear()} \u2014 ${new Date(paidArchive.death_date).getFullYear()}`
                                        : paidArchive.birth_date
                                        ? `Born ${new Date(paidArchive.birth_date).getFullYear()}`
                                        : ''}
                                </p>
                            )}
                            <p className="text-xs vault-muted font-sans mt-1 ml-12 flex items-center gap-1.5">
                                <Shield size={12} className="text-gold" />
                                Permanently preserved on Arweave
                            </p>
                        </div>
                        {!paidArchive && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-6 py-3 bg-gold text-vault-dark rounded-lg font-semibold font-sans hover:bg-gold/90 transition-all"
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
                        <Loader2 size={48} className="text-gold/30 animate-spin mx-auto mb-4" />
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
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="vault-muted" />
                        </div>
                        <h2 className="font-serif text-3xl text-vault-text mb-3">No active archive yet</h2>
                        <p className="vault-muted mb-8 max-w-md mx-auto leading-relaxed font-sans">
                            Create your Personal Archive to begin preserving your life story, memories, and legacy.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-vault-dark rounded-lg font-semibold font-sans hover:bg-gold/90 transition-all"
                        >
                            <Plus size={20} />
                            Create my archive
                        </button>
                    </div>
                )}

                {/* Unpaid drafts — dark themed */}
                {draftArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t vault-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-serif text-2xl text-vault-text mb-1">Unpublished Drafts</h3>
                                <p className="text-sm vault-muted font-sans">
                                    Started but not yet sealed. Complete one to activate it.
                                </p>
                            </div>
                        </div>

                        {/* Search & Filter for drafts (show when 2+) */}
                        {draftArchives.length > 1 && (
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 vault-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search drafts..."
                                        value={searchDrafts}
                                        onChange={(e) => setSearchDrafts(e.target.value)}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-vault-dark border vault-border focus:border-gold/30 focus:outline-none transition-all text-sm font-sans text-vault-text placeholder:text-vault-muted/50"
                                    />
                                </div>
                                <div className="relative">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 vault-muted" size={18} />
                                    <select
                                        value={filterDrafts}
                                        onChange={(e) => setFilterDrafts(e.target.value as any)}
                                        className="pl-11 pr-8 py-2.5 rounded-xl bg-vault-dark border vault-border focus:border-gold/30 focus:outline-none appearance-none cursor-pointer text-sm font-sans text-vault-text"
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
                                    className="dark-card dark-card-hover rounded-xl overflow-hidden"
                                >
                                    {/* Draft card photo area */}
                                    <div className="relative h-40 bg-vault-dark">
                                        {m.profile_photo_url ? (
                                            <img src={m.profile_photo_url} alt="" className="w-full h-full object-cover opacity-80" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User size={48} className="vault-muted opacity-30" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3">
                                            <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-vault-dark/90 backdrop-blur-sm vault-muted border vault-border font-sans">
                                                <Lock size={10} />
                                                Draft
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-serif text-xl text-vault-text mb-1">
                                            {m.full_name || 'Untitled draft'}
                                        </h4>
                                        <p className="text-xs vault-muted mb-4 flex items-center gap-1 font-sans">
                                            <Clock size={11} />
                                            Last edited {timeAgo(m.updated_at)}
                                        </p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/create?id=${m.id}&mode=personal`}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 hover:bg-white/10 text-vault-text rounded-lg font-medium text-sm transition-all font-sans"
                                            >
                                                <Edit size={14} />
                                                Continue
                                            </Link>
                                            <button
                                                onClick={() => softDelete(m.id)}
                                                className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
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

                {/* Trash — dark themed */}
                {deletedArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t vault-border">
                        <h3 className="text-xl font-serif text-vault-text mb-6 flex items-center gap-2">
                            <Trash2 size={20} className="vault-muted" />
                            Deleted Archives (Trash)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="dark-card rounded-xl p-5 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-vault-text font-sans">{m.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-sans">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(m.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => restore(m.id)}
                                            className="p-2 bg-white/5 border vault-border vault-muted hover:text-vault-text rounded-lg transition-colors"
                                            title="Restore"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button
                                            onClick={() => permanentDelete(m.id)}
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
    const [activeTab, setActiveTab] = useState<'photos' | 'stories' | 'about'>('photos');
    const [linkCopied, setLinkCopied] = useState(false);

    const birthYear = archive.birth_date ? new Date(archive.birth_date).getFullYear() : null;
    const deathYear = archive.death_date ? new Date(archive.death_date).getFullYear() : null;
    const dates = birthYear
        ? deathYear ? `${birthYear} \u2014 ${deathYear}` : `Born ${birthYear}`
        : null;
    const sealedDate = paymentConfirmedAt
        ? new Date(paymentConfirmedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    const arweaveTxId = (archive as any).arweave_tx_id || null;

    const handleCopyLink = () => {
        const url = `${window.location.origin}/person/${archive.id}`;
        navigator.clipboard.writeText(url).then(() => {
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        });
    };

    const handleEmailFamily = () => {
        const url = `${window.location.origin}/person/${archive.id}`;
        const subject = encodeURIComponent(`${archive.full_name || 'Memorial'} - Personal Archive`);
        const body = encodeURIComponent(`I wanted to share this memorial with you: ${url}`);
        window.open(`mailto:?subject=${subject}&body=${body}`);
    };

    const handlePrintQR = () => {
        const url = `${window.location.origin}/person/${archive.id}`;
        window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`, '_blank');
    };

    const tabs = [
        { key: 'photos' as const, label: 'Photos', count: stats.photos },
        { key: 'stories' as const, label: 'Stories', count: stats.memories },
        { key: 'about' as const, label: 'About', count: null },
    ];

    return (
        <div className="flex flex-col gap-8">

            {/* Hero card */}
            <div className="dark-card rounded-xl overflow-hidden preservation-glow">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-64 md:h-auto bg-vault-dark flex-shrink-0">
                        {archive.profile_photo_url ? (
                            <img
                                src={archive.profile_photo_url}
                                alt={archive.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={64} className="vault-muted opacity-30" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h2 className="font-serif text-3xl text-vault-text leading-tight">
                                    {archive.full_name || 'Unnamed Archive'}
                                </h2>
                                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                    <span className="live-badge flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium font-sans">
                                        <Unlock size={12} />
                                        Live
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border vault-border vault-muted bg-white/5 font-medium font-sans">
                                        <Archive size={11} />
                                        Sealed Archive
                                        {sealedDate && <span className="opacity-50 ml-1">· {sealedDate}</span>}
                                    </span>
                                </div>
                            </div>
                            {dates && <p className="vault-muted text-base font-serif mb-1">{dates}</p>}
                            <p className="text-sm vault-muted flex items-center gap-1.5 font-sans">
                                <Shield size={13} className="text-gold" />
                                Permanently preserved on Arweave
                            </p>
                            <p className="text-xs vault-muted flex items-center gap-1.5 mt-1 font-sans">
                                <Clock size={13} />
                                Last edited {timeAgo(archive.updated_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Link
                                href={`/person/${archive.id}`}
                                className="flex items-center gap-1.5 px-5 py-2.5 bg-gold text-vault-dark rounded-lg text-sm font-semibold font-sans hover:bg-gold/90 transition-all"
                            >
                                <Eye size={15} />
                                View archive
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="flex items-center gap-1.5 px-5 py-2.5 border vault-border text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/5 transition-all"
                            >
                                <Edit size={15} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="flex items-center gap-1.5 px-5 py-2.5 border vault-border text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/5 transition-all"
                            >
                                <Share2 size={15} />
                                {copied ? 'Copied!' : 'Share link'}
                            </button>
                            <button
                                onClick={() => onDelete(archive.id)}
                                className="flex items-center gap-1.5 px-3 py-2.5 vault-muted hover:text-red-400 rounded-lg text-sm transition-colors ml-auto"
                                title="Delete archive"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-gold text-vault-dark'
                                    : 'bg-white/5 text-vault-muted hover:bg-white/10 hover:text-vault-text'
                            }`}
                        >
                            {tab.key === 'photos' && <Image size={14} />}
                            {tab.key === 'stories' && <BookOpen size={14} />}
                            {tab.key === 'about' && <User size={14} />}
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    activeTab === tab.key ? 'bg-vault-dark/20 text-vault-dark' : 'bg-white/10 vault-muted'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content - stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DarkStatCard icon={Image} count={stats.photos} label="Photos" />
                    <DarkStatCard icon={Video} count={stats.videos} label="Videos" />
                    <DarkStatCard icon={Heart} count={stats.memories} label="Memories" />
                    <DarkStatCard icon={BookOpen} count={stats.chapters} label="Chapters" />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dark-card rounded-xl p-6">
                <h3 className="text-xs uppercase tracking-widest vault-muted mb-4 font-medium font-sans">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=7`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gold/10 text-gold rounded-lg text-sm font-medium font-sans hover:bg-gold/20 transition-all"
                    >
                        <Plus size={14} />
                        Add Memory
                    </Link>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=6`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/10 transition-all border vault-border"
                    >
                        <FileText size={14} />
                        Edit Biography
                    </Link>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=8`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/10 transition-all border vault-border"
                    >
                        <Camera size={14} />
                        Manage Photos
                    </Link>
                </div>
            </div>

            {/* Preservation Status */}
            <PreservationStatus
                memorialId={archive.id}
                arweaveTxId={arweaveTxId}
                fullName={archive.full_name || ''}
                birthDate={archive.birth_date || ''}
                deathDate={archive.death_date || null}
                planType="personal"
            />

            {/* Succession Planning */}
            <SuccessionSetup
                memorialId={archive.id}
            />

            {/* Share Panel */}
            <div className="dark-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                        <Share2 size={16} className="text-gold" />
                    </div>
                    <h3 className="text-sm font-semibold text-vault-text font-sans">Share</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/10 transition-all border vault-border"
                    >
                        <Copy size={14} />
                        {linkCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                        onClick={handleEmailFamily}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/10 transition-all border vault-border"
                    >
                        <Mail size={14} />
                        Email to Family
                    </button>
                    <button
                        onClick={handlePrintQR}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 text-vault-text rounded-lg text-sm font-medium font-sans hover:bg-white/10 transition-all border vault-border"
                    >
                        <QrCode size={14} />
                        Print QR Code
                    </button>
                </div>
            </div>

            {/* Archive Health */}
            <div className="dark-card rounded-xl p-6">
                <h3 className="text-xs uppercase tracking-widest vault-muted mb-5 font-medium font-sans">
                    Status of your archive
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <DarkHealthRow
                        label="Publication status"
                        value="Sealed"
                        icon={<Archive size={14} />}
                    />
                    <DarkHealthRow
                        label="Sealed on"
                        value={sealedDate || 'Unknown'}
                        icon={<Clock size={14} />}
                    />
                    <DarkHealthRow
                        label="Last modification"
                        value={timeAgo(archive.updated_at)}
                        icon={<Edit size={14} />}
                    />
                    <DarkHealthRow
                        label="Successor designated"
                        value="Not set"
                        icon={<Shield size={14} />}
                        action={
                            <Link
                                href="/succession/request"
                                className="text-xs text-gold underline hover:text-gold/80 transition-colors font-sans"
                            >
                                Set up
                            </Link>
                        }
                    />
                    <DarkHealthRow
                        label="Witnesses invited"
                        value={`${stats.memories} contributor${stats.memories !== 1 ? 's' : ''}`}
                        icon={<Users size={14} />}
                    />
                    <DarkHealthRow
                        label="Ark export"
                        value="Generate a portable copy"
                        icon={<Download size={14} />}
                        action={
                            <Link
                                href={`/api/arche/generate?id=${archive.id}`}
                                className="text-xs text-gold underline hover:text-gold/80 transition-colors font-sans"
                                target="_blank"
                            >
                                Download
                            </Link>
                        }
                    />
                </div>
            </div>

            {/* Action cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Continue editing */}
                <div className="dark-card dark-card-hover rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Edit size={20} className="vault-muted" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-vault-text mb-1">Continue Editing</h3>
                            <p className="text-sm vault-muted leading-relaxed mb-4 font-sans">
                                Add and update the sections of your archive.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="inline-flex items-center gap-2 px-4 py-2 border vault-border text-vault-text text-sm rounded-lg font-medium font-sans hover:bg-white/5 transition-all"
                            >
                                <Edit size={14} />
                                Open editor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Witnesses */}
                <div className="dark-card dark-card-hover rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="vault-muted" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-vault-text mb-1">Witnesses & Contributors</h3>
                            <p className="text-sm vault-muted leading-relaxed mb-4 font-sans">
                                Invite people to contribute memories, photos, and stories.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal&step=7`}
                                className="inline-flex items-center gap-2 px-4 py-2 border vault-border text-vault-text text-sm rounded-lg font-medium font-sans hover:bg-white/5 transition-all"
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

function DarkStatCard({ icon: Icon, count, label }: { icon: any; count: number; label: string }) {
    return (
        <div className="dark-card dark-card-hover rounded-xl p-5">
            <Icon size={22} className="vault-muted mb-3" />
            <div className="font-serif text-3xl text-vault-text leading-none mb-1">{count}</div>
            <div className="text-xs vault-muted font-medium font-sans">{label}</div>
        </div>
    );
}

function DarkHealthRow({
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
            <div className="mt-0.5 vault-muted flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs vault-muted mb-0.5 font-sans">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-vault-text font-medium truncate font-sans">{value}</p>
                    {action && action}
                </div>
            </div>
        </div>
    );
}
