// components/wizard/Step10Review.tsx
// Step 1.3.1 + 1.3.2: No gamification, exploration vocabulary
'use client';

import { useState } from 'react';
import {
  Edit, Eye, Send, ArrowLeft, User, Home, Briefcase, Heart,
  Sparkles, BookOpen, MessageCircle, Image as ImageIcon, Film,
  Users, Shield, Gift, X
} from 'lucide-react';
import { MemorialData } from '@/types/memorial';
import { calculateCompletion } from '@/lib/completionLogic';
import { createFullSnapshot } from '@/lib/versionService';
import PreviewModal from './PreviewModal';
import SuccessorSettings from '@/components/SuccessorSettings';

interface Step10Props {
  data: MemorialData;
  memorialId: string | null;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
  isSelfArchive?: boolean;
  hasSuccessor?: boolean;
  userId?: string;
}

const STEP_ICONS: Record<number, any> = {
  1: User, 2: Home, 3: Briefcase, 4: Heart,
  5: Sparkles, 6: BookOpen, 7: MessageCircle, 8: ImageIcon, 9: Film,
};

export default function Step10Review({
  data,
  memorialId,
  onBack,
  onJumpToStep,
  isSelfArchive = false,
  hasSuccessor = false,
  userId = ''
}: Step10Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessorModal, setShowSuccessorModal] = useState(false);

  const completion = calculateCompletion(data);

  const isBlockedBySuccessor = isSelfArchive && !hasSuccessor;

  const handlePublish = async () => {
    setIsPublishing(true);

    if (memorialId) {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await createFullSnapshot({
        memorialId,
        data,
        userId: user?.id || undefined,
        userName: 'Owner',
        changeSummary: 'Archive activated',
        changeType: 'manual',
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = '/success';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        {/* Step 1.3.2: "Review & Seal" instead of "Review & Publish" */}
        <h2 className="font-serif text-4xl text-warm-dark mb-3">
          Review & Seal
        </h2>
        <p className="text-warm-dark/50 text-lg">
          Look over what you have built. When you are ready, seal the archive.
        </p>
      </div>

      {/* ========================================= */}
      {/* STATUS — Step 1.3.1: No percentages       */}
      {/* Qualitative message only                  */}
      {/* ========================================= */}
      <div className={`mb-10 p-6 rounded-xl border ${
        completion.status === 'complete' || completion.status === 'complete_solo'
          ? 'bg-surface-low border-warm-border/30'
          : 'bg-warm-border/5 border-warm-border/20'
      }`}>
        <p className="text-sm text-warm-dark/60 leading-relaxed">
          {completion.message}
        </p>

        {/* Step 1.3.2: Qualitative path indicators instead of progress bar */}
        <div className="flex flex-wrap gap-3 mt-4">
          {(['Facts', 'Body', 'Soul', 'Presence', 'Witnesses'] as const).map((pathName, i) => {
            const pathSteps: Record<string, number[]> = {
              Facts: [1], Body: [2, 3, 4], Soul: [5, 6], Presence: [8, 9], Witnesses: [7]
            };
            const stepsForPath = pathSteps[pathName];
            const pathCompleted = stepsForPath.every(s =>
              completion.steps.find(st => st.step === s)?.completed
            );
            const pathStarted = stepsForPath.some(s =>
              completion.steps.find(st => st.step === s)?.completed
            );

            return (
              <div key={pathName} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${
                  pathCompleted ? 'bg-warm-dark/40' : pathStarted ? 'bg-warm-dark/15' : 'bg-warm-border/40'
                }`} />
                <span className={`text-xs ${
                  pathCompleted ? 'text-warm-dark/50' : 'text-warm-dark/25'
                }`}>
                  {pathName}{pathCompleted ? ' — traveled' : pathStarted ? ' — begun' : ''}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELF-ARCHIVE SUCCESSOR WARNING */}
      {isBlockedBySuccessor && (
        <div className="mb-10 p-6 bg-warm-border/5 border border-warm-brown/20 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-warm-brown/10 rounded-full text-warm-brown shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-warm-dark mb-2">Successor Designation Required</h3>
              <p className="text-warm-dark/60 text-sm mb-4 leading-relaxed">
                Since this is your own archive, you must designate an Archive Steward before sealing.
                This ensures your archive is not lost. Your steward will only gain access after verification.
              </p>
              <button
                onClick={() => setShowSuccessorModal(true)}
                className="px-6 py-3 bg-warm-brown text-surface-low rounded-lg font-medium hover:bg-warm-brown/90 transition-all flex items-center gap-2"
              >
                <Users size={18} />
                Designate a Successor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* CORE SECTIONS — Step 1.3.2: "Paths"       */}
      {/* ========================================= */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-warm-dark/30 uppercase tracking-wider">
          Core Paths
        </h3>
      </div>
      <div className="space-y-3 mb-10">
        {completion.steps
          .filter(s => s.category === 'core')
          .map((section) => {
            const Icon = STEP_ICONS[section.step] || User;
            return (
              <div
                key={section.step}
                className={`p-5 rounded-xl border transition-all ${section.completed
                  ? 'bg-white border-warm-border/20'
                  : 'bg-warm-border/5 border-warm-border/15'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-warm-border/10 flex items-center justify-center">
                    <Icon size={20} className="text-warm-dark/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-medium text-warm-dark text-sm">{section.title}</h4>
                        <p className="text-xs text-warm-dark/40 mt-0.5">{section.summary}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        section.completed ? 'bg-warm-dark/30' : 'bg-warm-border/30'
                      }`} />
                    </div>
                    <button
                      onClick={() => onJumpToStep(section.step)}
                      className="text-xs text-warm-dark/30 hover:text-warm-dark/50 transition-colors flex items-center gap-1.5 mt-1"
                    >
                      <Edit size={12} />
                      {section.completed ? 'Revisit this path' : 'Explore this path'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ========================================= */}
      {/* ENRICHMENT SECTIONS                       */}
      {/* ========================================= */}
      <div className="mb-4">
        <h3 className="text-xs font-medium text-warm-dark/30 uppercase tracking-wider flex items-center gap-2">
          <Gift size={12} />
          Optional Enrichments
        </h3>
        <p className="text-[11px] text-warm-dark/20 mt-1">
          These paths are not required. Add them at any time.
        </p>
      </div>
      <div className="space-y-3 mb-10">
        {completion.steps
          .filter(s => s.category === 'enrichment')
          .map((section) => {
            const Icon = STEP_ICONS[section.step] || User;
            return (
              <div
                key={section.step}
                className={`p-5 rounded-xl border transition-all ${section.completed
                  ? 'bg-white border-warm-border/20'
                  : 'bg-surface-low border-dashed border-warm-border/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-warm-border/10 flex items-center justify-center">
                    <Icon size={20} className="text-warm-dark/25" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-medium text-warm-dark text-sm">{section.title}</h4>
                        <p className="text-xs text-warm-dark/40 mt-0.5">{section.summary}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        section.completed ? 'bg-warm-dark/20' : 'bg-transparent border border-warm-border/30'
                      }`} />
                    </div>
                    <button
                      onClick={() => onJumpToStep(section.step)}
                      className="text-xs text-warm-dark/25 hover:text-warm-dark/40 transition-colors flex items-center gap-1.5 mt-1"
                    >
                      <Edit size={12} />
                      {section.completed ? 'Revisit' : 'Add this enrichment'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ========================================= */}
      {/* ACTION BUTTONS — Step 1.3.2 vocabulary    */}
      {/* ========================================= */}
      <div className="space-y-4">
        <button
          onClick={() => setShowPreview(true)}
          className="w-full py-4 px-6 bg-white border border-warm-border/30 rounded-xl text-warm-dark/60 font-medium hover:bg-warm-border/5 transition-all flex items-center justify-center gap-2"
        >
          <Eye size={20} />
          Preview the Archive
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing || !completion.canPublish || isBlockedBySuccessor}
          className={`w-full py-5 px-6 rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-lg ${isPublishing || !completion.canPublish || isBlockedBySuccessor
            ? 'bg-warm-border/20 text-warm-dark/30 cursor-not-allowed'
            : 'bg-warm-dark hover:bg-warm-dark/90 text-surface-low'
          }`}
        >
          {isPublishing ? (
            <>
              <div className="w-5 h-5 border-2 border-surface-low/30 border-t-warm-bg rounded-full animate-spin" />
              Sealing...
            </>
          ) : (
            <>
              <Send size={20} />
              Seal the Archive
            </>
          )}
        </button>

        {!completion.canPublish && (
          <p className="text-xs text-center text-warm-dark/30">
            Begin with the Facts before sealing the archive
          </p>
        )}

        {isBlockedBySuccessor && (
          <p className="text-xs text-center text-warm-brown/60 font-medium">
            You must designate a successor before sealing
          </p>
        )}

        <button
          onClick={onBack}
          className="w-full py-3 px-6 border border-warm-border/20 rounded-xl hover:bg-warm-border/5 transition-all flex items-center justify-center gap-2 text-warm-dark/40 text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Step 1.1.3: Silent auto-save note */}
      <div className="mt-8 p-4 bg-warm-border/5 rounded-lg text-center">
        <p className="text-xs text-warm-dark/25">
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-warm-dark/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <button
              onClick={() => setShowSuccessorModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-warm-border/20 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-warm-dark/60" />
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
