// types/invite.ts
import { WitnessRole } from './roles';

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export interface WitnessInvitation {
    id: string;
    memorial_id: string;
    inviter_name: string;
    invitee_email: string;
    role: WitnessRole;
    personal_message: string | null;
    status: InvitationStatus;
    plan: 'personal' | 'family';
    created_at: string;
    expires_at: string;
    accepted_by_user_id?: string | null;
}