'use client';

import Link from 'next/link';
import { ArrowRight, Shield, Globe, Clock, Lock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-sand/20 last:border-none">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="font-semibold text-charcoal pr-4">{question}</span>
                <ChevronDown
                    size={18}
                    className={`text-charcoal/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <p className="text-sm text-charcoal/60 leading-relaxed pb-5 -mt-1">{answer}</p>
            )}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-ivory text-charcoal font-serif">
            {/* NAV */}
            <nav className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-sand/40">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <span className="font-sans font-bold text-lg tracking-[0.08em] text-charcoal">
                        LEGACY VAULT
                    </span>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-sm font-sans font-medium text-charcoal border border-charcoal/30 rounded-lg hover:bg-charcoal hover:text-white transition-all"
                        >
                            Sign in
                        </Link>
                        <Link
                            href="/create"
                            className="px-5 py-2.5 text-sm font-sans font-medium text-white bg-charcoal rounded-lg hover:bg-charcoal/85 transition-all btn-paper"
                        >
                            Start Building
                        </Link>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="py-24 md:py-32 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-sand/60 rounded-full text-xs font-sans tracking-[0.12em] uppercase text-charcoal/60 mb-8 bg-sand/10">
                        <Shield size={12} />
                        Permanent Preservation on Arweave
                    </div>
                    <h1 className="text-4xl md:text-6xl font-light leading-[1.15] mb-6">
                        Permanent memorials<br />
                        for generations.
                    </h1>
                    <p className="text-lg md:text-xl text-charcoal/60 max-w-xl mx-auto mb-10 leading-relaxed font-sans font-light">
                        A private, structured space to preserve the essence of a life —
                        backed by technology designed to last centuries.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/create"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-sans font-medium text-white bg-charcoal rounded-lg hover:bg-charcoal/85 transition-all btn-paper"
                        >
                            Start Building a Memorial
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/example"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-sans font-medium text-charcoal border border-charcoal/30 rounded-lg hover:bg-charcoal/5 transition-all"
                        >
                            View an Example
                        </Link>
                    </div>
                    <p className="text-xs text-charcoal/40 mt-4 font-sans">
                        No account required to begin. Free to build. Pay only to preserve permanently.
                    </p>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* WHAT IT IS */}
            <section className="py-20 md:py-24 px-6 bg-ivory">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block text-xs font-sans tracking-[0.12em] uppercase text-charcoal/50 border border-sand/50 rounded-full px-4 py-1.5 mb-6 bg-sand/10">
                            What it is
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light leading-tight mb-5">
                            Not a social network.<br />Not a virtual cemetery.
                        </h2>
                        <p className="text-charcoal/60 leading-relaxed mb-4 font-sans">
                            Legacy Vault is a space for <em className="text-charcoal/80 not-italic font-medium">clarity</em> — not
                            entertainment. A place to gather what defines a lineage: decisions, values, sacrifices, the things
                            that must not disappear.
                        </p>
                        <p className="text-charcoal/60 leading-relaxed font-sans">
                            Every memorial is permanently preserved on <strong className="text-charcoal/80">Arweave</strong> —
                            a decentralized storage network with a 200-year endowment.
                            Your data is replicated across 800+ nodes worldwide, accessible through multiple
                            independent gateways. No single point of failure.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-sage/10 via-terracotta/5 to-lavender/10 rounded-xl h-80 flex items-center justify-center border border-sand/40">
                        <div className="text-center px-8">
                            <p className="text-sm text-charcoal/40 font-sans tracking-wide uppercase mb-3">Live example</p>
                            <p className="text-2xl font-light text-charcoal/70 italic">&ldquo;Eleanor M. Whitfield&rdquo;</p>
                            <p className="text-sm text-charcoal/40 font-sans mt-2">1932 — 2019</p>
                            <Link
                                href="/example"
                                className="inline-flex items-center gap-1 text-sm font-sans text-charcoal/60 mt-4 hover:text-charcoal transition-colors"
                            >
                                View memorial <ArrowRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* HOW IT WORKS */}
            <section className="py-20 md:py-24 px-6 bg-parchment/30">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block text-xs font-sans tracking-[0.12em] uppercase text-charcoal/50 border border-sand/50 rounded-full px-4 py-1.5 mb-6 bg-sand/10">
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
                            <div key={item.step} className="bg-ivory rounded-xl p-6 border border-sand/40">
                                <span className="text-3xl font-light text-charcoal/20 mb-3 block">{item.step}</span>
                                <h3 className="text-lg font-semibold text-charcoal mb-2 font-sans">{item.title}</h3>
                                <p className="text-sm text-charcoal/60 leading-relaxed font-sans">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* PRESERVATION TECHNOLOGY */}
            <section className="py-20 md:py-24 px-6 bg-ivory">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block text-xs font-sans tracking-[0.12em] uppercase text-charcoal/50 border border-sand/50 rounded-full px-4 py-1.5 mb-6 bg-sand/10">
                        Preservation Technology
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light mb-6">
                        Designed to last centuries.
                    </h2>
                    <p className="text-charcoal/60 font-sans leading-relaxed mb-12 max-w-2xl">
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
                                <div className="w-12 h-12 mx-auto mb-4 bg-charcoal/5 rounded-xl flex items-center justify-center">
                                    <item.icon size={22} className="text-charcoal/50" />
                                </div>
                                <h3 className="text-sm font-semibold font-sans text-charcoal mb-1">{item.title}</h3>
                                <p className="text-xs text-charcoal/50 font-sans leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* PRICING */}
            <section className="py-20 md:py-24 px-6 bg-parchment/30">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-sans tracking-[0.12em] uppercase text-charcoal/50 border border-sand/50 rounded-full px-4 py-1.5 mb-6 bg-sand/10">
                            Pricing
                        </span>
                        <h2 className="text-3xl md:text-4xl font-light mb-3">
                            One payment. Permanent preservation.
                        </h2>
                        <p className="text-charcoal/50 font-sans">No subscription. No monthly fees. No surprises.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Personal */}
                        <div className="bg-ivory rounded-xl p-8 border border-sand/40 flex flex-col">
                            <h3 className="text-2xl font-light mb-1">Personal</h3>
                            <p className="text-xs text-charcoal/50 font-sans mb-4">One complete memorial</p>
                            <div className="mb-6">
                                <span className="text-3xl font-sans font-bold text-charcoal">$1,470</span>
                                <span className="text-sm text-charcoal/50 font-sans ml-1">one time</span>
                            </div>
                            <ul className="space-y-2.5 mb-8 text-sm font-sans text-charcoal/70 flex-1">
                                {[
                                    'Permanent Arweave preservation',
                                    'Up to 50 GB of photos, video, audio',
                                    'Structured biography & life story',
                                    'Witness invitations & contributions',
                                    'Successor designation',
                                    'Certificate of Permanence',
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-sage mt-2 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/choice-pricing"
                                className="block w-full text-center py-3 bg-charcoal text-white text-sm font-sans font-medium rounded-lg hover:bg-charcoal/85 transition-all"
                            >
                                Choose Personal
                            </Link>
                        </div>

                        {/* Family */}
                        <div className="bg-charcoal text-white rounded-xl p-8 border border-charcoal flex flex-col shadow-xl">
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
                                className="block w-full text-center py-3 bg-white text-charcoal text-sm font-sans font-medium rounded-lg hover:bg-white/90 transition-all"
                            >
                                Choose Family
                            </Link>
                        </div>

                        {/* Concierge */}
                        <div className="bg-ivory rounded-xl p-8 border border-sand/40 flex flex-col relative overflow-hidden">
                            <div className="absolute top-4 right-4 px-3 py-1 bg-mist/15 text-mist text-xs font-sans font-semibold rounded-full border border-mist/30">
                                White Glove
                            </div>
                            <h3 className="text-2xl font-light mb-1">Conciergerie</h3>
                            <p className="text-xs text-charcoal/50 font-sans mb-4">We build it for you</p>
                            <div className="mb-6">
                                <span className="text-3xl font-sans font-bold text-charcoal">$6,300</span>
                                <span className="text-sm text-charcoal/50 font-sans ml-1">per memorial</span>
                            </div>
                            <ul className="space-y-2.5 mb-8 text-sm font-sans text-charcoal/70 flex-1">
                                {[
                                    'Everything in Family',
                                    'Phone/video interview session',
                                    'Professional biographical writing',
                                    'Document digitization',
                                    '2 revision cycles included',
                                    'Delivered within 60 days',
                                ].map(f => (
                                    <li key={f} className="flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-mist mt-2 flex-shrink-0" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/concierge/request"
                                className="block w-full text-center py-3 border border-charcoal/20 text-charcoal text-sm font-sans font-medium rounded-lg hover:bg-charcoal/5 transition-all"
                            >
                                Request First Call
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* TRUST SIGNALS */}
            <section className="py-20 md:py-24 px-6 bg-ivory">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-light mb-12">
                        Built on trust, not promises.
                    </h2>
                    <div className="grid sm:grid-cols-3 gap-8 text-left">
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-charcoal mb-2">No subscription dependency</h3>
                            <p className="text-sm text-charcoal/50 font-sans leading-relaxed">
                                One payment. Funded for 200+ years. Memory should not depend on a monthly charge.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-charcoal mb-2">Fully exportable</h3>
                            <p className="text-sm text-charcoal/50 font-sans leading-relaxed">
                                JPEG, PNG, MP4, PDF. Download everything at any time. Standard formats, no lock-in.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-sans font-semibold text-charcoal mb-2">Succession planning</h3>
                            <p className="text-sm text-charcoal/50 font-sans leading-relaxed">
                                Designate successors. Configure dead man&apos;s switch. Access transfers automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/40" />

            {/* FAQ */}
            <section className="py-20 md:py-24 px-6 bg-parchment/30">
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

            <div className="border-t border-sand/40" />

            {/* CTA */}
            <section className="py-24 md:py-32 px-6 text-center bg-ivory">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-light mb-5">
                        Start preserving what matters.
                    </h2>
                    <p className="text-charcoal/50 font-sans mb-10 leading-relaxed">
                        Legacy Vault is not for everyone. It is for those who believe
                        that some things must outlast us.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 px-10 py-4 text-base font-sans font-medium text-white bg-charcoal rounded-lg hover:bg-charcoal/85 transition-all btn-paper"
                    >
                        Build a Memorial
                        <ArrowRight size={18} />
                    </Link>
                    <p className="text-xs text-charcoal/40 font-sans mt-4">
                        Free to build. No account required. Pay only when you&apos;re ready to preserve.
                    </p>
                </div>
            </section>
        </div>
    );
}
