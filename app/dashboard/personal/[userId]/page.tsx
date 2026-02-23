'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
    Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw,
    AlertTriangle, CheckCircle, Share2, Image, Video, BookOpen, Heart,
    Lock, Unlock, Users, Shield
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';
import SuccessorSettings from '@/components/SuccessorSettings';

function StatCard({ icon: Icon, count, label, color }: { icon: any; count: number; label: string; color: string }) {
    return (
        <div className="bg-white rounded-xl border border-sand/30 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <div className="font-semibold text-charcoal text-2xl leading-none">{count}</div>
                <div className="text-sm text-charcoal/50 mt-1">{label}</div>
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
        <div className="min-h-screen bg-gradient-to-br from-mist/5 via-ivory to-mist/10">
            {showCheckinSuccess && (
                <div className="bg-charcoal text-ivory px-6 py-4 flex items-center justify-center gap-3">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-semibold text-sm">Verification successful</p>
                        <p className="text-xs opacity-70">Your Dead Man&apos;s Switch timer has been reset for another year.</p>
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
                                <h1 className="font-serif text-4xl text-charcoal">Personal Archive</h1>
                            </div>
                            <p className="text-charcoal/60">Your private dashboard</p>
                            <p className="text-xs text-charcoal/40 mt-1">ID: {userId.slice(0, 8)}...</p>
                        </div>

                        {!paidArchive && (
                            <button
                                onClick={handleCreate}
                                className="btn-paper px-6 py-3 rounded-lg font-semibold flex items-center gap-2 bg-gradient-to-r from-sage to-sage/90 hover:shadow-lg text-ivory"
                            >
                                <Plus size={20} />
                                Create Archive
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    </div>
                ) : paidArchive ? (
                    <ActiveArchive
                        archive={paidArchive}
                        userId={userId}
                        onDelete={softDelete}
                        onCopyLink={copyShareLink}
                        copied={copied}
                    />
                ) : (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-mist/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-mist" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">No active archive yet</h2>
                        <p className="text-charcoal/50 mb-6 max-w-sm mx-auto">
                            Create your Personal Archive to begin preserving your life story, memories, and legacy.
                        </p>
                        <button
                            onClick={handleCreate}
                            className="btn-paper inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-semibold"
                        >
                            <Plus size={20} />
                            Create my archive
                        </button>
                    </div>
                )}

                {/* Unpaid drafts */}
                {draftArchives.length > 0 && (
                    <div className="mt-16 pt-10 border-t border-sand/30">
                        <h3 className="text-xl font-serif text-charcoal mb-2">Unpublished drafts</h3>
                        <p className="text-sm text-charcoal/50 mb-6">
                            Started but not yet purchased. Complete one to activate it.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {draftArchives.map(m => (
                                <div
                                    key={m.id}
                                    className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden"
                                >
                                    <div className="relative h-40 bg-gradient-to-br from-charcoal/5 to-charcoal/10">
                                        {m.profile_photo_url ? (
                                            <>
                                                <img src={m.profile_photo_url} alt="" className="w-full h-full object-cover opacity-60" />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <span className="text-charcoal/40 font-bold text-lg tracking-widest rotate-[-20deg] select-none pointer-events-none">
                                                        UNPAID
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Lock size={48} className="text-charcoal/20" />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3 px-2 py-1 bg-charcoal/70 text-ivory text-xs font-semibold rounded-md">
                                            DRAFT
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h4 className="font-serif text-xl text-charcoal mb-1">{m.full_name || 'Untitled draft'}</h4>
                                        <p className="text-xs text-charcoal/40 mb-4">Last edited {timeAgo(m.updated_at)}</p>
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/create?id=${m.id}&mode=personal`}
                                                className="btn-paper flex-1 py-2 px-3 bg-charcoal/10 hover:bg-charcoal/20 text-charcoal rounded-lg font-medium text-center text-sm flex items-center justify-center gap-1"
                                            >
                                                <Edit size={16} /> Continue editing
                                            </Link>
                                            <button
                                                onClick={() => softDelete(m.id)}
                                                className="btn-paper py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                                title="Delete draft"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Deleted Archives (Trash) */}
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
                                    className="bg-sand/10 rounded-xl border border-sand/30 p-4 flex items-center justify-between"
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
            </div>
        </div>
    );
}

function ActiveArchive({
    archive,
    userId,
    onDelete,
    onCopyLink,
    copied,
}: {
    archive: Memorial;
    userId: string;
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
        <div className="flex flex-col gap-8">

            {/* Hero card */}
            <div className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-56 h-56 sm:h-auto bg-gradient-to-br from-mist/10 to-mist/20 flex-shrink-0">
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

                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-4 mb-2">
                                <h2 className="font-serif text-3xl text-charcoal leading-tight">
                                    {archive.full_name || 'Unnamed Archive'}
                                </h2>
                                <span className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border bg-sage/10 text-sage border-sage/20 font-semibold">
                                    <Unlock size={12} />
                                    Active
                                </span>
                            </div>
                            {dates && <p className="text-charcoal/50 text-sm mb-1">{dates}</p>}
                            <p className="text-xs text-charcoal/40">Last edited {timeAgo(archive.updated_at)}</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-6">
                            <Link
                                href={`/person/${archive.id}`}
                                className="btn-paper flex items-center gap-1.5 px-5 py-2.5 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg font-medium text-sm"
                            >
                                <Eye size={16} />
                                View archive
                            </Link>
                            <Link
                                href={`/create?id=${archive.id}&mode=personal`}
                                className="btn-paper flex items-center gap-1.5 px-5 py-2.5 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg font-medium text-sm"
                            >
                                <Edit size={16} />
                                Edit
                            </Link>
                            <button
                                onClick={() => onCopyLink(archive.id)}
                                className="btn-paper flex items-center gap-1.5 px-5 py-2.5 bg-charcoal/5 hover:bg-charcoal/10 text-charcoal rounded-lg font-medium text-sm"
                            >
                                <Share2 size={16} />
                                {copied ? 'Copied!' : 'Share link'}
                            </button>
                            <button
                                onClick={() => onDelete(archive.id)}
                                className="btn-paper py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg ml-auto"
                                title="Delete archive"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard icon={Image} count={stats.photos} label="Photos" color="bg-sage" />
                <StatCard icon={Video} count={stats.videos} label="Videos" color="bg-mist" />
                <StatCard icon={Heart} count={stats.memories} label="Memories" color="bg-terracotta" />
                <StatCard icon={BookOpen} count={stats.chapters} label="Chapters" color="bg-charcoal/70" />
            </div>

            {/* Management sections — 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Witnesses & contributors */}
                <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-mist/10 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-mist" />
                        </div>
                        <h3 className="font-serif text-xl text-charcoal">Witnesses & contributors</h3>
                    </div>
                    <p className="text-sm text-charcoal/50 leading-relaxed mb-5">
                        Invite people to contribute memories, photos, and stories. Their contributions are reviewed by you before being added.
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href={`/create?id=${archive.id}&mode=personal&step=7`}
                            className="btn-paper flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-mist to-mist/90 text-ivory text-sm rounded-lg font-semibold hover:shadow-md transition-all"
                        >
                            <Plus size={16} />
                            Invite witnesses
                        </Link>
                        <Link
                            href={`/create?id=${archive.id}&mode=personal&step=7`}
                            className="btn-paper flex items-center gap-2 px-4 py-2.5 border border-charcoal/20 text-charcoal text-sm rounded-lg hover:bg-charcoal/5 transition-all"
                        >
                            Manage
                        </Link>
                    </div>
                </div>

                {/* Continue editing */}
                <div className="bg-white rounded-xl shadow-sm border border-sand/30 p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center">
                            <Edit size={20} className="text-sage" />
                        </div>
                        <h3 className="font-serif text-xl text-charcoal">Continue editing</h3>
                    </div>
                    <p className="text-sm text-charcoal/50 leading-relaxed mb-5">
                        Add and update the sections of your archive — life chapters, photos, videos, and more.
                    </p>
                    <Link
                        href={`/create?id=${archive.id}&mode=personal`}
                        className="btn-paper inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sage to-sage/90 text-ivory text-sm rounded-lg font-semibold hover:shadow-md transition-all"
                    >
                        <Edit size={16} />
                        Open editor
                    </Link>
                </div>
            </div>

            {/* Account Stewardship — full width like family dashboard */}
            <div className="mt-4 pt-10 border-t border-sand/20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <h2 className="font-serif text-3xl text-charcoal mb-4">Account Stewardship</h2>
                        <p className="text-charcoal/60 leading-relaxed">
                            Legacy is not just what you create, but how you ensure it survives. Use this section to designate the person who will care for your archive when you no longer can.
                        </p>
                    </div>
                    <div className="lg:col-span-2">
                        <SuccessorSettings userId={userId} />
                    </div>
                </div>
            </div>

        </div>
    );
}
