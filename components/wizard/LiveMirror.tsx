import { useState, useEffect } from 'react';
import { MemorialData } from '@/types/memorial';
import { MapPin, Briefcase, Heart, Quote, Star, Home, GraduationCap, Award, MessageCircle, Sparkles, BookOpen, Search, Video, Calendar, MousePointer } from 'lucide-react';

export default function LiveMirror({ data }: { data: MemorialData }) {
    const [hoveredInteractive, setHoveredInteractive] = useState<string | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleInteractiveMouseMove = (e: React.MouseEvent<HTMLDivElement>, imageId: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setHoveredInteractive(imageId);
    };
    return (
        <div className="w-full h-full bg-ivory rounded-2xl shadow-inner border border-sand/30 overflow-hidden flex flex-col relative">

            {/* NEW DRAFT BANNER (Phase 2 Fix) */}
            {!data.paid && (
                <div className="flex-none bg-sand/20 border-b border-sand/30 py-2 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal/60">Draft Mode</span>
                    </div>
                    <span className="text-[9px] text-charcoal/40 italic">Preview Only</span>
                </div>
            )}



            {/* FIXED HEADER: Name & Vital Dates */}
            <div className="p-8 bg-white border-b border-sand/10 text-center relative z-10 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold block mb-4 italic">The Mirror</span>
                <h2 className="font-serif text-4xl text-charcoal mb-2">{data.step1.fullName || "Name"}</h2>

                {(data.step1.birthDate || data.step1.deathDate) && (
                    <p className="text-sm text-charcoal/50 mb-2">
                        {data.step1.birthDate || '???'} — {data.step1.isStillLiving ? 'Present' : (data.step1.deathDate || '???')}
                    </p>
                )}

                {data.step1.epitaph && (
                    <p className="text-xs text-sage font-medium italic max-w-xs mx-auto">"{data.step1.epitaph}"</p>
                )}
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-8 space-y-16 scroll-smooth relative z-10">

                {/* PROFILE PHOTO */}
                <div className="flex flex-col items-center">
                    {data.step1.profilePhotoPreview ? (
                        <img src={data.step1.profilePhotoPreview} className={`w-32 h-32 rounded-2xl object-cover shadow-md transition-all duration-1000 ${data.paid ? '' : 'grayscale'}`} />
                    ) : (
                        <div className="w-32 h-32 rounded-2xl bg-sand/20 flex items-center justify-center"><Star className="text-sand/40" /></div>
                    )}
                    {data.step1.birthPlace && (
                        <p className="mt-4 text-[10px] text-charcoal/40 uppercase tracking-tighter flex items-center gap-1">
                            <MapPin size={10} /> Born in {data.step1.birthPlace}
                        </p>
                    )}
                    {data.step1.deathPlace && !data.step1.isStillLiving && (
                        <p className="mt-1 text-[10px] text-charcoal/40 uppercase tracking-tighter flex items-center gap-1">
                            <MapPin size={10} /> Passed in {data.step1.deathPlace}
                        </p>
                    )}
                </div>

                {/* PATH 2: THE BODY - EARLY LIFE & ORIGINS */}
                {(data.step2.childhoodHome || data.step2.familyBackground || data.step2.childhoodPersonality.length > 0 || data.step2.earlyInterests.length > 0) && (
                    <div className="space-y-6 animate-fadeIn">
                        <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold border-b border-sand/20 pb-2 flex items-center gap-2">
                            <Home size={14} /> Origins & Childhood
                        </h4>

                        {data.step2.childhoodHome && <p className="text-sm text-charcoal/70"><span className="font-medium text-charcoal">Raised in:</span> {data.step2.childhoodHome}</p>}

                        {data.step2.familyBackground && (
                            <div className="pl-4 border-l border-sand/30">
                                <p className="text-xs text-charcoal/60 leading-relaxed italic">{data.step2.familyBackground}</p>
                            </div>
                        )}

                        {/* Childhood Personality Traits */}
                        {data.step2.childhoodPersonality.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-[9px] text-charcoal/30 font-bold uppercase tracking-tighter">What they were like:</p>
                                <div className="flex flex-wrap gap-2">
                                    {data.step2.childhoodPersonality.map((trait, i) => (
                                        <span key={i} className="text-[10px] bg-sage/5 text-sage px-2 py-0.5 rounded-md border border-sage/10">{trait}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Childhood Interests */}
                        {data.step2.earlyInterests.length > 0 && (
                            <p className="text-xs text-charcoal/60">
                                <span className="font-semibold text-charcoal/40 uppercase text-[9px] mr-2">Loved:</span>
                                {data.step2.earlyInterests.join(', ')}
                            </p>
                        )}

                        {/* Childhood Photos */}
                        {data.step2.childhoodPhotos.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 pt-2">
                                {data.step2.childhoodPhotos.map((p, i) => (
                                    <img key={i} src={p.preview} className="aspect-square object-cover rounded-lg grayscale opacity-40 hover:opacity-100 transition-opacity" />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* PATH 2: THE BODY - SCHOOL & CAREER */}
                <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold border-b border-sand/20 pb-2 flex items-center gap-2">
                        <Briefcase size={14} /> Path of Life
                    </h4>

                    {/* Schools */}
                    {(data.step2.schools.elementary || data.step2.schools.highSchool || data.step2.schools.college || data.step2.schools.additionalEducation) && (
                        <div className="space-y-2">
                            {data.step2.schools.college && <p className="text-xs text-charcoal/70 flex items-center gap-2"><GraduationCap size={12} /> {data.step2.schools.college}</p>}
                            {data.step2.schools.highSchool && <p className="text-xs text-charcoal/50 flex items-center gap-2"><Home size={10} /> {data.step2.schools.highSchool}</p>}
                            {data.step2.schools.elementary && <p className="text-xs text-charcoal/50 flex items-center gap-2"><BookOpen size={10} /> {data.step2.schools.elementary}</p>}
                            {data.step2.schools.additionalEducation && <p className="text-xs text-charcoal/50 flex items-center gap-2 italic">{data.step2.schools.additionalEducation}</p>}
                        </div>
                    )}

                    {/* Higher Education Details */}
                    {(data.step3.education.major || data.step3.education.graduationYear || data.step3.education.honors) && (
                        <div className="bg-sage/5 p-3 rounded-lg border border-sage/10">
                            <p className="text-[9px] text-sage font-bold uppercase mb-1">Higher Education</p>
                            {data.step3.education.major && <p className="text-xs text-charcoal/70">Major: {data.step3.education.major}</p>}
                            {data.step3.education.graduationYear && <p className="text-xs text-charcoal/60">Class of {data.step3.education.graduationYear}</p>}
                            {data.step3.education.honors && <p className="text-xs text-charcoal/60 italic">{data.step3.education.honors}</p>}
                        </div>
                    )}

                    {/* Occupations */}
                    <div className="space-y-4">
                        {data.step3.occupations.map((occ, i) => (
                            <div key={i} className="text-sm">
                                <p className="font-medium text-charcoal">{occ.title}</p>
                                <p className="text-charcoal/60 text-xs">{occ.company} • {occ.yearsFrom}-{occ.yearsTo}</p>
                            </div>
                        ))}
                    </div>

                    {/* Career Highlights & Achievements */}
                    {data.step3.careerHighlights.length > 0 && (
                        <div className="grid grid-cols-1 gap-2">
                            {data.step3.careerHighlights.map((h, i) => (
                                <div key={i} className="flex items-start gap-2 bg-white/40 p-2 rounded-lg border border-sand/10">
                                    <Award size={12} className="text-sage mt-0.5" />
                                    <span className="text-[11px] text-charcoal/70 leading-tight">{h}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PATH 2: THE BODY - FAMILY */}
                <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold border-b border-sand/20 pb-2 flex items-center gap-2">
                        <Heart size={14} /> Lineage & Love
                    </h4>

                    {/* Partners */}
                    <div className="grid grid-cols-1 gap-4">
                        {data.step4.partners.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-sand/10 flex items-center justify-center text-charcoal/20"><Heart size={16} /></div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal">{p.name}</p>
                                    <p className="text-[10px] text-charcoal/40 uppercase">{p.relationshipType} {p.yearsFrom && `(${p.yearsFrom})`}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Children */}
                    {data.step4.children.length > 0 && (
                        <div className="bg-sage/5 p-4 rounded-xl border border-sage/10">
                            <p className="text-[10px] text-sage font-bold uppercase mb-2">Children</p>
                            <p className="text-sm text-charcoal/70 leading-relaxed">
                                {data.step4.children.map(c => c.name).join(', ')}
                            </p>
                        </div>
                    )}

                    {/* Major Life Events Timeline */}
                    {data.step4.majorLifeEvents.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-sand/10">
                            <p className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1">
                                <Calendar size={10} /> Life Milestones
                            </p>
                            <div className="space-y-2">
                                {data.step4.majorLifeEvents.map((event) => (
                                    <div key={event.id} className="flex items-start gap-3 text-xs">
                                        <span className="text-charcoal/40 font-medium min-w-[40px]">{event.year}</span>
                                        <div>
                                            <p className="font-medium text-charcoal/70">{event.title}</p>
                                            {event.description && <p className="text-charcoal/50 text-[11px]">{event.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* PATH 3: THE SOUL - VALUES & PHILOSOPHY */}
                <div className="space-y-6 bg-white/60 p-6 rounded-3xl border border-sand/20 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold text-center">The Soul</h4>

                    {/* Personality Traits */}
                    <div className="flex flex-wrap justify-center gap-2">
                        {data.step5.personalityTraits.map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-ivory border border-sand/20 rounded-full text-[11px] text-charcoal/60 font-serif">{t}</span>
                        ))}
                    </div>

                    {/* Core Values */}
                    {data.step5.coreValues.length > 0 && (
                        <div className="text-center pt-2">
                            <p className="text-[11px] font-medium text-sage">{data.step5.coreValues.join(' • ')}</p>
                        </div>
                    )}

                    {data.step5.lifePhilosophy && (
                        <div className="text-center py-4 px-2 border-y border-sand/10">
                            <Quote className="mx-auto mb-3 opacity-10" size={16} />
                            <p className="text-md font-serif text-charcoal/80 italic leading-relaxed">"{data.step5.lifePhilosophy}"</p>
                        </div>
                    )}

                    {/* Passions & Loves */}
                    {data.step5.passions.length > 0 && (
                        <div className="text-center">
                            <p className="text-[9px] text-charcoal/30 uppercase tracking-[0.2em] mb-2">What they loved</p>
                            <p className="text-xs text-charcoal/70 leading-relaxed">{data.step5.passions.join(', ')}</p>
                        </div>
                    )}

                    {/* Memorable Sayings */}
                    {data.step5.memorableSayings.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-sand/10">
                            {data.step5.memorableSayings.map((s, i) => (
                                <p key={i} className="text-[11px] text-charcoal/50 text-center italic leading-relaxed">"{s}"</p>
                            ))}
                        </div>
                    )}

                    {/* Favorite Quotes */}
                    {data.step5.favoriteQuotes.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-sand/10">
                            <p className="text-[9px] font-bold text-charcoal/40 uppercase tracking-widest flex items-center gap-1 justify-center">
                                <Quote size={10} /> Favorite Quotes
                            </p>
                            {data.step5.favoriteQuotes.map((quote) => (
                                <div key={quote.id} className="pl-3 border-l-2 border-sage/20">
                                    <p className="text-[11px] text-charcoal/60 italic">"{quote.text}"</p>
                                    {quote.context && <p className="text-[10px] text-charcoal/40 mt-1">— {quote.context}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* PATH 3: THE SOUL - BIOGRAPHY & CHAPTERS */}
                <div className="space-y-8">
                    <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold border-b border-sand/20 pb-2 flex items-center gap-2"><BookOpen size={12} /> The Full Narrative</h4>

                    {data.step6.biography && (
                        <p className="font-serif text-charcoal/80 leading-relaxed whitespace-pre-wrap italic">
                            {data.step6.biography.substring(0, 500)}...
                        </p>
                    )}

                    {/* Life Chapters Details */}
                    <div className="space-y-8 pt-4">
                        {data.step6.lifeChapters.map((ch, i) => (
                            <div key={i} className="relative pl-6 border-l-2 border-sage/10">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-sage/30" />
                                <p className="text-[9px] font-bold text-sage uppercase tracking-widest mb-1">{ch.period} {ch.ageRange && `• ${ch.ageRange}`}</p>
                                <p className="text-sm font-medium text-charcoal mb-1">{ch.title}</p>
                                <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-3">{ch.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PATH 4: THE PRESENCE - THE REWARD */}
                {data.step8.gallery.length > 0 && (
                    <div className="space-y-6 pt-10">
                        <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold flex items-center gap-2"><Sparkles size={12} /> The Presence</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {data.step8.gallery.map((img, i) => (
                                <img
                                    key={i}
                                    src={img.preview}
                                    className={`aspect-square object-cover rounded-xl border border-sand/20 transition-all duration-1000 ${data.paid ? '' : (i > 0 ? 'blur-xl opacity-20 grayscale' : 'grayscale')}`}
                                    alt="Presence"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* SINGLE VIDEO DISPLAY */}
                {data.step9.videos.length > 0 && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold flex items-center gap-2">
                            <Video size={12} /> Memorial Video
                        </h4>
                        <div className="rounded-xl overflow-hidden border border-sand/20 shadow-sm">
                            <video
                                src={data.step9.videos[0].url}
                                poster={data.step9.videos[0].thumbnail || undefined}
                                controls
                                className={`w-full aspect-video object-cover ${data.paid ? '' : 'grayscale opacity-50'}`}
                            />
                            {data.step9.videos[0].title && (
                                <p className="text-center text-xs text-charcoal/50 py-2 bg-white/60">{data.step9.videos[0].title}</p>
                            )}
                        </div>
                        {!data.paid && (
                            <p className="text-[10px] text-center text-terracotta/60 italic">Video playback available after activation</p>
                        )}
                    </div>
                )}

                {/* INTERACTIVE GALLERY */}
                {data.step8.interactiveGallery && data.step8.interactiveGallery.length > 0 && (
                    <div className="space-y-6 pt-10">
                        <h4 className="text-[10px] uppercase tracking-widest text-charcoal/30 font-bold flex items-center gap-2">
                            <MousePointer size={12} /> Interactive Stories
                        </h4>
                        <div className="grid grid-cols-1 gap-6">
                            {data.step8.interactiveGallery.map((item) => (
                                <div key={item.id} className="space-y-2">
                                    <div
                                        className="relative aspect-video rounded-xl overflow-hidden border border-sand/30 shadow-sm"
                                        onMouseMove={(e) => handleInteractiveMouseMove(e, item.id)}
                                        onMouseLeave={() => setHoveredInteractive(null)}
                                        onClick={() => setHoveredInteractive(hoveredInteractive === item.id ? null : item.id)}
                                        style={{ cursor: isMobile ? 'pointer' : 'none' }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center p-4">
                                            <div className="bg-ivory/90 rounded-xl p-4 shadow-sm backdrop-blur-sm border border-sand/20">
                                                <p className="text-xs md:text-sm font-serif text-charcoal leading-relaxed text-center italic">
                                                    {item.description || 'Hover or Tap to reveal the story...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className="absolute inset-0 transition-opacity duration-300"
                                            style={{
                                                maskImage: hoveredInteractive === item.id
                                                    ? `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                                                    : 'none',
                                                WebkitMaskImage: hoveredInteractive === item.id
                                                    ? `radial-gradient(circle 80px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                                                    : 'none',
                                            }}
                                        >
                                            <img
                                                src={item.preview}
                                                alt="Interactive story"
                                                className={`w-full h-full object-cover ${data.paid ? '' : 'grayscale'}`}
                                                draggable={false}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- CONVERSION CTA (Phase 2 Fix) --- */}
                {!data.paid && (
                    <div className="mt-12 p-8 bg-charcoal text-ivory rounded-3xl text-center shadow-2xl border border-white/10 animate-fadeIn">
                        <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="text-sage" size={24} />
                        </div>

                        <h3 className="font-serif text-2xl mb-4">
                            You have reconstructed their story.
                        </h3>

                        <p className="text-ivory/60 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                            The foundation is ready. To unlock the full <strong>Presence</strong>—including the complete gallery, high-definition videos, and permanent archival—complete the final step of the ritual.
                        </p>

                        <button
                            onClick={() => window.location.href = '/personal-confirmation'}
                            className="w-full py-4 bg-terracotta text-ivory rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-sm"
                        >
                            Become a Permanent Guardian ($1,500)
                        </button>

                        <p className="mt-4 text-[10px] text-ivory/40 uppercase tracking-widest">
                            Secure Lifetime Archival
                        </p>
                    </div>
                )}
            </div>{/* end of scrollable body */}
        </div>
    );
}
