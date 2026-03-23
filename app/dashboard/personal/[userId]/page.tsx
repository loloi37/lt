'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2,
    Clock, Shield,
    Archive, Download, Copy, Mail, QrCode, Camera, FileText,
    ChevronRight, ExternalLink
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
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
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

    const [planVerified, setPlanVerified] = useState(false);
    const verifyRef = useRef(false);

    useEffect(() => {
        if (verifyRef.current) return;
        verifyRef.current = true;
        auth.revalidate().then(() => setPlanVerified(true));
    }, []);

    useEffect(() => {
        if (auth.loading || !planVerified) return;
        if (!auth.authenticated) {
            router.replace('/login?next=/dashboard');
            return;
        }
        if (auth.user && auth.user.id !== userId) {
            router.replace(`/dashboard/personal/${auth.user.id}`);
            return;
        }
        if ((auth.plan === 'draft' || auth.plan === 'none') && auth.user) {
            router.replace(`/dashboard/draft/${auth.user.id}`);
            return;
        }
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
            setActiveArchive(active.find(m => m.paid) || active[0] || null);
            setDeletedArchives(deleted);
        }
        setLoading(false);
    };

    const handleCreate = () => {
        if (auth.plan === 'family') {
            router.replace(`/dashboard/family/${userId}`);
            return;
        }
        if (activeArchive) {
            alert('You already have an active Personal Archive. Each account supports one personal archive.');
            return;
        }
        window.location.href = '/create?mode=personal';
    };

    const softDelete = async (id: string) => {
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

    const hasPersonalAccess = planVerified && !auth.loading && auth.authenticated && auth.plan === 'personal';
    if (!hasPersonalAccess) {
        return (
            <div className="aurora-bg min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={28} className="text-aurora-muted/50 animate-spin mx-auto mb-4" />
                    <p className="text-aurora-muted text-xs tracking-[0.2em] uppercase font-serif italic">Verifying access</p>
                </div>
            </div>
        );
    }

    return (
        <div className="aurora-bg text-aurora-text font-serif min-h-screen">
            {/* Toast notifications */}
            {showCheckinSuccess && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-4 flex items-center gap-3 animate-fade-in-up">
                    <CheckCircle size={16} className="text-aurora-emerald flex-shrink-0" />
                    <div>
                        <p className="text-sm text-aurora-text font-serif">Dead Man&apos;s Switch reset</p>
                        <p className="text-xs text-aurora-muted font-serif italic">Timer renewed for another year.</p>
                    </div>
                </div>
            )}
            {showWelcome && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-card px-6 py-4 animate-fade-in-up">
                    <p className="text-base text-aurora-muted font-serif italic">When you are ready, everything is here.</p>
                </div>
            )}

            {/* Top bar */}
            <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
                <Link
                    href="/choice-pricing"
                    className="inline-flex items-center gap-2 text-aurora-muted text-xs tracking-[0.15em] uppercase hover:text-aurora-text transition-colors font-serif italic"
                >
                    <ArrowLeft size={14} />
                    Back
                </Link>
            </div>

            <div className="max-w-5xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="text-center py-32">
                        <Loader2 size={28} className="text-aurora-muted/40 animate-spin mx-auto" />
                    </div>
                ) : activeArchive ? (
                    <ActiveArchiveView
                        archive={activeArchive}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                        userId={userId}
                        paymentConfirmedAt={activeArchive.payment_confirmed_at ?? null}
                    />
                ) : (
                    /* Empty state */
                    <div className="text-center py-32">
                        <div className="w-20 h-20 rounded-full bg-aurora-surface border border-aurora-border flex items-center justify-center mx-auto mb-8">
                            <User size={32} className="text-aurora-muted/40" />
                        </div>
                        <h2 className="font-serif text-5xl text-aurora-text mb-4">Begin your archive</h2>
                        <p className="font-serif italic text-lg text-aurora-muted mb-10">
                            A place to preserve what matters most
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-aurora-accent text-white rounded-xl text-sm font-serif tracking-wide hover:bg-aurora-glow transition-colors"
                        >
                            <Plus size={16} />
                            Create archive
                        </button>
                    </div>
                )}

                {/* Removed Archives */}
                {deletedArchives.length > 0 && (
                    <div className="mt-20">
                        <div className="separator-warm mb-10" />
                        <h3 className="text-xs uppercase tracking-[0.2em] text-aurora-muted/60 mb-6 font-serif italic flex items-center gap-2">
                            <Archive size={13} />
                            Removed Archives
                        </h3>
                        <div className="space-y-3">
                            {deletedArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="glass-card px-5 py-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm text-aurora-text font-serif">{m.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-600/60 mt-0.5 flex items-center gap-1 font-serif italic">
                                            <AlertTriangle size={11} />
                                            {getDaysRemaining(m.deleted_at!)} days remaining
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => restore(m.id)}
                                            className="p-2 text-aurora-muted hover:text-aurora-text rounded-lg hover:bg-aurora-border/30 transition-colors"
                                            title="Restore"
                                        >
                                            <RefreshCcw size={15} />
                                        </button>
                                        <button
                                            onClick={() => permanentDelete(m.id)}
                                            className="p-2 text-red-400/50 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                            title="Delete permanently"
                                        >
                                            <Trash2 size={15} />
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

/* ─────────────────────────────────────────────────────────────── */
/*  Active Archive                                                  */
/* ─────────────────────────────────────────────────────────────── */

function ActiveArchiveView({
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
    const [linkCopied, setLinkCopied] = useState(false);

    const birthYear = archive.birth_date ? new Date(archive.birth_date).getFullYear() : null;
    const deathYear = archive.death_date ? new Date(archive.death_date).getFullYear() : null;
    const dates = birthYear
        ? deathYear ? `${birthYear} — ${deathYear}` : `b. ${birthYear}`
        : null;
    const sealedDate = paymentConfirmedAt
        ? new Date(paymentConfirmedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : null;

    const arweaveTxId = (archive as any).arweave_tx_id || null;
    const isPreserved = (archive as any).preservation_state === 'preserved';

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

    const totalContent = stats.photos + stats.videos + stats.memories + stats.chapters;

    return (
        <div className="space-y-14">

            {/* ── Hero ── */}
            <div className="glass-card-hero">
                <div className="flex flex-col md:flex-row">
                    {/* Photo */}
                    <div className="md:w-72 lg:w-80 h-64 md:h-auto bg-aurora-surface flex-shrink-0 relative">
                        {archive.profile_photo_url ? (
                            <img
                                src={archive.profile_photo_url}
                                alt={archive.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-aurora-surface">
                                <User size={48} className="text-aurora-muted/20" />
                            </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent md:hidden" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-10 md:p-14 flex flex-col justify-between min-h-[320px]">
                        <div>
                            <div className="flex items-start justify-between gap-6 mb-2">
                                <div>
                                    <h1 className="font-serif text-4xl md:text-5xl text-aurora-text leading-[1.1] tracking-tight">
                                        {archive.full_name || 'Unnamed Archive'}
                                    </h1>
                                    {dates && (
                                        <p className="text-aurora-muted text-base font-serif italic mt-3 tracking-wide">{dates}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 mt-2">
                                    <span className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-aurora-emerald/10 text-aurora-emerald border border-aurora-emerald/20 font-serif italic">
                                        <span className="w-1.5 h-1.5 rounded-full bg-aurora-emerald badge-live" />
                                        Live
                                    </span>
                                    {isPreserved && (
                                        <span className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-aurora-glow/10 text-aurora-glow border border-aurora-glow/20 font-serif italic badge-glow">
                                            <Shield size={11} />
                                            Preserved
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-[11px] text-aurora-muted/60 font-serif italic mt-3">
                                {sealedDate && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        {sealedDate}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Edit size={11} />
                                    Edited {timeAgo(archive.updated_at)}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2.5 mt-10">
                            <Link
                                href={`/person/${archive.id}`}
                                className="flex items-center gap-2 px-6 py-2.5 bg-aurora-accent text-white rounded-lg text-sm font-serif tracking-wide hover:bg-aurora-glow transition-colors"
                            >
                                <Eye size={14} />
                                View
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="flex items-center gap-2 px-6 py-2.5 border border-aurora-border text-aurora-text rounded-lg text-sm font-serif italic hover:bg-aurora-surface transition-colors"
                            >
                                <Edit size={14} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="flex items-center gap-2 px-6 py-2.5 border border-aurora-border text-aurora-text rounded-lg text-sm font-serif italic hover:bg-aurora-surface transition-colors"
                            >
                                <Share2 size={14} />
                                {copied ? 'Copied!' : 'Share'}
                            </button>
                            {!isPreserved && (
                                <button
                                    onClick={() => onDelete(archive.id)}
                                    className="ml-auto p-2.5 text-aurora-muted/40 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                    title="Remove archive"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Quick actions row ── */}
            <div className="flex flex-wrap gap-3">
                <QuickAction
                    href={`/create?id=${archive.id}&mode=personal&step=7`}
                    icon={Plus}
                    label="Add Memory"
                    accent
                />
                <QuickAction
                    href={`/create?id=${archive.id}&mode=personal&step=8`}
                    icon={Camera}
                    label="Photos"
                />
                <QuickAction
                    href={`/create?id=${archive.id}&mode=personal&step=6`}
                    icon={FileText}
                    label="Biography"
                />
                <QuickAction
                    href={`/create?id=${archive.id}&mode=personal`}
                    icon={Edit}
                    label="Full Editor"
                />
            </div>

            {/* ── Two-column section ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Preservation & Succession */}
                <div className="space-y-8">
                    <PreservationStatus
                        memorialId={archive.id}
                        arweaveTxId={arweaveTxId}
                        fullName={archive.full_name || ''}
                        birthDate={archive.birth_date || ''}
                        deathDate={archive.death_date || null}
                        planType="personal"
                    />
                    <SuccessionSetup memorialId={archive.id} />
                </div>

                {/* Share + Status */}
                <div className="space-y-8">
                    {/* Share */}
                    <div className="glass-card p-8">
                        <h3 className="font-serif italic text-lg text-aurora-glow mb-6">
                            Share with loved ones
                        </h3>
                        <div className="space-y-1">
                            <ShareButton
                                onClick={handleCopyLink}
                                icon={Copy}
                                label={linkCopied ? 'Copied!' : 'Copy link'}
                                sublabel="Share the direct URL"
                            />
                            <ShareButton
                                onClick={handleEmailFamily}
                                icon={Mail}
                                label="Email family"
                                sublabel="Send via email"
                            />
                            <ShareButton
                                onClick={handlePrintQR}
                                icon={QrCode}
                                label="QR Code"
                                sublabel="Print for physical display"
                            />
                        </div>
                    </div>

                    {/* Archive status */}
                    <div className="glass-card p-8">
                        <h3 className="text-xs uppercase tracking-[0.2em] text-aurora-muted/60 mb-5 font-serif italic">
                            Archive Status
                        </h3>
                        <div className="space-y-4">
                            <StatusRow
                                label="State"
                                value={isPreserved ? 'Preserved on Arweave' : 'Active'}
                            />
                            {sealedDate && (
                                <StatusRow label="Activated" value={sealedDate} />
                            )}
                            <StatusRow label="Last edit" value={timeAgo(archive.updated_at)} />
                            <StatusRow
                                label="Content"
                                value={`${totalContent} item${totalContent !== 1 ? 's' : ''}`}
                            />
                            <StatusRow
                                label="Successor"
                                value="Not configured"
                                action={
                                    <Link
                                        href="/succession/request"
                                        className="text-[11px] text-aurora-glow hover:text-aurora-accent transition-colors font-serif italic underline underline-offset-2"
                                    >
                                        Set up
                                    </Link>
                                }
                            />
                            <div className="pt-3 border-t border-aurora-border/40">
                                <Link
                                    href={`/api/arche/generate?id=${archive.id}`}
                                    target="_blank"
                                    className="flex items-center gap-2 text-xs text-aurora-muted hover:text-aurora-text transition-colors font-serif italic py-1"
                                >
                                    <Download size={13} />
                                    Download portable archive
                                    <ExternalLink size={10} className="ml-auto opacity-40" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Small components                                               */
/* ─────────────────────────────────────────────────────────────── */

function QuickAction({ href, icon: Icon, label, accent }: { href: string; icon: any; label: string; accent?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-serif italic transition-all ${
                accent
                    ? 'bg-aurora-accent/10 text-aurora-accent border border-aurora-accent/20 hover:bg-aurora-accent/20'
                    : 'bg-white text-aurora-text/70 border border-aurora-border hover:bg-aurora-surface hover:text-aurora-text'
            }`}
        >
            <Icon size={14} />
            {label}
        </Link>
    );
}

function ShareButton({
    onClick,
    icon: Icon,
    label,
    sublabel,
}: {
    onClick: () => void;
    icon: any;
    label: string;
    sublabel: string;
}) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-aurora-surface transition-colors text-left group"
        >
            <div className="w-8 h-8 rounded-lg bg-aurora-surface flex items-center justify-center flex-shrink-0 group-hover:bg-aurora-border/30 transition-colors">
                <Icon size={14} className="text-aurora-muted" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-aurora-text font-serif">{label}</p>
                <p className="text-[11px] text-aurora-muted/50 font-serif italic">{sublabel}</p>
            </div>
            <ChevronRight size={14} className="text-aurora-muted/30 group-hover:text-aurora-muted/60 transition-colors" />
        </button>
    );
}

function StatusRow({
    label,
    value,
    action,
}: {
    label: string;
    value: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-aurora-muted/60 font-serif italic">{label}</span>
            <div className="flex items-center gap-2">
                <span className="text-xs text-aurora-text/80 font-serif">{value}</span>
                {action}
            </div>
        </div>
    );
}
