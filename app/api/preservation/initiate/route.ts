import { NextResponse } from 'next/server';
import { createAuthenticatedClient } from '@/utils/supabase/api';
import { createClient } from '@supabase/supabase-js';

const MAX_BYTES = 50 * 1024 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const { user, error: authError } = await createAuthenticatedClient();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { memorialId } = await request.json();
    if (!memorialId) {
      return NextResponse.json({ error: 'memorialId required' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }
    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: memorial, error: memErr } = await admin
      .from('memorials')
      .select('id, user_id, content_size_bytes, preservation_state')
      .eq('id', memorialId)
      .maybeSingle();

    if (memErr || !memorial) {
      return NextResponse.json({ error: 'Memorial not found' }, { status: 404 });
    }
    if (memorial.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if ((memorial.content_size_bytes || 0) > MAX_BYTES) {
      return NextResponse.json({ error: 'Memorial exceeds 50 GB limit' }, { status: 400 });
    }
    if (memorial.preservation_state === 'preserved' || memorial.preservation_state === 'preserving') {
      return NextResponse.json({ error: 'Already in progress or preserved' }, { status: 409 });
    }

    const { error: updateErr } = await admin
      .from('memorials')
      .update({ preservation_state: 'preserving' })
      .eq('id', memorialId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // TODO: enqueue real encryption + Polygon write job here.
    console.log(`[preservation] Initiated for memorial ${memorialId} by user ${user.id}`);

    return NextResponse.json({ ok: true, state: 'preserving' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 });
  }
}
