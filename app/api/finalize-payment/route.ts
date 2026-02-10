import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createFullSnapshot } from '@/lib/versionService';

export async function POST(request: NextRequest) {
    try {
        const { memorialId } = await request.json();

        // NEW CHECK
        if (!memorialId || memorialId === 'null' || memorialId === 'undefined') {
            console.error('[Finalize Payment] Invalid memorial ID:', memorialId);
            return NextResponse.json({
                error: 'Invalid memorial ID. Please create an archive first.'
            }, { status: 400 });
        }

        console.log('[Finalize Payment] Starting for memorial:', memorialId);

        // Initialize Supabase admin client with service role key
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service key, pas anon key
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // 1. Mettre à jour le statut de paiement
        // ✅ APRÈS (met les 2 colonnes)
        const { error: updateError } = await supabaseAdmin
            .from('memorials')
            .update({
                paid: true,        // ⬅️ AJOUTE CETTE LIGNE
                payment_confirmed_at: new Date().toISOString()
            })
            .eq('id', memorialId);

        if (updateError) {
            console.error('Update error:', updateError);
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // 2. Récupérer les données du memorial pour le snapshot
        const { data: memorialData, error: fetchError } = await supabase
            .from('memorials')
            .select('*')
            .eq('id', memorialId)
            .single();

        if (fetchError || !memorialData) {
            console.error('Fetch error:', fetchError);
            return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
        }

        // 3. Créer le snapshot CÔTÉ SERVEUR (avec service account Supabase)
        // ⚠️ IMPORTANT : Utilise un client Supabase avec service_role key ici
        // (supabaseAdmin déjà initialisé en haut de la fonction)

        // Construire l'objet de snapshot
        const snapshotData = {
            memorial_id: memorialId,
            version_number: 1, // Ou calculer le prochain numéro
            snapshot_data: memorialData,
            is_full_snapshot: true,
            steps_modified: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // Toutes les étapes
            change_type: 'manual',
            change_summary: 'Archive activated — payment confirmed',
            change_reason: null,
            created_by: memorialData.user_id || null,
            created_by_name: 'Owner',
            created_at: new Date().toISOString()
        };

        const { error: snapshotError } = await supabaseAdmin
            .from('memorial_versions')
            .insert(snapshotData);

        if (snapshotError) {
            console.error('Snapshot creation failed:', snapshotError);
            // Ne pas bloquer le paiement si le snapshot échoue
            // Juste logger l'erreur
        }

        return NextResponse.json({
            success: true,
            message: 'Payment finalized and snapshot created'
        });

    } catch (error: any) {
        console.error('Finalize payment error:', error);
        return NextResponse.json({
            error: error.message || 'Internal server error'
        }, { status: 500 });
    }
}