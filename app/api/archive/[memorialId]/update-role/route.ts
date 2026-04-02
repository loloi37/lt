import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createAuthenticatedClient } from '@/utils/supabase/api';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const VALID_ROLES = ['co_guardian', 'witness', 'reader'] as const;
type AssignableRole = (typeof VALID_ROLES)[number];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ memorialId: string }> }
) {
  try {
    const { memorialId } = await params;
    const { targetUserId, newRole } = (await req.json()) as {
      targetUserId: string;
      newRole: string;
    };
    const { user } = await createAuthenticatedClient();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate role
    if (!VALID_ROLES.includes(newRole as AssignableRole)) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${VALID_ROLES.join(', ')}` },
        { status: 400 }
      );
    }

    // Verify requester is the memorial owner
    const { data: memorial } = await supabaseAdmin
      .from('memorials')
      .select('user_id, mode')
      .eq('id', memorialId)
      .single();

    if (!memorial || memorial.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Cannot change the owner's own role
    if (targetUserId === user.id) {
      return NextResponse.json(
        { error: 'Cannot change the owner\'s role' },
        { status: 400 }
      );
    }

    // co_guardian role requires family plan
    if (newRole === 'co_guardian' && memorial.mode !== 'family') {
      return NextResponse.json(
        { error: 'Co-Guardian role is only available for Family plan archives' },
        { status: 403 }
      );
    }

    // Update the role
    const { error } = await supabaseAdmin
      .from('user_memorial_roles')
      .update({ role: newRole })
      .eq('memorial_id', memorialId)
      .eq('user_id', targetUserId);

    if (error) throw error;

    return NextResponse.json({ success: true, newRole });
  } catch (err: any) {
    console.error('Update role error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
