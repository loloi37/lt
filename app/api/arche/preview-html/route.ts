// app/api/arche/preview-html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateStandaloneHTML } from '@/lib/arche/htmlGenerator';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { hasPermission, resolveArchivePermissionContext } from '@/lib/archivePermissions';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const memorialId = searchParams.get('id');

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const permission = await resolveArchivePermissionContext(
            supabaseAdmin,
            memorialId,
            user.id
        );

        if (!permission.memorialExists || !permission.context) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (
            !hasPermission(permission.context, 'edit_archive') &&
            !hasPermission(permission.context, 'view_archive')
        ) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch Full Data
        const { data: memorial, error } = await supabaseAdmin
            .from('memorials') // or 'concierge_projects' depending on where you test, but usually memorials
            .select('*')
            .eq('id', memorialId)
            .single();

        // Note: If testing with a Concierge Project that hasn't been converted to a Memorial yet, 
        // you might need to fetch from 'concierge_projects' and map the data manually.
        // For now, we assume we are testing with a real memorial ID.

        if (error || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // Combine into full MemorialData object structure
        const fullData = {
            step1: memorial.step1,
            step2: memorial.step2,
            step3: memorial.step3,
            step4: memorial.step4,
            step5: memorial.step5,
            step6: memorial.step6,
            step7: memorial.step7,
            step8: memorial.step8,
            step9: memorial.step9,
            currentStep: 10,
            paid: memorial.paid,
            lastSaved: memorial.updated_at,
            completedSteps: memorial.completed_steps
        };

        // Generate HTML
        const html = generateStandaloneHTML(fullData as any);

        // Return as text/html for preview
        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (error: any) {
        console.error('Export error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
