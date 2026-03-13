import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { generateCertificate, formatCertificateDate } from '@/lib/certificate/generator';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Memorial ID is required' }, { status: 400 });
        }

        // Fetch memorial with Arweave info
        const { data: memorial, error: fetchError } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        if (!memorial.arweave_tx_id) {
            return NextResponse.json({ error: 'Memorial has not been preserved to Arweave yet' }, { status: 400 });
        }

        // Generate the PDF certificate
        const pdfBytes = await generateCertificate({
            deceasedName: memorial.full_name || 'Unknown',
            preservedDate: formatCertificateDate(memorial.payment_confirmed_at || new Date().toISOString()),
            arweaveTxId: memorial.arweave_tx_id,
            ownerName: user.email || '',
            memorialId: memorial.id,
        });

        // Store in Supabase private bucket
        const fileName = `certificates/${memorialId}/certificate-of-permanence.pdf`;
        const { error: uploadError } = await supabaseAdmin.storage
            .from('exports')
            .upload(fileName, pdfBytes, {
                contentType: 'application/pdf',
                upsert: true,
            });

        if (uploadError) {
            console.error('Certificate upload error:', uploadError);
            return NextResponse.json({ error: 'Failed to store certificate' }, { status: 500 });
        }

        // Generate a signed URL (valid for 1 hour)
        const { data: signedUrl } = await supabaseAdmin.storage
            .from('exports')
            .createSignedUrl(fileName, 3600);

        // Update memorial with certificate URL
        await supabaseAdmin
            .from('memorials')
            .update({ certificate_url: signedUrl?.signedUrl || null })
            .eq('id', memorialId);

        return NextResponse.json({
            success: true,
            certificateUrl: signedUrl?.signedUrl,
        });

    } catch (error: any) {
        console.error('Certificate generation error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
