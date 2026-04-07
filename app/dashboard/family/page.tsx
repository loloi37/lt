'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Users, Sparkles, Network, ShieldCheck } from 'lucide-react';

export default function FamilyHubPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.loading) return;
    if (auth.plan === 'family' || auth.plan === 'concierge') {
      router.replace(`/dashboard/family/${auth.user!.id}`);
    }
  }, [auth.loading, auth.plan, auth.user, router]);

  if (auth.plan === 'family' || auth.plan === 'concierge') return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="glass-card p-10 text-center">
        <div className="w-16 h-16 rounded-full bg-olive/15 flex items-center justify-center mx-auto mb-6">
          <Users className="w-8 h-8 text-olive" />
        </div>
        <h1 className="font-serif text-3xl text-warm-dark mb-3">
          Bring your family into the archive
        </h1>
        <p className="text-warm-muted mb-8 max-w-xl mx-auto">
          The Family plan lets you invite loved ones, share stories together,
          assign roles like Co-Guardian or Witness, and weave a living family
          tree across memorials.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
          <Feature icon={Sparkles} title="Invite members" desc="Co-Guardians, Witnesses, Viewers." />
          <Feature icon={Network} title="Family tree" desc="Connect memorials across generations." />
          <Feature icon={ShieldCheck} title="Shared stewardship" desc="Multiple guardians, one legacy." />
        </div>

        <Link
          href="/choice-pricing?plan=family"
          className="glass-btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl"
        >
          Upgrade to Family
        </Link>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Users; title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface-mid/40 border border-warm-border/30">
      <Icon className="w-5 h-5 text-olive mb-2" />
      <p className="font-medium text-warm-dark text-sm">{title}</p>
      <p className="text-xs text-warm-muted mt-1">{desc}</p>
    </div>
  );
}
