// lib/arche/archiver.ts
import JSZip from 'jszip';
import { MemorialData } from '@/types/memorial';
import { ResourceMap } from './htmlGenerator';

export class ArcheArchiver {
    private zip: JSZip;
    private resourceMap: ResourceMap;
    private memorialData: MemorialData;

    constructor(data: MemorialData) {
        this.zip = new JSZip();
        this.resourceMap = new Map();
        this.memorialData = data;

        // Initialize Folder Structure
        this.zip.folder("media");
        this.zip.folder("media/photos");
        this.zip.folder("media/photos/original");
        this.zip.folder("media/videos");
        this.zip.folder("media/documents");
    }

    /**
     * Add media from URL or Base64 Data URI
     */
    async addMedia(url: string | null | undefined, folder: string, filename: string): Promise<string | null> {
        if (!url) return null;

        try {
            let buffer: Buffer;
            let extension = 'jpg';

            // 1. Handle Base64 Data URIs (e.g., "data:image/png;base64,.....")
            if (url.startsWith('data:')) {
                // Extract the Base64 part safely
                const commaIdx = url.indexOf(',');
                if (commaIdx === -1) throw new Error('Invalid Data URI');

                const meta = url.substring(0, commaIdx); // e.g. "data:image/png;base64"
                const b64 = url.substring(commaIdx + 1);

                // Decode Base64
                buffer = Buffer.from(b64, 'base64');

                // Guess extension
                if (meta.includes('png')) extension = 'png';
                else if (meta.includes('jpeg') || meta.includes('jpg')) extension = 'jpg';
                else if (meta.includes('mp4')) extension = 'mp4';
            }
            // 2. Handle Standard HTTP URLs
            else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url} `);
                const arrayBuffer = await response.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);

                // Get extension from URL
                const cleanUrl = url.split('?')[0];
                const parts = cleanUrl.split('.');
                const ext = parts.length > 1 ? parts.pop() : null;
                if (ext && ext.length < 5) extension = ext;
            }

            // Clean filename
            const safeName = filename.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
            const finalName = `${safeName}.${extension} `;
            const path = `${folder}/${finalName}`;

            // Add to ZIP
            this.zip.file(path, buffer);

            // Record mapping
            this.resourceMap.set(url, path);

            return path;
        } catch (error) {
            console.error(`Failed to archive media: ${url ? url.substring(0, 50) : 'null'}...`, error);
            return null;
        }
    }

    addTextFile(path: string, content: string) {
        this.zip.file(path, content);
    }

    /**
     * Returns a Node Buffer directly. 
     * This fixes the "Blob" type error and corruption issues.
     */
    async generateZip(): Promise<Buffer> {
        // "nodebuffer" returns a Buffer, which is perfect for server-side upload
        return await this.zip.generateAsync({ type: "nodebuffer" }) as Buffer;
    }

    getResourceMap(): ResourceMap {
        return this.resourceMap;
    }
}