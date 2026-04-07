'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { Plus, FileText, Heart, Users } from 'lucide-react';

export default function MyArchivesPage() {
  const auth = useAuth();
  const archives = auth.archives || [];

  const groups = {
    draft: archives.filter(a => !a.paid),
    personal: archives.filter(a => a.paid && a.mode === 'personal'),
    family: archives.filter(a => a.paid && (a.mode === 'family' || a.mode === 'concierge')),
  };

  const Section = ({
    title,
    icon: Icon,
    items,
    emptyText,
  }: {
    title: string;
    icon: typeof FileText;
    items: typeof archives;
    emptyText: string;
  }) => (
    <section className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-olive" />
        <h2 className="font-serif text-lg text-warm-dark">{title}</h2>
        <span className="text-xs text-warm-muted">({items.length})</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-warm-muted italic">{emptyText}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(a => {
            const target =
              a.mode === 'family' || a.mode === 'concierge'
                ? `/dashboard/family/${auth.user!.id}`
                : a.paid
                ? `/dashboard/personal/${auth.user!.id}`
                : `/dashboard/draft/${auth.user!.id}`;
            return (
              <Link
                key={a.id}
                href={target}
                className="glass-card p-5 hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4">
                  {a.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.profilePhotoUrl}
                      alt={a.fullName || ''}
                      className="w-14 h-14 rounded-full object-cover border border-warm-border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-warm-border/30 flex items-center justify-center text-warm-muted">
                      <Heart className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-warm-dark truncate">
                      {a.fullName || 'Untitled memorial'}
                    </p>
                    <p className="text-xs text-warm-muted mt-1 capitalize">
                      {a.paid ? a.mode : 'draft'}
                    </p>
                    <p className="text-[11px] text-warm-muted mt-1">
                      Updated {new Date(a.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-warm-dark">My Archives</h1>
          <p className="text-warm-muted mt-1">
            All the memorials you have created.
          </p>
        </div>
        <Link
          href="/wizard"
          className="glass-btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm"
        >
          <Plus className="w-4 h-4" /> New memorial
        </Link>
      </div>

      <Section title="Drafts" icon={FileText} items={groups.draft} emptyText="No drafts in progress." />
      <Section title="Personal" icon={Heart} items={groups.personal} emptyText="No personal memorials yet." />
      <Section title="Family" icon={Users} items={groups.family} emptyText="No family memorials yet." />
    </div>
  );
}
