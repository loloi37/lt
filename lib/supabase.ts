// lib/supabase.ts - UPDATED
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// EXISTING MEMORIAL INTERFACE
// ============================================
export interface Memorial {
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string;
    mode: 'personal' | 'family';
    step1: any;
    step2: any;
    step3: any;
    step4: any;
    step5: any;
    step6: any;
    step7: any;
    step8: any;
    step9: any;
    status: 'draft' | 'published';
    slug: string | null;
    full_name: string | null;
    birth_date: string | null;
    death_date: string | null;
    profile_photo_url: string | null;
    cover_photo_url: string | null;
    completed_steps: number[];
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


export interface MemorialAuthorization {
    id: string;
    user_id: string | null;
    memorial_id: string | null;
    creator_full_name: string;
    creator_email: string;
    deceased_full_name: string;
    relationship_to_deceased: string;
    electronic_signature: string;
    signature_date: string;
    status: 'pending' | 'approved' | 'rejected';
    pdf_storage_path: string | null;
    // ... other fields as needed
}

export interface MemorialAuthorization {
    // IDs and timestamps
    id: string;
    created_at: string;
    updated_at: string;
    user_id: string | null;
    memorial_id: string | null;

    // Section 1: Creator Information
    creator_full_name: string;
    creator_dob: string | null;
    creator_address: string | null;
    creator_city_state_zip: string | null;
    creator_email: string;
    creator_phone: string | null;
    relationship_to_deceased: string;
    relationship_other: string | null;

    // Section 2: Deceased Information
    deceased_full_name: string;
    deceased_dob: string;
    deceased_dod: string | null;
    deceased_death_place: string | null;
    deceased_last_residence: string | null;

    // Estate Information
    probate_opened: boolean | null;
    probate_case_number: string | null;
    probate_jurisdiction: string | null;
    executor_name: string | null;
    executor_contact: string | null;

    // Section 3: Authority (JSONB fields)
    authority_claims: any; // or define specific interface
    consent_obtained_from: any; // or define specific interface
    no_conflicting_claims: boolean;

    // Section 4: Content Representations
    accuracy_confirmed: boolean;
    copyright_confirmed: boolean;
    privacy_confirmed: boolean;

    // Section 5: Indemnification
    indemnification_accepted: boolean;

    // Section 8: Electronic Signature
    electronic_signature: string;
    signature_date: string;
    signature_ip_address: string | null;
    signature_user_agent: string | null;

    // Status and Review
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by: string | null;
    reviewed_at: string | null;

    // PDF Storage
    pdf_storage_path: string | null;

    // Full backup
    form_data_json: any; // or define specific interface
}