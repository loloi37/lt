// Polygon preservation service — STUB.
// Real implementation will use viem/wagmi against a deployed Polygon contract.
// For now this records intent in the `blockchain_preservations` table so the
// rest of the UI flow can be built and tested end-to-end.

import { supabase } from '@/lib/supabase';

export interface PreservationRequest {
  memorialId: string;
  userId: string;
  totalBytes: number;
  manifestCid?: string;
}

export interface PreservationResult {
  id: string;
  txHash: string | null;
  status: 'pending' | 'submitted' | 'confirmed' | 'failed';
}

export async function preserveOnPolygon(req: PreservationRequest): Promise<PreservationResult> {
  // Real flow:
  //   1. Encrypt assets client-side via lib/crypto/encryptionService
  //   2. Upload encrypted blobs to memorial-blockchain bucket
  //   3. Build manifest, hash it, submit tx to Polygon contract
  //   4. Persist tx_hash + manifest_cid
  //
  // Current behaviour: insert a 'pending' row only.
  const { data, error } = await supabase
    .from('blockchain_preservations')
    .insert({
      memorial_id: req.memorialId,
      user_id: req.userId,
      total_bytes: req.totalBytes,
      manifest_cid: req.manifestCid || null,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw error;
  return { id: data.id, txHash: null, status: 'pending' };
}
