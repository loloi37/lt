// components/wizard/Step10Review.tsx — UPDATED Step 1.1.3
// Changes: Uses centralized completion logic, shows "complete" even without witnesses
'use client';

import { useState } from 'react';
import {
  CheckCircle, Edit, Eye, Send, ArrowLeft, User, Home, Briefcase, Heart,
  Sparkles, BookOpen, MessageCircle, Image as ImageIcon, Film, AlertCircle,
  Users, Shield, Gift, PartyPopper
} from 'lucide-react';
import { MemorialData } from '@/types/memorial';
import { calculateCompletion, isEnrichmentStep } from '@/lib/completionLogic';
import { createFullSnapshot } from '@/lib/versionService';
import PreviewModal from './PreviewModal';

interface Step10Props {
  data: MemorialData;
  memorialId: string | null;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
}

// Map step numbers to icons
const STEP_ICONS: Record<number, any> = {
  1: User,
  2: Home,
  3: Briefcase,
  4: Heart,
  5: Sparkles,
  6: BookOpen,
  7: MessageCircle,
  8: ImageIcon,
  9: Film,
};

const STEP_COLORS: Record<number, { text: string; bg: string }> = {
  1: { text: 'text-terracotta', bg: 'bg-terracotta/10' },
  2: { text: 'text-sage', bg: 'bg-sage/10' },
  3: { text: 'text-terracotta', bg: 'bg-terracotta/10' },
  4: { text: 'text-sage', bg: 'bg-sage/10' },
  5: { text: 'text-terracotta', bg: 'bg-terracotta/10' },
  6: { text: 'text-sage', bg: 'bg-sage/10' },
  7: { text: 'text-terracotta', bg: 'bg-terracotta/10' },
  8: { text: 'text-sage', bg: 'bg-sage/10' },
  9: { text: 'text-terracotta', bg: 'bg-terracotta/10' },
};

export default function Step10Review({ data, memorialId, onBack, onJumpToStep }: Step10Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Use centralized completion logic
  const completion = calculateCompletion(data);

  const handlePublish = async () => {
    setIsPublishing(true);

    // Create a full snapshot as a milestone
    if (memorialId) {
      const userId = localStorage.getItem('user-id');
      await createFullSnapshot({
        memorialId,
        data,
        userId: userId || undefined,
        userName: 'Owner',
        changeSummary: 'Memorial published',
        changeType: 'manual',
      });
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = '/success';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h2 className="font-serif text-4xl text-charcoal mb-3">
          Review & Publish
        </h2>
        <p className="text-charcoal/60 text-lg">
          Almost there! Review your memorial and publish when ready.
        </p>
      </div>

      {/* ========================================= */}
      {/* COMPLETION STATUS BANNER                  */}
      {/* ========================================= */}
      <div className={`mb-10 p-6 rounded-xl border-2 ${completion.status === 'complete' || completion.status === 'complete_solo'
        ? 'bg-gradient-to-br from-sage/10 via-ivory to-sage/5 border-sage/30'
        : 'bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 border-sage/20'
        }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-1 flex items-center gap-2">
              {(completion.status === 'complete' || completion.status === 'complete_solo') && (
                <CheckCircle size={20} className="text-sage" />
              )}
              Memorial {completion.status === 'complete' || completion.status === 'complete_solo' ? 'Complete' : 'Progress'}
            </h3>
            <p className="text-sm text-charcoal/60">
              {completion.message}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${completion.percentage === 100 ? 'text-sage' : 'text-charcoal/70'
              }`}>
              {completion.percentage}%
            </div>
            <p className="text-xs text-charcoal/40 mt-0.5">core sections</p>
          </div>
        </div>

        {/* Progress bar — based on CORE percentage */}
        <div className="h-3 bg-sand/30 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completion.percentage === 100
              ? 'bg-sage'
              : 'bg-gradient-to-r from-sage to-terracotta'
              }`}
            style={{ width: `${completion.percentage}%` }}
          />
        </div>

        {/* Solo complete message */}
        {completion.status === 'complete_solo' && (
          <div className="mt-4 p-4 bg-white/60 rounded-xl border border-sage/20 flex items-start gap-3">
            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift size={20} className="text-sage" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal mb-1">
                Your archive is complete!
              </p>
              <p className="text-xs text-charcoal/60 leading-relaxed">
                All core sections are filled. You can publish now and invite witnesses or add videos
                at any time to enrich the archive further. These are optional enrichments, not requirements.
              </p>
            </div>
          </div>
        )}

        {/* Full complete celebration */}
        {completion.status === 'complete' && (
          <div className="mt-4 p-4 bg-white/60 rounded-xl border border-sage/20 flex items-start gap-3">
            <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
              <PartyPopper size={20} className="text-sage" />
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal mb-1">
                Fully enriched archive!
              </p>
              <p className="text-xs text-charcoal/60 leading-relaxed">
                Every section is complete, including witnesses and videos. This is a beautifully rich memorial.
              </p>
            </div>
          </div>
        )}

        {/* In progress — show remaining core steps only */}
        {completion.status !== 'complete' && completion.status !== 'complete_solo' && (
          <div className="mt-4 flex items-start gap-2 text-sm text-charcoal/60">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-terracotta" />
            <p>
              You can publish now, or go back and complete more core sections for a richer memorial.
            </p>
          </div>
        )}
      </div>

      {/* ========================================= */}
      {/* CORE SECTIONS                             */}
      {/* ========================================= */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider">
          Core Sections ({completion.coreStepsCompleted}/{completion.coreStepsTotal})
        </h3>
      </div>
      <div className="space-y-3 mb-10">
        {completion.steps
          .filter(s => s.category === 'core')
          .map((section) => {
            const Icon = STEP_ICONS[section.step] || User;
            const colors = STEP_COLORS[section.step] || STEP_COLORS[1];
            return (
              <div
                key={section.step}
                className={`p-5 rounded-xl border-2 transition-all ${section.completed
                  ? 'bg-white border-sand/30'
                  : 'bg-sand/5 border-sand/20'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-semibold text-charcoal">{section.title}</h4>
                        <p className="text-sm text-charcoal/60 mt-0.5">{section.summary}</p>
                      </div>
                      {section.completed ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium flex-shrink-0">
                          <CheckCircle size={14} />
                          Complete
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-sand/20 text-charcoal/40 rounded-full text-xs font-medium flex-shrink-0">
                          <AlertCircle size={14} />
                          {section.required ? 'Required' : 'Recommended'}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onJumpToStep(section.step)}
                      className="text-sm text-terracotta hover:text-terracotta/80 transition-colors flex items-center gap-1.5 mt-2"
                    >
                      <Edit size={14} />
                      Edit this section
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ========================================= */}
      {/* ENRICHMENT SECTIONS (Optional)            */}
      {/* ========================================= */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-charcoal/50 uppercase tracking-wider flex items-center gap-2">
          <Gift size={14} />
          Optional Enrichments ({completion.enrichmentStepsCompleted}/{completion.enrichmentStepsTotal})
        </h3>
        <p className="text-xs text-charcoal/40 mt-1">
          These sections are not required for completion. Add them at any time to make the archive richer.
        </p>
      </div>
      <div className="space-y-3 mb-10">
        {completion.steps
          .filter(s => s.category === 'enrichment')
          .map((section) => {
            const Icon = STEP_ICONS[section.step] || User;
            const colors = STEP_COLORS[section.step] || STEP_COLORS[1];
            return (
              <div
                key={section.step}
                className={`p-5 rounded-xl border-2 transition-all ${section.completed
                  ? 'bg-white border-sage/20'
                  : 'bg-ivory border-dashed border-sand/30'
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center`}>
                    <Icon size={24} className={colors.text} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="font-semibold text-charcoal">{section.title}</h4>
                        <p className="text-sm text-charcoal/60 mt-0.5">{section.summary}</p>
                      </div>
                      {section.completed ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium flex-shrink-0">
                          <CheckCircle size={14} />
                          Added
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-ivory text-charcoal/30 rounded-full text-xs font-medium flex-shrink-0 border border-sand/20">
                          <Gift size={14} />
                          Optional
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onJumpToStep(section.step)}
                      className="text-sm text-terracotta hover:text-terracotta/80 transition-colors flex items-center gap-1.5 mt-2"
                    >
                      <Edit size={14} />
                      {section.completed ? 'Edit this section' : 'Add this enrichment'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* ========================================= */}
      {/* ACTION BUTTONS                            */}
      {/* ========================================= */}
      <div className="space-y-4">
        <button
          onClick={() => setShowPreview(true)}
          className="w-full py-4 px-6 bg-white border-2 border-sage rounded-xl text-sage font-medium hover:bg-sage/5 transition-all flex items-center justify-center gap-2"
        >
          <Eye size={20} />
          Preview Memorial
        </button>

        <button
          onClick={handlePublish}
          disabled={isPublishing || !completion.canPublish}
          className={`w-full py-5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${isPublishing || !completion.canPublish
            ? 'bg-sand/30 text-charcoal/40 cursor-not-allowed'
            : 'bg-gradient-to-r from-sage to-terracotta hover:shadow-lg text-ivory'
            }`}
        >
          {isPublishing ? (
            <>
              <div className="w-5 h-5 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Send size={20} />
              Publish Memorial
            </>
          )}
        </button>

        {!completion.canPublish && (
          <p className="text-sm text-center text-terracotta">
            Please complete at least the Basic Information section to publish
          </p>
        )}

        <button
          onClick={onBack}
          className="w-full py-3 px-6 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all flex items-center justify-center gap-2 text-charcoal/60"
        >
          <ArrowLeft size={18} />
          Back to Previous Step
        </button>
      </div>

      {/* Save Draft Note */}
      <div className="mt-8 p-4 bg-sage/5 rounded-lg border border-sage/20 text-center">
        <p className="text-sm text-charcoal/60">
          💾 Your work is automatically saved. You can close this page and come back anytime.
        </p>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          data={data}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}