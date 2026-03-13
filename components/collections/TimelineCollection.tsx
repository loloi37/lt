'use client';

import { useState } from 'react';
import { Calendar, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { TimelineData } from '@/types/memorial';

interface TimelineCollectionProps {
  data: TimelineData;
  onChange: (data: TimelineData) => void;
}

const EVENT_CATEGORIES = [
  { value: 'birth', label: 'Birth' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'career', label: 'Career' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'loss', label: 'Loss' },
  { value: 'milestone', label: 'Milestone' },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  birth: 'bg-sage/20 text-sage',
  marriage: 'bg-terracotta/20 text-terracotta',
  career: 'bg-mist/20 text-mist',
  achievement: 'bg-lavender/20 text-lavender',
  loss: 'bg-stone/20 text-stone',
  milestone: 'bg-charcoal/10 text-charcoal/60',
};

export default function TimelineCollection({ data, onChange }: TimelineCollectionProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  // Sort events by year
  const sortedEvents = [...data.majorLifeEvents].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearA - yearB;
  });

  const addEvent = () => {
    onChange({
      ...data,
      majorLifeEvents: [
        ...data.majorLifeEvents,
        {
          id: crypto.randomUUID(),
          year: '',
          title: '',
          category: 'milestone',
          description: '',
        },
      ],
    });
  };

  const updateEvent = (id: string, updates: Partial<TimelineData['majorLifeEvents'][0]>) => {
    onChange({
      ...data,
      majorLifeEvents: data.majorLifeEvents.map(e =>
        e.id === id ? { ...e, ...updates } : e
      ),
    });
  };

  const removeEvent = (id: string) => {
    onChange({
      ...data,
      majorLifeEvents: data.majorLifeEvents.filter(e => e.id !== id),
    });
  };

  const addChapter = () => {
    const newId = crypto.randomUUID();
    onChange({
      ...data,
      lifeChapters: [
        ...data.lifeChapters,
        {
          id: newId,
          period: '',
          ageRange: '',
          title: '',
          description: '',
          keyEvents: [],
        },
      ],
    });
    setExpandedChapter(newId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Life Events Timeline */}
      <div className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl text-charcoal">Life Events</h3>
            <p className="text-xs text-charcoal/30 mt-1">Key moments that shaped their life</p>
          </div>
          <button
            onClick={addEvent}
            className="px-3 py-1.5 text-xs bg-charcoal text-ivory rounded-lg flex items-center gap-1 hover:bg-charcoal/90 transition-colors"
          >
            <Plus size={12} /> Add Event
          </button>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Timeline line */}
          {sortedEvents.length > 0 && (
            <div className="absolute left-6 top-0 bottom-0 w-px bg-sand/30" />
          )}

          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <div key={event.id} className="relative flex gap-4 pl-2">
                {/* Timeline dot */}
                <div className={`w-3 h-3 rounded-full mt-4 flex-shrink-0 z-10 ${
                  CATEGORY_COLORS[event.category]?.split(' ')[0] || 'bg-sand/30'
                }`} />

                {/* Event card */}
                <div className="flex-1 p-4 border border-sand/20 rounded-lg bg-white group">
                  <div className="flex items-start gap-3">
                    <input
                      type="text"
                      value={event.year}
                      onChange={(e) => updateEvent(event.id, { year: e.target.value })}
                      className="w-20 px-2 py-1 text-sm font-medium text-charcoal border border-sand/30 rounded bg-white focus:outline-none focus:border-charcoal/30"
                      placeholder="Year"
                    />

                    <select
                      value={event.category}
                      onChange={(e) => updateEvent(event.id, { category: e.target.value as any })}
                      className={`px-2 py-1 text-xs rounded border-none focus:outline-none ${
                        CATEGORY_COLORS[event.category] || 'bg-sand/10'
                      }`}
                    >
                      {EVENT_CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeEvent(event.id)}
                      className="ml-auto opacity-0 group-hover:opacity-100 text-charcoal/20 hover:text-charcoal/40 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                    className="w-full mt-2 px-0 py-1 text-sm font-medium text-charcoal bg-transparent border-none focus:outline-none"
                    placeholder="What happened"
                  />

                  <textarea
                    value={event.description}
                    onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                    className="w-full mt-1 px-0 py-1 text-xs text-charcoal/50 bg-transparent border-none focus:outline-none resize-none"
                    rows={2}
                    placeholder="Tell the story behind this moment..."
                  />
                </div>
              </div>
            ))}
          </div>

          {sortedEvents.length === 0 && (
            <div className="text-center py-16">
              <Calendar size={48} className="mx-auto text-charcoal/10 mb-4" />
              <p className="text-sm text-charcoal/30">No events yet. Add the moments that mattered most.</p>
            </div>
          )}
        </div>
      </div>

      {/* Life Chapters */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-serif text-xl text-charcoal">Life Chapters</h3>
            <p className="text-xs text-charcoal/30 mt-1">The eras and seasons of their life</p>
          </div>
          <button
            onClick={addChapter}
            className="px-3 py-1.5 text-xs bg-charcoal text-ivory rounded-lg flex items-center gap-1 hover:bg-charcoal/90 transition-colors"
          >
            <Plus size={12} /> Add Chapter
          </button>
        </div>

        <div className="space-y-3">
          {data.lifeChapters.map((chapter) => (
            <div key={chapter.id} className="border border-sand/20 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-sand/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-charcoal/30 font-medium">{chapter.period || 'Period'}</span>
                  <span className="text-sm text-charcoal font-medium">{chapter.title || 'Untitled chapter'}</span>
                </div>
                {expandedChapter === chapter.id ? <ChevronUp size={16} className="text-charcoal/30" /> : <ChevronDown size={16} className="text-charcoal/30" />}
              </button>

              {expandedChapter === chapter.id && (
                <div className="p-4 pt-0 space-y-3 border-t border-sand/10">
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={chapter.period}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          lifeChapters: data.lifeChapters.map(c =>
                            c.id === chapter.id ? { ...c, period: e.target.value } : c
                          ),
                        });
                      }}
                      className="px-3 py-2 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                      placeholder="e.g., 1950s"
                    />
                    <input
                      type="text"
                      value={chapter.ageRange}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          lifeChapters: data.lifeChapters.map(c =>
                            c.id === chapter.id ? { ...c, ageRange: e.target.value } : c
                          ),
                        });
                      }}
                      className="px-3 py-2 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                      placeholder="e.g., 20-30"
                    />
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => {
                        onChange({
                          ...data,
                          lifeChapters: data.lifeChapters.map(c =>
                            c.id === chapter.id ? { ...c, title: e.target.value } : c
                          ),
                        });
                      }}
                      className="px-3 py-2 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                      placeholder="Chapter title"
                    />
                  </div>
                  <textarea
                    value={chapter.description}
                    onChange={(e) => {
                      onChange({
                        ...data,
                        lifeChapters: data.lifeChapters.map(c =>
                          c.id === chapter.id ? { ...c, description: e.target.value } : c
                        ),
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none resize-none"
                    rows={4}
                    placeholder="What defined this era of their life..."
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        onChange({
                          ...data,
                          lifeChapters: data.lifeChapters.filter(c => c.id !== chapter.id),
                        });
                      }}
                      className="text-xs text-charcoal/30 hover:text-charcoal/50 flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove chapter
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-charcoal/20">Your work is saved automatically.</p>
      </div>
    </div>
  );
}
