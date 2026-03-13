'use client';

import { useState } from 'react';
import { Mail, Calendar, Plus, Send, Check, Trash2 } from 'lucide-react';
import type { LetterData } from '@/types/memorial';

interface LetterToFutureProps {
  letters: LetterData[];
  onChange: (letters: LetterData[]) => void;
  memorialId: string | null;
}

export default function LetterToFuture({ letters, onChange, memorialId }: LetterToFutureProps) {
  const [isWriting, setIsWriting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState({
    message: '',
    recipientEmail: '',
    recipientName: '',
    deliveryDate: '',
  });

  const saveLetter = async () => {
    if (!memorialId || !draft.message || !draft.recipientEmail || !draft.deliveryDate) return;

    setIsSaving(true);

    try {
      const res = await fetch('/api/letters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorialId,
          ...draft,
        }),
      });

      const result = await res.json();
      if (result.success) {
        onChange([
          ...letters,
          {
            id: result.letter.id,
            message: draft.message,
            recipientEmail: draft.recipientEmail,
            recipientName: draft.recipientName,
            deliveryDate: draft.deliveryDate,
            createdAt: new Date().toISOString(),
            status: 'scheduled',
          },
        ]);
        setDraft({ message: '', recipientEmail: '', recipientName: '', deliveryDate: '' });
        setIsWriting(false);
      }
    } catch {
      // Silent fail — user can retry
    }

    setIsSaving(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h3 className="font-serif text-2xl text-charcoal mb-2">Letters to the Future</h3>
        <p className="text-sm text-charcoal/40 leading-relaxed">
          Write a message to someone you love. Choose when it will be delivered —
          a birthday, an anniversary, a graduation. Some words are meant to arrive at just the right moment.
        </p>
      </div>

      {/* Existing letters */}
      {letters.length > 0 && (
        <div className="space-y-3 mb-8">
          {letters.map((letter) => (
            <div key={letter.id} className="p-4 border border-sand/20 rounded-lg bg-ivory/30">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-charcoal">
                    To: {letter.recipientName || letter.recipientEmail}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar size={12} className="text-charcoal/30" />
                    <span className="text-xs text-charcoal/40">
                      Delivers: {new Date(letter.deliveryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-sage/10 text-sage flex items-center gap-1">
                  <Check size={10} /> Scheduled
                </span>
              </div>
              <p className="text-xs text-charcoal/40 mt-3 line-clamp-2 italic">
                &ldquo;{letter.message.substring(0, 150)}{letter.message.length > 150 ? '...' : ''}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Write new letter */}
      {isWriting ? (
        <div className="border border-sand/30 rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-1">Recipient Name</label>
              <input
                type="text"
                value={draft.recipientName}
                onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })}
                className="w-full px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                placeholder="Their name"
              />
            </div>
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-1">Recipient Email</label>
              <input
                type="email"
                value={draft.recipientEmail}
                onChange={(e) => setDraft({ ...draft, recipientEmail: e.target.value })}
                className="w-full px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                placeholder="their@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-1">Deliver On</label>
            <input
              type="date"
              value={draft.deliveryDate}
              onChange={(e) => setDraft({ ...draft, deliveryDate: e.target.value })}
              min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-1">Your Message</label>
            <textarea
              value={draft.message}
              onChange={(e) => setDraft({ ...draft, message: e.target.value })}
              className="w-full px-4 py-4 border border-sand/30 rounded-lg bg-white text-charcoal font-serif leading-relaxed focus:outline-none resize-none"
              rows={8}
              placeholder="Write your message here. Take your time. These words will wait..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveLetter}
              disabled={isSaving || !draft.message || !draft.recipientEmail || !draft.deliveryDate}
              className="flex-1 py-3 bg-charcoal text-ivory rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-charcoal/90 transition-colors disabled:opacity-40"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Schedule This Letter
                </>
              )}
            </button>
            <button
              onClick={() => setIsWriting(false)}
              className="px-4 py-3 border border-sand/30 rounded-lg text-charcoal/50 hover:bg-sand/5 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsWriting(true)}
          className="w-full py-4 border-2 border-dashed border-sand/30 rounded-xl text-charcoal/40 hover:border-charcoal/20 hover:text-charcoal/60 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} />
          Write a Letter to the Future
        </button>
      )}
    </div>
  );
}
