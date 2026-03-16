'use client';

import { useState } from 'react';
import { ChevronDown, Globe, Shield, Clock, Server } from 'lucide-react';

export default function ArweaveEducation() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="dark-card overflow-hidden">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-5 text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-vault-dark rounded-lg flex items-center justify-center">
                        <Globe size={16} className="text-vault-muted" />
                    </div>
                    <span className="text-sm font-sans font-medium text-vault-text">
                        What is Arweave? Learn more
                    </span>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-vault-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
                />
            </button>

            {expanded && (
                <div className="px-5 pb-5 pt-0 space-y-5 animate-fade-in-up">
                    <p className="text-sm text-vault-muted font-sans leading-relaxed">
                        Arweave is a decentralized, permanent data storage protocol. Unlike traditional cloud
                        storage where you rent space monthly, Arweave uses a one-time endowment model —
                        a single payment funds storage for 200+ years.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-vault-dark/50 rounded-lg p-4">
                            <Server size={18} className="text-vault-muted mb-2" />
                            <h4 className="text-sm font-sans font-medium text-vault-text mb-1">847 Nodes</h4>
                            <p className="text-xs text-vault-muted font-sans">
                                Your data is replicated across independent nodes on every continent.
                                No single company, server, or country controls access.
                            </p>
                        </div>
                        <div className="bg-vault-dark/50 rounded-lg p-4">
                            <Clock size={18} className="text-vault-muted mb-2" />
                            <h4 className="text-sm font-sans font-medium text-vault-text mb-1">200-Year Endowment</h4>
                            <p className="text-xs text-vault-muted font-sans">
                                Storage costs decline ~30% annually. A one-time endowment funds storage
                                well beyond any human lifetime.
                            </p>
                        </div>
                        <div className="bg-vault-dark/50 rounded-lg p-4">
                            <Shield size={18} className="text-vault-muted mb-2" />
                            <h4 className="text-sm font-sans font-medium text-vault-text mb-1">Immutable</h4>
                            <p className="text-xs text-vault-muted font-sans">
                                Once preserved, data cannot be altered or deleted. This is by design — permanence
                                is the promise.
                            </p>
                        </div>
                        <div className="bg-vault-dark/50 rounded-lg p-4">
                            <Globe size={18} className="text-vault-muted mb-2" />
                            <h4 className="text-sm font-sans font-medium text-vault-text mb-1">Multi-Gateway</h4>
                            <p className="text-xs text-vault-muted font-sans">
                                Access through 3+ independent gateways (arweave.net, ar-io.dev, g8way.io).
                                If one goes down, others remain.
                            </p>
                        </div>
                    </div>

                    <div className="bg-vault-dark/30 rounded-lg p-4 border border-vault-border">
                        <h4 className="text-sm font-sans font-medium text-vault-text mb-2">
                            How is this different from Google Drive or iCloud?
                        </h4>
                        <p className="text-xs text-vault-muted font-sans leading-relaxed">
                            Cloud storage requires ongoing payment. If you stop paying, your data is deleted.
                            If the company shuts down, your data disappears. Arweave eliminates this dependency.
                            Your memorial is preserved independently of any company, including Legacy Vault itself.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
