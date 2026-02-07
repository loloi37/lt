// components/wizard/Step4Relationships.tsx
'use client';

import { useRef } from 'react';
import { Heart, Users, Calendar, Plus, X, Trash2, Upload } from 'lucide-react';
import { RelationshipsFamily } from '@/types/memorial';

interface Step4Props {
    data: RelationshipsFamily;
    onUpdate: (data: RelationshipsFamily) => void;
    onNext: () => void;
    onBack: () => void;
}

const EVENT_CATEGORIES = [
    { value: 'marriage', label: 'Marriage', color: 'bg-pink-100 text-pink-700' },
    { value: 'birth', label: 'Birth', color: 'bg-blue-100 text-blue-700' },
    { value: 'career', label: 'Career', color: 'bg-purple-100 text-purple-700' },
    { value: 'achievement', label: 'Achievement', color: 'bg-green-100 text-green-700' },
    { value: 'loss', label: 'Loss', color: 'bg-gray-100 text-gray-700' },
    { value: 'milestone', label: 'Milestone', color: 'bg-amber-100 text-amber-700' },
] as const;

export default function Step4Relationships({ data, onUpdate, onNext, onBack }: Step4Props) {
    const partnerPhotoRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    const handleChange = (field: keyof RelationshipsFamily, value: any) => {
        onUpdate({ ...data, [field]: value });
    };

    // Partners Management
    const addPartner = () => {
        const newPartner = {
            id: `partner-${Date.now()}`,
            name: '',
            relationshipType: '',
            yearsFrom: '',
            yearsTo: '',
            description: '',
            photo: null,
            photoPreview: null,
        };
        handleChange('partners', [...data.partners, newPartner]);
    };

    const removePartner = (id: string) => {
        handleChange('partners', data.partners.filter(p => p.id !== id));
    };

    const updatePartner = (id: string, field: string, value: any) => {
        handleChange(
            'partners',
            data.partners.map(p => (p.id === id ? { ...p, [field]: value } : p))
        );
    };

    const handlePartnerPhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updatePartner(id, 'photo', file);
                updatePartner(id, 'photoPreview', reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePartnerPhoto = (id: string) => {
        updatePartner(id, 'photo', null);
        updatePartner(id, 'photoPreview', null);
        if (partnerPhotoRefs.current[id]) {
            partnerPhotoRefs.current[id]!.value = '';
        }
    };

    // Children Management
    const addChild = () => {
        const newChild = {
            id: `child-${Date.now()}`,
            name: '',
            birthYear: '',
            description: '',
        };
        handleChange('children', [...data.children, newChild]);
    };

    const removeChild = (id: string) => {
        handleChange('children', data.children.filter(c => c.id !== id));
    };

    const updateChild = (id: string, field: string, value: string) => {
        handleChange(
            'children',
            data.children.map(c => (c.id === id ? { ...c, [field]: value } : c))
        );
    };

    // Life Events Management
    const addLifeEvent = () => {
        const newEvent = {
            id: `event-${Date.now()}`,
            year: '',
            title: '',
            category: 'milestone' as const,
            description: '',
        };
        handleChange('majorLifeEvents', [...data.majorLifeEvents, newEvent]);
    };

    const removeLifeEvent = (id: string) => {
        handleChange('majorLifeEvents', data.majorLifeEvents.filter(e => e.id !== id));
    };

    const updateLifeEvent = (id: string, field: string, value: any) => {
        handleChange(
            'majorLifeEvents',
            data.majorLifeEvents.map(e => (e.id === id ? { ...e, [field]: value } : e))
        );
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="mb-12">
                <h2 className="font-serif text-4xl text-charcoal mb-3">
                    Relationships & Family
                </h2>
                <p className="text-charcoal/60 text-lg">
                    Tell us about the important people in their life and major life events.
                </p>
            </div>

            <div className="space-y-10">
                {/* Life Partners/Spouses */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Heart size={18} className="text-terracotta" />
                        Life Partners / Spouses
                    </label>

                    <div className="space-y-4">
                        {data.partners.map((partner) => (
                            <div
                                key={partner.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                            >
                                {/* Remove button */}
                                <button
                                    onClick={() => removePartner(partner.id)}
                                    className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                    title="Remove"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="flex gap-4">
                                    {/* Photo upload */}
                                    <div className="flex-shrink-0">
                                        {!partner.photoPreview ? (
                                            <div
                                                onClick={() => partnerPhotoRefs.current[partner.id]?.click()}
                                                className="w-24 h-24 border-2 border-dashed border-sand/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all"
                                            >
                                                <Upload size={20} className="text-charcoal/40 mb-1" />
                                                <span className="text-xs text-charcoal/40">Photo</span>
                                            </div>
                                        ) : (
                                            <div className="relative w-24 h-24">
                                                <img
                                                    src={partner.photoPreview}
                                                    alt={partner.name}
                                                    className="w-full h-full object-cover rounded-xl border-2 border-sand/30"
                                                />
                                                <button
                                                    onClick={() => removePartnerPhoto(partner.id)}
                                                    className="absolute -top-2 -right-2 p-1 bg-charcoal rounded-full"
                                                >
                                                    <X size={12} className="text-ivory" />
                                                </button>
                                            </div>
                                        )}
                                        <input
                                            ref={(el) => { partnerPhotoRefs.current[partner.id] = el; }}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handlePartnerPhotoUpload(partner.id, e)}
                                            className="hidden"
                                        />
                                    </div>

                                    {/* Form fields */}
                                    <div className="flex-1 space-y-3 pr-8">
                                        <input
                                            type="text"
                                            value={partner.name}
                                            onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
                                            placeholder="Name (e.g., James Thompson)"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                        />

                                        <input
                                            type="text"
                                            value={partner.relationshipType}
                                            onChange={(e) => updatePartner(partner.id, 'relationshipType', e.target.value)}
                                            placeholder="Relationship (e.g., Spouse, Partner, Husband, Wife)"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">Together From</label>
                                        <input
                                            type="text"
                                            value={partner.yearsFrom}
                                            onChange={(e) => updatePartner(partner.id, 'yearsFrom', e.target.value)}
                                            placeholder="e.g., 1966"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-1">To</label>
                                        <input
                                            type="text"
                                            value={partner.yearsTo}
                                            onChange={(e) => updatePartner(partner.id, 'yearsTo', e.target.value)}
                                            placeholder="e.g., 2018 or 'Present'"
                                            className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                        />
                                    </div>
                                </div>

                                <textarea
                                    value={partner.description}
                                    onChange={(e) => updatePartner(partner.id, 'description', e.target.value)}
                                    placeholder="Brief description of their relationship..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                />
                            </div>
                        ))}

                        <button
                            onClick={addPartner}
                            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Partner/Spouse
                        </button>
                    </div>
                </div>

                {/* Children */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Users size={18} className="text-sage" />
                        Children
                    </label>

                    <div className="space-y-4">
                        {data.children.map((child) => (
                            <div
                                key={child.id}
                                className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                            >
                                {/* Remove button */}
                                <button
                                    onClick={() => removeChild(child.id)}
                                    className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                    title="Remove"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="pr-8">
                                    <input
                                        type="text"
                                        value={child.name}
                                        onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                                        placeholder="Name (e.g., Michael James Thompson)"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-charcoal/60 mb-1">Birth Year</label>
                                    <input
                                        type="text"
                                        value={child.birthYear}
                                        onChange={(e) => updateChild(child.id, 'birthYear', e.target.value)}
                                        placeholder="e.g., 1968"
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all"
                                    />
                                </div>

                                <textarea
                                    value={child.description}
                                    onChange={(e) => updateChild(child.id, 'description', e.target.value)}
                                    placeholder="Brief description (e.g., Civil rights attorney in Atlanta)"
                                    rows={2}
                                    className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                />
                            </div>
                        ))}

                        <button
                            onClick={addChild}
                            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Child
                        </button>
                    </div>
                </div>

                {/* Major Life Events */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
                        <Calendar size={18} className="text-terracotta" />
                        Major Life Events Timeline
                    </label>
                    <p className="text-xs text-charcoal/40 mb-4">
                        Add significant moments and turning points throughout their life
                    </p>

                    <div className="space-y-4">
                        {data.majorLifeEvents
                            .sort((a, b) => (a.year || '').localeCompare(b.year || ''))
                            .map((event) => (
                                <div
                                    key={event.id}
                                    className="p-6 bg-white border border-sand/40 rounded-xl space-y-4 relative"
                                >
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeLifeEvent(event.id)}
                                        className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                        title="Remove"
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    <div className="flex gap-4 pr-8">
                                        <div className="w-24">
                                            <label className="block text-xs text-charcoal/60 mb-1">Year</label>
                                            <input
                                                type="text"
                                                value={event.year}
                                                onChange={(e) => updateLifeEvent(event.id, 'year', e.target.value)}
                                                placeholder="1968"
                                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-center font-medium"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <label className="block text-xs text-charcoal/60 mb-1">Event Title</label>
                                            <input
                                                type="text"
                                                value={event.title}
                                                onChange={(e) => updateLifeEvent(event.id, 'title', e.target.value)}
                                                placeholder="e.g., Married James Thompson"
                                                className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-charcoal/60 mb-2">Category</label>
                                        <div className="flex flex-wrap gap-2">
                                            {EVENT_CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat.value}
                                                    onClick={() => updateLifeEvent(event.id, 'category', cat.value)}
                                                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${event.category === cat.value
                                                        ? cat.color
                                                        : 'bg-sand/20 text-charcoal/60 hover:bg-sand/30'
                                                        }`}
                                                >
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <textarea
                                        value={event.description}
                                        onChange={(e) => updateLifeEvent(event.id, 'description', e.target.value)}
                                        placeholder="Brief description of what happened..."
                                        rows={2}
                                        className="w-full px-4 py-3 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none"
                                    />
                                </div>
                            ))}

                        <button
                            onClick={addLifeEvent}
                            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                        >
                            <Plus size={18} />
                            Add Life Event
                        </button>
                    </div>

                    <div className="mt-3 p-3 bg-terracotta/5 rounded-lg border border-terracotta/20">
                        <p className="text-xs text-charcoal/60">
                            💡 Examples: Marriage, births, graduations, career milestones, moves, awards, losses
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