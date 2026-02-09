// components/VersionHistory.tsx
// Displays the full version history timeline for a memorial
// Includes: view version, restore version, change reasons
'use client';

import { useState, useEffect } from 'react';
import {
    Clock, User, RotateCcw, Eye, ChevronDown, ChevronUp,
    FileText, Image as ImageIcon, Film, BookOpen, Heart,
    Briefcase, Sparkles, Home, MessageCircle, X, Loader2,
    AlertTriangle, CheckCircle, History, ArrowLeft, Shield
} from 'lucide-react';
import { MemorialVersion, getVersionHistory, restoreVersion, getVersion } from '@/lib/versionService';
import { MemorialData } from '@/types/memorial';
import MemorialRenderer from '@/components/MemorialRenderer';

interface VersionHistoryProps {
    memorialId: string;
    currentData: MemorialData;
    userId?: string;
    userName?: string;
    onRestore: (restoredData: MemorialData) => void; // Callback to update parent state
    onClose: () => void;
}

const STEP_ICONS: Record<number, any> = {
    1: User, 2: Home, 3: Briefcase, 4: Heart,
    5: Sparkles, 6: BookOpen, 7: MessageCircle, 8: ImageIcon, 9: Film,
};

const STEP_NAMES: Record<number, string> = {
    1: 'Basic Info', 2: 'Childhood', 3: 'Career', 4: 'Family',
    5: 'Personality', 6: 'Biography', 7: 'Memories', 8: 'Photos', 9: 'Videos',
};

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
    manual: { label: 'Manual Edit', color: 'bg-sage/10 text-sage' },
    auto_save: { label: 'Auto-save', color: 'bg-sand/20 text-charcoal/50' },
    witness_contribution: { label: 'Witness', color: 'bg-terracotta/10 text-terracotta' },
    restore: { label: 'Restored', color: 'bg-purple-100 text-purple-700' },
};

export default function VersionHistory({
    memorialId,
    currentData,
    userId,
    userName,
    onRestore,
    onClose,
}: VersionHistoryProps) {
    const [versions, setVersions] = useState<MemorialVersion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // View version state
    const [viewingVersion, setViewingVersion] = useState<MemorialVersion | null>(null);
    const [viewingData, setViewingData] = useState<MemorialData | null>(null);
    const [loadingView, setLoadingView] = useState(false);

    // Restore state
    const [restoringId, setRestoringId] = useState<string | null>(null);
    const [confirmRestore, setConfirmRestore] = useState<MemorialVersion | null>(null);

    // Expanded version details
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, [memorialId]);

    const loadHistory = async () => {
        setLoading(true);
        setError(null);
        const result = await getVersionHistory(memorialId);
        if (result.error) {
            setError(result.error);
        } else {
            setVersions(result.versions);
        }
        setLoading(false);
    };

    const handleViewVersion = async (version: MemorialVersion) => {
        setLoadingView(true);

        // Build complete data from snapshot
        let data: MemorialData;
        if (version.is_full_snapshot) {
            data = { ...currentData, ...version.snapshot_data } as MemorialData;
        } else {
            // Partial snapshot — we show what we have merged onto current
            data = { ...currentData };
            for (const [key, value] of Object.entries(version.snapshot_data)) {
                (data as any)[key] = value;
            }
        }

        setViewingVersion(version);
        setViewingData(data);
        setLoadingView(false);
    };

    const handleRestore = async (version: MemorialVersion) => {
        setRestoringId(version.id);
        const result = await restoreVersion(
            memorialId,
            version.id,
            currentData,
            userId,
            userName,
        );

        if (result.success && result.restoredData) {
            onRestore(result.restoredData);
            setConfirmRestore(null);
            await loadHistory(); // Refresh to show new restore version
        } else {
            alert(`Restore failed: ${result.error}`);
        }
        setRestoringId(null);
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit',
        });
    };

    const formatRelativeTime = (dateStr: string) => {
        const now = new Date();
        const d = new Date(dateStr);
        const diffMs = now.getTime() - d.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateStr);
    };

    // =============================================
    // VERSION VIEWER OVERLAY
    // =============================================
    if (viewingVersion && viewingData) {
        return (
            <div className="fixed inset-0 z-[100] bg-charcoal/90 backdrop-blur-sm overflow-y-auto">
                <div className="min-h-screen">
                    {/* Header bar */}
                    <div className="sticky top-0 z-10 bg-charcoal/95 backdrop-blur-md border-b border-ivory/10 px-6 py-4">
                        <div className="max-w-5xl mx-auto flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <button
                                        onClick={() => { setViewingVersion(null); setViewingData(null); }}
                                        className="p-2 hover:bg-ivory/10 rounded-lg transition-all"
                                    >
                                        <ArrowLeft size={20} className="text-ivory" />
                                    </button>
                                    <h2 className="text-ivory font-semibold">
                                        Version #{viewingVersion.version_number}
                                    </h2>
                                    <span className="text-ivory/50 text-sm">
                                        {formatDate(viewingVersion.created_at)} at {formatTime(viewingVersion.created_at)}
                                    </span>
                                </div>
                                <p className="text-ivory/60 text-sm ml-12">
                                    {viewingVersion.change_summary}
                                    {!viewingVersion.is_full_snapshot && (
                                        <span className="text-ivory/40 ml-2">(partial snapshot — some sections may show current data)</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setConfirmRestore(viewingVersion)}
                                    className="px-4 py-2 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-lg font-medium transition-all flex items-center gap-2 text-sm"
                                >
                                    <RotateCcw size={16} />
                                    Restore This Version
                                </button>
                                <button
                                    onClick={() => { setViewingVersion(null); setViewingData(null); }}
                                    className="p-2 hover:bg-ivory/10 rounded-lg transition-all"
                                >
                                    <X size={20} className="text-ivory" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Rendered memorial at this version */}
                    <div className="max-w-5xl mx-auto py-8 px-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl">
                            <MemorialRenderer
                                data={viewingData}
                                isPreview={true}
                                compact={false}
                            />
                        </div>
                    </div>
                </div>

                {/* Restore confirmation modal */}
                {confirmRestore && (
                    <RestoreConfirmModal
                        version={confirmRestore}
                        isRestoring={restoringId === confirmRestore.id}
                        onConfirm={() => handleRestore(confirmRestore)}
                        onCancel={() => setConfirmRestore(null)}
                    />
                )}
            </div>
        );
    }

    // =============================================
    // MAIN TIMELINE VIEW
    // =============================================
    return (
        <div className="fixed inset-0 z-[100] bg-charcoal/80 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen py-8 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-sage/20 rounded-xl flex items-center justify-center">
                                <History size={24} className="text-sage" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif text-ivory">Version History</h2>
                                <p className="text-ivory/50 text-sm">
                                    {versions.length} version{versions.length !== 1 ? 's' : ''} recorded
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 hover:bg-ivory/10 rounded-xl transition-all"
                        >
                            <X size={24} className="text-ivory" />
                        </button>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="text-center py-20">
                            <Loader2 size={32} className="text-sage animate-spin mx-auto mb-4" />
                            <p className="text-ivory/60">Loading history...</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm mb-6">
                            {error}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && versions.length === 0 && (
                        <div className="text-center py-20">
                            <Clock size={48} className="text-ivory/20 mx-auto mb-4" />
                            <p className="text-ivory/50 text-lg mb-2">No version history yet</p>
                            <p className="text-ivory/30 text-sm">
                                Versions are created when you save changes to the memorial.
                            </p>
                        </div>
                    )}

                    {/* Timeline */}
                    {!loading && versions.length > 0 && (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-6 top-0 bottom-0 w-px bg-ivory/10" />

                            <div className="space-y-4">
                                {versions.map((version, idx) => {
                                    const isExpanded = expandedId === version.id;
                                    const typeInfo = TYPE_LABELS[version.change_type] || TYPE_LABELS.manual;

                                    return (
                                        <div key={version.id} className="relative pl-14">
                                            {/* Timeline dot */}
                                            <div className={`absolute left-4 top-5 w-5 h-5 rounded-full border-2 border-ivory/20 ${idx === 0 ? 'bg-sage' : version.change_type === 'restore' ? 'bg-purple-500' : 'bg-charcoal'
                                                }`} />

                                            {/* Version card */}
                                            <div className="bg-ivory/5 hover:bg-ivory/8 border border-ivory/10 rounded-xl p-5 transition-all">
                                                {/* Header row */}
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            <span className="text-ivory font-medium text-sm">
                                                                v{version.version_number}
                                                            </span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${typeInfo.color}`}>
                                                                {typeInfo.label}
                                                            </span>
                                                            {version.is_full_snapshot && (
                                                                <span className="px-2 py-0.5 bg-sage/10 text-sage rounded-full text-[10px] font-medium">
                                                                    Full Snapshot
                                                                </span>
                                                            )}
                                                            {idx === 0 && (
                                                                <span className="px-2 py-0.5 bg-ivory/10 text-ivory/70 rounded-full text-[10px] font-medium">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-ivory/80 text-sm">{version.change_summary}</p>
                                                    </div>
                                                    <span className="text-ivory/40 text-xs whitespace-nowrap flex-shrink-0">
                                                        {formatRelativeTime(version.created_at)}
                                                    </span>
                                                </div>

                                                {/* Meta row */}
                                                <div className="flex items-center gap-4 text-xs text-ivory/40 mb-3">
                                                    {version.created_by_name && (
                                                        <span className="flex items-center gap-1">
                                                            <User size={12} />
                                                            {version.created_by_name}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} />
                                                        {formatDate(version.created_at)} {formatTime(version.created_at)}
                                                    </span>
                                                </div>

                                                {/* Modified steps badges */}
                                                <div className="flex flex-wrap gap-1.5 mb-3">
                                                    {version.steps_modified.map(step => {
                                                        const Icon = STEP_ICONS[step] || FileText;
                                                        return (
                                                            <span key={step} className="inline-flex items-center gap-1 px-2 py-1 bg-ivory/5 border border-ivory/10 rounded-lg text-[10px] text-ivory/50">
                                                                <Icon size={10} />
                                                                {STEP_NAMES[step]}
                                                            </span>
                                                        );
                                                    })}
                                                </div>

                                                {/* Change reason (if provided) */}
                                                {version.change_reason && (
                                                    <div className="mb-3 pl-3 border-l-2 border-sage/30">
                                                        <p className="text-ivory/50 text-xs italic">
                                                            "{version.change_reason}"
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Action buttons */}
                                                <div className="flex items-center gap-2 pt-2 border-t border-ivory/5">
                                                    <button
                                                        onClick={() => handleViewVersion(version)}
                                                        disabled={loadingView}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 bg-ivory/5 hover:bg-ivory/10 text-ivory/70 rounded-lg text-xs transition-all"
                                                    >
                                                        <Eye size={14} />
                                                        View
                                                    </button>
                                                    {idx !== 0 && (
                                                        <button
                                                            onClick={() => setConfirmRestore(version)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta rounded-lg text-xs transition-all"
                                                        >
                                                            <RotateCcw size={14} />
                                                            Restore
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Restore confirmation modal */}
            {confirmRestore && (
                <RestoreConfirmModal
                    version={confirmRestore}
                    isRestoring={restoringId === confirmRestore.id}
                    onConfirm={() => handleRestore(confirmRestore)}
                    onCancel={() => setConfirmRestore(null)}
                />
            )}
        </div>
    );
}

// =============================================
// RESTORE CONFIRMATION MODAL
// =============================================
function RestoreConfirmModal({
    version,
    isRestoring,
    onConfirm,
    onCancel,
}: {
    version: MemorialVersion;
    isRestoring: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-charcoal/70">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="w-14 h-14 bg-terracotta/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <RotateCcw size={28} className="text-terracotta" />
                </div>

                <h3 className="font-serif text-2xl text-charcoal text-center mb-2">
                    Restore Version #{version.version_number}?
                </h3>

                <p className="text-charcoal/60 text-sm text-center mb-2">
                    From {new Date(version.created_at).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    })}
                </p>

                <p className="text-charcoal/50 text-xs text-center mb-6 leading-relaxed">
                    "{version.change_summary}"
                </p>

                <div className="p-4 bg-sage/5 rounded-xl border border-sage/20 mb-6">
                    <div className="flex items-start gap-2">
                        <Shield size={16} className="text-sage mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-charcoal/60 leading-relaxed">
                            This will revert the memorial to this version. Your current state will be saved
                            as a new version in the history — nothing is ever lost.
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isRestoring}
                        className="flex-1 py-3 border border-sand/40 rounded-xl hover:bg-sand/10 transition-all font-medium text-charcoal text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isRestoring}
                        className="flex-1 py-3 bg-terracotta hover:bg-terracotta/90 text-ivory rounded-xl font-medium transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        {isRestoring ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Restoring...
                            </>
                        ) : (
                            <>
                                <RotateCcw size={16} />
                                Restore
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}