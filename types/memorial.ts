// types/memorial.ts - Collections-based data model (Luxury Refactor)
// Replaces the old step1-step9 wizard structure with thematic collections:
// Stories, Media, Timeline, Network

// ==========================================
// CORE COLLECTION INTERFACES
// ==========================================

/** Stories Collection - merges biography, personality, childhood, career, values */
export interface StoryData {
  // Basic identity
  fullName: string;
  birthDate: string;
  deathDate: string | null;
  isStillLiving: boolean;
  isSelfArchive?: boolean;
  privateUntilDeath?: boolean;
  birthPlace: string;
  deathPlace: string;
  profilePhoto: File | null;
  profilePhotoPreview: string | null;
  profilePhotoHash?: string;
  epitaph: string;

  // Biography & life narrative
  biography: string;
  lifePhilosophy: string;

  // Childhood & early life
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

  // Career & education
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

  // Personality & values
  personalityTraits: string[];
  coreValues: string[];
  passions: string[];
  favoriteQuotes: Array<{
    id: string;
    text: string;
    context: string;
  }>;
  memorableSayings: string[];

  // Legacy
  legacyStatement: string;
}

/** Media Collection - all photos, videos, voice recordings */
export interface MediaData {
  coverPhoto: File | null;
  coverPhotoPreview: string | null;
  coverPhotoHash?: string;

  gallery: Array<{
    id: string;
    file: File;
    preview: string;
    caption: string;
    year: string;
    type: 'photo' | 'video';
    sha256_hash?: string;
  }>;

  childhoodPhotos: Array<{
    file: File;
    preview: string;
    caption: string;
    year: string;
  }>;

  interactiveGallery: Array<{
    id: string;
    file: File;
    preview: string;
    description: string;
    sha256_hash?: string;
  }>;

  voiceRecordings: Array<{
    id: string;
    file: File;
    title: string;
    sha256_hash?: string;
  }>;

  videos: Array<{
    id: string;
    url: string;
    thumbnail: string;
    title: string;
    duration?: string;
    description?: string;
    sha256_hash?: string;
  }>;
}

/** Timeline Collection - life events, chapters, milestones */
export interface TimelineData {
  lifeChapters: Array<{
    id: string;
    period: string;
    ageRange: string;
    title: string;
    description: string;
    keyEvents: string[];
  }>;

  majorLifeEvents: Array<{
    id: string;
    year: string;
    title: string;
    category: 'marriage' | 'birth' | 'career' | 'achievement' | 'loss' | 'milestone';
    description: string;
  }>;
}

/** Network Collection - family members, contributors, shared memories */
export interface NetworkData {
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

  // Contributor invitations (formerly "Witnesses")
  invitedEmails: string[];
  contributorPersonalMessage: string;
  sentInvitations: SentInvitation[];
  memorialId?: string;

  // Shared memories & impact stories
  sharedMemories: SharedMemory[];
  impactStories: ImpactStory[];
}

/** Letter to the Future - time-delayed messages */
export interface LetterData {
  id: string;
  message: string;
  recipientEmail: string;
  recipientName: string;
  deliveryDate: string;
  createdAt: string;
  status: 'scheduled' | 'delivered' | 'failed';
}

/** Preservation status for Arweave blockchain storage */
export interface PreservationStatus {
  arweaveTxId: string | null;
  arweaveStatus: 'pending' | 'confirming' | 'confirmed' | 'failed' | null;
  replicationCount: number;
  certificateUrl: string | null;
  preservedAt: string | null;
}

// ==========================================
// MEMORIAL STATE MODEL
// ==========================================

/** Single state field replaces mode + status + paid booleans */
export type MemorialState = 'creating' | 'private' | 'live' | 'preserved';

/** The unified memorial data structure */
export interface MemorialData {
  stories: StoryData;
  media: MediaData;
  timeline: TimelineData;
  network: NetworkData;
  letters: LetterData[];
  lastSaved: string | null;
}

/** Collection tab names for the builder UI */
export const COLLECTION_NAMES = [
  'Stories',
  'Photos',
  'Timeline',
  'Voices'
] as const;

export type CollectionName = typeof COLLECTION_NAMES[number];

// ==========================================
// SHARED SUB-TYPES
// ==========================================

export interface SentInvitation {
  email: string;
  sentAt: string;
  status: 'sent' | 'accepted' | 'declined' | 'pending';
  acceptedAt?: string;
}

export interface SharedMemory {
  id: string;
  title: string;
  date: string;
  content: string;
  author: string;
  relationship: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  content: string;
  author: string;
}

// ==========================================
// COLLABORATION TYPES (Contributors, formerly Witnesses)
// ==========================================

export type ContributorRole = 'owner' | 'co_guardian' | 'contributor';

export type InvitationStatus = 'pending' | 'accepted' | 'declined' | 'expired';

export type ContributionStatus = 'pending_approval' | 'approved' | 'rejected' | 'needs_changes';

export interface ContributorInvitation {
  id: string;
  memorialId: string;
  inviterName: string;
  inviteeEmail: string;
  role: ContributorRole;
  personalMessage?: string;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
}

export interface MemorialContributor {
  id: string;
  memorialId: string;
  userId: string;
  displayName: string;
  email: string;
  role: ContributorRole;
  joinedAt: string;
  status: 'active' | 'suspended';
}

export interface Contribution {
  id: string;
  memorialId: string;
  contributorId: string;
  type: 'memory' | 'photo' | 'video';
  content: any;
  status: ContributionStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  disputed?: boolean;
}

// ==========================================
// MEMORIAL RELATIONS
// ==========================================

export interface MemorialRelation {
  id: string;
  from_memorial_id: string;
  to_memorial_id: string;
  target_name?: string;
  target_photo?: string;
  relationship_type: 'parent' | 'child' | 'spouse' | 'sibling' | 'other';
  description?: string;
}

// ==========================================
// DEFAULT DATA FACTORIES
// ==========================================

export function createDefaultStoryData(): StoryData {
  return {
    fullName: '',
    birthDate: '',
    deathDate: null,
    isStillLiving: false,
    isSelfArchive: false,
    privateUntilDeath: false,
    birthPlace: '',
    deathPlace: '',
    profilePhoto: null,
    profilePhotoPreview: null,
    epitaph: '',
    biography: '',
    lifePhilosophy: '',
    childhoodHome: '',
    familyBackground: '',
    schools: { elementary: '', highSchool: '', college: '', additionalEducation: '' },
    childhoodPersonality: [],
    earlyInterests: [],
    occupations: [],
    careerHighlights: [],
    education: { major: '', graduationYear: '', honors: '' },
    personalityTraits: [],
    coreValues: [],
    passions: [],
    favoriteQuotes: [],
    memorableSayings: [],
    legacyStatement: '',
  };
}

export function createDefaultMediaData(): MediaData {
  return {
    coverPhoto: null,
    coverPhotoPreview: null,
    gallery: [],
    childhoodPhotos: [],
    interactiveGallery: [],
    voiceRecordings: [],
    videos: [],
  };
}

export function createDefaultTimelineData(): TimelineData {
  return {
    lifeChapters: [],
    majorLifeEvents: [],
  };
}

export function createDefaultNetworkData(): NetworkData {
  return {
    partners: [],
    children: [],
    invitedEmails: [],
    contributorPersonalMessage: '',
    sentInvitations: [],
    sharedMemories: [],
    impactStories: [],
  };
}

export function createDefaultMemorialData(): MemorialData {
  return {
    stories: createDefaultStoryData(),
    media: createDefaultMediaData(),
    timeline: createDefaultTimelineData(),
    network: createDefaultNetworkData(),
    letters: [],
    lastSaved: null,
  };
}
