// app/person/[id]/page.tsx - UPDATED to use step9 for videos
'use client';
import { useState, useEffect, use } from 'react';
import {
    Calendar, MapPin, Heart, Briefcase, GraduationCap, Quote, Star, Home,
    Sparkles, MessageCircle, Share2, Mail, Loader2, Users, BookOpen, Lightbulb, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageViewer from '@/components/ImageViewer';
import MemorialRenderer from '@/components/MemorialRenderer';

export default function PersonMemorialPage({ params }: {
    params: Promise<{
        id: string
    }>
}) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.id;

    const [memorialData, setMemorialData] = useState<any>(null);
    const [relations, setRelations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredInteractive, setHoveredInteractive] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerStartIndex, setViewerStartIndex] = useState(0);

    useEffect(() => {
        loadMemorial();
    }, [memorialId]);

    const loadMemorial = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch main memorial data
            const { data, error } = await supabase
                .from('memorials')
                .select('*')
                .eq('id', memorialId)
                .single();

            if (error) throw error;

            if (!data) {
                setError('Memorial not found');
                return;
            }

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

            // 2. Fetch Relations (NEW)
            const { data: rels } = await supabase
                .from('memorial_relations')
                .select('*')
                .eq('from_memorial_id', memorialId);

            if (rels && rels.length > 0) {
                const targetIds = rels.map(r => r.to_memorial_id);
                const { data: targets } = await supabase
                    .from('memorials')
                    .select('id, full_name')
                    .in('id', targetIds);

                // Merge relation info with target name
                const combinedRelations = rels.map(r => {
                    const target = targets?.find(t => t.id === r.to_memorial_id);
                    return {
                        ...r,
                        target_name: target?.full_name
                    };
                }).filter(r => r.target_name); // Only keep valid ones

                setRelations(combinedRelations);
            }
        } catch (err: any) {
            console.error('Error loading memorial:', err);
            setError(err.message || 'Failed to load memorial');
        } finally {
            setLoading(false);
        }
    };

    const calculateAge = () => {
        if (!memorialData?.step1?.birthDate) return null;
        const birth = new Date(memorialData.step1.birthDate);
        const end = memorialData.step1.isStillLiving ? new Date() :
            memorialData.step1.deathDate ? new Date(memorialData.step1.deathDate) : new Date();
        return end.getFullYear() - birth.getFullYear();
    };

    const handleInteractiveMouseMove = (e: React.MouseEvent<HTMLDivElement>, imageId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHoveredInteractive(imageId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="text-center">
                    <Loader2 size={48} className="text-sage animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60">Loading memorial...</p>
                </div>
            </div>
        );
    }

    if (error || !memorialData) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">😔</span>
                    </div>
                    <h1 className="font-serif text-3xl text-charcoal mb-3">Memorial Not Found</h1>
                    <p className="text-charcoal/60 mb-6">{error || 'This memorial does not exist.'}</p>
                    <a href="/dashboard" className="inline-block px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl font-medium transition-all">
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    const data = memorialData;

    return (
        <MemorialRenderer
            data={memorialData}
            relations={relations}
            isPreview={false}
            compact={false}
        />
    );
}