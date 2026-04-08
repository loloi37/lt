'use client';

import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Archive,
    ChevronLeft,
    ChevronRight,
    Crown,
    Edit3,
    LayoutDashboard,
    Lock,
    Menu,
    MessageSquareText,
    Network,
    Shield,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

interface DashboardShellProps {
    userId: string;
    children: ReactNode;
}

interface NavItem {
    key: 'overview' | 'edit' | 'preservation' | 'succession' | 'settings' | 'members' | 'contributions' | 'relations' | 'family';
    label: string;
    description: string;
    href: string;
    icon: typeof Archive;
    active: boolean;
    locked?: boolean;
    badge?: string;
}

function planLabel(plan: string) {
    switch (plan) {
        case 'family':
            return 'Family Plan';
        case 'personal':
            return 'Personal Plan';
        case 'concierge':
            return 'Concierge Plan';
        case 'draft':
            return 'Draft Workspace';
        default:
            return 'Workspace';
    }
}

function buildArchivesHref(userId: string, plan: string) {
    if (plan === 'family' || plan === 'concierge') return `/dashboard/family/${userId}`;
    if (plan === 'personal') return `/dashboard/personal/${userId}`;
    return `/dashboard/draft/${userId}`;
}

function buildItems(pathname: string, userId: string, plan: string): NavItem[] {
    const familyUnlocked = plan === 'family' || plan === 'concierge';
    const preservationUnlocked = plan === 'personal' || plan === 'family' || plan === 'concierge';

    if (plan === 'personal') {
        return [
            {
                key: 'overview',
                label: 'Dashboard',
                description: 'Progress, status, and quick actions',
                href: `/dashboard/personal/${userId}`,
                icon: LayoutDashboard,
                active: pathname.startsWith(`/dashboard/personal/${userId}`),
            },
            {
                key: 'edit',
                label: 'Edit',
                description: 'Open the memorial editor',
                href: `/create?mode=personal`,
                icon: Edit3,
                active: pathname.startsWith('/create'),
            },
            {
                key: 'preservation',
                label: 'Preserve',
                description: 'Sealing, export, and archive care',
                href: `/dashboard/preservation/${userId}`,
                icon: Crown,
                active: pathname.startsWith(`/dashboard/preservation/${userId}`),
            },
            {
                key: 'succession',
                label: 'Succession',
                description: 'Choose who can act later',
                href: `/dashboard/succession/${userId}`,
                icon: UserCheck,
                active: pathname.startsWith(`/dashboard/succession/${userId}`),
            },
            {
                key: 'settings',
                label: 'Settings',
                description: 'Profile, billing, and security',
                href: `/dashboard/settings/${userId}`,
                icon: Shield,
                active: pathname.startsWith(`/dashboard/settings/${userId}`),
            },
        ];
    }

    if (familyUnlocked) {
        return [
            {
                key: 'overview',
                label: 'Overview',
                description: 'Family dashboard and steward queue',
                href: `/dashboard/family/${userId}`,
                icon: LayoutDashboard,
                active: pathname === `/dashboard/family/${userId}`,
            },
            {
                key: 'members',
                label: 'Family Members',
                description: 'Roles, invitations, and pending access',
                href: `/dashboard/family/${userId}#members`,
                icon: Users,
                active: pathname === `/dashboard/family/${userId}`,
            },
            {
                key: 'contributions',
                label: 'Contributions',
                description: 'Requests, reviews, and recent activity',
                href: `/dashboard/family/${userId}#activity`,
                icon: MessageSquareText,
                active: pathname === `/dashboard/family/${userId}`,
            },
            {
                key: 'relations',
                label: 'Relations',
                description: 'Family map and linked memorials',
                href: `/dashboard/family/${userId}/tree`,
                icon: Network,
                active: pathname.startsWith(`/dashboard/family/${userId}/tree`),
            },
            {
                key: 'succession',
                label: 'Succession',
                description: 'Transfer and stewardship planning',
                href: `/dashboard/succession/${userId}`,
                icon: UserCheck,
                active: pathname.startsWith(`/dashboard/succession/${userId}`),
            },
            {
                key: 'settings',
                label: 'Settings',
                description: 'Security, billing, and family policy',
                href: `/dashboard/settings/${userId}`,
                icon: Shield,
                active: pathname.startsWith(`/dashboard/settings/${userId}`),
            },
        ];
    }

    return [
        {
            key: 'overview',
            label: 'Dashboard',
            description: 'Your current archive workspace',
            href: buildArchivesHref(userId, plan),
            icon: LayoutDashboard,
            active: /^\/dashboard\/(draft|personal|family)\/[^/]+$/.test(pathname),
        },
        {
            key: 'family',
            label: 'Family Plan',
            description: familyUnlocked ? 'Tree, roles, and shared workspace' : 'Upgrade to unlock family tools',
            href: familyUnlocked ? `/dashboard/family/${userId}/tree` : '/family-confirmation',
            icon: Users,
            active: pathname.startsWith(`/dashboard/family/${userId}/tree`),
            locked: !familyUnlocked,
            badge: familyUnlocked ? undefined : 'Upgrade',
        },
        {
            key: 'succession',
            label: 'Succession Planning',
            description: 'Choose who can manage your legacy later',
            href: `/dashboard/succession/${userId}`,
            icon: UserCheck,
            active: pathname.startsWith(`/dashboard/succession/${userId}`),
        },
        {
            key: 'settings',
            label: 'Settings',
            description: 'Profile, billing, security',
            href: `/dashboard/settings/${userId}`,
            icon: Shield,
            active: pathname.startsWith(`/dashboard/settings/${userId}`),
        },
        {
            key: 'preservation',
            label: 'Preserve',
            description: preservationUnlocked ? 'What is preserved and storage limits' : 'Review preservation before upgrading',
            href: `/dashboard/preservation/${userId}`,
            icon: Crown,
            active: pathname.startsWith(`/dashboard/preservation/${userId}`),
            locked: !preservationUnlocked,
            badge: preservationUnlocked ? undefined : 'Upgrade',
        },
    ];
}

function SidebarContent({
    items,
    plan,
    email,
    onNavigate,
}: {
    items: NavItem[];
    plan: string;
    email?: string;
    onNavigate?: () => void;
}) {
    return (
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-sm">
            <div className="border-b border-warm-border/30 px-6 py-6">
                <Link href="/" className="inline-flex items-center gap-3" onClick={onNavigate}>
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-warm-dark text-surface-low">
                        <Archive size={18} />
                    </div>
                    <div>
                        <p className="font-serif text-lg text-warm-dark">ULUMAE</p>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-warm-outline">
                            Dashboard
                        </p>
                    </div>
                </Link>
            </div>

            <div className="px-4 py-5">
                <div className="rounded-2xl border border-warm-border/30 bg-surface-mid/40 px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-warm-outline">Current Workspace</p>
                    <p className="mt-2 font-serif text-xl text-warm-dark">{planLabel(plan)}</p>
                    {email && (
                        <p className="mt-1 truncate text-xs text-warm-muted">{email}</p>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-3 pb-4">
                <div className="space-y-2">
                    {items.map((item) => {
                        const Icon = item.icon;
                        const baseClass = item.active
                            ? 'border-olive/30 bg-olive/10 text-warm-dark shadow-sm'
                            : item.locked
                                ? 'border-warm-border/20 bg-surface-low text-warm-muted hover:border-warm-border/35 hover:bg-surface-mid/40'
                                : 'border-transparent bg-transparent text-warm-dark/75 hover:border-warm-border/30 hover:bg-surface-mid/40';

                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                onClick={onNavigate}
                                className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${baseClass}`}
                            >
                                <div
                                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${
                                        item.active ? 'bg-white text-olive' : 'bg-white/80 text-warm-muted'
                                    }`}
                                >
                                    {item.locked ? <Lock size={16} /> : <Icon size={16} />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium">{item.label}</p>
                                        {item.badge && (
                                            <span className="rounded-full bg-warm-brown/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warm-brown">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-xs text-warm-outline">{item.description}</p>
                                </div>
                                <ChevronRight
                                    size={16}
                                    className={`flex-shrink-0 transition-transform ${
                                        item.active ? 'text-olive' : 'text-warm-outline group-hover:translate-x-0.5'
                                    }`}
                                />
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}

export default function DashboardShell({ userId, children }: DashboardShellProps) {
    const auth = useAuth();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const items = buildItems(pathname, userId, auth.plan);

    return (
        <div className="min-h-screen bg-surface-low">
            <div
                className={`lg:grid lg:min-h-screen ${
                    desktopCollapsed
                        ? 'lg:grid-cols-[88px_minmax(0,1fr)]'
                        : 'lg:grid-cols-[280px_minmax(0,1fr)]'
                }`}
            >
                <aside className="hidden border-r border-warm-border/30 lg:sticky lg:top-0 lg:block lg:h-screen">
                    <div className="relative h-full">
                        <button
                            onClick={() => setDesktopCollapsed((value) => !value)}
                            aria-label={desktopCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                            className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-warm-border/30 bg-white text-warm-dark shadow-sm transition-colors hover:bg-surface-mid/50"
                        >
                            {desktopCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>

                        {desktopCollapsed ? (
                            <div className="flex h-full flex-col items-center bg-white/95 px-3 py-16 backdrop-blur-sm">
                                <Link
                                    href="/"
                                    className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-warm-dark text-surface-low"
                                >
                                    <Archive size={18} />
                                </Link>

                                <nav className="flex flex-1 flex-col items-center gap-3">
                                    {items.map((item) => {
                                        const Icon = item.locked ? Lock : item.icon;

                                        return (
                                            <Link
                                                key={item.key}
                                                href={item.href}
                                                title={item.label}
                                                className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
                                                    item.active
                                                        ? 'border-olive/30 bg-olive/10 text-olive shadow-sm'
                                                        : item.locked
                                                            ? 'border-warm-border/20 bg-surface-low text-warm-muted hover:bg-surface-mid/40'
                                                            : 'border-transparent bg-transparent text-warm-dark/75 hover:border-warm-border/30 hover:bg-surface-mid/40'
                                                }`}
                                            >
                                                <Icon size={17} />
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        ) : (
                            <SidebarContent items={items} plan={auth.plan} email={auth.user?.email || undefined} />
                        )}
                    </div>
                </aside>

                <div className="min-w-0">
                    <div className="sticky top-0 z-40 border-b border-warm-border/30 bg-surface-low/95 backdrop-blur-sm lg:hidden">
                        <div className="flex items-center justify-between px-4 py-3">
                            <button
                                onClick={() => setMobileOpen(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-warm-border/30 bg-white px-3 py-2 text-sm text-warm-dark transition-colors hover:bg-surface-mid/60"
                            >
                                <Menu size={16} />
                                Menu
                            </button>
                            <div className="text-right">
                                <p className="font-serif text-base text-warm-dark">ULUMAE</p>
                                <p className="text-[10px] uppercase tracking-[0.18em] text-warm-outline">
                                    {planLabel(auth.plan)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <main>{children}</main>
                </div>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        aria-label="Close navigation"
                        className="absolute inset-0 bg-warm-dark/55 backdrop-blur-sm"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="absolute inset-y-0 left-0 w-[88vw] max-w-sm border-r border-warm-border/30 bg-white shadow-2xl">
                        <div className="flex items-center justify-end border-b border-warm-border/30 px-4 py-3">
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl border border-warm-border/30 p-2 text-warm-dark transition-colors hover:bg-surface-mid/50"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <SidebarContent
                            items={items}
                            plan={auth.plan}
                            email={auth.user?.email || undefined}
                            onNavigate={() => setMobileOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
