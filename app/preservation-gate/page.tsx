'use client';

import Link from 'next/link';
import { Shield, Lock, Globe, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export default function PreservationGatePage() {
    return (
        <div className="min-h-screen bg-ivory text-charcoal font-serif selection:bg-mist/20">
            {/* Hero */}
            <section className="px-6 py-20 md:py-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist mb-8 border border-mist/20 px-4 py-2 rounded-full">
                        <Lock size={14} />
                        Permanent Preservation
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-charcoal leading-tight mb-6">
                        Seal This Archive<br />
                        <span className="text-mist">For Eternity</span>
                    </h1>
                    <p className="text-lg md:text-xl text-charcoal/60 leading-relaxed max-w-2xl mx-auto mb-12">
                        When you preserve a memorial, it is written permanently to the Arweave blockchain —
                        replicated across hundreds of nodes worldwide, designed to endure for 200+ years
                        without any ongoing fees or maintenance.
                    </p>
                </div>
            </section>

            {/* What Preservation Means */}
            <section className="px-6 py-16 bg-white border-y border-sand/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
                        What Permanent Preservation Includes
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">Decentralized Storage</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                Your memorial is stored across hundreds of independent nodes on the Arweave network.
                                No single company, server, or government can remove it.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">200-Year Endowment</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                A one-time payment funds a storage endowment mathematically designed to sustain
                                the archive for at least 200 years — likely much longer as storage costs continue to fall.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">Certificate of Permanence</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                You receive a signed PDF certificate with the Arweave transaction ID,
                                cryptographic proof that this memorial exists permanently on the blockchain.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="px-6 py-16">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">
                        Everything in the Preservation Gate
                    </h2>
                    <div className="space-y-4">
                        {[
                            'Permanent Arweave blockchain storage for all stories, photos, and videos',
                            'Certificate of Digital Permanence (PDF with transaction proof)',
                            'Anchor local backup system — sync archives to your own devices',
                            'Letters to the Future — schedule messages for future delivery',
                            'Succession planning — designate who manages the archive after you',
                            'Contributor invitations — let family members add their own memories',
                            'Priority support from our preservation team',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sand/30">
                                <CheckCircle size={18} className="text-mist flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-charcoal/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="px-6 py-16 bg-white border-y border-sand/30">
                <div className="max-w-lg mx-auto text-center">
                    <p className="text-xs uppercase tracking-[0.2em] text-mist mb-4">One-Time Payment</p>
                    <div className="text-5xl md:text-6xl font-serif text-charcoal mb-2">$1,470</div>
                    <p className="text-charcoal/50 mb-8">No subscriptions. No renewals. Ever.</p>

                    <Link
                        href="/payment"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-charcoal text-ivory rounded-lg font-sans font-medium text-base hover:bg-charcoal/90 transition-all shadow-lg"
                    >
                        Preserve This Memorial <ArrowRight size={18} />
                    </Link>

                    <p className="text-xs text-charcoal/40 mt-6 leading-relaxed">
                        By proceeding, you agree to our{' '}
                        <Link href="/legal/terms" className="underline hover:text-charcoal/60">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/legal/privacy" className="underline hover:text-charcoal/60">Privacy Policy</Link>.
                    </p>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 py-16">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-serif text-center mb-10">Common Questions</h2>
                    <div className="space-y-6">
                        {[
                            {
                                q: 'What happens if Legacy Vault shuts down?',
                                a: 'Your memorial lives on the Arweave blockchain, completely independent of our servers. Even if Legacy Vault ceases to exist, the archive remains permanently accessible through any Arweave gateway.'
                            },
                            {
                                q: 'Can I update a preserved memorial?',
                                a: 'Preserved memorials are immutable — that\'s what makes them permanent. You can create a new version and preserve it, with the original remaining intact as a historical record.'
                            },
                            {
                                q: 'How is this different from cloud storage?',
                                a: 'Cloud storage requires ongoing payments and depends on a single company\'s survival. Arweave uses a one-time endowment model with decentralized replication, making it resistant to company failure, censorship, and data loss.'
                            },
                            {
                                q: 'What is Arweave?',
                                a: 'Arweave is a decentralized data storage protocol designed for permanent information storage. It uses a novel "blockweave" technology and an economic endowment model to ensure data persistence for centuries.'
                            }
                        ].map((faq, i) => (
                            <details key={i} className="group bg-white rounded-xl border border-sand/30 overflow-hidden">
                                <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-charcoal hover:bg-sand/5 transition-colors list-none flex items-center justify-between">
                                    {faq.q}
                                    <ArrowRight size={14} className="text-charcoal/30 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-6 pb-4 text-sm text-charcoal/60 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
