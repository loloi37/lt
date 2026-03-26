// app/seal-confirmation/page.tsx
// Step 2.1.3: Pre-payment confirmation page — calm archive summary
// Flow: CTA "Seal this archive" → THIS PAGE → Authorization → Payment
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Image as ImageIcon, Film, BookOpen, MapPin, Calendar, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MemorialData } from '@/types/memorial';
import { calculateCompletion } from '@/lib/completionLogic';

function SealConfirmationContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('memorialId');

    const [loading, setLoading] = useState(true);
    const [memorial, setMemorial] = useState<MemorialData | null>(null);
    const [archiveStats, setArchiveStats] = useState({
        photos: 0,
        videos: 0,
        biographyWords: 0,
        pathsExplored: 0,
        totalPaths: 5,
    });

    useEffect(() => {
        if (!memorialId) {
            setLoading(false);
            return;
        }

        const loadMemorial = async () => {
            try {
                const { data, error } = await supabase
                    .from('memorials')
                    .select('*')
                    .eq('id', memorialId)
                    .single();

                if (error) throw error;
                if (!data) return;

                setMemorial(data as MemorialData);

                // Calculate archive stats for the summary
                const completion = calculateCompletion(data as MemorialData);
                const photoCount = data.step8?.gallery?.length || 0;
                const videoCount = data.step9?.videos?.length || 0;
                const bioWords = data.step6?.biography?.trim().split(/\s+/).filter(Boolean).length || 0;
                const explored = completion.steps.filter(s => s.completed).length;

                setArchiveStats({
                    photos: photoCount,
                    videos: videoCount,
                    biographyWords: bioWords,
                    pathsExplored: explored,
                    totalPaths: completion.steps.length,
                });
            } catch (err) {
                console.error('Error loading memorial:', err);
            } finally {
                setLoading(false);
            }
        };

        loadMemorial();
    }, [memorialId]);

    const handleProceed = () => {
        // Step 2.3.1: Authorization comes BEFORE payment
        // Navigate to authorization page, which then redirects to payment
        router.push(`/authorization/${memorialId}?type=individual&redirect=payment`);
    };

    const handleGoBack = () => {
        if (memorialId) {
            router.push(`/create?id=${memorialId}`);
        } else {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-surface-low flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-warm-border/30 border-t-warm-dark/40 rounded-full animate-spin" />
            </div>
        );
    }

    const fullName = memorial?.step1?.fullName || 'this person';
    const birthDate = memorial?.step1?.birthDate || '';
    const deathDate = memorial?.step1?.deathDate || '';
    const slug = memorial?.step1?.fullName
        ? memorial.step1.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
        : memorialId;

    return (
        <div className="min-h-screen bg-surface-low">
            {/* Header */}
            <div className="border-b border-warm-border/20 bg-white/60 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-6 py-5">
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center gap-2 text-warm-dark/40 hover:text-warm-dark transition-colors text-sm"
                    >
                        <ArrowLeft size={16} />
                        Return to draft
                    </button>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-16">
                {/* Step 2.1.3: Archive declaration */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl text-warm-dark mb-4">
                        You are about to seal the archive
                    </h1>
                    <div className="text-lg text-warm-dark/50">
                        <span className="font-serif italic">{fullName}</span>
                        {birthDate && (
                            <span className="text-warm-dark/30">
                                {' '}({birthDate}{deathDate ? ` — ${deathDate}` : ''})
                            </span>
                        )}
                    </div>
                </div>

                {/* Archive contents summary */}
                <div className="bg-white rounded-2xl border border-warm-border/25 p-8 mb-8">
                    <h2 className="text-sm font-medium text-warm-dark/40 uppercase tracking-wider mb-6">
                        What this archive contains
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-10 h-10 bg-warm-border/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <ImageIcon size={18} className="text-warm-dark/30" />
                            </div>
                            <p className="text-2xl font-serif text-warm-dark">{archiveStats.photos}</p>
                            <p className="text-xs text-warm-dark/30">photo{archiveStats.photos !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 bg-warm-border/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Film size={18} className="text-warm-dark/30" />
                            </div>
                            <p className="text-2xl font-serif text-warm-dark">{archiveStats.videos}</p>
                            <p className="text-xs text-warm-dark/30">video{archiveStats.videos !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 bg-warm-border/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <BookOpen size={18} className="text-warm-dark/30" />
                            </div>
                            <p className="text-2xl font-serif text-warm-dark">{archiveStats.biographyWords}</p>
                            <p className="text-xs text-warm-dark/30">words written</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 bg-warm-border/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <MapPin size={18} className="text-warm-dark/30" />
                            </div>
                            <p className="text-2xl font-serif text-warm-dark">{archiveStats.pathsExplored}</p>
                            <p className="text-xs text-warm-dark/30">paths explored</p>
                        </div>
                    </div>
                </div>

                {/* What sealing means */}
                <div className="bg-warm-border/8 rounded-2xl border border-warm-border/15 p-8 mb-8">
                    <h2 className="text-sm font-medium text-warm-dark/40 uppercase tracking-wider mb-5">
                        What this means
                    </h2>
                    <ul className="space-y-3 text-sm text-warm-dark/50 leading-relaxed">
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-warm-dark/20 mt-2 flex-shrink-0" />
                            This archive becomes permanent. It will be accessible at
                            <span className="text-warm-dark/70 font-medium ml-1">ulumae.com/person/{slug}</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-warm-dark/20 mt-2 flex-shrink-0" />
                            It can be shared, exported, and transmitted to your heirs.
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-warm-dark/20 mt-2 flex-shrink-0" />
                            The watermark will be removed. The archive will appear exactly as you have seen it in the preview.
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-warm-dark/20 mt-2 flex-shrink-0" />
                            You can continue editing and adding content after sealing.
                        </li>
                    </ul>
                </div>

                {/* Trust elements */}
                <div className="flex items-center justify-center gap-6 mb-10 text-xs text-warm-dark/25">
                    <div className="flex items-center gap-1.5">
                        <Shield size={12} />
                        <span>One-time payment</span>
                    </div>
                    <div className="w-px h-3 bg-warm-border/30" />
                    <span>No subscription</span>
                    <div className="w-px h-3 bg-warm-border/30" />
                    <span>Lifetime access</span>
                </div>

                {/* Step 2.1.3: Two equal buttons — return and proceed */}
                <div className="space-y-3 max-w-md mx-auto">
                    <button
                        onClick={handleProceed}
                        className="w-full py-4 glass-btn-dark rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    >
                        I am ready — Proceed
                    </button>
                    <button
                        onClick={handleGoBack}
                        className="w-full py-4 bg-white border border-warm-border/30 text-warm-dark/50 rounded-xl font-medium hover:bg-warm-border/5 transition-all"
                    >
                        I am not ready yet — Return to draft
                    </button>
                </div>

                <p className="text-center text-xs text-warm-dark/20 mt-6">
                    Your draft is saved. You can return to this page at any time.
                </p>
            </div>
        </div>
    );
}

export default function SealConfirmationPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-surface-low flex items-center justify-center">
                <div className="w-12 h-12 border-3 border-warm-border/30 border-t-warm-dark/40 rounded-full animate-spin" />
            </div>
        }>
            <SealConfirmationContent />
        </Suspense>
    );
}
