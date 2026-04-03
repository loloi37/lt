// types/roles.ts

export type WitnessRole = 'owner' | 'co_guardian' | 'witness' | 'reader';

export interface RoleConfig {
    label: string;
    description: string;
    colorClass: string;   // Tailwind text color
    bgClass: string;      // Tailwind background + border
    iconName: string;     // Reference name for Lucide icons
    capabilities: string[];
    restrictions: string[];
}