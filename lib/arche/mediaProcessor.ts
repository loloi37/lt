// lib/arche/mediaProcessor.ts
import { ArcheArchiver } from './archiver';
import { MemorialData } from '@/types/memorial';

export async function processMemorialMedia(archiver: ArcheArchiver, data: MemorialData) {
    const promises: Promise<any>[] = [];

    // 1. Profile Photo
    if (data.step1.profilePhotoPreview) {
        console.log('Archiving profile photo...');
        promises.push(
            archiver.addMedia(
                data.step1.profilePhotoPreview,
                'media/photos',
                'profile_photo',
                data.step1.profilePhotoHash // Pass the hash
            )
        );
    }

    // 2. Cover Photo
    if (data.step8.coverPhotoPreview) {
        console.log('Archiving cover photo...');
        promises.push(
            archiver.addMedia(
                data.step8.coverPhotoPreview,
                'media/photos',
                'cover_photo',
                data.step8.coverPhotoHash // Pass the hash
            )
        );
    }

    // 3. Gallery Photos (Step 8)
    if (data.step8.gallery && data.step8.gallery.length > 0) {
        console.log(`Archiving ${data.step8.gallery.length} gallery photos...`);
        data.step8.gallery.forEach((photo, index) => {
            const safeCaption = (photo.caption || 'photo').substring(0, 20).replace(/[^a-z0-9]/gi, '_');
            const filename = `gallery_${String(index + 1).padStart(2, '0')}_${safeCaption}`;
            
            promises.push(
                archiver.addMedia(
                    photo.preview,
                    'media/photos/original',
                    filename,
                    photo.sha256_hash // Pass the hash
                )
            );
        });
    }

    // 4. Interactive Gallery (Step 8)
    if (data.step8.interactiveGallery && data.step8.interactiveGallery.length > 0) {
        console.log('Archiving interactive photos...');
        data.step8.interactiveGallery.forEach((item, index) => {
            const filename = `interactive_${String(index + 1).padStart(2, '0')}`;
            promises.push(
                archiver.addMedia(
                    item.preview,
                    'media/photos/original',
                    filename,
                    item.sha256_hash // Pass the hash
                )
            );
        });
    }

    // 5. Videos (Step 9)
    if (data.step9.videos && data.step9.videos.length > 0) {
        console.log(`Archiving ${data.step9.videos.length} videos...`);
        data.step9.videos.forEach((video, index) => {
            const safeTitle = (video.title || 'video').substring(0, 20).replace(/[^a-z0-9]/gi, '_');
            const filename = `video_${String(index + 1).padStart(2, '0')}_${safeTitle}`;

            // Video File
            promises.push(
                archiver.addMedia(
                    video.url,
                    'media/videos',
                    filename,
                    video.sha256_hash // Pass the hash
                )
            );

            // Thumbnail (Thumbnails usually don't have stored hashes, usually fine to skip strict verification for thumbs)
            if (video.thumbnail) {
                promises.push(
                    archiver.addMedia(
                        video.thumbnail,
                        'media/photos', 
                        `${filename}_thumb`
                    )
                );
            }
        });
    }

    // Wait for all downloads to finish
    await Promise.all(promises);
    console.log('All media archived and verified.');
}