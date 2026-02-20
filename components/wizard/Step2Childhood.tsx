// components/wizard/Step2Childhood.tsx
'use client';

import { useState, useRef } from 'react';
import { Home, Users, GraduationCap, Heart, Sparkles, Upload, X, Plus } from 'lucide-react';
import { ChildhoodInfo } from '@/types/memorial';

interface Step2Props {
    data: ChildhoodInfo;
    onUpdate: (data: ChildhoodInfo) => void;
    onNext: () => void;
    onBack: () => void;
    readOnly?: boolean;
    isSelfArchive?: boolean; // NEW PROP
}

const PERSONALITY_OPTIONS = [
    'Curious', 'Shy', 'Adventurous', 'Studious', 'Athletic',
    'Creative', 'Rebellious', 'Compassionate', 'Playful', 'Thoughtful',
    'Bold', 'Gentle', 'Energetic', 'Calm', 'Funny',
    'Serious', 'Social', 'Independent', 'Helpful', 'Imaginative'
];

export default function Step2Childhood({ data, onUpdate, onNext, onBack, readOnly, isSelfArchive = false }: Step2Props) {
    const [newInterest, setNewInterest] = useState('');
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: keyof ChildhoodInfo, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    const handleSchoolChange = (school: keyof ChildhoodInfo['schools'], value: string) => {
        onUpdate({
            ...data,
            schools: { ...data.schools, [school]: value }
        });
    };

    const togglePersonality = (trait: string) => {
        const current = data.childhoodPersonality;
        if (current.includes(trait)) {
            handleChange('childhoodPersonality', current.filter(t => t !== trait));
        } else {
            handleChange('childhoodPersonality', [...current, trait]);
        }
    };

    const addInterest = () => {
        if (newInterest.trim() && !data.earlyInterests.includes(newInterest.trim())) {
            handleChange('earlyInterests', [...data.earlyInterests, newInterest.trim()]);
            setNewInterest('');
        }
    };

    const removeInterest = (interest: string) => {
        handleChange('earlyInterests', data.earlyInterests.filter(i => i !== interest));
    };

    const handlePhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhoto = {
                    file,
                    preview: reader.result as string,
                    caption: '',
                    year: ''
                };
                handleChange('childhoodPhotos', [...data.childhoodPhotos, newPhoto]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        handleChange('childhoodPhotos', data.childhoodPhotos.filter((_, i) => i !== index));
    };

    const updatePhotoCaption = (index: number, caption: string) => {
        const updated = [...data.childhoodPhotos];
        updated[index] = { ...updated[index], caption };
        handleChange('childhoodPhotos', updated);
    };

    const updatePhotoYear = (index: number, year: string) => {
        const updated = [...data.childhoodPhotos];
        updated[index] = { ...updated[index], year };
        handleChange('childhoodPhotos', updated);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Early Life & Childhood
                </h2>
                <p className="text-charcoal/60 text-lg">
                    {isSelfArchive
                        ? "Tell us about your formative years. You can skip any section and come back later."
                        : "Tell us about their formative years. You can skip any section and come back later."}
                </p>
            </div>

            <div className="space-y-10">
                {/* Childhood Home */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Home size={18} className="text-sage" />
                        {isSelfArchive ? "Where did you grow up?" : "Where did they grow up?"}
                    </label>
                    <textarea
                        value={data.childhoodHome}
                        onChange={(e) => handleChange('childhoodHome', e.target.value)}
                        placeholder={isSelfArchive ? "Describe your childhood home and neighborhood..." : "Describe their childhood home and neighborhood..."}
                        rows={4}
                        disabled={readOnly}
                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="mt-2 text-xs text-charcoal/40 space-y-1">
                        <p>💡 Prompts to help you:</p>
                        <p>• What was {isSelfArchive ? "your" : "their"} neighborhood like?</p>
                        <p>• What kind of home did {isSelfArchive ? "you" : "they"} live in?</p>
                        <p>• City or countryside?</p>
                    </div>
                </div>

                {/* Family Background */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Users size={18} className="text-terracotta" />
                        {isSelfArchive ? "Tell us about your family" : "Tell us about their family"}
                    </label>
                    <textarea
                        value={data.familyBackground}
                        onChange={(e) => handleChange('familyBackground', e.target.value)}
                        placeholder={isSelfArchive ? "Describe your family life and upbringing..." : "Describe their family life and upbringing..."}
                        rows={5}
                        disabled={readOnly}
                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="mt-2 text-xs text-charcoal/40 space-y-1">
                        <p>💡 Prompts:</p>
                        <p>• Who raised {isSelfArchive ? "you" : "them"}?</p>
                        <p>• How many siblings do {isSelfArchive ? "you have" : "they have"}?</p>
                        <p>• What was {isSelfArchive ? "your" : "their"} family life like?</p>
                    </div>
                </div>

                {/* Education */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <GraduationCap size={18} className="text-sage" />
                        {isSelfArchive ? "Where did you go to school?" : "Where did they go to school?"}
                    </label>
                    <div className="space-y-3">
                        <div>
                            <input
                                type="text"
                                value={data.schools.elementary}
                                onChange={(e) => handleSchoolChange('elementary', e.target.value)}
                                placeholder="Elementary/Primary school"
                                disabled={readOnly}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={data.schools.highSchool}
                                onChange={(e) => handleSchoolChange('highSchool', e.target.value)}
                                placeholder="High school"
                                disabled={readOnly}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={data.schools.college}
                                onChange={(e) => handleSchoolChange('college', e.target.value)}
                                placeholder="College/University (with degree if applicable)"
                                disabled={readOnly}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={data.schools.additionalEducation}
                                onChange={(e) => handleSchoolChange('additionalEducation', e.target.value)}
                                placeholder="Additional education (optional)"
                                disabled={readOnly}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>

                {/* Childhood Personality */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Sparkles size={18} className="text-terracotta" />
                        {isSelfArchive ? "What were you like as a child?" : "What were they like as a child?"}
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">
                        {isSelfArchive ? "Select 3-5 traits that best describe you back then" : "Select 3-5 traits that best describe them"}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PERSONALITY_OPTIONS.map((trait) => {
                            const isSelected = data.childhoodPersonality.includes(trait);
                            return (
                                <button
                                    key={trait}
                                    onClick={() => togglePersonality(trait)}
                                    disabled={readOnly}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected
                                        ? 'bg-sage text-ivory border-sage'
                                        : 'bg-white text-charcoal border-sand/40 hover:border-sage/40 hover:bg-sage/5'
                                        } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {trait}
                                </button>
                            );
                        })}
                    </div>

                    {data.childhoodPersonality.length > 0 && (
                        <p className="text-xs text-sage mt-3">
                            Selected: {data.childhoodPersonality.length} trait{data.childhoodPersonality.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Early Interests */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Heart size={18} className="text-terracotta" />
                        {isSelfArchive ? "What did you love doing?" : "What did they love doing?"}
                    </label>

                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={newInterest}
                            onChange={(e) => setNewInterest(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
                            placeholder="e.g., reading, sports, music..."
                            disabled={readOnly}
                            className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {!readOnly && (
                            <button
                                onClick={addInterest}
                                className="px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        )}
                    </div>

                    {data.earlyInterests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {data.earlyInterests.map((interest, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-full"
                                >
                                    <span className="text-sm">{interest}</span>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeInterest(interest)}
                                            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 hover:bg-terracotta/20 rounded-full p-1 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: reading, baseball, piano, drawing, building things, nature walks, cooking with grandma
                        </p>
                    </div>
                </div>

                {/* Childhood Photos */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Upload size={18} className="text-sage" />
                        Upload Childhood Photos (Optional)
                    </label>

                    {data.childhoodPhotos.length === 0 ? (
                        !readOnly ? (
                            <div
                                onClick={() => photoInputRef.current?.click()}
                                className="border-2 border-dashed border-sand/40 rounded-xl p-8 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all"
                            >
                                <Upload className="mx-auto mb-3 text-charcoal/40" size={32} />
                                <p className="text-sm text-charcoal/60 mb-1">
                                    Click to upload childhood photos
                                </p>
                                <p className="text-xs text-charcoal/40">
                                    You can select multiple photos
                                </p>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-sand/40 rounded-xl p-8 text-center bg-sand/5">
                                <p className="text-sm text-charcoal/40">Photo upload disabled</p>
                            </div>
                        )
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                {data.childhoodPhotos.map((photo, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="aspect-square rounded-xl overflow-hidden bg-sand/20 border border-sand/30">
                                            <img
                                                src={photo.preview}
                                                alt={`Childhood photo ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        {!readOnly && (
                                            <button
                                                onClick={() => removePhoto(idx)}
                                                className="absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                            >
                                                <X size={14} className="text-ivory" />
                                            </button>
                                        )}

                                        {/* Caption and Year */}
                                        <div className="mt-2 space-y-1">
                                            <input
                                                type="text"
                                                value={photo.caption}
                                                onChange={(e) => updatePhotoCaption(idx, e.target.value)}
                                                placeholder="Caption (optional)"
                                                disabled={readOnly}
                                                className="w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30 disabled:opacity-50"
                                            />
                                            <input
                                                type="text"
                                                value={photo.year}
                                                onChange={(e) => updatePhotoYear(idx, e.target.value)}
                                                placeholder="Year (optional)"
                                                disabled={readOnly}
                                                className="w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30 disabled:opacity-50"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!readOnly && (
                                <button
                                    onClick={() => photoInputRef.current?.click()}
                                    className="w-full py-3 border-2 border-dashed border-sand/40 rounded-xl text-sm text-charcoal/60 hover:border-sage/40 hover:bg-sage/5 transition-all"
                                >
                                    + Add More Photos
                                </button>
                            )}
                        </>
                    )}

                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotosUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium"
                >
                    ← Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all"
                >
                    Save & Continue →
                </button>
            </div>

            {/* Skip Option */}
            <div className="mt-4 text-center">
                <button
                    onClick={onNext}
                    className="text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                >
                    I'll fill this in later →
                </button>
            </div>
        </div>
    );
}