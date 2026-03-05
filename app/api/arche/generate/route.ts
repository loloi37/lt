// app/api/arche/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { generateStandaloneHTML } from '@/lib/arche/htmlGenerator';
import { ArcheArchiver } from '@/lib/arche/archiver';
import { processMemorialMedia } from '@/lib/arche/mediaProcessor';
import { generateManifest, generateReadme } from '@/lib/arche/metadataGenerator';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // 1. AUTHENTICATE USER
        const { user } = await createAuthenticatedClient();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log(`[Arche] Starting export for ${memorialId}...`);

        // Initialize Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // 2. Fetch Full Data
        const { data: memorial, error } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .single();

        if (error || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // 3. VERIFY OWNERSHIP
        if (memorial.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not own this archive' }, { status: 403 });
        }

        // 4. RATE LIMIT: 10-minute cooldown between exports
        if (memorial.last_exported_at) {
            const diffMinutes = (Date.now() - new Date(memorial.last_exported_at).getTime()) / 60000;
            if (diffMinutes < 10) {
                const waitTime = Math.ceil(10 - diffMinutes);
                return NextResponse.json({
                    error: `Please wait ${waitTime} minute(s) before generating another ZIP archive.`
                }, { status: 429 });
            }
        }

        // 5. Record the export time (starts the cooldown)
        await supabaseAdmin
            .from('memorials')
            .update({ last_exported_at: new Date().toISOString() })
            .eq('id', memorialId);

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
            currentStep: memorial.current_step || 10,
            paid: memorial.paid,
            lastSaved: memorial.updated_at,
            completedSteps: memorial.completed_steps || []
        };

        // 6. Initialize Archiver
        const archiver = new ArcheArchiver(fullData as any);

        // 7. Process Media
        await processMemorialMedia(archiver, fullData as any);

        // --- Add Verification Report to ZIP ---
        const integrityReport = archiver.getVerificationReport();
        archiver.addTextFile('INTEGRITY_REPORT.txt', integrityReport);
        // -------------------------------------------

        // 8. Generate Metadata
        const manifest = generateManifest(fullData as any, memorialId);
        const readme = generateReadme(fullData as any);

        archiver.addTextFile('manifest.json', manifest);
        archiver.addTextFile('README.txt', readme);

        // 9. Generate HTML
        const resourceMap = archiver.getResourceMap();
        const html = generateStandaloneHTML(fullData as any, resourceMap);
        archiver.addTextFile('index.html', html);

        // 10. Generate ZIP Buffer
        console.log('[Arche] Finalizing ZIP file...');
        const zipBuffer = await archiver.generateZip();

        // 11. Upload to Supabase
        const filename = `archive_${fullData.step1.fullName.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.zip`;
        const filePath = `${memorialId}/${filename}`;

        const { error: uploadError } = await supabaseAdmin.storage
            .from('exports')
            .upload(filePath, zipBuffer, {
                contentType: 'application/zip',
                upsert: true
            });

        if (uploadError) {
            console.error('Storage Upload Error:', uploadError);
            throw new Error('Failed to upload ZIP to storage: ' + uploadError.message);
        }

        // Generate Signed URL
        const { data: urlData, error: urlError } = await supabaseAdmin.storage
            .from('exports')
            .createSignedUrl(filePath, 3600);

        if (urlError || !urlData) {
            throw new Error('Failed to generate download URL');
        }

        console.log('[Arche] Export complete:', urlData.signedUrl);

        return NextResponse.json({
            success: true,
            downloadUrl: urlData.signedUrl,
            filename: filename
        });

    } catch (error: any) {
        console.error('[Arche] Export Failed:', error);
        return NextResponse.json({ error: error.message || 'Export failed' }, { status: 500 });
    }
}
