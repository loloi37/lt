'use client';

import { useAuth } from '@/components/providers/AuthProvider';

export default function ProfileSettings() {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-warm-muted">Loading…</div>;

  return (
    <div className="glass-card rounded-2xl p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-warm-dark mb-2">Email</label>
        <input
          type="email"
          defaultValue={user?.email || ''}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-warm-border/40 bg-surface-low text-warm-dark"
        />
        <p className="text-xs text-warm-muted mt-1">
          Contact support to change your account email.
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-warm-dark mb-2">Display name</label>
        <input
          type="text"
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border border-warm-border/40 bg-white"
        />
      </div>
      <button className="px-5 py-3 rounded-xl bg-olive text-white text-sm font-medium hover:bg-olive/90">
        Save changes
      </button>
    </div>
  );
}
