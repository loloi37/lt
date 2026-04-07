'use client';

import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const MODE_BADGE: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-800',
  personal: 'bg-olive/15 text-olive',
  family: 'bg-blue-100 text-blue-800',
  concierge: 'bg-purple-100 text-purple-800',
};

export default function ArchivesPage() {
  const { archives, loading, user } = useAuth();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="flex items-end justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif text-warm-dark">My Archives</h1>
          <p className="text-warm-muted mt-2">Every memorial you have created, in one place.</p>
        </div>
        <Link
          href="/choice-pricing"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-olive text-white text-sm font-medium hover:bg-olive/90 transition"
        >
          <Plus size={16} /> New memorial
        </Link>
      </header>

      {loading ? (
        <div className="text-warm-muted">Loading…</div>
      ) : archives.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-warm-border/50 rounded-2xl">
          <p className="text-warm-muted mb-4">You have not created a memorial yet.</p>
          <Link href="/choice-pricing" className="text-olive font-medium underline">
            Begin your first memorial
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {archives.map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/${a.mode}/${user?.id}`}
              className="group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="aspect-[4/3] bg-warm-border/30 relative overflow-hidden">
                {a.profilePhotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.profilePhotoUrl}
                    alt={a.fullName || 'Memorial'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-warm-muted text-sm">
                    No cover photo
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-medium capitalize ${MODE_BADGE[a.mode] || ''}`}
                >
                  {a.mode}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg text-warm-dark truncate">
                  {a.fullName || 'Untitled memorial'}
                </h3>
                <div className="flex items-center justify-between mt-3 text-sm">
                  <span className="text-warm-muted">{a.paid ? 'Preserved' : 'Draft'}</span>
                  <span className="inline-flex items-center gap-1 text-olive font-medium">
                    Open <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
