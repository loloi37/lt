// lib/completionLogic.ts
// Centralized logic for determining archive completion status
// Used by Step10Review, LiveMirror, Dashboard, etc.

import { MemorialData } from '@/types/memorial';

export type CompletionStatus = 'complete' | 'complete_solo' | 'in_progress' | 'minimal';

export interface StepCompletionInfo {
    step: number;
    title: string;
    completed: boolean;
    required: boolean;        // Is this step required for "complete" status?
    optional: boolean;        // Is this an enrichment step (witnesses, videos)?
    summary: string;
    category: 'core' | 'enrichment'; // core = needed for completion, enrichment = bonus
}

export interface CompletionResult {
    status: CompletionStatus;
    percentage: number;              // 0-100, based on CORE steps only
    totalPercentage: number;         // 0-100, including enrichment
    coreStepsCompleted: number;
    coreStepsTotal: number;
    enrichmentStepsCompleted: number;
    enrichmentStepsTotal: number;
    steps: StepCompletionInfo[];
    message: string;                 // User-facing message
    canPublish: boolean;
}

/**
 * Calculate the completion status of a memorial archive.
 * 
 * KEY PRINCIPLE: Witnesses (Step 7 invitations) and Videos (Step 9) are 
 * ENRICHMENT steps, not required for completion. A solo creator who fills 
 * all core steps has a "complete" archive.
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
                ? `${data.step1.fullName} • ${data.step1.birthDate}${data.step1.deathDate ? ` - ${data.step1.deathDate}` : ' (Living)'}`
                : 'Not completed',
        },
        {
            step: 2,
            title: 'Early Life & Childhood',
            completed: !!(data.step2.familyBackground || data.step2.childhoodHome),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step2.childhoodHome
                ? `${data.step2.schools.highSchool || 'Schools added'} • ${data.step2.childhoodPersonality.length} traits`
                : 'Not completed',
        },
        {
            step: 3,
            title: 'Career & Education',
            completed: !!(data.step3.occupations.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step3.occupations.length > 0
                ? `${data.step3.occupations.length} job${data.step3.occupations.length !== 1 ? 's' : ''} • ${data.step3.careerHighlights.length} highlights`
                : 'Not completed',
        },
        {
            step: 4,
            title: 'Relationships & Family',
            completed: !!(data.step4.partners.length > 0 || data.step4.children.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: (data.step4.partners.length + data.step4.children.length) > 0
                ? `${data.step4.partners.length} partner${data.step4.partners.length !== 1 ? 's' : ''} • ${data.step4.children.length} child${data.step4.children.length !== 1 ? 'ren' : ''}`
                : 'Not completed',
        },
        {
            step: 5,
            title: 'Personality, Values & Passions',
            completed: !!(data.step5.personalityTraits.length > 0 || data.step5.coreValues.length > 0),
            required: false,
            optional: false,
            category: 'core',
            summary: (data.step5.personalityTraits.length + data.step5.coreValues.length) > 0
                ? `${data.step5.personalityTraits.length} traits • ${data.step5.coreValues.length} values`
                : 'Not completed',
        },
        {
            step: 6,
            title: 'Full Life Story',
            completed: !!(data.step6.biography.trim().length > 100),
            required: false,
            optional: false,
            category: 'core',
            summary: data.step6.biography.trim().length > 0
                ? `${data.step6.biography.trim().split(/\s+/).length} words • ${data.step6.lifeChapters.length} chapters`
                : 'Not completed',
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
            optional: true,       // ← ENRICHMENT: not required for "complete"
            category: 'enrichment',
            summary: (() => {
                const memories = data.step7.sharedMemories.length;
                const stories = data.step7.impactStories.length;
                const invited = data.step7.invitedEmails?.length || 0;
                if (memories + stories + invited === 0) return 'No witnesses yet — optional';
                return `${memories} memories • ${stories} stories • ${invited} invited`;
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
                ? `${data.step8.gallery.length} photos • ${data.step8.voiceRecordings.length} recordings`
                : 'Not completed',
        },
        {
            step: 9,
            title: 'Videos',
            completed: !!(data.step9.videos.length > 0),
            required: false,
            optional: true,       // ← ENRICHMENT: not required for "complete"
            category: 'enrichment',
            summary: data.step9.videos.length > 0
                ? `${data.step9.videos.length} video${data.step9.videos.length !== 1 ? 's' : ''}`
                : 'No videos yet — optional',
        },
    ];

    // Calculate core completion (steps that matter for "complete" status)
    const coreSteps = steps.filter(s => s.category === 'core');
    const coreCompleted = coreSteps.filter(s => s.completed).length;
    const coreTotal = coreSteps.length;
    const corePercentage = Math.round((coreCompleted / coreTotal) * 100);

    // Calculate enrichment
    const enrichmentSteps = steps.filter(s => s.category === 'enrichment');
    const enrichmentCompleted = enrichmentSteps.filter(s => s.completed).length;
    const enrichmentTotal = enrichmentSteps.length;

    // Total percentage (all steps)
    const allCompleted = steps.filter(s => s.completed).length;
    const totalPercentage = Math.round((allCompleted / steps.length) * 100);

    // Determine status
    let status: CompletionStatus;
    let message: string;
    const hasBasicInfo = steps[0].completed; // Step 1 is always required

    if (coreCompleted === coreTotal && enrichmentCompleted === enrichmentTotal) {
        // Everything done including witnesses + videos
        status = 'complete';
        message = 'Your archive is fully complete with all enrichments.';
    } else if (coreCompleted === coreTotal) {
        // All core steps done, some enrichment missing — THIS IS STILL COMPLETE
        status = 'complete_solo';
        message = 'Your archive is complete. You can invite witnesses or add videos at any time to enrich it further.';
    } else if (hasBasicInfo && coreCompleted >= 3) {
        status = 'in_progress';
        message = `Great progress! ${coreTotal - coreCompleted} core section${coreTotal - coreCompleted !== 1 ? 's' : ''} left to complete your archive.`;
    } else if (hasBasicInfo) {
        status = 'minimal';
        message = 'Your archive is started. Keep filling in sections to build a rich memorial.';
    } else {
        status = 'minimal';
        message = 'Start by completing the Basic Information section.';
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