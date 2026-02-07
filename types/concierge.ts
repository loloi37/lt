// types/concierge.ts

// ============================================
// CONCIERGE PROJECT TYPES
// ============================================

export type ConciergeStatus = 'requested' | 'in_progress' | 'in_review' | 'finalized';

export type ConciergeNoteType = 'text' | 'voice';

// ============================================
// CONCIERGE PROJECT
// ============================================

// Rich form data for Concierge request
export interface ConciergeRequestFormRich {
    // Requester info
    name: string;
    email: string;

    // About the person being honored
    person_full_name: string;
    person_birth_date?: string;
    person_death_date?: string;
    relationship: string;

    // Materials inventory
    materials_inventory: {
        photos: boolean;
        photos_count?: string;
        documents: boolean;
        videos: boolean;
        audio: boolean;
        letters: boolean;
        digital: boolean;
        other?: string;
    };

    // Intentions
    preservation_priorities: string;
    sensitive_aspects?: string;

    // Preferences
    contact_preference: 'email' | 'call';
}

export interface ConciergeProject {
    id: string;
    created_at: string;
    updated_at: string;

    // User info
    user_id: string | null;
    name: string;
    email: string;
    initial_message: string | null;

    // Project status
    status: ConciergeStatus;

    // Person Info
    person_full_name?: string;
    contact_preference?: 'email' | 'call';

    // Payment
    paid: boolean;
    paid_at: string | null;

    // Communication
    zoom_link: string | null;

    // Progressive content preview (what we show them as we build)
    content_preview: ConciergeContentPreview;

    // Full memorial data (built by us, same structure as regular memorials)
    memorial_data: any; // JSONB - flexible for now
}

// ============================================
// CONTENT PREVIEW (Progressive reveal)
// ============================================
export interface ConciergeContentPreview {
    // Basic info (appears first)
    full_name?: string;
    birth_date?: string;
    death_date?: string;

    // Biography snippets (appear progressively)
    biography_intro?: string; // First paragraph
    biography_sections?: {
        title: string;
        content: string;
        order: number;
    }[];

    // Structure overview (high-level outline)
    structure?: {
        section: string;
        status: 'planned' | 'in_progress' | 'complete';
    }[];

    // Timeline
    key_dates?: {
        date: string;
        event: string;
    }[];

    // Stats (for user reassurance)
    total_photos?: number;
    total_documents?: number;
    total_videos?: number;
}

// ============================================
// CONCIERGE FILE
// ============================================
export interface ConciergeFile {
    id: string;
    created_at: string;

    project_id: string;

    // File metadata
    file_name: string;
    file_type: string; // MIME type
    file_size: number | null; // bytes
    storage_path: string;
    public_url: string | null;

    // Optional user note
    user_note: string | null;
}

// ============================================
// CONCIERGE NOTE/MESSAGE
// ============================================
export interface ConciergeNote {
    id: string;
    created_at: string;

    project_id: string;

    // Note content
    note_type: ConciergeNoteType;
    content: string | null; // for text notes
    audio_url: string | null; // for voice messages

    // Who sent it
    from_user: boolean; // true = from user, false = from us
}

// ============================================
// FORM DATA (for initial request)
// ============================================
export interface ConciergeRequestForm {
    name: string;
    email: string;
    initial_message?: string;
}

// ============================================
// FILE UPLOAD DATA (for drag-and-drop)
// ============================================
export interface ConciergeFileUpload {
    file: File;
    preview?: string; // for images
    user_note?: string;
}

// ============================================
// STATUS DISPLAY CONFIG
// ============================================
export const CONCIERGE_STATUS_CONFIG: Record<ConciergeStatus, {
    label: string;
    color: string;
    bgColor: string;
    description: string;
}> = {
    requested: {
        label: 'Requested',
        color: 'text-charcoal/60',
        bgColor: 'bg-sand/20',
        description: 'We\'ll contact you soon to schedule your first call'
    },
    in_progress: {
        label: 'In Progress',
        color: 'text-sage',
        bgColor: 'bg-sage/10',
        description: 'Your archive is being carefully created'
    },
    in_review: {
        label: 'In Review',
        color: 'text-terracotta',
        bgColor: 'bg-terracotta/10',
        description: 'We\'re finalizing the details'
    },
    finalized: {
        label: 'Complete',
        color: 'text-sage',
        bgColor: 'bg-sage/20',
        description: 'Your archive is ready'
    }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Get file type category from MIME type
 */
export const getFileCategory = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'Photo';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'Document';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'Document';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'Spreadsheet';
    if (mimeType.includes('text')) return 'Text';
    return 'File';
};

/**
 * Check if file is an image (for preview)
 */
export const isImageFile = (mimeType: string): boolean => {
    return mimeType.startsWith('image/');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};