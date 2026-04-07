'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Archive, Users, Settings, ShieldCheck } from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'My Archives', icon: Archive, match: (p: string) => p === '/dashboard' },
  { href: '/dashboard/family', label: 'Family', icon: Users, match: (p: string) => p.startsWith('/dashboard/family') },
  { href: '/dashboard/personal', label: 'Personal', icon: ShieldCheck, match: (p: string) => p === '/dashboard/personal' || p.startsWith('/dashboard/personal?') },
  { href: '/dashboard/settings/profile', label: 'Settings', icon: Settings, match: (p: string) => p.startsWith('/dashboard/settings') },
];

export default function DashboardNav() {
  const pathname = usePathname() || '';

  return (
    <nav className="flex md:flex-col gap-1 md:gap-2 p-2 md:p-4">
      {NAV.map(({ href, label, icon: Icon, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
              active
                ? 'bg-olive/15 text-olive shadow-sm'
                : 'text-warm-muted hover:bg-warm-border/20 hover:text-warm-dark'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
