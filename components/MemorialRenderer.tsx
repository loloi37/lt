// components/MemorialRenderer.tsx
// UNIFIED renderer used by BOTH:
//   - LiveMirror (isPreview=true, compact=true)
//   - /person/[id] published page (isPreview=false)
//   - PreviewModal (isPreview=true, compact=false)
//
// Step 1.2.1: One source of truth for how a memorial looks.

'use client';

import { useState } from 'react';
import {
    Calendar, MapPin, Heart, Briefcase, GraduationCap, Quote, Star, Home,
    Sparkles, MessageCircle, Share2, Mail, Users, BookOpen, Lightbulb, Award,
    MousePointer, Play, Mic
} from 'lucide-react';
import ImageViewer from '@/components/ImageViewer';
import IntegrityBadge from '@/components/IntegrityBadge';
import BioWithLinks from '@/components/BioWithLinks';


interface MemorialRendererProps {
    data: any;               // Memorial data (step1-step9)
    relations?: any[];       // Related individuals
    isPreview?: boolean;     // true = show watermark + badge
    compact?: boolean;       // true = LiveMirror sidebar mode (scrollable, smaller)
    className?: string;
}

export default function MemorialRenderer({
    data,
    relations = [],
    isPreview = false,
    compact = false,
    className = '',
}: MemorialRendererProps) {
    const [hoveredInteractive, setHoveredInteractive] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [viewerOpen, setViewerOpen] = useState(false);
    const [viewerStartIndex, setViewerStartIndex] = useState(0);

    const calculateAge = () => {
        if (!data.step1?.birthDate) return null;
        const birth = new Date(data.step1.birthDate);
        const end = data.step1.isStillLiving ? new Date() :
            data.step1.deathDate ? new Date(data.step1.deathDate) : new Date();
        return end.getFullYear() - birth.getFullYear();
    };

    const handleInteractiveMouseMove = (e: React.MouseEvent<HTMLDivElement>, imageId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHoveredInteractive(imageId);
    };

    // Scale classes for compact (mirror) vs full mode
    const s = {
        heroH: compact ? 'h-48' : 'h-96 md:h-[500px]',
        profileSize: compact ? 'w-24 h-24' : 'w-40 h-40 md:w-48 md:h-48',
        nameSize: compact ? 'text-2xl' : 'text-5xl md:text-6xl',
        sectionTitle: compact ? 'text-xl' : 'text-4xl',
        sectionPadding: compact ? 'p-4' : 'p-8 md:p-12',
        bodyText: compact ? 'text-sm' : 'text-base md:text-lg',
        gap: compact ? 'space-y-8' : 'space-y-16',
        maxW: compact ? 'max-w-full' : 'max-w-7xl mx-auto px-6 md:px-12',
        gridCols: compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        galleryGrid: compact ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        quoteSize: compact ? 'text-lg' : 'text-3xl md:text-4xl',
    };

    return (
        <div className={`relative bg-ivory ${compact ? 'rounded-2xl shadow-inner border border-sand/30 overflow-hidden' : 'min-h-screen'} ${className}`}>

            {/* ========================================= */}
            {/* WATERMARK — Step 1.2.2: Elegant badge     */}
            {/* No large diagonal text. Subtle corner     */}
            {/* badge that doesn't ruin the preview.      */}
            {/* ========================================= */}
            {isPreview && (
                <>
                    {/* Step 1.2.2: Small fixed badge, bottom-right, semi-transparent */}
                    <div className="fixed bottom-4 right-4 z-30 px-3 py-1.5 bg-charcoal/40 backdrop-blur-sm rounded-lg pointer-events-none">
                        <p className="text-ivory/70 text-[10px] tracking-wide">
                            Preview — Draft
                        </p>
                    </div>

                    {/* Step 1.2.2 alternative: Thin top banner (30px) */}
                    {!compact && (
                        <div className="absolute top-0 left-0 right-0 z-30 bg-charcoal/30 backdrop-blur-sm py-1.5 text-center pointer-events-none">
                            <p className="text-ivory/60 text-[10px] tracking-wide">
                                This is a preview. The final archive will be identical, without this notice.
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* ========================================= */}
            {/* SCROLLABLE CONTENT                        */}
            {/* ========================================= */}
            <div className={compact ? 'h-full overflow-y-auto' : ''}>

                {/* HERO SECTION */}
                <div className={`relative ${s.heroH} bg-gradient-to-br from-mist/30 to-stone/30`}>
                    {data.step8?.coverPhotoPreview ? (
                        <>
                            <img src={data.step8.coverPhotoPreview} alt="Cover" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#6b7f8e] via-[#6b7f8e]/20 to-[#6b7f8e]/10" />
                            <IntegrityBadge hash={data.step8.coverPhotoHash} className="top-4 left-4" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8a9ba8] via-[#7d8e9b] to-[#6b7f8e]" />
                    )}

                    <div className="absolute bottom-0 left-0 right-0">
                        <div className={`${s.maxW} pb-${compact ? '4' : '8'}`}>
                            <div className={`flex ${compact ? 'flex-col items-center text-center gap-3' : 'flex-col md:flex-row items-center md:items-end gap-6'}`}>
                                {data.step1?.profilePhotoPreview && (
                                    <div className={`${s.profileSize} rounded-2xl border-4 border-ivory shadow-2xl overflow-hidden flex-shrink-0 bg-white`}>
                                        <img src={data.step1.profilePhotoPreview} alt={data.step1.fullName} className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className={compact ? '' : 'text-center md:text-left pb-4'}>
                                    <h1 className={`font-serif ${s.nameSize} text-ivory mb-2 drop-shadow-2xl`}>
                                        {data.step1?.fullName || 'Name'}
                                    </h1>
                                    <div className={`flex ${compact ? 'justify-center' : 'flex-col md:flex-row items-center'} gap-2 text-ivory/90 ${compact ? 'text-xs' : 'text-lg'} drop-shadow-lg`}>
                                        {data.step1?.birthDate && (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={compact ? 12 : 20} />
                                                <span>{new Date(data.step1.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        )}
                                        {!data.step1?.isStillLiving && data.step1?.deathDate && (
                                            <>
                                                <span className="hidden md:inline">—</span>
                                                <span>{new Date(data.step1.deathDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
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

                    {/* Share buttons — only on full view */}
                    {!compact && (
                        <div className="absolute top-6 right-6 flex gap-3">
                            <button className="p-3 bg-ivory/90 hover:bg-ivory rounded-full shadow-lg transition-all">
                                <Share2 size={20} className="text-charcoal" />
                            </button>
                            <button className="p-3 bg-ivory/90 hover:bg-ivory rounded-full shadow-lg transition-all">
                                <Mail size={20} className="text-charcoal" />
                            </button>
                        </div>
                    )}
                </div>

                {/* MAIN CONTENT */}
                <div className={`${s.maxW} py-${compact ? '6' : '12'} ${s.gap}`}>

                    {/* Epitaph */}
                    {data.step1?.epitaph && (
                        <div className={`text-center py-${compact ? '6' : '12'} border-y border-sand/30`}>
                            <Quote size={compact ? 24 : 40} className="text-stone mx-auto mb-4 opacity-50" />
                            <p className={`font-serif ${s.quoteSize} text-charcoal/80 italic leading-relaxed max-w-4xl mx-auto`}>
                                "{data.step1.epitaph}"
                            </p>
                        </div>
                    )}

                    {/* Quick Facts Grid */}
                    <div className={`grid ${s.gridCols} gap-${compact ? '3' : '6'}`}>
                        {data.step1?.birthPlace && (
                            <div className={`${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-sand/30 shadow-sm`}>
                                <div className="flex items-start gap-3">
                                    <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <MapPin size={compact ? 16 : 24} className="text-mist" />
                                    </div>
                                    <div>
                                        <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium text-charcoal/60 mb-0.5`}>Born in</p>
                                        <p className={`text-charcoal font-semibold ${compact ? 'text-xs' : ''}`}>{data.step1.birthPlace}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {data.step1?.deathPlace && !data.step1?.isStillLiving && (
                            <div className={`${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-sand/30 shadow-sm`}>
                                <div className="flex items-start gap-3">
                                    <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <MapPin size={compact ? 16 : 24} className="text-mist" />
                                    </div>
                                    <div>
                                        <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium text-charcoal/60 mb-0.5`}>Passed in</p>
                                        <p className={`text-charcoal font-semibold ${compact ? 'text-xs' : ''}`}>{data.step1.deathPlace}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {data.step3?.occupations?.length > 0 && (
                            <div className={`${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-sand/30 shadow-sm`}>
                                <div className="flex items-start gap-3">
                                    <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-stone/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Briefcase size={compact ? 16 : 24} className="text-stone" />
                                    </div>
                                    <div>
                                        <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium text-charcoal/60 mb-0.5`}>Career</p>
                                        <p className={`text-charcoal font-semibold ${compact ? 'text-xs' : ''}`}>{data.step3.occupations[0].title}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {data.step4?.children?.length > 0 && (
                            <div className={`${compact ? 'p-3' : 'p-6'} bg-white rounded-xl border border-sand/30 shadow-sm`}>
                                <div className="flex items-start gap-3">
                                    <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <Heart size={compact ? 16 : 24} className="text-mist" />
                                    </div>
                                    <div>
                                        <p className={`${compact ? 'text-[10px]' : 'text-sm'} font-medium text-charcoal/60 mb-0.5`}>Family</p>
                                        <p className={`text-charcoal font-semibold ${compact ? 'text-xs' : ''}`}>
                                            {data.step4.children.length} child{data.step4.children.length !== 1 ? 'ren' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Life Story */}
                    {data.step6?.biography && (
                        <section className={`bg-white rounded-2xl ${s.sectionPadding} shadow-sm border border-sand/30`}>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center`}>
                                    <Quote size={compact ? 16 : 24} className="text-mist" />
                                </div>
                                Life Story
                            </h2>
                            <div className="prose prose-lg max-w-none">
                                <div className={`text-charcoal/80 leading-relaxed font-serif ${s.bodyText}`}>
                                    <BioWithLinks
                                        text={compact
                                            ? data.step6.biography.substring(0, 500) + (data.step6.biography.length > 500 ? '...' : '')
                                            : data.step6.biography
                                        }
                                        relations={relations}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Life Chapters */}
                    {data.step6?.lifeChapters?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'}`}>Life Chapters</h2>
                            <div className={`space-y-${compact ? '3' : '6'}`}>
                                {data.step6.lifeChapters.map((chapter: any, index: number) => (
                                    <div key={chapter.id} className={`bg-white rounded-xl ${compact ? 'p-4' : 'p-6 md:p-8'} shadow-sm border-l-4 border-mist`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`${compact ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'} bg-mist text-ivory rounded-full flex items-center justify-center font-serif font-bold flex-shrink-0`}>
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`font-serif ${compact ? 'text-base' : 'text-2xl'} text-charcoal mb-2`}>{chapter.title}</h3>
                                                {chapter.period && <span className={`px-3 py-1 bg-mist/10 text-mist rounded-full ${compact ? 'text-[10px]' : 'text-sm'} font-medium mr-2`}>{chapter.period}</span>}
                                                {chapter.ageRange && <span className={`px-3 py-1 bg-stone/10 text-stone rounded-full ${compact ? 'text-[10px]' : 'text-sm'} font-medium`}>{chapter.ageRange}</span>}
                                                <p className={`text-charcoal/70 leading-relaxed mt-3 ${compact ? 'text-xs' : ''}`}>{chapter.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Early Life */}
                    {(data.step2?.childhoodHome || data.step2?.familyBackground) && (
                        <section className={`bg-gradient-to-br from-mist/5 to-stone/5 rounded-2xl ${s.sectionPadding} border border-sand/30`}>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-stone/10 rounded-xl flex items-center justify-center`}>
                                    <Home size={compact ? 16 : 24} className="text-stone" />
                                </div>
                                Early Life & Childhood
                            </h2>
                            <div className={`space-y-${compact ? '3' : '6'}`}>
                                {data.step2.childhoodHome && (
                                    <div>
                                        <h3 className={`font-semibold text-charcoal mb-2 ${compact ? 'text-sm' : ''}`}>Childhood Home</h3>
                                        <p className={`text-charcoal/70 leading-relaxed ${compact ? 'text-xs' : ''}`}>{data.step2.childhoodHome}</p>
                                    </div>
                                )}
                                {data.step2.familyBackground && (
                                    <div>
                                        <h3 className={`font-semibold text-charcoal mb-2 ${compact ? 'text-sm' : ''}`}>Family Background</h3>
                                        <p className={`text-charcoal/70 leading-relaxed ${compact ? 'text-xs' : ''}`}>{data.step2.familyBackground}</p>
                                    </div>
                                )}
                                {data.step2?.childhoodPersonality?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.step2.childhoodPersonality.map((trait: string) => (
                                            <span key={trait} className={`px-3 py-1.5 bg-mist/10 text-mist rounded-full ${compact ? 'text-[10px]' : 'text-sm'} font-medium`}>{trait}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Career & Education */}
                    {data.step3?.occupations?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-stone/10 rounded-xl flex items-center justify-center`}>
                                    <Briefcase size={compact ? 16 : 24} className="text-stone" />
                                </div>
                                Career & Achievements
                            </h2>
                            <div className={`space-y-${compact ? '3' : '6'}`}>
                                {data.step3.occupations.map((job: any) => (
                                    <div key={job.id} className={`bg-white rounded-xl ${compact ? 'p-4' : 'p-6'} shadow-sm border border-sand/30`}>
                                        <h4 className={`font-semibold ${compact ? 'text-sm' : 'text-xl'} text-charcoal`}>{job.title}</h4>
                                        <p className={`text-charcoal/60 ${compact ? 'text-xs' : ''} mb-2`}>{job.company}</p>
                                        <span className={`px-3 py-1 bg-stone/10 text-stone rounded-full ${compact ? 'text-[10px]' : 'text-sm'}`}>
                                            {job.yearsFrom} - {job.yearsTo}
                                        </span>
                                        {job.description && <p className={`text-charcoal/70 leading-relaxed mt-3 ${compact ? 'text-xs' : ''}`}>{job.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Family & Relationships */}
                    {((data.step4?.partners?.length > 0) || (data.step4?.children?.length > 0)) && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center`}>
                                    <Heart size={compact ? 16 : 24} className="text-mist" />
                                </div>
                                Family & Relationships
                            </h2>
                            {data.step4?.partners?.length > 0 && (
                                <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-${compact ? '3' : '6'} mb-6`}>
                                    {data.step4.partners.map((partner: any) => (
                                        <div key={partner.id} className={`bg-white rounded-xl ${compact ? 'p-4' : 'p-6'} shadow-sm border border-sand/30`}>
                                            <h4 className={`font-semibold text-charcoal mb-1 ${compact ? 'text-sm' : ''}`}>{partner.name}</h4>
                                            <p className={`text-charcoal/60 mb-2 ${compact ? 'text-[10px]' : 'text-sm'}`}>{partner.relationshipType}</p>
                                            <p className={`text-charcoal/60 ${compact ? 'text-[10px]' : 'text-sm'}`}>{partner.yearsFrom} - {partner.yearsTo}</p>
                                            {partner.description && <p className={`text-charcoal/70 mt-2 ${compact ? 'text-xs' : 'text-sm'}`}>{partner.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {data.step4?.children?.length > 0 && (
                                <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-${compact ? '2' : '4'}`}>
                                    {data.step4.children.map((child: any) => (
                                        <div key={child.id} className={`bg-white rounded-xl ${compact ? 'p-3' : 'p-6'} shadow-sm border border-sand/30`}>
                                            <h4 className={`font-semibold text-charcoal mb-1 ${compact ? 'text-sm' : ''}`}>{child.name}</h4>
                                            <p className={`text-charcoal/60 ${compact ? 'text-[10px]' : 'text-sm'}`}>Born {child.birthYear}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Personality & Values */}
                    {(data.step5?.personalityTraits?.length > 0 || data.step5?.lifePhilosophy) && (
                        <section className={`bg-white rounded-2xl ${s.sectionPadding} shadow-sm border border-sand/30`}>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-stone/10 rounded-xl flex items-center justify-center`}>
                                    <Sparkles size={compact ? 16 : 24} className="text-stone" />
                                </div>
                                Personality, Values & Passions
                            </h2>
                            <div className={`space-y-${compact ? '4' : '8'}`}>
                                {data.step5?.personalityTraits?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.step5.personalityTraits.map((trait: string) => (
                                            <span key={trait} className={`px-3 py-1.5 bg-mist/10 text-mist rounded-full ${compact ? 'text-[10px]' : 'text-sm'}`}>{trait}</span>
                                        ))}
                                    </div>
                                )}
                                {data.step5?.coreValues?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {data.step5.coreValues.map((value: string) => (
                                            <span key={value} className={`px-3 py-1.5 bg-stone/10 text-stone rounded-full ${compact ? 'text-[10px]' : 'text-sm'}`}>{value}</span>
                                        ))}
                                    </div>
                                )}
                                {data.step5?.lifePhilosophy && (
                                    <div className="bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl p-6 border border-sand/20">
                                        <p className={`text-charcoal/80 leading-relaxed italic ${compact ? 'text-xs' : ''}`}>{data.step5.lifePhilosophy}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Memories & Stories */}
                    {(data.step7?.sharedMemories?.length > 0 || data.step7?.impactStories?.length > 0) && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center`}>
                                    <MessageCircle size={compact ? 16 : 24} className="text-mist" />
                                </div>
                                Memories & Stories
                            </h2>
                            <div className={`space-y-${compact ? '3' : '6'}`}>
                                {data.step7.sharedMemories?.map((memory: any) => (
                                    <div key={memory.id} className={`bg-white rounded-xl ${compact ? 'p-4' : 'p-8'} shadow-sm border border-sand/30`}>
                                        <h4 className={`font-semibold ${compact ? 'text-sm' : 'text-xl'} text-charcoal mb-2`}>{memory.title}</h4>
                                        <p className={`text-charcoal/70 leading-relaxed mb-3 ${compact ? 'text-xs' : ''}`}>{memory.content}</p>
                                        <p className={`text-charcoal/60 ${compact ? 'text-[10px]' : 'text-sm'}`}>— <span className="font-medium text-charcoal">{memory.author}</span></p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Interactive Photo Stories */}
                    {data.step8?.interactiveGallery?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-mist/10 rounded-xl flex items-center justify-center`}>
                                    <MousePointer size={compact ? 16 : 24} className="text-mist" />
                                </div>
                                Interactive Photo Stories
                            </h2>
                            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-${compact ? '3' : '6'}`}>
                                {data.step8.interactiveGallery.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className={`relative ${compact ? 'aspect-video' : 'aspect-video'} rounded-xl overflow-hidden border-2 border-sand/30 group`}
                                        onMouseMove={(e) => handleInteractiveMouseMove(e, item.id)}
                                        onMouseLeave={() => setHoveredInteractive(null)}
                                        style={{ cursor: 'none' }}
                                    >
                                        {/* Hidden text layer (visible by default) */}
                                        <div className="absolute inset-0 flex items-center justify-center p-8 z-10">
                                            <div className="bg-gradient-to-br from-mist/20 via-ivory/90 to-stone/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                                                <p className={`font-serif text-charcoal leading-relaxed text-center font-medium drop-shadow-sm ${compact ? 'text-sm' : 'text-xl md:text-2xl'}`}>
                                                    {item.description || 'Move your cursor to reveal the photo'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Photo layer with spotlight mask */}
                                        <div
                                            className="absolute inset-0 z-20 transition-opacity duration-300"
                                            style={{
                                                maskImage: hoveredInteractive === item.id
                                                    ? `radial-gradient(circle 110px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                                                    : 'none',
                                                WebkitMaskImage: hoveredInteractive === item.id
                                                    ? `radial-gradient(circle 110px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                                                    : 'none',
                                            }}
                                        >
                                            <img
                                                src={item.preview}
                                                alt="Interactive photo"
                                                className="w-full h-full object-cover"
                                                draggable={false}
                                            />
                                        </div>

                                        <IntegrityBadge hash={item.sha256_hash} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Photo Gallery */}
                    {data.step8?.gallery?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'}`}>Photo Gallery</h2>
                            <div className={`grid ${s.galleryGrid} gap-${compact ? '2' : '4'}`}>
                                {data.step8.gallery.map((photo: any, index: number) => (
                                    <button
                                        key={photo.id}
                                        onClick={() => { setViewerStartIndex(index); setViewerOpen(true); }}
                                        className="group relative aspect-square rounded-xl overflow-hidden bg-sand/20 shadow-sm cursor-pointer hover:shadow-lg transition-all"
                                    >
                                        <img src={photo.preview} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                                        <IntegrityBadge hash={photo.sha256_hash} />

                                        {(photo.caption || photo.year) && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {photo.caption && <p className="text-ivory text-xs">{photo.caption}</p>}
                                                {photo.year && <p className="text-ivory/70 text-[10px]">{photo.year}</p>}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                            {viewerOpen && !compact && (
                                <ImageViewer images={data.step8.gallery} initialIndex={viewerStartIndex} onClose={() => setViewerOpen(false)} />
                            )}
                        </section>
                    )}

                    {/* Videos */}
                    {data.step9?.videos?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'}`}>Video Memories</h2>
                            <div className={`grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-${compact ? '3' : '6'}`}>
                                {data.step9.videos.map((video: any) => (
                                    <div key={video.id} className={`bg-white rounded-xl ${compact ? 'p-3' : 'p-4'} border border-sand/30 shadow-sm relative`}>

                                        <IntegrityBadge hash={video.sha256_hash} className="top-2 left-2" />

                                        <div className="aspect-video bg-charcoal/10 rounded-lg overflow-hidden mb-2">
                                            <video controls preload="metadata" className="w-full h-full" poster={video.thumbnail}>
                                                <source src={video.url} type="video/mp4" />
                                            </video>
                                        </div>
                                        {video.title && <h3 className={`font-semibold text-charcoal ${compact ? 'text-xs' : ''}`}>{video.title}</h3>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Voice Recordings */}
                    {data.step8?.voiceRecordings?.length > 0 && (
                        <section>
                            <h2 className={`font-serif ${s.sectionTitle} text-charcoal mb-${compact ? '4' : '8'} flex items-center gap-3`}>
                                <div className={`${compact ? 'w-8 h-8' : 'w-12 h-12'} bg-stone/10 rounded-xl flex items-center justify-center`}>
                                    <Mic size={compact ? 16 : 24} className="text-stone" />
                                </div>
                                Voice Recordings
                            </h2>
                            <div className={`space-y-${compact ? '2' : '4'}`}>
                                {data.step8.voiceRecordings.map((recording: any) => (
                                    <div key={recording.id} className={`bg-white rounded-xl ${compact ? 'p-3' : 'p-4 md:p-6'} shadow-sm border border-sand/30 flex items-center gap-4`}>
                                        <div className={`${compact ? 'w-10 h-10' : 'w-14 h-14'} bg-stone/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                                            <Mic size={compact ? 16 : 24} className="text-stone" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-semibold text-charcoal ${compact ? 'text-xs' : 'text-base'}`}>{recording.title || 'Untitled Recording'}</h4>
                                        </div>
                                        <IntegrityBadge hash={recording.sha256_hash} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Legacy Statement */}
                    {data.step8?.legacyStatement && (
                        <section className={`bg-gradient-to-br from-mist/20 via-ivory to-stone/20 rounded-2xl ${compact ? 'p-6' : 'p-12 md:p-16'} text-center border-2 border-sand/30 shadow-lg`}>
                            <Star size={compact ? 24 : 48} className="text-stone mx-auto mb-4" />
                            <h2 className={`font-serif ${compact ? 'text-lg' : 'text-3xl'} text-charcoal mb-4`}>Legacy</h2>
                            <p className={`${compact ? 'text-sm' : 'text-xl md:text-2xl'} text-charcoal/80 leading-relaxed max-w-4xl mx-auto font-serif`}>
                                {data.step8.legacyStatement}
                            </p>
                        </section>
                    )}
                </div>

                {/* Footer — only on full view */}
                {!compact && (
                    <div className="bg-charcoal text-ivory py-12">
                        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                            <p className="text-ivory/60 mb-4">Memorial created with ❤️ by Legacy Vault</p>
                            <p className="text-ivory/40 text-sm">© {new Date().getFullYear()} Legacy Vault. All rights reserved.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}