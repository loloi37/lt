'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

const PLAN_LABELS: Record<string, string> = {
  none: 'No plan',
  draft: 'Draft (free)',
  personal: 'Personal',
  family: 'Family',
  concierge: 'Concierge',
};

export default function BillingSettingsPage() {
  const auth = useAuth();
  const paidArchives = auth.archives.filter(a => a.paid);

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <h2 className="font-serif text-xl text-warm-dark mb-1">Current plan</h2>
        <p className="text-3xl font-serif text-olive mb-4">{PLAN_LABELS[auth.plan] || 'Unknown'}</p>
        {auth.plan !== 'family' && auth.plan !== 'concierge' && (
          <Link
            href="/choice-pricing"
            className="glass-btn-primary inline-flex px-5 py-2 rounded-xl text-sm"
          >
            Upgrade plan
          </Link>
        )}
      </div>

      <div className="glass-card p-8">
        <h2 className="font-serif text-xl text-warm-dark mb-4">Payment history</h2>
        {paidArchives.length === 0 ? (
          <p className="text-sm text-warm-muted italic">No payments yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-warm-muted border-b border-warm-border/30">
                <th className="py-2">Memorial</th>
                <th className="py-2">Plan</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {paidArchives.map(a => (
                <tr key={a.id} className="border-b border-warm-border/20">
                  <td className="py-3 text-warm-dark">{a.fullName || '—'}</td>
                  <td className="py-3 capitalize">{a.mode}</td>
                  <td className="py-3 text-warm-muted">
                    {a.paymentConfirmedAt
                      ? new Date(a.paymentConfirmedAt).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
