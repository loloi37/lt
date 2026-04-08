// lib/crypto/encryptionService.ts
//
// Placeholder encryption and social recovery service. DO NOT use these
// outputs as real ciphertext or real Shamir shares — they are not encrypted.
// In production these throw so we never accidentally hand out fake key
// material that the user thinks is real.
//
// To enable for local development set CRYPTO_ALLOW_MOCK=true.

const ALLOW_MOCK =
  process.env.NODE_ENV !== 'production' &&
  process.env.CRYPTO_ALLOW_MOCK === 'true';

function assertMockAllowed(callerName: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      `[encryptionService] ${callerName} is a placeholder and must not run in production. ` +
        'Wire up real Web Crypto / Shamir Secret Sharing before shipping.'
    );
  }
  if (!ALLOW_MOCK) {
    throw new Error(
      `[encryptionService] ${callerName} is a placeholder. Set CRYPTO_ALLOW_MOCK=true ` +
        'in your local environment to enable the simulated flow.'
    );
  }
}

export interface EncryptedBundle {
  encryptedData: string;  // Base64-encoded placeholder
  salt: string;
  iv: string;
  method: 'AES-256-GCM';
}

export interface RecoveryContact {
  id: string;
  name: string;
  email: string;
  relationship: string;
  shardIndex: number;
  status: 'pending' | 'confirmed' | 'delivered';
}

export interface RecoveryShard {
  index: number;
  shard: string;  // Base64-encoded placeholder
  contactId: string;
}

export interface KeyBackupMethod {
  type: 'family_recovery' | 'paper_backup' | 'lawyer_executor';
  label: string;
  description: string;
}

export const KEY_BACKUP_METHODS: KeyBackupMethod[] = [
  {
    type: 'family_recovery',
    label: 'Family Recovery',
    description: 'Split your key among 5 trusted family members. Any 3 can recover access.',
  },
  {
    type: 'paper_backup',
    label: 'Paper Backup',
    description: 'Print your recovery key and store in a safe deposit box or fireproof safe.',
  },
  {
    type: 'lawyer_executor',
    label: 'Lawyer / Executor',
    description: 'Provide your recovery key to your estate attorney or designated executor.',
  },
];

export async function encryptMemorial(
  _data: unknown,
  _password: string
): Promise<EncryptedBundle> {
  assertMockAllowed('encryptMemorial');
  // Placeholder: simulate encryption
  await new Promise(resolve => setTimeout(resolve, 500));

  const mockSalt = btoa(String(Date.now()));
  const mockIv = btoa(String(Math.random()));

  return {
    encryptedData: btoa(JSON.stringify({ placeholder: true, timestamp: Date.now() })),
    salt: mockSalt,
    iv: mockIv,
    method: 'AES-256-GCM',
  };
}

export async function decryptMemorial(
  _bundle: EncryptedBundle,
  _password: string
): Promise<unknown> {
  assertMockAllowed('decryptMemorial');
  // Placeholder: simulate decryption
  await new Promise(resolve => setTimeout(resolve, 300));
  return { decrypted: true };
}

export function generateRecoveryShards(
  _key: string,
  threshold: number = 3,
  total: number = 5
): RecoveryShard[] {
  assertMockAllowed('generateRecoveryShards');
  // Placeholder: generate mock Shamir's Secret Sharing shards
  return Array.from({ length: total }, (_, i) => ({
    index: i + 1,
    shard: btoa(`shard-${i + 1}-of-${total}-threshold-${threshold}-${Date.now()}`),
    contactId: '',
  }));
}

export function reconstructKey(shards: RecoveryShard[]): string | null {
  assertMockAllowed('reconstructKey');
  // Placeholder: simulate key reconstruction
  if (shards.length < 3) return null;
  return btoa(`reconstructed-key-${Date.now()}`);
}

export function validateShardCount(threshold: number, total: number): boolean {
  return threshold >= 2 && threshold <= total && total >= 3 && total <= 7;
}
