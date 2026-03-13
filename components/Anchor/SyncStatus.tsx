'use client';

import { useState, useEffect } from 'react';
import { HardDrive, Cloud, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { isOPFSAvailable, getOPFSStatus, type OPFSStatus } from '@/lib/anchor/opfsManager';
import { isFSAccessAvailable, getFSAccessStatus, selectArchiveDirectory, type FSAccessStatus } from '@/lib/anchor/fsAccessManager';

interface SyncStatusProps {
  memorialId: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function SyncStatus({ memorialId }: SyncStatusProps) {
  const [opfsStatus, setOpfsStatus] = useState<OPFSStatus | null>(null);
  const [fsStatus, setFsStatus] = useState<FSAccessStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStatuses();
  }, [memorialId]);

  const loadStatuses = async () => {
    setIsLoading(true);

    if (isOPFSAvailable()) {
      const status = await getOPFSStatus(memorialId);
      setOpfsStatus(status);
    }

    if (isFSAccessAvailable()) {
      const status = await getFSAccessStatus();
      setFsStatus(status);
    }

    setIsLoading(false);
  };

  const handleSelectFolder = async () => {
    try {
      await selectArchiveDirectory();
      const status = await getFSAccessStatus();
      setFsStatus(status);
    } catch {
      // User cancelled the folder picker
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-sand/20 rounded-lg">
        <div className="flex items-center gap-2 text-charcoal/30">
          <RefreshCw size={14} className="animate-spin" />
          <span className="text-xs">Checking local sync...</span>
        </div>
      </div>
    );
  }

  const hasAnySyncSetup = (opfsStatus?.fileCount ?? 0) > 0 || fsStatus?.directoryName;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <HardDrive size={14} className="text-charcoal/40" />
        <h4 className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Local Archive</h4>
      </div>

      {/* OPFS Status (Safari/iOS) */}
      {opfsStatus?.available && (
        <div className="p-3 border border-sand/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud size={14} className="text-charcoal/30" />
              <span className="text-xs text-charcoal/60">Browser Storage</span>
            </div>
            {opfsStatus.fileCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-sage" />
                <span className="text-xs text-sage">{formatBytes(opfsStatus.totalSize)}</span>
              </div>
            ) : (
              <span className="text-xs text-charcoal/30">Not synced</span>
            )}
          </div>
          {opfsStatus.lastSync && (
            <p className="text-[10px] text-charcoal/20 mt-1">
              Last synced: {new Date(opfsStatus.lastSync).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {/* FS Access Status (Chrome Desktop) */}
      {isFSAccessAvailable() && (
        <div className="p-3 border border-sand/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive size={14} className="text-charcoal/30" />
              <span className="text-xs text-charcoal/60">
                {fsStatus?.directoryName ? `Folder: ${fsStatus.directoryName}` : 'Desktop Folder'}
              </span>
            </div>
            {fsStatus?.directoryName ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-sage" />
                <span className="text-xs text-sage">{formatBytes(fsStatus.totalSize)}</span>
              </div>
            ) : (
              <button
                onClick={handleSelectFolder}
                className="text-xs text-charcoal/40 hover:text-charcoal/60 underline"
              >
                Select folder
              </button>
            )}
          </div>
          {fsStatus?.lastSync && (
            <p className="text-[10px] text-charcoal/20 mt-1">
              Last synced: {new Date(fsStatus.lastSync).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {!opfsStatus?.available && !isFSAccessAvailable() && (
        <div className="p-3 border border-sand/20 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-charcoal/20" />
            <span className="text-xs text-charcoal/30">Local archiving not available in this browser</span>
          </div>
        </div>
      )}
    </div>
  );
}
