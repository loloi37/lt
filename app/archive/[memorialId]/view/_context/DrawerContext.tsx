'use client';
import {
    createContext, useContext, useState,
    useCallback, ReactNode
} from 'react';

export type DrawerSection =
    | 'biography'
    | 'photos'
    | 'memories'
    | 'videos'
    | 'all';

export interface PendingContribution {
    id: string;
    type: 'memory' | 'photo' | 'video';
    witness_name: string;
    contributor_email: string | null;
    is_anonymous: boolean;
    content: {
        title?: string;
        content?: string;
        caption?: string;
        url?: string;
        relationship?: string;
        year?: string;
    };
    created_at: string;
}

interface DrawerContextValue {
    isOpen: boolean;
    activeSection: DrawerSection | null;
    contributions: PendingContribution[];
    pendingBySection: Record<DrawerSection, number>;
    openDrawer: (section: DrawerSection) => void;
    closeDrawer: () => void;
    removeContribution: (id: string) => void;
    setContributions: (c: PendingContribution[]) => void;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

export function DrawerProvider({
    children
}: {
    children: ReactNode
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] =
        useState<DrawerSection | null>(null);
    const [contributions, setContributions] =
        useState<PendingContribution[]>([]);

    // Map contribution types to sections
    const pendingBySection = contributions.reduce(
        (acc, c) => {
            const section: DrawerSection =
                c.type === 'memory' ? 'memories'
                    : c.type === 'photo' ? 'photos'
                        : c.type === 'video' ? 'videos'
                            : 'all';
            acc[section] = (acc[section] || 0) + 1;
            acc['all'] = (acc['all'] || 0) + 1;
            return acc;
        },
        {} as Record<DrawerSection, number>
    );

    const openDrawer = useCallback(
        (section: DrawerSection) => {
            setActiveSection(section);
            setIsOpen(true);
        }, []
    );

    const closeDrawer = useCallback(() => {
        setIsOpen(false);
        setTimeout(() => setActiveSection(null), 300);
    }, []);

    const removeContribution = useCallback(
        (id: string) => {
            setContributions(prev =>
                prev.filter(c => c.id !== id)
            );
        }, []
    );

    return (
        <DrawerContext.Provider value={{
            isOpen,
            activeSection,
            contributions,
            pendingBySection,
            openDrawer,
            closeDrawer,
            removeContribution,
            setContributions
        }}>
            {children}
        </DrawerContext.Provider>
    );
}

export function useDrawer() {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error(
        'useDrawer must be used inside DrawerProvider'
    );
    return ctx;
}