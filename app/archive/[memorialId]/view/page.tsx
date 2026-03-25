'use client';
import { use, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
    DrawerProvider,
    useDrawer
} from './_context/DrawerContext';
import ContributionDrawer from
    './_components/ContributionDrawer';
import PendingBadge from
    './_components/PendingBadge';
import { useArchiveRole } from
    '../_hooks/useArchiveRole';
import {
    ArrowLeft, BookOpen,
    ImageIcon, MessageCircle, Film
} from 'lucide-react';

function ArchiveViewContent({
    memorialId
}: {
    memorialId: string
}) {
    const router = useRouter();
    const supabase = createClient();
    const { data, loading } =
        useArchiveRole(memorialId);
    const { setContributions } = useDrawer();

    const canReview =
        data?.userRole === 'co_guardian' ||
        data?.userRole === 'owner';

    // Load pending contributions for
    // co-guardians and owners + real-time updates
    useEffect(() => {
        if (!canReview) return;

        const fetchPending = () => {
            supabase
                .from('memorial_contributions')
                .select('*')
                .eq('memorial_id', memorialId)
                .eq('status', 'pending_approval')
                .order('created_at', { ascending: true })
                .then(({ data: contributions }) => {
                    if (contributions) {
                        setContributions(contributions);
                    }
                });
        };

        fetchPending();

        const channel = supabase
            .channel(`view-pending-${memorialId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'memorial_contributions',
                    filter: `memorial_id=eq.${memorialId}`,
                },
                () => { fetchPending(); }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [canReview, memorialId]);

    if (loading || !data) {
        return (
            <div className="min-h-screen bg-surface-low
        flex items-center justify-center">
                <div className="w-10 h-10 border-2
          border-warm-border/30 border-t-warm-dark/40
          rounded-full animate-spin" />
            </div>
        );
    }

    const { memorial } = data;

    return (
        <div className="min-h-screen bg-surface-low">
            {/* Header */}
            <div className="border-b border-warm-border/20
        bg-white sticky top-0 z-30">
                <div className="max-w-3xl mx-auto
          px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() =>
                            router.push(`/archive/${memorialId}`)
                        }
                        className="p-2 hover:bg-warm-border/10
              rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20}
                            className="text-warm-dark/60" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className="font-serif text-base
              text-warm-dark truncate">
                            {memorial.fullName}
                        </p>
                        <p className="text-xs
              text-warm-dark/40 font-sans">
                            Archive
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto
        px-6 py-12 space-y-16">

                {/* Biography section */}
                <ArchiveSection
                    icon={BookOpen}
                    title="Biography"
                    section="biography"
                    canReview={canReview}
                    memorialId={memorialId}
                >
                    <BiographyBlock
                        memorialId={memorialId}
                    />
                </ArchiveSection>

                {/* Photos section */}
                <ArchiveSection
                    icon={ImageIcon}
                    title="Photos"
                    section="photos"
                    canReview={canReview}
                    memorialId={memorialId}
                >
                    <PhotosBlock
                        memorialId={memorialId}
                    />
                </ArchiveSection>

                {/* Memories section */}
                <ArchiveSection
                    icon={MessageCircle}
                    title="Memories"
                    section="memories"
                    canReview={canReview}
                    memorialId={memorialId}
                >
                    <MemoriesBlock
                        memorialId={memorialId}
                    />
                </ArchiveSection>

                {/* Videos section */}
                <ArchiveSection
                    icon={Film}
                    title="Videos"
                    section="videos"
                    canReview={canReview}
                    memorialId={memorialId}
                >
                    <VideosBlock
                        memorialId={memorialId}
                    />
                </ArchiveSection>

            </div>

            {/* The Drawer — lives outside the scroll */}
            {canReview && (
                <ContributionDrawer
                    memorialId={memorialId}
                />
            )}
        </div>
    );
}

// ─── Section wrapper ──────────────────────────────

function ArchiveSection({
    icon: Icon,
    title,
    section,
    canReview,
    children,
    memorialId
}: {
    icon: any;
    title: string;
    section: any;
    canReview: boolean;
    children: React.ReactNode;
    memorialId: string;
}) {
    return (
        <section>
            <div className="flex items-center
        gap-3 mb-8">
                <div className="w-8 h-8 bg-warm-border/20
          rounded-lg flex items-center
          justify-center">
                    <Icon size={16}
                        className="text-warm-dark/40" />
                </div>
                <h2 className="font-serif text-2xl
          text-warm-dark">
                    {title}
                </h2>
                {/* Badge only visible to reviewers */}
                {canReview && (
                    <PendingBadge section={section} />
                )}
            </div>
            {children}
        </section>
    );
}

// ─── Content blocks (stubs — connect to your
//     existing memorial data) ───────────────────────

function BiographyBlock({
    memorialId
}: {
    memorialId: string
}) {
    // Connect this to your existing memorial
    // step6 biography data
    return (
        <div className="prose prose-warm-dark
      font-serif max-w-none">
            <p className="text-warm-dark/60
        leading-relaxed italic text-sm">
                Biography content renders here from
                your existing memorial step data.
            </p>
        </div>
    );
}

function PhotosBlock({
    memorialId
}: {
    memorialId: string
}) {
    return (
        <div className="grid grid-cols-2
      sm:grid-cols-3 gap-3">
            <div className="aspect-square
        bg-warm-border/20 rounded-xl flex
        items-center justify-center">
                <p className="text-xs
          text-warm-dark/30 font-sans">
                    Photos from step8 data
                </p>
            </div>
        </div>
    );
}

function MemoriesBlock({
    memorialId
}: {
    memorialId: string
}) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-warm-dark/40
        font-sans italic">
                Approved memories render here.
            </p>
        </div>
    );
}

function VideosBlock({
    memorialId
}: {
    memorialId: string
}) {
    return (
        <div className="space-y-4">
            <p className="text-sm text-warm-dark/40
        font-sans italic">
                Videos from step9 data render here.
            </p>
        </div>
    );
}

// ─── Page export ──────────────────────────────────

export default function ArchiveViewPage({
    params
}: {
    params: Promise<{ memorialId: string }>
}) {
    const { memorialId } = use(params);
    return (
        <DrawerProvider>
            <Suspense fallback={
                <div className="min-h-screen bg-surface-low
          flex items-center justify-center">
                    <div className="w-10 h-10 border-2
            border-warm-border/30 border-t-warm-dark/40
            rounded-full animate-spin" />
                </div>
            }>
                <ArchiveViewContent
                    memorialId={memorialId}
                />
            </Suspense>
        </DrawerProvider>
    );
}