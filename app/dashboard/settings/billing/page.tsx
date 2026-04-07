'use client';

import { useAuth } from '@/components/providers/AuthProvider';

export default function BillingSettings() {
  const { plan, hasPaid, archives, loading } = useAuth();
  if (loading) return <div className="text-warm-muted">Loading…</div>;

  const paid = archives.filter((a) => a.paid);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <div className="text-xs uppercase tracking-wide text-warm-muted">Current plan</div>
        <div className="text-2xl font-serif text-warm-dark capitalize mt-1">{plan}</div>
        <div className="text-sm text-warm-muted mt-1">
          {hasPaid ? 'One-time lifetime preservation' : 'No active plan yet'}
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-lg text-warm-dark mb-4">Payment history</h3>
        {paid.length === 0 ? (
          <p className="text-sm text-warm-muted">No payments yet.</p>
        ) : (
          <ul className="divide-y divide-warm-border/30">
            {paid.map((a) => (
              <li key={a.id} className="py-3 flex justify-between text-sm">
                <span className="text-warm-dark">
                  {a.fullName || 'Memorial'} — <span className="capitalize">{a.mode}</span>
                </span>
                <span className="text-warm-muted">
                  {a.paymentConfirmedAt
                    ? new Date(a.paymentConfirmedAt).toLocaleDateString()
                    : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
