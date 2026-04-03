// components/role/RoleBadge.tsx
'use client';

import { WitnessRole } from '@/types/roles';
import { ROLE_CONFIG } from '@/lib/roles';
import * as Icons from 'lucide-react';

interface RoleBadgeProps {
    role: WitnessRole;
    showIcon?: boolean;
    className?: string;
}

export default function RoleBadge({ role, showIcon = true, className = '' }: RoleBadgeProps) {
    const config = ROLE_CONFIG[role];
    // Dynamically get the icon component from Lucide
    const IconComponent = (Icons as any)[config.iconName];

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${config.bgClass} ${config.colorClass} ${className}`}>
            {showIcon && IconComponent && <IconComponent size={12} strokeWidth={2.5} />}
            <span className="uppercase tracking-wider font-sans">{config.label}</span>
        </span>
    );
}