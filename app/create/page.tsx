// app/create/page.tsx - COMPLETE FILE WITH MOBILE FIX
'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save, Sparkles, CheckCircle, Users, User, EthernetPort, History } from 'lucide-react';
import PreviewModal from '@/components/wizard/PreviewModal';
import { Panel, Group, Separator } from 'react-resizable-panels';
import PathCard from '@/components/wizard/PathCard';
import MemorialRenderer from '@/components/MemorialRenderer';
import { getPathStatus } from '@/lib/paths-logic';
import Step1BasicInfo from '@/components/wizard/Step1BasicInfo';
import Step2Childhood from '@/components/wizard/Step2Childhood';
import Step3Career from '@/components/wizard/Step3Career';
import Step4Relationships from '@/components/wizard/Step4Relationships';
import Step5Personality from '@/components/wizard/Step5Personality';
import Step6LifeStory from '@/components/wizard/Step6LifeStory';
import Step7Memories from '@/components/wizard/Step7Memories';
import Step8Media from '@/components/wizard/Step8Media';
import Step9Videos from '@/components/wizard/Step9Videos';
import TutorialPopup from '@/components/TutorialPopup';
import VersionHistory from '@/components/VersionHistory';
import {
  MemorialData,
  BasicInfo,
  ChildhoodInfo,
  CareerEducation,
  RelationshipsFamily,
  PersonalityValues,
  LifeStory,
  MemoriesStories,
  MediaLegacy,
  VideoContent,
  TOTAL_STEPS,
  WitnessRole
} from '@/types/memorial';
import { PathId } from '@/types/paths';
import { supabase } from '@/lib/supabase';
import { createVersion } from '@/lib/versionService';
import { GoTrueAdminApi } from '@supabase/supabase-js';
import { table } from 'node:console';

const PATH_CONFIG: Record<PathId, { steps: number[]; labels: string[] }> = {
  facts: {
    steps: [1],
    labels: ['Basic Info']
  },
  body: {
    steps: [2, 3, 4],
    labels: ['Childhood', 'Career', 'Relationships']
  },
  soul: {
    steps: [5, 6],
    labels: ['Personality', 'Life Story']
  },
  presence: {
    steps: [8, 9],
    labels: ['Photos', 'Videos']
  },
  witnesses: {
    steps: [7],
    labels: ['Memories']
  }
};

const getInitialData = (): MemorialData => ({
  step1: {
    fullName: '',
    birthDate: '',
    deathDate: null,
    isStillLiving: false,
    birthPlace: '',
    deathPlace: '',
    profilePhoto: null,
    profilePhotoPreview: null,
    epitaph: '',
  },
  step2: {
    childhoodHome: '',
    familyBackground: '',
    schools: {
      elementary: '',
      highSchool: '',
      college: '',
      additionalEducation: '',
    },
    childhoodPersonality: [],
    earlyInterests: [],
    childhoodPhotos: [],
  },
  step3: {
    occupations: [],
    careerHighlights: [],
    education: {
      major: '',
      graduationYear: '',
      honors: '',
    },
  },
  step4: {
    partners: [],
    children: [],
    majorLifeEvents: [],
  },
  step5: {
    personalityTraits: [],
    coreValues: [],
    passions: [],
    lifePhilosophy: '',
    favoriteQuotes: [],
    memorableSayings: [],
  },
  step6: {
    biography: '',
    lifeChapters: [],
  },
  step7: {
    sharedMemories: [],
    impactStories: [],
    invitedEmails: [],
    witnessPersonalMessage: '',
    sentInvitations: [],
  },
  step8: {
    coverPhoto: null,
    coverPhotoPreview: null,
    gallery: [],
    interactiveGallery: [],
    voiceRecordings: [],
    legacyStatement: '',
  },
  step9: {
    videos: [],
  },
  currentStep: 1,
  paid: false,
  lastSaved: new Date().toISOString(),
  completedSteps: [],
});

function CreateMemorialPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memorialId = searchParams.get('id');

  const [memorialData, setMemorialData] = useState<MemorialData>(getInitialData());
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [currentMemorialId, setCurrentMemorialId] = useState<string | null>(memorialId);
  const [isLoading, setIsLoading] = useState(!!memorialId);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userRole, setUserRole] = useState<WitnessRole>('owner'); // Default to owner

  // Ref to track data when entering a step (for version diffing)
  const stepEntryDataRef = useRef<MemorialData>(getInitialData());

  // 1. CAPTURE THE MODE
  const mode = searchParams.get('mode') || 'personal';

  // 2. HELPER FOR BADGE UI
  const ModeBadge = () => (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${mode === 'family'
      ? 'bg-terracotta/10 text-terracotta border-terracotta/20'
      : 'bg-sage/10 text-sage border-sage/20'
      }`}>
      {mode === 'family' ? <Users size={12} /> : <User size={12} />}
      <span className="uppercase tracking-wider">
        {mode === 'family' ? 'Family Archive' : 'Personal Archive'}
      </span>
    </div>
  );

  // Mobile Detection State
  const [isMobile, setIsMobile] = useState(true); // Default to true (mobile-first) prevents flicker

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 1024);
    checkScreen(); // Check immediately
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // Hub View States
  const [viewMode, setViewMode] = useState<'hub' | 'path'>('hub');
  const [activePath, setActivePath] = useState<PathId | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'witness') {
      setUserRole('witness');
    }

    if (memorialId) {
      loadMemorial(memorialId);
    }
  }, [memorialId, searchParams]);

  useEffect(() => {
    const ensureUserExists = async () => {
      let savedUserId = localStorage.getItem('user-id');

      if (!savedUserId || savedUserId.startsWith('user-')) {
        console.log("No valid user found, creating temporary session...");
        try {
          const { data, error } = await supabase
            .from('users')
            .insert([{ email: `user-create-${Date.now()}@legacyvault.temp` }])
            .select()
            .single();

          if (error) throw error;

          if (data) {
            localStorage.setItem('user-id', data.id);
            console.log("Temporary user created:", data.id);
          }
        } catch (err) {
          console.error("Failed to initialize user session:", err);
        }
      }
    };

    ensureUserExists();
  }, []);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('legacy-vault-tutorial-completed');
    if (!memorialId && !hasSeenTutorial) {
      setTimeout(() => {
        setShowTutorial(true);
      }, 500);
    }
  }, [memorialId]);

  const handlePathClick = (pathId: PathId) => {
    setActivePath(pathId);

    const pathToStepMap: Record<PathId, number> = {
      facts: 1,
      body: 2,
      soul: 5,
      presence: 8,
      witnesses: 7
    };

    setMemorialData(prev => ({ ...prev, currentStep: pathToStepMap[pathId] }));
    setViewMode('path');
  };

  const tutorialSteps = [
    {
      target: '[data-tutorial="Fulle-Name"]',
      title: 'Start Your Legacy',
      description: 'The full name is where the memorial begins, creating a space dedicated to the person being honored.',
      position: 'bottom' as const,
    },
    {
      target: '[data-tutorial="preview-button"]',
      title: 'Preview Your Memorial',
      description: 'As you add information, you can click "Preview Live Page" at any time to see how your memorial will look to visitors. This helps ensure everything appears exactly as you envision.',
      position: 'bottom' as const,
    },
    {
      target: '[data-tutorial="save-continue"]',
      title: 'Save Your Progress',
      description: 'Click "Save & Continue" at the bottom to save your work and move to the next step. Your progress is automatically saved!',
      position: 'top' as const,
    },
  ];

  const handleTutorialComplete = () => {
    localStorage.setItem('legacy-vault-tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('legacy-vault-tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const loadMemorial = async (id: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('memorials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        // IMPROVED MERGING: Deep merge to ensure missing properties in DB are filled with defaults
        const initial = getInitialData();
        const loadedData: MemorialData = {
          ...initial,
          ...data,
          // Deep merge each step
          step1: { ...initial.step1, ...(data.step1 || {}) },
          step2: { ...initial.step2, ...(data.step2 || {}) },
          step3: { ...initial.step3, ...(data.step3 || {}) },
          step4: { ...initial.step4, ...(data.step4 || {}) },
          step5: { ...initial.step5, ...(data.step5 || {}) },
          step6: { ...initial.step6, ...(data.step6 || {}) },
          step7: { ...initial.step7, ...(data.step7 || {}) },
          step8: { ...initial.step8, ...(data.step8 || {}) },
          step9: { ...initial.step9, ...(data.step9 || {}) },

          paid: data.paid || false,
          currentStep: 1,
          lastSaved: data.updated_at,
          completedSteps: data.completed_steps || [],
        };
        setMemorialData(loadedData);
        setCurrentMemorialId(id);
        // Initialize step entry ref with loaded data
        stepEntryDataRef.current = structuredClone(loadedData);
      }
    } catch (error) {
      console.error('Error loading memorial:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const canEditStep = (stepNumber: number) => {
    if (userRole === 'owner' || userRole === 'co_guardian') return true;
    const contributionSteps = [7, 8, 9];
    return contributionSteps.includes(stepNumber);
  };

  useEffect(() => {
    const saveTimer = setTimeout(() => {
      saveToSupabase();
    }, 1000);
    return () => clearTimeout(saveTimer);
  }, [memorialData]);

  const saveToSupabase = async () => {
    if (!memorialData.step1.fullName) return;

    // --- NEW PERMISSION CHECK ---
    if (userRole !== 'owner') {
      // Witnesses do not auto-save the main record.
      // Their changes are handled via the Approval System (Step 2.1.5)
      return;
    }
    // ----------------------------

    const userId = localStorage.getItem('user-id');

    if (!userId || userId.startsWith('user-')) {
      console.log("Waiting for a valid Database UUID...");
      return;
    }

    setSaveStatus('saving');
    try {
      const slug = generateSlug(memorialData.step1.fullName);
      const currentMode = searchParams.get('mode') || localStorage.getItem('legacy-vault-mode') || 'personal';

      const memorialRecord = {
        id: currentMemorialId || undefined, // ⬅ CRITICAL: Include ID if exists
        step1: memorialData.step1,
        step2: memorialData.step2,
        step3: memorialData.step3,
        step4: memorialData.step4,
        step5: memorialData.step5,
        step6: memorialData.step6,
        step7: memorialData.step7,
        step8: memorialData.step8,
        step9: memorialData.step9,
        status: 'draft',
        slug: slug || currentMemorialId, // Fallback to ID if no name
        full_name: memorialData.step1.fullName,
        birth_date: memorialData.step1.birthDate || null,
        death_date: memorialData.step1.deathDate || null,
        profile_photo_url: memorialData.step1.profilePhotoPreview || null,
        cover_photo_url: memorialData.step8.coverPhotoPreview || null,
        completed_steps: memorialData.completedSteps,
        mode: currentMode,
        user_id: userId,
        paid: memorialData.paid,
        updated_at: new Date().toISOString(),
      };

      // ✅ USE UPSERT instead of INSERT/UPDATE separately
      const { data, error } = await supabase
        .from('memorials')
        .upsert(memorialRecord, {
          onConflict: 'id', // ⬅ Use ID as conflict key
          ignoreDuplicates: false // ⬅ Always UPDATE if exists
        })
        .select()
        .single();

      if (error) throw error;

      // If this was a new memorial, update the ID
      if (data && !currentMemorialId) {
        setCurrentMemorialId(data.id);
        localStorage.setItem('current-memorial-id', data.id);
        window.history.replaceState({}, '', `/create?id=${data.id}&mode=${currentMode}`);
      }

      setSaveStatus('saved');
    } catch (error: any) {
      console.error('Full Error Object:', error);
      setSaveStatus('error');
    }
  };

  const goToNextStepAndComplete = async () => {
    // Only create versions if the user is the owner
    if (currentMemorialId && userRole === 'owner') {
      const userId = localStorage.getItem('user-id');
      await createVersion({
        memorialId: currentMemorialId,
        oldData: stepEntryDataRef.current,
        newData: memorialData,
        userId: userId || undefined,
        userName: 'Owner',
        changeType: 'manual',
      });
    }

    // Update the entry snapshot for the next step
    stepEntryDataRef.current = structuredClone(memorialData);

    if (memorialData.currentStep < TOTAL_STEPS) {
      setMemorialData(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: prev.completedSteps.includes(prev.currentStep)
          ? prev.completedSteps
          : [...prev.completedSteps, prev.currentStep],
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (memorialData.currentStep > 1) {
      setMemorialData(prev => ({
        ...prev,
        currentStep: prev.currentStep - 1,
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= TOTAL_STEPS) {
      setMemorialData(prev => ({
        ...prev,
        currentStep: step,
        completedSteps: prev.completedSteps.filter(
          completedStep => completedStep < step
        ),
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateStep1 = (data: BasicInfo) => {
    setMemorialData(prev => ({
      ...prev,
      step1: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep2 = (data: ChildhoodInfo) => {
    setMemorialData(prev => ({
      ...prev,
      step2: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep3 = (data: CareerEducation) => {
    setMemorialData(prev => ({
      ...prev,
      step3: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep4 = (data: RelationshipsFamily) => {
    setMemorialData(prev => ({
      ...prev,
      step4: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep5 = (data: PersonalityValues) => {
    setMemorialData(prev => ({
      ...prev,
      step5: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep6 = (data: LifeStory) => {
    setMemorialData(prev => ({
      ...prev,
      step6: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep7 = (data: MemoriesStories) => {
    setMemorialData(prev => ({
      ...prev,
      step7: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep8 = (data: MediaLegacy) => {
    setMemorialData(prev => ({
      ...prev,
      step8: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const updateStep9 = (data: VideoContent) => {
    setMemorialData(prev => ({
      ...prev,
      step9: data,
      lastSaved: new Date().toISOString(),
    }));
  };

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memorialId: currentMemorialId,
          plan: 'Personal',
          amount: 1500,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err) {
      console.error("Payment trigger failed:", err);
      alert("Could not connect to payment gateway. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal/60">Loading memorial...</p>
        </div>
      </div>
    );
  }

  const completedPathsCount = ['facts', 'body', 'soul'].filter(
    id => getPathStatus(memorialData, id as PathId) === 'completed'
  ).length;

  const submitContribution = async (type: 'memory' | 'photo' | 'video', content: any) => {
    // Security check
    if (userRole !== 'witness' || !currentMemorialId) return;

    const userId = localStorage.getItem('user-id');

    try {
      const { error } = await supabase
        .from('memorial_contributions')
        .insert([{
          memorial_id: currentMemorialId,
          user_id: userId,
          witness_name: "A Witness", // We will improve the name retrieval later
          type: type,
          content: content,
          status: 'pending_approval'
        }]);

      if (error) throw error;
      alert("Contribution submitted! The archive owner will review it shortly.");

    } catch (err: any) {
      console.error("Error submitting contribution:", err);
      alert("Failed to submit: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-ivory relative">
      {viewMode === 'hub' ? (
        /* --- THE HUB VIEW (The Crossroads) --- */
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            {/* 3. INSERT BADGE IN HUB HEADER */}
            <div className="flex justify-center mb-4">
              <ModeBadge />
            </div>
            <h1 className="font-serif text-5xl text-charcoal mb-4">The Crossroads</h1>

            {(() => {
              const isPresenceUnlocked = completedPathsCount >= 2;

              return (
                <>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-sand/10 border border-sand/20 rounded-full mb-6">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${i <= completedPathsCount ? 'bg-sage' : 'bg-sand/30'}`} />
                      ))}
                    </div>
                    <span className="text-xs font-medium text-charcoal/60 uppercase tracking-widest">
                      {isPresenceUnlocked
                        ? "The Presence is Unlocked"
                        : `${completedPathsCount} of 2 chapters finished to unlock The Presence`}
                    </span>
                  </div>

                  <p className="text-lg text-charcoal/60 max-w-xl mx-auto">
                    {mode === 'family' ? (
                      <>
                        This is a shared space to preserve your family's heritage.
                        <br />
                        <span className="text-sm mt-2 block text-terracotta">
                          Designed for collaboration. You will invite members in the Witnesses section.
                        </span>
                      </>
                    ) : (
                      <>
                        A private sanctuary to honor a unique life.
                        <br />
                        <span className="text-sm mt-2 block text-sage">
                          You are the sole guardian. Sharing is optional and controlled by you.
                        </span>
                      </>
                    )}
                  </p>
                </>
              );
            })()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <PathCard
              id="facts"
              title="The Facts"
              description="Birth, death, and the proof of existence. The foundation of the memory."
              status={getPathStatus(memorialData, 'facts')}
              onClick={handlePathClick}
            />
            <PathCard
              id="body"
              title="The Body"
              description="Eras of life, from childhood to career and the families built along the way."
              status={getPathStatus(memorialData, 'body')}
              onClick={handlePathClick}
            />
            <PathCard
              id="soul"
              title="The Soul"
              description="Personality, traits, and the full life story. Who they were in essence."
              status={getPathStatus(memorialData, 'soul')}
              onClick={handlePathClick}
            />
            <PathCard
              id="witnesses"
              title={mode === 'family' ? "Family Contributors" : "Witnesses & Tributes"}
              description={mode === 'family'
                ? "Centralize the family's stories. Invite members to build this archive together."
                : "Invite close friends to share memories. Entirely optional and moderated by you."
              }
              status={getPathStatus(memorialData, 'witnesses')}
              onClick={handlePathClick}
            />
            <PathCard
              id="presence"
              title="The Presence"
              description="Photos, videos, and the return of the voice."
              status={memorialData.paid ? getPathStatus(memorialData, 'presence') : (completedPathsCount >= 2 ? 'in_progress' : 'locked')}
              onClick={handlePathClick}
            />
          </div>

          {memorialData.paid && (
            <div className="col-span-full mt-8">
              <button
                onClick={() => {
                  setActivePath('witnesses');
                  setMemorialData(prev => ({ ...prev, currentStep: 7 }));
                  setViewMode('path');
                }}
                className="w-full p-8 rounded-2xl border-2 border-sage bg-white hover:shadow-xl transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-sage/10 rounded-2xl text-sage group-hover:scale-110 transition-transform">
                    <Users size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">Invite Witnesses</h3>
                    <p className="text-sm text-charcoal/60">Invite family and friends to add their own stories and shared memories.</p>
                  </div>
                </div>
                <div className="px-6 py-2 bg-sage text-ivory rounded-full text-sm font-bold">
                  Open for Contributions
                </div>
              </button>
            </div>
          )}

          {memorialData.paid ? (
            <div className="mt-12 p-10 bg-sage/5 border-2 border-sage/20 rounded-3xl text-center animate-fadeIn">
              <div className="w-16 h-16 bg-sage text-ivory rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-serif text-3xl text-charcoal mb-4">This Memory is Now Eternal</h3>
              <p className="text-charcoal/60 max-w-lg mx-auto mb-8 text-sm">
                The watermark has been removed. Your archive is live at its permanent URL. You can now invite others to share their memories.
              </p>

              <div className="flex justify-center gap-4">
                <Link
                  href={`/person/${currentMemorialId}`}
                  target="_blank"
                  className="px-8 py-3 bg-charcoal text-ivory rounded-xl font-medium hover:bg-charcoal/90 transition-all"
                >
                  View Public Page
                </Link>
                <button
                  onClick={() => alert("Invite Witnesses feature coming soon!")}
                  className="px-8 py-3 border border-sage text-sage rounded-xl font-medium hover:bg-sage/5 transition-all"
                >
                  Invite Witnesses
                </button>
              </div>
            </div>
          ) : (
            completedPathsCount >= 2 && (
              <div className="mt-12 p-10 bg-white border-2 border-sage/30 rounded-3xl text-center shadow-xl animate-fadeIn">
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="text-sage" size={32} />
                </div>
                <h3 className="font-serif text-3xl text-charcoal mb-4">You have reconstructed their story.</h3>
                <p className="text-charcoal/60 max-w-lg mx-auto mb-8">
                  The foundation is ready. To unlock the full <strong>Presence</strong>—including the complete gallery, high-definition videos, and permanent archival—complete the final step of the ritual.
                </p>

                <button
                  onClick={() => router.push('/personal-confirmation')}
                  className="px-12 py-4 bg-terracotta text-ivory rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  Become a Permanent Guardian ($1,500)
                </button>
              </div>
            )
          )}

          <div className="mt-20 text-center">
            <Link href="/dashboard" className="text-sm text-charcoal/40 hover:text-charcoal transition-colors">
              ← Save progress and exit to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* --- THE PATH EDITOR VIEW --- */
        <div className="animate-fadeIn h-screen flex flex-col bg-ivory overflow-hidden">

          {/* Top Bar - Fixed at top */}
          <div className="flex-none bg-white border-b border-sand/20 z-50 px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setViewMode('hub')}
              className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-all"
            >
              ← Back to Crossroads
            </button>
            <div className="flex items-center gap-4">

              {/* 4. INSERT BADGE IN EDITOR HEADER */}
              <ModeBadge />

              <div className="h-4 w-px bg-sand/40" /> {/* Separator */}

              {/* Save Status */}
              <div className="flex items-center gap-3">
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-2 text-sm text-charcoal/60">
                    <div className="w-4 h-4 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
                    <span className="hidden sm:inline">Saving...</span>
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-2 text-sm text-sage">
                    <Save size={16} />
                    <span className="hidden sm:inline">Saved</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="text-sm text-red-600">Failed to save</div>
                )}
              </div>
              <span className="text-xs text-sage font-medium bg-sage/5 px-3 py-1 rounded-full border border-sage/20">
                Path: {activePath?.toUpperCase() || 'WIZARD'}
              </span>

              {/* Version History Button */}
              {currentMemorialId && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 px-3 py-1.5 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all text-xs text-charcoal/60"
                >
                  <History size={14} />
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
            </div>
          </div>

          {/* THE RESIZABLE SPLIT VIEW - Takes remaining height */}
          <div className="flex-1 min-h-0 relative">
            <Group orientation="horizontal" className="max-w-[1920px] mx-auto h-full">

              {/* LEFT PANEL: Forms - Automatically takes 100% on mobile if Right Panel is missing */}
              <Panel defaultSize={50} minSize={30} className="h-full">
                <div className="h-full overflow-y-auto p-0 lg:p-8 scrollbar-hide">
                  <div className="bg-white rounded-none lg:rounded-2xl border-x-0 lg:border border-sand/30 shadow-sm overflow-hidden min-h-full">

                    {/* PATH SUB-NAVIGATION */}
                    {activePath && PATH_CONFIG[activePath].steps.length > 1 && (
                      <div className="flex border-b border-sand/10 bg-sand/5 sticky top-0 z-10 backdrop-blur-md">
                        {PATH_CONFIG[activePath].steps.map((stepNumber, index) => (
                          <button
                            key={stepNumber}
                            onClick={() => setMemorialData(prev => ({ ...prev, currentStep: stepNumber }))}
                            className={`flex-1 py-4 px-2 text-xs font-medium transition-all border-b-2 ${memorialData.currentStep === stepNumber
                              ? 'border-sage text-sage bg-white'
                              : 'border-transparent text-charcoal/40 hover:text-charcoal/60'
                              }`}
                          >
                            {PATH_CONFIG[activePath].labels[index]}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* FORM COMPONENTS */}
                    <div className="p-4 sm:p-8">
                      {memorialData.currentStep === 1 && (
                        <Step1BasicInfo
                          data={memorialData.step1}
                          onUpdate={updateStep1}
                          onNext={() => setViewMode('hub')}
                          readOnly={!canEditStep(1)}
                        />
                      )}
                      {memorialData.currentStep === 2 && (
                        <Step2Childhood
                          data={memorialData.step2}
                          onUpdate={updateStep2}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 3 }))}
                          onBack={() => setViewMode('hub')}
                          readOnly={!canEditStep(2)}
                        />
                      )}
                      {memorialData.currentStep === 3 && (
                        <Step3Career
                          data={memorialData.step3}
                          onUpdate={updateStep3}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 4 }))}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 2 }))}
                          readOnly={!canEditStep(3)}
                        />
                      )}
                      {memorialData.currentStep === 4 && (
                        <Step4Relationships
                          data={memorialData.step4}
                          onUpdate={updateStep4}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 3 }))}
                          readOnly={!canEditStep(4)}
                        />
                      )}
                      {memorialData.currentStep === 5 && (
                        <Step5Personality
                          data={memorialData.step5}
                          onUpdate={updateStep5}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 6 }))}
                          onBack={() => setViewMode('hub')}
                          readOnly={!canEditStep(5)}
                        />
                      )}
                      {memorialData.currentStep === 6 && (
                        <Step6LifeStory
                          data={memorialData.step6}
                          onUpdate={updateStep6}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 5 }))}
                          readOnly={!canEditStep(6)}
                        />
                      )}
                      {memorialData.currentStep === 7 && (
                        <Step7Memories
                          data={memorialData.step7}
                          onUpdate={updateStep7}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setViewMode('hub')}
                          isPaid={memorialData.paid}
                          readOnly={!canEditStep(7)}
                          userRole={userRole}
                          onSubmitContribution={submitContribution}
                        />
                      )}
                      {memorialData.currentStep === 8 && (
                        <Step8Media
                          data={memorialData.step8}
                          onUpdate={updateStep8}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 9 }))}
                          onBack={() => setViewMode('hub')}
                          isPaid={memorialData.paid}
                          completedPathsCount={completedPathsCount}
                          onBackToHub={() => setViewMode('hub')}
                          memorialId={currentMemorialId}
                          readOnly={!canEditStep(8)}
                        />
                      )}
                      {memorialData.currentStep === 9 && (
                        <Step9Videos
                          data={memorialData.step9}
                          onUpdate={updateStep9}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 8 }))}
                          memorialId={currentMemorialId}
                          readOnly={!canEditStep(9)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Panel>

              {/* ONLY RENDER MIRROR ON DESKTOP (!isMobile) */}
              {!isMobile && (
                <>
                  {/* RESIZE HANDLE */}
                  <Separator className="w-2 bg-transparent hover:bg-sage/10 transition-colors group flex items-center justify-center cursor-col-resize">
                    <div className="w-0.5 h-16 bg-sand/40 rounded-full group-hover:bg-sage/50 transition-colors" />
                  </Separator>

                  {/* RIGHT PANEL: The Mirror */}
                  <Panel defaultSize={50} minSize={25} className="h-full">
                    <div className="h-full w-full overflow-hidden p-4 bg-ivory">
                      <MemorialRenderer
                        data={memorialData}
                        isPreview={!memorialData.paid}
                        compact={true}
                        className="h-full"
                      />
                    </div>
                  </Panel>
                </>
              )}

            </Group>
          </div>
        </div>
      )
      }

      {
        showTutorial && (
          <TutorialPopup
            steps={tutorialSteps}
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
          />
        )
      }

      {/* MOBILE PREVIEW BUTTON (Hidden on Desktop) */}
      {
        viewMode === 'path' && (
          <div className="lg:hidden fixed bottom-6 right-6 z-50 animate-fadeIn">
            <button
              onClick={() => setShowMobilePreview(true)}
              className="flex items-center gap-2 px-5 py-3 bg-charcoal text-ivory rounded-full shadow-2xl font-serif border border-ivory/20 active:scale-95 transition-transform"
            >
              <Eye size={20} />
              <span className="font-medium">Preview</span>
            </button>
          </div>
        )
      }

      {/* MOBILE PREVIEW MODAL */}
      {
        showMobilePreview && (
          <PreviewModal
            data={memorialData}
            onClose={() => setShowMobilePreview(false)}
          />
        )
      }

      {/* VERSION HISTORY MODAL */}
      {showHistory && currentMemorialId && (
        <VersionHistory
          memorialId={currentMemorialId}
          currentData={memorialData}
          userId={localStorage.getItem('user-id') || undefined}
          userName="Owner"
          onRestore={(restoredData) => {
            setMemorialData(restoredData);
            stepEntryDataRef.current = structuredClone(restoredData);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div >
  );
}

export default function CreateMemorialPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
      </div>
    }>
      <CreateMemorialPageContent />
    </Suspense>
  );
}
