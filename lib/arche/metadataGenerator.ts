// lib/arche/metadataGenerator.ts
import { MemorialData } from '@/types/memorial';

export function generateReadme(data: MemorialData): string {
    return `LEGACY VAULT ARCHIVE
================================================================
ARCHIVE FOR: ${data.step1.fullName}
GENERATED: ${new Date().toLocaleDateString()}
================================================================

HOW TO OPEN THIS ARCHIVE:
1. Unzip this file (Right-click > Extract All).
2. Open the folder.
3. Double-click the file named "index.html".
4. The archive will open in your web browser.
   (No internet connection required)

CONTENTS:
- Full Life Biography & Chapters
- Photo Gallery (High Resolution & Web Optimized)
- Video Memories
- Tributes & Stories from family and friends
- Timeline of Major Events

DURABILITY:
This archive uses standard, open formats (HTML, JPG, MP4, JSON) 
guaranteed to be readable by computers for decades to come. 
No proprietary software is needed.

SUPPORT:
If you have questions, contact: support@legacyvault.com

================================================================
Preserved by Legacy Vault - The echo that never fades.
`;
}

export function generateManifest(data: MemorialData, memorialId: string): string {
    const manifest = {
        version: "1.0",
        schema: "arche-standard-v1",
        generatedAt: new Date().toISOString(),
        memorialId: memorialId,
        subject: {
            name: data.step1.fullName,
            birthDate: data.step1.birthDate,
            deathDate: data.step1.deathDate,
        },
        stats: {
            photos: data.step8.gallery.length,
            videos: data.step9.videos.length,
            tributes: data.step7.sharedMemories.length + data.step7.impactStories.length,
            completedSteps: data.completedSteps
        },
        // We include the full raw data for potential future re-importing
        // into Legacy Vault or another system.
        rawData: data
    };

    return JSON.stringify(manifest, null, 2);
}