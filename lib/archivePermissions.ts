import { WitnessRole } from '@/types/roles';

export type ArchivePlan = 'personal' | 'family';

export type ArchiveAction =
  | 'view_archive'
  | 'view_members'
  | 'edit_archive'
  | 'invite_member'
  | 'manage_members'
  | 'review_contributions'
  | 'contribute_content'
  | 'view_family_map'
  | 'request_memorial_creation'
  | 'export_archive'
  | 'delete_archive'
  | 'view_activity'
  | 'manage_succession';

export interface ArchiveCapabilities {
  canViewArchive: boolean;
  canContribute: boolean;
  canReview: boolean;
  canInvite: boolean;
  canManageMembers: boolean;
  canViewFamilyMap: boolean;
  canRequestAccess: boolean;
  contributionsRequireReview: boolean;
  canEditArchive: boolean;
  canExportArchive: boolean;
  canDeleteArchive: boolean;
  canViewActivity: boolean;
  canManageSuccession: boolean;
}

export interface ArchivePermissionContext {
  memorialId: string;
  ownerUserId: string;
  plan: ArchivePlan;
  role: WitnessRole;
  isOwner: boolean;
}

export interface ArchivePermissionResolution {
  memorialExists: boolean;
  context: ArchivePermissionContext | null;
}

const BASE_OWNER_ACTIONS: ArchiveAction[] = [
  'view_archive',
  'view_members',
  'edit_archive',
  'invite_member',
  'manage_members',
  'review_contributions',
  'contribute_content',
  'export_archive',
  'delete_archive',
  'view_activity',
  'manage_succession',
];

const PLAN_PERMISSIONS: Record<ArchivePlan, Record<WitnessRole, ArchiveAction[]>> = {
  personal: {
    owner: [...BASE_OWNER_ACTIONS],
    co_guardian: [
      'view_archive',
      'view_members',
      'edit_archive',
      'review_contributions',
      'contribute_content',
      'view_activity',
    ],
    witness: [
      'view_archive',
      'contribute_content',
    ],
    reader: ['view_archive'],
  },
  family: {
    owner: [
      ...BASE_OWNER_ACTIONS,
      'view_family_map',
    ],
    co_guardian: [
      'view_archive',
      'view_members',
      'edit_archive',
      'review_contributions',
      'contribute_content',
      'view_family_map',
      'request_memorial_creation',
      'view_activity',
      'manage_succession',
    ],
    witness: [
      'view_archive',
      'contribute_content',
      'view_family_map',
    ],
    reader: ['view_archive'],
  },
};

export function getArchivePlan(mode?: string | null): ArchivePlan {
  return mode === 'family' ? 'family' : 'personal';
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

export function hasArchivePermission(
  context: ArchivePermissionContext,
  action: ArchiveAction
): boolean {
  return PLAN_PERMISSIONS[context.plan][context.role].includes(action);
}

export function getArchiveCapabilities(
  role: WitnessRole,
  plan: ArchivePlan
): ArchiveCapabilities {
  const context: ArchivePermissionContext = {
    memorialId: '',
    ownerUserId: '',
    plan,
    role,
    isOwner: role === 'owner',
  };

  const canReview = hasArchivePermission(context, 'review_contributions');

  return {
    canViewArchive: hasArchivePermission(context, 'view_archive'),
    canContribute: hasArchivePermission(context, 'contribute_content'),
    canReview,
    canInvite: hasArchivePermission(context, 'invite_member'),
    canManageMembers: hasArchivePermission(context, 'manage_members'),
    canViewFamilyMap: hasArchivePermission(context, 'view_family_map'),
    canRequestAccess: plan === 'family' && role === 'witness',
    contributionsRequireReview: !canReview,
    canEditArchive: hasArchivePermission(context, 'edit_archive'),
    canExportArchive: hasArchivePermission(context, 'export_archive'),
    canDeleteArchive: hasArchivePermission(context, 'delete_archive'),
    canViewActivity: hasArchivePermission(context, 'view_activity'),
    canManageSuccession: hasArchivePermission(context, 'manage_succession'),
  };
}

export async function resolveArchivePermissionContext(
  supabaseAdmin: any,
  memorialId: string,
  userId: string
): Promise<ArchivePermissionResolution> {
  const { data: memorial, error: memorialError } = await supabaseAdmin
    .from('memorials')
    .select('id, user_id, mode')
    .eq('id', memorialId)
    .maybeSingle();

  if (memorialError || !memorial) {
    return {
      memorialExists: false,
      context: null,
    };
  }

  if (memorial.user_id === userId) {
    return {
      memorialExists: true,
      context: {
        memorialId,
        ownerUserId: memorial.user_id,
        plan: getArchivePlan(memorial.mode),
        role: 'owner',
        isOwner: true,
      },
    };
  }

  const { data: roleRow } = await supabaseAdmin
    .from('user_memorial_roles')
    .select('role')
    .eq('memorial_id', memorialId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!roleRow?.role) {
    return {
      memorialExists: true,
      context: null,
    };
  }

  return {
    memorialExists: true,
    context: {
      memorialId,
      ownerUserId: memorial.user_id,
      plan: getArchivePlan(memorial.mode),
      role: roleRow.role as WitnessRole,
      isOwner: false,
    },
  };
}
