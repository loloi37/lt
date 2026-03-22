'use client';

import { useState, use, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
    MessageCircle, Image as ImageIcon,
    ArrowLeft, Send, Loader2,
    Check, AlertCircle, X
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type ContributionType = 'memory' | 'photo';

function ContributeContent({
    memorialId
}: {
    memorialId: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const typeFromUrl =
        searchParams.get('type') as ContributionType | null;

    const [type, setType] =
        useState<ContributionType>(
            typeFromUrl || 'memory'
        );
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [photoFile, setPhotoFile] =
        useState<File | null>(null);
    const [photoPreview, setPhotoPreview] =
        useState<string | null>(null);
    const [photoCaption, setPhotoCaption] = useState('');
    const [photoYear, setPhotoYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const photoRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handlePhotoSelect = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Client-side size check (10MB)
        if (file.size > 10 * 1024 * 1024) {
            setError('Photo must be under 10MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setPhotoFile(file);
        setError(null);
    };

    const handleSubmit = async () => {
        // Validation
        if (type === 'memory') {
            if (!title.trim()) {
                setError('Please add a title for your memory.');
                return;
            }
            if (!content.trim() || content.length < 20) {
                setError(
                    'Please write at least a sentence or two.'
                );
                return;
            }
        }

        if (type === 'photo' && !photoFile) {
            setError('Please select a photo to upload.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data: { user } } =
                await supabase.auth.getUser();

            // Check for anonymous contributor in session
            const anonData = (() => {
                try {
                    const s = sessionStorage.getItem(
                        'anon_contributor'
                    );
                    return s ? JSON.parse(s) : null;
                } catch { return null; }
            })();

            const contributorName =
                authorName.trim() ||
                anonData?.name ||
                'Anonymous';

            let contributionContent: Record<string, any> = {};

            if (type === 'memory') {
                contributionContent = {
                    title: title.trim(),
                    content: content.trim(),
                    relationship: relationship.trim()
                };
            }

            if (type === 'photo' && photoFile) {
                // Upload photo first
                const ext =
                    photoFile.name.split('.').pop() || 'jpg';
                const path =
                    `${memorialId}/witness-photos/` +
                    `${Date.now()}.${ext}`;

                const { error: uploadError } =
                    await supabase.storage
                        .from('memorial-media')
                        .upload(path, photoFile, {
                            contentType: photoFile.type,
                            upsert: false
                        });

                if (uploadError) throw uploadError;

                const { data: urlData } =
                    supabase.storage
                        .from('memorial-media')
                        .getPublicUrl(path);

                contributionContent = {
                    title: photoCaption.trim() || 'Photo',
                    url: urlData.publicUrl,
                    caption: photoCaption.trim(),
                    year: photoYear.trim(),
                    relationship: relationship.trim()
                };
            }

            // Submit the contribution
            const { error: insertError } =
                await supabase
                    .from('memorial_contributions')
                    .insert({
                        memorial_id: memorialId,
                        user_id: user?.id || null,
                        witness_name: contributorName,
                        contributor_email: anonData?.email || null,
                        contributor_verified:
                            anonData ? true : false,
                        is_anonymous: !user,
                        type,
                        content: contributionContent,
                        status: 'pending_approval'
                    });

            if (insertError) throw insertError;

            setSubmitted(true);

        } catch (err: any) {
            console.error('[contribute]', err);
            setError(
                err.message ||
                'Failed to submit. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (submitted) {
        return (
            <div className="min-h-screen bg-ivory flex
        items-center justify-center p-6">
                <div className="max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-sage/10
            rounded-full flex items-center
            justify-center mx-auto mb-6">
                        <Check size={32} className="text-sage" />
                    </div>
                    <h2 className="font-serif text-3xl
            text-charcoal mb-3">
                        {type === 'photo'
                            ? 'Photo submitted'
                            : 'Memory submitted'}
                    </h2>
                    <p className="text-sm text-charcoal/50
            mb-8 leading-relaxed">
                        The archive owner will review your
                        contribution. You can track its status
                        from your archive dashboard.
                    </p>
                    <div className="flex flex-col
            sm:flex-row gap-3">
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setTitle('');
                                setContent('');
                                setPhotoFile(null);
                                setPhotoPreview(null);
                                setPhotoCaption('');
                                setPhotoYear('');
                            }}
                            className="flex-1 py-3 border
                border-sand/40 rounded-xl text-sm
                text-charcoal/60 hover:bg-sand/10
                transition-all font-sans"
                        >
                            Share another
                        </button>
                        <button
                            onClick={() =>
                                router.push(
                                    `/archive/${memorialId}`
                                )
                            }
                            className="flex-1 py-3 bg-charcoal
                text-ivory rounded-xl text-sm
                font-medium hover:bg-charcoal/90
                transition-all btn-paper font-sans"
                        >
                            Back to dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-ivory">

            {/* Header */}
            <div className="border-b border-sand/20
        bg-white sticky top-0 z-10">
                <div className="max-w-2xl mx-auto
          px-6 py-4 flex items-center gap-4">
                    <button
                        onClick={() =>
                            router.push(`/archive/${memorialId}`)
                        }
                        className="p-2 hover:bg-sand/10
              rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20}
                            className="text-charcoal/60" />
                    </button>
                    <h1 className="font-serif text-xl
            text-charcoal">
                        Share a contribution
                    </h1>
                </div>
            </div>

            <div className="max-w-2xl mx-auto
        px-6 py-10">

                {/* Type switcher */}
                <div className="flex gap-2 p-1
          bg-sand/20 rounded-xl mb-8">
                    {(['memory', 'photo'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => {
                                setType(t);
                                setError(null);
                            }}
                            className={`flex-1 py-2.5 rounded-lg
                text-sm font-medium transition-all
                flex items-center justify-center
                gap-2 font-sans ${type === t
                                    ? 'bg-white shadow-sm text-charcoal'
                                    : 'text-charcoal/50 hover:text-charcoal'
                                }`}
                        >
                            {t === 'memory'
                                ? <MessageCircle size={16} />
                                : <ImageIcon size={16} />
                            }
                            {t === 'memory'
                                ? 'A memory'
                                : 'A photo'}
                        </button>
                    ))}
                </div>

                <div className="space-y-6">

                    {/* Memory form */}
                    {type === 'memory' && (
                        <>
                            <div>
                                <label className="block text-xs
                  font-medium text-charcoal/50
                  uppercase tracking-wider
                  mb-2 font-sans">
                                    What is this memory about?
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e =>
                                        setTitle(e.target.value)
                                    }
                                    placeholder="e.g. The summer she taught me to bake"
                                    className="w-full px-4 py-3 border
                    border-sand/40 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-mist/20 focus:border-mist
                    transition-all text-sm font-sans"
                                />
                            </div>

                            <div>
                                <label className="block text-xs
                  font-medium text-charcoal/50
                  uppercase tracking-wider
                  mb-2 font-sans">
                                    Tell the story
                                </label>
                                <textarea
                                    value={content}
                                    onChange={e =>
                                        setContent(e.target.value)
                                    }
                                    placeholder="Write your memory here. There is no right or wrong way — just tell it as you remember it."
                                    rows={7}
                                    className="w-full px-4 py-3 border
                    border-sand/40 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-mist/20 focus:border-mist
                    transition-all resize-none text-sm
                    font-serif leading-relaxed"
                                />
                                <p className="text-xs text-charcoal/30
                  mt-1.5 font-sans text-right">
                                    {content.length} characters
                                </p>
                            </div>
                        </>
                    )}

                    {/* Photo form */}
                    {type === 'photo' && (
                        <>
                            {!photoPreview ? (
                                <div
                                    onClick={() =>
                                        photoRef.current?.click()
                                    }
                                    className="border-2 border-dashed
                    border-sand/40 rounded-xl p-12
                    text-center cursor-pointer
                    hover:border-mist/40 hover:bg-mist/5
                    transition-all"
                                >
                                    <ImageIcon size={40}
                                        className="text-charcoal/20
                      mx-auto mb-3" />
                                    <p className="text-sm
                    text-charcoal/50 font-sans">
                                        Click to select a photo
                                    </p>
                                    <p className="text-xs
                    text-charcoal/30 mt-1 font-sans">
                                        JPG, PNG up to 10MB
                                    </p>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="w-full rounded-xl
                      border-2 border-sand/30
                      max-h-80 object-cover"
                                    />
                                    <button
                                        onClick={() => {
                                            setPhotoFile(null);
                                            setPhotoPreview(null);
                                        }}
                                        className="absolute top-3 right-3
                      p-2 bg-charcoal/80 rounded-full
                      hover:bg-charcoal transition-all"
                                    >
                                        <X size={14}
                                            className="text-ivory" />
                                    </button>
                                </div>
                            )}

                            <input
                                ref={photoRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoSelect}
                                className="hidden"
                            />

                            <div>
                                <label className="block text-xs
                  font-medium text-charcoal/50
                  uppercase tracking-wider
                  mb-2 font-sans">
                                    Caption (optional)
                                </label>
                                <input
                                    type="text"
                                    value={photoCaption}
                                    onChange={e =>
                                        setPhotoCaption(e.target.value)
                                    }
                                    placeholder="What is happening in this photo?"
                                    className="w-full px-4 py-3 border
                    border-sand/40 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-mist/20 focus:border-mist
                    transition-all text-sm font-sans"
                                />
                            </div>

                            <div>
                                <label className="block text-xs
                  font-medium text-charcoal/50
                  uppercase tracking-wider
                  mb-2 font-sans">
                                    Approximate year (optional)
                                </label>
                                <input
                                    type="text"
                                    value={photoYear}
                                    onChange={e =>
                                        setPhotoYear(e.target.value)
                                    }
                                    placeholder="e.g. 1987"
                                    className="w-full px-4 py-3 border
                    border-sand/40 rounded-xl
                    focus:outline-none focus:ring-2
                    focus:ring-mist/20 focus:border-mist
                    transition-all text-sm font-sans"
                                />
                            </div>
                        </>
                    )}

                    {/* Shared fields */}
                    <div className="grid grid-cols-1
            sm:grid-cols-2 gap-4 pt-2 border-t
            border-sand/20">
                        <div>
                            <label className="block text-xs
                font-medium text-charcoal/50
                uppercase tracking-wider
                mb-2 font-sans">
                                Your name (optional)
                            </label>
                            <input
                                type="text"
                                value={authorName}
                                onChange={e =>
                                    setAuthorName(e.target.value)
                                }
                                placeholder="How you want to be credited"
                                className="w-full px-4 py-3 border
                  border-sand/40 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-mist/20 focus:border-mist
                  transition-all text-sm font-sans"
                            />
                        </div>
                        <div>
                            <label className="block text-xs
                font-medium text-charcoal/50
                uppercase tracking-wider
                mb-2 font-sans">
                                Your relationship (optional)
                            </label>
                            <input
                                type="text"
                                value={relationship}
                                onChange={e =>
                                    setRelationship(e.target.value)
                                }
                                placeholder="e.g. Daughter, Colleague"
                                className="w-full px-4 py-3 border
                  border-sand/40 rounded-xl
                  focus:outline-none focus:ring-2
                  focus:ring-mist/20 focus:border-mist
                  transition-all text-sm font-sans"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-50
              border border-red-200 rounded-xl
              flex items-start gap-3">
                            <AlertCircle size={16}
                                className="text-red-500 mt-0.5
                  flex-shrink-0" />
                            <p className="text-sm text-red-700
                font-sans">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Review notice */}
                    <div className="p-4 bg-sand/10
            rounded-xl border border-sand/20
            flex items-start gap-3">
                        <AlertCircle size={16}
                            className="text-charcoal/30 mt-0.5
                flex-shrink-0" />
                        <p className="text-xs text-charcoal/40
              leading-relaxed font-sans">
                            Your contribution will be reviewed
                            by the archive owner before it appears.
                            This usually takes a few days.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl
              font-medium transition-all flex
              items-center justify-center gap-2
              btn-paper font-sans ${loading
                                ? 'bg-sand/20 text-charcoal/30 cursor-not-allowed'
                                : 'bg-charcoal hover:bg-charcoal/90 text-ivory shadow-lg'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18}
                                    className="animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit for review
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ContributePage({
    params
}: {
    params: Promise<{ memorialId: string }>
}) {
    const { memorialId } = use(params);
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ivory
        flex items-center justify-center">
                <Loader2 size={32}
                    className="text-mist animate-spin" />
            </div>
        }>
            <ContributeContent memorialId={memorialId} />
        </Suspense>
    );
}