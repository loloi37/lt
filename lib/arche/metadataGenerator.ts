// lib/arche/metadataGenerator.ts
import { MemorialData } from '@/types/memorial';

export function generateReadme(data: MemorialData): string {
    return `LEGACY VAULT ARCHIVE
================================================================
ARCHIVE FOR: ${data.stories.fullName}
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
            name: data.stories.fullName,
            birthDate: data.stories.birthDate,
            deathDate: data.stories.deathDate,
        },
        stats: {
            photos: data.media.gallery.length,
            videos: data.media.videos.length,
            tributes: data.network.sharedMemories.length + data.network.impactStories.length,
        },
        rawData: data
    };

    return JSON.stringify(manifest, null, 2);
}
