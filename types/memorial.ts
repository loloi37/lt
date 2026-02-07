// types/memorial.ts - UPDATED with Step 9 for Videos

export interface BasicInfo {
  fullName: string;
  birthDate: string;
  deathDate: string | null;
  isStillLiving: boolean;
  birthPlace: string;
  deathPlace: string;
  profilePhoto: File | null;
  profilePhotoPreview: string | null;
  epitaph: string;
}

export interface ChildhoodInfo {
  childhoodHome: string;
  familyBackground: string;
  schools: {
    elementary: string;
    highSchool: string;
    college: string;
    additionalEducation: string;
  };
  childhoodPersonality: string[];
  earlyInterests: string[];
  childhoodPhotos: Array<{
    file: File;
    preview: string;
    caption: string;
    year: string;
  }>;
}

export interface CareerEducation {
  occupations: Array<{
    id: string;
    title: string;
    company: string;
    yearsFrom: string;
    yearsTo: string;
    description: string;
  }>;
  careerHighlights: string[];
  education: {
    major: string;
    graduationYear: string;
    honors: string;
  };
}

export interface RelationshipsFamily {
  partners: Array<{
    id: string;
    name: string;
    relationshipType: string;
    yearsFrom: string;
    yearsTo: string;
    description: string;
    photo: File | null;
    photoPreview: string | null;
  }>;
  children: Array<{
    id: string;
    name: string;
    birthYear: string;
    description: string;
  }>;
  majorLifeEvents: Array<{
    id: string;
    year: string;
    title: string;
    category: 'marriage' | 'birth' | 'career' | 'achievement' | 'loss' | 'milestone';
    description: string;
  }>;
}

export interface PersonalityValues {
  personalityTraits: string[];
  coreValues: string[];
  passions: string[];
  lifePhilosophy: string;
  favoriteQuotes: Array<{
    id: string;
    text: string;
    context: string;
  }>;
  memorableSayings: string[];
}

export interface LifeStory {
  biography: string;
  lifeChapters: Array<{
    id: string;
    period: string;
    ageRange: string;
    title: string;
    description: string;
    keyEvents: string[];
  }>;
}

export interface MemoriesStories {
  sharedMemories: Array<{
    id: string;
    title: string;
    date: string;
    content: string;
    author: string;
    relationship: string;
  }>;
  impactStories: Array<{
    id: string;
    title: string;
    content: string;
    author: string;
  }>;
  invitedEmails: string[];
}

// UPDATED: Step 8 now only has Photos & Legacy (no videos)
export interface MediaLegacy {
  coverPhoto: File | null;
  coverPhotoPreview: string | null;
  gallery: Array<{
    id: string;
    file: File;
    preview: string;
    caption: string;
    year: string;
    type: 'photo' | 'video';
  }>;
  interactiveGallery: Array<{
    id: string;
    file: File;
    preview: string;
    description: string;
  }>;
  voiceRecordings: Array<{
    id: string;
    file: File;
    title: string;
  }>;
  legacyStatement: string;
}

// NEW: Step 9 for Videos only
// NEW: Step 9 for Videos only
export interface VideoContent {
  videos: Array<{
    id: string;
    url: string; // Public URL from Supabase Storage
    thumbnail: string; // Public URL of thumbnail image
    title: string;
    duration?: string;
  }>;
}

// UPDATED: MemorialData with step9
export interface MemorialData {
  step1: BasicInfo;
  step2: ChildhoodInfo;
  step3: CareerEducation;
  step4: RelationshipsFamily;
  step5: PersonalityValues;
  step6: LifeStory;
  step7: MemoriesStories;
  step8: MediaLegacy;
  step9: VideoContent; // NEW
  currentStep: number;
  paid: boolean; // Tracking payment status
  lastSaved: string | null;
  completedSteps: number[];
}

export const TOTAL_STEPS = 10; // UPDATED from 9 to 10

export const STEP_NAMES = [
  'Basic Information',
  'Early Life & Childhood',
  'Career & Education',
  'Relationships & Family',
  'Personality, Values & Passions',
  'Full Life Story',
  'Memories & Stories',
  'Photos & Legacy', // UPDATED - removed "Videos"
  'Videos', // NEW - Step 9
  'Review & Publish' // UPDATED - now step 10
];