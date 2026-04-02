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
    isSelfArchive?: boolean; // NEW PROP
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

export default function Step5Personality({ data, onUpdate, onNext, onBack, readOnly, isSelfArchive = false }: Step5Props) {
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
                <h2 className="font-serif text-4xl text-warm-dark mb-3">
                    Personality, Values & Passions
                </h2>
                <p className="text-warm-muted text-lg">
                    {isSelfArchive
                        ? "Help us understand who you are at your core."
                        : "Help us understand who they were at their core."}
                </p>
                <p className="text-xs text-warm-dark/30 italic mt-1 mb-4">
                    Capturing who they truly were — so their essence endures.
                </p>
            </div>

            <div className="space-y-10">
                {/* Personality Traits */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
                        <Sparkles size={18} className="text-warm-brown" />
                        {isSelfArchive ? "How would you describe yourself?" : "How would you describe them?"}
                    </label>
                    <p className="text-xs text-warm-outline mb-4">
                        {isSelfArchive ? "Select 5-10 traits that capture your essence" : "Select 5-10 traits that capture their essence"}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {PERSONALITY_TRAITS.map((trait) => {
                            const isSelected = data.personalityTraits.includes(trait);
                            return (
                                <button
                                    key={trait}
                                    onClick={() => !readOnly && toggleTrait(trait)}
                                    disabled={readOnly}
                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${isSelected
                                        ? 'bg-olive text-surface-low border-olive shadow-md'
                                        : 'bg-white text-warm-dark border-warm-border/30 hover:border-olive/40 hover:bg-olive/5'
                                        } ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {trait}
                                </button>
                            );
                        })}
                    </div>

                    {data.personalityTraits.length > 0 && (
                        <p className="text-xs text-olive mt-3">
                            ✓ Selected {data.personalityTraits.length} trait{data.personalityTraits.length !== 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Core Values */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
                        <Compass size={18} className="text-olive" />
                        {isSelfArchive ? "What matters most to you?" : "What mattered most to them?"}
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
                                        ? 'bg-warm-browntext-surface-low border-warm-brown shadow-md'
                                        : 'bg-white text-warm-dark border-warm-border/30 hover:border-warm-brown/40 hover:bg-warm-brown/5'
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
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-warm-brown/10 text-warm-brown border border-warm-brown/30 rounded-full mr-2"
                                >
                                    <span className="text-sm font-medium">{value}</span>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeCustomValue(value)}
                                            className="hover:bg-warm-brown/20 rounded-full p-1 transition-all"
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
                                className="flex-1 px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all"
                            />
                            <button
                                onClick={addCustomValue}
                                className="px-6 py-3 bg-warm-brownhover:bg-warm-brown/90 text-surface-low rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}
                </div>

                {/* Passions & Interests */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
                        <Heart size={18} className="text-warm-brown" />
                        {isSelfArchive ? "What do you love?" : "What did they love?"}
                    </label>

                    {data.passions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {data.passions.map((passion, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 px-4 py-2 bg-olive/10 text-olive border border-olive/30 rounded-full"
                                >
                                    <span className="text-sm font-medium">{passion}</span>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removePassion(passion)}
                                            className="hover:bg-olive/20 rounded-full p-1 transition-all"
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
                                className="flex-1 px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all"
                            />
                            <button
                                onClick={addPassion}
                                className="px-6 py-3 bg-olive hover:bg-olive/90 text-surface-low rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}

                    <div className="mt-3 p-3 bg-warm-brown/5 rounded-lg border border-warm-brown/20">
                        <p className="text-xs text-warm-muted">
                            💡 Examples: Hobbies, sports, arts, music genres, books, cooking, nature, travel, volunteer work
                        </p>
                    </div>
                </div>

                {/* Life Philosophy */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-3">
                        <Compass size={18} className="text-warm-brown" />
                        {isSelfArchive ? "Do you have a motto or life philosophy?" : "Did they have a motto or life philosophy?"}
                    </label>
                    <textarea
                        value={data.lifePhilosophy}
                        onChange={(e) => handleChange('lifePhilosophy', e.target.value)}
                        placeholder={isSelfArchive ? "What do you believe about how to live a good life?" : "What did they believe about how to live a good life?"}
                        rows={4}
                        className="w-full px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all resize-none disabled:opacity-60 disabled:bg-warm-border/10"
                        disabled={readOnly}
                    />
                    <div className="mt-2 p-3 bg-olive/5 rounded-lg border border-olive/20">
                        <p className="text-xs font-medium text-olive mb-2">Examples:</p>
                        <ul className="space-y-1 text-xs text-warm-muted">
                            <li>• "{isSelfArchive ? "I believe kindness is never wasted" : "She believed kindness was never wasted"}"</li>
                            <li>• "{isSelfArchive ? "Live by: leave things better than you found them" : "He lived by: leave things better than you found them"}"</li>
                            <li>• "Family first, always"</li>
                        </ul>
                    </div>
                </div>

                {/* Favorite Quotes */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
                        <Quote size={18} className="text-olive" />
                        Favorite Quotes (Optional)
                    </label>
                    <p className="text-xs text-warm-outline mb-4">
                        {isSelfArchive ? "Quotes that are meaningful to you" : "Quotes that were meaningful to them"}
                    </p>

                    <div className="space-y-4">
                        {data.favoriteQuotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="p-6 bg-white border border-warm-border/30 rounded-xl space-y-3 relative"
                            >
                                {!readOnly && (
                                    <button
                                        onClick={() => removeQuote(quote.id)}
                                        className="absolute top-4 right-4 p-2 text-warm-outline hover:text-warm-brown hover:bg-warm-brown/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="pr-8">
                                    <label className="block text-xs text-warm-muted mb-1">Quote</label>
                                    <textarea
                                        value={quote.text}
                                        onChange={(e) => updateQuote(quote.id, 'text', e.target.value)}
                                        placeholder="The quote itself..."
                                        rows={2}
                                        className="w-full px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all resize-none disabled:opacity-60 disabled:bg-warm-border/10"
                                        disabled={readOnly}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-warm-muted mb-1">Why it mattered (context)</label>
                                    <input
                                        type="text"
                                        value={quote.context}
                                        onChange={(e) => updateQuote(quote.id, 'context', e.target.value)}
                                        placeholder={isSelfArchive ? "e.g., I have this framed in my office" : "e.g., She had this framed in her classroom"}
                                        className="w-full px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all disabled:opacity-60 disabled:bg-warm-border/10"
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>
                        ))}

                        {!readOnly && (
                            <button
                                onClick={addQuote}
                                className="w-full py-4 border-2 border-dashed border-warm-border/30 rounded-xl text-sm font-medium text-warm-muted hover:border-olive hover:bg-olive/5 hover:text-olive transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Favorite Quote
                            </button>
                        )}
                    </div>
                </div>

                {/* Memorable Sayings */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
                        <MessageCircle size={18} className="text-warm-brown" />
                        Memorable Sayings (Optional)
                    </label>
                    <p className="text-xs text-warm-outline mb-4">
                        {isSelfArchive ? "Things you always say" : "Things they would always say"}
                    </p>

                    {data.memorableSayings.length > 0 && (
                        <div className="space-y-2 mb-3">
                            {data.memorableSayings.map((saying, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-warm-brown/5 border border-warm-brown/20 rounded-xl group"
                                >
                                    <Quote size={16} className="text-warm-brown mt-1 flex-shrink-0" />
                                    <p className="flex-1 text-warm-dark italic">"{saying}"</p>
                                    {!readOnly && (
                                        <button
                                            onClick={() => removeSaying(idx)}
                                            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-1 hover:bg-warm-brown/20 rounded transition-all"
                                        >
                                            <X size={16} className="text-warm-brown" />
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
                                className="flex-1 px-4 py-3 border border-warm-border/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/10 focus:border-olive transition-all"
                            />
                            <button
                                onClick={addSaying}
                                className="px-6 py-3 bg-warm-brownhover:bg-warm-brown/90 text-surface-low rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    )}

                    <div className="mt-3 p-3 bg-olive/5 rounded-lg border border-olive/20">
                        <p className="text-xs text-warm-muted">
                            💡 Examples: "That's a blessing in disguise", "Life's too short for bad coffee", "When in doubt, dance it out"
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex gap-4">
                <button
                    onClick={onBack}
                    className="px-6 py-4 border border-warm-border/30 rounded-xl hover:bg-warm-border/10 transition-all font-medium"
                >
                    ← Return
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 bg-olive hover:bg-olive/90 text-warm-bg py-4 px-6 rounded-xl font-medium transition-all"
                >
                    Preserve & continue →
                </button>
            </div>

            {/* Skip Option */}
            <div className="mt-4 text-center">
                <button
                    onClick={onNext}
                    className="text-sm text-warm-muted hover:text-warm-dark transition-colors"
                >
                    I'll return to this →
                </button>
            </div>
        </div>
    );
}