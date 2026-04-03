// components/role/RoleDropdown.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { WitnessRole } from '@/types/roles';
import { ROLE_CONFIG } from '@/lib/roles';

interface RoleDropdownProps {
    currentRole: WitnessRole;
    availableRoles: WitnessRole[];
    onChange: (role: WitnessRole) => void;
    disabled?: boolean;
}

export default function RoleDropdown({ currentRole, availableRoles, onChange, disabled }: RoleDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-serif italic border transition-all ${isOpen ? 'bg-surface-mid border-warm-dark/20' : 'bg-white border-warm-border/30'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-mid'}`}
            >
                <span className={ROLE_CONFIG[currentRole].colorClass}>
                    {ROLE_CONFIG[currentRole].label}
                </span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 z-[60] bg-white border border-warm-border/30 rounded-xl shadow-2xl py-2 min-w-[200px] animate-fadeIn">
                    <p className="px-4 py-1 text-[10px] uppercase tracking-widest text-warm-dark/30 font-bold mb-1">Select Role</p>
                    {availableRoles.map((role) => {
                        const isActive = role === currentRole;
                        return (
                            <button
                                key={role}
                                type="button"
                                onClick={() => {
                                    if (!isActive) onChange(role);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 transition-colors flex items-center justify-between group ${isActive ? 'bg-surface-low' : 'hover:bg-surface-low'
                                    }`}
                            >
                                <div>
                                    <p className={`text-xs font-serif italic ${isActive ? ROLE_CONFIG[role].colorClass : 'text-warm-dark'}`}>
                                        {ROLE_CONFIG[role].label}
                                    </p>
                                    <p className="text-[10px] text-warm-dark/40 line-clamp-1">{ROLE_CONFIG[role].description}</p>
                                </div>
                                {isActive && <Check size={14} className="text-olive" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}