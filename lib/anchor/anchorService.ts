// lib/anchor/anchorService.ts
// Placeholder Anchor (local device sync) service
// Replace with real File System Access API / OPFS when ready

export interface BrowserCapabilities {
  magicFolder: boolean;    // showDirectoryPicker (Chrome/Edge)
  opfs: boolean;           // Origin Private File System (Safari/Firefox)
  zipOnly: boolean;        // Fallback: ZIP download
  browserName: string;
  browserVersion: string;
}

export interface AnchorDevice {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  syncProgressBytes: number;
  totalBytes: number;
  lastSyncAt: string | null;
  status: 'syncing' | 'synced' | 'error' | 'stale';
  location?: string;
}

export interface AnchorProgress {
  stage: 'detecting' | 'downloading' | 'verifying' | 'complete';
  progress: number;
  message: string;
  bytesDownloaded?: number;
  totalBytes?: number;
}

export function detectBrowserCapabilities(): BrowserCapabilities {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isChrome = ua.includes('Chrome') && !ua.includes('Edg');
  const isEdge = ua.includes('Edg');
  const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
  const isFirefox = ua.includes('Firefox');

  const hasDirectoryPicker = typeof window !== 'undefined' && 'showDirectoryPicker' in window;
  const hasOPFS = typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in (navigator.storage || {});

  let browserName = 'Unknown';
  if (isChrome) browserName = 'Chrome';
  else if (isEdge) browserName = 'Edge';
  else if (isSafari) browserName = 'Safari';
  else if (isFirefox) browserName = 'Firefox';

  return {
    magicFolder: hasDirectoryPicker,
    opfs: hasOPFS,
    zipOnly: !hasDirectoryPicker && !hasOPFS,
    browserName,
    browserVersion: ua.match(/(?:Chrome|Firefox|Safari|Edg)\/(\d+)/)?.[1] || 'unknown',
  };
}

export async function startAnchor(
  _memorialId: string,
  _targetDir?: FileSystemDirectoryHandle
): Promise<{ success: boolean; deviceId: string }> {
  // Placeholder: simulate anchor setup
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    success: true,
    deviceId: `device_${Date.now().toString(36)}`,
  };
}

export async function checkAnchorStatus(_memorialId: string): Promise<AnchorDevice[]> {
  // Placeholder: return mock devices
  return [
    {
      id: 'dev_1',
      deviceName: 'MacBook Pro',
      browser: 'Chrome 121',
      os: 'macOS Sonoma',
      syncProgressBytes: 234_567_890,
      totalBytes: 234_567_890,
      lastSyncAt: new Date(Date.now() - 3600_000).toISOString(),
      status: 'synced',
      location: 'San Francisco, CA',
    },
    {
      id: 'dev_2',
      deviceName: 'iPad Air',
      browser: 'Safari 17',
      os: 'iPadOS 17',
      syncProgressBytes: 180_000_000,
      totalBytes: 234_567_890,
      lastSyncAt: new Date(Date.now() - 86400_000).toISOString(),
      status: 'syncing',
      location: 'San Francisco, CA',
    },
  ];
}

export function getDeviceInfo(): { name: string; browser: string; os: string } {
  const caps = detectBrowserCapabilities();
  const platform = typeof navigator !== 'undefined' ? navigator.platform : 'Unknown';
  return {
    name: `${caps.browserName} on ${platform}`,
    browser: `${caps.browserName} ${caps.browserVersion}`,
    os: platform,
  };
}

export function checkStorageCapacity(): { available: boolean; estimatedGB: number } {
  // Placeholder
  return { available: true, estimatedGB: 50 };
}

export function simulateAnchorProgress(
  onProgress: (progress: AnchorProgress) => void,
  totalBytes: number = 234_567_890,
  durationMs: number = 6000
): () => void {
  let cancelled = false;
  const stages: AnchorProgress[] = [
    { stage: 'detecting', progress: 100, message: 'Browser capabilities detected' },
    { stage: 'downloading', progress: 25, message: 'Downloading memorial data...', bytesDownloaded: totalBytes * 0.25, totalBytes },
    { stage: 'downloading', progress: 50, message: 'Downloading photos and media...', bytesDownloaded: totalBytes * 0.5, totalBytes },
    { stage: 'downloading', progress: 75, message: 'Downloading videos...', bytesDownloaded: totalBytes * 0.75, totalBytes },
    { stage: 'downloading', progress: 100, message: 'Download complete', bytesDownloaded: totalBytes, totalBytes },
    { stage: 'verifying', progress: 50, message: 'Verifying integrity (SHA-256)...' },
    { stage: 'verifying', progress: 100, message: 'All files verified' },
    { stage: 'complete', progress: 100, message: 'Anchor complete — your copy is safe' },
  ];

  const interval = durationMs / stages.length;
  stages.forEach((stage, i) => {
    setTimeout(() => {
      if (!cancelled) onProgress(stage);
    }, interval * i);
  });

  return () => { cancelled = true; };
}
