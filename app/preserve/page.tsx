'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, ArrowRight, ArrowLeft, Clock, Globe, Lock, Users, HardDrive, Pencil } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import ArweaveEducation from '@/components/ArweaveEducation';
import { estimateStorageCost } from '@/lib/arweave/arweaveService';

export default function PreservationGatePage() {
    return (
        <Suspense fallback={<div className="dark-dashboard min-h-screen" />}>
            <PreservationGateContent />
        </Suspense>
    );
}

function PreservationGateContent() {
    const router = useRouter();
    const auth = useAuth();
    const searchParams = useSearchParams();
    const memorialId = searchParams.get('memorialId');
    const [estimatedCost, setEstimatedCost] = useState<ReturnType<typeof estimateStorageCost> | null>(null);

    useEffect(() => {
        // Estimate based on typical memorial size (500MB)
        setEstimatedCost(estimateStorageCost(500_000_000));
    }, []);

    const handlePreservePersonal = () => {
        if (!auth.authenticated) {
            router.push(`/signup?next=${encodeURIComponent('/preserve' + (memorialId ? `?memorialId=${memorialId}` : ''))}`);
            return;
        }
        router.replace(`/personal-confirmation${memorialId ? `?memorialId=${memorialId}` : ''}`);
    };

    const handlePreserveFamily = () => {
        if (!auth.authenticated) {
            router.push(`/signup?next=${encodeURIComponent('/preserve' + (memorialId ? `?memorialId=${memorialId}` : ''))}`);
            return;
        }
        router.replace(`/family-confirmation${memorialId ? `?memorialId=${memorialId}` : ''}`);
    };

    const handleContinueEditing = () => {
        if (memorialId) {
            router.push(`/create?id=${memorialId}`);
        } else {
            router.back();
        }
    };

    return (
        <div className="dark-dashboard min-h-screen">
            {/* Header */}
            <div className="border-b border-vault-border">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-vault-muted hover:text-vault-text transition-colors mb-4 text-sm font-sans"
                    >
                        <ArrowLeft size={16} /> Back to editor
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                            <Shield size={20} className="text-gold" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-serif text-white">Preserve This Memorial</h1>
                            <p className="text-sm text-vault-muted font-sans">Permanent storage on the Arweave network</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Current status */}
                <div className="dark-card p-6 mb-8 border-dashed">
                    <div className="flex items-start gap-3">
                        <Clock size={18} className="text-amber-400 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-vault-text mb-1">
                                This memorial is private and temporary
                            </h3>
                            <p className="text-sm text-vault-muted font-sans leading-relaxed">
                                Your memorial is saved on our servers but has not been permanently preserved.
                                It can be edited, deleted, and is not yet accessible to anyone else.
                                To make it permanent, choose a preservation plan below.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Preservation plans */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Personal Archive */}
                    <div className="dark-card p-6 dark-card-hover transition-all cursor-pointer group" onClick={handlePreservePersonal}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-serif text-white">Personal Archive</h3>
                            <span className="text-2xl font-sans font-bold text-gold">$1,470</span>
                        </div>
                        <p className="text-xs text-vault-muted font-sans mb-1">One-time payment</p>
                        <p className="text-sm text-vault-muted font-sans leading-relaxed mb-5">
                            Permanently preserve one complete memorial on the Arweave blockchain.
                        </p>
                        <ul className="space-y-2.5 mb-6 text-sm font-sans text-vault-text/80">
                            {[
                                { icon: Shield, text: 'Permanent Arweave preservation' },
                                { icon: Lock, text: 'Client-side AES-256 encryption' },
                                { icon: Globe, text: '847 nodes, 3+ gateways' },
                                { icon: Clock, text: '200-year endowment' },
                                { icon: Users, text: 'Successor designation' },
                            ].map(item => (
                                <li key={item.text} className="flex items-center gap-2">
                                    <item.icon size={14} className="text-vault-muted" />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2 text-gold text-sm font-sans font-medium group-hover:gap-3 transition-all">
                            Preserve as Personal <ArrowRight size={16} />
                        </div>
                    </div>

                    {/* Family Legacy Network */}
                    <div className="dark-card p-6 dark-card-hover transition-all cursor-pointer group border-gold/20" onClick={handlePreserveFamily}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-serif text-white">Family Legacy Network</h3>
                            <span className="text-2xl font-sans font-bold text-gold">$2,940</span>
                        </div>
                        <p className="text-xs text-vault-muted font-sans mb-1">One-time payment</p>
                        <p className="text-sm text-vault-muted font-sans leading-relaxed mb-5">
                            Unlimited family memorials with local device sync and offline access.
                        </p>
                        <ul className="space-y-2.5 mb-6 text-sm font-sans text-vault-text/80">
                            {[
                                { icon: Shield, text: 'Everything in Personal' },
                                { icon: Users, text: 'Unlimited linked memorials' },
                                { icon: HardDrive, text: 'Anchor: local device sync' },
                                { icon: Globe, text: 'Visual family constellation' },
                                { icon: Lock, text: 'Offline access guarantee' },
                            ].map(item => (
                                <li key={item.text} className="flex items-center gap-2">
                                    <item.icon size={14} className="text-vault-muted" />
                                    {item.text}
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center gap-2 text-gold text-sm font-sans font-medium group-hover:gap-3 transition-all">
                            Preserve as Family <ArrowRight size={16} />
                        </div>
                    </div>
                </div>

                {/* Arweave Education */}
                <div className="mb-8">
                    <ArweaveEducation />
                </div>

                {/* Estimated cost */}
                {estimatedCost && (
                    <div className="dark-card p-5 mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-vault-muted font-sans mb-0.5">Estimated preservation size</p>
                                <p className="text-sm font-sans text-vault-text">
                                    ~500 MB across {estimatedCost.nodeCount} nodes for {estimatedCost.endowmentYears}+ years
                                </p>
                            </div>
                            <p className="text-xs text-vault-muted font-sans">
                                Included in plan price
                            </p>
                        </div>
                    </div>
                )}

                {/* Continue editing escape hatch */}
                <div className="text-center">
                    <button
                        onClick={handleContinueEditing}
                        className="inline-flex items-center gap-2 text-sm font-sans text-vault-muted hover:text-vault-text transition-colors"
                    >
                        <Pencil size={14} />
                        Continue editing without preserving
                    </button>
                    <p className="text-xs text-vault-muted/60 font-sans mt-2">
                        Your draft will remain saved on our servers for 30 days.
                    </p>
                </div>
            </div>
        </div>
    );
}
