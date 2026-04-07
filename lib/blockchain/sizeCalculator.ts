// Estimates the encrypted-payload size for a memorial.
// Profile Photo and Cover Photo are intentionally excluded — they're "free".

import type { Memorial } from '@/lib/supabase';

export interface SizeBreakdown {
  textBytes: number;
  photoGalleryBytes: number;
  videoBytes: number;
  interactiveStoryBytes: number;
  childhoodPhotoBytes: number;
  voiceRecordingBytes: number;
  totalBytes: number;
  counts: {
    galleryPhotos: number;
    videos: number;
    interactiveStories: number;
    childhoodPhotos: number;
    voiceRecordings: number;
  };
}

export const FIFTY_GB = 50 * 1024 * 1024 * 1024;

interface MediaItem {
  size?: number;
  fileSize?: number;
  bytes?: number;
}

const sumSizes = (items: unknown): number => {
  if (!Array.isArray(items)) return 0;
  return items.reduce<number>((acc, raw) => {
    const m = (raw || {}) as MediaItem;
    return acc + (m.size || m.fileSize || m.bytes || 0);
  }, 0);
};

const countItems = (items: unknown): number => (Array.isArray(items) ? items.length : 0);

export function calculateMemorialSize(memorial: Memorial): SizeBreakdown {
  const step2 = memorial.step2 || {};
  const step7 = memorial.step7 || {};
  const step8 = memorial.step8 || {};
  const step9 = memorial.step9 || {};

  // Text/story payload — JSON of all step blobs except media-heavy fields
  const textPayload = JSON.stringify({
    step1: memorial.step1,
    step2: { ...step2, childhoodPhotos: undefined },
    step3: memorial.step3,
    step4: memorial.step4,
    step5: memorial.step5,
    step6: memorial.step6,
    step7: { ...step7, voiceRecordings: undefined },
    step8: {
      ...step8,
      gallery: undefined,
      interactiveGallery: undefined,
      coverPhoto: undefined,
      profilePhoto: undefined,
    },
    step9: { ...step9, videos: undefined },
  });
  const textBytes = new Blob([textPayload]).size;

  const photoGalleryBytes = sumSizes(step8.gallery);
  const interactiveStoryBytes = sumSizes(step8.interactiveGallery);
  const videoBytes = sumSizes(step9.videos);
  const childhoodPhotoBytes = sumSizes(step2.childhoodPhotos);
  const voiceRecordingBytes = sumSizes(step7.voiceRecordings);

  const totalBytes =
    textBytes +
    photoGalleryBytes +
    interactiveStoryBytes +
    videoBytes +
    childhoodPhotoBytes +
    voiceRecordingBytes;

  return {
    textBytes,
    photoGalleryBytes,
    videoBytes,
    interactiveStoryBytes,
    childhoodPhotoBytes,
    voiceRecordingBytes,
    totalBytes,
    counts: {
      galleryPhotos: countItems(step8.gallery),
      videos: countItems(step9.videos),
      interactiveStories: countItems(step8.interactiveGallery),
      childhoodPhotos: countItems(step2.childhoodPhotos),
      voiceRecordings: countItems(step7.voiceRecordings),
    },
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 2)} ${units[i]}`;
}
