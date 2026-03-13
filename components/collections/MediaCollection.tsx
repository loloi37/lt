'use client';

import { useState, useRef } from 'react';
import { Image as ImageIcon, Film, Mic, Upload, Trash2, Plus } from 'lucide-react';
import type { MediaData } from '@/types/memorial';
import IntegrityBadge from '@/components/IntegrityBadge';

interface MediaCollectionProps {
  data: MediaData;
  onChange: (data: MediaData) => void;
  memorialId: string | null;
}

type Tab = 'photos' | 'videos' | 'voice';

export default function MediaCollection({ data, onChange, memorialId }: MediaCollectionProps) {
  const [activeTab, setActiveTab] = useState<Tab>('photos');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const TABS: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'photos', label: 'Photos', icon: ImageIcon, count: data.gallery.length },
    { key: 'videos', label: 'Videos', icon: Film, count: data.videos.length },
    { key: 'voice', label: 'Voice', icon: Mic, count: data.voiceRecordings.length },
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = await Promise.all(
      Array.from(files).map(async (file) => {
        const preview = URL.createObjectURL(file);
        // SHA-256 hash is computed by uploadService when saving
        return {
          id: crypto.randomUUID(),
          file,
          preview,
          caption: '',
          year: '',
          type: 'photo' as const,
        };
      })
    );

    onChange({ ...data, gallery: [...data.gallery, ...newPhotos] });
    e.target.value = '';
  };

  const removePhoto = (id: string) => {
    onChange({ ...data, gallery: data.gallery.filter(p => p.id !== id) });
  };

  const updatePhotoCaption = (id: string, caption: string) => {
    onChange({
      ...data,
      gallery: data.gallery.map(p => p.id === id ? { ...p, caption } : p),
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tab navigation */}
      <div className="flex gap-2 mb-10">
        {TABS.map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === key
                ? 'bg-charcoal text-ivory'
                : 'bg-sand/10 text-charcoal/50 hover:bg-sand/20'
            }`}
          >
            <Icon size={14} />
            {label}
            {count > 0 && (
              <span className="text-xs opacity-60">({count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Photos Tab */}
      {activeTab === 'photos' && (
        <div>
          {/* Upload area */}
          <div
            onClick={() => photoInputRef.current?.click()}
            className="mb-8 border-2 border-dashed border-sand/30 rounded-xl p-12 text-center cursor-pointer hover:border-charcoal/20 transition-colors"
          >
            <Upload size={32} className="mx-auto text-charcoal/20 mb-3" />
            <p className="text-sm text-charcoal/40">Drop photos here or click to upload</p>
            <p className="text-xs text-charcoal/20 mt-1">All files are cryptographically signed for authenticity</p>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* Photo grid */}
          {data.gallery.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.gallery.filter(p => p.type === 'photo').map((photo) => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-sand/20">
                  <div className="aspect-square bg-sand/10">
                    <img
                      src={photo.preview}
                      alt={photo.caption || 'Memorial photo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <IntegrityBadge hash={photo.sha256_hash} />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="p-1.5 bg-white/90 rounded-full text-charcoal/50 hover:text-charcoal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="p-3">
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updatePhotoCaption(photo.id, e.target.value)}
                      className="w-full text-xs text-charcoal/60 bg-transparent border-none focus:outline-none placeholder:text-charcoal/20"
                      placeholder="Add a caption..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {data.gallery.length === 0 && (
            <div className="text-center py-16">
              <ImageIcon size={48} className="mx-auto text-charcoal/10 mb-4" />
              <p className="text-sm text-charcoal/30">No photos yet. Upload photos to preserve them forever.</p>
            </div>
          )}
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div>
          <div className="space-y-4">
            {data.videos.map((video, i) => (
              <div key={video.id} className="p-4 border border-sand/20 rounded-lg flex items-start gap-4">
                {video.thumbnail && (
                  <div className="w-24 h-16 rounded overflow-hidden bg-sand/10 flex-shrink-0">
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={video.title}
                    onChange={(e) => {
                      const updated = [...data.videos];
                      updated[i] = { ...video, title: e.target.value };
                      onChange({ ...data, videos: updated });
                    }}
                    className="w-full px-3 py-1.5 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                    placeholder="Video title"
                  />
                  <input
                    type="text"
                    value={video.description || ''}
                    onChange={(e) => {
                      const updated = [...data.videos];
                      updated[i] = { ...video, description: e.target.value };
                      onChange({ ...data, videos: updated });
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-sand/30 rounded bg-white text-charcoal/60 focus:outline-none"
                    placeholder="Brief description"
                  />
                </div>
                <button
                  onClick={() => onChange({ ...data, videos: data.videos.filter((_, j) => j !== i) })}
                  className="text-charcoal/20 hover:text-charcoal/40"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          {data.videos.length === 0 && (
            <div className="text-center py-16">
              <Film size={48} className="mx-auto text-charcoal/10 mb-4" />
              <p className="text-sm text-charcoal/30">No videos yet.</p>
            </div>
          )}
        </div>
      )}

      {/* Voice Tab */}
      {activeTab === 'voice' && (
        <div>
          {data.voiceRecordings.map((rec, i) => (
            <div key={rec.id} className="p-4 border border-sand/20 rounded-lg flex items-center gap-4 mb-3">
              <Mic size={20} className="text-charcoal/30" />
              <input
                type="text"
                value={rec.title}
                onChange={(e) => {
                  const updated = [...data.voiceRecordings];
                  updated[i] = { ...rec, title: e.target.value };
                  onChange({ ...data, voiceRecordings: updated });
                }}
                className="flex-1 px-3 py-1.5 text-sm border border-sand/30 rounded bg-white text-charcoal focus:outline-none"
                placeholder="Recording title"
              />
              <IntegrityBadge hash={rec.sha256_hash} className="relative" />
            </div>
          ))}

          {data.voiceRecordings.length === 0 && (
            <div className="text-center py-16">
              <Mic size={48} className="mx-auto text-charcoal/10 mb-4" />
              <p className="text-sm text-charcoal/30">No voice recordings yet.</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs text-charcoal/20">Your work is saved automatically.</p>
      </div>
    </div>
  );
}
