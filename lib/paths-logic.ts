// lib/paths-logic.ts
import { MemorialData } from '@/types/memorial';
import { PathId, PathStatus } from '@/types/paths';

export const getPathStatus = (data: MemorialData, pathId: PathId): PathStatus => {
    if (!data) return 'empty';

    switch (pathId) {
        case 'facts':
            // Path 1: The Facts (Step 1)
            const s1 = data.step1;
            if (!s1) return 'empty';
            if (s1.fullName && s1.birthDate) return 'completed';
            if (s1.fullName || s1.birthDate) return 'in_progress';
            return 'empty';

        case 'body':
            // Path 2: The Body (Steps 2, 3, 4)
            const s2 = data.step2;
            const s3 = data.step3;
            const s4 = data.step4;

            const hasChildhood = !!s2?.childhoodHome;
            const hasCareer = (s3?.occupations || []).length > 0;
            const hasFamily = (s4?.partners || []).length > 0 || (s4?.children || []).length > 0;

            if (hasChildhood && hasCareer && hasFamily) return 'completed';
            if (hasChildhood || hasCareer || hasFamily) return 'in_progress';
            return 'empty';

        case 'soul':
            // Path 3: The Soul (Steps 5, 6)
            const s5 = data.step5;
            const s6 = data.step6;

            const hasTraits = (s5?.personalityTraits || []).length >= 3;
            const hasBio = (s6?.biography || '').length > 200;

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

            const s8 = data.step8;
            const s9 = data.step9;

            const hasPhotos = (s8?.gallery || []).length > 0;
            const hasVideos = (s9?.videos || []).length > 0;

            if (hasPhotos && hasVideos) return 'completed';
            if (hasPhotos || hasVideos) return 'in_progress';
            return 'empty';

        case 'witnesses':
            // Step 7: Memories & Stories
            const s7 = data.step7;
            const hasInvited = (s7?.invitedEmails || []).length > 0;
            if (hasInvited) return 'completed';
            return 'empty';

        default:
            return 'empty';
    }
};