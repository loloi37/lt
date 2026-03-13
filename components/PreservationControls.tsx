'use client';

import { useState } from 'react';
import { Eye, Send, ArrowLeft, Shield, Users, Lock } from 'lucide-react';
import type { MemorialData } from '@/types/memorial';
import PreviewModal from '@/components/wizard/PreviewModal';
import SuccessorSettings from '@/components/SuccessorSettings';

interface PreservationControlsProps {
  data: MemorialData;
  memorialId: string | null;
  onBack: () => void;
  isSelfArchive?: boolean;
  hasSuccessor?: boolean;
  userId?: string;
}

export default function PreservationControls({
  data,
  memorialId,
  onBack,
  isSelfArchive = false,
  hasSuccessor = false,
  userId = '',
}: PreservationControlsProps) {
  const [isPreserving, setIsPreserving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessorModal, setShowSuccessorModal] = useState(false);

  const hasBasicInfo = !!data.stories.fullName;
  const isBlockedBySuccessor = isSelfArchive && !hasSuccessor;
  const canPreserve = hasBasicInfo && !isBlockedBySuccessor;

  // Content summary
  const summary = {
    hasStory: !!data.stories.biography || !!data.stories.legacyStatement,
    photoCount: data.media.gallery.length,
    videoCount: data.media.videos.length,
    eventCount: data.timeline.majorLifeEvents.length,
    familyCount: data.network.partners.length + data.network.children.length,
    letterCount: data.letters.length,
  };

  const handlePreserve = async () => {
    if (!memorialId) return;
    setIsPreserving(true);

    // Navigate to the preservation gate (payment/education page)
    window.location.href = `/preservation-gate?memorial=${memorialId}`;
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="font-serif text-4xl text-charcoal mb-3">
          Review & Preserve
        </h2>
        <p className="text-charcoal/50 text-lg">
          Take a moment to look over what you have created. When you are ready, preserve it forever.
        </p>
      </div>

      {/* Content Summary */}
      <div className="mb-10 p-6 bg-ivory rounded-xl border border-sand/20">
        <h3 className="text-xs text-charcoal/40 uppercase tracking-wider mb-4">What You&apos;ve Built</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: 'Name', value: data.stories.fullName || '—', show: true },
            { label: 'Life Story', value: summary.hasStory ? 'Written' : 'Not yet', show: true },
            { label: 'Photos', value: `${summary.photoCount}`, show: true },
            { label: 'Videos', value: `${summary.videoCount}`, show: summary.videoCount > 0 },
            { label: 'Life Events', value: `${summary.eventCount}`, show: summary.eventCount > 0 },
            { label: 'Family Members', value: `${summary.familyCount}`, show: summary.familyCount > 0 },
            { label: 'Future Letters', value: `${summary.letterCount}`, show: summary.letterCount > 0 },
          ].filter(s => s.show).map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-charcoal/30">{label}</p>
              <p className="text-sm text-charcoal font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Self-archive successor warning */}
      {isBlockedBySuccessor && (
        <div className="mb-10 p-6 bg-sand/5 border border-stone/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-stone/10 rounded-full text-stone shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-charcoal mb-2">Successor Required</h3>
              <p className="text-charcoal/60 text-sm mb-4 leading-relaxed">
                Since this is your own archive, you must designate an Archive Steward before preserving.
                This ensures your archive is not lost.
              </p>
              <button
                onClick={() => setShowSuccessorModal(true)}
                className="px-6 py-3 bg-stone text-ivory rounded-lg font-medium hover:bg-stone/90 transition-all flex items-center gap-2"
              >
                <Users size={18} />
                Designate a Successor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-4">
        <button
          onClick={() => setShowPreview(true)}
          className="w-full py-4 px-6 bg-white border border-sand/30 rounded-xl text-charcoal/60 font-medium hover:bg-sand/5 transition-all flex items-center justify-center gap-2"
        >
          <Eye size={20} />
          Preview the Memorial
        </button>

        <button
          onClick={handlePreserve}
          disabled={isPreserving || !canPreserve}
          className={`w-full py-5 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-lg ${
            isPreserving || !canPreserve
              ? 'bg-sand/20 text-charcoal/30 cursor-not-allowed'
              : 'bg-charcoal hover:bg-charcoal/90 text-ivory'
          }`}
        >
          {isPreserving ? (
            <>
              <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Lock size={20} />
              Preserve Forever
            </>
          )}
        </button>

        {!hasBasicInfo && (
          <p className="text-xs text-center text-charcoal/30">
            Add a name to begin preserving
          </p>
        )}

        <button
          onClick={onBack}
          className="w-full py-3 px-6 border border-sand/20 rounded-xl hover:bg-sand/5 transition-all flex items-center justify-center gap-2 text-charcoal/40 text-sm"
        >
          <ArrowLeft size={16} />
          Back to editing
        </button>
      </div>

      <div className="mt-8 p-4 bg-sand/5 rounded-lg text-center">
        <p className="text-xs text-charcoal/25">
          Your work is automatically saved. You can close this page and return anytime.
        </p>
      </div>

      {showPreview && (
        <PreviewModal
          data={data}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showSuccessorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setShowSuccessorModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-sand/20 rounded-full transition-colors z-10"
            >
              <span className="text-charcoal/60 text-xl">&times;</span>
            </button>
            <div className="max-h-[90vh] overflow-y-auto">
              <SuccessorSettings userId={userId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
