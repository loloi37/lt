// lib/arche/archiver.ts
import JSZip from 'jszip';
import crypto from 'crypto'; // Import crypto for hashing
import { MemorialData } from '@/types/memorial';
import { ResourceMap } from './htmlGenerator';

export class ArcheArchiver {
    private zip: JSZip;
    private resourceMap: ResourceMap; 
    private memorialData: MemorialData;
    private verificationLog: string[]; // Store verification results

    constructor(data: MemorialData) {
        this.zip = new JSZip();
        this.resourceMap = new Map();
        this.memorialData = data;
        this.verificationLog = [
            `LEGACY VAULT - INTEGRITY VERIFICATION REPORT`,
            `Generated: ${new Date().toISOString()}`,
            `Subject: ${data.step1.fullName}`,
            `-------------------------------------------------------------------`,
            `STATUS      | FILE                                     | DETAILS`,
            `-------------------------------------------------------------------`
        ];

        // Initialize Folder Structure
        this.zip.folder("media");
        this.zip.folder("media/photos");
        this.zip.folder("media/photos/original");
        this.zip.folder("media/videos");
        this.zip.folder("media/documents");
    }

    /**
     * Add media from URL or Base64 Data URI
     * Now accepts an optional expectedHash to verify integrity
     */
    async addMedia(
        url: string | null | undefined, 
        folder: string, 
        filename: string,
        expectedHash?: string // <--- NEW PARAMETER
    ): Promise<string | null> {
        if (!url) return null;

        try {
            let buffer: Buffer;
            let extension = 'jpg';

            // 1. Handle Base64 Data URIs
            if (url.startsWith('data:')) {
                const commaIdx = url.indexOf(',');
                if (commaIdx === -1) throw new Error('Invalid Data URI');
                
                const meta = url.substring(0, commaIdx);
                const b64 = url.substring(commaIdx + 1);
                
                buffer = Buffer.from(b64, 'base64');
                
                if (meta.includes('png')) extension = 'png';
                else if (meta.includes('jpeg') || meta.includes('jpg')) extension = 'jpg';
                else if (meta.includes('mp4')) extension = 'mp4';
            } 
            // 2. Handle Standard HTTP URLs
            else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                const arrayBuffer = await response.arrayBuffer();
                buffer = Buffer.from(arrayBuffer);
                
                const cleanUrl = url.split('?')[0];
                const parts = cleanUrl.split('.');
                const ext = parts.length > 1 ? parts.pop() : null;
                if (ext && ext.length < 5) extension = ext;
            }
            
            // --- STEP 1.4.2: INTEGRITY CHECK ---
            if (expectedHash) {
                // Calculate SHA-256 of the downloaded/decoded buffer
                const hashSum = crypto.createHash('sha256');
                hashSum.update(buffer);
                const calculatedHash = hashSum.digest('hex');

                if (calculatedHash === expectedHash) {
                    this.verificationLog.push(`[PASS]      | ${filename}.${extension}`.padEnd(60) + `| Verified`);
                } else {
                    console.error(`Hash mismatch for ${filename}: Expected ${expectedHash}, got ${calculatedHash}`);
                    this.verificationLog.push(`[FAIL]      | ${filename}.${extension}`.padEnd(60) + `| CORRUPTED. Hash mismatch.`);
                    this.verificationLog.push(`            | Expected: ${expectedHash}`);
                    this.verificationLog.push(`            | Actual:   ${calculatedHash}`);
                }
            } else {
                this.verificationLog.push(`[WARN]      | ${filename}.${extension}`.padEnd(60) + `| No signature found in database.`);
            }
            // -----------------------------------
            
            const safeName = filename.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
            const finalName = `${safeName}.${extension}`;
            const path = `${folder}/${finalName}`;

            this.zip.file(path, buffer);
            this.resourceMap.set(url, path);

            return path;
        } catch (error: any) {
            console.error(`Failed to archive media: ${url ? url.substring(0, 50) : 'null'}...`, error);
            this.verificationLog.push(`[ERROR]     | ${filename}`.padEnd(60) + `| Download failed: ${error.message}`);
            return null;
        }
    }

    addTextFile(path: string, content: string) {
        this.zip.file(path, content);
    }

    // NEW: Method to get the report
    getVerificationReport(): string {
        return this.verificationLog.join('\n');
    }

    async generateZip(): Promise<Buffer> {
        return await this.zip.generateAsync({ type: "nodebuffer" }) as Buffer;
    }

    getResourceMap(): ResourceMap {
        return this.resourceMap;
    }
}