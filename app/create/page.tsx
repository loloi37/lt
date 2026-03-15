// app/create/page.tsx — Collections-based memorial builder
// Replaces the 10-step wizard with 4 thematic tabs:
// Stories, Photos, Timeline, Voices + Review & Preserve
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Image, Clock, Users, Eye, Shield, ArrowLeft } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { useAutoSave } from '@/hooks/useAutoSave';
import SaveIndicator from '@/components/SaveIndicator';
import PreviewModal from '@/components/wizard/PreviewModal';
import StoryCollection from '@/components/collections/StoryCollection';
import MediaCollection from '@/components/collections/MediaCollection';
import TimelineCollection from '@/components/collections/TimelineCollection';
import NetworkCollection from '@/components/collections/NetworkCollection';
import PreservationControls from '@/components/PreservationControls';
import LetterToFuture from '@/components/LetterToFuture';
import type {
    MemorialData,
    StoryData,
    MediaData,
    TimelineData,
    NetworkData,
    CollectionName,
    COLLECTION_NAMES,
} from '@/types/memorial';
import {
    createDefaultMemorialData,
    createDefaultStoryData,
    createDefaultMediaData,
    createDefaultTimelineData,
    createDefaultNetworkData,
} from '@/types/memorial';

type Tab = 'stories' | 'photos' | 'timeline' | 'voices' | 'letters' | 'preserve';

const TABS: { key: Tab; label: string; icon: typeof BookOpen }[] = [
    { key: 'stories', label: 'Stories', icon: BookOpen },
    { key: 'photos', label: 'Photos', icon: Image },
    { key: 'timeline', label: 'Timeline', icon: Clock },
    { key: 'voices', label: 'Voices', icon: Users },
];

function CreatePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = useAuth();

    const [memorialId, setMemorialId] = useState<string | null>(searchParams.get('id'));
    const [activeTab, setActiveTab] = useState<Tab>(
        (searchParams.get('tab') as Tab) || 'stories'
    );
    const [data, setData] = useState<MemorialData>(createDefaultMemorialData());
    const [loading, setLoading] = useState(true);
    const [showPreview, setShowPreview] = useState(false);

    // Auto-save
    const { saveStatus, lastSavedAt, saveNow } = useAutoSave({
        memorialId,
        data,
        enabled: !!memorialId,
    });

    // Load existing memorial or create new one
    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const existingId = searchParams.get('id');

            if (existingId) {
                // Load existing memorial
                const { data: memorial, error } = await supabase
                    .from('memorials')
                    .select('*')
                    .eq('id', existingId)
                    .single();

                if (memorial && !error) {
                    setData({
                        stories: memorial.stories ? { ...createDefaultStoryData(), ...memorial.stories } : createDefaultStoryData(),
                        media: memorial.media ? { ...createDefaultMediaData(), ...memorial.media } : createDefaultMediaData(),
                        timeline: memorial.timeline ? { ...createDefaultTimelineData(), ...memorial.timeline } : createDefaultTimelineData(),
                        network: memorial.network ? { ...createDefaultNetworkData(), ...memorial.network } : createDefaultNetworkData(),
                        letters: memorial.letters || [],
                        lastSaved: memorial.updated_at || null,
                    });
                    setMemorialId(existingId);
                }
            } else {
                // Check for existing draft
                const { data: existing } = await supabase
                    .from('memorials')
                    .select('id, stories, media, timeline, network, letters, updated_at')
                    .eq('user_id', user.id)
                    .eq('state', 'creating')
                    .order('updated_at', { ascending: false })
                    .limit(1)
                    .single();

                if (existing) {
                    setData({
                        stories: existing.stories ? { ...createDefaultStoryData(), ...existing.stories } : createDefaultStoryData(),
                        media: existing.media ? { ...createDefaultMediaData(), ...existing.media } : createDefaultMediaData(),
                        timeline: existing.timeline ? { ...createDefaultTimelineData(), ...existing.timeline } : createDefaultTimelineData(),
                        network: existing.network ? { ...createDefaultNetworkData(), ...existing.network } : createDefaultNetworkData(),
                        letters: existing.letters || [],
                        lastSaved: existing.updated_at || null,
                    });
                    setMemorialId(existing.id);
                } else {
                    // Create new memorial
                    const { data: newMemorial, error: createError } = await supabase
                        .from('memorials')
                        .insert([{
                            user_id: user.id,
                            state: 'creating',
                            stories: createDefaultStoryData(),
                            media: createDefaultMediaData(),
                            timeline: createDefaultTimelineData(),
                            network: createDefaultNetworkData(),
                        }])
                        .select('id')
                        .single();

                    if (newMemorial && !createError) {
                        setMemorialId(newMemorial.id);
                    }
                }
            }

            setLoading(false);
        };

        init();
    }, [searchParams]);

    // Update helpers
    const updateStories = (stories: StoryData) => setData(d => ({ ...d, stories }));
    const updateMedia = (media: MediaData) => setData(d => ({ ...d, media }));
    const updateTimeline = (timeline: TimelineData) => setData(d => ({ ...d, timeline }));
    const updateNetwork = (network: NetworkData) => setData(d => ({ ...d, network }));

    if (loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/40 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    // Prompt login if not authenticated and trying to save
    if (!auth.authenticated && !auth.loading) {
        return (
            <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <h1 className="font-serif text-3xl text-charcoal mb-4">Sign in to continue</h1>
                    <p className="text-charcoal/50 mb-8 leading-relaxed">
                        Create a free account to start building your memorial. Your work is saved automatically.
                    </p>
                    <a
                        href={`/signup?next=/create`}
                        className="inline-block px-8 py-3 bg-charcoal text-ivory rounded-lg font-medium hover:bg-charcoal/90 transition-colors"
                    >
                        Get started
                    </a>
                    <p className="mt-4 text-sm text-charcoal/30">
                        Already have an account?{' '}
                        <a href="/login?next=/create" className="underline hover:text-charcoal/50">Sign in</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory">
            {/* Top bar */}
            <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-sand/30">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="p-2 hover:bg-sand/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft size={18} className="text-charcoal/40" />
                        </button>
                        <div>
                            <h1 className="font-serif text-lg text-charcoal">
                                {data.stories.fullName || 'New Memorial'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} error={null} />
                        <button
                            onClick={() => setShowPreview(true)}
                            className="px-3 py-1.5 text-xs border border-sand/30 rounded-lg text-charcoal/50 hover:bg-sand/10 transition-colors flex items-center gap-1.5"
                        >
                            <Eye size={14} /> Preview
                        </button>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="max-w-6xl mx-auto px-4 pb-0">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                                    activeTab === key
                                        ? 'border-charcoal text-charcoal'
                                        : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
                                }`}
                            >
                                <Icon size={15} />
                                {label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActiveTab('letters')}
                            className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                                activeTab === 'letters'
                                    ? 'border-charcoal text-charcoal'
                                    : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
                            }`}
                        >
                            Letters
                        </button>
                        <button
                            onClick={() => setActiveTab('preserve')}
                            className={`px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                                activeTab === 'preserve'
                                    ? 'border-charcoal text-charcoal'
                                    : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
                            }`}
                        >
                            <Shield size={15} />
                            Preserve
                        </button>
                    </div>
                </div>
            </header>

            {/* Content area */}
            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {activeTab === 'stories' && (
                    <StoryCollection data={data.stories} onChange={updateStories} />
                )}

                {activeTab === 'photos' && (
                    <MediaCollection data={data.media} onChange={updateMedia} memorialId={memorialId} />
                )}

                {activeTab === 'timeline' && (
                    <TimelineCollection data={data.timeline} onChange={updateTimeline} />
                )}

                {activeTab === 'voices' && (
                    <NetworkCollection
                        data={data.network}
                        onChange={updateNetwork}
                        memorialId={memorialId}
                        deceasedName={data.stories.fullName || 'your loved one'}
                        inviterName={auth.user?.email || ''}
                    />
                )}

                {activeTab === 'letters' && (
                    <LetterToFuture
                        letters={data.letters}
                        onChange={(letters) => setData(d => ({ ...d, letters }))}
                        memorialId={memorialId}
                    />
                )}

                {activeTab === 'preserve' && (
                    <PreservationControls
                        data={data}
                        memorialId={memorialId}
                        onBack={() => setActiveTab('stories')}
                        isSelfArchive={data.stories.isSelfArchive}
                        userId={auth.user?.id}
                    />
                )}
            </main>

            {/* Preview modal */}
            {showPreview && (
                <PreviewModal
                    data={data}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
}

export default function CreatePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-sand/30 border-t-charcoal/40 rounded-full animate-spin mx-auto" />
            </div>
        }>
            <CreatePageContent />
        </Suspense>
    );
}
