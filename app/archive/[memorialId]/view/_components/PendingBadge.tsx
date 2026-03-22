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
        px-2.5 py-1 bg-stone/10 hover:bg-stone/20
        border border-stone/20 rounded-full
        text-xs font-medium text-stone
        transition-all font-sans group"
        >
            <span className="w-1.5 h-1.5 rounded-full
        bg-stone animate-pulse" />
            {count} pending
            <span className="text-stone/50
        group-hover:text-stone transition-colors">
                →
            </span>
        </button>
    );
}