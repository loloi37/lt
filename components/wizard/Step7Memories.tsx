// components/wizard/Step7Memories.tsx — UPDATED Step 1.1.2
// Changes: Witness invitation UI visible before payment, sending blocked until paid
'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Star, Mail, Plus, X, Trash2, Calendar, Lock, Send, Eye, Users, Shield, Loader2 } from 'lucide-react';
import { MemoriesStories, WitnessRole } from '@/types/memorial';
import { supabase } from '@/lib/supabase';

interface Step7Props {
    data: MemoriesStories;
    onUpdate: (data: MemoriesStories) => void;
    onNext: () => void;
    onBack: () => void;
    isPaid?: boolean;
    readOnly?: boolean;
    userRole: WitnessRole;
    onSubmitContribution: (type: 'memory' | 'photo' | 'video', content: any) => Promise<void>;
    memorialId: string | null;
}

export default function Step7Memories({ data, onUpdate, onNext, onBack, isPaid = false, readOnly, userRole, onSubmitContribution, memorialId }: Step7Props) {
    const [newEmail, setNewEmail] = useState('');
    const [showPreviewEmail, setShowPreviewEmail] = useState(false);
    const [previewRecipient, setPreviewRecipient] = useState('');
    const [personalMessage, setPersonalMessage] = useState(data.witnessPersonalMessage || '');
    const [sendingError, setSendingError] = useState<string | null>(null);

    // WITNESS CONTRIBUTION STATE
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newMemoryDraft, setNewMemoryDraft] = useState({
        title: '',
        content: '',
        author: '',
        relationship: ''
    });

    const handleWitnessSubmit = async () => {
        if (!newMemoryDraft.title || !newMemoryDraft.content) {
            alert("Please provide at least a title and the memory text.");
            return;
        }

        await onSubmitContribution('memory', newMemoryDraft);

        // Reset form
        setNewMemoryDraft({ title: '', content: '', author: '', relationship: '' });
        setIsAddingNew(false);
    };

    const [pendingContributions, setPendingContributions] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [disputingId, setDisputingId] = useState<string | null>(null);

    // Fetch pending items only if the user is the Owner
    useEffect(() => {
        if (userRole === 'owner' && memorialId) {
            fetchPendingContributions();
        }
    }, [memorialId, userRole]);

    const fetchPendingContributions = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
            .from('memorial_contributions')
            .select('*')
            .eq('memorial_id', memorialId)
            .eq('status', 'pending_approval');

        if (!error && data) {
            setPendingContributions(data);
        }
        setIsFetching(false);
    };

    const handleDecision = async (
        contribution: any,
        decision: 'approved' | 'rejected',
        overrideContent?: string // <--- NEW OPTIONAL ARGUMENT
    ) => {
        try {
            // 1. Update the contribution record in Supabase
            const { error: updateError } = await supabase
                .from('memorial_contributions')
                .update({ status: decision })
                .eq('id', contribution.id);

            if (updateError) throw updateError;

            // 2. If approved, add it to the main archive data
            if (decision === 'approved') {
                const newMemory = {
                    id: `witness-${contribution.id}`, // Maintain link to contribution
                    title: contribution.content.title,
                    // USE OVERRIDE CONTENT IF PROVIDED, OTHERWISE ORIGINAL
                    content: overrideContent || contribution.content.content,
                    author: contribution.witness_name,
                    relationship: contribution.content.relationship || 'Friend',
                    date: new Date().toISOString().split('T')[0]
                };

                // Update local state and trigger parent onUpdate
                const updatedMemories = [...data.sharedMemories, newMemory];
                onUpdate({ ...data, sharedMemories: updatedMemories });
            }

            // 3. Refresh the pending list
            setPendingContributions(prev => prev.filter(item => item.id !== contribution.id));
            // Clear dispute state if it exists
            setDisputingId(null);

            alert(decision === 'approved' ? "Processed successfully." : "Contribution rejected.");

        } catch (err: any) {
            console.error("Decision error:", err);
            alert("Failed to process decision: " + err.message);
        }
    };

    const handleChange = (field: keyof MemoriesStories, value: any) => {
        if (readOnly) return; // Prevent changes in readOnly mode
        onUpdate({ ...data, [field]: value });
    };

    // =============================================
    // SHARED MEMORIES (unchanged logic)
    // =============================================
    const addMemory = () => {
        if (readOnly) return;
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
        if (readOnly) return;
        handleChange('sharedMemories', data.sharedMemories.filter(m => m.id !== id));
    };

    const updateMemory = (id: string, field: string, value: string) => {
        if (readOnly) return;
        handleChange(
            'sharedMemories',
            data.sharedMemories.map(m => (m.id === id ? { ...m, [field]: value } : m))
        );
    };

    // =============================================
    // IMPACT STORIES (unchanged logic)
    // =============================================
    const addImpactStory = () => {
        if (readOnly) return;
        const newStory = {
            id: `impact-${Date.now()}`,
            title: '',
            content: '',
            author: ''
        };
        handleChange('impactStories', [...data.impactStories, newStory]);
    };

    const removeImpactStory = (id: string) => {
        if (readOnly) return;
        handleChange('impactStories', data.impactStories.filter(s => s.id !== id));
    };

    const updateImpactStory = (id: string, field: string, value: string) => {
        if (readOnly) return;
        handleChange(
            'impactStories',
            data.impactStories.map(s => (s.id === id ? { ...s, [field]: value } : s))
        );
    };

    // =============================================
    // WITNESS INVITATIONS — NEW LOGIC
    // =============================================
    const addEmail = () => {
        if (readOnly) return;
        const email = newEmail.trim();
        if (email && !data.invitedEmails.includes(email)) {
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                handleChange('invitedEmails', [...data.invitedEmails, email]);
                setNewEmail('');
            } else {
                alert('Please enter a valid email address');
            }
        }
    };

    const removeEmail = (email: string) => {
        if (readOnly) return;
        handleChange('invitedEmails', data.invitedEmails.filter(e => e !== email));
    };

    const handlePersonalMessageChange = (msg: string) => {
        if (readOnly) return;
        setPersonalMessage(msg);
        onUpdate({ ...data, witnessPersonalMessage: msg });
    };

    const handlePreviewEmail = (email: string) => {
        setPreviewRecipient(email);
        setShowPreviewEmail(true);
    };

    const handleSendInvitations = async () => {
        if (readOnly) return;
        if (!isPaid) return; // Safety check
        setSendingError(null);

        try {
            const response = await fetch('/api/send-witness-invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memorialId: memorialId, // Use the prop we added
                    emails: data.invitedEmails,
                    personalMessage,
                    inviterName: "The Family", // We can improve this later with a real name
                    deceasedName: "Your Loved One", // We can pass this from Step 1 later
                }),
            });

            const result = await response.json();
            if (result.error) throw new Error(result.error);

            // Mark emails as sent
            onUpdate({
                ...data,
                sentInvitations: [
                    ...(data.sentInvitations || []),
                    ...data.invitedEmails.map(email => ({
                        email,
                        sentAt: new Date().toISOString(),
                        status: 'sent' as const
                    }))
                ]
            });

            alert(`${data.invitedEmails.length} invitation(s) sent successfully!`);
        } catch (err: any) {
            setSendingError(err.message || 'Failed to send invitations');
        }
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
                {/* OWNER REVIEW QUEUE */}
                {userRole === 'owner' && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-xl text-charcoal flex items-center gap-2">
                                <Shield size={20} className="text-stone" />
                                Witness Contributions
                            </h3>
                            <span className="text-xs bg-stone/10 text-stone px-2 py-1 rounded-full font-medium">
                                {pendingContributions.length} Pending
                            </span>
                        </div>

                        {isFetching ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-stone/40" size={24} />
                            </div>
                        ) : pendingContributions.length === 0 ? (
                            <div className="p-8 border-2 border-dashed border-sand/30 rounded-2xl text-center">
                                <p className="text-sm text-charcoal/40 italic">No new contributions to review.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingContributions.map((item) => (
                                    <div key={item.id} className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${disputingId === item.id ? 'border-stone ring-1 ring-stone' : 'border-stone/10'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="font-medium text-charcoal">{item.content.title}</p>
                                                <p className="text-xs text-charcoal/40">Submitted by {item.witness_name}</p>
                                            </div>

                                            {/* STANDARD ACTIONS */}
                                            {disputingId !== item.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDecision(item, 'approved')}
                                                        className="px-3 py-1.5 bg-mist text-ivory text-xs rounded-lg font-medium hover:bg-mist/90"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setDisputingId(item.id)}
                                                        className="px-3 py-1.5 border border-stone/30 text-stone text-xs rounded-lg font-medium hover:bg-stone/5"
                                                    >
                                                        Flag Conflict
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecision(item, 'rejected')}
                                                        className="px-3 py-1.5 bg-red-50 text-red-600 text-xs rounded-lg font-medium hover:bg-red-100"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                /* CONFLICT RESOLUTION ACTIONS */
                                                <div className="flex flex-col gap-2 items-end">
                                                    <span className="text-[10px] font-bold text-stone uppercase tracking-wider">Mediation Mode</span>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                const note = `[Legacy Vault Note: This account represents a specific perspective on the event.]\n\n${item.content.content}`;
                                                                handleDecision(item, 'approved', note);
                                                            }}
                                                            className="px-3 py-1.5 bg-stone text-ivory text-xs rounded-lg font-medium hover:bg-stone/90"
                                                        >
                                                            Accept with Context Note
                                                        </button>
                                                        <button
                                                            onClick={() => setDisputingId(null)}
                                                            className="px-3 py-1.5 text-charcoal/60 text-xs hover:text-charcoal"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-sm text-charcoal/70 italic line-clamp-3">"{item.content.content}"</p>

                                        {/* Visual indicator of conflict */}
                                        {disputingId === item.id && (
                                            <div className="mt-3 p-3 bg-stone/5 rounded-lg text-xs text-stone border border-stone/20">
                                                <p><strong>Conflict Detected:</strong> Choose "Accept with Context Note" to keep this memory but mark it as a subjective perspective. This preserves the truth without validating disputed facts.</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================= */}
                {/* SHARED MEMORIES — Same as before           */}
                {/* ========================================= */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Heart size={18} className="text-stone" />
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
                                {userRole === 'owner' && (
                                    <button
                                        onClick={() => removeMemory(memory.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-stone hover:bg-stone/10 rounded-lg transition-all"
                                        title="Remove memory"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="pr-8">
                                    <label className="block text-xs text-charcoal/60 mb-1">Memory Title</label>
                                    <input
                                        type="text"
                                        value={memory.title}
                                        onChange={(e) => updateMemory(memory.id, 'title', e.target.value)}
                                        placeholder="e.g., The Day She Changed My Life"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all font-medium disabled:bg-sand/10 disabled:text-charcoal/70"
                                        readOnly={userRole !== 'owner'}
                                        disabled={userRole !== 'owner'}
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
                                            className="w-full pl-12 pr-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:bg-sand/10 disabled:text-charcoal/70"
                                            readOnly={userRole !== 'owner'}
                                            disabled={userRole !== 'owner'}
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
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all resize-none disabled:bg-sand/10 disabled:text-charcoal/70"
                                        readOnly={userRole !== 'owner'}
                                        disabled={userRole !== 'owner'}
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
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:bg-sand/10 disabled:text-charcoal/70"
                                            readOnly={userRole !== 'owner'}
                                            disabled={userRole !== 'owner'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Relationship</label>
                                        <input
                                            type="text"
                                            value={memory.relationship}
                                            onChange={(e) => updateMemory(memory.id, 'relationship', e.target.value)}
                                            placeholder="e.g., Former Student"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:bg-sand/10 disabled:text-charcoal/70"
                                            readOnly={userRole !== 'owner'}
                                            disabled={userRole !== 'owner'}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* WITNESS CONTRIBUTION FORM */}
                        {isAddingNew ? (
                            <div className="p-6 bg-mist/5 border-2 border-dashed border-mist/30 rounded-xl space-y-4 mb-6 animate-fadeIn">
                                <h4 className="font-serif text-lg text-charcoal">Your Contribution</h4>
                                <input
                                    type="text"
                                    placeholder="Memory Title"
                                    value={newMemoryDraft.title}
                                    onChange={(e) => setNewMemoryDraft({ ...newMemoryDraft, title: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:ring-mist outline-none"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={newMemoryDraft.author}
                                        onChange={(e) => setNewMemoryDraft({ ...newMemoryDraft, author: e.target.value })}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:ring-mist outline-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Relationship"
                                        value={newMemoryDraft.relationship}
                                        onChange={(e) => setNewMemoryDraft({ ...newMemoryDraft, relationship: e.target.value })}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:ring-mist outline-none"
                                    />
                                </div>
                                <textarea
                                    placeholder="Share your story..."
                                    rows={4}
                                    value={newMemoryDraft.content}
                                    onChange={(e) => setNewMemoryDraft({ ...newMemoryDraft, content: e.target.value })}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:ring-mist resize-none outline-none"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleWitnessSubmit}
                                        className="flex-1 py-3 bg-mist text-ivory rounded-xl font-medium hover:bg-mist/90 transition-all"
                                    >
                                        Submit for Approval
                                    </button>
                                    <button
                                        onClick={() => setIsAddingNew(false)}
                                        className="px-6 py-3 border border-sand/40 text-charcoal/60 rounded-xl hover:bg-sand/5 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAddingNew(true)}
                                className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-mist hover:bg-mist/5 hover:text-mist transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                {userRole === 'owner' ? 'Add Shared Memory' : 'Submit a Memory'}
                            </button>
                        )}
                    </div>
                </div>

                {/* ========================================= */}
                {/* IMPACT STORIES — Same as before            */}
                {/* ========================================= */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Star size={18} className="text-mist" />
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
                                {!readOnly && (
                                    <button
                                        onClick={() => removeImpactStory(story.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-stone hover:bg-stone/10 rounded-lg transition-all"
                                        title="Remove story"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}

                                <div className="pr-8">
                                    <label className="block text-xs text-charcoal/60 mb-1">Story Title</label>
                                    <input
                                        type="text"
                                        value={story.title}
                                        onChange={(e) => updateImpactStory(story.id, 'title', e.target.value)}
                                        placeholder="e.g., The Teacher Who Saved My Life"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all font-medium disabled:bg-sand/10 disabled:text-charcoal/70"
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">The Story</label>
                                    <textarea
                                        value={story.content}
                                        onChange={(e) => updateImpactStory(story.id, 'content', e.target.value)}
                                        placeholder="Tell the story of how they made a difference..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all resize-none disabled:bg-sand/10 disabled:text-charcoal/70"
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">Author & Relationship</label>
                                    <input
                                        type="text"
                                        value={story.author}
                                        onChange={(e) => updateImpactStory(story.id, 'author', e.target.value)}
                                        placeholder="e.g., David Chen, Former Student (Class of 2003)"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:bg-sand/10 disabled:text-charcoal/70"
                                        readOnly={readOnly}
                                        disabled={readOnly}
                                    />
                                </div>
                            </div>
                        ))}

                        {!readOnly && (
                            <button
                                onClick={addImpactStory}
                                className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-mist hover:bg-mist/5 hover:text-mist transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add Impact Story
                            </button>
                        )}
                    </div>

                    <div className="mt-4 p-3 bg-stone/5 rounded-lg border border-stone/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: "She inspired me to become a teacher", "He helped me through the hardest time", "They believed in me when no one else did"
                        </p>
                    </div>
                </div>

                {/* ========================================= */}
                {/* WITNESS INVITATIONS — NEW: Step 1.1.2     */}
                {/* Full UI visible, sending gated by payment */}
                {/* ========================================= */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="flex items-center gap-2 text-sm font-medium text-charcoal">
                            <Users size={18} className="text-stone" />
                            Invite Witnesses to Contribute
                        </label>
                        {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-mist/10 text-mist rounded-full text-xs font-medium">
                                <Send size={12} />
                                Ready to Send
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sand/20 text-charcoal/50 rounded-full text-xs font-medium">
                                <Lock size={12} />
                                Sending unlocked after payment
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-charcoal/40 mb-6">
                        Invite family and friends to share their memories directly. You can prepare everything now
                        {!isPaid && ' — invitations will be sent once you activate your archive'}.
                    </p>

                    {/* Witness invitation card */}
                    <div className={`p-6 rounded-2xl border-2 transition-all ${isPaid
                        ? 'bg-white border-mist/30'
                        : 'bg-gradient-to-br from-mist/5 to-stone/5 border-sand/30'
                        }`}>

                        {/* Pre-payment info banner */}
                        {!isPaid && (
                            <div className="mb-6 p-4 bg-white/80 rounded-xl border border-mist/20 flex items-start gap-3">
                                <div className="w-10 h-10 bg-mist/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Eye size={18} className="text-mist" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-charcoal mb-1">
                                        Preview Mode — Prepare Your Invitations
                                    </p>
                                    <p className="text-xs text-charcoal/60 leading-relaxed">
                                        Add email addresses and write your personal message now. Everything will be saved.
                                        Once you activate your archive, you'll be able to send all invitations with one click.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Personal message for witnesses */}
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-charcoal/70 mb-2">
                                Personal Message (included in every invitation)
                            </label>
                            <textarea
                                value={personalMessage}
                                onChange={(e) => handlePersonalMessageChange(e.target.value)}
                                placeholder="Write a personal note to your witnesses. Example: 'Dear friend, I'm creating a memorial archive for Mom. Your memories of her would mean the world to our family. Any story, photo, or moment you remember would help preserve her legacy...'"
                                rows={4}
                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all resize-none text-sm disabled:bg-sand/10 disabled:text-charcoal/70"
                                readOnly={readOnly}
                                disabled={readOnly}
                            />
                            <p className="text-xs text-charcoal/40 mt-1">
                                {personalMessage.length}/500 characters
                            </p>
                        </div>

                        {/* Email list */}
                        <div className="mb-6">
                            <label className="block text-xs font-medium text-charcoal/70 mb-2">
                                Witness Email Addresses
                            </label>

                            {data.invitedEmails.length > 0 && (
                                <div className="mb-4 space-y-2">
                                    {data.invitedEmails.map((email, idx) => {
                                        const wasSent = data.sentInvitations?.some(inv => inv.email === email);
                                        return (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-3 bg-white rounded-lg border border-sand/30"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Mail size={16} className={wasSent ? 'text-mist' : 'text-charcoal/30'} />
                                                    <span className="text-sm text-charcoal">{email}</span>
                                                    {wasSent && (
                                                        <span className="text-xs bg-mist/10 text-mist px-2 py-0.5 rounded-full">
                                                            Sent
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {!readOnly && !wasSent && (
                                                        <button
                                                            onClick={() => handlePreviewEmail(email)}
                                                            className="p-1.5 hover:bg-mist/10 rounded-lg transition-all"
                                                            title="Preview invitation"
                                                        >
                                                            <Eye size={14} className="text-mist" />
                                                        </button>
                                                    )}
                                                    {!readOnly && (
                                                        <button
                                                            onClick={() => removeEmail(email)}
                                                            className="p-1.5 hover:bg-sand/20 rounded-lg transition-all"
                                                        >
                                                            <X size={14} className="text-charcoal/40" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                                    placeholder="friend@example.com"
                                    className="flex-1 px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-mist/30 focus:border-mist transition-all disabled:bg-sand/10 disabled:text-charcoal/70"
                                    readOnly={readOnly}
                                    disabled={readOnly}
                                />
                                {!readOnly && (
                                    <button
                                        onClick={addEmail}
                                        className="px-6 py-3 bg-mist hover:bg-mist/90 text-ivory rounded-xl transition-all flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Add
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Send button — gated by payment */}
                        {data.invitedEmails.length > 0 && (
                            <div className="pt-4 border-t border-sand/20">
                                {sendingError && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                        {sendingError}
                                    </div>
                                )}

                                {isPaid ? (
                                    <button
                                        onClick={handleSendInvitations}
                                        className="w-full py-4 bg-gradient-to-r from-mist to-mist/90 hover:shadow-lg text-ivory rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                    >
                                        <Send size={18} />
                                        Send {data.invitedEmails.filter(e => !data.sentInvitations?.some(s => s.email === e)).length} Invitation(s)
                                    </button>
                                ) : (
                                    <div className="relative">
                                        <button
                                            disabled
                                            className="w-full py-4 bg-sand/30 text-charcoal/40 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            <Lock size={18} />
                                            Send {data.invitedEmails.length} Invitation(s)
                                        </button>
                                        <p className="text-center text-xs text-charcoal/50 mt-3 flex items-center justify-center gap-1.5">
                                            <Shield size={12} />
                                            Invitations will be sent once you activate your archive
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ========================================= */}
            {/* EMAIL PREVIEW MODAL                       */}
            {/* ========================================= */}
            {showPreviewEmail && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
                        {/* Modal header */}
                        <div className="p-6 border-b border-sand/20 flex items-center justify-between">
                            <div>
                                <h3 className="font-serif text-xl text-charcoal">Invitation Preview</h3>
                                <p className="text-xs text-charcoal/50 mt-1">This is what {previewRecipient} will receive</p>
                            </div>
                            <button
                                onClick={() => setShowPreviewEmail(false)}
                                className="p-2 hover:bg-sand/10 rounded-lg transition-all"
                            >
                                <X size={20} className="text-charcoal/40" />
                            </button>
                        </div>

                        {/* Email preview */}
                        <div className="p-6">
                            <div className="bg-gradient-to-br from-ivory to-sand/10 border-2 border-sand/20 rounded-xl p-8 font-serif">
                                {/* Email header */}
                                <div className="text-center mb-6 pb-6 border-b border-sand/20">
                                    <div className="w-12 h-12 bg-mist/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Shield size={24} className="text-mist" />
                                    </div>
                                    <p className="text-xs text-charcoal/40 uppercase tracking-widest">Legacy Vault</p>
                                    <p className="text-xs text-charcoal/40">Memorial Witness Invitation</p>
                                </div>

                                {/* Email body */}
                                <div className="space-y-4 text-sm text-charcoal/80 leading-relaxed">
                                    <p>
                                        <strong className="text-charcoal">You have been entrusted with a portion of memory.</strong>
                                    </p>
                                    <p>
                                        This is not a request for photos. It is an invitation to bear witness.
                                    </p>
                                    {personalMessage && (
                                        <div className="pl-4 border-l-2 border-mist/30 italic text-charcoal/70">
                                            "{personalMessage}"
                                        </div>
                                    )}
                                    <p>
                                        Your contribution will become part of the permanent historical archives.
                                    </p>

                                    {/* CTA button preview */}
                                    <div className="text-center pt-4">
                                        <div className="inline-block px-8 py-3 bg-mist text-ivory rounded-xl font-medium text-sm">
                                            Accept & Bear Witness
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal footer */}
                        <div className="p-6 bg-sand/5 border-t border-sand/20">
                            <button
                                onClick={() => setShowPreviewEmail(false)}
                                className="w-full py-3 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all text-sm font-medium text-charcoal"
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

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