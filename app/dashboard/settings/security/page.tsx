'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import toast from 'react-hot-toast';

export default function SecuritySettings() {
  const [pwd, setPwd] = useState('');
  const [busy, setBusy] = useState(false);

  const updatePassword = async () => {
    if (pwd.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      toast.success('Password updated.');
      setPwd('');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to update password');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-lg text-warm-dark mb-4">Change password</h3>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 rounded-xl border border-warm-border/40 bg-white"
        />
        <button
          onClick={updatePassword}
          disabled={busy}
          className="mt-4 px-5 py-3 rounded-xl bg-olive text-white text-sm font-medium hover:bg-olive/90 disabled:opacity-50"
        >
          {busy ? 'Updating…' : 'Update password'}
        </button>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-serif text-lg text-warm-dark mb-2">Two-factor authentication</h3>
        <p className="text-sm text-warm-muted">
          Add an extra layer of security to your account. Coming soon.
        </p>
      </div>
    </div>
  );
}
