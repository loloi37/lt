'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/providers/AuthProvider';
import PreservationPanel, { PreservationMemorial } from '@/components/dashboard/PreservationPanel';

function estimateMediaSize(items: any[]): number {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    if (typeof item?.size === 'number') return sum + item.size;
    if (typeof item?.fileSize === 'number') return sum + item.fileSize;
    // Rough fallback: assume 2 MB per photo, 30 MB per video
    return sum + (item?.type?.startsWith('video') ? 30 * 1024 * 1024 : 2 * 1024 * 1024);
  }, 0);
}

export default function PreservationHubPage() {
  const auth = useAuth();
  const [memorials, setMemorials] = useState<PreservationMemorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user) return;
    (async () => {
      const { data, error } = await supabase
        .from('memorials')
        .select('id, full_name, profile_photo_url, preservation_state, content_size_bytes, step7, step8, step9')
        .eq('user_id', auth.user!.id)
        .neq('deleted', true)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const mapped: PreservationMemorial[] = (data || []).map((m: any) => {
        const step7 = m.step7 || {};
        const step8 = m.step8 || {};
        const step9 = m.step9 || {};
        const counts = {
          photos: (step8.gallery?.length || 0),
          videos: step9.videos?.length || 0,
          interactiveStories: step8.interactiveGallery?.length || 0,
          childhoodPhotos: step8.childhoodPhotos?.length || 0,
          voiceRecordings: (step7.voiceRecordings?.length || 0),
        };
        const computed =
          m.content_size_bytes ||
          estimateMediaSize(step8.gallery) +
            estimateMediaSize(step8.interactiveGallery) +
            estimateMediaSize(step8.childhoodPhotos) +
            estimateMediaSize(step9.videos) +
            estimateMediaSize(step7.voiceRecordings);
        return {
          id: m.id,
          fullName: m.full_name,
          profilePhotoUrl: m.profile_photo_url,
          preservationState: m.preservation_state,
          contentSizeBytes: computed,
          counts,
        };
      });
      setMemorials(mapped);
      setLoading(false);
    })();
  }, [auth.user]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-warm-dark">Personal preservation</h1>
      <p className="text-warm-muted mt-1 max-w-2xl">
        Encrypt and seal your memorials onto the Polygon blockchain. Each archive
        can hold up to 50 GB of encrypted media and stories.
      </p>

      <div className="mt-8">
        {loading ? (
          <p className="text-warm-muted">Loading…</p>
        ) : memorials.length === 0 ? (
          <p className="text-warm-muted italic">No memorials yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {memorials.map(m => (
              <PreservationPanel key={m.id} memorial={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
