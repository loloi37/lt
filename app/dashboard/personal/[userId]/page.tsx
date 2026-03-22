'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    ChevronRight, Unlock, Clock, Shield,
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

    const [activeArchive, setActiveArchive] = useState<Memorial | null>(null);
    const [deletedArchives, setDeletedArchives] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [copied, setCopied] = useState(false);
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
            // Show any non-deleted personal archive (paid or unpaid) as the active one
            setActiveArchive(active.find(m => m.paid) || active[0] || null);
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
        // Single-archive slot: block if active paid archive exists
        if (activeArchive) {
            alert('You already have an active Personal Archive. Each account supports one personal archive.');
            return;
        }
        // If there's a removed archive, the slot is free — user can create a new one
        window.location.href = '/create?mode=personal';
    };

    const softDelete = async (id: string) => {
        // Block deletion of preserved (blockchain) archives
        if (activeArchive?.id === id && (activeArchive as any).preservation_state === 'preserved') {
            alert('This archive has been permanently preserved on the blockchain and cannot be removed.');
            return;
        }
        if (!confirm('Move this archive to Removed Archives? It will be permanently deleted after 30 days.')) return;
        try {
            await apiSoftDelete(id, 'delete');
            loadMemorials();
        } catch {
            alert('Error removing archive. Please try again.');
        }
    };

    const restore = async (id: string) => {
        // Single-archive slot: only allow restore if no active paid archive
        if (activeArchive) {
            alert('You already have an active archive. Remove it first before restoring another.');
            return;
        }
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

    // Check if the active archive is preserved (blockchain)
    const isPreserved = activeArchive && (activeArchive as any).preservation_state === 'preserved';

    // BLOCK RENDERING until auth checks pass — prevents flash of dashboard content
    // for users who don't belong here (draft users, family-upgraded users, etc.)
    const hasPersonalAccess = planVerified && !auth.loading && auth.authenticated && auth.plan === 'personal';
    if (!hasPersonalAccess) {
        return (
            <div className="bg-ivory min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60 text-sm font-sans">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-ivory min-h-screen text-charcoal">
            {showCheckinSuccess && (
                <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} className="text-green-600" />
                    <div>
                        <p className="font-semibold text-sm font-sans text-charcoal">Verification successful</p>
                        <p className="text-xs text-charcoal/60 font-sans">Your Dead Man&apos;s Switch timer has been reset for another year.</p>
                    </div>
                </div>
            )}
            {showWelcome && (
                <div className="animate-fadeIn border-b border-sand/40">
                    <div className="max-w-6xl mx-auto px-6 py-4 text-center">
                        <p className="text-sm font-sans text-charcoal/60 tracking-wide">
                            When you are ready, everything is here.
                        </p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-sand/40">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <Link href="/choice-pricing" className="p-2 hover:bg-charcoal/5 rounded-lg transition-colors">
                                    <ArrowLeft size={20} className="text-charcoal/60" />
                                </Link>
                                <h1 className="font-serif text-4xl text-charcoal">
                                    {activeArchive?.full_name || 'Personal Archive'}
                                </h1>
                                <span className="bg-mist/10 text-mist border border-mist/30 flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-semibold font-sans">
                                    Live
                                </span>
                            </div>
                            {activeArchive && (
                                <p className="text-charcoal/60 font-serif text-lg ml-12">
                                    {activeArchive.birth_date && activeArchive.death_date
                                        ? `${new Date(activeArchive.birth_date).getFullYear()} \u2014 ${new Date(activeArchive.death_date).getFullYear()}`
                                        : activeArchive.birth_date
                                        ? `Born ${new Date(activeArchive.birth_date).getFullYear()}`
                                        : ''}
                                </p>
                            )}
                            <p className="text-xs text-charcoal/60 font-sans mt-1 ml-12 flex items-center gap-1.5">
                                <Shield size={12} className="text-mist" />
                                Permanently preserved on Arweave
                            </p>
                        </div>
                        {!activeArchive && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-lg font-semibold font-sans hover:bg-charcoal/85 transition-all"
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
                        <Loader2 size={48} className="text-charcoal/20 animate-spin mx-auto mb-4" />
                    </div>
                ) : activeArchive ? (
                    <ActiveArchive
                        archive={activeArchive}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                        userId={userId}
                        paymentConfirmedAt={activeArchive.payment_confirmed_at ?? null}
                    />
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-charcoal/40" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">No active archive yet</h2>
                        <p className="text-charcoal/60 mb-8 max-w-md mx-auto leading-relaxed font-sans">
                            Create your Personal Archive to begin preserving your life story, memories, and legacy.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-lg font-semibold font-sans hover:bg-charcoal/85 transition-all"
                        >
                            <Plus size={20} />
                            Create my archive
                        </button>
                    </div>
                )}

                {/* Removed Archives */}
                {deletedArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/40">
                        <h3 className="text-xl font-serif text-charcoal mb-2 flex items-center gap-2">
                            <Archive size={20} className="text-charcoal/60" />
                            Removed Archives
                        </h3>
                        <p className="text-sm text-charcoal/60 font-sans mb-6">
                            Archives are kept for 30 days before permanent deletion.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">
                            {deletedArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="bg-white border border-sand/40 rounded-xl p-5 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-charcoal font-sans">{m.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1 font-sans">
                                            <AlertTriangle size={12} />
                                            {getDaysRemaining(m.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => restore(m.id)}
                                            className="p-2 bg-charcoal/5 border border-sand/40 text-charcoal/60 hover:text-charcoal rounded-lg transition-colors"
                                            title="Restore"
                                        >
                                            <RefreshCcw size={18} />
                                        </button>
                                        <button
                                            onClick={() => permanentDelete(m.id)}
                                            className="p-2 bg-red-500/10 border border-red-500/20 text-red-600 hover:text-red-700 hover:bg-red-500/20 rounded-lg transition-colors"
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
            <div className="bg-white border border-sand/40 rounded-xl overflow-hidden shadow-sm">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 h-64 md:h-auto bg-charcoal/5 flex-shrink-0">
                        {archive.profile_photo_url ? (
                            <img
                                src={archive.profile_photo_url}
                                alt={archive.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={64} className="text-charcoal/20" />
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
                                    <span className="bg-mist/10 text-mist border border-mist/30 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium font-sans">
                                        <Unlock size={12} />
                                        Live
                                    </span>
                                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-sand/40 text-charcoal/60 bg-charcoal/5 font-medium font-sans">
                                        <Archive size={11} />
                                        Active Archive
                                        {sealedDate && <span className="opacity-50 ml-1">· {sealedDate}</span>}
                                    </span>
                                    {(archive as any).preservation_state === 'preserved' && (
                                        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-mist/30 text-mist bg-mist/5 font-medium font-sans">
                                            <Shield size={11} />
                                            Preserved
                                        </span>
                                    )}
                                </div>
                            </div>
                            {dates && <p className="text-charcoal/60 text-base font-serif mb-1">{dates}</p>}
                            <p className="text-sm text-charcoal/60 flex items-center gap-1.5 font-sans">
                                <Shield size={13} className="text-mist" />
                                Permanently preserved on Arweave
                            </p>
                            <p className="text-xs text-charcoal/60 flex items-center gap-1.5 mt-1 font-sans">
                                <Clock size={13} />
                                Last edited {timeAgo(archive.updated_at)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Link
                                href={`/person/${archive.id}`}
                                className="flex items-center gap-1.5 px-5 py-2.5 bg-charcoal text-white rounded-lg text-sm font-semibold font-sans hover:bg-charcoal/85 transition-all"
                            >
                                <Eye size={15} />
                                View archive
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="flex items-center gap-1.5 px-5 py-2.5 border border-sand/40 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/5 transition-all"
                            >
                                <Edit size={15} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="flex items-center gap-1.5 px-5 py-2.5 border border-sand/40 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/5 transition-all"
                            >
                                <Share2 size={15} />
                                {copied ? 'Copied!' : 'Share link'}
                            </button>
                            {(archive as any).preservation_state !== 'preserved' && (
                                <button
                                    onClick={() => onDelete(archive.id)}
                                    className="flex items-center gap-1.5 px-3 py-2.5 text-charcoal/60 hover:text-red-600 rounded-lg text-sm transition-colors ml-auto"
                                    title="Remove archive"
                                >
                                    <Trash2 size={15} />
                                </button>
                            )}
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
                                    ? 'bg-charcoal text-white'
                                    : 'bg-charcoal/5 text-charcoal/60 hover:bg-charcoal/10 hover:text-charcoal'
                            }`}
                        >
                            {tab.key === 'photos' && <Image size={14} />}
                            {tab.key === 'stories' && <BookOpen size={14} />}
                            {tab.key === 'about' && <User size={14} />}
                            {tab.label}
                            {tab.count !== null && (
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-charcoal/10 text-charcoal/60'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab content - stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Image} count={stats.photos} label="Photos" />
                    <StatCard icon={Video} count={stats.videos} label="Videos" />
                    <StatCard icon={Heart} count={stats.memories} label="Memories" />
                    <StatCard icon={BookOpen} count={stats.chapters} label="Chapters" />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-sand/40 rounded-xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-charcoal/60 mb-4 font-medium font-sans">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=7`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-mist/10 text-mist rounded-lg text-sm font-medium font-sans hover:bg-mist/20 transition-all"
                    >
                        <Plus size={14} />
                        Add Memory
                    </Link>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=6`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/10 transition-all border border-sand/40"
                    >
                        <FileText size={14} />
                        Edit Biography
                    </Link>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=8`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/10 transition-all border border-sand/40"
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
            <div className="bg-white border border-sand/40 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-mist/10 rounded-lg flex items-center justify-center">
                        <Share2 size={16} className="text-mist" />
                    </div>
                    <h3 className="text-sm font-semibold text-charcoal font-sans">Share</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/10 transition-all border border-sand/40"
                    >
                        <Copy size={14} />
                        {linkCopied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                        onClick={handleEmailFamily}
                        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/10 transition-all border border-sand/40"
                    >
                        <Mail size={14} />
                        Email to Family
                    </button>
                    <button
                        onClick={handlePrintQR}
                        className="flex items-center gap-2 px-4 py-2.5 bg-charcoal/5 text-charcoal rounded-lg text-sm font-medium font-sans hover:bg-charcoal/10 transition-all border border-sand/40"
                    >
                        <QrCode size={14} />
                        Print QR Code
                    </button>
                </div>
            </div>

            {/* Archive Health */}
            <div className="bg-white border border-sand/40 rounded-xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-charcoal/60 mb-5 font-medium font-sans">
                    Status of your archive
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <HealthRow
                        label="Publication status"
                        value={(archive as any).preservation_state === 'preserved' ? 'Preserved' : 'Active'}
                        icon={<Archive size={14} />}
                    />
                    <HealthRow
                        label="Activated on"
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
                                className="text-xs text-mist underline hover:text-mist/80 transition-colors font-sans"
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
                                className="text-xs text-mist underline hover:text-mist/80 transition-colors font-sans"
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
                <div className="bg-white border border-sand/40 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-charcoal/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Edit size={20} className="text-charcoal/60" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">Continue Editing</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed mb-4 font-sans">
                                Add and update the sections of your archive.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-sand/40 text-charcoal text-sm rounded-lg font-medium font-sans hover:bg-charcoal/5 transition-all"
                            >
                                <Edit size={14} />
                                Open editor
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Witnesses */}
                <div className="bg-white border border-sand/40 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                        <div className="w-11 h-11 bg-charcoal/5 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Heart size={20} className="text-charcoal/60" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-serif text-lg text-charcoal mb-1">Witnesses & Contributors</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed mb-4 font-sans">
                                Invite people to contribute memories, photos, and stories.
                            </p>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal&step=7`}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-sand/40 text-charcoal text-sm rounded-lg font-medium font-sans hover:bg-charcoal/5 transition-all"
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

function StatCard({ icon: Icon, count, label }: { icon: any; count: number; label: string }) {
    return (
        <div className="bg-white border border-sand/40 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <Icon size={22} className="text-charcoal/60 mb-3" />
            <div className="font-serif text-3xl text-charcoal leading-none mb-1">{count}</div>
            <div className="text-xs text-charcoal/60 font-medium font-sans">{label}</div>
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
            <div className="mt-0.5 text-charcoal/60 flex-shrink-0">{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-charcoal/60 mb-0.5 font-sans">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm text-charcoal font-medium truncate font-sans">{value}</p>
                    {action && action}
                </div>
            </div>
        </div>
    );
}
