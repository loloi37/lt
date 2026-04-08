'use client';

import { useState, useEffect, useCallback } from 'react';
import { HardDrive, Monitor, Smartphone, Wifi, WifiOff, Download, Settings, UserPlus, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { detectBrowserCapabilities, simulateAnchorProgress, type AnchorDevice, type AnchorProgress, type BrowserCapabilities } from '@/lib/anchor/anchorService';

interface AnchorPanelProps {
    memorialId: string;
}

// Fetch the real, server-validated device list from the API. The local
// anchorService.checkAnchorStatus is a placeholder and intentionally throws in
// production — devices come from the database, never from the client.
async function fetchAnchorDevices(memorialId: string): Promise<AnchorDevice[]> {
    const res = await fetch(
        `/api/anchor/sync-status?memorialId=${encodeURIComponent(memorialId)}`,
        { cache: 'no-store' }
    );
    if (!res.ok) {
        throw new Error(`Failed to load anchor devices (${res.status})`);
    }
    const data = await res.json();
    return (data.devices || []) as AnchorDevice[];
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

function DeviceIcon({ browser }: { browser: string }) {
    if (browser.includes('Safari') || browser.includes('iPad')) {
        return <Smartphone size={16} className="text-warm-muted" />;
    }
    return <Monitor size={16} className="text-warm-muted" />;
}

function StatusBadge({ status }: { status: AnchorDevice['status'] }) {
    const configs = {
        synced: { icon: CheckCircle, text: 'Synced', color: 'text-green-400 bg-green-400/10' },
        syncing: { icon: RefreshCw, text: 'Syncing', color: 'text-blue-400 bg-blue-400/10' },
        error: { icon: AlertCircle, text: 'Error', color: 'text-red-400 bg-red-400/10' },
        stale: { icon: WifiOff, text: 'Stale', color: 'text-amber-400 bg-amber-400/10' },
    };
    const config = configs[status];
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-medium ${config.color}`}>
            <Icon size={10} /> {config.text}
        </span>
    );
}

export default function AnchorPanel({ memorialId }: AnchorPanelProps) {
    const [capabilities, setCapabilities] = useState<BrowserCapabilities | null>(null);
    const [devices, setDevices] = useState<AnchorDevice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [anchoring, setAnchoring] = useState(false);
    const [progress, setProgress] = useState<AnchorProgress | null>(null);

    useEffect(() => {
        let cancelled = false;
        setCapabilities(detectBrowserCapabilities());
        fetchAnchorDevices(memorialId)
            .then(d => {
                if (cancelled) return;
                setDevices(d);
                setLoading(false);
            })
            .catch(err => {
                if (cancelled) return;
                console.error('[AnchorPanel] failed to load devices', err);
                setError('Could not load anchored devices.');
                setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [memorialId]);

    const handleAnchor = useCallback(() => {
        setAnchoring(true);
        const cancel = simulateAnchorProgress((p) => {
            setProgress(p);
            if (p.stage === 'complete') {
                setAnchoring(false);
                fetchAnchorDevices(memorialId).then(setDevices).catch((err) => {
                    console.error('[AnchorPanel] reload failed', err);
                });
            }
        });
        return cancel;
    }, [memorialId]);

    if (loading) {
        return (
            <div className="bg-surface-mid rounded-xl border border-warm-border p-6">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-warm-border rounded w-1/3" />
                    <div className="h-3 bg-warm-border rounded w-2/3" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-surface-mid rounded-xl border border-warm-border p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle size={16} className="text-red-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-sans font-medium text-warm-dark">Anchor unavailable</p>
                        <p className="text-xs text-warm-muted font-sans mt-1">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const tierLabel = capabilities?.magicFolder
        ? 'Magic Folder (visible desktop folder)'
        : capabilities?.opfs
            ? 'Hidden Vault (browser storage with export)'
            : 'ZIP Download';

    return (
        <div className="bg-surface-mid rounded-xl border border-warm-border p-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <HardDrive size={16} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-warm-dark font-sans">Family Sync Status</h3>
                        <p className="text-xs text-warm-muted font-sans">{devices.length} device{devices.length !== 1 ? 's' : ''} anchored</p>
                    </div>
                </div>
                <span className="text-xs text-warm-muted font-sans px-2 py-1 bg-surface-high/50 rounded">
                    {tierLabel}
                </span>
            </div>

            {/* Device list */}
            <div className="space-y-3 mb-5">
                {devices.map(device => {
                    const syncPercent = device.totalBytes > 0
                        ? Math.round((device.syncProgressBytes / device.totalBytes) * 100)
                        : 0;
                    const lastSeen = device.lastSyncAt
                        ? new Date(device.lastSyncAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                        : 'Never';

                    return (
                        <div key={device.id} className="bg-surface-high/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <DeviceIcon browser={device.browser} />
                                    <div>
                                        <p className="text-sm font-sans font-medium text-warm-dark">{device.deviceName}</p>
                                        <p className="text-xs text-warm-muted font-sans">{device.location}</p>
                                    </div>
                                </div>
                                <StatusBadge status={device.status} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-1.5 bg-warm-border rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-400/60 rounded-full transition-all"
                                        style={{ width: `${syncPercent}%` }}
                                    />
                                </div>
                                <span className="text-xs text-warm-muted font-sans w-20 text-right">
                                    {formatBytes(device.syncProgressBytes)}
                                </span>
                            </div>
                            <p className="text-xs text-warm-muted font-sans mt-1">Last seen: {lastSeen}</p>
                        </div>
                    );
                })}
            </div>

            {/* Anchor progress */}
            {anchoring && progress && (
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Download size={14} className="text-blue-400 animate-pulse" />
                        <span className="text-sm font-sans text-blue-300">{progress.message}</span>
                    </div>
                    <div className="w-full h-1.5 bg-warm-border rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress.progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={handleAnchor}
                    disabled={anchoring}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-warm-dark bg-surface-high/50 rounded-lg hover:bg-surface-high transition-colors disabled:opacity-50"
                >
                    <Download size={12} />
                    Anchor to This Device
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-warm-dark bg-surface-high/50 rounded-lg hover:bg-surface-high transition-colors">
                    <UserPlus size={12} />
                    Invite Family Member
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-warm-muted bg-surface-high/50 rounded-lg hover:bg-surface-high transition-colors">
                    <Settings size={12} />
                </button>
            </div>

            {/* Offline Guarantee */}
            <div className="mt-5 pt-4 border-t border-warm-border">
                <div className="flex items-start gap-2">
                    <Wifi size={14} className="text-warm-muted mt-0.5" />
                    <div>
                        <p className="text-xs font-sans font-medium text-warm-dark mb-1">Offline Access Guarantee</p>
                        <p className="text-xs text-warm-muted font-sans leading-relaxed">
                            Anchored devices retain a complete, verified copy of your memorial data.
                            Access remains available even without an internet connection.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
