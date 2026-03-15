// lib/arche/mediaProcessor.ts
import { ArcheArchiver } from './archiver';
import { MemorialData } from '@/types/memorial';

export async function processMemorialMedia(archiver: ArcheArchiver, data: MemorialData) {
    const promises: Promise<any>[] = [];

    // 1. Profile Photo
    if (data.stories.profilePhotoPreview) {
        console.log('Archiving profile photo...');
        promises.push(
            archiver.addMedia(
                data.stories.profilePhotoPreview,
                'media/photos',
                'profile_photo',
                data.stories.profilePhotoHash
            )
        );
    }

    // 2. Cover Photo
    if (data.media.coverPhotoPreview) {
        console.log('Archiving cover photo...');
        promises.push(
            archiver.addMedia(
                data.media.coverPhotoPreview,
                'media/photos',
                'cover_photo',
                data.media.coverPhotoHash
            )
        );
    }

    // 3. Gallery Photos
    if (data.media.gallery && data.media.gallery.length > 0) {
        console.log(`Archiving ${data.media.gallery.length} gallery photos...`);
        data.media.gallery.forEach((photo, index) => {
            const safeCaption = (photo.caption || 'photo').substring(0, 20).replace(/[^a-z0-9]/gi, '_');
            const filename = `gallery_${String(index + 1).padStart(2, '0')}_${safeCaption}`;

            promises.push(
                archiver.addMedia(
                    photo.preview,
                    'media/photos/original',
                    filename,
                    photo.sha256_hash
                )
            );
        });
    }

    // 4. Interactive Gallery
    if (data.media.interactiveGallery && data.media.interactiveGallery.length > 0) {
        console.log('Archiving interactive photos...');
        data.media.interactiveGallery.forEach((item, index) => {
            const filename = `interactive_${String(index + 1).padStart(2, '0')}`;
            promises.push(
                archiver.addMedia(
                    item.preview,
                    'media/photos/original',
                    filename,
                    item.sha256_hash
                )
            );
        });
    }

    // 5. Videos
    if (data.media.videos && data.media.videos.length > 0) {
        console.log(`Archiving ${data.media.videos.length} videos...`);
        data.media.videos.forEach((video, index) => {
            const safeTitle = (video.title || 'video').substring(0, 20).replace(/[^a-z0-9]/gi, '_');
            const filename = `video_${String(index + 1).padStart(2, '0')}_${safeTitle}`;

            promises.push(
                archiver.addMedia(
                    video.url,
                    'media/videos',
                    filename,
                    video.sha256_hash
                )
            );

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

    await Promise.all(promises);
    console.log('All media archived and verified.');
}
