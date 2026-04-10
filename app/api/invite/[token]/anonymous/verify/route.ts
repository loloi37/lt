import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const supabaseAdmin = getSupabaseAdmin();
        await params;
        const { email, code, name } =
            await req.json();

        // Find the pending anonymous contribution
        const { data: contribution, error } =
            await supabaseAdmin
                .from('memorial_contributions')
                .select('*')
                .eq('contributor_email', email)
                .eq('verification_code', code)
                .eq('contributor_verified', false)
                .eq('is_anonymous', true)
                .gt(
                    'verification_expires_at',
                    new Date().toISOString()
                )
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

        if (error || !contribution) {
            return NextResponse.json(
                {
                    error:
                        'Invalid or expired code. Please try again.'
                },
                { status: 400 }
            );
        }

        // Mark as verified
        await supabaseAdmin
            .from('memorial_contributions')
            .update({
                contributor_verified: true,
                verification_code: null,
                witness_name: name
            })
            .eq('id', contribution.id);

        return NextResponse.json({
            success: true,
            contributionId: contribution.id,
            memorialId: contribution.memorial_id
        });

    } catch (err: any) {
        console.error('[AnonVerify]', err);
        return NextResponse.json(
            { error: 'Verification failed' },
            { status: 500 }
        );
    }
}
