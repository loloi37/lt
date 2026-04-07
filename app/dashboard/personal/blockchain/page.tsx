'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck, Image as ImageIcon, Video, Mic, BookOpen, Baby, FileText, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase, type Memorial } from '@/lib/supabase';
import { calculateMemorialSize, formatBytes, FIFTY_GB, type SizeBreakdown } from '@/lib/blockchain/sizeCalculator';
import { preserveOnPolygon } from '@/lib/polygon/polygonService';

export default function BlockchainPage() {
  const { user, loading } = useAuth();
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('memorials')
        .select('*')
        .eq('user_id', user.id)
        .neq('deleted', true);
      if (data) setMemorials(data as Memorial[]);
    })();
  }, [user]);

  const selected = memorials.find((m) => m.id === selectedId) || null;
  const breakdown: SizeBreakdown | null = selected ? calculateMemorialSize(selected) : null;
  const overLimit = breakdown ? breakdown.totalBytes > FIFTY_GB : false;
  const pct = breakdown ? Math.min(100, (breakdown.totalBytes / FIFTY_GB) * 100) : 0;

  const handlePreserve = async () => {
    if (!selected || !user || !breakdown || overLimit) return;
    setBusy(true);
    try {
      await preserveOnPolygon({
        memorialId: selected.id,
        userId: user.id,
        totalBytes: breakdown.totalBytes,
      });
      toast.success('Preservation request submitted to Polygon.');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Preservation failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-8 text-warm-muted">Loading…</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-olive" size={32} />
          <h1 className="text-3xl font-serif text-warm-dark">Personal — Blockchain Preservation</h1>
        </div>
        <p className="text-warm-muted mt-2">
          Encrypt a memorial to the Polygon blockchain. Up to 50&nbsp;GB of media per memorial.
        </p>
      </header>

      <div className="glass-card rounded-2xl p-6 mb-8">
        <label className="block text-sm font-medium text-warm-dark mb-3">Choose a memorial</label>
        <select
          value={selectedId || ''}
          onChange={(e) => setSelectedId(e.target.value || null)}
          className="w-full px-4 py-3 rounded-xl border border-warm-border/40 bg-white"
        >
          <option value="">— Select —</option>
          {memorials.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name || 'Untitled memorial'} ({m.mode})
            </option>
          ))}
        </select>
      </div>

      {selected && breakdown && (
        <>
          <div className="glass-card rounded-2xl p-6 mb-6">
            <h2 className="font-serif text-xl text-warm-dark mb-5">Preservation summary</h2>

            <Row icon={<FileText size={18} />} label="Text & stories" bytes={breakdown.textBytes} />
            <Row
              icon={<ImageIcon size={18} />}
              label={`Photo Gallery (${breakdown.counts.galleryPhotos})`}
              bytes={breakdown.photoGalleryBytes}
            />
            <Row
              icon={<Video size={18} />}
              label={`Video Memories (${breakdown.counts.videos})`}
              bytes={breakdown.videoBytes}
            />
            <Row
              icon={<BookOpen size={18} />}
              label={`Interactive Photo Stories (${breakdown.counts.interactiveStories})`}
              bytes={breakdown.interactiveStoryBytes}
            />
            <Row
              icon={<Baby size={18} />}
              label={`Childhood Photos (${breakdown.counts.childhoodPhotos})`}
              bytes={breakdown.childhoodPhotoBytes}
            />
            <Row
              icon={<Mic size={18} />}
              label={`Voice Recordings (${breakdown.counts.voiceRecordings})`}
              bytes={breakdown.voiceRecordingBytes}
            />

            <div className="border-t border-warm-border/40 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-warm-muted">
                <span>Profile Photo</span>
                <span className="text-olive font-medium">Included free</span>
              </div>
              <div className="flex justify-between text-sm text-warm-muted">
                <span>Cover Photo</span>
                <span className="text-olive font-medium">Included free</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-warm-dark">
                  Total: {formatBytes(breakdown.totalBytes)} / 50 GB
                </span>
                <span className={overLimit ? 'text-red-600 font-medium' : 'text-warm-muted'}>
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-warm-border/30 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${overLimit ? 'bg-red-500' : 'bg-olive'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {overLimit && (
              <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <span>
                  This memorial exceeds the 50 GB on-chain limit. Remove some media or split into
                  multiple preservations.
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handlePreserve}
            disabled={overLimit || busy}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-olive text-white font-medium hover:bg-olive/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {busy ? 'Submitting…' : 'Encrypt to Polygon'}
          </button>
        </>
      )}
    </div>
  );
}

function Row({ icon, label, bytes }: { icon: React.ReactNode; label: string; bytes: number }) {
  return (
    <div className="flex items-center justify-between py-2 text-sm">
      <span className="flex items-center gap-2 text-warm-dark">
        <span className="text-olive">{icon}</span>
        {label}
      </span>
      <span className="text-warm-muted">{formatBytes(bytes)}</span>
    </div>
  );
}
