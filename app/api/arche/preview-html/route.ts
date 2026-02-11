// app/api/arche/preview-html/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateStandaloneHTML } from '@/lib/arche/htmlGenerator';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const memorialId = searchParams.get('id');

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
        }

        // Fetch Full Data
        const { data: memorial, error } = await supabase
            .from('memorials') // or 'concierge_projects' depending on where you test, but usually memorials
            .select('*')
            .eq('id', memorialId)
            .single();

        // Note: If testing with a Concierge Project that hasn't been converted to a Memorial yet, 
        // you might need to fetch from 'concierge_projects' and map the data manually.
        // For now, we assume we are testing with a real memorial ID.

        if (error || !memorial) {
            // Fallback: Try finding it in concierge_projects if not found in memorials
            const { data: concierge } = await supabase
                .from('concierge_projects')
                .select('*')
                .eq('id', memorialId)
                .single();
            
            if (!concierge) {
                return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
            }
            // Use concierge memorial_data if available
            if (concierge.memorial_data) {
                const html = generateStandaloneHTML(concierge.memorial_data as any);
                return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } });
            }
            return NextResponse.json({ error: 'No memorial data in project' }, { status: 404 });
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