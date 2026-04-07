'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/dashboard/settings/profile', label: 'Profile' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
  { href: '/dashboard/settings/security', label: 'Security' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-serif text-warm-dark">Settings</h1>
        <p className="text-warm-muted mt-2">Manage your account.</p>
      </header>
      <nav className="flex gap-1 border-b border-warm-border/40 mb-8">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition ${
                active
                  ? 'border-olive text-olive'
                  : 'border-transparent text-warm-muted hover:text-warm-dark'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>
      {children}
    </div>
  );
}
