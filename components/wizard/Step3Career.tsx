// components/wizard/Step3Career.tsx
'use client';

import { useState } from 'react';
import { Briefcase, Award, GraduationCap, Plus, X, Trash2 } from 'lucide-react';
import { CareerEducation } from '@/types/memorial';

interface Step3Props {
    data: CareerEducation;
    onUpdate: (data: CareerEducation) => void;
    onNext: () => void;
    onBack: () => void;
    readOnly?: boolean;
    isSelfArchive?: boolean; // NEW PROP
}

export default function Step3Career({ data, onUpdate, onNext, onBack, readOnly, isSelfArchive = false }: Step3Props) {
    const [newHighlight, setNewHighlight] = useState('');

    const handleChange = (field: keyof CareerEducation, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    const handleEducationChange = (field: keyof CareerEducation['education'], value: string) => {
        onUpdate({
            ...data,
            education: { ...data.education, [field]: value }
        });
    };

    // Occupation Management
    const addOccupation = () => {
        const newOccupation = {
            id: `occ-${Date.now()}`,
            title: '',
            company: '',
            yearsFrom: '',
            yearsTo: '',
            description: ''
        };
        handleChange('occupations', [...data.occupations, newOccupation]);
    };

    const removeOccupation = (id: string) => {
        handleChange('occupations', data.occupations.filter(occ => occ.id !== id));
    };

    const updateOccupation = (id: string, field: string, value: string) => {
        handleChange(
            'occupations',
            data.occupations.map(occ =>
                occ.id === id ? { ...occ, [field]: value } : occ
            )
        );
    };

    // Career Highlights Management
    const addHighlight = () => {
        if (newHighlight.trim()) {
            handleChange('careerHighlights', [...data.careerHighlights, newHighlight.trim()]);
            setNewHighlight('');
        }
    };

    const removeHighlight = (index: number) => {
        handleChange('careerHighlights', data.careerHighlights.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Career & Education
                </h2>
                <p className="text-charcoal/60 text-lg">
                    {isSelfArchive
                        ? "Tell us about your professional life and educational achievements."
                        : "Tell us about their professional life and educational achievements."}
                </p>
            </div>

            <div className="space-y-10">
                {/* Occupations */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Briefcase size={18} className="text-stone" />
                        {isSelfArchive ? "What did you do for work?" : "What did they do for work?"}
                    </label>

                    <div className="space-y-4">
                        {data.occupations.map((occupation, index) => (
                            <div
                                key={occupation.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                            >
                                {/* Remove button */}
                                {data.occupations.length > 1 && !readOnly && (
                                    <button
                                        onClick={() => removeOccupation(occupation.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-stone hover:bg-stone/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove this job"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="pr-10">
                                    <input
                                        type="text"
                                        value={occupation.title}
                                        onChange={(e) => updateOccupation(occupation.id, 'title', e.target.value)}
                                        placeholder="Job title (e.g., High School English Teacher)"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={readOnly}
                                    />
                                </div>

                                <input
                                    type="text"
                                    value={occupation.company}
                                    onChange={(e) => updateOccupation(occupation.id, 'company', e.target.value)}
                                    placeholder="Company/Organization (e.g., Boston Public Schools)"
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={readOnly}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">From</label>
                                        <input
                                            type="text"
                                            value={occupation.yearsFrom}
                                            onChange={(e) => updateOccupation(occupation.id, 'yearsFrom', e.target.value)}
                                            placeholder="e.g., 1966"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={readOnly}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">To</label>
                                        <input
                                            type="text"
                                            value={occupation.yearsTo}
                                            onChange={(e) => updateOccupation(occupation.id, 'yearsTo', e.target.value)}
                                            placeholder="e.g., 2006 or 'Present'"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={readOnly}
                                        />
                                    </div>
                                </div>

                                <textarea
                                    value={occupation.description}
                                    onChange={(e) => updateOccupation(occupation.id, 'description', e.target.value)}
                                    placeholder={isSelfArchive ? "Brief description of your role and responsibilities..." : "Brief description of their role and responsibilities..."}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={readOnly}
                                />
                            </div>
                        ))}

                        {!readOnly && (
                            <button
                                onClick={addOccupation}
                                className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-mist hover:bg-mist/5 hover:text-mist transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Another Job
                            </button>
                        )}
                    </div>
                </div>

                {/* Career Highlights */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Award size={18} className="text-mist" />
                        Career Highlights & Achievements
                    </label>

                    <div className="space-y-3">
                        {data.careerHighlights.map((highlight, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-mist/5 border border-mist/20 rounded-xl group"
                            >
                                <div className="w-2 h-2 rounded-full bg-mist mt-2 flex-shrink-0" />
                                <p className="flex-1 text-charcoal leading-relaxed">{highlight}</p>
                                {!readOnly && (
                                    <button
                                        onClick={() => removeHighlight(index)}
                                        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 hover:bg-mist/20 rounded transition-all"
                                    >
                                        <X size={16} className="text-mist" />
                                    </button>
                                )}
                            </div>
                        ))}

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newHighlight}
                                onChange={(e) => setNewHighlight(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                                placeholder="e.g., Received Teacher of the Year Award..."
                                className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={readOnly}
                            />
                            {!readOnly && (
                                <button
                                    onClick={addHighlight}
                                    className="px-6 py-3 bg-mist hover:bg-mist/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    Add
                                </button>
                            )}
                        </div>

                        <div className="p-3 bg-stone/5 rounded-lg border border-stone/20">
                            <p className="text-xs text-charcoal/60">
                                💡 Examples: Awards, promotions, major projects, publications, recognitions, certifications
                            </p>
                        </div>
                    </div>
                </div>

                {/* Education Details */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <GraduationCap size={18} className="text-stone" />
                        Higher Education Details
                    </label>

                    <div className="p-6 bg-white border border-sand/40 rounded-xl space-y-4">
                        <div>
                            <label className="block text-xs text-charcoal/60 mb-2">Major / Field of Study</label>
                            <input
                                type="text"
                                value={data.education.major}
                                onChange={(e) => handleEducationChange('major', e.target.value)}
                                placeholder="e.g., English Literature, Computer Science"
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-charcoal/60 mb-2">Graduation Year</label>
                            <input
                                type="text"
                                value={data.education.graduationYear}
                                onChange={(e) => handleEducationChange('graduationYear', e.target.value)}
                                placeholder="e.g., 1964"
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={readOnly}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-charcoal/60 mb-2">Special Honors or Achievements</label>
                            <textarea
                                value={data.education.honors}
                                onChange={(e) => handleEducationChange('honors', e.target.value)}
                                placeholder="e.g., Summa cum laude, Dean's List, Phi Beta Kappa"
                                rows={2}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={readOnly}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-charcoal/40 mt-2">
                        {isSelfArchive ? "Optional - Fill this in if you pursued higher education" : "Optional - Fill this in if they pursued higher education"}
                    </p>
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
                    className="flex-1 bg-stone hover:bg-stone/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all"
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