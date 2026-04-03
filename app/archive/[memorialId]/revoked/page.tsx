import Link from 'next/link';
import { ShieldX } from 'lucide-react';

export default async function RevokedPage({
  params,
}: {
  params: Promise<{ memorialId: string }>;
}) {
  await params;

  return (
    <div className="min-h-screen bg-surface-low flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-full bg-warm-border/20 border border-warm-border/30 flex items-center justify-center mx-auto mb-6">
          <ShieldX size={34} className="text-warm-dark/40" />
        </div>
        <h1 className="font-serif text-3xl text-warm-dark mb-3">Access removed</h1>
        <p className="text-warm-dark/55 leading-relaxed mb-8">
          Your access to this archive is no longer active. If you believe this changed by mistake, contact the archive owner for a new invitation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-5 py-3 glass-btn-dark rounded-xl text-sm font-medium"
          >
            Go to dashboard
          </Link>
          <Link
            href="/"
            className="px-5 py-3 border border-warm-border/40 rounded-xl text-sm text-warm-dark/60 hover:bg-warm-border/10 transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
