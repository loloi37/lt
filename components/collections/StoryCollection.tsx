'use client';

import { useState } from 'react';
import { BookOpen, User, Briefcase, Sparkles, Plus, Trash2 } from 'lucide-react';
import type { StoryData } from '@/types/memorial';

interface StoryCollectionProps {
  data: StoryData;
  onChange: (data: StoryData) => void;
}

type Section = 'identity' | 'biography' | 'childhood' | 'career' | 'values';

const SECTIONS: { key: Section; label: string; icon: any }[] = [
  { key: 'identity', label: 'Who They Were', icon: User },
  { key: 'biography', label: 'Their Story', icon: BookOpen },
  { key: 'childhood', label: 'Early Life', icon: Sparkles },
  { key: 'career', label: 'Life\'s Work', icon: Briefcase },
  { key: 'values', label: 'What They Believed', icon: Sparkles },
];

export default function StoryCollection({ data, onChange }: StoryCollectionProps) {
  const [activeSection, setActiveSection] = useState<Section>('identity');

  const update = <K extends keyof StoryData>(key: K, value: StoryData[K]) => {
    onChange({ ...data, [key]: value });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Section navigation — subtle, not numbered */}
      <div className="flex flex-wrap gap-2 mb-10">
        {SECTIONS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeSection === key
                ? 'bg-charcoal text-ivory'
                : 'bg-sand/10 text-charcoal/50 hover:bg-sand/20'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Identity Section */}
      {activeSection === 'identity' && (
        <div className="space-y-8">
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal font-serif text-xl focus:outline-none focus:border-charcoal/30"
              placeholder="Their full name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Born</label>
              <input
                type="date"
                value={data.birthDate}
                onChange={(e) => update('birthDate', e.target.value)}
                className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              />
            </div>
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">
                {data.isStillLiving ? 'Still living' : 'Passed'}
              </label>
              {!data.isStillLiving ? (
                <input
                  type="date"
                  value={data.deathDate || ''}
                  onChange={(e) => update('deathDate', e.target.value)}
                  className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                />
              ) : (
                <div className="px-4 py-3 text-charcoal/40 italic">Living</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="selfArchive"
              checked={data.isSelfArchive || false}
              onChange={(e) => update('isSelfArchive', e.target.checked)}
              className="w-4 h-4 rounded border-sand/30"
            />
            <label htmlFor="selfArchive" className="text-sm text-charcoal/60">
              I am creating this for myself
            </label>
          </div>

          {data.isSelfArchive && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="privateUntilDeath"
                checked={data.privateUntilDeath || false}
                onChange={(e) => update('privateUntilDeath', e.target.checked)}
                className="w-4 h-4 rounded border-sand/30"
              />
              <label htmlFor="privateUntilDeath" className="text-sm text-charcoal/60">
                Keep private until my passing
              </label>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Birthplace</label>
              <input
                type="text"
                value={data.birthPlace}
                onChange={(e) => update('birthPlace', e.target.value)}
                className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Resting Place</label>
              <input
                type="text"
                value={data.deathPlace}
                onChange={(e) => update('deathPlace', e.target.value)}
                className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Epitaph</label>
            <textarea
              value={data.epitaph}
              onChange={(e) => update('epitaph', e.target.value)}
              className="w-full px-4 py-4 border border-sand/30 rounded-lg bg-white text-charcoal font-serif text-lg focus:outline-none focus:border-charcoal/30 resize-none"
              rows={3}
              placeholder="A few words that capture who they were..."
            />
          </div>
        </div>
      )}

      {/* Biography Section */}
      {activeSection === 'biography' && (
        <div className="space-y-8">
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Biography</label>
            <p className="text-xs text-charcoal/30 mb-3">Write freely. There are no word limits or required fields.</p>
            <textarea
              value={data.biography}
              onChange={(e) => update('biography', e.target.value)}
              className="w-full px-6 py-5 border border-sand/30 rounded-lg bg-white text-charcoal font-serif text-base leading-relaxed focus:outline-none focus:border-charcoal/30 resize-none min-h-[400px]"
              placeholder="Tell their story in your own words..."
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Legacy Statement</label>
            <textarea
              value={data.legacyStatement}
              onChange={(e) => update('legacyStatement', e.target.value)}
              className="w-full px-6 py-4 border border-sand/30 rounded-lg bg-white text-charcoal font-serif focus:outline-none focus:border-charcoal/30 resize-none"
              rows={4}
              placeholder="What they left behind. How the world is different because they lived..."
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Life Philosophy</label>
            <textarea
              value={data.lifePhilosophy}
              onChange={(e) => update('lifePhilosophy', e.target.value)}
              className="w-full px-6 py-4 border border-sand/30 rounded-lg bg-white text-charcoal font-serif focus:outline-none focus:border-charcoal/30 resize-none"
              rows={3}
              placeholder="What they believed about life, meaning, and purpose..."
            />
          </div>
        </div>
      )}

      {/* Childhood Section */}
      {activeSection === 'childhood' && (
        <div className="space-y-8">
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Childhood Home</label>
            <input
              type="text"
              value={data.childhoodHome}
              onChange={(e) => update('childhoodHome', e.target.value)}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Where they grew up"
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Family Background</label>
            <textarea
              value={data.familyBackground}
              onChange={(e) => update('familyBackground', e.target.value)}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal font-serif focus:outline-none focus:border-charcoal/30 resize-none"
              rows={4}
              placeholder="Their family, upbringing, and roots..."
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Education</label>
            <div className="grid grid-cols-2 gap-4">
              {(['elementary', 'highSchool', 'college', 'additionalEducation'] as const).map((school) => (
                <input
                  key={school}
                  type="text"
                  value={data.schools[school]}
                  onChange={(e) => update('schools', { ...data.schools, [school]: e.target.value })}
                  className="px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                  placeholder={school === 'additionalEducation' ? 'Other education' : school.replace(/([A-Z])/g, ' $1').trim()}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Early Interests</label>
            <p className="text-xs text-charcoal/30 mb-2">What they loved as a child</p>
            <input
              type="text"
              value={data.earlyInterests.join(', ')}
              onChange={(e) => update('earlyInterests', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Reading, sports, music... (comma separated)"
            />
          </div>
        </div>
      )}

      {/* Career Section */}
      {activeSection === 'career' && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-charcoal/40 uppercase tracking-wider">Occupations</label>
              <button
                onClick={() => update('occupations', [...data.occupations, { id: crypto.randomUUID(), title: '', company: '', yearsFrom: '', yearsTo: '', description: '' }])}
                className="text-xs text-charcoal/40 hover:text-charcoal/60 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-4">
              {data.occupations.map((occ, i) => (
                <div key={occ.id} className="p-4 border border-sand/20 rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={occ.title}
                      onChange={(e) => {
                        const updated = [...data.occupations];
                        updated[i] = { ...occ, title: e.target.value };
                        update('occupations', updated);
                      }}
                      className="flex-1 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={occ.company}
                      onChange={(e) => {
                        const updated = [...data.occupations];
                        updated[i] = { ...occ, company: e.target.value };
                        update('occupations', updated);
                      }}
                      className="flex-1 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                      placeholder="Company / Organization"
                    />
                    <button
                      onClick={() => update('occupations', data.occupations.filter((_, j) => j !== i))}
                      className="text-charcoal/20 hover:text-charcoal/40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <input type="text" value={occ.yearsFrom} onChange={(e) => { const u = [...data.occupations]; u[i] = { ...occ, yearsFrom: e.target.value }; update('occupations', u); }} className="w-24 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none" placeholder="From" />
                    <input type="text" value={occ.yearsTo} onChange={(e) => { const u = [...data.occupations]; u[i] = { ...occ, yearsTo: e.target.value }; update('occupations', u); }} className="w-24 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none" placeholder="To" />
                  </div>
                  <textarea
                    value={occ.description}
                    onChange={(e) => { const u = [...data.occupations]; u[i] = { ...occ, description: e.target.value }; update('occupations', u); }}
                    className="w-full px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none resize-none"
                    rows={2}
                    placeholder="What this role meant to them..."
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Career Highlights</label>
            <input
              type="text"
              value={data.careerHighlights.join(', ')}
              onChange={(e) => update('careerHighlights', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Awards, achievements, milestones... (comma separated)"
            />
          </div>
        </div>
      )}

      {/* Values Section */}
      {activeSection === 'values' && (
        <div className="space-y-8">
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Personality Traits</label>
            <input
              type="text"
              value={data.personalityTraits.join(', ')}
              onChange={(e) => update('personalityTraits', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Kind, stubborn, funny, generous... (comma separated)"
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Core Values</label>
            <input
              type="text"
              value={data.coreValues.join(', ')}
              onChange={(e) => update('coreValues', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Family, honesty, faith, education... (comma separated)"
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Passions</label>
            <input
              type="text"
              value={data.passions.join(', ')}
              onChange={(e) => update('passions', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Gardening, cooking, music... (comma separated)"
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Memorable Sayings</label>
            <input
              type="text"
              value={data.memorableSayings.join(', ')}
              onChange={(e) => update('memorableSayings', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
              placeholder="Things they always said... (comma separated)"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-charcoal/40 uppercase tracking-wider">Favorite Quotes</label>
              <button
                onClick={() => update('favoriteQuotes', [...data.favoriteQuotes, { id: crypto.randomUUID(), text: '', context: '' }])}
                className="text-xs text-charcoal/40 hover:text-charcoal/60 flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
            {data.favoriteQuotes.map((q, i) => (
              <div key={q.id} className="flex gap-3 mb-3">
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => { const u = [...data.favoriteQuotes]; u[i] = { ...q, text: e.target.value }; update('favoriteQuotes', u); }}
                  className="flex-1 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal font-serif italic focus:outline-none"
                  placeholder="The quote"
                />
                <input
                  type="text"
                  value={q.context}
                  onChange={(e) => { const u = [...data.favoriteQuotes]; u[i] = { ...q, context: e.target.value }; update('favoriteQuotes', u); }}
                  className="w-40 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal text-sm focus:outline-none"
                  placeholder="Source"
                />
                <button onClick={() => update('favoriteQuotes', data.favoriteQuotes.filter((_, j) => j !== i))} className="text-charcoal/20 hover:text-charcoal/40">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Silent save note */}
      <div className="mt-12 text-center">
        <p className="text-xs text-charcoal/20">Your work is saved automatically.</p>
      </div>
    </div>
  );
}
