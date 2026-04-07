'use client';

import Link from 'next/link';
import { Users, GitBranch, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

export default function FamilyHubPage() {
  const { plan, user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-warm-muted">Loading…</div>;
  }

  const hasFamily = plan === 'family' || plan === 'concierge';

  if (hasFamily && user) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-serif text-warm-dark">Family</h1>
          <p className="text-warm-muted mt-2">Invite loved ones, share stories, weave the tree.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href={`/dashboard/family/${user.id}`}
            className="glass-card p-6 rounded-2xl hover:shadow-xl transition"
          >
            <Users className="text-olive mb-3" />
            <h3 className="font-serif text-lg text-warm-dark">Members & permissions</h3>
            <p className="text-sm text-warm-muted mt-1">
              Co-Guardians, Witnesses, Viewers — manage who can see and contribute.
            </p>
            <span className="inline-flex items-center gap-1 text-olive text-sm mt-4">
              Open <ArrowRight size={14} />
            </span>
          </Link>
          <Link
            href={`/dashboard/family/${user.id}/tree`}
            className="glass-card p-6 rounded-2xl hover:shadow-xl transition"
          >
            <GitBranch className="text-olive mb-3" />
            <h3 className="font-serif text-lg text-warm-dark">Family tree</h3>
            <p className="text-sm text-warm-muted mt-1">
              See how every memorial is connected, generation by generation.
            </p>
            <span className="inline-flex items-center gap-1 text-olive text-sm mt-4">
              View tree <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Upgrade gate
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="glass-card rounded-2xl p-10 text-center">
        <Shield className="text-olive mx-auto mb-4" size={40} />
        <h1 className="text-3xl font-serif text-warm-dark">Bring your family in</h1>
        <p className="text-warm-muted mt-3 max-w-xl mx-auto">
          The Family plan lets you invite loved ones as Co-Guardians, Witnesses, or Viewers, link
          memorials into a shared family tree, and preserve stories together.
        </p>
        <ul className="text-left max-w-md mx-auto mt-6 space-y-2 text-sm text-warm-dark/80">
          <li>• Unlimited memorials</li>
          <li>• Visual family tree</li>
          <li>• Co-guardian roles & permissions</li>
          <li>• Family steward succession</li>
        </ul>
        <Link
          href="/choice-pricing"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-olive text-white text-sm font-medium hover:bg-olive/90 transition"
        >
          Upgrade to Family <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
