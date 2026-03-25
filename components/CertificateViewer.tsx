'use client';

import { Download, ExternalLink, Shield, Calendar, Globe, Clock } from 'lucide-react';
import { downloadCertificate, type CertificateData } from '@/lib/certificate/certificateGenerator';

interface CertificateViewerProps {
    data: CertificateData;
}

export default function CertificateViewer({ data }: CertificateViewerProps) {
    return (
        <div className="bg-surface-mid rounded-xl border border-warm-border p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-olive/10 rounded-lg flex items-center justify-center">
                    <Shield size={16} className="text-olive" />
                </div>
                <h3 className="text-sm font-semibold text-warm-dark font-sans">Certificate of Permanence</h3>
            </div>

            {/* Certificate preview */}
            <div className="bg-surface-high rounded-xl p-8 border border-olive/20 mb-5 text-center">
                <p className="text-xs text-olive/60 font-sans tracking-[0.15em] uppercase mb-4">Certificate of Permanence</p>

                <div className="w-16 h-px bg-olive/30 mx-auto mb-6" />

                <p className="text-xs text-warm-muted font-sans mb-2">This certifies that the memorial of</p>
                <h4 className="text-2xl font-serif text-white mb-1">{data.fullName}</h4>
                <p className="text-sm text-warm-muted font-sans mb-6">
                    {data.deathDate
                        ? `${data.birthDate} — ${data.deathDate}`
                        : `Born ${data.birthDate}`}
                </p>

                <p className="text-xs text-warm-muted font-sans mb-1">has been permanently preserved on</p>
                <p className="text-sm text-warm-dark font-sans font-medium">
                    {new Date(data.preservationDate).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </p>

                <div className="w-16 h-px bg-olive/30 mx-auto my-6" />

                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Globe size={10} className="text-warm-muted" />
                        </div>
                        <p className="text-lg font-sans font-bold text-warm-dark">{data.nodeCount}</p>
                        <p className="text-xs text-warm-muted font-sans">Nodes</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock size={10} className="text-warm-muted" />
                        </div>
                        <p className="text-lg font-sans font-bold text-warm-dark">{data.endowmentYears}+</p>
                        <p className="text-xs text-warm-muted font-sans">Years</p>
                    </div>
                    <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Shield size={10} className="text-warm-muted" />
                        </div>
                        <p className="text-lg font-sans font-bold text-warm-dark">{data.gatewayUrls.length}</p>
                        <p className="text-xs text-warm-muted font-sans">Gateways</p>
                    </div>
                </div>

                <div className="mt-6">
                    <p className="text-xs text-warm-muted font-sans mb-1">Transaction</p>
                    <code className="text-xs text-olive/70 font-mono break-all">{data.transactionId}</code>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={() => downloadCertificate(data)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-olive bg-olive/10 rounded-lg hover:bg-olive/20 transition-colors"
                >
                    <Download size={12} />
                    Download PDF
                </button>
                <a
                    href={`https://viewblock.io/arweave/tx/${data.transactionId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-medium text-warm-dark bg-surface-high/50 rounded-lg hover:bg-surface-high transition-colors"
                >
                    <ExternalLink size={12} />
                    Verify on Arweave
                </a>
            </div>
        </div>
    );
}
