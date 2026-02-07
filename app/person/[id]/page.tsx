// app/person/[id]/page.tsx - UPDATED to use step9 for videos
'use client';
import { useState, useEffect, use } from 'react';
import {
    Calendar, MapPin, Heart, Briefcase, GraduationCap, Quote, Star, Home,
    Sparkles, MessageCircle, Share2, Mail, Loader2, Users, BookOpen, Lightbulb, Award
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ImageViewer from '@/components/ImageViewer';

export default function PersonMemorialPage({ params }: {
    params: Promise<{
        id: string
    }>
}) {
    const unwrappedParams = use(params);
    const memorialId = unwrappedParams.id;

    const [memorialData, setMemorialData] = useState<any>(null);
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
                step9: data.step9 || { videos: [] }, // UPDATED: Added step9 with fallback
            });
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
        <div className="min-h-screen bg-ivory">
            {/* Hero Section */}
            <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-sage/30 to-terracotta/30">
                {data.step8.coverPhotoPreview ? (
                    <>
                        <img src={data.step8.coverPhotoPreview} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#7a7979] via-[#7a7979]/20 to-[#7a7979]/10" />
                    </>
                ) : <div className="absolute inset-0 bg-gradient-to-br from-[#706b6b] via-[#706b6b] to-[#706b6b]" />}

                <div className="absolute bottom-0 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 pb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                            {data.step1.profilePhotoPreview && (
                                <div className="w-40 h-40 md:w-48 md:h-48 rounded-2xl border-4 border-ivory shadow-2xl overflow-hidden flex-shrink-0 bg-white">
                                    <img src={data.step1.profilePhotoPreview} alt={data.step1.fullName} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="text-center md:text-left pb-4">
                                <h1 className="font-serif text-5xl md:text-6xl text-ivory mb-3 drop-shadow-2xl">{data.step1.fullName}</h1>
                                <div className="flex flex-col md:flex-row items-center gap-3 text-ivory/90 text-lg drop-shadow-lg">
                                    {data.step1.birthDate && (
                                        <div className="flex items-center gap-2">
                                            <Calendar size={20} />
                                            <span>{new Date(data.step1.birthDate).toLocaleDateString('en-US', {
                                                month: 'long', day: 'numeric', year: 'numeric'
                                            })}</span>
                                        </div>
                                    )}
                                    {!data.step1.isStillLiving && data.step1.deathDate && (
                                        <>
                                            <span className="hidden md:inline">—</span>
                                            <span>{new Date(data.step1.deathDate).toLocaleDateString('en-US', {
                                                month: 'long', day: 'numeric', year: 'numeric'
                                            })}</span>
                                        </>
                                    )}
                                    {calculateAge() && (
                                        <>
                                            <span className="hidden md:inline">•</span>
                                            <span>{calculateAge()} years</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute top-6 right-6 flex gap-3">
                    <button className="p-3 bg-ivory/90 hover:bg-ivory rounded-full shadow-lg transition-all">
                        <Share2 size={20} className="text-charcoal" />
                    </button>
                    <button className="p-3 bg-ivory/90 hover:bg-ivory rounded-full shadow-lg transition-all">
                        <Mail size={20} className="text-charcoal" />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-16">
                {/* Epitaph */}
                {data.step1.epitaph && (
                    <div className="text-center py-12 border-y border-sand/30">
                        <Quote size={40} className="text-terracotta mx-auto mb-6 opacity-50" />
                        <p className="font-serif text-3xl md:text-4xl text-charcoal/80 italic leading-relaxed max-w-4xl mx-auto">
                            "{data.step1.epitaph}"
                        </p>
                    </div>
                )}

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {data.step1.birthPlace && (
                        <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={24} className="text-sage" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal/60 mb-1">Born in</p>
                                    <p className="text-charcoal font-semibold">{data.step1.birthPlace}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.step1.deathPlace && !data.step1.isStillLiving && (
                        <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <MapPin size={24} className="text-sage" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal/60 mb-1">Passed in</p>
                                    <p className="text-charcoal font-semibold">{data.step1.deathPlace}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.step3.occupations && data.step3.occupations.length > 0 && (
                        <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Briefcase size={24} className="text-terracotta" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal/60 mb-1">Career</p>
                                    <p className="text-charcoal font-semibold">{data.step3.occupations[0].title}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.step4.children && data.step4.children.length > 0 && (
                        <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Heart size={24} className="text-sage" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal/60 mb-1">Family</p>
                                    <p className="text-charcoal font-semibold">
                                        {data.step4.children.length} child{data.step4.children.length !== 1 ? 'ren' : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {data.step5.personalityTraits && data.step5.personalityTraits.length > 0 && (
                        <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Sparkles size={24} className="text-terracotta" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal/60 mb-1">Known for</p>
                                    <p className="text-charcoal font-semibold">
                                        {data.step5.personalityTraits.slice(0, 2).join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Life Story */}
                {data.step6.biography && (
                    <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sand/30">
                        <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                                <Quote size={24} className="text-sage" />
                            </div>
                            Life Story
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-charcoal/80 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                                {data.step6.biography}
                            </p>
                        </div>
                    </section>
                )}

                {/* Life Chapters */}
                {data.step6.lifeChapters && data.step6.lifeChapters.length > 0 && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8">Life Chapters</h2>
                        <div className="space-y-6">
                            {data.step6.lifeChapters.map((chapter: any, index: number) => (
                                <div key={chapter.id} className="bg-white rounded-xl p-6 md:p-8 shadow-sm border-l-4 border-sage">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-sage text-ivory rounded-full flex items-center justify-center font-serif text-xl font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-serif text-2xl text-charcoal mb-2">{chapter.title}</h3>
                                            {chapter.period && <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-sm font-medium mr-2">{chapter.period}</span>}
                                            {chapter.ageRange && <span className="px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-sm font-medium">{chapter.ageRange}</span>}
                                            <p className="text-charcoal/70 leading-relaxed mt-3">{chapter.description}</p>
                                            {chapter.keyEvents && chapter.keyEvents.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-semibold text-charcoal/60 mb-2">Key Events:</p>
                                                    <ul className="list-disc list-inside space-y-1 text-charcoal/70">
                                                        {chapter.keyEvents.map((event: string, idx: number) => (
                                                            <li key={idx}>{event}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Early Life */}
                {(data.step2.childhoodHome || data.step2.familyBackground || data.step2.schools || data.step2.earlyInterests) && (
                    <section className="bg-gradient-to-br from-sage/5 to-terracotta/5 rounded-2xl p-8 md:p-12 border border-sand/30">
                        <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center">
                                <Home size={24} className="text-terracotta" />
                            </div>
                            Early Life & Childhood
                        </h2>
                        <div className="space-y-6">
                            {data.step2.childhoodHome && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-2">Childhood Home</h3>
                                    <p className="text-charcoal/70 leading-relaxed">{data.step2.childhoodHome}</p>
                                </div>
                            )}
                            {data.step2.familyBackground && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-2">Family Background</h3>
                                    <p className="text-charcoal/70 leading-relaxed">{data.step2.familyBackground}</p>
                                </div>
                            )}
                            {data.step2.schools && (data.step2.schools.elementary || data.step2.schools.highSchool || data.step2.schools.college || data.step2.schools.additionalEducation) && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                                        <GraduationCap size={20} className="text-sage" />
                                        Education
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {data.step2.schools.elementary && (
                                            <div className="p-4 bg-white/60 rounded-lg">
                                                <p className="text-xs font-medium text-charcoal/60 mb-1">Elementary School</p>
                                                <p className="text-charcoal">{data.step2.schools.elementary}</p>
                                            </div>
                                        )}
                                        {data.step2.schools.highSchool && (
                                            <div className="p-4 bg-white/60 rounded-lg">
                                                <p className="text-xs font-medium text-charcoal/60 mb-1">High School</p>
                                                <p className="text-charcoal">{data.step2.schools.highSchool}</p>
                                            </div>
                                        )}
                                        {data.step2.schools.college && (
                                            <div className="p-4 bg-white/60 rounded-lg">
                                                <p className="text-xs font-medium text-charcoal/60 mb-1">College</p>
                                                <p className="text-charcoal">{data.step2.schools.college}</p>
                                            </div>
                                        )}
                                        {data.step2.schools.additionalEducation && (
                                            <div className="p-4 bg-white/60 rounded-lg">
                                                <p className="text-xs font-medium text-charcoal/60 mb-1">Additional Education</p>
                                                <p className="text-charcoal">{data.step2.schools.additionalEducation}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {data.step2.childhoodPersonality && data.step2.childhoodPersonality.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-3">As a Child</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.step2.childhoodPersonality.map((trait: string) => (
                                            <span key={trait} className="px-4 py-2 bg-sage/10 text-sage rounded-full text-sm font-medium">{trait}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.step2.earlyInterests && data.step2.earlyInterests.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-3">Early Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.step2.earlyInterests.map((interest: string) => (
                                            <span key={interest} className="px-4 py-2 bg-terracotta/10 text-terracotta rounded-full text-sm font-medium">{interest}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.step2.childhoodPhotos && data.step2.childhoodPhotos.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-3">Childhood Photos</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {data.step2.childhoodPhotos.map((photo: any) => (
                                            <div key={photo.preview} className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm">
                                                <img src={photo.preview} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                {(photo.caption || photo.year) && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {photo.caption && <p className="text-ivory text-sm">{photo.caption}</p>}
                                                        {photo.year && <p className="text-ivory/70 text-xs">{photo.year}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Career & Education */}
                {((data.step3?.occupations && data.step3.occupations.length > 0) ||
                    (data.step3?.careerHighlights && data.step3.careerHighlights.length > 0) ||
                    (data.step3?.education && (data.step3.education.major || data.step3.education.graduationYear || data.step3.education.honors))) && (
                        <section>
                            <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center">
                                    <Briefcase size={24} className="text-terracotta" />
                                </div>
                                Career & Achievements
                            </h2>
                            <div className="space-y-6">
                                {data.step3?.occupations && data.step3.occupations.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-xl text-charcoal mb-4">Professional Journey</h3>
                                        <div className="space-y-4">
                                            {data.step3.occupations.map((job: any) => (
                                                <div key={job.id} className="bg-white rounded-xl p-6 shadow-sm border border-sand/30">
                                                    <h4 className="font-semibold text-xl text-charcoal">{job.title}</h4>
                                                    <p className="text-charcoal/60 mb-2">{job.company}</p>
                                                    <span className="px-4 py-2 bg-terracotta/10 text-terracotta rounded-full text-sm">
                                                        {job.yearsFrom} - {job.yearsTo}
                                                    </span>
                                                    {job.description && (
                                                        <p className="text-charcoal/70 leading-relaxed mt-3">{job.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.step3?.careerHighlights && data.step3.careerHighlights.length > 0 && (
                                    <div className="bg-white rounded-xl p-6 border border-sand/30">
                                        <h3 className="font-semibold text-xl text-charcoal mb-4 flex items-center gap-2">
                                            <Award size={20} className="text-sage" />
                                            Career Highlights
                                        </h3>
                                        <ul className="space-y-2">
                                            {data.step3.careerHighlights.map((highlight: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-3 text-charcoal/70">
                                                    <span className="text-sage">✓</span>
                                                    <span>{highlight}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {data.step3?.education && (data.step3.education.major || data.step3.education.graduationYear || data.step3.education.honors) && (
                                    <div className="bg-white rounded-xl p-6 border border-sand/30">
                                        <h3 className="font-semibold text-xl text-charcoal mb-4 flex items-center gap-2">
                                            <GraduationCap size={20} className="text-terracotta" />
                                            Higher Education
                                        </h3>
                                        <div className="space-y-2">
                                            {data.step3.education.major && (
                                                <p className="text-charcoal/70">
                                                    <span className="font-semibold text-charcoal">Major:</span> {data.step3.education.major}
                                                </p>
                                            )}
                                            {data.step3.education.graduationYear && (
                                                <p className="text-charcoal/70">
                                                    <span className="font-semibold text-charcoal">Graduated:</span> {data.step3.education.graduationYear}
                                                </p>
                                            )}
                                            {data.step3.education.honors && (
                                                <p className="text-charcoal/70">
                                                    <span className="font-semibold text-charcoal">Honors:</span> {data.step3.education.honors}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                {/* Family & Relationships */}
                {((data.step4.partners && data.step4.partners.length > 0) || (data.step4.children && data.step4.children.length > 0) || (data.step4.majorLifeEvents && data.step4.majorLifeEvents.length > 0)) && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                                <Heart size={24} className="text-sage" />
                            </div>
                            Family & Relationships
                        </h2>
                        {data.step4.partners && data.step4.partners.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-xl text-charcoal mb-4">Life Partners</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {data.step4.partners.map((partner: any) => (
                                        <div key={partner.id} className="bg-white rounded-xl p-6 shadow-sm border border-sand/30">
                                            {partner.photoPreview && (
                                                <div className="mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-sand/30">
                                                    <img src={partner.photoPreview} alt={partner.name} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <h4 className="font-semibold text-charcoal mb-1">{partner.name}</h4>
                                            <p className="text-sm text-charcoal/60 mb-2">{partner.relationshipType}</p>
                                            <p className="text-sm text-charcoal/60 mb-2">{partner.yearsFrom} - {partner.yearsTo}</p>
                                            {partner.description && <p className="text-charcoal/70 text-sm">{partner.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.step4.children && data.step4.children.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-xl text-charcoal mb-4">Children</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.step4.children.map((child: any) => (
                                        <div key={child.id} className="bg-white rounded-xl p-6 shadow-sm border border-sand/30">
                                            <h4 className="font-semibold text-charcoal mb-1">{child.name}</h4>
                                            <p className="text-sm text-charcoal/60 mb-2">Born {child.birthYear}</p>
                                            {child.description && <p className="text-charcoal/70 text-sm">{child.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.step4.majorLifeEvents && data.step4.majorLifeEvents.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-xl text-charcoal mb-4">Major Life Events</h3>
                                <div className="space-y-4">
                                    {data.step4.majorLifeEvents.map((event: any) => (
                                        <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-sage">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-sm font-medium">{event.year}</span>
                                                    {event.category && (
                                                        <span className="ml-2 px-3 py-1 bg-terracotta/10 text-terracotta rounded-full text-xs font-medium capitalize">{event.category}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-charcoal mb-2">{event.title}</h4>
                                                    {event.description && <p className="text-charcoal/70 text-sm">{event.description}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Personality, Values & Passions */}
                {(data.step5.personalityTraits?.length > 0 || data.step5.coreValues?.length > 0 || data.step5.passions?.length > 0 || data.step5.lifePhilosophy || data.step5.favoriteQuotes?.length > 0 || data.step5.memorableSayings?.length > 0) && (
                    <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-sand/30">
                        <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center">
                                <Sparkles size={24} className="text-terracotta" />
                            </div>
                            Personality, Values & Passions
                        </h2>
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {data.step5.personalityTraits && data.step5.personalityTraits.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-charcoal mb-4">Personality</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.step5.personalityTraits.map((trait: string) => (
                                                <span key={trait} className="px-3 py-1.5 bg-sage/10 text-sage rounded-full text-sm">{trait}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.step5.coreValues && data.step5.coreValues.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-charcoal mb-4">Values</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.step5.coreValues.map((value: string) => (
                                                <span key={value} className="px-3 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-sm">{value}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {data.step5.passions && data.step5.passions.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-charcoal mb-4">Passions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {data.step5.passions.map((passion: string) => (
                                                <span key={passion} className="px-3 py-1.5 bg-sage/10 text-sage rounded-full text-sm">{passion}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {data.step5.lifePhilosophy && (
                                <div className="bg-gradient-to-br from-sage/5 to-terracotta/5 rounded-xl p-6 border border-sand/20">
                                    <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
                                        <Lightbulb size={20} className="text-terracotta" />
                                        Life Philosophy
                                    </h3>
                                    <p className="text-charcoal/80 leading-relaxed italic">{data.step5.lifePhilosophy}</p>
                                </div>
                            )}
                            {data.step5.favoriteQuotes && data.step5.favoriteQuotes.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                                        <Quote size={20} className="text-sage" />
                                        Favorite Quotes
                                    </h3>
                                    <div className="space-y-4">
                                        {data.step5.favoriteQuotes.map((quote: any) => (
                                            <div key={quote.id} className="bg-gradient-to-br from-ivory to-sand/10 rounded-xl p-6 border-l-4 border-sage">
                                                <p className="text-charcoal/80 font-serif text-lg italic mb-2">"{quote.text}"</p>
                                                {quote.context && <p className="text-sm text-charcoal/60">{quote.context}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {data.step5.memorableSayings && data.step5.memorableSayings.length > 0 && (
                                <div>
                                    <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                                        <MessageCircle size={20} className="text-terracotta" />
                                        Memorable Sayings
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {data.step5.memorableSayings.map((saying: string, idx: number) => (
                                            <div key={idx} className="bg-white rounded-lg p-4 border border-sand/30 shadow-sm">
                                                <p className="text-charcoal/80 italic">"{saying}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Memories & Stories */}
                {(data.step7.sharedMemories?.length > 0 || data.step7.impactStories?.length > 0) && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8 flex items-center gap-3">
                            <div className="w-12 h-12 bg-sage/10 rounded-xl flex items-center justify-center">
                                <MessageCircle size={24} className="text-sage" />
                            </div>
                            Memories & Stories
                        </h2>
                        {data.step7.sharedMemories && data.step7.sharedMemories.length > 0 && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-xl text-charcoal mb-4">Shared Memories</h3>
                                <div className="space-y-6">
                                    {data.step7.sharedMemories.map((memory: any) => (
                                        <div key={memory.id} className="bg-white rounded-xl p-8 shadow-sm border border-sand/30">
                                            <h4 className="font-semibold text-xl text-charcoal mb-3">{memory.title}</h4>
                                            {memory.date && <p className="text-sm text-charcoal/60 mb-3">{memory.date}</p>}
                                            <p className="text-charcoal/70 leading-relaxed mb-4">{memory.content}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <p className="text-charcoal/60">— <span className="font-medium text-charcoal">{memory.author}</span></p>
                                                {memory.relationship && <span className="px-2 py-1 bg-sage/10 text-sage rounded text-xs">{memory.relationship}</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {data.step7.impactStories && data.step7.impactStories.length > 0 && (
                            <div>
                                <h3 className="font-semibold text-xl text-charcoal mb-4">Impact Stories</h3>
                                <div className="space-y-6">
                                    {data.step7.impactStories.map((story: any) => (
                                        <div key={story.id} className="bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl p-8 border border-sand/30">
                                            <h4 className="font-semibold text-xl text-charcoal mb-3">{story.title}</h4>
                                            <p className="text-charcoal/70 leading-relaxed mb-4">{story.content}</p>
                                            <p className="text-sm text-charcoal/60">— <span className="font-medium text-charcoal">{story.author}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Photo Gallery */}
                {data.step8.gallery && data.step8.gallery.length > 0 && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8">Photo Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.step8.gallery.map((photo: any, index: number) => (
                                <button
                                    key={photo.id}
                                    onClick={() => {
                                        setViewerStartIndex(index);
                                        setViewerOpen(true);
                                    }}
                                    className="group relative aspect-square rounded-xl overflow-hidden bg-sand/20 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                                >
                                    <img
                                        src={photo.preview}
                                        alt={photo.caption}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    {(photo.caption || photo.year) && (
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {photo.caption && <p className="text-ivory text-sm">{photo.caption}</p>}
                                            {photo.year && <p className="text-ivory/70 text-xs">{photo.year}</p>}
                                        </div>
                                    )}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal/20">
                                        <div className="w-12 h-12 bg-ivory/90 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-charcoal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        {viewerOpen && (
                            <ImageViewer
                                images={data.step8.gallery}
                                initialIndex={viewerStartIndex}
                                onClose={() => setViewerOpen(false)}
                            />
                        )}
                    </section>
                )}

                {/* Interactive Gallery */}
                {data.step8.interactiveGallery && data.step8.interactiveGallery.length > 0 && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-4">Interactive Photo Stories</h2>
                        <p className="text-charcoal/60 mb-8">Move your cursor over these photos to reveal the hidden stories</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {data.step8.interactiveGallery.map((item: any) => (
                                <div key={item.id}>
                                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-sand/30 shadow-lg"
                                        onMouseMove={(e) => handleInteractiveMouseMove(e, item.id)}
                                        onMouseLeave={() => setHoveredInteractive(null)}
                                        style={{ cursor: 'none' }}>
                                        <div className="absolute inset-0 flex items-center justify-center p-8">
                                            <div className="bg-gradient-to-br from-sage/20 via-ivory/90 to-terracotta/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                                                <p className="text-xl md:text-2xl font-serif text-charcoal leading-relaxed text-center font-medium drop-shadow-sm">{item.description}</p>
                                            </div>
                                        </div>
                                        <div className="absolute inset-0 transition-opacity duration-300"
                                            style={{
                                                maskImage: hoveredInteractive === item.id ? `radial-gradient(circle 110px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)` : 'none',
                                                WebkitMaskImage: hoveredInteractive === item.id ? `radial-gradient(circle 110px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)` : 'none'
                                            }}>
                                            <img src={item.preview} alt="Interactive" className="w-full h-full object-cover" draggable={false} />
                                        </div>
                                        {!hoveredInteractive && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Videos - FIXED to properly check step9 */}
                {data.step9?.videos?.length > 0 && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8">Video Memories</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {data.step9.videos.map((video: any) => (
                                <div key={video.id} className="bg-white rounded-xl p-4 border border-sand/30 shadow-sm">
                                    <div className="aspect-video bg-charcoal/10 rounded-lg overflow-hidden mb-3">
                                        <video
                                            controls
                                            preload="metadata"
                                            className="w-full h-full"
                                            poster={video.thumbnail}
                                        >
                                            <source src={video.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    </div>
                                    {video.title && (
                                        <h3 className="font-semibold text-charcoal mb-1">{video.title}</h3>
                                    )}
                                    {video.duration && (
                                        <p className="text-sm text-charcoal/60">{video.duration}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Voice Recordings */}
                {data.step8.voiceRecordings && data.step8.voiceRecordings.length > 0 && (
                    <section>
                        <h2 className="font-serif text-4xl text-charcoal mb-8">Voice Recordings</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.step8.voiceRecordings.map((recording: any) => (
                                <div key={recording.id} className="bg-white rounded-xl p-6 border border-sand/30 shadow-sm">
                                    <h3 className="font-semibold text-charcoal mb-3">{recording.title}</h3>
                                    <div className="flex items-center gap-3 text-charcoal/60 text-sm">
                                        <span>🎤 Voice Recording</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Legacy Statement */}
                {data.step8.legacyStatement && (
                    <section className="bg-gradient-to-br from-sage/20 via-ivory to-terracotta/20 rounded-2xl p-12 md:p-16 text-center border-2 border-sand/30 shadow-lg">
                        <Star size={48} className="text-terracotta mx-auto mb-6" />
                        <h2 className="font-serif text-3xl text-charcoal mb-6">Legacy</h2>
                        <p className="text-xl md:text-2xl text-charcoal/80 leading-relaxed max-w-4xl mx-auto font-serif">{data.step8.legacyStatement}</p>
                    </section>
                )}
            </div>

            {/* Footer */}
            <div className="bg-charcoal text-ivory py-12">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <p className="text-ivory/60 mb-4">Memorial created with ❤️ by Legacy Vault</p>
                    <p className="text-ivory/40 text-sm">© {new Date().getFullYear()} Legacy Vault. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}