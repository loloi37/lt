import { createClient } from '@supabase/supabase-js';
import { WitnessRole } from '@/types/roles';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface InviteMemorialPreview {
    id: string;
    fullName: string;
    birthDate: string | null;
    deathDate: string | null;
    profilePhotoUrl: string | null;
}

export interface InvitePreviewData {
    id: string;
    inviterName: string;
    inviteeEmail: string;
    role: WitnessRole;
    personalMessage: string | null;
    plan: 'personal' | 'family';
    status: string;
    isExpired: boolean;
    memorial: InviteMemorialPreview;
}

export type InviteLookupResult =
    | { state: 'NOT_FOUND' }
    | { state: 'MEMORIAL_DELETED'; inviterName: string; inviteeEmail: string }
    | { state: 'EXPIRED'; inviterName: string; inviteeEmail: string }
    | { state: 'DECLINED'; inviterName: string; inviteeEmail: string }
    | { state: 'USED_BY_OTHER'; inviterName: string; inviteeEmail: string }
    | { state: 'ALREADY_JOINED'; memorialId: string; role: WitnessRole | 'owner' }
    | { state: 'PENDING'; invitation: InvitePreviewData };

export async function getInvitationLookup(
    token: string,
    currentUserId?: string | null
): Promise<InviteLookupResult> {
    const { data: invitation, error } = await supabaseAdmin
        .from('witness_invitations')
        .select(`
            id,
            inviter_name,
            invitee_email,
            role,
            personal_message,
            plan,
            status,
            expires_at,
            memorial_id,
            memorials!inner (
                id,
                user_id,
                full_name,
                birth_date,
                death_date,
                profile_photo_url,
                deleted_at
            )
        `)
        .eq('id', token)
        .single();

    if (error || !invitation) {
        return { state: 'NOT_FOUND' };
    }

    const memorial = (invitation as any).memorials;
    if (!memorial) {
        return { state: 'NOT_FOUND' };
    }

    if (memorial.deleted_at) {
        return {
            state: 'MEMORIAL_DELETED',
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email
        };
    }

    if (
        invitation.status === 'pending'
        && new Date(invitation.expires_at) < new Date()
    ) {
        await supabaseAdmin
            .from('witness_invitations')
            .update({ status: 'expired' })
            .eq('id', token)
            .eq('status', 'pending');

        return {
            state: 'EXPIRED',
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email
        };
    }

    if (invitation.status === 'declined') {
        return {
            state: 'DECLINED',
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email
        };
    }

    if (currentUserId) {
        if (memorial.user_id === currentUserId) {
            return {
                state: 'ALREADY_JOINED',
                memorialId: memorial.id,
                role: 'owner'
            };
        }

        const { data: existingRole } = await supabaseAdmin
            .from('user_memorial_roles')
            .select('role')
            .eq('memorial_id', memorial.id)
            .eq('user_id', currentUserId)
            .maybeSingle();

        if (existingRole?.role) {
            return {
                state: 'ALREADY_JOINED',
                memorialId: memorial.id,
                role: existingRole.role as WitnessRole
            };
        }
    }

    if (invitation.status === 'accepted') {
        return {
            state: 'USED_BY_OTHER',
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email
        };
    }

    return {
        state: 'PENDING',
        invitation: {
            id: invitation.id,
            inviterName: invitation.inviter_name,
            inviteeEmail: invitation.invitee_email,
            role: invitation.role as WitnessRole,
            personalMessage: invitation.personal_message,
            plan: invitation.plan === 'family' ? 'family' : 'personal',
            status: invitation.status,
            isExpired: false,
            memorial: {
                id: memorial.id,
                fullName: memorial.full_name,
                birthDate: memorial.birth_date,
                deathDate: memorial.death_date,
                profilePhotoUrl: memorial.profile_photo_url
            }
        }
    };
}
