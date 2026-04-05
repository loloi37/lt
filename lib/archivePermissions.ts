import { WitnessRole } from '@/types/roles';

export type ArchivePlan = 'personal' | 'family';

export interface ArchiveCapabilities {
  canViewArchive: boolean;
  canContribute: boolean;
  canReview: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canViewFamilyMap: boolean;
  canRequestAccess: boolean;
  contributionsRequireReview: boolean;
}

export function getRoleLabel(role: WitnessRole): string {
  switch (role) {
    case 'owner':
      return 'Owner';
    case 'co_guardian':
      return 'Co-Guardian';
    case 'witness':
      return 'Witness';
    case 'reader':
      return 'Reader';
    default:
      return 'Member';
  }
}

export function getArchiveCapabilities(
  role: WitnessRole,
  plan: ArchivePlan
): ArchiveCapabilities {
  const canReview = role === 'owner' || role === 'co_guardian';
  const canContribute = role !== 'reader';

  return {
    canViewArchive: true,
    canContribute,
    canReview,
    canInvite: role === 'owner',
    canManageMembers: role === 'owner',
    canViewFamilyMap: plan === 'family',
    canRequestAccess: role === 'witness' && plan === 'family',
    contributionsRequireReview: !canReview,
  };
}
