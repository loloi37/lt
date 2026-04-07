'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';
import { KeyRound, ShieldCheck, LifeBuoy } from 'lucide-react';

export default function SecuritySettingsPage() {
  const auth = useAuth();
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function sendPasswordReset() {
    if (!auth.user) return;
    setSending(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(auth.user.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSending(false);
    setMessage(error ? `Error: ${error.message}` : 'Password reset email sent.');
  }

  return (
    <div className="space-y-6">
      <div className="glass-card p-8">
        <div className="flex items-start gap-4">
          <KeyRound className="w-6 h-6 text-olive mt-1" />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-warm-dark">Password</h2>
            <p className="text-sm text-warm-muted mb-4">
              We will email you a secure link to set a new password.
            </p>
            <button
              onClick={sendPasswordReset}
              disabled={sending}
              className="glass-btn-primary px-5 py-2 rounded-xl text-sm disabled:opacity-50"
            >
              {sending ? 'Sending…' : 'Send reset link'}
            </button>
            {message && <p className="text-sm text-warm-muted mt-3">{message}</p>}
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-olive mt-1" />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-warm-dark">Two-factor authentication</h2>
            <p className="text-sm text-warm-muted">
              Coming soon — add an extra layer of protection to your account.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <div className="flex items-start gap-4">
          <LifeBuoy className="w-6 h-6 text-olive mt-1" />
          <div className="flex-1">
            <h2 className="font-serif text-lg text-warm-dark">Recovery contacts</h2>
            <p className="text-sm text-warm-muted">
              Designate trusted people who can help recover your archive if needed.
              Manage them from your archive&apos;s stewardship settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
