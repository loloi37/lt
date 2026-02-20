// app/api/admin/reports/abandoned/route.ts

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Admin Client
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
    try {
        const now = new Date();
        const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90)).toISOString();

        // Fetch archives that are:
        // 1. Paid (we care about these most)
        // 2. Draft status (not finished)
        // 3. Not updated in 90 days
        // 4. Not deleted
        const { data: memorials, error } = await supabaseAdmin
            .from('memorials')
            .select(`
        id, 
        full_name, 
        updated_at, 
        created_at, 
        completed_steps, 
        user_id,
        users ( email, full_name )
      `)
            .eq('status', 'draft')
            .eq('paid', true)
            .eq('deleted', false) // Exclude soft-deleted items
            .lt('updated_at', ninetyDaysAgo)
            .order('updated_at', { ascending: true }); // Oldest inactivity first

        if (error) throw error;

        // Calculate metrics for the report
        const report = memorials.map((m: any) => {
            const lastUpdate = new Date(m.updated_at);
            const today = new Date();
            const daysInactive = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 3600 * 24));

            // Rough completion estimate based on steps array length (9 steps total)
            const progress = Math.round(((m.completed_steps?.length || 0) / 9) * 100);

            // Determine risk level
            let riskLevel = 'medium';
            if (daysInactive > 365) riskLevel = 'critical';
            else if (daysInactive > 180) riskLevel = 'high';

            return {
                id: m.id,
                memorialName: m.full_name,
                ownerName: m.users?.full_name || 'Unknown',
                ownerEmail: m.users?.email,
                daysInactive,
                progress,
                riskLevel,
                lastActive: m.updated_at
            };
        });

        return NextResponse.json({
            success: true,
            count: report.length,
            report
        });

    } catch (error: any) {
        console.error('Abandonment Report Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}