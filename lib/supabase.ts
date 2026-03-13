// lib/supabase.ts - UPDATED for Collections-based data model
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// This client is now cookie-aware and will use the authenticated session
// when available. All existing imports continue to work.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// ============================================
// MEMORIAL INTERFACE (Collections Model)
// ============================================

import type { MemorialState } from '@/types/memorial';

export interface Memorial {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;

    // Single state field replaces mode + status + paid
    state: MemorialState;

    // Collections data (JSONB columns)
    stories: any;
    media: any;
    timeline: any;
    network: any;

    // Denormalized fields for quick queries
    slug: string | null;
    full_name: string | null;
    birth_date: string | null;
    death_date: string | null;
    profile_photo_url: string | null;
    cover_photo_url: string | null;

    // Preservation (Arweave)
    arweave_tx_id: string | null;
    arweave_status: 'pending' | 'confirming' | 'confirmed' | 'failed' | null;
    certificate_url: string | null;

    // Soft Delete Fields
    deleted?: boolean;
    deleted_at?: string | null;

    // Legacy compatibility (payment tracking)
    paid?: boolean;
    payment_confirmed_at?: string | null;
}


// ============================================
// CONCIERGE EXPORTS (re-export from types)
// ============================================
export type {
    ConciergeProject,
    ConciergeFile,
    ConciergeNote,
    ConciergeStatus,
    ConciergeRequestForm,
    ConciergeFileUpload,
    ConciergeContentPreview
} from '@/types/concierge';

export {
    CONCIERGE_STATUS_CONFIG,
    formatFileSize,
    getFileCategory,
    isImageFile,
    isValidEmail
} from '@/types/concierge';


// ============================================
// AUTHORIZATION INTERFACE (Simplified)
// ============================================

export interface MemorialAuthorization {
    id: string;
    created_at: string;
    updated_at?: string;
    user_id: string | null;
    memorial_id: string | null;

    // Section 1: Creator Information
    creator_full_name: string;
    creator_dob?: string | null;
    creator_address?: string | null;
    creator_city_state_zip?: string | null;
    creator_email: string;
    creator_phone?: string | null;
    relationship_to_deceased: string;
    relationship_other?: string | null;

    // Section 2: Deceased Information
    deceased_full_name: string;
    deceased_dob?: string;
    deceased_dod?: string | null;
    deceased_death_place?: string | null;
    deceased_last_residence?: string | null;

    // Section 3: Legal Agreements (simplified — checkbox-based, no video/signature pad)
    agree_legal_authority: boolean;
    agree_good_faith: boolean;
    agree_permanence: boolean;
    agree_indemnification: boolean;
    accuracy_confirmed?: boolean;
    copyright_confirmed?: boolean;
    privacy_confirmed?: boolean;

    // Section 4: Electronic Acknowledgment (simplified from drawn/video signature)
    electronic_signature: string; // Typed full name only
    signature_date: string;

    // Technical Evidence (kept for legal compliance)
    signature_ip_address: string | null;
    signature_user_agent: string | null;
    device_fingerprint?: string | null;
    geolocation?: string | null;

    // Status and Review
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    pdf_storage_path?: string | null;

    authorization_type: 'account' | 'individual';
}
