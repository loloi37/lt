import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ memorialId: string }> }
) {
  try {
    const { memorialId } = await params;
    const { user } = await createAuthenticatedClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [memorialRes, roleRes] = await Promise.all([
      supabaseAdmin.from('memorials').select('*').eq('id', memorialId).single(),
      supabaseAdmin
        .from('user_memorial_roles')
        .select('role')
        .eq('memorial_id', memorialId)
        .eq('user_id', user.id)
        .maybeSingle(),
    ]);

    if (memorialRes.error || !memorialRes.data) {
      return NextResponse.json({ error: 'Archive not found' }, { status: 404 });
    }

    const memorial = memorialRes.data;
    const isOwner = memorial.user_id === user.id;

    if (!isOwner && !roleRes.data) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const [{ data: approvedContributions }, { data: relations }] = await Promise.all([
      supabaseAdmin
        .from('memorial_contributions')
        .select('id, type, content, witness_name, created_at')
        .eq('memorial_id', memorialId)
        .eq('status', 'approved')
        .order('created_at', { ascending: true }),
      memorial.mode === 'family'
        ? supabaseAdmin
            .from('memorial_relations')
            .select('id, from_memorial_id, to_memorial_id, relationship_type, memorials!memorial_relations_to_memorial_id_fkey(id, full_name)')
            .eq('from_memorial_id', memorialId)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const memoryContributions = (approvedContributions || [])
      .filter((contribution) => contribution.type === 'memory')
      .map((contribution: any) => ({
        id: contribution.id,
        title: contribution.content?.title || 'Shared memory',
        date: contribution.created_at,
        content: contribution.content?.content || '',
        author: contribution.witness_name || 'Contributor',
        relationship: contribution.content?.relationship || '',
      }));

    const photoContributions = (approvedContributions || [])
      .filter((contribution) => contribution.type === 'photo' && contribution.content?.url)
      .map((contribution: any) => ({
        id: contribution.id,
        preview: contribution.content.url,
        caption: contribution.content?.caption || '',
        year: contribution.content?.year || '',
        type: 'photo',
      }));

    const videoContributions = (approvedContributions || [])
      .filter((contribution) => contribution.type === 'video' && contribution.content?.url)
      .map((contribution: any) => ({
        id: contribution.id,
        url: contribution.content.url,
        thumbnail: contribution.content?.thumbnail || '',
        title: contribution.content?.title || 'Video memory',
        description: contribution.content?.description || '',
      }));

    const memorialData = {
      step1: memorial.step1 || {},
      step2: memorial.step2 || {},
      step3: memorial.step3 || {},
      step4: memorial.step4 || {},
      step5: memorial.step5 || {},
      step6: memorial.step6 || {},
      step7: {
        ...(memorial.step7 || {}),
        sharedMemories: [...(memorial.step7?.sharedMemories || []), ...memoryContributions],
      },
      step8: {
        ...(memorial.step8 || {}),
        gallery: [...(memorial.step8?.gallery || []), ...photoContributions],
      },
      step9: {
        ...(memorial.step9 || { videos: [] }),
        videos: [...(memorial.step9?.videos || []), ...videoContributions],
      },
    };

    const normalizedRelations = (relations || []).map((relation: any) => ({
      id: relation.id,
      from_memorial_id: relation.from_memorial_id,
      to_memorial_id: relation.to_memorial_id,
      relationship_type: relation.relationship_type,
      target_name: relation.memorials?.full_name || '',
    }));

    return NextResponse.json({
      memorialData,
      relations: normalizedRelations,
    });
  } catch (err: any) {
    console.error('[render-data]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
