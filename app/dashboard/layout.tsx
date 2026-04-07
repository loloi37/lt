'use client';

import { usePathname } from 'next/navigation';
import DashboardSidebar from './_components/DashboardSidebar';

// Routes that use the new unified shell. Legacy per-userId pages keep their own UI.
const SHELL_PREFIXES = [
  '/dashboard/archives',
  '/dashboard/family',
  '/dashboard/settings',
  '/dashboard/personal/blockchain',
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const useShell = SHELL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
  // Special-case: '/dashboard/family' must not match '/dashboard/family/[userId]'
  const isLegacyFamilyOrPersonal =
    /^\/dashboard\/(family|personal|draft|concierge)\/[^/]+/.test(pathname) &&
    !pathname.startsWith('/dashboard/personal/blockchain');

  if (!useShell || isLegacyFamilyOrPersonal) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-surface-low">
      <DashboardSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
