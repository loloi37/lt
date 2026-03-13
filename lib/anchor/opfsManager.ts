// lib/anchor/opfsManager.ts - Origin Private File System manager
// Handles invisible local archive storage using the browser's OPFS API.
// Works on Safari/iOS where the File System Access API is not available.
//
// OPFS provides a sandboxed filesystem that persists across sessions
// but is not visible to the user in Finder/Files app.

export interface OPFSStatus {
  available: boolean;
  totalSize: number;
  fileCount: number;
  lastSync: string | null;
}

/**
 * Check if OPFS is available in the current browser.
 */
export function isOPFSAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'storage' in navigator && 'getDirectory' in navigator.storage;
}

/**
 * Get the root directory handle for Legacy Vault's OPFS storage.
 */
async function getArchiveDirectory(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return await root.getDirectoryHandle('legacy-vault-archive', { create: true });
}

/**
 * Store a memorial archive file in OPFS.
 */
export async function storeArchiveFile(
  memorialId: string,
  fileName: string,
  data: ArrayBuffer
): Promise<void> {
  if (!isOPFSAvailable()) {
    throw new Error('Origin Private File System is not available in this browser.');
  }

  const archiveDir = await getArchiveDirectory();
  const memorialDir = await archiveDir.getDirectoryHandle(memorialId, { create: true });
  const fileHandle = await memorialDir.getFileHandle(fileName, { create: true });

  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

/**
 * Read a memorial archive file from OPFS.
 */
export async function readArchiveFile(
  memorialId: string,
  fileName: string
): Promise<ArrayBuffer | null> {
  if (!isOPFSAvailable()) return null;

  try {
    const archiveDir = await getArchiveDirectory();
    const memorialDir = await archiveDir.getDirectoryHandle(memorialId);
    const fileHandle = await memorialDir.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    return await file.arrayBuffer();
  } catch {
    return null;
  }
}

/**
 * Delete a memorial's entire archive from OPFS.
 */
export async function deleteArchive(memorialId: string): Promise<void> {
  if (!isOPFSAvailable()) return;

  try {
    const archiveDir = await getArchiveDirectory();
    await archiveDir.removeEntry(memorialId, { recursive: true });
  } catch {
    // Directory may not exist, which is fine
  }
}

/**
 * Get the current sync status of the OPFS archive.
 */
export async function getOPFSStatus(memorialId: string): Promise<OPFSStatus> {
  if (!isOPFSAvailable()) {
    return { available: false, totalSize: 0, fileCount: 0, lastSync: null };
  }

  try {
    const archiveDir = await getArchiveDirectory();
    const memorialDir = await archiveDir.getDirectoryHandle(memorialId);

    let totalSize = 0;
    let fileCount = 0;
    let lastModified = 0;

    for await (const [, handle] of (memorialDir as any).entries()) {
      if (handle.kind === 'file') {
        const file = await handle.getFile();
        totalSize += file.size;
        fileCount++;
        if (file.lastModified > lastModified) {
          lastModified = file.lastModified;
        }
      }
    }

    return {
      available: true,
      totalSize,
      fileCount,
      lastSync: lastModified > 0 ? new Date(lastModified).toISOString() : null,
    };
  } catch {
    return { available: true, totalSize: 0, fileCount: 0, lastSync: null };
  }
}

/**
 * Store the complete memorial JSON data as a manifest in OPFS.
 */
export async function storeManifest(
  memorialId: string,
  data: Record<string, unknown>
): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  const buffer = new TextEncoder().encode(json).buffer;
  await storeArchiveFile(memorialId, 'manifest.json', buffer);
}
