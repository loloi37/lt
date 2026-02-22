// ============================================
// FILE 2: app/dashboard/personal/[userId]/page.tsx
// ============================================
'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
// Add RefreshCcw (Restore icon), AlertTriangle, and include CheckCircle
import { Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft, RefreshCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase, Memorial } from '@/lib/supabase';

export default function PersonalDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [deletedMemorials, setDeletedMemorials] = useState<Memorial[]>([]); // NEW
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams(); // Get params
    const [showCheckinSuccess, setShowCheckinSuccess] = useState(false);

    useEffect(() => {
        // 1. Trigger Heartbeat on load (General usage)
        const sendHeartbeat = async () => {
            await fetch('/api/user/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
        };
        sendHeartbeat();

        // 2. Handle specific Check-in parameter
        if (searchParams.get('checkin') === 'true') {
            setShowCheckinSuccess(true);
            // Remove param from URL to clean up
            window.history.replaceState({}, '', `/dashboard/personal/${userId}`);

            // Hide banner after 5 seconds
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
            // Split active vs deleted
            setMemorials(data.filter(m => !m.deleted));
            setDeletedMemorials(data.filter(m => m.deleted));
        }
        setLoading(false);
    };

    const handleCreate = () => {
        if (memorials.length >= 1) {
            alert('Personal mode: 1 memorial maximum');
            return;
        }
        localStorage.setItem('user-id', userId);
        localStorage.setItem('legacy-vault-mode', 'personal');
        window.location.href = '/create?mode=personal';
    };

    // UPDATED: Soft Delete
    const softDeleteMemorial = async (id: string) => {
        if (!confirm('Are you sure you want to delete this memorial? It will be moved to the trash for 30 days.')) return;

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

    // NEW: Restore
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

    // Helper to calculate days remaining
    const getDaysRemaining = (deletedAt: string) => {
        const deleteDate = new Date(deletedAt);
        const expiryDate = new Date(deleteDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // +30 days
        const now = new Date();
        const diff = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
        return diff > 0 ? diff : 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/5 via-ivory to-mist/10">

            {/* NEW: Check-in Success Banner */}
            {showCheckinSuccess && (
                <div className="bg-mist text-ivory px-6 py-4 flex items-center justify-center gap-3 animate-fadeIn shadow-md">
                    <CheckCircle size={24} />
                    <div>
                        <p className="font-bold">Verification Successful</p>
                        <p className="text-sm opacity-90">Thank you for confirming. Your Dead Man's Switch timer has been reset for another year.</p>
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
                                <h1 className="font-serif text-4xl text-charcoal">My Personal Memorial</h1>
                            </div>
                            <p className="text-charcoal/60">Your private dashboard</p>
                            <p className="text-xs text-charcoal/40 mt-1">ID: {userId.slice(0, 8)}...</p>
                        </div>

                        <button
                            onClick={handleCreate}
                            disabled={memorials.length >= 1}
                            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${memorials.length >= 1
                                    ? 'bg-sand/30 text-charcoal/40 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-mist to-mist/90 hover:shadow-lg text-ivory'
                                }`}
                        >
                            <Plus size={20} />
                            Create Memorial
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="text-center py-20">
                        <Loader2 size={48} className="text-mist animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-mist/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-mist" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Create Your Memorial</h2>
                        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-mist hover:bg-mist/90 text-ivory rounded-xl font-semibold">
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {memorials.map((memorial) => (
                            <div key={memorial.id} className="bg-white rounded-xl shadow-sm border border-sand/30 overflow-hidden">
                                <div className="relative h-48 bg-gradient-to-br from-mist/10 to-mist/20">
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
                                        <Link href={`/person/${memorial.id}`} className="flex-1 py-2 px-3 bg-mist/10 hover:bg-mist/20 text-mist rounded-lg font-medium text-center text-sm">
                                            <Eye size={16} className="inline mr-1" />View
                                        </Link>
                                        <Link href={`/create?id=${memorial.id}`} className="flex-1 py-2 px-3 bg-stone/10 hover:bg-stone/20 text-stone rounded-lg font-medium text-center text-sm">
                                            <Edit size={16} className="inline mr-1" />Edit
                                        </Link>
                                        <button
                                            onClick={() => softDeleteMemorial(memorial.id)}
                                            className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                                            title="Delete"
                                        >
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

            </div>
        </div>
    );
}
