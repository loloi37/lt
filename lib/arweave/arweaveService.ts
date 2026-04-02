// lib/arweave/arweaveService.ts
// Placeholder Arweave integration service
// Replace with real @irys/sdk or arweave-js when ready

export interface ArweaveTransaction {
  txId: string;
  status: 'pending' | 'submitted' | 'confirming' | 'confirmed' | 'failed';
  gatewayUrls: string[];
  fileCount: number;
  totalBytes: number;
  confirmedAt: string | null;
  createdAt: string;
}

export interface UploadProgress {
  stage: 'encrypting' | 'bundling' | 'uploading' | 'confirming';
  progress: number; // 0-100
  message: string;
}

export interface PreservationEstimate {
  sizeBytes: number;
  costUsd: number;
  endowmentYears: number;
  nodeCount: number;
}

const GATEWAYS = [
  'https://arweave.net',
  'https://ar-io.dev',
  'https://g8way.io',
];

function generateMockTxId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return Array.from({ length: 43 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export async function uploadToArweave(
  memorialId: string,
  _data: unknown
): Promise<ArweaveTransaction> {
  // Placeholder: simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const txId = generateMockTxId();
  return {
    txId,
    status: 'confirmed',
    gatewayUrls: GATEWAYS.map(gw => `${gw}/${txId}`),
    fileCount: Math.floor(Math.random() * 50) + 10,
    totalBytes: Math.floor(Math.random() * 500_000_000) + 10_000_000,
    confirmedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}

export async function checkTransactionStatus(txId: string): Promise<ArweaveTransaction> {
  // Placeholder: always returns confirmed
  return {
    txId,
    status: 'confirmed',
    gatewayUrls: GATEWAYS.map(gw => `${gw}/${txId}`),
    fileCount: 34,
    totalBytes: 234_567_890,
    confirmedAt: new Date(Date.now() - 3600_000).toISOString(),
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
  };
}

export function getGatewayUrls(txId: string): string[] {
  return GATEWAYS.map(gw => `${gw}/${txId}`);
}

export function estimateStorageCost(sizeBytes: number): PreservationEstimate {
  // Placeholder: rough Arweave pricing estimate
  const sizeGB = sizeBytes / (1024 * 1024 * 1024);
  return {
    sizeBytes,
    costUsd: Math.max(0.5, sizeGB * 5.0),
    endowmentYears: 200,
    nodeCount: 847,
  };
}

export function simulateUploadProgress(
  onProgress: (progress: UploadProgress) => void,
  durationMs: number = 8000
): () => void {
  const stages: UploadProgress[] = [
    { stage: 'encrypting', progress: 0, message: 'Encrypting memorial data...' },
    { stage: 'encrypting', progress: 100, message: 'Encryption complete' },
    { stage: 'bundling', progress: 0, message: 'Bundling files for Arweave...' },
    { stage: 'bundling', progress: 100, message: 'Bundle ready' },
    { stage: 'uploading', progress: 0, message: 'Uploading to Arweave network...' },
    { stage: 'uploading', progress: 50, message: 'Propagating across gateways...' },
    { stage: 'uploading', progress: 100, message: 'Upload complete' },
    { stage: 'confirming', progress: 0, message: 'Waiting for network confirmation...' },
    { stage: 'confirming', progress: 100, message: 'Permanently preserved' },
  ];

  let cancelled = false;
  const interval = durationMs / stages.length;

  stages.forEach((stage, i) => {
    setTimeout(() => {
      if (!cancelled) onProgress(stage);
    }, interval * i);
  });

  return () => { cancelled = true; };
}
