'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Globe, Clock, Lock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-warm-border/30 last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="font-semibold text-warm-dark pr-4">{question}</span>
                <ChevronDown
                    size={18}
                    className={`text-warm-outline flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <p className="text-sm text-warm-muted leading-relaxed pb-5 -mt-1">{answer}</p>
            )}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-surface-low text-warm-dark font-serif">
            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-surface-low/95 backdrop-blur-sm border-b border-warm-border/30">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="font-sans font-bold text-lg tracking-[0.08em] text-warm-dark">
                        LEGACY VAULT
                    </span>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-sans font-medium text-warm-dark border border-warm-border/30 rounded-lg hover:bg-surface-mid transition-all"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/choice-pricing"
                            className="px-5 py-2.5 text-sm font-sans font-medium text-warm-muted hover:text-warm-dark transition-all"
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/choice-pricing"
                            className="px-5 py-2.5 text-sm font-sans font-medium text-white glass-btn-primary rounded-lg"
                        >
                            Start Building
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="py-24 md:py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-warm-border/30 rounded-full text-xs font-sans tracking-widest uppercase text-warm-outline mb-8 bg-surface-mid/50">
                        <Shield size={12} />
                        Permanent Preservation on Arweave
                    </div>
                    <h1 className="text-4xl md:text-6xl font-light leading-[1.15] mb-6">
                        Permanent memorials<br />
                        for generations.
                    </h1>
                    <p className="text-lg md:text-xl text-warm-muted max-w-xl mx-auto mb-10 leading-relaxed font-sans font-light">
                        A private, structured space to preserve the essence of a life —
                        backed by technology designed to last centuries.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/choice-pricing"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-sans font-medium text-white glass-btn-primary rounded-lg"
                        >
                            Start Building a Memorial
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/example"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-sans font-medium text-warm-dark border border-warm-border/30 rounded-lg hover:bg-surface-mid transition-all"
                        >
                            View an Example
                        </Link>
                    </div>
                    <p className="text-xs text-warm-outline mt-4 font-sans">
                        No account required to begin. Free to build. Pay only to preserve permanently.
                    </p>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* WHAT IT IS */}
            <section className="py-20 md:py-24 px-6 bg-surface-low">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-6 bg-surface-mid/50">
                            What it is
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-5">
                            Not a social network.<br />Not a virtual cemetery.
                        </h2>
                        <p className="text-warm-muted leading-relaxed mb-4 font-sans">
                            Legacy Vault is a space for <em className="text-warm-dark not-italic font-medium">clarity</em> — not
                            entertainment. A place to gather what defines a lineage: decisions, values, sacrifices, the things
                            that must not disappear.
                        </p>
                        <p className="text-warm-muted leading-relaxed font-sans">
                            Every memorial is permanently preserved on <strong className="text-warm-dark">Arweave</strong> —
                            a decentralized storage network with a 200-year endowment.
                            Your data is replicated across 800+ nodes worldwide, accessible through multiple
                            independent gateways. No single point of failure.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-olive/10 via-warm-brown/5 to-plum/10 rounded-xl h-80 flex items-center justify-center border border-warm-border/30">
                        <div className="text-center px-8">
                            <p className="text-sm text-warm-outline font-sans tracking-wide uppercase mb-3">Live example</p>
                            <p className="text-2xl font-light text-warm-muted italic">&ldquo;Eleanor M. Whitfield&rdquo;</p>
                            <p className="text-sm text-warm-outline font-sans mt-2">1932 — 2019</p>
                            <Link
                                href="/example"
                                className="inline-flex items-center gap-1 text-sm font-sans text-warm-muted mt-4 hover:text-warm-dark transition-colors"
                            >
                                View memorial <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* HOW IT WORKS */}
            <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-6 bg-surface-mid/50">
                        Process
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light mb-12">
                        Four steps to permanence.
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: '01', title: 'Build', desc: 'Use our structured editor to document a life — biography, photos, videos, stories, values.' },
                            { step: '02', title: 'Review', desc: 'Preview the complete memorial. Invite family to contribute memories and verify details.' },
                            { step: '03', title: 'Preserve', desc: 'A single payment permanently stores your memorial on Arweave. Encrypted, replicated, immutable.' },
                            { step: '04', title: 'Share', desc: 'Share a private link, anchor to local devices, and designate successors for access continuity.' },
                        ].map(item => (
                            <div key={item.step} className="bg-white rounded-xl p-6 border border-warm-border/30 hover:bg-surface-low transition-colors">
                                <span className="text-3xl font-light text-warm-border mb-3 block">{item.step}</span>
                                <h3 className="text-lg font-semibold text-warm-dark mb-2 font-sans">{item.title}</h3>
                                <p className="text-sm text-warm-muted leading-relaxed font-sans">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* PRESERVATION TECHNOLOGY */}
            <section className="py-20 md:py-24 px-6 bg-surface-low">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-6 bg-surface-mid/50">
                        Preservation Technology
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light mb-6">
                        Designed to last centuries.
                    </h2>
                    <p className="text-warm-muted font-sans leading-relaxed mb-12 max-w-2xl">
                        Legacy Vault uses Arweave — a permanent, decentralized storage protocol funded by a 200-year
                        endowment model. Your memorial is not stored on a server you rent. It is preserved in a network
                        you cannot outlive.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Globe, title: '800+ Nodes', desc: 'Replicated across independent nodes on every continent' },
                            { icon: Shield, title: 'AES-256 Encryption', desc: 'Client-side encryption before data leaves your browser' },
                            { icon: Clock, title: '200-Year Endowment', desc: 'Single payment funds storage for two centuries minimum' },
                            { icon: Lock, title: 'Multi-Gateway', desc: 'Accessible via 3+ independent gateways — no single point of failure' },
                        ].map(item => (
                            <div key={item.title} className="text-center">
                                <div className="w-12 h-12 mx-auto mb-4 bg-surface-mid rounded-xl flex items-center justify-center">
                                    <item.icon size={22} className="text-warm-muted" />
                                </div>
                                <h3 className="text-sm font-semibold font-sans text-warm-dark mb-1">{item.title}</h3>
                                <p className="text-xs text-warm-muted font-sans leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* PRICING */}
            <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-6 bg-surface-mid/50">
                            Pricing
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light mb-3">
                            One payment. Permanent preservation.
                        </h2>
                        <p className="text-warm-muted font-sans">No subscription. No monthly fees. No surprises.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Personal */}
                        <div className="bg-white rounded-xl p-8 border border-warm-border/30 flex flex-col hover:bg-surface-low transition-colors">
                            <h3 className="text-2xl font-light mb-1">Personal</h3>
                            <p className="text-xs text-warm-muted font-sans mb-4">One complete memorial</p>
                            <div className="mb-6">
                                <span className="text-3xl font-sans font-bold text-warm-dark">$1,470</span>
                                <span className="text-sm text-warm-muted font-sans ml-1">one time</span>
                            </div>
                            <ul className="space-y-2.5 mb-8 text-sm font-sans text-warm-muted flex-1">
                                {[
                                    'Permanent Arweave preservation',
                                    'Up to 50 GB of photos, video, audio',
                                    'Structured biography & life story',
                                    'Witness invitations & contributions',
                                    'Successor designation',
                                    'Certificate of Permanence',
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-olive mt-2 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/choice-pricing"
                                className="block w-full text-center py-3 glass-btn-primary text-sm font-sans font-medium rounded-lg"
                            >
                                Choose Personal
                            </Link>
                        </div>

                        {/* Family */}
                        <div className="bg-warm-dark text-white rounded-xl p-8 border border-warm-dark flex flex-col shadow-xl">
                            <h3 className="text-2xl font-light mb-1">Family</h3>
                            <p className="text-xs text-white/50 font-sans mb-4">Unlimited linked memorials</p>
                            <div className="mb-6">
                                <span className="text-3xl font-sans font-bold">$2,940</span>
                                <span className="text-sm text-white/50 font-sans ml-1">one time</span>
                            </div>
                            <ul className="space-y-2.5 mb-8 text-sm font-sans text-white/70 flex-1">
                                {[
                                    'Everything in Personal',
                                    'Unlimited family memorials',
                                    'Visual family constellation',
                                    'Anchor: local device sync',
                                    'Offline access guarantee',
                                    'Family steward designation',
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/choice-pricing"
                                className="block w-full text-center py-3 bg-white text-warm-dark text-sm font-sans font-medium rounded-lg hover:bg-white/90 transition-all"
                            >
                                Choose Family
                            </Link>
                        </div>

                        {/* Concierge */}
                        <div className="bg-white rounded-xl p-8 border border-warm-border/30 flex flex-col relative overflow-hidden hover:bg-surface-low transition-colors">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-plum/15 text-plum text-xs font-sans font-semibold rounded-full border border-plum/30">
                                White Glove
                            </div>
                            <h3 className="text-2xl font-light mb-1">Conciergerie</h3>
                            <p className="text-xs text-warm-muted font-sans mb-4">We build it for you</p>
                            <div className="mb-6">
                                <span className="text-3xl font-sans font-bold text-warm-dark">$6,300</span>
                                <span className="text-sm text-warm-muted font-sans ml-1">per memorial</span>
                            </div>
                            <ul className="space-y-2.5 mb-8 text-sm font-sans text-warm-muted flex-1">
                                {[
                                    'Everything in Family',
                                    'Phone/video interview session',
                                    'Professional biographical writing',
                                    'Document digitization',
                                    '2 revision cycles included',
                                    'Delivered within 60 days',
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-plum mt-2 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/concierge/request"
                                className="block w-full text-center py-3 border border-warm-border/30 text-warm-dark text-sm font-sans font-medium rounded-lg hover:bg-surface-mid transition-all"
                            >
                                Request First Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* TRUST SIGNALS */}
            <section className="py-20 md:py-24 px-6 bg-surface-low">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-light mb-12">
                        Built on trust, not promises.
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-8 text-left">
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-warm-dark mb-2">No subscription dependency</h3>
                            <p className="text-sm text-warm-muted font-sans leading-relaxed">
                                One payment. Funded for 200+ years. Memory should not depend on a monthly charge.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-warm-dark mb-2">Fully exportable</h3>
                            <p className="text-sm text-warm-muted font-sans leading-relaxed">
                                JPEG, PNG, MP4, PDF. Download everything at any time. Standard formats, no lock-in.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-warm-dark mb-2">Succession planning</h3>
                            <p className="text-sm text-warm-muted font-sans leading-relaxed">
                                Designate successors. Configure dead man&apos;s switch. Access transfers automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* FAQ */}
            <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-light mb-10 text-center">Common Questions</h2>
                    <FAQItem
                        question="What happens if Legacy Vault shuts down?"
                        answer="Your memorial lives on Arweave, not on our servers. Even if Legacy Vault ceased to exist, your data remains permanently accessible through any Arweave gateway. Additionally, Family plan users have local copies via our Anchor technology."
                    />
                    <FAQItem
                        question="Why a one-time payment instead of a subscription?"
                        answer="Because subscriptions can be forgotten, canceled, or interrupted. Memory should not depend on a monthly charge. The one-time payment funds a 200-year storage endowment on Arweave."
                    />
                    <FAQItem
                        question="Can I upgrade from Personal to Family later?"
                        answer="Yes. You only pay the difference ($1,470). Your existing memorial is automatically included in the family archive with no data loss."
                    />
                    <FAQItem
                        question="What is Arweave?"
                        answer="Arweave is a decentralized storage network designed for permanent data preservation. Unlike cloud storage, data on Arweave is funded by a one-time endowment that pays for storage in perpetuity, replicated across 800+ independent nodes worldwide."
                    />
                    <FAQItem
                        question="Is my data private?"
                        answer="All memorial data is encrypted with AES-256-GCM before leaving your browser. Only you and your designated successors hold the keys. Not even Legacy Vault can read your content."
                    />
                    <FAQItem
                        question="Can I edit after preservation?"
                        answer="Yes, you can update your memorial at any time. Each update creates a new version on Arweave. Previous versions remain accessible for the complete historical record."
                    />
                </div>
            </section>

            <div className="border-t border-warm-border/30" />

            {/* CTA */}
            <section className="py-24 md:py-32 px-6 text-center bg-surface-low">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-light mb-5">
                        Start preserving what matters.
                    </h2>
                    <p className="text-warm-muted font-sans mb-10 leading-relaxed">
                        Legacy Vault is not for everyone. It is for those who believe
                        that some things must outlast us.
                    </p>
                    <Link
                        href="/choice-pricing"
                        className="inline-flex items-center gap-2 px-10 py-4 text-base font-sans font-medium text-white glass-btn-primary rounded-lg"
                    >
                        Build a Memorial
                        <ArrowRight size={18} />
                    </Link>
                    <p className="text-xs text-warm-outline font-sans mt-4">
                        Free to build. No account required. Pay only when you&apos;re ready to preserve.
                    </p>
                </div>
            </section>
        </div>
    );
}
