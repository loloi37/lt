// app/api/user/state/route.ts
// Single source of truth: returns the authenticated user's full state
// This endpoint is the authoritative server-side state that the UI must reflect.
import { NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        // Create admin client inside handler to avoid module-level crash
        // when SUPABASE_SERVICE_ROLE_KEY is not set
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

        // Fetch ALL user's memorials in one query
        const { data: memorials, error: memError } = await supabaseAdmin
            .from('memorials')
            .select('id, mode, paid, payment_confirmed_at, status, full_name, profile_photo_url, deleted, deleted_at, updated_at, created_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });

        if (memError) {
            console.error('[UserState] Memorial fetch error:', memError);
        }

        const allMemorials = memorials || [];
        const activeMemorials = allMemorials.filter(m => !m.deleted);

        // For plan determination, consider ALL paid memorials (including soft-deleted).
        // A payment is permanent — soft-deleting an archive does NOT revoke the plan.
        const allPaidMemorials = allMemorials.filter(m => m.paid);
        // For display/archive listing, only show active paid memorials
        const activePaidMemorials = activeMemorials.filter(m => m.paid);

        // Determine the user's current plan from ALL paid memorials (active + deleted)
        // Priority: concierge > family > personal > draft (free)
        let currentPlan: 'none' | 'draft' | 'personal' | 'family' | 'concierge' = 'none';
        if (allPaidMemorials.some(m => m.mode === 'concierge')) {
            currentPlan = 'concierge';
        } else if (allPaidMemorials.some(m => m.mode === 'family')) {
            currentPlan = 'family';
        } else if (allPaidMemorials.some(m => m.mode === 'personal')) {
            currentPlan = 'personal';
        } else if (activeMemorials.length > 0) {
            currentPlan = 'draft';
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                id: user.id,
                email: user.email,
            },
            plan: currentPlan,
            hasPaid: allPaidMemorials.length > 0,
            archives: activeMemorials.map(m => ({
                id: m.id,
                mode: m.mode,
                paid: m.paid,
                status: m.status,
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
                // Prevent caching of user state
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
