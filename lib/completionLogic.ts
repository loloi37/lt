// lib/completionLogic.ts
// Step 1.3.2: Replace "completion" vocabulary with "exploration"
// Centralized logic for determining archive exploration status
// Used by Step10Review, LiveMirror, Dashboard, etc.

import { MemorialData } from '@/types/memorial';

export type CompletionStatus = 'complete' | 'complete_solo' | 'in_progress' | 'minimal';

export interface StepCompletionInfo {
    step: number;
    title: string;
    completed: boolean;
    required: boolean;
    optional: boolean;
    summary: string;
    category: 'core' | 'enrichment';
}

export interface CompletionResult {
    status: CompletionStatus;
    percentage: number;
    totalPercentage: number;
    coreStepsCompleted: number;
    coreStepsTotal: number;
    enrichmentStepsCompleted: number;
    enrichmentStepsTotal: number;
    steps: StepCompletionInfo[];
    message: string;
    canPublish: boolean;
}

/**
 * Calculate the exploration status of a memorial archive.
 * Step 1.3.2: "explore" not "complete"
 */
export function calculateCompletion(data: MemorialData): CompletionResult {
    const steps: StepCompletionInfo[] = [
        {
            step: 1,
            title: 'Basic Information',
            completed: !!(data.step1.fullName && data.step1.birthDate),
            required: true,
            optional: false,
            category: 'core',
            summary: data.step1.fullName
                ? `${data.step1.fullName} \u2022 ${data.step1.birthDate}${data.step1.deathDate ? ` - ${data.step1.deathDate}` : ' (Living)'}`
                : 'A path to explore',
        },
        {
            step: 2,
            title: 'Early Life & Childhood',
            completed: !!(data.step2.familyBackground || data.step2.childhoodHome),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step2.childhoodHome
                ? `${data.step2.schools.highSchool || 'Schools added'} \u2022 ${data.step2.childhoodPersonality.length} traits`
                : 'A path to explore',
        },
        {
            step: 3,
            title: 'Career & Education',
            completed: !!(data.step3.occupations.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step3.occupations.length > 0
                ? `${data.step3.occupations.length} role${data.step3.occupations.length !== 1 ? 's' : ''} \u2022 ${data.step3.careerHighlights.length} highlights`
                : 'A path to explore',
        },
        {
            step: 4,
            title: 'Relationships & Family',
            completed: !!(data.step4.partners.length > 0 || data.step4.children.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: (data.step4.partners.length + data.step4.children.length) > 0
                ? `${data.step4.partners.length} partner${data.step4.partners.length !== 1 ? 's' : ''} \u2022 ${data.step4.children.length} child${data.step4.children.length !== 1 ? 'ren' : ''}`
                : 'A path to explore',
        },
        {
            step: 5,
            title: 'Personality, Values & Passions',
            completed: !!(data.step5.personalityTraits.length > 0 || data.step5.coreValues.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: (data.step5.personalityTraits.length + data.step5.coreValues.length) > 0
                ? `${data.step5.personalityTraits.length} traits \u2022 ${data.step5.coreValues.length} values`
                : 'A path to explore',
        },
        {
            step: 6,
            title: 'Full Life Story',
            completed: !!(data.step6.biography.trim().length > 100),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step6.biography.trim().length > 0
                ? `${data.step6.biography.trim().split(/\s+/).length} words \u2022 ${data.step6.lifeChapters.length} chapters`
                : 'A path to explore',
        },
        {
            step: 7,
            title: 'Memories & Witnesses',
            completed: !!(
                data.step7.sharedMemories.length > 0 ||
                data.step7.impactStories.length > 0 ||
                (data.step7.invitedEmails && data.step7.invitedEmails.length > 0)
            ),
            required: false,
            optional: true,
            category: 'enrichment',
            summary: (() => {
                const memories = data.step7.sharedMemories.length;
                const stories = data.step7.impactStories.length;
                const invited = data.step7.invitedEmails?.length || 0;
                if (memories + stories + invited === 0) return 'No witnesses yet \u2014 entirely optional';
                return `${memories} memories \u2022 ${stories} stories \u2022 ${invited} invited`;
            })(),
        },
        {
            step: 8,
            title: 'Photos & Legacy',
            completed: !!(data.step8.coverPhotoPreview || data.step8.gallery.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step8.gallery.length > 0
                ? `${data.step8.gallery.length} photos \u2022 ${data.step8.voiceRecordings.length} recordings`
                : 'A path to explore',
        },
        {
            step: 9,
            title: 'Videos',
            completed: !!(data.step9.videos.length > 0),
            required: false,
            optional: true,
            category: 'enrichment',
            summary: data.step9.videos.length > 0
                ? `${data.step9.videos.length} video${data.step9.videos.length !== 1 ? 's' : ''}`
                : 'No videos yet \u2014 entirely optional',
        },
    ];

    const coreSteps = steps.filter(s => s.category === 'core');
    const coreCompleted = coreSteps.filter(s => s.completed).length;
    const coreTotal = coreSteps.length;
    const corePercentage = Math.round((coreCompleted / coreTotal) * 100);

    const enrichmentSteps = steps.filter(s => s.category === 'enrichment');
    const enrichmentCompleted = enrichmentSteps.filter(s => s.completed).length;
    const enrichmentTotal = enrichmentSteps.length;

    const allCompleted = steps.filter(s => s.completed).length;
    const totalPercentage = Math.round((allCompleted / steps.length) * 100);

    // Step 1.3.2: Exploration vocabulary
    let status: CompletionStatus;
    let message: string;
    const hasBasicInfo = steps[0].completed;

    if (coreCompleted === coreTotal && enrichmentCompleted === enrichmentTotal) {
        status = 'complete';
        message = 'Every path has been traveled. The archive is whole.';
    } else if (coreCompleted === coreTotal) {
        status = 'complete_solo';
        message = 'The core paths are traveled. You can invite witnesses or add videos at any time to enrich the archive further.';
    } else if (hasBasicInfo && coreCompleted >= 3) {
        status = 'in_progress';
        message = `You have laid the foundations. ${coreTotal - coreCompleted} path${coreTotal - coreCompleted !== 1 ? 's' : ''} remain${coreTotal - coreCompleted === 1 ? 's' : ''} to discover.`;
    } else if (hasBasicInfo) {
        status = 'minimal';
        message = 'The archive is begun. Continue exploring to build a rich memorial.';
    } else {
        status = 'minimal';
        message = 'Begin with the Facts \u2014 the dates that anchor every story.';
    }

    return {
        status,
        percentage: corePercentage,
        totalPercentage,
        coreStepsCompleted: coreCompleted,
        coreStepsTotal: coreTotal,
        enrichmentStepsCompleted: enrichmentCompleted,
        enrichmentStepsTotal: enrichmentTotal,
        steps,
        message,
        canPublish: hasBasicInfo,
    };
}

/**
 * Check if a specific step is an enrichment (optional) step.
 */
export function isEnrichmentStep(stepNumber: number): boolean {
    return stepNumber === 7 || stepNumber === 9;
}
