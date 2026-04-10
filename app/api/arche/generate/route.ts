// app/api/arche/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateStandaloneHTML } from '@/lib/arche/htmlGenerator';
import { ArcheArchiver } from '@/lib/arche/archiver';
import { processMemorialMedia } from '@/lib/arche/mediaProcessor';
import { generateManifest, generateReadme } from '@/lib/arche/metadataGenerator';
import { requireMemorialAccess } from '@/lib/apiAuth';
import { safeLogMemorialActivity } from '@/lib/activityLog';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

const EXPORTS_BUCKET = 'exports';

export async function POST(request: NextRequest) {
    try {
        const { memorialId } = await request.json();

        if (!memorialId) {
            return NextResponse.json({ error: 'Missing memorialId' }, { status: 400 });
        }

        // AUTH: Use centralized permission layer — require export_archive permission
        const access = await requireMemorialAccess({
            memorialId,
            action: 'export_archive',
        });
        if (!access.ok) return access.response;

        const { user, admin: supabaseAdmin } = access;

        console.log(`[Arche] Starting export for ${memorialId}...`);

        // Fetch Full Data
        const { data: memorial, error } = await supabaseAdmin
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .single();

        if (error || !memorial) {
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // 4. RATE LIMIT: 10-minute cooldown between successful exports
        if (memorial.last_exported_at) {
            const diffMinutes = (Date.now() - new Date(memorial.last_exported_at).getTime()) / 60000;
            let canEnforceCooldown = true;

            const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
            if (bucketsError) {
                console.warn('[Arche] Could not inspect storage buckets before cooldown check:', bucketsError.message);
            } else {
                const hasExportsBucket = buckets?.some((bucket) => bucket.name === EXPORTS_BUCKET);
                if (!hasExportsBucket) {
                    canEnforceCooldown = false;
                } else {
                    const { data: exportFiles, error: listError } = await supabaseAdmin.storage
                        .from(EXPORTS_BUCKET)
                        .list(memorialId, { limit: 1 });

                    if (listError) {
                        console.warn('[Arche] Could not inspect prior exports before cooldown check:', listError.message);
                    } else if (!exportFiles || exportFiles.length === 0) {
                        canEnforceCooldown = false;
                    }
                }
            }

            if (canEnforceCooldown && diffMinutes < 10) {
                const waitTime = Math.ceil(10 - diffMinutes);
                return NextResponse.json({
                    error: `Please wait ${waitTime} minute(s) before generating another ZIP archive.`
                }, { status: 429 });
            }
        }

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

        const { data: currentBuckets, error: currentBucketsError } = await supabaseAdmin.storage.listBuckets();
        if (currentBucketsError) {
            throw new Error(`Failed to inspect storage buckets: ${currentBucketsError.message}`);
        }

        const hasExportsBucket = currentBuckets?.some((bucket) => bucket.name === EXPORTS_BUCKET);
        if (!hasExportsBucket) {
            const { error: createBucketError } = await supabaseAdmin.storage.createBucket(EXPORTS_BUCKET, {
                public: false,
            });

            if (createBucketError) {
                throw new Error(`Failed to create export bucket "${EXPORTS_BUCKET}": ${createBucketError.message}`);
            }
        }

        const { error: uploadError } = await supabaseAdmin.storage
            .from(EXPORTS_BUCKET)
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
            .from(EXPORTS_BUCKET)
            .createSignedUrl(filePath, 3600);

        if (urlError || !urlData) {
            throw new Error('Failed to generate download URL');
        }

        await supabaseAdmin
            .from('memorials')
            .update({ last_exported_at: new Date().toISOString() })
            .eq('id', memorialId);

        await safeLogMemorialActivity(supabaseAdmin, {
            memorialId,
            action: 'memorial_exported',
            summary: 'Archive ZIP exported.',
            actorUserId: user.id,
            actorEmail: user.email ?? null,
        });

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
