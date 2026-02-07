// components/wizard/PreviewModal.tsx
'use client';

import { X, User, Calendar, MapPin, Heart, Briefcase, Quote, Image as ImageIcon, Home, GraduationCap, Users, Star, MessageCircle, Play, Film, Mic, Sparkles } from 'lucide-react';
import { MemorialData } from '@/types/memorial';

interface PreviewModalProps {
    data: MemorialData;
    onClose: () => void;
}

export default function PreviewModal({ data, onClose }: PreviewModalProps) {
    const calculateAge = () => {
        if (!data.step1.birthDate) return null;
        const birth = new Date(data.step1.birthDate);
        const end = data.step1.isStillLiving ? new Date() : data.step1.deathDate ? new Date(data.step1.deathDate) : new Date();
        const years = end.getFullYear() - birth.getFullYear();
        return years;
    };

    return (
        <div className="fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-50 overflow-y-auto">
            <div className="min-h-screen py-12 px-4">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-4">
                        <div>
                            <h2 className="text-2xl font-semibold text-ivory mb-1">Memorial Preview</h2>
                            <p className="text-ivory/60 text-sm">This is how your memorial will look to visitors</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-ivory/10 hover:bg-ivory/20 rounded-full transition-all"
                        >
                            <X size={24} className="text-ivory" />
                        </button>
                    </div>

                    {/* Preview Container */}
                    <div className="bg-ivory rounded-2xl shadow-2xl overflow-hidden">
                        {/* Hero Section with Cover Photo */}
                        <div className="relative h-80 bg-gradient-to-br from-sage/20 to-terracotta/20">
                            {data.step8.coverPhotoPreview ? (
                                <img
                                    src={data.step8.coverPhotoPreview}
                                    alt="Cover"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={64} className="text-charcoal/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />

                            {/* Profile Photo & Name Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8">
                                <div className="flex items-end gap-6">
                                    {data.step1.profilePhotoPreview && (
                                        <div className="w-32 h-32 rounded-2xl border-4 border-ivory shadow-2xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={data.step1.profilePhotoPreview}
                                                alt={data.step1.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 pb-2">
                                        <h1 className="font-serif text-4xl md:text-5xl text-ivory mb-2 drop-shadow-lg">
                                            {data.step1.fullName || 'Name'}
                                        </h1>
                                        {data.step1.birthDate && (
                                            <p className="text-ivory/90 text-lg flex items-center gap-2 drop-shadow">
                                                <Calendar size={18} />
                                                {new Date(data.step1.birthDate).getFullYear()} - {data.step1.isStillLiving ? 'Present' : data.step1.deathDate ? new Date(data.step1.deathDate).getFullYear() : 'Present'}
                                                {calculateAge() && ` • ${calculateAge()} years`}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-12 space-y-12">
                            {/* Epitaph */}
                            {data.step1.epitaph && (
                                <div className="text-center py-6 border-y border-sand/30">
                                    <Quote size={32} className="text-terracotta mx-auto mb-4" />
                                    <p className="font-serif text-2xl text-charcoal/80 italic leading-relaxed max-w-3xl mx-auto">
                                        "{data.step1.epitaph}"
                                    </p>
                                </div>
                            )}

                            {/* Quick Facts */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {data.step1.birthPlace && (
                                    <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-xl">
                                        <MapPin size={20} className="text-sage mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-charcoal/60 mb-1">Born in</p>
                                            <p className="text-charcoal font-medium">{data.step1.birthPlace}</p>
                                        </div>
                                    </div>
                                )}

                                {data.step3.occupations.length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-terracotta/5 rounded-xl">
                                        <Briefcase size={20} className="text-terracotta mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-charcoal/60 mb-1">Career</p>
                                            <p className="text-charcoal font-medium">{data.step3.occupations[0].title}</p>
                                        </div>
                                    </div>
                                )}

                                {data.step4.children.length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-sage/5 rounded-xl">
                                        <Heart size={20} className="text-sage mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-charcoal/60 mb-1">Family</p>
                                            <p className="text-charcoal font-medium">
                                                {data.step4.children.length} child{data.step4.children.length !== 1 ? 'ren' : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {data.step5.personalityTraits.length > 0 && (
                                    <div className="flex items-start gap-3 p-4 bg-terracotta/5 rounded-xl">
                                        <User size={20} className="text-terracotta mt-1 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-charcoal/60 mb-1">Personality</p>
                                            <p className="text-charcoal font-medium">
                                                {data.step5.personalityTraits.slice(0, 3).join(', ')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PATH 1: THE FACT - Already largely in Hero and Quick Facts above */}

                            {/* PATH 2: THE BODY (Childhood, Career, Relationships) */}
                            <div className="space-y-8">
                                <h3 className="flex items-center gap-2 text-xl font-serif text-charcoal border-b border-sand/30 pb-2">
                                    <Home className="text-sage" size={20} />
                                    The Body: Early Life & Legacy
                                </h3>

                                {/* Childhood */}
                                {(data.step2.childhoodHome || data.step2.earlyInterests.length > 0) && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Early Years</h4>
                                        {data.step2.childhoodHome && (
                                            <p className="text-charcoal/80 leading-relaxed italic border-l-2 border-sage/20 pl-4">
                                                {data.step2.childhoodHome}
                                            </p>
                                        )}
                                        {data.step2.earlyInterests.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {data.step2.earlyInterests.map((interest, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-sage/10 text-sage text-xs rounded-full border border-sage/20">
                                                        {interest}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Career & Education Highlights */}
                                {data.step3.occupations.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-sans">Career Journey</h4>
                                        <div className="space-y-3">
                                            {data.step3.occupations.map((job) => (
                                                <div key={job.id} className="flex gap-3">
                                                    <div className="mt-1"><GraduationCap size={16} className="text-terracotta" /></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-charcoal">{job.title}</p>
                                                        <p className="text-xs text-charcoal/60">{job.company} {job.yearsFrom && `• ${job.yearsFrom}`} {job.yearsTo && `- ${job.yearsTo}`}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Family & Relationships */}
                                {(data.step4.partners.length > 0 || data.step4.children.length > 0) && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Family Circle</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {data.step4.partners.map((partner) => (
                                                <div key={partner.id} className="flex items-center gap-2 bg-white p-2 px-3 rounded-lg border border-sand/30 shadow-sm">
                                                    <Heart size={14} className="text-terracotta" />
                                                    <span className="text-xs font-medium text-charcoal">{partner.name} <span className="text-charcoal/40">({partner.relationshipType})</span></span>
                                                </div>
                                            ))}
                                            {data.step4.children.map((child) => (
                                                <div key={child.id} className="flex items-center gap-2 bg-white p-2 px-3 rounded-lg border border-sand/30 shadow-sm">
                                                    <Users size={14} className="text-sage" />
                                                    <span className="text-xs font-medium text-charcoal">{child.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PATH 3: THE SOUL (Personality, Life Story) */}
                            <div className="space-y-8">
                                <h3 className="flex items-center gap-2 text-xl font-serif text-charcoal border-b border-sand/30 pb-2">
                                    <Star className="text-terracotta" size={20} />
                                    The Soul: Essence & Story
                                </h3>

                                {/* Personality traits (already partial in grid, but can show all here) */}
                                {data.step5.personalityTraits.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Core Essence</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {data.step5.personalityTraits.map((trait, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-terracotta/5 text-terracotta text-xs font-medium rounded-lg border border-terracotta/10">
                                                    {trait}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Life Story Preview */}
                                {data.step6.biography && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Their Journey</h4>
                                        <div className="prose prose-sand max-w-none">
                                            <p className="text-charcoal/80 leading-relaxed whitespace-pre-wrap font-serif">
                                                {data.step6.biography.slice(0, 400)}
                                                {data.step6.biography.length > 400 && '...'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* PATH 4: THE WITNESSES (Memories & Impact) */}
                            {data.step7.sharedMemories.length > 0 && (
                                <div className="space-y-8">
                                    <h3 className="flex items-center gap-2 text-xl font-serif text-charcoal border-b border-sand/30 pb-2">
                                        <MessageCircle className="text-sage" size={20} />
                                        The Witnesses: Shared Echoes
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {data.step7.sharedMemories.slice(0, 4).map((memory) => (
                                            <div key={memory.id} className="bg-white p-5 rounded-xl border border-sand/30 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 bg-sage/10 rounded-bl-xl">
                                                    <Quote size={12} className="text-sage" />
                                                </div>
                                                <h5 className="text-sm font-bold text-charcoal mb-2">{memory.title}</h5>
                                                <p className="text-xs text-charcoal/70 italic mb-3 line-clamp-3 leading-relaxed">"{memory.content}"</p>
                                                <div className="flex justify-between items-center pt-2 border-t border-sand/10">
                                                    <span className="text-[10px] font-medium text-charcoal/60">— {memory.author}</span>
                                                    {memory.date && <span className="text-[10px] text-charcoal/40">{new Date(memory.date).toLocaleDateString()}</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PATH 5: THE PRESENCE (Photos, Videos, Legacy) */}
                            <div className="space-y-8">
                                <h3 className="flex items-center gap-2 text-xl font-serif text-charcoal border-b border-sand/30 pb-2">
                                    <Sparkles className="text-terracotta" size={20} />
                                    The Presence: A Living Legacy
                                </h3>

                                {/* Photo Gallery */}
                                {data.step8.gallery.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider">Visual Memories</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {data.step8.gallery.slice(0, 8).map((photo) => (
                                                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-sand/20 border border-sand/10">
                                                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Video Preview Section */}
                                {data.step9.videos.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wider font-sans">Eternal Moments</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data.step9.videos.map((v) => (
                                                <div key={v.id} className="relative aspect-video rounded-xl overflow-hidden group border border-sand/20 shadow-md">
                                                    <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                                            <Play size={20} className="text-white fill-white ml-1" />
                                                        </div>
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                                        <span className="text-[10px] text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm truncate max-w-[70%]">{v.title}</span>
                                                        <span className="text-[10px] text-white bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                                                            <Film size={8} /> {v.duration}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Interactive Sample */}
                                {data.step8.interactiveGallery && data.step8.interactiveGallery.length > 0 && (
                                    <div className="p-4 bg-terracotta/5 border border-terracotta/10 rounded-xl flex items-center gap-4">
                                        <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center shrink-0">
                                            <Sparkles size={24} className="text-terracotta" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-charcoal">Interactive Stories Included ✨</p>
                                            <p className="text-xs text-charcoal/60">Hover experiences will be available on the published memorial.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Legacy Statement */}
                                {data.step8.legacyStatement && (
                                    <div className="bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 rounded-2xl p-8 border-2 border-sand/30 shadow-inner">
                                        <h4 className="font-serif text-2xl text-charcoal mb-4 text-center">Legacy Statement</h4>
                                        <p className="text-lg text-charcoal/80 leading-relaxed text-center max-w-3xl mx-auto italic font-serif">
                                            "{data.step8.legacyStatement}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-ivory hover:bg-ivory/90 text-charcoal rounded-xl font-medium transition-all shadow-lg"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}