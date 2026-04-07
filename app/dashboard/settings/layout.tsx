'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard/settings/profile', label: 'Profile' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
  { href: '/dashboard/settings/security', label: 'Security' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-warm-dark mb-2">Settings</h1>
      <p className="text-warm-muted mb-6">Manage your account.</p>

      <div className="flex gap-2 border-b border-warm-border/30 mb-8">
        {TABS.map(t => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active
                  ? 'border-olive text-olive'
                  : 'border-transparent text-warm-muted hover:text-warm-dark'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      {children}
    </div>
  );
}
