import { useEffect, useRef, useState } from 'react';
import { Film, Upload, Trash2, Play, AlertCircle } from 'lucide-react';
import { VideoContent } from '@/types/memorial';
import { supabase } from '@/lib/supabase';
import { secureUpload } from '@/lib/uploadService';
import TutorialPopup from '@/components/TutorialPopup';

interface Step9Props {
  data: VideoContent;
  onUpdate: (data: VideoContent) => void;
  onNext: () => void;
  onBack: () => void;
  memorialId: string | null;
  isPaid?: boolean;
  readOnly?: boolean;
}

export default function Step9Videos({ data, onUpdate, onNext, onBack, memorialId, isPaid = false, readOnly }: Step9Props) {
  const videoRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // FIXED: Show tutorial every time user visits Step 9
    // We check if they have any videos - if not, show tutorial
    if (data.videos.length === 0 && !readOnly) { // Only show tutorial if not in readOnly mode
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  }, [data.videos.length, readOnly]); // Added readOnly to dependency array

  const handleTutorialComplete = () => {
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    setShowTutorial(false);
  };

  const tutorialSteps = [
    {
      target: '[data-tutorial="videos"]',
      title: 'Add Videos',
      description: 'Share videos that capture their voice, spirit, and memorable moments. Please stay on this page until the upload is complete!',
      position: 'bottom' as const,
    },
  ];

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return; // Prevent upload if in readOnly mode

    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    if (!memorialId) {
      setUploadError("Please save the memorial first (Basic Info step) before uploading videos.");
      return;
    }

    // ⚠️ NOUVELLE VÉRIFICATION DE LIMITE
    const currentCount = data.videos.length;
    const maxAllowed = isPaid ? 20 : 3; // 20 for paid, 3 for free
    const remaining = maxAllowed - currentCount;

    if (remaining <= 0) {
      setUploadError(`Maximum ${maxAllowed} videos per archive. You have already uploaded ${currentCount} video(s).`);
      return;
    }

    const filesToUpload = files.slice(0, remaining);

    if (files.length > remaining) {
      setUploadError(`You tried to upload ${files.length} videos, but only ${remaining} slot(s) remaining. Will upload ${remaining} video(s).`);
      // Continue l'upload des fichiers autorisés après 3 secondes
      await new Promise(resolve => setTimeout(resolve, 3000));
      setUploadError(null);
    }

    setUploading(true);
    setUploadError(null);
    const newVideos: VideoContent['videos'] = [];

    for (let i = 0; i < filesToUpload.length; i++) { // Use filesToUpload
      const file = filesToUpload[i];
      setUploadProgress(`Uploading ${i + 1} of ${filesToUpload.length}...`);

      // Check file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large (max 50MB). Please compress it first.`);
        continue;
      }

      try {
        const fileExt = file.name.split('.').pop() || 'mp4';
        const videoUuid = crypto.randomUUID();
        const videoPath = `${memorialId}/${videoUuid}.${fileExt}`;

        // 1. Upload Video via Secure API (Calculates Hash)
        const uploadResult = await secureUpload(file, 'videos', videoPath);

        if (!uploadResult.success) {
          throw new Error(`Upload failed: ${uploadResult.error}`);
        }

        const videoUrl = uploadResult.url!;
        const videoHash = uploadResult.hash; // We get the SHA-256 hash here

        // 2. Generate thumbnail (Client-side logic remains, but we upload the result)
        let thumbnailUrl = '';
        try {
          const thumbnailBlob = await generateThumbnail(file);
          const thumbnailPath = `${memorialId}/thumbnails/${videoUuid}.png`;

          // Thumbnails are less critical, can still use direct upload or secure upload
          // We'll use direct for speed on small files
          const { error: thumbError } = await supabase.storage
            .from('videos')
            .upload(thumbnailPath, thumbnailBlob, {
              contentType: 'image/png',
              upsert: false
            });

          if (!thumbError) {
            const { data: thumbPublic } = supabase.storage
              .from('videos')
              .getPublicUrl(thumbnailPath);
            thumbnailUrl = thumbPublic.publicUrl;
          }
        } catch (thumbErr) {
          console.warn('Thumbnail generation failed, using default:', thumbErr);
        }

        // 3. Get duration
        const duration = await getVideoDuration(file);

        // 4. Add to list with HASH
        newVideos.push({
          id: videoUuid,
          url: videoUrl, // Use URL from secure upload
          thumbnail: thumbnailUrl || videoUrl,
          title: file.name.replace(/\.[^/.]+$/, ''),
          description: '', // Add description field
          duration,
          sha256_hash: videoHash, // <--- STORE THE HASH
        });

      } catch (error: any) {
        console.error(`Error uploading ${file.name}:`, error);
        setUploadError(`Failed to upload "${file.name}": ${error.message}`);
      }
    }

    if (newVideos.length > 0) {
      onUpdate({ videos: [...data.videos, ...newVideos] });
    }

    setUploading(false);
    setUploadProgress('');

    // Reset input
    if (videoRef.current) videoRef.current.value = '';
  };

  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 2); // Seek to 1s or middle
      };

      video.onseeked = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          URL.revokeObjectURL(video.src);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Thumbnail generation failed'));
          }
        }, 'image/png');
      };

      video.onerror = (e) => {
        URL.revokeObjectURL(video.src);
        reject(new Error('Video load failed'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const getVideoDuration = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      video.onloadedmetadata = () => {
        const mins = Math.floor(video.duration / 60);
        const secs = Math.floor(video.duration % 60);
        URL.revokeObjectURL(video.src);
        resolve(`${mins}:${secs.toString().padStart(2, '0')}`);
      };

      video.onerror = () => {
        URL.revokeObjectURL(video.src);
        resolve("0:00");
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const removeVideo = async (id: string) => {
    if (readOnly) return; // Prevent removal if in readOnly mode
    if (!confirm('Are you sure you want to remove this video?')) return;

    // Find the video to get its path
    const video = data.videos.find(v => v.id === id);
    if (video && memorialId) {
      // Optional: Delete from storage
      try {
        // The videoPath was constructed as `${memorialId}/${videoUuid}.${fileExt}`
        // So we need to derive the path from the video.url or video.id
        // Assuming video.url contains the full path after the bucket name
        const videoPathInStorage = video.url.split('/videos/')[1]; // e.g., memorialId/uuid.mp4
        const thumbnailPathInStorage = `${memorialId}/thumbnails/${id}.png`;

        await supabase.storage.from('videos').remove([
          videoPathInStorage,
          thumbnailPathInStorage
        ]);
      } catch (err) {
        console.warn('Could not delete video from storage:', err);
      }
    }

    onUpdate({ videos: data.videos.filter(v => v.id !== id) });
  };

  const updateVideo = (id: string, field: 'title' | 'description', value: string) => {
    if (readOnly) return; // Prevent update if in readOnly mode
    onUpdate({
      videos: data.videos.map(v => (v.id === id ? { ...v, [field]: value } : v))
    });
  };

  const maxVideos = isPaid ? 20 : 3;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-12">
        <h2 className="font-serif text-4xl text-charcoal mb-3">
          Video Memories
        </h2>
        <p className="text-charcoal/60 text-lg">
          Share videos that capture their voice, spirit, and memorable moments.
        </p>
      </div>

      <div className="space-y-8">
        {/* Error Display */}
        {uploadError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 mb-1">Upload Error</p>
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="p-6 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-xl border border-sand/30">
          <h3 className="font-semibold text-charcoal mb-3 flex items-center gap-2">
            <Film size={18} className="text-terracotta" />
            📹 Video Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-charcoal/70">
            <li className="flex items-start gap-2">
              <span className="text-sage mt-0.5">•</span>
              <span><strong>Best quality:</strong> MP4 format recommended</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sage mt-0.5">•</span>
              <span><strong>File size:</strong> Maximum 50MB per video</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-terracotta mt-0.5">⚠️</span>
              <span><strong>Important:</strong> Stay on this page until upload completes!</span>
            </li>
          </ul>
        </div>

        {/* Video Grid */}
        {data.videos.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-4">
              Uploaded Videos ({data.videos.length} / {maxVideos})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {data.videos.map((video) => (
                <div
                  key={video.id}
                  className="relative p-4 bg-white border-2 border-sand/40 rounded-xl group hover:border-sage/40 transition-all"
                >
                  {/* Video Player */}
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-charcoal/10 mb-3">
                    <video
                      controls
                      preload="metadata"
                      className="w-full h-full object-cover"
                      poster={video.thumbnail}
                    >
                      <source src={video.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* Video Title & Description */}
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={video.title}
                      onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                      placeholder="Video Title"
                      className="w-full px-3 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-sm font-medium disabled:opacity-60 disabled:bg-sand/10"
                      disabled={readOnly}
                    />
                    <input
                      type="text"
                      value={video.description || ''}
                      onChange={(e) => updateVideo(video.id, 'description', e.target.value)}
                      placeholder="Description (optional)"
                      className="w-full px-3 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all text-sm disabled:opacity-60 disabled:bg-sand/10"
                      disabled={readOnly}
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex items-center justify-between text-xs text-charcoal/60 mt-2">
                    <span className="flex items-center gap-1">
                      <Film size={12} /> Video
                    </span>
                    {video.duration && (
                      <span className="flex items-center gap-1">
                        <Play size={12} />
                        {video.duration}
                      </span>
                    )}
                  </div>

                  {/* Remove Button */}
                  {!readOnly && (
                    <button
                      onClick={() => removeVideo(video.id)}
                      className="absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100 shadow-lg"
                      title="Remove video"
                    >
                      <Trash2 size={14} className="text-ivory" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!readOnly && (
          <div
            onClick={() => !uploading && data.videos.length < maxVideos && videoRef.current?.click()}
            data-tutorial="videos"
            className={`border-2 border-dashed rounded-xl p-16 text-center transition-all ${uploading
              ? 'opacity-70 cursor-wait'
              : data.videos.length >= maxVideos
                ? 'border-sand/20 cursor-not-allowed opacity-50'
                : 'border-sand/40 cursor-pointer hover:border-sage/40 hover:bg-sage/5'
              }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mb-4" />
                <p className="text-sage font-medium text-lg">{uploadProgress}</p>
                <p className="text-charcoal/60 text-sm mt-2">⚠️ Please stay on this page until upload completes</p>
              </div>
            ) : data.videos.length >= maxVideos ? (
              <>
                <div className="mb-6 relative inline-block">
                  <div className="w-24 h-24 bg-sand/20 rounded-full flex items-center justify-center">
                    <Film size={48} className="text-charcoal/30" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-charcoal/40 mb-2">
                  Maximum Videos Reached
                </h3>
                <p className="text-charcoal/40 mb-6 max-w-md mx-auto">
                  You have uploaded the maximum of {maxVideos} videos for this archive.
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-terracotta/20 to-sage/20 rounded-full flex items-center justify-center">
                    <Film size={48} className="text-charcoal/40" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  {data.videos.length === 0 ? "Upload Your First Video" : "Add More Videos"}
                </h3>
                <p className="text-charcoal/60 mb-6 max-w-md mx-auto">
                  Click here to upload video files. You can select multiple videos at once.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-xl font-medium transition-all">
                  <Upload size={20} />
                  Choose Video Files
                </div>
              </>
            )}
          </div>
        )}

        <input
          ref={videoRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden"
          disabled={uploading || readOnly}
        />
      </div>

      {/* Navigation */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={onBack}
          disabled={uploading}
          className="px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium disabled:opacity-50"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={uploading}
          className="flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all disabled:opacity-50"
        >
          {data.videos.length > 0 ? 'Save & Continue to Review →' : 'Skip Videos & Continue →'}
        </button>
      </div>

      {/* Tutorial Popup */}
      {showTutorial && (
        <TutorialPopup
          steps={tutorialSteps}
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
    </div>
  );
}