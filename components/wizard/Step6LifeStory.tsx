// components/wizard/Step6LifeStory.tsx
'use client';

import { useState } from 'react';
import { BookOpen, Lightbulb, Plus, X, Trash2, HelpCircle, FileText } from 'lucide-react';
import { LifeStory } from '@/types/memorial';

interface Step6Props {
    data: LifeStory;
    onUpdate: (data: LifeStory) => void;
    onNext: () => void;
    onBack: () => void;
}

const WRITING_PROMPTS = [
    "What challenges did they overcome?",
    "What made them unique?",
    "How did they treat others?",
    "What brought them joy?",
    "What would people remember most?",
    "What were their proudest moments?",
    "How did they handle adversity?",
    "What wisdom did they share?",
    "What was their impact on others?",
    "What legacy did they leave?"
];

const BIOGRAPHY_TEMPLATE = `[Opening - Who they were in essence]


[Early Life - Childhood, family, education]


[Adult Years - Career, relationships, family they built]


[Middle Years - Achievements, challenges, growth]


[Later Years - Wisdom, legacy, final chapter]


[Closing - What they meant to others]

`;

export default function Step6LifeStory({ data, onUpdate, onNext, onBack }: Step6Props) {
    const [showPrompts, setShowPrompts] = useState(true);
    const [showTemplate, setShowTemplate] = useState(false);
    const [previousBiography, setPreviousBiography] = useState<string | null>(null);

    const handleChange = (field: keyof LifeStory, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    const wordCount = data.biography.trim().split(/\s+/).filter(w => w.length > 0).length;

    const useTemplate = () => {
        if (window.confirm('This will replace your current biography text. Continue?')) {
            // Save current text for undo
            setPreviousBiography(data.biography);
            handleChange('biography', BIOGRAPHY_TEMPLATE);
            setShowTemplate(false);
        }
    };

    const undoTemplate = () => {
        if (previousBiography !== null) {
            handleChange('biography', previousBiography);
            setPreviousBiography(null);
        }
    };

    // Life Chapters Management
    const addChapter = () => {
        const newChapter = {
            id: `chapter-${Date.now()}`,
            period: '',
            ageRange: '',
            title: '',
            description: '',
            keyEvents: []
        };
        handleChange('lifeChapters', [...data.lifeChapters, newChapter]);
    };

    const removeChapter = (id: string) => {
        handleChange('lifeChapters', data.lifeChapters.filter(c => c.id !== id));
    };

    const updateChapter = (id: string, field: string, value: any) => {
        handleChange(
            'lifeChapters',
            data.lifeChapters.map(c => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    const addKeyEvent = (chapterId: string) => {
        const chapter = data.lifeChapters.find(c => c.id === chapterId);
        if (chapter) {
            updateChapter(chapterId, 'keyEvents', [...chapter.keyEvents, '']);
        }
    };

    const updateKeyEvent = (chapterId: string, eventIndex: number, value: string) => {
        const chapter = data.lifeChapters.find(c => c.id === chapterId);
        if (chapter) {
            const newEvents = [...chapter.keyEvents];
            newEvents[eventIndex] = value;
            updateChapter(chapterId, 'keyEvents', newEvents);
        }
    };

    const removeKeyEvent = (chapterId: string, eventIndex: number) => {
        const chapter = data.lifeChapters.find(c => c.id === chapterId);
        if (chapter) {
            updateChapter(
                chapterId,
                'keyEvents',
                chapter.keyEvents.filter((_, i) => i !== eventIndex)
            );
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Full Life Story
                </h2>
                <p className="text-charcoal/60 text-lg">
                    This is the heart of the memorial. Take your time - you can save and come back anytime.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Biography Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                                <BookOpen size={18} className="text-terracotta" />
                                Biography
                            </label>
                            <div className="flex items-center gap-2">
                                {previousBiography !== null && (
                                    <button
                                        onClick={undoTemplate}
                                        className="text-xs px-3 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-lg hover:bg-terracotta/20 transition-all flex items-center gap-2"
                                    >
                                        <X size={14} />
                                        Undo Template
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowTemplate(!showTemplate)}
                                    className="text-xs px-3 py-2 border border-sand/40 rounded-lg hover:bg-sand/10 transition-all flex items-center gap-2"
                                >
                                    <FileText size={14} />
                                    {showTemplate ? 'Hide' : 'Show'} Template
                                </button>
                            </div>
                        </div>

                        {showTemplate && (
                            <div className="mb-4 p-4 bg-terracotta/5 border border-terracotta/20 rounded-xl">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} className="text-terracotta" />
                                        <p className="text-sm font-medium text-charcoal">Suggested Structure</p>
                                    </div>
                                    <button
                                        onClick={useTemplate}
                                        className="text-xs px-3 py-1.5 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg transition-all"
                                    >
                                        Use This Template
                                    </button>
                                </div>
                                <p className="text-xs text-charcoal/60">
                                    This template provides a helpful structure for writing a complete life story.
                                </p>
                            </div>
                        )}

                        <textarea
                            value={data.biography}
                            onChange={(e) => handleChange('biography', e.target.value)}
                            placeholder="Tell their complete story here...

Start with who they were in essence, then guide us through their journey from early life through their final years. What made them special? What did they overcome? How did they touch lives?

Don't worry about making it perfect - just write from the heart. You can always edit later."
                            rows={20}
                            className="w-full px-6 py-4 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none font-serif text-base leading-relaxed"
                        />

                        <div className="flex items-center justify-between text-xs text-charcoal/60">
                            <div className="flex items-center gap-4">
                                <span className={wordCount >= 500 ? 'text-sage font-medium' : ''}>
                                    {wordCount} words {wordCount < 500 && `(${500 - wordCount} more recommended)`}
                                </span>
                                <span className="text-charcoal/40">•</span>
                                <span className="text-charcoal/40">Auto-saving...</span>
                            </div>
                            <button
                                onClick={onNext}
                                className="text-sage hover:text-sage/80 transition-colors"
                            >
                                I'll continue this later →
                            </button>
                        </div>
                    </div>

                    {/* Life Chapters Section */}
                    <div className="pt-8 border-t border-sand/30">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-1">
                                    <BookOpen size={18} className="text-sage" />
                                    Life Chapters (Optional but Recommended)
                                </label>
                                <p className="text-xs text-charcoal/40">
                                    Break their life into 4-6 chapters to help organize the story
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {data.lifeChapters.map((chapter, index) => (
                                <div
                                    key={chapter.id}
                                    className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                                >
                                    {/* Chapter number badge */}
                                    <div className="absolute -top-3 -left-3 w-10 h-10 bg-sage text-ivory rounded-full flex items-center justify-center font-serif text-lg font-bold shadow-md">
                                        {index + 1}
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeChapter(chapter.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove chapter"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div>
                                            <label className="block text-xs text-charcoal/60 mb-1">Period</label>
                                            <input
                                                type="text"
                                                value={chapter.period}
                                                onChange={(e) => updateChapter(chapter.id, 'period', e.target.value)}
                                                placeholder="e.g., 1960-1975"
                                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-charcoal/60 mb-1">Age Range</label>
                                            <input
                                                type="text"
                                                value={chapter.ageRange}
                                                onChange={(e) => updateChapter(chapter.id, 'ageRange', e.target.value)}
                                                placeholder="e.g., Ages 18-33"
                                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Chapter Title</label>
                                        <input
                                            type="text"
                                            value={chapter.title}
                                            onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                                            placeholder="e.g., Finding My Path"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Description</label>
                                        <textarea
                                            value={chapter.description}
                                            onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                                            placeholder="Describe this period of their life (3-5 lines)..."
                                            rows={4}
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                        />
                                    </div>

                                    {/* Key Events */}
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-2">Key Events in this Chapter</label>
                                        <div className="space-y-2">
                                            {chapter.keyEvents.map((event, eventIdx) => (
                                                <div key={eventIdx} className="flex gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-sage mt-3 flex-shrink-0" />
                                                    <input
                                                        type="text"
                                                        value={event}
                                                        onChange={(e) => updateKeyEvent(chapter.id, eventIdx, e.target.value)}
                                                        placeholder="Describe a key event..."
                                                        className="flex-1 px-4 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-sm"
                                                    />
                                                    <button
                                                        onClick={() => removeKeyEvent(chapter.id, eventIdx)}
                                                        className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 hover:bg-sand/20 rounded-lg transition-all"
                                                    >
                                                        <X size={16} className="text-charcoal/40" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                onClick={() => addKeyEvent(chapter.id)}
                                                className="text-xs text-sage hover:text-sage/80 transition-colors flex items-center gap-1 ml-4"
                                            >
                                                <Plus size={14} />
                                                Add Key Event
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addChapter}
                                className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Life Chapter
                            </button>

                            {data.lifeChapters.length > 0 && (
                                <div className="p-3 bg-sage/5 rounded-lg border border-sage/20">
                                    <p className="text-xs text-charcoal/60">
                                        💡 Tip: Most life stories work well with 4-6 chapters covering different periods
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar with Writing Prompts */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl p-6 border border-sand/30">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Lightbulb size={18} className="text-terracotta" />
                                    <h3 className="text-sm font-medium text-charcoal">Writing Prompts</h3>
                                </div>
                                <button
                                    onClick={() => setShowPrompts(!showPrompts)}
                                    className="text-xs text-charcoal/60 hover:text-charcoal transition-colors"
                                >
                                    {showPrompts ? 'Hide' : 'Show'}
                                </button>
                            </div>

                            {showPrompts && (
                                <div className="space-y-3">
                                    {WRITING_PROMPTS.map((prompt, idx) => (
                                        <div
                                            key={idx}
                                            className="p-3 bg-white/50 rounded-lg border border-sand/20 hover:border-sage/30 hover:bg-white transition-all cursor-pointer"
                                        >
                                            <p className="text-xs text-charcoal/70 leading-relaxed">{prompt}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 pt-6 border-t border-sand/20">
                                <div className="flex items-start gap-2 text-xs text-charcoal/60">
                                    <HelpCircle size={14} className="flex-shrink-0 mt-0.5" />
                                    <p>
                                        Click these prompts for inspiration. Don't feel pressure to answer all of them - just use what helps.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-6 p-4 bg-white rounded-xl border border-sand/30">
                            <h4 className="text-xs font-medium text-charcoal mb-3">Quick Tips</h4>
                            <ul className="space-y-2 text-xs text-charcoal/60">
                                <li className="flex items-start gap-2">
                                    <span className="text-sage">✓</span>
                                    <span>Write like you're talking to a friend</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sage">✓</span>
                                    <span>Include specific memories and details</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sage">✓</span>
                                    <span>Share their unique qualities and quirks</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sage">✓</span>
                                    <span>Don't worry about perfect grammar</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-sage">✓</span>
                                    <span>Take breaks if you need to</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex gap-4 max-w-6xl">
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
        </div>
    );
}