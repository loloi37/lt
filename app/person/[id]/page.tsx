// app/person/[id]/page.tsx — Public memorial viewer (collections-based)
'use client';

import { useState, useEffect, use } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
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
            const supabase = createClient();
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

            // Access control: only 'live' or 'preserved' memorials are public
            const { data: { user } } = await supabase.auth.getUser();
            const isOwner = user && user.id === data.user_id;
            const isPublic = data.state === 'live' || data.state === 'preserved';

            if (!isPublic && !isOwner) {
                setAccessDenied(true);
                setLoading(false);
                return;
            }

            // Pass collections data to renderer
            setMemorialData({
                stories: data.stories || {},
                media: data.media || {},
                timeline: data.timeline || {},
                network: data.network || {},
                letters: data.letters || [],
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
                    <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60">Loading archive...</p>
                </div>
            </div>
        );
    }

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
                    <h1 className="font-serif text-3xl text-charcoal mb-3">Memorial Not Found</h1>
                    <p className="text-charcoal/60 mb-6">{error || 'This memorial does not exist.'}</p>
                    <a href="/dashboard" className="btn-paper inline-block px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-medium transition-all">
                        Go to Dashboard
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
