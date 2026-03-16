import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('recovery_contacts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ contacts: data || [] });
    } catch {
        return NextResponse.json({ contacts: [] });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, contacts } = await req.json();

        if (!userId || !contacts) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Delete existing contacts and re-insert (simple replace)
        try {
            await supabaseAdmin
                .from('recovery_contacts')
                .delete()
                .eq('user_id', userId);

            if (contacts.length > 0) {
                await supabaseAdmin
                    .from('recovery_contacts')
                    .insert(contacts.map((c: any) => ({
                        user_id: userId,
                        name: c.name,
                        email: c.email,
                        relationship: c.relationship,
                        status: 'pending',
                    })));
            }
        } catch {
            // Table may not exist yet
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Recovery contacts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
