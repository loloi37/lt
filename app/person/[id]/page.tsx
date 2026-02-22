// app/person/[id]/page.tsx
'use client';
import { useState, useEffect, use } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MemorialRenderer from '@/components/MemorialRenderer';

export default function PersonMemorialPage({ params }: {
    params: Promise<{ id: string }>
}) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.id;

    const [memorialData, setMemorialData] = useState<any>(null);
    const [relations, setRelations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [accessDenied, setAccessDenied] = useState(false);

    useEffect(() => {
        loadMemorial();
    }, [memorialId]);

    const loadMemorial = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('memorials')
                .select('*')
                .eq('id', memorialId)
                .single();

            if (error) throw error;

            if (!data) {
                setError('Archive not found');
                return;
            }

            // ── ACCESS CONTROL ──────────────────────────────────────────────
            // An archive is publicly readable only if it has been paid for.
            // Unpaid / draft archives are private to the owner.
            const currentUserId = typeof window !== 'undefined'
                ? localStorage.getItem('user-id')
                : null;
            const isOwner = currentUserId && currentUserId === data.user_id;

            if (!data.paid && !isOwner) {
                setAccessDenied(true);
                setLoading(false);
                return;
            }
            // ────────────────────────────────────────────────────────────────

            setMemorialData({
                step1: data.step1,
                step2: data.step2,
                step3: data.step3,
                step4: data.step4,
                step5: data.step5,
                step6: data.step6,
                step7: data.step7,
                step8: data.step8,
                step9: data.step9 || { videos: [] },
            });

            // Fetch relations
            const { data: rels } = await supabase
                .from('memorial_relations')
                .select('*')
                .eq('from_memorial_id', memorialId);

            if (rels && rels.length > 0) {
                const targetIds = rels.map((r: any) => r.to_memorial_id);
                const { data: targets } = await supabase
                    .from('memorials')
                    .select('id, full_name')
                    .in('id', targetIds);

                const combinedRelations = rels.map((r: any) => {
                    const target = targets?.find((t: any) => t.id === r.to_memorial_id);
                    return { ...r, target_name: target?.full_name };
                }).filter((r: any) => r.target_name);

                setRelations(combinedRelations);
            }
        } catch (err: any) {
            console.error('Error loading archive:', err);
            setError(err.message || 'Failed to load archive');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="text-mist animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60">Loading archive...</p>
                </div>
            </div>
        );
    }

    // Private archive — viewer is not the owner
    if (accessDenied) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-parchment rounded-full flex items-center justify-center mx-auto mb-6 border border-sand">
                        <Lock size={32} className="text-charcoal/40" />
                    </div>
                    <h1 className="font-serif text-3xl text-charcoal mb-3">This archive is private</h1>
                    <p className="text-charcoal/60 mb-8 leading-relaxed">
                        This archive has not been published yet. Only its owner can view it.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-6 py-3 border border-charcoal text-charcoal rounded-full text-sm font-medium hover:bg-charcoal hover:text-ivory transition-all"
                    >
                        Return home
                    </a>
                </div>
            </div>
        );
    }

    if (error || !memorialData) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h1 className="font-serif text-3xl text-charcoal mb-3">Archive not found</h1>
                    <p className="text-charcoal/60 mb-6">{error || 'This archive does not exist.'}</p>
                    <a href="/" className="inline-block px-6 py-3 border border-charcoal text-charcoal rounded-full text-sm font-medium hover:bg-charcoal hover:text-ivory transition-all">
                        Return home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <MemorialRenderer
            data={memorialData}
            relations={relations}
            isPreview={false}
            compact={false}
        />
    );
}
