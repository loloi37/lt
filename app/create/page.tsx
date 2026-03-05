// app/create/page.tsx - COMPLETE FILE WITH MOBILE FIX
'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, Save, Sparkles, CheckCircle, Users, User, EthernetPort, History, Lock } from 'lucide-react';
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
import Step10Review from '@/components/wizard/Step10Review';
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
import { createClient } from '@/utils/supabase/client';
import { createVersion } from '@/lib/versionService';

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
    isSelfArchive: false, // NEW: Default to false
    privateUntilDeath: false, // NEW: Default to false
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
  // Track the memorial's actual mode from the database, so auto-save never overwrites it
  const [dbMode, setDbMode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!!memorialId);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [userRole, setUserRole] = useState<WitnessRole>('owner'); // Default to owner
  const [hasSuccessor, setHasSuccessor] = useState(false); // NEW: Track if user has a successor

  // Ref to track data when entering a step (for version diffing)
  const stepEntryDataRef = useRef<MemorialData>(getInitialData());

  // Track the authenticated user ID
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setAuthUserId(user.id);
        // Send heartbeat
        fetch('/api/user/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        }).catch(console.error);
      }
    });
  }, []);

  // FIX: Create an empty memorial immediately on page load when no ID exists.
  // This ensures memorialId is always available for autosave and media uploads.
  useEffect(() => {
    if (currentMemorialId || !authUserId) return;

    const createEmptyMemorial = async () => {
      try {
        const supabase = createClient();
        const rawMode = searchParams.get('mode') || 'personal';
        // DB constraint only allows 'personal' or 'family'. Map 'draft' to 'personal'.
        const currentMode = rawMode === 'family' ? 'family' : 'personal';

        // SECURITY: If user's plan is already family, don't allow creating personal memorials.
        // This prevents exploitation via browser back button after upgrade.
        if (currentMode === 'personal') {
          const { data: existingFamily } = await supabase
            .from('memorials')
            .select('id')
            .eq('user_id', authUserId)
            .eq('mode', 'family')
            .eq('paid', true)
            .limit(1);
          if (existingFamily && existingFamily.length > 0) {
            router.replace(`/dashboard/family/${authUserId}`);
            return;
          }
        }

        const { data, error } = await supabase
          .from('memorials')
          .insert({
            user_id: authUserId,
            status: 'draft',
            mode: currentMode,
            slug: `draft-${Date.now()}`,
            paid: false,
            step1: memorialData.step1,
            step2: memorialData.step2,
            step3: memorialData.step3,
            step4: memorialData.step4,
            step5: memorialData.step5,
            step6: memorialData.step6,
            step7: memorialData.step7,
            step8: memorialData.step8,
            step9: memorialData.step9,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setCurrentMemorialId(data.id);
          setDbMode(currentMode);
          window.history.replaceState({}, '', `/create?id=${data.id}&mode=${currentMode}`);
        }
      } catch (err) {
        console.error('Failed to create empty memorial:', err);
      }
    };

    createEmptyMemorial();
  }, [authUserId, currentMemorialId]);

  // 1. CAPTURE THE MODE
  const mode = searchParams.get('mode') || 'personal';

  // 2. HELPER FOR BADGE UI — Step 1.1.1: Warm, human draft banner
  const ModeBadge = () => (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${mode === 'family'
      ? 'bg-stone/10 text-stone border-stone/20'
      : mode === 'draft'
        ? 'bg-sand/10 text-charcoal/60 border-sand/30'
        : 'bg-mist/10 text-mist border-mist/20'
      }`}>
      {mode === 'family' ? <Users size={12} /> : <User size={12} />}
      <span className="uppercase tracking-wider">
        {mode === 'family' ? 'Family Archive' : mode === 'draft' ? 'Draft' : 'Personal Archive'}
      </span>
    </div>
  );

  // Step 1.1.1: Draft banner — warm, reassuring, no urgency
  const DraftBanner = () => {
    if (memorialData.paid) return null;
    return (
      <div className="bg-sand/15 border border-sand/25 rounded-xl px-5 py-3 flex items-start gap-3 max-w-2xl mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-charcoal/40 mt-0.5 flex-shrink-0"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
        <p className="text-xs text-charcoal/50 leading-relaxed">
          This is a draft. The archive will remain private and incomplete until you choose to finalize it. Take all the time you need.
        </p>
      </div>
    );
  };

  // Step 1.1.2: Contextual supportive messages by path
  const PATH_MESSAGES: Record<PathId, string> = {
    facts: 'Facts are the skeleton of memory. Fill in what you know, leave blank what you don\u2019t. You can always return.',
    body: 'Images are proof of existence. Even a blurry photo is a treasure.',
    soul: 'This is where the person comes back to life. Write as you would speak to someone who never knew them.',
    presence: 'This is what the world will see. Take a moment to look.',
    witnesses: 'Every witness carries a fragment. Together, they restore the whole.',
  };

  // Step 1.1.4: Pause and come back later state
  const [showPauseModal, setShowPauseModal] = useState(false);

  const handlePauseAndLeave = async (sendReminder: boolean) => {
    // Save current state
    await saveToSupabase();

    if (sendReminder && currentMemorialId) {
      try {
        await fetch('/api/reminder/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            memorialId: currentMemorialId,
            fullName: memorialData.step1.fullName || 'your archive',
            delayDays: 7,
          }),
        });
      } catch (err) {
        console.error('Failed to schedule reminder:', err);
      }
    }

    setShowPauseModal(false);
    router.replace('/dashboard');
  };

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
    const checkPermissions = async () => {
      if (!memorialId) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Not logged in? Middleware might catch this, but safe to redirect
        return;
      }

      // 1. Fetch the memorial to see who owns it
      const { data: memorial } = await supabase
        .from('memorials')
        .select('user_id')
        .eq('id', memorialId)
        .single();

      if (memorial) {
        if (memorial.user_id === user.id) {
          // user IS the owner
          setUserRole('owner');
        } else {
          // user is NOT the owner. Check if they are a valid witness.
          const { data: invitation } = await supabase
            .from('witness_invitations')
            .select('id')
            .eq('memorial_id', memorialId)
            .eq('accepted_by_user_id', user.id) // This link was made in the accept page
            .eq('status', 'accepted')
            .single();

          if (invitation) {
            setUserRole('witness');
          } else {
            // Neither owner nor witness? They shouldn't be here.
            // You could also check for 'co_guardian' here later
            alert("You do not have permission to view this archive.");
            router.replace('/dashboard');
            return;
          }
        }

        // Handle loading the memorial and step param
        loadMemorial(memorialId).then(() => {
          // Handle step param from Three Doors or direct links
          const stepParam = searchParams.get('step');
          if (stepParam) {
            const stepNum = parseInt(stepParam, 10);
            if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= 10) {
              // Map step number to path
              const stepToPathMap: Record<number, PathId> = {
                1: 'facts',
                2: 'body', 3: 'body', 4: 'body',
                5: 'soul', 6: 'soul',
                7: 'witnesses',
                8: 'presence', 9: 'presence',
              };
              const targetPath = stepToPathMap[stepNum];
              if (targetPath) {
                setActivePath(targetPath);
                setMemorialData(prev => ({ ...prev, currentStep: stepNum }));
                setViewMode('path');
              }
            }
          }
        });
      }
    };

    checkPermissions();
  }, [memorialId, searchParams, router]);

  // Auth is now handled by middleware — no temp user creation needed

  // Check for successor on mount
  useEffect(() => {
    if (!authUserId) return;
    const checkSuccessor = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('user_successors')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUserId);

      setHasSuccessor(!!count && count > 0);
    };
    checkSuccessor();
  }, [authUserId]);

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
      const supabase = createClient();
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
        // Store the DB mode so auto-save never overwrites it from URL params
        if (data.mode) {
          setDbMode(data.mode);
        }
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

    if (!authUserId) {
      console.log("Waiting for authenticated user...");
      return;
    }

    setSaveStatus('saving');
    try {
      const supabase = createClient();
      const slug = generateSlug(memorialData.step1.fullName);
      // Use the DB mode if we loaded from an existing memorial (prevents overwriting family→personal)
      // Only fall back to URL param for brand new memorials
      const rawMode = dbMode || searchParams.get('mode') || 'personal';
      // DB constraint only allows 'personal' or 'family'. Map 'draft' to 'personal'.
      const currentMode = rawMode === 'family' ? 'family' : 'personal';

      const memorialRecord = {
        id: currentMemorialId || undefined,
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
        slug: slug || currentMemorialId,
        full_name: memorialData.step1.fullName,
        birth_date: memorialData.step1.birthDate || null,
        death_date: memorialData.step1.deathDate || null,
        profile_photo_url: memorialData.step1.profilePhotoPreview || null,
        cover_photo_url: memorialData.step8.coverPhotoPreview || null,
        completed_steps: memorialData.completedSteps,
        mode: currentMode,
        user_id: authUserId,
        paid: memorialData.paid,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('memorials')
        .upsert(memorialRecord, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) throw error;

      if (data && !currentMemorialId) {
        setCurrentMemorialId(data.id);
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
      await createVersion({
        memorialId: currentMemorialId,
        oldData: stepEntryDataRef.current,
        newData: memorialData,
        userId: authUserId || undefined,
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
          amount: 1470,
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
          <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin mx-auto mb-4" />
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

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('memorial_contributions')
        .insert([{
          memorial_id: currentMemorialId,
          user_id: authUserId,
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

  const isSelf = memorialData.step1.isSelfArchive;
  const isPrivate = memorialData.step1.privateUntilDeath; // Helper

  const texts = {
    header: isSelf ? "Your Legacy Archive" : "The Crossroads",
    subHeader: isSelf
      ? (isPrivate
        ? "This archive is currently sealed. It will strictly remain accessible only to you until the succession process is triggered."
        : "You are creating your own permanent record. You can choose to share this at any time.")
      : mode === 'family'
        ? "This is a shared space to preserve your family's heritage."
        : "A private sanctuary to honor a unique life.",
    cards: {
      facts: isSelf
        ? "Your birth, origins, and vital details."
        : "Birth, death, and the proof of existence. The foundation of the memory.",
      body: isSelf
        ? "Your childhood, career, and the family you built."
        : "Eras of life, from childhood to career and the families built along the way.",
      soul: isSelf
        ? "Your personality, values, and your full life story."
        : "Personality, traits, and the full life story. Who they were in essence.",
      witnesses: isSelf
        ? "Invite friends and family to share their memories of you."
        : (mode === 'family'
          ? "Centralize the family's stories. Invite members to build this archive together."
          : "Invite close friends to share memories. Entirely optional and moderated by you."),
      presence: isSelf
        ? "Your photos, videos, and your voice for the future."
        : "Photos, videos, and the return of the voice."
    }
  };

  // Step 1.3.3: Determine if all paths traveled — center space fills with name
  const allPathsTraveled = (['facts', 'body', 'soul', 'witnesses', 'presence'] as PathId[]).every(
    id => getPathStatus(memorialData, id, mode) === 'completed'
  );
  const somePathsTraveled = (['facts', 'body', 'soul'] as PathId[]).some(
    id => getPathStatus(memorialData, id) !== 'empty'
  );

  // Determine the correct dashboard path based on the memorial's actual mode
  const dashboardPath = authUserId
    ? `/dashboard/${dbMode === 'family' ? 'family' : dbMode === 'draft' ? 'draft' : 'personal'}/${authUserId}`
    : '/dashboard';

  return (
    <div className="min-h-screen bg-ivory relative">
      {viewMode === 'hub' ? (
        /* --- THE HUB VIEW (The Crossroads) — Step 1.3.3: Contemplation Space --- */
        <div className="max-w-6xl mx-auto px-6 py-20">
          {/* Back to Dashboard — proper navigation instead of browser back */}
          <div className="mb-6">
            <button
              onClick={() => router.replace(dashboardPath)}
              className="inline-flex items-center gap-2 text-charcoal/40 hover:text-charcoal transition-colors text-sm"
            >
              <ArrowLeft size={16} />
              <span>Back to Dashboard</span>
            </button>
          </div>

          {/* Step 1.1.1: Draft Banner */}
          <DraftBanner />

          <div className="text-center mb-16">
            {/* Badge */}
            <div className="flex justify-center mb-4">
              <ModeBadge />
            </div>

            {/* PRIVATE STATUS BADGE */}
            {memorialData.step1.privateUntilDeath && (
              <div className="flex justify-center mb-6 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory rounded-full text-xs font-bold tracking-wide shadow-md border border-ivory/20">
                  <Lock size={12} />
                  LOCKED: PRIVATE UNTIL DEATH
                </div>
              </div>
            )}

            {/* Dynamic Header */}
            <h1 className="font-serif text-5xl text-charcoal mb-4">
              {texts.header}
            </h1>


            {/* Version History Button */}
            {currentMemorialId && (
              <>
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-2 px-3 py-1.5 btn-paper border border-sand/40 rounded-lg hover:bg-sand/10 transition-all text-xs text-charcoal/60"
                >
                  <History size={14} />
                  <span className="hidden sm:inline">History</span>
                </button>

                {/* NEW ARCHE PREVIEW BUTTON */}
                <button
                  onClick={() => window.open(`/api/arche/preview-html?id=${currentMemorialId}`, '_blank')}
                  className="flex items-center gap-2 px-3 py-1.5 btn-paper bg-charcoal text-ivory border border-charcoal rounded-lg hover:opacity-90 transition-all text-xs"
                  title="Preview the offline export HTML"
                >
                  <EthernetPort size={14} />
                  <span className="hidden sm:inline">Arche HTML</span>
                </button>
              </>
            )}


            {/* ... Arche HTML Button ... */}

            {/* NEW: ZIP EXPORT BUTTON */}
            <button
              onClick={async () => {
                if (!confirm('Generate full archive? This may take a minute.')) return;
                try {
                  // Show some loading state if you wish, or just simple alert for now
                  const btn = document.getElementById('btn-export-zip');
                  if (btn) btn.innerText = '⏳ Generating...';

                  const res = await fetch('/api/arche/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ memorialId: currentMemorialId })
                  });

                  console.log(JSON.stringify({ memorialId: currentMemorialId }))

                  const result = await res.json();
                  if (btn) btn.innerText = '📦 Export ZIP';

                  if (result.success && result.downloadUrl) {
                    window.location.href = result.downloadUrl;
                  } else {
                    alert('Export failed: ' + (result.error || 'Unknown error'));
                  }
                } catch (e) {
                  alert('Error generating export');
                  console.error('Error generating export:', e);
                }
              }}
              id="btn-export-zip"
              className="flex items-center gap-2 px-3 py-1.5 btn-paper bg-sage text-ivory border border-sage rounded-lg hover:opacity-90 transition-all text-xs ml-2"
              title="Download the full offline archive (ZIP)"
            >
              <span className="hidden sm:inline">📦 Export ZIP</span>
            </button>

            {/*   // ... rest of the top bar ... */}

            {/* Step 1.3.1: Qualitative indicator instead of numerical */}
            {(() => {
              const isPaidMode = mode === 'personal' || mode === 'family';
              const isPresenceUnlocked = isPaidMode || memorialData.paid || completedPathsCount >= 2;

              return (
                <>
                  {!isPresenceUnlocked && (
                    <p className="text-xs text-charcoal/40 tracking-wide mb-6">
                      The Presence awaits. Explore two other paths to reveal it.
                    </p>
                  )}
                  {isPresenceUnlocked && !allPathsTraveled && (
                    <p className="text-xs text-mist/70 tracking-wide mb-6">
                      The Presence is open. Continue when you are ready.
                    </p>
                  )}

                  <p className="text-lg text-charcoal/60 max-w-xl mx-auto">
                    {texts.subHeader}
                    {mode === 'family' && !isSelf && (
                      <>
                        <br />
                        <span className="text-sm mt-2 block text-stone">
                          Designed for collaboration. You will invite members in the Witnesses section.
                        </span>
                      </>
                    )}
                    {!isSelf && mode !== 'family' && (
                      <>
                        <br />
                        <span className="text-sm mt-2 block text-mist">
                          You are the sole guardian. Sharing is optional and controlled by you.
                        </span>
                      </>
                    )}
                  </p>
                </>
              );
            })()}
          </div>

          {/* Step 1.3.3: Organic path layout with poetic descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Row 1: Facts + Body */}
            <PathCard
              id="facts"
              title={isSelf ? "The Facts" : "The Facts"}
              subtitle="The dates that anchor"
              description={texts.cards.facts}
              status={getPathStatus(memorialData, 'facts')}
              onClick={handlePathClick}
            />
            <PathCard
              id="body"
              title={isSelf ? "The Journey" : "The Body"}
              subtitle="The life that was lived"
              description={texts.cards.body}
              status={getPathStatus(memorialData, 'body')}
              onClick={handlePathClick}
            />
            <PathCard
              id="soul"
              title={isSelf ? "The Essence" : "The Soul"}
              subtitle="The person behind the name"
              description={texts.cards.soul}
              status={getPathStatus(memorialData, 'soul')}
              onClick={handlePathClick}
            />

            {/* Step 1.3.3: The center space — what has not yet been said */}
            <div className="hidden lg:flex items-center justify-center">
              {allPathsTraveled && memorialData.step1.fullName ? (
                <div className="text-center animate-fadeIn">
                  <p className="font-serif text-3xl text-charcoal/70 italic">
                    {memorialData.step1.fullName}
                  </p>
                  <p className="text-xs text-charcoal/30 mt-2 tracking-wide">is taking shape.</p>
                </div>
              ) : somePathsTraveled ? (
                <div className="text-center">
                  <div className="w-px h-12 bg-sand/40 mx-auto mb-3" />
                  <p className="text-xs text-charcoal/25 italic max-w-[140px]">
                    What has not yet been said
                  </p>
                  <div className="w-px h-12 bg-sand/40 mx-auto mt-3" />
                </div>
              ) : (
                <div className="w-px h-16 bg-sand/20 mx-auto" />
              )}
            </div>

            <PathCard
              id="witnesses"
              title={mode === 'family' && !isSelf ? "The Contributors" : "The Witnesses"}
              subtitle="Those who carry a fragment"
              description={texts.cards.witnesses}
              status={getPathStatus(memorialData, 'witnesses')}
              onClick={handlePathClick}
            />
            <PathCard
              id="presence"
              title={isSelf ? "The Presence" : "The Presence"}
              subtitle="What remains to be seen"
              description={texts.cards.presence}
              status={getPathStatus(memorialData, 'presence', mode)}
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
                className="w-full p-8 rounded-2xl border-2 border-mist bg-white hover:shadow-xl transition-all text-left flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-mist/10 rounded-2xl text-mist group-hover:scale-110 transition-transform">
                    <Users size={32} />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">Invite Witnesses</h3>
                    <p className="text-sm text-charcoal/60">Invite family and friends to add their own stories and shared memories.</p>
                  </div>
                </div>
                <div className="px-6 py-2 bg-sage text-ivory rounded-lg btn-paper text-sm font-bold">
                  Open for Contributions
                </div>
              </button>
            </div>
          )}

          {memorialData.paid ? (
            <div className="mt-12 p-10 bg-mist/5 border-2 border-mist/20 rounded-3xl text-center animate-fadeIn">
              <div className="w-16 h-16 bg-mist text-ivory rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
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
                  className="px-8 py-3 bg-charcoal text-ivory rounded-lg btn-paper font-medium hover:bg-charcoal/90 transition-all"
                >
                  View Public Page
                </Link>
                <button
                  onClick={() => alert("Invite Witnesses feature coming soon!")}
                  className="px-8 py-3 border border-sage text-sage rounded-lg btn-paper font-medium hover:bg-sage/5 transition-all"
                >
                  Invite Witnesses
                </button>
              </div>
            </div>
          ) : (
            completedPathsCount >= 2 && (
              /* Step 2.1.1 + 2.1.2: CTA appears as a revealed path, not a popup */
              <div className="mt-12 max-w-2xl mx-auto animate-fadeIn">
                <p className="text-xs text-charcoal/25 text-center mb-4 tracking-wide">
                  A new path has opened.
                </p>
                <div className="p-10 bg-white border border-sand/30 rounded-2xl text-center">
                  <h3 className="font-serif text-3xl text-charcoal mb-3">
                    {memorialData.step1.fullName
                      ? `The archive of ${memorialData.step1.fullName} is ready.`
                      : 'The archive is ready.'}
                  </h3>
                  <p className="text-charcoal/40 max-w-md mx-auto mb-8 text-sm leading-relaxed">
                    You have built something worth preserving. When you are ready, seal the archive to make it permanent.
                  </p>

                  {/* Step 2.1.1: "Seal this archive" — no price on button */}
                  <button
                    onClick={() => {
                      const sealUrl = currentMemorialId
                        ? `/seal-confirmation?memorialId=${currentMemorialId}`
                        : '/seal-confirmation';
                      router.push(sealUrl);
                    }}
                    className="px-10 py-4 bg-charcoal text-ivory rounded-xl font-medium hover:bg-charcoal/90 transition-all"
                  >
                    Seal this archive
                  </button>
                  {/* Step 2.1.1: Subtext below — price context without commercialism */}
                  <p className="text-xs text-charcoal/25 mt-4">
                    $1,470 — A single payment for a permanent archive. No monthly fees. No renewals. No surprises.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Step 1.1.4: Pause and come back later */}
          <div className="mt-16 text-center space-y-4">
            <button
              onClick={() => setShowPauseModal(true)}
              className="text-sm text-charcoal/40 hover:text-charcoal transition-colors border border-sand/30 rounded-xl px-6 py-3 hover:bg-sand/5"
            >
              Pause and come back later
            </button>
            <div>
              <button onClick={() => router.replace(dashboardPath)} className="text-xs text-charcoal/25 hover:text-charcoal/40 transition-colors">
                or return to Dashboard
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- THE PATH EDITOR VIEW --- */
        <div className="animate-fadeIn h-screen flex flex-col bg-ivory overflow-hidden">

          {/* Top Bar - Fixed at top */}
          <div className="flex-none bg-white border-b border-sand/20 z-50 px-4 sm:px-8 py-3 flex justify-between items-center">
            <button
              onClick={() => setViewMode('hub')}
              className="flex items-center gap-2 text-sm text-charcoal/60 hover:text-charcoal transition-all"
            >
              ← Back to Crossroads
            </button>
            <div className="flex items-center gap-3">

              {/* Save Status — Step 1.1.3: Minimal, no anxiety */}
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && (
                  <div className="flex items-center gap-1.5 text-xs text-charcoal/30">
                    <div className="w-3 h-3 border-1.5 border-charcoal/15 border-t-charcoal/40 rounded-full animate-spin" />
                  </div>
                )}
                {saveStatus === 'saved' && (
                  <div className="flex items-center gap-1.5 text-xs text-charcoal/30 animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    <span>Saved</span>
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div className="text-xs text-stone">Save failed</div>
                )}
              </div>

              {/* Step 1.2.4: View as a visitor button */}
              {currentMemorialId && (
                <button
                  onClick={() => {
                    // Opens a full preview in a new tab, no editing UI
                    const previewUrl = `/api/arche/preview-html?id=${currentMemorialId}`;
                    window.open(previewUrl, '_blank');
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-sand/30 rounded-lg hover:bg-sand/5 transition-all text-xs text-charcoal/50"
                  title="View as a visitor will see this archive"
                >
                  <Eye size={13} />
                  <span>View as visitor</span>
                </button>
              )}

              {/* Step 1.1.4: Pause button in editor bar */}
              <button
                onClick={() => setShowPauseModal(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-sand/30 rounded-lg hover:bg-sand/5 transition-all text-xs text-charcoal/40"
              >
                Pause
              </button>

              {/* Version History Button */}
              {currentMemorialId && (
                <button
                  onClick={() => setShowHistory(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-sand/30 rounded-lg hover:bg-sand/5 transition-all text-xs text-charcoal/40"
                >
                  <History size={13} />
                  <span className="hidden sm:inline">History</span>
                </button>
              )}
            </div>
          </div>

          {/* Step 1.1.2: Contextual emotional message for active path */}
          {activePath && PATH_MESSAGES[activePath] && (
            <div className="flex-none bg-sand/8 border-b border-sand/15 px-8 py-2.5">
              <p className="text-xs text-charcoal/35 italic text-center max-w-2xl mx-auto">
                {PATH_MESSAGES[activePath]}
              </p>
            </div>
          )}

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
                              ? 'border-mist text-mist bg-white'
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
                          memorialId={currentMemorialId}
                        />
                      )}
                      {memorialData.currentStep === 2 && (
                        <Step2Childhood
                          data={memorialData.step2}
                          onUpdate={updateStep2}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 3 }))}
                          onBack={() => setViewMode('hub')}
                          readOnly={!canEditStep(2)}
                          isSelfArchive={memorialData.step1.isSelfArchive}
                        />
                      )}
                      {memorialData.currentStep === 3 && (
                        <Step3Career
                          data={memorialData.step3}
                          onUpdate={updateStep3}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 4 }))}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 2 }))}
                          readOnly={!canEditStep(3)}
                          isSelfArchive={memorialData.step1.isSelfArchive}
                        />
                      )}
                      {memorialData.currentStep === 4 && (
                        <Step4Relationships
                          data={memorialData.step4}
                          onUpdate={updateStep4}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 3 }))}
                          readOnly={!canEditStep(4)}
                          isSelfArchive={memorialData.step1.isSelfArchive}
                        />
                      )}
                      {memorialData.currentStep === 5 && (
                        <Step5Personality
                          data={memorialData.step5}
                          onUpdate={updateStep5}
                          onNext={() => setMemorialData(p => ({ ...p, currentStep: 6 }))}
                          onBack={() => setViewMode('hub')}
                          readOnly={!canEditStep(5)}
                          isSelfArchive={memorialData.step1.isSelfArchive}
                        />
                      )}
                      {memorialData.currentStep === 6 && (
                        <Step6LifeStory
                          data={memorialData.step6}
                          onUpdate={updateStep6}
                          onNext={() => setViewMode('hub')}
                          onBack={() => setMemorialData(p => ({ ...p, currentStep: 5 }))}
                          readOnly={!canEditStep(6)}
                          isSelfArchive={memorialData.step1.isSelfArchive}
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
                          memorialId={currentMemorialId}
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
                      {memorialData.currentStep === 10 && (
                        <Step10Review
                          data={memorialData}
                          memorialId={currentMemorialId}
                          onBack={goToPreviousStep}
                          onJumpToStep={goToStep}
                          isSelfArchive={memorialData.step1.isSelfArchive}
                          hasSuccessor={hasSuccessor}
                          userId={authUserId || ''}
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
                  <Separator className="w-2 bg-transparent hover:bg-mist/10 transition-colors group flex items-center justify-center cursor-col-resize">
                    <div className="w-0.5 h-16 bg-sand/40 rounded-full group-hover:bg-mist/50 transition-colors" />
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
              className="flex items-center gap-2 px-5 py-3 bg-charcoal text-ivory rounded-lg btn-paper shadow-2xl font-serif border border-ivory/20 active:scale-95 transition-transform"
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
          userId={authUserId || undefined}
          userName="Owner"
          onRestore={(restoredData) => {
            setMemorialData(restoredData);
            stepEntryDataRef.current = structuredClone(restoredData);
            setShowHistory(false);
          }}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Step 1.1.4: Pause and come back later modal */}
      {showPauseModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm">
          <div className="bg-ivory rounded-2xl w-full max-w-md p-8 shadow-2xl border border-sand/30">
            <h3 className="font-serif text-2xl text-charcoal mb-3 text-center">
              Your archive is safe
            </h3>
            <p className="text-sm text-charcoal/50 text-center leading-relaxed mb-8">
              Your archive is saved exactly where you left it. We can send you a gentle reminder in 7 days, unless you&apos;d prefer we don&apos;t.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handlePauseAndLeave(true)}
                className="w-full py-3 px-6 bg-white border border-sand/30 rounded-xl text-sm text-charcoal hover:bg-sand/5 transition-all"
              >
                Send a reminder in 7 days
              </button>
              <button
                onClick={() => handlePauseAndLeave(false)}
                className="w-full py-3 px-6 bg-white border border-sand/30 rounded-xl text-sm text-charcoal/50 hover:bg-sand/5 transition-all"
              >
                Do not send a reminder
              </button>
              <button
                onClick={() => setShowPauseModal(false)}
                className="w-full py-2 text-xs text-charcoal/30 hover:text-charcoal/50 transition-colors"
              >
                Continue working
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}

export default function CreateMemorialPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin" />
      </div>
    }>
      <CreateMemorialPageContent />
    </Suspense>
  );
}
