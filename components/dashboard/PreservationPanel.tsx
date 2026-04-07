'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const MAX_BYTES = 50 * 1024 * 1024 * 1024; // 50 GB

export interface PreservationMemorial {
  id: string;
  fullName: string | null;
  profilePhotoUrl: string | null;
  preservationState: string | null;
  contentSizeBytes: number;
  counts: {
    photos: number;
    videos: number;
    interactiveStories: number;
    childhoodPhotos: number;
    voiceRecordings: number;
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export default function PreservationPanel({ memorial }: { memorial: PreservationMemorial }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [state, setState] = useState(memorial.preservationState || 'draft');

  const pct = Math.min(100, (memorial.contentSizeBytes / MAX_BYTES) * 100);
  const overLimit = memorial.contentSizeBytes > MAX_BYTES;
  const alreadyPreserved = state === 'preserved' || state === 'preserving';

  async function preserve() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch('/api/preservation/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memorialId: memorial.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setState('preserving');
      setMessage('Preservation initiated. Encryption in progress.');
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-4 mb-5">
        {memorial.profilePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memorial.profilePhotoUrl}
            alt=""
            className="w-14 h-14 rounded-full object-cover border border-warm-border"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-warm-border/30" />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-lg text-warm-dark">
            {memorial.fullName || 'Untitled memorial'}
          </h3>
          <p className="text-xs text-warm-muted capitalize">State: {state}</p>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-warm-muted mb-1">
          <span>{formatBytes(memorial.contentSizeBytes)} encrypted</span>
          <span>50 GB cap</span>
        </div>
        <div className="w-full h-2 bg-warm-border/30 rounded-full overflow-hidden">
          <div
            className={`h-full ${overLimit ? 'bg-red-500' : 'bg-olive'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-5">
        <Stat label="Photos" value={memorial.counts.photos} />
        <Stat label="Videos" value={memorial.counts.videos} />
        <Stat label="Interactive stories" value={memorial.counts.interactiveStories} />
        <Stat label="Childhood photos" value={memorial.counts.childhoodPhotos} />
        <Stat label="Voice recordings" value={memorial.counts.voiceRecordings} />
      </div>

      <p className="text-[11px] text-warm-muted mb-4 leading-relaxed">
        Profile and cover photos are stored on-chain at no extra cost. All other
        media and stories are encrypted before being written to the Polygon
        blockchain.
      </p>

      <button
        onClick={preserve}
        disabled={busy || overLimit || alreadyPreserved}
        className="glass-btn-primary w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm disabled:opacity-50"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
        {alreadyPreserved
          ? 'Already preserved'
          : overLimit
          ? 'Over 50 GB limit'
          : 'Preserve on Polygon'}
      </button>

      {message && <p className="text-xs text-warm-muted mt-3">{message}</p>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between p-2 rounded-lg bg-surface-mid/40">
      <span className="text-warm-muted">{label}</span>
      <span className="text-warm-dark font-medium">{value}</span>
    </div>
  );
}
