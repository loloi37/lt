import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/apiAuth';

export async function POST(request: NextRequest) {
    try {
        // AUTH: Require an authenticated user
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const { user } = auth;
        const admin = getSupabaseAdmin();

        const { fullName, birthDate, deathDate, excludeId } = await request.json();

        if (!fullName) {
            return NextResponse.json({ duplicates: [] });
        }

        // 1. Prepare search criteria
        const nameSearch = `%${fullName.trim()}%`;
        const birthYear = birthDate ? new Date(birthDate).getFullYear() : null;
        const deathYear = deathDate ? new Date(deathDate).getFullYear() : null;

        // 2. Query Supabase — only search within memorials the user owns
        let query = admin
            .from('memorials')
            .select('id, full_name, birth_date, death_date')
            .eq('user_id', user.id)
            .ilike('full_name', nameSearch)
            .limit(5);

        // If editing an existing memorial, exclude it from duplicate results
        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data: potentialMatches, error } = await query;

        if (error) throw error;

        // 3. Filter results by date proximity (Tolerance: +/- 1 year)
        const filteredDuplicates = (potentialMatches || []).filter(match => {
            let isMatch = false;

            if (birthYear && match.birth_date) {
                const matchBirthYear = new Date(match.birth_date).getFullYear();
                if (Math.abs(matchBirthYear - birthYear) <= 1) isMatch = true;
            }

            if (deathYear && match.death_date) {
                const matchDeathYear = new Date(match.death_date).getFullYear();
                if (Math.abs(matchDeathYear - deathYear) <= 1) isMatch = true;
            }

            // If no dates provided, we just rely on the name (already filtered by ILIKE)
            if (!birthDate && !deathDate) isMatch = true;

            return isMatch;
        });

        return NextResponse.json({
            duplicates: filteredDuplicates
        });

    } catch (error: any) {
        console.error('Duplicate Check Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
