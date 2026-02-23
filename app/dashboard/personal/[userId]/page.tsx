'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    ChevronRight, Lock, Unlock
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';

function StatPill({ icon: Icon, count, label }: { icon: any; count: number; label: string }) {
    return (
        <div className="flex items-center gap-2 bg-parchment border border-sand/60 rounded-xl px-4 py-3">
            <Icon size={18} className="text-charcoal/40 flex-shrink-0" />
            <div>
                <div className="font-semibold text-charcoal text-lg leading-none">{count}</div>
                <div className="text-xs text-charcoal/40 mt-0.5">{label}</div>
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
        localStorage.setItem('user-id', userId);
        localStorage.setItem('legacy-vault-mode', 'personal');
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

    return (
        <div className="min-h-screen bg-ivory">
            {showCheckinSuccess && (
                <div className="bg-charcoal text-ivory px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-semibold text-sm">Verification successful</p>
                        <p className="text-xs opacity-70">Your Dead Man's Switch timer has been reset for another year.</p>
                    </div>
                </div>
            )}

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
<<<<<<< HEAD
                            className="flex items-center gap-2 px-5 py-2.5 bg-charcoal text-ivory rounded-full text-sm font-medium hover:bg-charcoal/90 transition-all"
=======
                            disabled={memorials.length >= 1}
                            className={`btn-paper px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${memorials.length >= 1
                                    ? 'bg-sand/30 text-charcoal/40 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-sage to-sage/90 hover:shadow-lg text-ivory'
                                }`}
>>>>>>> origin/claude/pastel-color-palette-avZIb
                        >
                            <Plus size={16} />
                            Create Archive
                        </button>
                    )}
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {loading ? (
<<<<<<< HEAD
                    <div className="flex justify-center py-24">
                        <Loader2 size={40} className="text-charcoal/30 animate-spin" />
=======
                    <div className="text-center py-20">
                        <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-sage" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Create Your Memorial</h2>
                        <button onClick={handleCreate} className="btn-paper inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-semibold">
                            <Plus size={20} />
                            Create
                        </button>
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    </div>
                ) : paidArchive ? (
                    <ActiveArchive
                        archive={paidArchive}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                    />
                ) : (
<<<<<<< HEAD
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
=======
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorials.map((memorial) => (
                            <div key={memorial.id} className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-sage/10 to-sage/20">
                                    {memorial.profile_photo_url ? (
                                        <img src={memorial.profile_photo_url} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User size={64} className="text-charcoal/20" />
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="font-serif text-2xl text-charcoal mb-4">{memorial.full_name || 'Untitled'}</h3>
                                    <div className="flex gap-2">
                                        <Link href={`/person/${memorial.id}`} className="btn-paper flex-1 py-2 px-3 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg font-medium text-center text-sm">
                                            <Eye size={16} className="inline mr-1" />View
                                        </Link>
                                        <Link href={`/create?id=${memorial.id}`} className="btn-paper flex-1 py-2 px-3 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg font-medium text-center text-sm">
                                            <Edit size={16} className="inline mr-1" />Edit
                                        </Link>
                                        <button
                                            onClick={() => softDeleteMemorial(memorial.id)}
                                            className="btn-paper py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    </div>
                )}

                {/* Unpaid drafts */}
                {draftArchives.length > 0 && (
                    <div className="mt-14 pt-10 border-t border-sand/40">
                        <h3 className="font-serif text-lg text-charcoal mb-1">Unpublished drafts</h3>
                        <p className="text-xs text-charcoal/40 mb-6">
                            Started but not yet purchased. Complete one to activate it.
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
                        <h3 className="text-sm font-medium text-charcoal/40 mb-4 flex items-center gap-2">
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
                                        <p className="text-xs text-red-400 mt-0.5 flex items-center gap-1">
                                            <AlertTriangle size={11} />
                                            {getDaysRemaining(m.deleted_at!)} days until permanent deletion
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => restore(m.id)}
                                        className="p-2 border border-sand text-charcoal/50 hover:text-charcoal rounded-lg transition-colors"
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
                    <div className="sm:w-48 h-52 sm:h-auto bg-parchment flex-shrink-0">
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
                            {dates && <p className="text-charcoal/50 text-sm mb-2">{dates}</p>}
                            <p className="text-xs text-charcoal/35">Last edited {timeAgo(archive.updated_at)}</p>
                        </div>

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

            {/* Continue editing */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-charcoal mb-1">Continue editing</h3>
                        <p className="text-sm text-charcoal/50">Add and update the sections of your archive.</p>
                    </div>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal`}
                        className="flex items-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal text-sm rounded-full hover:bg-parchment transition-all flex-shrink-0"
                    >
                        <Edit size={14} />
                        Open editor
                    </Link>
                </div>
            </div>

            {/* Witnesses */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-charcoal">Witnesses & contributors</h3>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal&step=7`}
                        className="text-xs text-charcoal/40 hover:text-charcoal underline"
                    >
                        Manage
                    </Link>
                </div>
                <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                    Invite people to contribute memories, photos, and stories. Their contributions are reviewed by you before being added.
                </p>
                <Link
                    href={`/create?id=${archive.id}&mode=personal&step=7`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal text-sm rounded-full hover:bg-parchment transition-all"
                >
                    <Plus size={14} />
                    Invite witnesses
                </Link>
            </div>

            {/* Succession */}
            <div className="bg-white border border-sand/40 rounded-2xl p-6">
                <h3 className="font-medium text-charcoal mb-2">Succession</h3>
                <p className="text-sm text-charcoal/50 leading-relaxed mb-4">
                    Designate someone to manage and transmit this archive when the time comes.
                </p>
                <Link
                    href={`/succession/request`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-charcoal/20 text-charcoal text-sm rounded-full hover:bg-parchment transition-all"
                >
                    <ChevronRight size={14} />
                    Set up succession
                </Link>
            </div>

        </div>
    );
}
