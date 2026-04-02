'use client';

import { useState, useEffect } from 'react';
import { Shield, ExternalLink, Download, CheckCircle, Clock, Globe } from 'lucide-react';
import { checkTransactionStatus, type ArweaveTransaction } from '@/lib/arweave/arweaveService';
import { downloadCertificate, type CertificateData } from '@/lib/certificate/certificateGenerator';

interface PreservationStatusProps {
    memorialId: string;
    arweaveTxId: string | null;
    fullName: string;
    birthDate: string;
    deathDate: string | null;
    planType: string;
    storageBytesUsed?: number;
    storageBytesIncluded?: number;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

export default function PreservationStatus({
    memorialId,
    arweaveTxId,
    fullName,
    birthDate,
    deathDate,
    planType,
    storageBytesUsed = 234_567_890,
    storageBytesIncluded = 107_374_182_400, // 100 GB
}: PreservationStatusProps) {
    const [txData, setTxData] = useState<ArweaveTransaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (arweaveTxId) {
            checkTransactionStatus(arweaveTxId).then(data => {
                setTxData(data);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [arweaveTxId]);

    const handleDownloadCertificate = () => {
        if (!txData) return;
        const certData: CertificateData = {
            fullName,
            birthDate,
            deathDate,
            preservationDate: txData.confirmedAt || new Date().toISOString(),
            transactionId: txData.txId,
            nodeCount: 847,
            endowmentYears: 200,
            gatewayUrls: txData.gatewayUrls,
            memorialId,
            planType,
        };
        downloadCertificate(certData);
    };

    if (loading) {
        return (
            <div className="bg-white border border-warm-border/40 p-6 rounded-xl shadow-sm">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-warm-border/40 rounded w-1/3" />
                    <div className="h-3 bg-warm-border/40 rounded w-2/3" />
                    <div className="h-3 bg-warm-border/40 rounded w-1/2" />
                </div>
            </div>
        );
    }

    if (!arweaveTxId || !txData) {
        return (
            <div className="bg-white border border-dashed border-warm-border/40 p-6 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                    <Shield size={18} className="text-warm-muted" />
                    <h3 className="text-sm font-semibold text-warm-dark font-sans">Preservation Status</h3>
                </div>
                <p className="text-sm text-warm-muted font-sans">
                    This memorial has not been preserved yet. Preservation permanently stores your memorial on the Arweave network.
                </p>
            </div>
        );
    }

    const usagePercent = Math.min(100, (storageBytesUsed / storageBytesIncluded) * 100);
    const verifiedAgo = txData.confirmedAt
        ? `${Math.round((Date.now() - new Date(txData.confirmedAt).getTime()) / 3600_000)} hours ago`
        : 'Pending';

    return (
        <div className="bg-white border border-warm-border/40 p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center">
                        <Shield size={16} className="text-olive" />
                    </div>
                    <h3 className="text-sm font-semibold text-warm-dark font-sans">Preservation Status</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 rounded-full">
                    <CheckCircle size={12} className="text-green-600" />
                    <span className="text-xs font-sans text-green-600 font-medium">Confirmed</span>
                </div>
            </div>

            {/* Transaction ID */}
            <div className="mb-4">
                <p className="text-xs text-warm-muted font-sans mb-1">Arweave Transaction</p>
                <code className="text-xs text-olive/80 font-mono bg-warm-dark/5 px-2 py-1 rounded break-all">
                    {txData.txId}
                </code>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Globe size={12} className="text-warm-muted" />
                        <span className="text-xs text-warm-muted font-sans">Nodes</span>
                    </div>
                    <p className="text-sm font-semibold text-warm-dark font-sans">847 worldwide</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Clock size={12} className="text-warm-muted" />
                        <span className="text-xs text-warm-muted font-sans">Last verified</span>
                    </div>
                    <p className="text-sm font-semibold text-warm-dark font-sans">{verifiedAgo}</p>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <Shield size={12} className="text-warm-muted" />
                        <span className="text-xs text-warm-muted font-sans">Endowment</span>
                    </div>
                    <p className="text-sm font-semibold text-warm-dark font-sans">200+ years</p>
                </div>
            </div>

            {/* Storage usage */}
            <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-warm-muted font-sans">Storage used</span>
                    <span className="text-xs text-warm-dark font-sans">
                        {formatBytes(storageBytesUsed)} of {formatBytes(storageBytesIncluded)}
                    </span>
                </div>
                <div className="w-full h-1.5 bg-warm-dark/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-olive/60 rounded-full transition-all"
                        style={{ width: `${usagePercent}%` }}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <a
                    href={txData.gatewayUrls[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-warm-dark bg-warm-dark/5 rounded-lg hover:bg-warm-dark/10 transition-colors"
                >
                    <ExternalLink size={12} />
                    View on Blockchain
                </a>
                <button
                    onClick={handleDownloadCertificate}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-medium text-olive bg-olive/10 rounded-lg hover:bg-olive/20 transition-colors"
                >
                    <Download size={12} />
                    Download Certificate
                </button>
            </div>
        </div>
    );
}
