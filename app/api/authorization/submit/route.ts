// app/api/authorization/submit/route.ts
// Simplified: checkbox-based legal acknowledgment + email verification
// Removed: video signature recording, canvas signature pad, SHA-256 video hashing
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            memorialId,
            userId,
            identity,
            agreements,
            signature, // Now just { content: "typed full name" }
            fingerprint,
            authorizationType,
        } = body;

        if (!memorialId || !signature.content || !identity.fullName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Fetch memorial info for deceased name
        const { data: memorial } = await supabaseAdmin
            .from('memorials')
            .select('stories')
            .eq('id', memorialId)
            .single();

        const deceasedName = memorial?.stories?.fullName || 'Family Account';
        const deceasedDob = memorial?.stories?.birthDate || '1900-01-01';

        // 2. Capture Technical Metadata
        const headerList = await headers();
        const ip = headerList.get('x-forwarded-for') || 'unknown';
        const userAgent = headerList.get('user-agent') || 'unknown';
        const country = headerList.get('x-vercel-ip-country') || 'Unknown';
        const city = headerList.get('x-vercel-ip-city') || '';
        const geolocation = city ? `${city}, ${country}` : country;

        // 3. Insert authorization record (no video, no drawn signature)
        const { data: authRecord, error: insertError } = await supabaseAdmin
            .from('memorial_authorizations')
            .insert([{
                memorial_id: memorialId,
                user_id: userId,
                authorization_type: authorizationType || 'individual',
                creator_full_name: identity.fullName,
                creator_email: identity.email,
                relationship_to_deceased: identity.relationship || 'Account Holder',
                deceased_full_name: deceasedName,
                deceased_dob: deceasedDob,
                agree_legal_authority: agreements.legal_authority,
                agree_good_faith: agreements.good_faith,
                agree_permanence: agreements.permanence,
                agree_indemnification: agreements.indemnification,
                electronic_signature: signature.content, // Typed name only
                signature_date: new Date().toISOString(),
                signature_ip_address: ip,
                signature_user_agent: userAgent,
                device_fingerprint: fingerprint,
                geolocation: geolocation,
                status: 'approved'
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return NextResponse.json({
            success: true,
            id: authRecord.id,
        });

    } catch (error: any) {
        console.error('Authorization Submission Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
