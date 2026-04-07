'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Archive, Users, Settings, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const NAV = [
  { href: '/dashboard/archives', label: 'My Archives', icon: Archive },
  { href: '/dashboard/family', label: 'Family', icon: Users },
  { href: '/dashboard/personal/blockchain', label: 'Personal', icon: ShieldCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { plan } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-warm-border/40 bg-surface-low/60 backdrop-blur-xl min-h-screen p-6 hidden md:flex flex-col">
      <Link href="/dashboard/archives" className="text-xl font-serif text-warm-dark mb-8">
        ULUMAE
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                active
                  ? 'bg-olive/15 text-olive font-medium'
                  : 'text-warm-muted hover:bg-warm-border/20 hover:text-warm-dark'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 border-t border-warm-border/30">
        <div className="text-xs text-warm-muted uppercase tracking-wide">Current plan</div>
        <div className="text-sm font-medium text-warm-dark capitalize mt-1">{plan}</div>
      </div>
    </aside>
  );
}
