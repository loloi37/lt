'use client';

import { useState } from 'react';
import { Users, Heart, Mail, Plus, Trash2, Send, Check } from 'lucide-react';
import type { NetworkData } from '@/types/memorial';

interface NetworkCollectionProps {
  data: NetworkData;
  onChange: (data: NetworkData) => void;
  memorialId: string | null;
  deceasedName: string;
  inviterName: string;
}

type Tab = 'family' | 'contributors';

export default function NetworkCollection({
  data,
  onChange,
  memorialId,
  deceasedName,
  inviterName,
}: NetworkCollectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('family');
  const [newEmail, setNewEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const addPartner = () => {
    onChange({
      ...data,
      partners: [
        ...data.partners,
        { id: crypto.randomUUID(), name: '', relationshipType: 'spouse', yearsFrom: '', yearsTo: '', description: '', photo: null, photoPreview: null },
      ],
    });
  };

  const addChild = () => {
    onChange({
      ...data,
      children: [
        ...data.children,
        { id: crypto.randomUUID(), name: '', birthYear: '', description: '' },
      ],
    });
  };

  const addEmail = () => {
    if (!newEmail || !newEmail.includes('@')) return;
    if (data.invitedEmails.includes(newEmail)) return;
    onChange({ ...data, invitedEmails: [...data.invitedEmails, newEmail] });
    setNewEmail('');
  };

  const sendInvitations = async () => {
    if (!memorialId || data.invitedEmails.length === 0) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const res = await fetch('/api/send-witness-invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorialId,
          inviterName,
          emails: data.invitedEmails.filter(e => !data.sentInvitations.some(s => s.email === e)),
          personalMessage: data.contributorPersonalMessage,
          deceasedName,
        }),
      });

      const result = await res.json();
      if (result.success) {
        const newInvitations = data.invitedEmails
          .filter(e => !data.sentInvitations.some(s => s.email === e))
          .map(email => ({
            email,
            sentAt: new Date().toISOString(),
            status: 'sent' as const,
          }));

        onChange({
          ...data,
          sentInvitations: [...data.sentInvitations, ...newInvitations],
        });
        setSendResult(`${result.dispatched} invitation(s) sent`);
      }
    } catch {
      setSendResult('Failed to send. Please try again.');
    }

    setIsSending(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab navigation */}
      <div className="flex gap-2 mb-10">
        <button
          onClick={() => setActiveTab('family')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'family' ? 'bg-charcoal text-ivory' : 'bg-sand/10 text-charcoal/50 hover:bg-sand/20'
          }`}
        >
          <Heart size={14} /> Family
        </button>
        <button
          onClick={() => setActiveTab('contributors')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            activeTab === 'contributors' ? 'bg-charcoal text-ivory' : 'bg-sand/10 text-charcoal/50 hover:bg-sand/20'
          }`}
        >
          <Users size={14} /> Contributors
        </button>
      </div>

      {/* Family Tab */}
      {activeTab === 'family' && (
        <div className="space-y-10">
          {/* Partners */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-charcoal/40 uppercase tracking-wider">Partners</label>
              <button onClick={addPartner} className="text-xs text-charcoal/40 hover:text-charcoal/60 flex items-center gap-1">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {data.partners.map((partner, i) => (
                <div key={partner.id} className="p-4 border border-sand/20 rounded-lg space-y-3">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={partner.name}
                      onChange={(e) => {
                        const u = [...data.partners];
                        u[i] = { ...partner, name: e.target.value };
                        onChange({ ...data, partners: u });
                      }}
                      className="flex-1 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                      placeholder="Name"
                    />
                    <select
                      value={partner.relationshipType}
                      onChange={(e) => {
                        const u = [...data.partners];
                        u[i] = { ...partner, relationshipType: e.target.value };
                        onChange({ ...data, partners: u });
                      }}
                      className="px-3 py-2 border border-sand/30 rounded bg-white text-charcoal text-sm focus:outline-none"
                    >
                      <option value="spouse">Spouse</option>
                      <option value="partner">Partner</option>
                      <option value="significant_other">Significant Other</option>
                    </select>
                    <button onClick={() => onChange({ ...data, partners: data.partners.filter((_, j) => j !== i) })} className="text-charcoal/20 hover:text-charcoal/40">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <textarea
                    value={partner.description}
                    onChange={(e) => {
                      const u = [...data.partners];
                      u[i] = { ...partner, description: e.target.value };
                      onChange({ ...data, partners: u });
                    }}
                    className="w-full px-3 py-2 border border-sand/30 rounded bg-white text-charcoal text-sm focus:outline-none resize-none"
                    rows={2}
                    placeholder="Their story together..."
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Children */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs text-charcoal/40 uppercase tracking-wider">Children</label>
              <button onClick={addChild} className="text-xs text-charcoal/40 hover:text-charcoal/60 flex items-center gap-1">
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="space-y-3">
              {data.children.map((child, i) => (
                <div key={child.id} className="p-4 border border-sand/20 rounded-lg flex gap-3">
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => {
                      const u = [...data.children];
                      u[i] = { ...child, name: e.target.value };
                      onChange({ ...data, children: u });
                    }}
                    className="flex-1 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={child.birthYear}
                    onChange={(e) => {
                      const u = [...data.children];
                      u[i] = { ...child, birthYear: e.target.value };
                      onChange({ ...data, children: u });
                    }}
                    className="w-24 px-3 py-2 border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                    placeholder="Born"
                  />
                  <button onClick={() => onChange({ ...data, children: data.children.filter((_, j) => j !== i) })} className="text-charcoal/20 hover:text-charcoal/40">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Memories display */}
          {data.sharedMemories.length > 0 && (
            <div>
              <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-4">Shared Memories</label>
              <div className="space-y-3">
                {data.sharedMemories.map((memory) => (
                  <div key={memory.id} className="p-4 border border-sand/20 rounded-lg bg-ivory/50">
                    <p className="text-sm text-charcoal font-medium">{memory.title}</p>
                    <p className="text-xs text-charcoal/50 mt-1">{memory.content}</p>
                    <p className="text-xs text-charcoal/30 mt-2">— {memory.author} ({memory.relationship})</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contributors Tab */}
      {activeTab === 'contributors' && (
        <div className="space-y-8">
          <div>
            <p className="text-sm text-charcoal/50 mb-6 leading-relaxed">
              Invite family and friends to share their memories, stories, and photos.
              Their contributions will be reviewed by you before being added to the memorial.
            </p>
          </div>

          {/* Personal message */}
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Personal Message (optional)</label>
            <textarea
              value={data.contributorPersonalMessage}
              onChange={(e) => onChange({ ...data, contributorPersonalMessage: e.target.value })}
              className="w-full px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none resize-none"
              rows={3}
              placeholder="Add a personal note to include in the invitation email..."
            />
          </div>

          {/* Add emails */}
          <div>
            <label className="block text-xs text-charcoal/40 uppercase tracking-wider mb-2">Invite by Email</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEmail()}
                className="flex-1 px-4 py-3 border border-sand/30 rounded-lg bg-white text-charcoal focus:outline-none focus:border-charcoal/30"
                placeholder="friend@example.com"
              />
              <button
                onClick={addEmail}
                className="px-4 py-3 bg-charcoal text-ivory rounded-lg hover:bg-charcoal/90 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Email list */}
          {data.invitedEmails.length > 0 && (
            <div className="space-y-2">
              {data.invitedEmails.map((email) => {
                const sent = data.sentInvitations.find(s => s.email === email);
                return (
                  <div key={email} className="flex items-center justify-between p-3 border border-sand/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-charcoal/30" />
                      <span className="text-sm text-charcoal">{email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {sent ? (
                        <span className="text-xs text-sage flex items-center gap-1">
                          <Check size={12} /> Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => onChange({ ...data, invitedEmails: data.invitedEmails.filter(e => e !== email) })}
                          className="text-charcoal/20 hover:text-charcoal/40"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Send button */}
          {data.invitedEmails.some(e => !data.sentInvitations.some(s => s.email === e)) && (
            <button
              onClick={sendInvitations}
              disabled={isSending}
              className="w-full py-3 bg-charcoal text-ivory rounded-lg font-medium hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={16} />
                  Send Invitations
                </>
              )}
            </button>
          )}

          {sendResult && (
            <p className="text-sm text-center text-charcoal/50">{sendResult}</p>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs text-charcoal/20">Your work is saved automatically.</p>
      </div>
    </div>
  );
}
