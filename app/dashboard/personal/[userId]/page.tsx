'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    Clock, ChevronRight, Lock, Unlock
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';
import { STEP_NAMES } from '@/types/memorial';

// Step labels (steps 1-9, index 0-8)
const STEPS = [
    'Basic Info', 'Childhood', 'Career', 'Relationships',
    'Personality', 'Life Story', 'Memories', 'Photos', 'Videos'
];

function CompletionBar({ completed, total }: { completed: number; total: number }) {
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-charcoal/60">{completed} of {total} sections complete</span>
                <span className="text-sm font-semibold text-charcoal">{pct}%</span>
            </div>
            <div className="h-1.5 bg-sand/40 rounded-full overflow-hidden">
                <div
                    className="h-full bg-charcoal rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
                {STEPS.map((name, i) => {
                    const stepNumber = i + 1;
                    const done = completed >= stepNumber || false;
                    return (
                        <span
                            key={name}
                            className={`text-xs px-2.5 py-1 rounded-full border ${done
                                ? 'bg-charcoal text-ivory border-charcoal'
                                : 'bg-transparent text-charcoal/40 border-sand'
                                }`}
                        >
                            {name}
                        </span>
                    );
                })}
            </div>
        </div>
    );
}

function StatPill({ icon: Icon, count, label }: { icon: any; count: number; label: string }) {
    return (
        <div className="flex items-center gap-2 bg-parchment border border-sand/60 rounded-xl px-4 py-3 min-w-[100px]">
            <Icon size={18} className="text-charcoal/50 flex-shrink-0" />
            <div>
                <div className="font-semibold text-charcoal text-lg leading-none">{count}</div>
                <div className="text-xs text-charcoal/50 mt-0.5">{label}</div>
            </div>
        </div>
    );
}

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

export default function PersonalDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;

    const [paidArchive, setPaidArchive] = useState<Memorial | null>(null);
    const [draftArchives, setDraftArchives] = useState<Memorial[]>([]);
    const [deletedArchives, setDeletedArchives] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const searchParams = useSearchParams();

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

        loadMemorials();
    }, [userId, searchParams]);

    const loadMemorials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .eq('user_id', userId)
            .eq('mode', 'personal')
            .order('updated_at', { ascending: false });

        if (error) console.error('Error:', error);

        if (data) {
            const active = data.filter(m => !m.deleted);
            const deleted = data.filter(m => m.deleted);
            // Paid archive is the one the user has purchased
            const paid = active.find(m => m.paid) || null;
            // Unpaid = everything else that is active and not paid
            const drafts = active.filter(m => !m.paid);
            setPaidArchive(paid);
            setDraftArchives(drafts);
            setDeletedArchives(deleted);
        }
        setLoading(false);
    };

    const handleCreate = () => {
        if (paidArchive) {
            alert('You already have an active Personal Archive. Each account supports one personal archive.');
            return;
        }
        localStorage.setItem('user-id', userId);
        localStorage.setItem('legacy-vault-mode', 'personal');
        window.location.href = '/create?mode=personal';
    };

    const softDelete = async (id: string) => {
        if (!confirm('Move this archive to the trash? It will be permanently deleted after 30 days.')) return;
        const { error } = await supabase
            .from('memorials')
            .update({ deleted: true, deleted_at: new Date().toISOString() })
            .eq('id', id);
        if (error) { alert('Error deleting archive'); return; }
        loadMemorials();
    };

    const restore = async (id: string) => {
        const { error } = await supabase
            .from('memorials')
            .update({ deleted: false, deleted_at: null })
            .eq('id', id);
        if (error) { alert('Error restoring archive'); return; }
        loadMemorials();
    };

    const getDaysRemaining = (deletedAt: string) => {
        const expiry = new Date(new Date(deletedAt).getTime() + 30 * 86400000);
        const diff = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
        return Math.max(diff, 0);
    };

    const copyShareLink = (id: string) => {
        const url = `${window.location.origin}/person/${id}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-ivory">

            {/* Check-in banner */}
            {showCheckinSuccess && (
                <div className="bg-charcoal text-ivory px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-semibold text-sm">Verification successful</p>
                        <p className="text-xs opacity-70">Your Dead Man's Switch timer has been reset for another year.</p>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-ivory border-b border-sand/40">
                <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/choice-pricing" className="p-2 hover:bg-parchment rounded-lg transition-colors">
                            <ArrowLeft size={18} className="text-charcoal/50" />
                        </Link>
                        <div>
                            <h1 className="font-serif text-2xl text-charcoal">Personal Archive</h1>
                            <p className="text-xs text-charcoal/40 mt-0.5">ID {userId.slice(0, 8)}…</p>
                        </div>
                    </div>
                    {!paidArchive && (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all"
                        >
                            <Plus size={16} />
                            Create Archive
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">

                {loading ? (
                    <div className="flex justify-center py-24">
                        <Loader2 size={40} className="text-charcoal/30 animate-spin" />
                    </div>
                ) : paidArchive ? (
                    <ActiveArchive
                        archive={paidArchive}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                    />
                ) : (
                    /* No paid archive yet */
                    <div className="text-center py-24">
                        <div className="w-20 h-20 bg-parchment border border-sand rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={36} className="text-charcoal/30" />
                        </div>
                        <h2 className="font-serif text-2xl text-charcoal mb-3">No active archive yet</h2>
                        <p className="text-charcoal/50 mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                            Create your Personal Archive to begin preserving your life story, memories, and legacy.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all"
                        >
                            <Plus size={16} />
                            Create my archive
                        </button>
                    </div>
                )}

                {/* Unpaid / In-progress drafts */}
                {draftArchives.length > 0 && (
                    <div className="mt-14 pt-10 border-t border-sand/40">
                        <h3 className="font-serif text-lg text-charcoal mb-1">Unpublished drafts</h3>
                        <p className="text-xs text-charcoal/40 mb-6">
                            These archives were started but not yet purchased. Complete one to activate it.
                        </p>
                        <div className="flex flex-col gap-3">
                            {draftArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between bg-parchment border border-sand/60 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-sand/40 rounded-full flex items-center justify-center">
                                            <Lock size={14} className="text-charcoal/40" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-charcoal text-sm">{m.full_name || 'Untitled draft'}</p>
                                            <p className="text-xs text-charcoal/40">Last edited {timeAgo(m.updated_at)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/create?id=${m.id}&mode=personal`}
                                            className="text-xs px-3 py-1.5 border border-charcoal/30 text-charcoal rounded-full hover:bg-charcoal hover:text-ivory transition-all"
                                        >
                                            Continue editing
                                        </Link>
                                        <button
                                            onClick={() => softDelete(m.id)}
                                            className="p-1.5 text-charcoal/30 hover:text-red-500 rounded-lg transition-colors"
                                            title="Delete draft"
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Trash */}
                {deletedArchives.length > 0 && (
                    <div className="mt-10 pt-8 border-t border-sand/40">
                        <h3 className="text-sm font-medium text-charcoal/50 mb-4 flex items-center gap-2">
                            <Trash2 size={14} />
                            Trash
                        </h3>
                        <div className="flex flex-col gap-2">
                            {deletedArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between bg-sand/10 border border-sand/30 rounded-xl p-4 opacity-70"
                                >
                                    <div>
                                        <p className="font-medium text-charcoal text-sm">{m.full_name || 'Untitled'}</p>
                                        <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                                            <AlertTriangle size={11} />
                                            {getDaysRemaining(m.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restore(m.id)}
                                        className="p-2 border border-sand text-charcoal/60 hover:text-charcoal rounded-lg transition-colors"
                                        title="Restore"
                                    >
                                        <RefreshCcw size={15} />
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

// ─── ACTIVE ARCHIVE PANEL ────────────────────────────────────────────────────

function ActiveArchive({
    archive,
    onDelete,
    onCopyLink,
    copied,
}: {
    archive: Memorial;
    onDelete: (id: string) => void;
    onCopyLink: (id: string) => void;
    copied: boolean;
}) {
    const stats = computeStats(archive);
    const completedCount = archive.completed_steps?.length || 0;
    const totalSteps = 9;

    const birthYear = archive.birth_date ? new Date(archive.birth_date).getFullYear() : null;
    const deathYear = archive.death_date ? new Date(archive.death_date).getFullYear() : null;
    const dates = birthYear
        ? deathYear ? `${birthYear} – ${deathYear}` : `Born ${birthYear}`
        : null;

    return (
        <div className="flex flex-col gap-6">

            {/* Hero card */}
            <div className="bg-white border border-sand/40 rounded-2xl overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    {/* Photo */}
                    <div className="sm:w-48 h-52 sm:h-auto bg-parchment flex-shrink-0 relative">
                        {archive.profile_photo_url ? (
                            <img
                                src={archive.profile_photo_url}
                                alt={archive.full_name || ''}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User size={48} className="text-charcoal/20" />
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-1">
                                <h2 className="font-serif text-2xl text-charcoal leading-tight">
                                    {archive.full_name || 'Unnamed Archive'}
                                </h2>
                                <span className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border bg-mist/10 text-mist border-mist/20">
                                    <Unlock size={11} />
                                    Active
                                </span>
                            </div>
                            {dates && (
                                <p className="text-charcoal/50 text-sm mb-3">{dates}</p>
                            )}
                            <p className="text-xs text-charcoal/35">
                                Last edited {timeAgo(archive.updated_at)}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mt-5">
                            <Link
                                href={`/person/${archive.id}`}
                                className="flex items-center gap-1.5 px-4 py-2 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all"
                            >
                                <Eye size={14} />
                                View archive
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="flex items-center gap-1.5 px-4 py-2 border border-charcoal/30 text-charcoal rounded-full text-sm hover:bg-parchment transition-all"
                            >
                                <Edit size={14} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="flex items-center gap-1.5 px-4 py-2 border border-charcoal/30 text-charcoal rounded-full text-sm hover:bg-parchment transition-all"
                            >
                                <Share2 size={14} />
                                {copied ? 'Copied!' : 'Share link'}
                            </button>
                            <button
                                onClick={() => onDelete(archive.id)}
                                className="flex items-center gap-1.5 px-3 py-2 text-charcoal/30 hover:text-red-500 rounded-full text-sm transition-colors ml-auto"
                                title="Delete archive"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content stats */}
            <div>
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-3 font-medium">Content</h3>
                <div className="flex flex-wrap gap-3">
                    <StatPill icon={Image} count={stats.photos} label="Photos" />
                    <StatPill icon={Video} count={stats.videos} label="Videos" />
                    <StatPill icon={Heart} count={stats.memories} label="Memories" />
                    <StatPill icon={BookOpen} count={stats.chapters} label="Chapters" />
                </div>
            </div>

            {/* Completion tracker */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-4 font-medium">Archive completion</h3>
                <CompletionBar completed={completedCount} total={totalSteps} />
                {completedCount < totalSteps && (
                    <div className="mt-4 pt-4 border-t border-sand/30">
                        <Link
                            href={`/create?id=${archive.id}&mode=personal`}
                            className="flex items-center gap-2 text-sm text-charcoal hover:underline"
                        >
                            <ChevronRight size={14} />
                            Continue completing your archive
                        </Link>
                    </div>
                )}
            </div>

            {/* Witnesses */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs uppercase tracking-widest text-charcoal/40 font-medium">Witnesses & contributors</h3>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=7`}
                        className="text-xs text-charcoal/50 hover:text-charcoal underline"
                    >
                        Manage
                    </Link>
                </div>
                <p className="text-sm text-charcoal/60 leading-relaxed">
                    Invite people to contribute memories, photos, and stories to this archive.
                    Contributions are reviewed by you before being added.
                </p>
                <Link
                    href={`/create?id=${archive.id}&mode=personal&step=7`}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-charcoal/20 text-charcoal text-sm rounded-full hover:bg-parchment transition-all"
                >
                    <Plus size={14} />
                    Invite witnesses
                </Link>
            </div>

            {/* Succession */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <h3 className="text-xs uppercase tracking-widest text-charcoal/40 mb-2 font-medium">Succession</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">
                    Designate someone to manage and transmit this archive when the time comes.
                </p>
                <Link
                    href={`/dashboard/personal/${archive.user_id}`}
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 border border-charcoal/20 text-charcoal text-sm rounded-full hover:bg-parchment transition-all"
                >
                    <ChevronRight size={14} />
                    Set up succession
                </Link>
            </div>

        </div>
    );
}
