'use client';
import { useDrawer, DrawerSection } from
    '../_context/DrawerContext';

export default function PendingBadge({
    section
}: {
    section: DrawerSection
}) {
    const { pendingBySection, openDrawer } = useDrawer();
    const count = pendingBySection[section] || 0;

    if (count === 0) return null;

    return (
        <button
            onClick={() => openDrawer(section)}
            className="inline-flex items-center gap-1.5
        px-2.5 py-1 bg-warm-muted/10 hover:bg-warm-muted/20
        border border-warm-muted/20 rounded-full
        text-xs font-medium text-warm-muted
        transition-all font-sans group"
        >
            <span className="w-1.5 h-1.5 rounded-full
        bg-warm-muted animate-pulse" />
            {count} pending
            <span className="text-warm-muted/50
        group-hover:text-warm-muted transition-colors">
                →
            </span>
        </button>
    );
}