import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Basic content screening keywords (expand as needed)
const FLAGGED_PATTERNS = [
    /\b(ssn|social security)\b/i,
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN pattern
    /\b(medical record|diagnosis|prescription)\b/i,
    /\b(credit card|bank account)\b/i,
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card pattern
];

interface ModerationResult {
    approved: boolean;
    flags: string[];
    requiresManualReview: boolean;
}

/**
 * Screen memorial content before permanent Arweave upload.
 * Protects against the "Permanence Paradox" — once on blockchain, it cannot be removed.
 *
 * TODO: Integrate AI-powered screening for more thorough content review.
 */
function screenContent(content: string): ModerationResult {
    const flags: string[] = [];

    for (const pattern of FLAGGED_PATTERNS) {
        if (pattern.test(content)) {
            flags.push(`Potential sensitive data detected: ${pattern.source}`);
        }
    }

    // Check for excessively large content that might indicate data dumping
    if (content.length > 5_000_000) {
        flags.push('Content exceeds 5MB text limit — review for data dumping');
    }

    return {
        approved: flags.length === 0,
        flags,
        requiresManualReview: flags.length > 0,
    };
}

export async function POST(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Memorial ID is required' }, { status: 400 });
        }

        // Fetch memorial data
        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('stories, media, timeline, network, user_id')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        // Screen all text content
        const allContent = JSON.stringify({
            stories: memorial.stories,
            timeline: memorial.timeline,
            network: memorial.network,
        });

        const result = screenContent(allContent);

        return NextResponse.json({
            approved: result.approved,
            flags: result.flags,
            requiresManualReview: result.requiresManualReview,
            message: result.approved
                ? 'Content cleared for permanent preservation.'
                : 'Content flagged for review. Our team will review within 24 hours before proceeding with preservation.',
        });

    } catch (error: any) {
        console.error('Moderation review error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
