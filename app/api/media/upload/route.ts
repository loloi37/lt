import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/apiAuth';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        // AUTH: Derive identity from session
        const auth = await requireUser();
        if (!auth.ok) return auth.response;

        const { user } = auth;
        const admin = getSupabaseAdmin();

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const bucket = formData.get('bucket') as string;
        const path = formData.get('path') as string;

        if (!file || !bucket || !path) {
            return NextResponse.json(
                { error: 'Missing file, bucket, or path' },
                { status: 400 }
            );
        }

        // Validate bucket is an allowed upload target
        const ALLOWED_BUCKETS = ['memorial-media', 'profile-photos', 'gallery'];
        if (!ALLOWED_BUCKETS.includes(bucket)) {
            return NextResponse.json(
                { error: 'Invalid upload bucket' },
                { status: 400 }
            );
        }

        // Validate path belongs to a memorial the user owns or can contribute to.
        // Paths are expected to follow: {memorialId}/... pattern
        const memorialIdFromPath = path.split('/')[0];
        if (memorialIdFromPath) {
            const { data: memorial } = await admin
                .from('memorials')
                .select('id, user_id, mode')
                .eq('id', memorialIdFromPath)
                .maybeSingle();

            if (memorial) {
                const isOwner = memorial.user_id === user.id;
                if (!isOwner) {
                    // Check if user has a role that permits content contribution
                    const { data: roleRow } = await admin
                        .from('user_memorial_roles')
                        .select('role')
                        .eq('memorial_id', memorial.id)
                        .eq('user_id', user.id)
                        .maybeSingle();

                    const allowedRoles = ['co_guardian', 'witness'];
                    if (!roleRow || !allowedRoles.includes(roleRow.role)) {
                        return NextResponse.json(
                            { error: 'You do not have permission to upload to this memorial' },
                            { status: 403 }
                        );
                    }
                }
            }
        }

        // 1. Convert file to buffer for hashing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Calculate SHA-256 Hash
        const hashSum = crypto.createHash('sha256');
        hashSum.update(buffer);
        const sha256Hash = hashSum.digest('hex');

        // 3. Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await admin.storage
            .from(bucket)
            .upload(path, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('Supabase Upload Error:', uploadError);
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 }
            );
        }

        // 4. Get Public URL
        const { data: publicUrlData } = admin.storage
            .from(bucket)
            .getPublicUrl(path);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            hash: sha256Hash,
            path: path
        });

    } catch (error: any) {
        console.error('Secure Upload Error:', error);
        return NextResponse.json(
            { error: 'Internal server error during upload' },
            { status: 500 }
        );
    }
}
