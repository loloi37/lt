import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase Admin Client (Server-side only)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
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

        // 1. Convert file to buffer for hashing
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Calculate SHA-256 Hash (Server-Side Calculation)
        const hashSum = crypto.createHash('sha256');
        hashSum.update(buffer);
        const sha256Hash = hashSum.digest('hex');

        // 3. Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from(bucket)
            .upload(path, file, {
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
        const { data: publicUrlData } = supabaseAdmin.storage
            .from(bucket)
            .getPublicUrl(path);

        return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            hash: sha256Hash, // Return the calculated hash to the frontend
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