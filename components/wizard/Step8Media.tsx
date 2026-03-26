// components/wizard/Step8Media.tsx - UPDATED (No Videos - they're in Step 9 now)
'use client';
import { useRef, useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Mic, Star, Plus, X, Trash2, MousePointer } from 'lucide-react';
import { MediaLegacy } from '@/types/memorial';
import { secureUpload } from '@/lib/uploadService';


interface Step8Props {
  data: MediaLegacy;
  onUpdate: (data: MediaLegacy) => void;
  onNext: () => void;
  onBack: () => void;
  // ADD THESE PROPS
  isPaid: boolean;
  completedPathsCount: number;
  onBackToHub?: () => void;
  memorialId: string | null;
  readOnly?: boolean; // Added readOnly prop
}

import { Lock, Sparkles } from 'lucide-react'; // Import icons

export default function Step8Media({ data, onUpdate, onNext, onBack, isPaid, completedPathsCount, onBackToHub, memorialId, readOnly }: Step8Props) {
  // refs
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const interactiveGalleryRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPaywall, setShowPaywall] = useState(false);

  const handleChange = (field: keyof MediaLegacy, value: any) => {
    onUpdate({ ...dataRef.current, [field]: value });
  };



  // Cover Photo
  // Cover Photo
  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Immediate local preview (Optimistic UI)
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange('coverPhotoPreview', reader.result as string);
    };
    reader.readAsDataURL(file);

    // 2. Secure Upload
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `cover-${Date.now()}.${fileExt}`;
    // Use memorialId if available, otherwise use a temp folder (though typical flow has ID by now)
    const pathBase = memorialId || 'temp';
    const path = `${pathBase}/covers/${fileName}`;

    try {
      const result = await secureUpload(file, 'memorial-media', path); // Using a 'memorial-media' bucket
      if (result.success) {
        onUpdate({
          ...dataRef.current,
          coverPhoto: file,
          coverPhotoPreview: result.url || null,
          coverPhotoHash: result.hash
        });
      }
    } catch (error) {
      console.error('Cover photo upload failed', error);
      alert('Failed to upload cover photo');
    }
  };

  const removeCoverPhoto = () => {
    handleChange('coverPhoto', null);
    handleChange('coverPhotoPreview', null);
    if (coverPhotoRef.current) coverPhotoRef.current.value = '';
  };


  // Gallery
  // Gallery
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // VÉRIFICATION DE LIMITE
    const currentCount = data.gallery.length;
    const maxAllowed = isPaid ? Infinity : 10;
    const remaining = maxAllowed - currentCount;

    if (remaining <= 0) {
      alert(`${isPaid ? 'Maximum' : 'Draft archives are limited to'} 10 photos. ${!isPaid ? 'Activate your archive to upload unlimited photos.' : ''}`);
      return;
    }

    const filesToUpload = isPaid ? files : files.slice(0, remaining);

    if (!isPaid && files.length > remaining) {
      alert(`You tried to upload ${files.length} photos, but only ${remaining} slot(s) remaining. Uploading ${remaining} photo(s).`);
    }

    // Process all uploads concurrently
    // First: add all optimistic previews immediately
    const previewPromises = filesToUpload.map(file => {
      return new Promise<{ file: File; tempId: string; preview: string }>((resolve) => {
        const tempId = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, tempId, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    });

    const previews = await Promise.all(previewPromises);

    // Add all optimistic items to state at once
    const tempItems = previews.map(({ tempId, file, preview }) => ({
      id: tempId,
      file,
      preview,
      caption: '',
      year: '',
      type: 'photo' as const
    }));

    const currentData = dataRef.current;
    onUpdate({ ...currentData, gallery: [...(currentData.gallery || []), ...tempItems] });

    // Then: upload all files concurrently
    const uploadPromises = previews.map(async ({ file, tempId }) => {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${tempId}.${fileExt}`;
      const pathBase = memorialId || 'temp';
      const path = `${pathBase}/gallery/${fileName}`;

      try {
        const result = await secureUpload(file, 'memorial-media', path);
        if (result.success) {
          const freshData = dataRef.current;
          onUpdate({
            ...freshData,
            gallery: (freshData.gallery || []).map(item =>
              item.id === tempId
                ? { ...item, preview: result.url || item.preview, sha256_hash: result.hash }
                : item
            )
          });
        }
      } catch (err) {
        console.error("Gallery upload failed for file:", file.name, err);
      }
    });

    await Promise.all(uploadPromises);
  };

  // ... rest of logic remains similar ...
  const removeGalleryItem = (id: string) => {
    handleChange('gallery', data.gallery.filter(item => item.id !== id));
  };

  const updateGalleryItem = (id: string, field: 'caption' | 'year', value: string) => {
    handleChange(
      'gallery',
      data.gallery.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Interactive Gallery - Secure Upload & Hash
  const handleInteractiveGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // VÉRIFICATION DE LIMITE
    const currentCount = (data.interactiveGallery || []).length;
    const maxAllowed = isPaid ? Infinity : 10;
    const remaining = maxAllowed - currentCount;

    if (remaining <= 0) {
      alert(`${isPaid ? 'Maximum' : 'Draft archives are limited to'} 10 interactive photos. ${!isPaid ? 'Activate your archive to upload unlimited interactive photos.' : ''}`);
      return;
    }

    const filesToUpload = isPaid ? files : files.slice(0, remaining);

    if (!isPaid && files.length > remaining) {
      alert(`You tried to upload ${files.length} interactive photos, but only ${remaining} slot(s) remaining. Uploading ${remaining} photo(s).`);
    }

    // Process all uploads concurrently
    const previewPromises = filesToUpload.map(file => {
      return new Promise<{ file: File; tempId: string; preview: string }>((resolve) => {
        const tempId = `interactive-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, tempId, preview: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    });

    const previews = await Promise.all(previewPromises);

    // Add all optimistic items to state at once
    const tempItems = previews.map(({ tempId, file, preview }) => ({
      id: tempId,
      file,
      preview,
      description: ''
    }));

    const currentData = dataRef.current;
    onUpdate({ ...currentData, interactiveGallery: [...(currentData.interactiveGallery || []), ...tempItems] });

    // Upload all files concurrently
    const uploadPromises = previews.map(async ({ file, tempId }) => {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${tempId}.${fileExt}`;
      const pathBase = memorialId || 'temp';
      const path = `${pathBase}/interactive/${fileName}`;

      try {
        const result = await secureUpload(file, 'memorial-media', path);
        if (result.success) {
          const freshData = dataRef.current;
          onUpdate({
            ...freshData,
            interactiveGallery: (freshData.interactiveGallery || []).map((item) =>
              item.id === tempId
                ? { ...item, preview: result.url || item.preview, sha256_hash: result.hash }
                : item
            ),
          });
        }
      } catch (err) {
        console.error("Interactive upload failed:", err);
      }
    });

    await Promise.all(uploadPromises);
  };

  const removeInteractiveItem = (id: string) => {
    handleChange('interactiveGallery', (data.interactiveGallery || []).filter(item => item.id !== id));
  };

  const updateInteractiveDescription = (id: string, description: string) => {
    handleChange(
      'interactiveGallery',
      (data.interactiveGallery || []).map(item => (item.id === id ? { ...item, description } : item))
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, imageId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setHoveredImageId(imageId);
  };

  const handleMouseLeave = () => {
    setHoveredImageId(null);
  };

  // Voice Recordings
  // Voice Recordings - Secure Upload & Hash
  const handleVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // VÉRIFICATION DE LIMITE
    const currentCount = data.voiceRecordings.length;
    const maxAllowed = isPaid ? Infinity : 10;
    const remaining = maxAllowed - currentCount;

    if (remaining <= 0) {
      alert(`${isPaid ? 'Maximum' : 'Draft archives are limited to'} 10 voice recordings. ${!isPaid ? 'Activate your archive to upload unlimited recordings.' : ''}`);
      return;
    }

    const filesToUpload = isPaid ? files : files.slice(0, remaining);

    if (!isPaid && files.length > remaining) {
      alert(`You tried to upload ${files.length} recordings, but only ${remaining} slot(s) remaining. Uploading ${remaining} recording(s).`);
    }

    for (const file of filesToUpload) {
      const tempId = `voice-${Date.now()}-${Math.random()}`;
      const fileExt = file.name.split('.').pop() || 'mp3';
      const fileName = `${tempId}.${fileExt}`;
      const pathBase = memorialId || 'temp';
      const path = `${pathBase}/voice/${fileName}`;

      // Optimistic add
      const newRecording = {
        id: tempId,
        file,
        title: file.name
      };

      // Update local state
      const currentData = dataRef.current;
      onUpdate({ ...currentData, voiceRecordings: [...currentData.voiceRecordings, newRecording] });

      try {
        const result = await secureUpload(file, 'memorial-media', path);

        if (result.success) {
          const freshData = dataRef.current;
          onUpdate({
            ...freshData,
            voiceRecordings: freshData.voiceRecordings.map((item) =>
              item.id === tempId
                ? { ...item, sha256_hash: result.hash } // Add the hash
                : item
            )
          });
        }
      } catch (err) {
        console.error("Voice upload failed:", err);
      }
    }
  };

  const removeVoiceRecording = (id: string) => {
    handleChange('voiceRecordings', data.voiceRecordings.filter(v => v.id !== id));
  };

  const updateVoiceTitle = (id: string, title: string) => {
    handleChange(
      'voiceRecordings',
      data.voiceRecordings.map(v => (v.id === id ? { ...v, title } : v))
    );
  };


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-4xl text-warm-dark mb-3">
          Photos & Legacy
        </h2>
        <p className="text-warm-dark/60 text-lg">
          Add photos, voice recordings, and your final legacy statement.
        </p>
      </div>

      <div className="space-y-10">
        {/* 1. If NOT paid, show the 'Taste' limit message */}


        {/* Cover Photo */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
            <ImageIcon size={18} className="text-warm-brown" />
            Cover Photo
          </label>
          <p className="text-xs text-warm-dark/40 mb-4">
            This will be the hero background image on the memorial page
          </p>
          {!data.coverPhotoPreview ? (
            <div
              onClick={() => !readOnly && coverPhotoRef.current?.click()}
              className={`relative h-64 border-2 border-dashed border-warm-border/40 rounded-xl flex flex-col items-center justify-center transition-all overflow-hidden ${readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-olive/40 hover:bg-olive/5'}`}
            >
              <Upload className="mb-3 text-warm-dark/40" size={32} />
              <p className="text-sm text-warm-dark/60 mb-1">Click to upload cover photo</p>
              <p className="text-xs text-warm-dark/40">Recommended: Wide landscape photo (1920x1080)</p>
            </div>
          ) : (
            <div className="relative h-64 rounded-xl overflow-hidden border-2 border-warm-border/30 group">
              <img
                src={data.coverPhotoPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              {!readOnly && (
                <div className="absolute inset-0 bg-warm-dark/0 group-hover:bg-warm-dark/50 transition-all flex items-center justify-center">
                  <button
                    onClick={removeCoverPhoto}
                    className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-warm-brown hover:bg-warm-brown/90 text-surface-low rounded-lg transition-all flex items-center gap-2"
                  >
                    <X size={16} />
                    Remove Cover Photo
                  </button>
                </div>
              )}
            </div>
          )}
          <input
            ref={coverPhotoRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            className="hidden"
            disabled={readOnly}
          />
        </div>

        {/* Photo Gallery */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
            <ImageIcon size={18} className="text-olive" />
            Photo Gallery
          </label>
          <p className="text-xs text-warm-dark/40 mb-4">
            Upload photos from throughout their life
          </p>

          <div className="">
            {data.gallery.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-3 gap-4 mb-4">
                  {data.gallery.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative group"
                    >
                      <div className="aspect-square rounded-xl overflow-hidden bg-warm-border/20 border border-warm-border/30">
                        <img
                          src={item.preview}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                        {!readOnly && (
                          <button
                            onClick={() => removeGalleryItem(item.id)}
                            className="absolute top-2 right-2 p-2 bg-warm-dark/80 hover:bg-warm-dark rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                          >
                            <X size={14} className="text-surface-low" />
                          </button>
                        )}
                      </div>
                      <div className="mt-2 space-y-1">
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => updateGalleryItem(item.id, 'caption', e.target.value)}
                          placeholder="Caption (optional)"
                          className="w-full px-2 py-1 text-xs border border-warm-border/40 rounded focus:outline-none focus:ring-1 focus:ring-olive/30"
                          disabled={readOnly}
                        />
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateGalleryItem(item.id, 'year', e.target.value)}
                          placeholder="Year (optional)"
                          className="w-full px-2 py-1 text-xs border border-warm-border/40 rounded focus:outline-none focus:ring-1 focus:ring-olive/30"
                          disabled={readOnly}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {!readOnly && (
                  <button
                    onClick={() => galleryRef.current?.click()}
                    disabled={data.gallery.length >= (isPaid ? Infinity : 10)}
                    className={`w-full py-4 border-2 border-dashed rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${data.gallery.length >= (isPaid ? Infinity : 10)
                      ? 'border-warm-border/20 text-warm-dark/30 cursor-not-allowed'
                      : 'border-warm-border/40 text-warm-dark/60 hover:border-olive hover:bg-olive/5 hover:text-olive'
                      }`}
                  >
                    <Plus size={18} />
                    {data.gallery.length >= (isPaid ? Infinity : 10)
                      ? `Maximum ${isPaid ? '' : 'draft '}photos reached`
                      : 'Add More Photos'}
                  </button>
                )}
              </>
            ) : (
              <div
                onClick={() => !readOnly && galleryRef.current?.click()}
                className={`border-2 border-dashed border-warm-border/40 rounded-xl p-8 text-center transition-all ${readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-olive/40 hover:bg-olive/5'}`}
              >
                <Upload className="mx-auto mb-3 text-warm-dark/40" size={32} />
                <p className="text-sm text-warm-dark/60 mb-1">Click to upload photos</p>
                <p className="text-xs text-warm-dark/40">You can select multiple photos</p>
              </div>
            )}
          </div>



          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            className="hidden"
            disabled={readOnly}
          />
        </div>

        {/* Interactive Photo Stories */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
            <MousePointer size={18} className="text-olive" />
            Interactive Photo Stories (Optional)
          </label>
          <p className="text-xs text-warm-dark/40 mb-4">
            Special photos where moving your cursor reveals the hidden story underneath - like a magic spotlight! ✨
          </p>
          {(data.interactiveGallery && data.interactiveGallery.length > 0) ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
                {data.interactiveGallery.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div
                      className="relative aspect-video rounded-xl overflow-hidden border-2 border-warm-border/30 group"
                      onMouseMove={(e) => handleMouseMove(e, item.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'none' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="bg-gradient-to-br from-olive/20 via-surface-low/90 to-warm-brown/20 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
                          <p className="text-2xl md:text-3xl font-serif text-warm-dark leading-relaxed text-center font-medium drop-shadow-sm">
                            {item.description || 'Add your story below and hover to see the magic! ✨'}
                          </p>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          maskImage: hoveredImageId === item.id
                            ? `radial-gradient(circle 110px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                            : 'none',
                          WebkitMaskImage: hoveredImageId === item.id
                            ? `radial-gradient(circle 110px at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)`
                            : 'none',
                        }}
                      >
                        <img
                          src={item.preview}
                          alt="Interactive photo"
                          className="w-full h-full object-cover"
                          draggable={false}
                        />
                      </div>
                      {!readOnly && (
                        <button
                          onClick={() => removeInteractiveItem(item.id)}
                          className="absolute top-3 right-3 p-2.5 bg-warm-dark/90 hover:bg-warm-dark rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                          style={{ cursor: 'pointer' }}
                        >
                          <X size={16} className="text-surface-low" />
                        </button>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-warm-dark/80 mb-2">
                        📝 Hidden Story (revealed by cursor movement)
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateInteractiveDescription(item.id, e.target.value)}
                        placeholder="Example: 'This was the day she taught me how to bake her famous apple pie. I can still remember the smell of cinnamon filling the kitchen...'"
                        rows={4}
                        className="w-full px-4 py-3 text-sm border-2 border-warm-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/50 focus:border-olive transition-all resize-none font-serif"
                        disabled={readOnly}
                      />
                      <p className="text-xs text-warm-dark/40 mt-1">
                        💡 Tip: Write 2-3 sentences that tell a meaningful story about this moment
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {isPaid && !readOnly && (
                <button
                  onClick={() => interactiveGalleryRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-warm-border/40 rounded-xl text-sm font-medium text-warm-dark/60 hover:border-olive hover:bg-olive/5 hover:text-olive transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add More Interactive Photos
                </button>
              )}
            </>
          ) : (
            <div
              onClick={() => !readOnly && (isPaid ? interactiveGalleryRef.current?.click() : setShowPaywall(true))}
              className={`border-2 border-dashed border-warm-border/40 rounded-xl p-12 text-center transition-all ${readOnly ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:border-olive/40 hover:bg-olive/5'}`}
            >
              <div className="mb-4 relative inline-block">
                <MousePointer className="text-warm-dark/40 animate-pulse" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-warm-brown rounded-full flex items-center justify-center">
                  <span className="text-surface-low text-xs font-bold">✨</span>
                </div>
              </div>
              <p className="text-base font-medium text-warm-dark/70 mb-2">Create Interactive Photo Stories</p>
              {!isPaid && <Lock className="mx-auto text-warm-dark/20 mb-2" size={20} />}
              <p className="text-sm text-warm-dark/50 max-w-md mx-auto">
                Upload photos where visitors can move their cursor to reveal hidden stories - a magical way to share memories!
              </p>
            </div>
          )}
          <input
            ref={interactiveGalleryRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleInteractiveGalleryUpload}
            className="hidden"
            disabled={readOnly}
          />
        </div>

        {/* Voice Recordings */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
            <Mic size={18} className="text-olive" />
            Voice Recordings (Optional)
          </label>
          <p className="text-xs text-warm-dark/40 mb-4">
            Do you have recordings of their voice?
          </p>
          {data.voiceRecordings.length > 0 && (
            <div className="space-y-3 mb-4">
              {data.voiceRecordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center gap-3 p-4 bg-white border border-warm-border/40 rounded-xl"
                >
                  <Mic size={18} className="text-warm-brown flex-shrink-0" />
                  <input
                    type="text"
                    value={recording.title}
                    onChange={(e) => updateVoiceTitle(recording.id, e.target.value)}
                    placeholder="Recording title..."
                    className="flex-1 px-3 py-2 border border-warm-border/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-olive/30 text-sm"
                    disabled={readOnly}
                  />
                  {!readOnly && (
                    <button
                      onClick={() => removeVoiceRecording(recording.id)}
                      className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 hover:bg-warm-border/20 rounded-lg transition-all"
                    >
                      <Trash2 size={16} className="text-warm-dark/40" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {!readOnly && (
            <button
              onClick={() => isPaid ? voiceRef.current?.click() : setShowPaywall(true)}
              className="w-full py-4 border-2 border-dashed border-warm-border/40 rounded-xl text-sm font-medium text-warm-dark/60 hover:border-olive hover:bg-olive/5 hover:text-olive transition-all flex items-center justify-center gap-2"
            >
              <Upload size={18} />
              Upload Voice Recording
            </button>
          )}
          <input
            ref={voiceRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleVoiceUpload}
            className="hidden"
            disabled={readOnly}
          />
        </div>

        {/* Legacy Statement */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-warm-dark mb-4">
            <Star size={18} className="text-warm-brown" />
            Final Legacy Statement
          </label>
          <p className="text-xs text-warm-dark/40 mb-4">
            In your own words, what is their legacy? What do you want future generations to know?
          </p>
          <textarea
            value={data.legacyStatement}
            onChange={(e) => handleChange('legacyStatement', e.target.value)}
            placeholder="Write your final thoughts about their legacy and impact...

What did they stand for? How did they make the world better? What will their memory inspire in others?"
            rows={8}
            className="w-full px-6 py-4 border border-warm-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-olive/30 focus:border-olive transition-all resize-none font-serif text-base leading-relaxed disabled:opacity-60 disabled:bg-warm-border/10"
            disabled={readOnly}
          />
          <div className="mt-3 p-4 bg-gradient-to-br from-warm-brown/5 to-olive/5 rounded-lg border border-warm-border/30">
            <p className="text-xs text-warm-dark/60 leading-relaxed">
              💡 This statement will appear prominently on the memorial page. Think about what you'd want their great-grandchildren to know about them.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-4 border border-warm-border/40 rounded-xl hover:bg-warm-border/10 transition-all font-medium"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-olive hover:bg-olive/90 text-warm-bg py-4 px-6 rounded-xl font-medium transition-all"
        >
          Save & Continue →
        </button>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-warm-dark/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-olive via-warm-brown to-olive" />

            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-warm-dark/30 hover:text-warm-dark transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 bg-olive/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-olive" />
            </div>

            <h3 className="font-serif text-3xl text-warm-dark mb-4">Unlock The Full Presence</h3>
            <p className="text-warm-dark/60 mb-8 leading-relaxed">
              You've started their story beautifully. Drafts are limited to one photo to preserve the sanctity of the archive.
              <br /><br />
              Unlock **unlimited photos**, **high-definition videos**, and **voice recordings** by publishing this memorial forever.
            </p>

            <div className="space-y-4">
              <button
                onClick={onBackToHub}
                className="w-full py-4 bg-warm-brown text-surface-low rounded-xl font-bold hover:shadow-xl transition-all shadow-lg"
              >
                Become a Permanent Guardian ($1,470)
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-4 text-warm-dark/40 hover:text-warm-dark font-medium transition-all"
              >
                I'll keep working on the story for now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}