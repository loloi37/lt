// components/wizard/Step8Media.tsx - UPDATED (No Videos - they're in Step 9 now)
'use client';
import { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, Mic, Star, Plus, X, Trash2, MousePointer } from 'lucide-react';
import { MediaLegacy } from '@/types/memorial';

interface Step8Props {
  data: MediaLegacy;
  onUpdate: (data: MediaLegacy) => void;
  onNext: () => void;
  onBack: () => void;
  // ADD THESE PROPS
  isPaid: boolean;
  completedPathsCount: number;
  onBackToHub?: () => void;
}

import { Lock, Sparkles } from 'lucide-react'; // Import icons

export default function Step8Media({ data, onUpdate, onNext, onBack, isPaid, completedPathsCount, onBackToHub }: Step8Props) {
  // refs
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const interactiveGalleryRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);

  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showPaywall, setShowPaywall] = useState(false);

  const handleChange = (field: keyof MediaLegacy, value: any) => {
    onUpdate({ ...data, [field]: value });
  };



  // Cover Photo
  const handleCoverPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('coverPhoto', file);
        handleChange('coverPhotoPreview', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverPhoto = () => {
    handleChange('coverPhoto', null);
    handleChange('coverPhotoPreview', null);
    if (coverPhotoRef.current) coverPhotoRef.current.value = '';
  };


  // Gallery
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // We REMOVED the check (!canUploadMore). We WANT them to upload now.
    // The restriction will happen visually in the Mirror (Blur), not here.

    const files = Array.from(e.target.files || []);
    const newPhotos: typeof data.gallery = [];
    let processed = 0;

    // Upload ALL files (remove the slice/limit logic)
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push({
          id: `photo-${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result as string,
          caption: '',
          year: '',
          type: 'photo' as const
        });
        processed++;
        if (processed === files.length) {
          handleChange('gallery', [...data.gallery, ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
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

  // Interactive Gallery
  const handleInteractiveGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPhotos: typeof data.interactiveGallery = [];
    let processed = 0;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPhotos.push({
          id: `interactive-${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result as string,
          description: ''
        });
        processed++;
        if (processed === files.length) {
          handleChange('interactiveGallery', [...(data.interactiveGallery || []), ...newPhotos]);
        }
      };
      reader.readAsDataURL(file);
    });
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
  const handleVoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const newRecording = {
        id: `voice-${Date.now()}-${Math.random()}`,
        file,
        title: file.name
      };
      handleChange('voiceRecordings', [...data.voiceRecordings, newRecording]);
    });
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
        <h2 className="font-serif text-4xl text-charcoal mb-3">
          Photos & Legacy
        </h2>
        <p className="text-charcoal/60 text-lg">
          Add photos, voice recordings, and your final legacy statement.
        </p>
      </div>

      <div className="space-y-10">
        {/* 1. If NOT paid, show the 'Taste' limit message */}


        {/* Cover Photo */}
        <div className={!isPaid && data.coverPhotoPreview ? "opacity-50 pointer-events-none" : ""}>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
            <ImageIcon size={18} className="text-terracotta" />
            Cover Photo
          </label>
          <p className="text-xs text-charcoal/40 mb-4">
            This will be the hero background image on the memorial page
          </p>
          {!data.coverPhotoPreview ? (
            <div
              onClick={() => coverPhotoRef.current?.click()}
              className="relative h-64 border-2 border-dashed border-sand/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all overflow-hidden"
            >
              <Upload className="mb-3 text-charcoal/40" size={32} />
              <p className="text-sm text-charcoal/60 mb-1">Click to upload cover photo</p>
              <p className="text-xs text-charcoal/40">Recommended: Wide landscape photo (1920x1080)</p>
            </div>
          ) : (
            <div className="relative h-64 rounded-xl overflow-hidden border-2 border-sand/30 group">
              <img
                src={data.coverPhotoPreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/50 transition-all flex items-center justify-center">
                <button
                  onClick={removeCoverPhoto}
                  className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg transition-all flex items-center gap-2"
                >
                  <X size={16} />
                  Remove Cover Photo
                </button>
              </div>
            </div>
          )}
          <input
            ref={coverPhotoRef}
            type="file"
            accept="image/*"
            onChange={handleCoverPhotoUpload}
            className="hidden"
          />
        </div>

        {/* Photo Gallery */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
            <ImageIcon size={18} className="text-sage" />
            Photo Gallery
          </label>
          <p className="text-xs text-charcoal/40 mb-4">
            Upload photos from throughout their life
          </p>

          <div className="">
            {data.gallery.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {data.gallery.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="aspect-square rounded-xl overflow-hidden bg-sand/20 border border-sand/30">
                        <img
                          src={item.preview}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeGalleryItem(item.id)}
                        className="absolute top-2 right-2 p-2 bg-charcoal/80 hover:bg-charcoal rounded-full transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                      >
                        <X size={14} className="text-ivory" />
                      </button>

                      <div className="mt-2 space-y-1">
                        <input
                          type="text"
                          value={item.caption}
                          onChange={(e) => updateGalleryItem(item.id, 'caption', e.target.value)}
                          placeholder="Caption (optional)"
                          className="w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                        />
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => updateGalleryItem(item.id, 'year', e.target.value)}
                          placeholder="Year (optional)"
                          className="w-full px-2 py-1 text-xs border border-sand/40 rounded focus:outline-none focus:ring-1 focus:ring-sage/30"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => galleryRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add More Photos
                </button>
              </>
            ) : (
              <div
                onClick={() => galleryRef.current?.click()}
                className="border-2 border-dashed border-sand/40 rounded-xl p-8 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all"
              >
                <Upload className="mx-auto mb-3 text-charcoal/40" size={32} />
                <p className="text-sm text-charcoal/60 mb-1">Click to upload photos</p>
                <p className="text-xs text-charcoal/40">You can select multiple photos</p>
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
          />
        </div>

        {/* Interactive Photo Stories */}
        <div className={!isPaid && (data.interactiveGallery?.length || 0) >= 1 ? "opacity-50 pointer-events-none" : ""}>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
            <MousePointer size={18} className="text-sage" />
            Interactive Photo Stories (Optional)
          </label>
          <p className="text-xs text-charcoal/40 mb-4">
            Special photos where moving your cursor reveals the hidden story underneath - like a magic spotlight! ✨
          </p>
          {(data.interactiveGallery && data.interactiveGallery.length > 0) ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                {data.interactiveGallery.map((item) => (
                  <div key={item.id} className="space-y-3">
                    <div
                      className="relative aspect-video rounded-xl overflow-hidden border-2 border-sand/30 group"
                      onMouseMove={(e) => handleMouseMove(e, item.id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ cursor: 'none' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="bg-gradient-to-br from-sage/20 via-ivory/90 to-terracotta/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
                          <p className="text-xl md:text-2xl font-serif text-charcoal leading-relaxed text-center font-medium drop-shadow-sm">
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
                      <button
                        onClick={() => removeInteractiveItem(item.id)}
                        className="absolute top-3 right-3 p-2.5 bg-charcoal/90 hover:bg-charcoal rounded-full transition-all opacity-0 group-hover:opacity-100 z-20 shadow-lg"
                        style={{ cursor: 'pointer' }}
                      >
                        <X size={16} className="text-ivory" />
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-charcoal/80 mb-2">
                        📝 Hidden Story (revealed by cursor movement)
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateInteractiveDescription(item.id, e.target.value)}
                        placeholder="Example: 'This was the day she taught me how to bake her famous apple pie. I can still remember the smell of cinnamon filling the kitchen...'"
                        rows={4}
                        className="w-full px-4 py-3 text-sm border-2 border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50 focus:border-sage transition-all resize-none font-serif"
                      />
                      <p className="text-xs text-charcoal/40 mt-1">
                        💡 Tip: Write 2-3 sentences that tell a meaningful story about this moment
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {isPaid && (
                <button
                  onClick={() => interactiveGalleryRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add More Interactive Photos
                </button>
              )}
            </>
          ) : (
            <div
              onClick={() => isPaid ? interactiveGalleryRef.current?.click() : setShowPaywall(true)}
              className="border-2 border-dashed border-sand/40 rounded-xl p-12 text-center cursor-pointer hover:border-sage/40 hover:bg-sage/5 transition-all"
            >
              <div className="mb-4 relative inline-block">
                <MousePointer className="text-charcoal/40 animate-pulse" size={48} />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-terracotta rounded-full flex items-center justify-center">
                  <span className="text-ivory text-xs font-bold">✨</span>
                </div>
              </div>
              <p className="text-base font-medium text-charcoal/70 mb-2">Create Interactive Photo Stories</p>
              {!isPaid && <Lock className="mx-auto text-charcoal/20 mb-2" size={20} />}
              <p className="text-sm text-charcoal/50 max-w-md mx-auto">
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
          />
        </div>

        {/* Voice Recordings */}
        <div className={!isPaid && data.voiceRecordings.length >= 1 ? "opacity-50 pointer-events-none" : ""}>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
            <Mic size={18} className="text-sage" />
            Voice Recordings (Optional)
          </label>
          <p className="text-xs text-charcoal/40 mb-4">
            Do you have recordings of their voice?
          </p>
          {data.voiceRecordings.length > 0 && (
            <div className="space-y-3 mb-4">
              {data.voiceRecordings.map((recording) => (
                <div
                  key={recording.id}
                  className="flex items-center gap-3 p-4 bg-white border border-sand/40 rounded-xl"
                >
                  <Mic size={18} className="text-terracotta flex-shrink-0" />
                  <input
                    type="text"
                    value={recording.title}
                    onChange={(e) => updateVoiceTitle(recording.id, e.target.value)}
                    placeholder="Recording title..."
                    className="flex-1 px-3 py-2 border border-sand/40 rounded-lg focus:outline-none focus:ring-1 focus:ring-sage/30 text-sm"
                  />
                  <button
                    onClick={() => removeVoiceRecording(recording.id)}
                    className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 p-2 hover:bg-sand/20 rounded-lg transition-all"
                  >
                    <Trash2 size={16} className="text-charcoal/40" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => isPaid ? voiceRef.current?.click() : setShowPaywall(true)}
            className="w-full py-4 border-2 border-dashed border-sand/40 rounded-xl text-sm font-medium text-charcoal/60 hover:border-sage hover:bg-sage/5 hover:text-sage transition-all flex items-center justify-center gap-2"
          >
            <Upload size={18} />
            Upload Voice Recording
          </button>
          <input
            ref={voiceRef}
            type="file"
            accept="audio/*"
            multiple
            onChange={handleVoiceUpload}
            className="hidden"
          />
        </div>

        {/* Legacy Statement */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal mb-4">
            <Star size={18} className="text-terracotta" />
            Final Legacy Statement
          </label>
          <p className="text-xs text-charcoal/40 mb-4">
            In your own words, what is their legacy? What do you want future generations to know?
          </p>
          <textarea
            value={data.legacyStatement}
            onChange={(e) => handleChange('legacyStatement', e.target.value)}
            placeholder="Write your final thoughts about their legacy and impact...

What did they stand for? How did they make the world better? What will their memory inspire in others?"
            rows={8}
            className="w-full px-6 py-4 border border-sand/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/30 focus:border-sage transition-all resize-none font-serif text-base leading-relaxed"
          />
          <div className="mt-3 p-4 bg-gradient-to-br from-terracotta/5 to-sage/5 rounded-lg border border-sand/30">
            <p className="text-xs text-charcoal/60 leading-relaxed">
              💡 This statement will appear prominently on the memorial page. Think about what you'd want their great-grandchildren to know about them.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex gap-4">
        <button
          onClick={onBack}
          className="px-6 py-4 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium"
        >
          ← Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 bg-terracotta hover:bg-terracotta/90 text-ivory py-4 px-6 rounded-xl font-medium transition-all"
        >
          Save & Continue →
        </button>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sage via-terracotta to-sage" />

            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-charcoal/30 hover:text-charcoal transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-20 h-20 bg-sage/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles size={40} className="text-sage" />
            </div>

            <h3 className="font-serif text-3xl text-charcoal mb-4">Unlock The Full Presence</h3>
            <p className="text-charcoal/60 mb-8 leading-relaxed">
              You've started their story beautifully. Drafts are limited to one photo to preserve the sanctity of the archive.
              <br /><br />
              Unlock **unlimited photos**, **high-definition videos**, and **voice recordings** by publishing this memorial forever.
            </p>

            <div className="space-y-4">
              <button
                onClick={onBackToHub}
                className="w-full py-4 bg-terracotta text-ivory rounded-xl font-bold hover:shadow-xl transition-all shadow-lg"
              >
                Become a Permanent Guardian ($1,500)
              </button>
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full py-4 text-charcoal/40 hover:text-charcoal font-medium transition-all"
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