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
                'profile_photo'
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
                'cover_photo'
            )
        );
    }

    // 3. Gallery Photos (Step 8)
    if (data.step8.gallery && data.step8.gallery.length > 0) {
        console.log(`Archiving ${data.step8.gallery.length} gallery photos...`);
        data.step8.gallery.forEach((photo, index) => {
            // Create a descriptive filename: "01_summer_vacation" or "01_photo"
            const safeCaption = (photo.caption || 'photo').substring(0, 20).replace(/[^a-z0-9]/gi, '_');
            const filename = `gallery_${String(index + 1).padStart(2, '0')}_${safeCaption}`;
            
            promises.push(
                archiver.addMedia(
                    photo.preview,
                    'media/photos/original',
                    filename
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
                    filename
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
                    filename
                )
            );

            // Thumbnail
            if (video.thumbnail) {
                promises.push(
                    archiver.addMedia(
                        video.thumbnail,
                        'media/photos', // Keep thumbnails in photos folder or a specific subfolder
                        `${filename}_thumb`
                    )
                );
            }
        });
    }

    // Wait for all downloads to finish
    await Promise.all(promises);
    console.log('All media archived successfully.');
}