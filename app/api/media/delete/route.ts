// app/api/media/delete/route.ts
// Server-side storage object deletion with proper auth.
// Replaces direct client-side supabase.storage.remove() calls.
import { NextRequest, NextResponse } from 'next/server';
import { requireMemorialAccess } from '@/lib/apiAuth';

const ALLOWED_BUCKETS = ['memorial-media', 'profile-photos', 'gallery', 'videos'];

export async function POST(request: NextRequest) {
    try {
        const { bucket, paths, memorialId } = await request.json();

        if (!bucket || !Array.isArray(paths) || paths.length === 0 || !memorialId) {
            return NextResponse.json(
                { error: 'Missing bucket, paths, or memorialId' },
                { status: 400 }
            );
        }

        if (!ALLOWED_BUCKETS.includes(bucket)) {
            return NextResponse.json(
                { error: 'Invalid bucket' },
                { status: 400 }
            );
        }

        // Verify every path starts with the claimed memorialId to prevent
        // deletion of objects belonging to other memorials.
        const allPathsValid = paths.every(
            (p: string) => typeof p === 'string' && p.startsWith(`${memorialId}/`)
        );
        if (!allPathsValid) {
            return NextResponse.json(
                { error: 'All paths must belong to the specified memorial' },
                { status: 400 }
            );
        }

        // Auth: user must have edit_archive permission on this memorial
        const access = await requireMemorialAccess({
            memorialId,
            action: 'edit_archive',
        });
        if (!access.ok) return access.response;

        const { admin } = access;

        const { error } = await admin.storage.from(bucket).remove(paths);

        if (error) {
            console.error('[Media Delete] Storage error:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, deleted: paths.length });
    } catch (error: any) {
        console.error('[Media Delete] Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
