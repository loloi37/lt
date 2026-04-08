import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabaseAdmin
            .from('recovery_contacts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({ contacts: data || [] });
    } catch (error: any) {
        console.error('[recovery-contacts-get]', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { contacts } = await req.json();
        const { user } = await createAuthenticatedClient();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!contacts) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error: deleteError } = await supabaseAdmin
            .from('recovery_contacts')
            .delete()
            .eq('user_id', user.id);

        if (deleteError) {
            throw deleteError;
        }

        if (contacts.length > 0) {
            const { error: insertError } = await supabaseAdmin
                .from('recovery_contacts')
                .insert(contacts.map((c: any) => ({
                    user_id: user.id,
                    name: c.name,
                    email: c.email,
                    relationship: c.relationship,
                    status: 'pending',
                })));

            if (insertError) {
                throw insertError;
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Recovery contacts error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
