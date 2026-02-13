// lib/uploadService.ts

export interface UploadResult {
    success: boolean;
    url?: string;
    hash?: string; // The SHA-256 hash returned by the server
    path?: string;
    error?: string;
}

/**
 * Uploads a file securely via the server-side API.
 * The server calculates the SHA-256 hash for integrity verification.
 */
export async function secureUpload(
    file: File,
    bucket: string,
    path: string
): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('path', path);

    try {
        const response = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Upload failed');
        }

        const data = await response.json();
        return {
            success: true,
            url: data.url,
            hash: data.hash, // Capture the hash
            path: data.path
        };

    } catch (error: any) {
        console.error('Secure Upload Utility Error:', error);
        return { success: false, error: error.message };
    }
}