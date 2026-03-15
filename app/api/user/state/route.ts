// app/api/user/state/route.ts
// Single source of truth: returns the authenticated user's full state
// Uses the new single `state` field model (creating/private/live/preserved)
import { NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[UserState] Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL env vars');
            return NextResponse.json({
                authenticated: false,
                user: null,
                plan: null,
                archives: [],
                error: 'Server configuration error',
            }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const { user, error } = await createAuthenticatedClient();

        if (error || !user) {
            return NextResponse.json({
                authenticated: false,
                user: null,
                plan: null,
                archives: [],
            });
        }

        // Fetch ALL user's memorials using new state model
        const { data: memorials, error: memError } = await supabaseAdmin
            .from('memorials')
            .select('id, state, full_name, profile_photo_url, deleted, deleted_at, updated_at, created_at, payment_confirmed_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (memError) {
            console.error('[UserState] Memorial fetch error:', memError);
        }

        const allMemorials = memorials || [];
        const activeMemorials = allMemorials.filter(m => !m.deleted);

        // Determine plan from state: live or preserved = paid
        const hasPaidMemorials = allMemorials.some(m => m.state === 'live' || m.state === 'preserved');

        // Simplified plan: none, creating, or active
        let currentPlan: 'none' | 'creating' | 'active' = 'none';
        if (hasPaidMemorials) {
            currentPlan = 'active';
        } else if (activeMemorials.length > 0) {
            currentPlan = 'creating';
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
            },
            plan: currentPlan,
            hasPaid: hasPaidMemorials,
            archives: activeMemorials.map(m => ({
                id: m.id,
                state: m.state,
                fullName: m.full_name,
                profilePhotoUrl: m.profile_photo_url,
                updatedAt: m.updated_at,
                paymentConfirmedAt: m.payment_confirmed_at,
            })),
            deletedArchives: allMemorials.filter(m => m.deleted).map(m => ({
                id: m.id,
                fullName: m.full_name,
                deletedAt: m.deleted_at,
            })),
        }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
            },
        });
    } catch (err: any) {
        console.error('[UserState] Error:', err);
        return NextResponse.json({
            authenticated: false,
            user: null,
            plan: null,
            archives: [],
            error: 'Internal error',
        }, { status: 500 });
    }
}
