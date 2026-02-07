// ============================================
// FILE 2: app/dashboard/personal/[userId]/page.tsx
// ============================================
'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit, Trash2, User, Loader2, ArrowLeft } from 'lucide-react';
import { supabase, Memorial } from '@/lib/supabase';

export default function PersonalDashboard({ params }: { params: Promise<{ userId: string }> }) {
    const unwrappedParams = use(params);
    const userId = unwrappedParams.userId;
    const [memorials, setMemorials] = useState<Memorial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMemorials();
    }, [userId]);

    const loadMemorials = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('memorials')
            .select('*')
            .eq('user_id', userId)
            .eq('mode', 'personal')
            .order('updated_at', { ascending: false });
        if (error) console.error('Error:', error);
        if (data) setMemorials(data);
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

    const deleteMemorial = async (id: string) => {
        if (!confirm('Delete?')) return;
        await supabase.from('memorials').delete().eq('id', id);
        loadMemorials();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sage/5 via-ivory to-sage/10">
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
                            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${memorials.length >= 1 ? 'bg-sand/30 text-charcoal/40 cursor-not-allowed' : 'bg-gradient-to-r from-sage to-sage/90 hover:shadow-lg text-ivory'}`}
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
                        <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    </div>
                ) : memorials.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User size={48} className="text-sage" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Create Your Memorial</h2>
                        <button onClick={handleCreate} className="inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl font-semibold">
                            <Plus size={20} />
                            Create
                        </button>
                    </div>
                ) : (
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
                                        <Link href={`/person/${memorial.id}`} className="flex-1 py-2 px-3 bg-sage/10 hover:bg-sage/20 text-sage rounded-lg font-medium text-center text-sm">
                                            <Eye size={16} className="inline mr-1" />View
                                        </Link>
                                        <Link href={`/create?id=${memorial.id}`} className="flex-1 py-2 px-3 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg font-medium text-center text-sm">
                                            <Edit size={16} className="inline mr-1" />Edit
                                        </Link>
                                        <button onClick={() => deleteMemorial(memorial.id)} className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
