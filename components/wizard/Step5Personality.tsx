// components/wizard/Step5Personality.tsx
'use client';

import { useState } from 'react';
import { Sparkles, Heart, Compass, Quote, MessageCircle, Plus, X, Trash2 } from 'lucide-react';
import { PersonalityValues } from '@/types/memorial';

interface Step5Props {
    data: PersonalityValues;
    onUpdate: (data: PersonalityValues) => void;
    onNext: () => void;
    onBack: () => void;
    readOnly?: boolean;
}

const PERSONALITY_TRAITS = [
    'Passionate', 'Wise', 'Compassionate', 'Determined', 'Funny',
    'Quiet', 'Bold', 'Gentle', 'Patient', 'Creative',
    'Adventurous', 'Thoughtful', 'Energetic', 'Calm', 'Generous',
    'Independent', 'Loyal', 'Optimistic', 'Practical', 'Spontaneous',
    'Analytical', 'Empathetic', 'Resilient', 'Curious', 'Disciplined',
    'Humble', 'Charismatic', 'Reflective', 'Nurturing', 'Ambitious',
    'Inspiring', 'Graceful', 'Witty', 'Sincere', 'Fearless'
];

const CORE_VALUES = [
    'Family', 'Education', 'Justice', 'Kindness', 'Faith',
    'Hard work', 'Creativity', 'Community', 'Integrity', 'Freedom',
    'Compassion', 'Excellence', 'Tradition', 'Innovation', 'Service',
    'Honesty', 'Courage', 'Respect', 'Growth', 'Love',
    'Peace', 'Generosity', 'Wisdom', 'Humility', 'Perseverance'
];

export default function Step5Personality({ data, onUpdate, onNext, onBack, readOnly }: Step5Props) {
    const [newPassion, setNewPassion] = useState('');
    const [newSaying, setNewSaying] = useState('');
    const [customValue, setCustomValue] = useState('');

    const handleChange = (field: keyof PersonalityValues, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    // Personality Traits
    const toggleTrait = (trait: string) => {
        const current = data.personalityTraits;
        if (current.includes(trait)) {
            handleChange('personalityTraits', current.filter(t => t !== trait));
        } else {
            handleChange('personalityTraits', [...current, trait]);
        }
    };

    // Core Values
    const toggleValue = (value: string) => {
        const current = data.coreValues;
        if (current.includes(value)) {
            handleChange('coreValues', current.filter(v => v !== value));
        } else {
            handleChange('coreValues', [...current, value]);
        }
    };

    const addCustomValue = () => {
        if (customValue.trim() && !data.coreValues.includes(customValue.trim())) {
            handleChange('coreValues', [...data.coreValues, customValue.trim()]);
            setCustomValue('');
        }
    };

    const removeCustomValue = (value: string) => {
        if (!CORE_VALUES.includes(value)) {
            handleChange('coreValues', data.coreValues.filter(v => v !== value));
        }
    };

    // Passions
    const addPassion = () => {
        if (newPassion.trim() && !data.passions.includes(newPassion.trim())) {
            handleChange('passions', [...data.passions, newPassion.trim()]);
            setNewPassion('');
        }
    };

    const removePassion = (passion: string) => {
        handleChange('passions', data.passions.filter(p => p !== passion));
    };

    // Favorite Quotes
    const addQuote = () => {
        const newQuote = {
            id: `quote-${Date.now()}`,
            text: '',
            context: ''
        };
        handleChange('favoriteQuotes', [...data.favoriteQuotes, newQuote]);
    };

    const removeQuote = (id: string) => {
        handleChange('favoriteQuotes', data.favoriteQuotes.filter(q => q.id !== id));
    };

    const updateQuote = (id: string, field: 'text' | 'context', value: string) => {
        handleChange(
            'favoriteQuotes',
            data.favoriteQuotes.map(q => (q.id === id ? { ...q, [field]: value } : q))
        );
    };

    // Memorable Sayings
    const addSaying = () => {
        if (newSaying.trim() && !data.memorableSayings.includes(newSaying.trim())) {
            handleChange('memorableSayings', [...data.memorableSayings, newSaying.trim()]);
            setNewSaying('');
        }
    };

    const removeSaying = (index: number) => {
        handleChange('memorableSayings', data.memorableSayings.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Personality, Values & Passions
                </h2>
                <p className="text-charcoal/60 text-lg">
                    Help us understand who they were at their core.
                </p>
            </div>

            <div className="space-y-10">
                {/* Personality Traits */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Sparkles size={18} className="text-terracotta" />
                        How would you describe them?
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">Select 5-10 traits that capture their essence</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {PERSONALITY_TRAITS.map((trait) => {
                            const isSelected = data.personalityTraits.includes(trait);
                            return (
                                <button
                                    key={trait}
                                    onClick={() => !readOnly && toggleTrait(trait)}
                                    disabled={readOnly}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected
                                        ? 'bg-sage text-ivory border-sage shadow-md'
                                        : 'bg-white text-charcoal border-sand/40 hover:border-sage/40 hover:bg-sage/5'
                                        } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {trait}
                                </button>
                            );
                        })}
                    </div>

                    {data.personalityTraits.length > 0 && (
                        <p className="text-xs text-sage mt-3">
                            ✓ Selected {data.personalityTraits.length} trait{data.personalityTraits.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Core Values */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Compass size={18} className="text-sage" />
                        What mattered most to them?
                    </label>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                        {CORE_VALUES.map((value) => {
                            const isSelected = data.coreValues.includes(value);
                            return (
                                <button
                                    key={value}
                                    onClick={() => !readOnly && toggleValue(value)}
                                    disabled={readOnly}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected
                                        ? 'bg-terracotta text-ivory border-terracotta shadow-md'
                                        : 'bg-white text-charcoal border-sand/40 hover:border-terracotta/40 hover:bg-terracotta/5'
                                        } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom values */}
                    <div className="space-y-2">
                        {data.coreValues
                            .filter(v => !CORE_VALUES.includes(v))
                            .map((value, idx) => (
                                <div
                                    key={idx}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/10 text-terracotta border border-terracotta/30 rounded-full mr-2"
                                >
                                    <span className="text-sm font-medium">{value}</span>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeCustomValue(value)}
                                            className="hover:bg-terracotta/20 rounded-full p-1 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                    </div>

                    {!readOnly && (
                        <div className="flex gap-2 mt-3">
                            <input
                                type="text"
                                value={customValue}
                                onChange={(e) => setCustomValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomValue())}
                                placeholder="Add custom value..."
                                className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                            />
                            <button
                                onClick={addCustomValue}
                                className="px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Passions & Interests */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Heart size={18} className="text-terracotta" />
                        What did they love?
                    </label>

                    {data.passions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {data.passions.map((passion, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-2 bg-sage/10 text-sage border border-sage/30 rounded-full"
                                >
                                    <span className="text-sm font-medium">{passion}</span>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removePassion(passion)}
                                            className="hover:bg-sage/20 rounded-full p-1 transition-all"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!readOnly && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPassion}
                                onChange={(e) => setNewPassion(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPassion())}
                                placeholder="e.g., Jazz music, gardening, teaching..."
                                className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                            />
                            <button
                                onClick={addPassion}
                                className="px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}

                    <div className="mt-3 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: Hobbies, sports, arts, music genres, books, cooking, nature, travel, volunteer work
                        </p>
                    </div>
                </div>

                {/* Life Philosophy */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-3">
                        <Compass size={18} className="text-terracotta" />
                        Did they have a motto or life philosophy?
                    </label>
                    <textarea
                        value={data.lifePhilosophy}
                        onChange={(e) => handleChange('lifePhilosophy', e.target.value)}
                        placeholder="What did they believe about how to live a good life?"
                        rows={4}
                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none disabled:opacity-60 disabled:bg-sand/10"
                        disabled={readOnly}
                    />
                    <div className="mt-2 p-3 bg-sage/5 rounded-lg border border-sage/20">
                        <p className="text-xs font-medium text-sage mb-2">Examples:</p>
                        <ul className="space-y-1 text-xs text-charcoal/60">
                            <li>• "She believed kindness was never wasted"</li>
                            <li>• "He lived by: leave things better than you found them"</li>
                            <li>• "Family first, always"</li>
                        </ul>
                    </div>
                </div>

                {/* Favorite Quotes */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Quote size={18} className="text-sage" />
                        Favorite Quotes (Optional)
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">Quotes that were meaningful to them</p>

                    <div className="space-y-4">
                        {data.favoriteQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-3 relative"
                            >
                                {!readOnly && (
                                    <button
                                        onClick={() => removeQuote(quote.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="pr-8">
                                    <label className="block text-xs text-charcoal/60 mb-1">Quote</label>
                                    <textarea
                                        value={quote.text}
                                        onChange={(e) => updateQuote(quote.id, 'text', e.target.value)}
                                        placeholder="The quote itself..."
                                        rows={2}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none disabled:opacity-60 disabled:bg-sand/10"
                                        disabled={readOnly}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">Why it mattered (context)</label>
                                    <input
                                        type="text"
                                        value={quote.context}
                                        onChange={(e) => updateQuote(quote.id, 'context', e.target.value)}
                                        placeholder="e.g., She had this framed in her classroom"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all disabled:opacity-60 disabled:bg-sand/10"
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>
                        ))}

                        {!readOnly && (
                            <button
                                onClick={addQuote}
                                className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Favorite Quote
                            </button>
                        )}
                    </div>
                </div>

                {/* Memorable Sayings */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <MessageCircle size={18} className="text-terracotta" />
                        Memorable Sayings (Optional)
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">Things they would always say</p>

                    {data.memorableSayings.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {data.memorableSayings.map((saying, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-terracotta/5 border border-terracotta/20 rounded-xl group"
                                >
                                    <Quote size={16} className="text-terracotta mt-1 flex-shrink-0" />
                                    <p className="flex-1 text-charcoal italic">"{saying}"</p>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeSaying(idx)}
                                            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 hover:bg-terracotta/20 rounded transition-all"
                                        >
                                            <X size={16} className="text-terracotta" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!readOnly && (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSaying}
                                onChange={(e) => setNewSaying(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSaying())}
                                placeholder='e.g., "Measure twice, cut once"'
                                className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                            />
                            <button
                                onClick={addSaying}
                                className="px-6 py-3 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}

                    <div className="mt-3 p-3 bg-sage/5 rounded-lg border border-sage/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: "That's a blessing in disguise", "Life's too short for bad coffee", "When in doubt, dance it out"
                        </p>
                    </div>
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