'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/components/providers/AuthProvider';

export default function ProfileSettingsPage() {
  const auth = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.user) return;
    setEmail(auth.user.email);
    const supabase = createClient();
    supabase
      .from('users')
      .select('full_name')
      .eq('id', auth.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.full_name) setFullName(data.full_name);
      });
  }, [auth.user]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!auth.user) return;
    setSaving(true);
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', auth.user.id);
    setSaving(false);
    setMessage(error ? `Error: ${error.message}` : 'Saved.');
  }

  return (
    <form onSubmit={save} className="glass-card p-8 space-y-5">
      <h2 className="font-serif text-xl text-warm-dark">Profile</h2>

      <div>
        <label className="block text-sm font-medium text-warm-dark mb-1">Full name</label>
        <input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="glass-input w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-warm-dark mb-1">Email</label>
        <input type="email" value={email} disabled className="glass-input w-full opacity-60" />
        <p className="text-xs text-warm-muted mt-1">
          To change your email, contact support.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="glass-btn-primary px-5 py-2 rounded-xl text-sm disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {message && <span className="text-sm text-warm-muted">{message}</span>}
      </div>
    </form>
  );
}
