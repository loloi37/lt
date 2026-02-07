// components/wizard/Step10Review.tsx - RENAMED AND UPDATED
'use client';
import { useState } from 'react';
import { CheckCircle, Edit, Eye, Send, ArrowLeft, User, Home, Briefcase, Heart, Sparkles, BookOpen, MessageCircle, Image as ImageIcon, Film, AlertCircle } from 'lucide-react';
import { MemorialData } from '@/types/memorial';
import PreviewModal from './PreviewModal';

interface Step10Props {
  data: MemorialData;
  onBack: () => void;
  onJumpToStep: (step: number) => void;
}

export default function Step10Review({ data, onBack, onJumpToStep }: Step10Props) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Check completion status for each step
  const stepCompletion = {
    step1: !!(data.step1.fullName && data.step1.birthDate),
    step2: !!(data.step2.familyBackground || data.step2.childhoodHome),
    step3: !!(data.step3.occupations.length > 0),
    step4: !!(data.step4.partners.length > 0 || data.step4.children.length > 0),
    step5: !!(data.step5.personalityTraits.length > 0 || data.step5.coreValues.length > 0),
    step6: !!(data.step6.biography.trim().length > 100),
    step7: !!(data.step7.sharedMemories.length > 0 || data.step7.impactStories.length > 0),
    step8: !!(data.step8.coverPhotoPreview || data.step8.gallery.length > 0),
    step9: !!(data.step9.videos.length > 0), // NEW
  };

  const completedSteps = Object.values(stepCompletion).filter(Boolean).length;
  const totalSteps = 9; // Total steps excluding review
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100);

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    window.location.href = '/success';
  };

  const sections = [
    {
      step: 1,
      title: 'Basic Information',
      icon: User,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      completed: stepCompletion.step1,
      summary: data.step1.fullName
        ? `${data.step1.fullName} • ${data.step1.birthDate}${data.step1.deathDate ? ` - ${data.step1.deathDate}` : ' (Living)'}`
        : 'Not completed',
    },
    {
      step: 2,
      title: 'Early Life & Childhood',
      icon: Home,
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      completed: stepCompletion.step2,
      summary: data.step2.childhoodHome
        ? `${data.step2.schools.highSchool || 'Schools added'} • ${data.step2.childhoodPersonality.length} traits`
        : 'Not completed',
    },
    {
      step: 3,
      title: 'Career & Education',
      icon: Briefcase,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      completed: stepCompletion.step3,
      summary: data.step3.occupations.length > 0
        ? `${data.step3.occupations.length} job${data.step3.occupations.length !== 1 ? 's' : ''} • ${data.step3.careerHighlights.length} highlights`
        : 'Not completed',
    },
    {
      step: 4,
      title: 'Relationships & Family',
      icon: Heart,
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      completed: stepCompletion.step4,
      summary: (data.step4.partners.length + data.step4.children.length) > 0
        ? `${data.step4.partners.length} partner${data.step4.partners.length !== 1 ? 's' : ''} • ${data.step4.children.length} child${data.step4.children.length !== 1 ? 'ren' : ''}`
        : 'Not completed',
    },
    {
      step: 5,
      title: 'Personality, Values & Passions',
      icon: Sparkles,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      completed: stepCompletion.step5,
      summary: (data.step5.personalityTraits.length + data.step5.coreValues.length) > 0
        ? `${data.step5.personalityTraits.length} traits • ${data.step5.coreValues.length} values`
        : 'Not completed',
    },
    {
      step: 6,
      title: 'Full Life Story',
      icon: BookOpen,
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      completed: stepCompletion.step6,
      summary: data.step6.biography.trim().length > 0
        ? `${data.step6.biography.trim().split(/\s+/).length} words • ${data.step6.lifeChapters.length} chapters`
        : 'Not completed',
    },
    {
      step: 7,
      title: 'Memories & Stories',
      icon: MessageCircle,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      completed: stepCompletion.step7,
      summary: (data.step7.sharedMemories.length + data.step7.impactStories.length) > 0
        ? `${data.step7.sharedMemories.length} memories • ${data.step7.impactStories.length} impact stories`
        : 'Not completed',
    },
    {
      step: 8,
      title: 'Photos & Legacy',
      icon: ImageIcon,
      color: 'text-sage',
      bgColor: 'bg-sage/10',
      completed: stepCompletion.step8,
      summary: data.step8.gallery.length > 0
        ? `${data.step8.gallery.length} photos • ${data.step8.voiceRecordings.length} recordings`
        : 'Not completed',
    },
    {
      step: 9,
      title: 'Videos', // NEW
      icon: Film,
      color: 'text-terracotta',
      bgColor: 'bg-terracotta/10',
      completed: stepCompletion.step9,
      summary: data.step9.videos.length > 0
        ? `${data.step9.videos.length} video${data.step9.videos.length !== 1 ? 's' : ''}`
        : 'Not completed',
    },
  ];

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

      {/* Completion Status */}
      <div className="mb-10 p-6 bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 rounded-xl border-2 border-sage/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-1">Memorial Completion</h3>
            <p className="text-sm text-charcoal/60">
              {completedSteps} of {totalSteps} sections completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-sage">{completionPercentage}%</div>
          </div>
        </div>
        <div className="h-3 bg-sand/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sage to-terracotta rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        {completionPercentage < 100 && (
          <div className="mt-4 flex items-start gap-2 text-sm text-charcoal/60">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-terracotta" />
            <p>
              You can publish now, or go back and complete more sections for a richer memorial.
            </p>
          </div>
        )}
      </div>

      {/* Section Review Cards */}
      <div className="space-y-4 mb-10">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.step}
              className={`p-5 rounded-xl border-2 transition-all ${section.completed
                ? 'bg-white border-sand/30'
                : 'bg-sand/5 border-sand/20'
                }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                  <Icon size={24} className={section.color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-charcoal">{section.title}</h4>
                      <p className="text-sm text-charcoal/60 mt-0.5">{section.summary}</p>
                    </div>
                    {section.completed ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-medium">
                        <CheckCircle size={14} />
                        Complete
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-sand/20 text-charcoal/40 rounded-full text-xs font-medium">
                        <AlertCircle size={14} />
                        Optional
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

      {/* Action Buttons */}
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
          disabled={isPublishing || !stepCompletion.step1}
          className={`w-full py-5 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 text-lg ${isPublishing || !stepCompletion.step1
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

        {!stepCompletion.step1 && (
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