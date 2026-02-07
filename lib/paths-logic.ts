// lib/paths-logic.ts
import { MemorialData } from '@/types/memorial';
import { PathId, PathStatus } from '@/types/paths';

export const getPathStatus = (data: MemorialData, pathId: PathId): PathStatus => {
    switch (pathId) {
        case 'facts':
            // Path 1: The Facts (Step 1)
            if (data.step1.fullName && data.step1.birthDate) return 'completed';
            if (data.step1.fullName || data.step1.birthDate) return 'in_progress';
            return 'empty';

        case 'body':
            // Path 2: The Body (Steps 2, 3, 4)
            const hasChildhood = !!data.step2.childhoodHome;
            const hasCareer = data.step3.occupations.length > 0;
            const hasFamily = data.step4.partners.length > 0 || data.step4.children.length > 0;

            if (hasChildhood && hasCareer && hasFamily) return 'completed';
            if (hasChildhood || hasCareer || hasFamily) return 'in_progress';
            return 'empty';

        case 'soul':
            // Path 3: The Soul (Steps 5, 6)
            const hasTraits = data.step5.personalityTraits.length >= 3;
            const hasBio = data.step6.biography.length > 200;

            if (hasTraits && hasBio) return 'completed';
            if (hasTraits || hasBio) return 'in_progress';
            return 'empty';

        case 'presence':
            // Path 4: The Presence (Steps 8, 9)
            // MASTERSTROKE LOGIC: Check if at least 2 other paths are completed
            const completedPaths = ['facts', 'body', 'soul'].filter(
                id => getPathStatus(data, id as PathId) === 'completed'
            ).length;

            if (completedPaths < 2) return 'locked';

            const hasPhotos = data.step8.gallery.length > 0;
            const hasVideos = data.step9.videos.length > 0;

            if (hasPhotos && hasVideos) return 'completed';
            if (hasPhotos || hasVideos) return 'in_progress';
            return 'empty';

        case 'witnesses':
            // Step 7: Memories & Stories
            const hasInvited = data.step7.invitedEmails.length > 0;
            if (hasInvited) return 'completed';
            return 'empty';

        default:
            return 'empty';
    }
};