// components/wizard/Step7Memories.tsx
'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Star, Mail, Plus, X, Trash2, Calendar } from 'lucide-react';
import { MemoriesStories } from '@/types/memorial';

interface Step7Props {
    data: MemoriesStories;
    onUpdate: (data: MemoriesStories) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step7Memories({ data, onUpdate, onNext, onBack }: Step7Props) {
    const [newEmail, setNewEmail] = useState('');

    const handleChange = (field: keyof MemoriesStories, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    // Shared Memories Management
    const addMemory = () => {
        const newMemory = {
            id: `memory-${Date.now()}`,
            title: '',
            date: '',
            content: '',
            author: '',
            relationship: ''
        };
        handleChange('sharedMemories', [...data.sharedMemories, newMemory]);
    };

    const removeMemory = (id: string) => {
        handleChange('sharedMemories', data.sharedMemories.filter(m => m.id !== id));
    };

    const updateMemory = (id: string, field: string, value: string) => {
        handleChange(
            'sharedMemories',
            data.sharedMemories.map(m => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    // Impact Stories Management
    const addImpactStory = () => {
        const newStory = {
            id: `impact-${Date.now()}`,
            title: '',
            content: '',
            author: ''
        };
        handleChange('impactStories', [...data.impactStories, newStory]);
    };

    const removeImpactStory = (id: string) => {
        handleChange('impactStories', data.impactStories.filter(s => s.id !== id));
    };

    const updateImpactStory = (id: string, field: string, value: string) => {
        handleChange(
            'impactStories',
            data.impactStories.map(s => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    // Email Invitations Management
    const addEmail = () => {
        const email = newEmail.trim();
        if (email && !data.invitedEmails.includes(email)) {
            // Basic email validation
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                handleChange('invitedEmails', [...data.invitedEmails, email]);
                setNewEmail('');
            } else {
                alert('Please enter a valid email address');
            }
        }
    };

    const removeEmail = (email: string) => {
        handleChange('invitedEmails', data.invitedEmails.filter(e => e !== email));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Memories & Stories from Others
                </h2>
                <p className="text-charcoal/60 text-lg">
                    Add memories from people who knew them, or invite others to contribute their stories.
                </p>
            </div>

            <div className="space-y-10">
                {/* Shared Memories */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Heart size={18} className="text-terracotta" />
                        Shared Memories
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">
                        Add memories and stories from family members and friends
                    </p>

                    <div className="space-y-6">
                        {data.sharedMemories.map((memory) => (
                            <div
                                key={memory.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                            >
                                {/* Remove button */}
                                <button
                                    onClick={() => removeMemory(memory.id)}
                                    className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                    title="Remove memory"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="pr-8">
                                    <label className="block text-xs text-charcoal/60 mb-1">Memory Title</label>
                                    <input
                                        type="text"
                                        value={memory.title}
                                        onChange={(e) => updateMemory(memory.id, 'title', e.target.value)}
                                        placeholder="e.g., The Day She Changed My Life"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">Date (Optional)</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40" size={18} />
                                        <input
                                            type="date"
                                            value={memory.date}
                                            onChange={(e) => updateMemory(memory.id, 'date', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">The Memory</label>
                                    <textarea
                                        value={memory.content}
                                        onChange={(e) => updateMemory(memory.id, 'content', e.target.value)}
                                        placeholder="Share the memory or story..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Author Name</label>
                                        <input
                                            type="text"
                                            value={memory.author}
                                            onChange={(e) => updateMemory(memory.id, 'author', e.target.value)}
                                            placeholder="e.g., Marcus Johnson"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Relationship</label>
                                        <input
                                            type="text"
                                            value={memory.relationship}
                                            onChange={(e) => updateMemory(memory.id, 'relationship', e.target.value)}
                                            placeholder="e.g., Former Student"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addMemory}
                            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Shared Memory
                        </button>
                    </div>
                </div>

                {/* Impact Stories */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Star size={18} className="text-sage" />
                        Impact Stories
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">
                        How did they change lives? Stories of their lasting impact
                    </p>

                    <div className="space-y-6">
                        {data.impactStories.map((story) => (
                            <div
                                key={story.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                            >
                                {/* Remove button */}
                                <button
                                    onClick={() => removeImpactStory(story.id)}
                                    className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                    title="Remove story"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="pr-8">
                                    <label className="block text-xs text-charcoal/60 mb-1">Story Title</label>
                                    <input
                                        type="text"
                                        value={story.title}
                                        onChange={(e) => updateImpactStory(story.id, 'title', e.target.value)}
                                        placeholder="e.g., The Teacher Who Saved My Life"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">The Story</label>
                                    <textarea
                                        value={story.content}
                                        onChange={(e) => updateImpactStory(story.id, 'content', e.target.value)}
                                        placeholder="Tell the story of how they made a difference..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">Author & Relationship</label>
                                    <input
                                        type="text"
                                        value={story.author}
                                        onChange={(e) => updateImpactStory(story.id, 'author', e.target.value)}
                                        placeholder="e.g., David Chen, Former Student (Class of 2003)"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    />
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addImpactStory}
                            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Impact Story
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: "She inspired me to become a teacher", "He helped me through the hardest time", "They believed in me when no one else did"
                        </p>
                    </div>
                </div>

                {/* Invite Others Section */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Mail size={18} className="text-terracotta" />
                        Invite Others to Contribute
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">
                        Want family or friends to add their memories? Invite them by email (Coming soon - for now, you can add their memories yourself above)
                    </p>

                    <div className="p-6 bg-gradient-to-br from-sage/5 to-terracotta/5 border border-sand/30 rounded-xl">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageCircle size={18} className="text-sage" />
                            <p className="text-sm font-medium text-charcoal">Email Invitations</p>
                        </div>

                        {data.invitedEmails.length > 0 && (
                            <div className="mb-4 space-y-2">
                                {data.invitedEmails.map((email, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-sand/30"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Mail size={16} className="text-sage" />
                                            <span className="text-sm text-charcoal">{email}</span>
                                        </div>
                                        <button
                                            onClick={() => removeEmail(email)}
                                            className="p-1 hover:bg-sand/20 rounded transition-all"
                                        >
                                            <X size={16} className="text-charcoal/40" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                                placeholder="friend@example.com"
                                className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                            />
                            <button
                                onClick={addEmail}
                                className="px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>

                        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-sage/20">
                            <p className="text-xs text-charcoal/60 leading-relaxed">
                                <strong>Note:</strong> Email invitations will be available soon. For now, save email addresses here and you can invite them later, or add their memories yourself in the sections above.
                            </p>
                        </div>
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