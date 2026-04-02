// lib/uploadService.ts
import { createClient } from '@/utils/supabase/client';

export interface UploadResult {
    success: boolean;
    url?: string;
    hash?: string;
    path?: string;
    error?: string;
}

/**
 * Uploads a file securely DIRECTLY to Supabase from the browser.
 * Bypasses Next.js API size limits.
 */
export async function secureUpload(
    file: File,
    bucket: string,
    path: string
): Promise<UploadResult> {
    try {
        // 1. Calculate SHA-256 hash directly in the browser
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // 2. Upload directly to Supabase Storage
        const supabase = createClient();
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            throw new Error(error.message);
        }

        // 3. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

        return {
            success: true,
            url: publicUrlData.publicUrl,
            hash: hashHex,
            path: path
        };
    } catch (error: any) {
        console.error('Secure Upload Utility Error:', error);
        return { success: false, error: error.message };
    }
}