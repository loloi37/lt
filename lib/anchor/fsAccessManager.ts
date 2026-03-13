// lib/anchor/fsAccessManager.ts - File System Access API manager
// Handles downloading the memorial archive to a visible Desktop/Documents folder
// using Chrome's File System Access API (showDirectoryPicker).
//
// This gives users a real, visible folder they can see in Finder/Explorer,
// unlike OPFS which is sandboxed and invisible.

export interface FSAccessStatus {
  available: boolean;
  directoryName: string | null;
  totalSize: number;
  fileCount: number;
  lastSync: string | null;
}

// Store the directory handle in memory for the session.
// The browser will prompt the user once, then remember the permission.
let savedDirectoryHandle: FileSystemDirectoryHandle | null = null;

/**
 * Check if the File System Access API is available.
 * Only works in Chromium browsers (Chrome, Edge, Opera).
 */
export function isFSAccessAvailable(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

/**
 * Prompt the user to select a folder for their archive.
 * This shows a native folder picker dialog.
 * Returns the directory handle for future writes.
 */
export async function selectArchiveDirectory(): Promise<FileSystemDirectoryHandle> {
  if (!isFSAccessAvailable()) {
    throw new Error('File System Access API is not available in this browser. Use Chrome or Edge.');
  }

  const dirHandle = await (window as any).showDirectoryPicker({
    id: 'legacy-vault-archive',
    mode: 'readwrite',
    startIn: 'documents',
  });

  savedDirectoryHandle = dirHandle;
  return dirHandle;
}

/**
 * Get the previously selected directory handle.
 * Returns null if the user hasn't selected a folder yet.
 */
export function getDirectoryHandle(): FileSystemDirectoryHandle | null {
  return savedDirectoryHandle;
}

/**
 * Write a file to the user's selected archive folder.
 */
export async function writeArchiveFile(
  fileName: string,
  data: ArrayBuffer | string,
  subDirectory?: string
): Promise<void> {
  if (!savedDirectoryHandle) {
    throw new Error('No archive directory selected. Call selectArchiveDirectory() first.');
  }

  let targetDir = savedDirectoryHandle;

  // Create subdirectory if specified
  if (subDirectory) {
    targetDir = await savedDirectoryHandle.getDirectoryHandle(subDirectory, { create: true });
  }

  const fileHandle = await targetDir.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();

  if (typeof data === 'string') {
    await writable.write(new TextEncoder().encode(data));
  } else {
    await writable.write(data);
  }

  await writable.close();
}

/**
 * Sync the entire memorial archive to the user's selected folder.
 * Creates a structured directory with media, documents, and metadata.
 */
export async function syncArchiveToFolder(
  memorialData: Record<string, unknown>,
  mediaFiles: Array<{ name: string; data: ArrayBuffer }>
): Promise<{ fileCount: number; totalSize: number }> {
  if (!savedDirectoryHandle) {
    throw new Error('No archive directory selected.');
  }

  let fileCount = 0;
  let totalSize = 0;

  // Write the memorial manifest
  const manifest = JSON.stringify(memorialData, null, 2);
  await writeArchiveFile('memorial-data.json', manifest);
  fileCount++;
  totalSize += new TextEncoder().encode(manifest).length;

  // Write media files
  for (const file of mediaFiles) {
    await writeArchiveFile(file.name, file.data, 'media');
    fileCount++;
    totalSize += file.data.byteLength;
  }

  // Write a human-readable README
  const readme = `Legacy Vault Archive
====================
This folder contains the permanent archive of a memorial.
Do not modify these files - they are synchronized with the cloud.

Last synced: ${new Date().toISOString()}
Files: ${fileCount}
`;
  await writeArchiveFile('README.txt', readme);
  fileCount++;

  return { fileCount, totalSize };
}

/**
 * Get the sync status of the archive folder.
 */
export async function getFSAccessStatus(): Promise<FSAccessStatus> {
  if (!isFSAccessAvailable()) {
    return { available: false, directoryName: null, totalSize: 0, fileCount: 0, lastSync: null };
  }

  if (!savedDirectoryHandle) {
    return { available: true, directoryName: null, totalSize: 0, fileCount: 0, lastSync: null };
  }

  try {
    let totalSize = 0;
    let fileCount = 0;
    let lastModified = 0;

    for await (const [, handle] of (savedDirectoryHandle as any).entries()) {
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
      directoryName: savedDirectoryHandle.name,
      totalSize,
      fileCount,
      lastSync: lastModified > 0 ? new Date(lastModified).toISOString() : null,
    };
  } catch {
    return {
      available: true,
      directoryName: savedDirectoryHandle.name,
      totalSize: 0,
      fileCount: 0,
      lastSync: null,
    };
  }
}
