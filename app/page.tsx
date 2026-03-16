import Link from 'next/link';
import { BookOpen, Image, Shield, Globe, Clock, ArrowRight } from 'lucide-react';

const pillars = [
    { title: 'Private by default', body: 'You share only what you choose, with whom you choose, when you choose.' },
    { title: 'Readable formats', body: 'JPEG, PNG, MP4, MP3, PDF. Nothing proprietary. Nothing that requires special software to read twenty years from now.' },
    { title: 'Permanently preserved', body: 'Every archive is inscribed onto Arweave — a permanent, decentralized storage layer. Once preserved, it cannot be deleted, lost, or forgotten.' },
    { title: 'One-time payment', body: 'No subscription. No dependency. No surprises. The business model is aligned with the product\u2019s promise: continuity.' },
];

const howSteps = [
    { icon: BookOpen, title: 'Build freely', body: 'Start creating your memorial immediately. No signup, no payment, no commitment.' },
    { icon: Image, title: 'Add what matters', body: 'Stories, photos, timeline events, voice recordings. Everything that defines a life.' },
    { icon: Shield, title: 'Preserve permanently', body: 'When ready, seal your archive on the Arweave blockchain. One payment, forever.' },
];

const features = [
    'Unlimited stories, photos, videos, and voice recordings',
    'Automatic silent saving — never lose your work',
    'Invite family and friends to contribute memories',
    'Letters to the Future — time-delayed messages to loved ones',
    'Permanent Arweave blockchain preservation',
    'Certificate of Digital Permanence',
    'Full export in universal formats (ZIP archive)',
    'No subscription. No recurring fees. Ever.',
];

export default function HomePage() {
    return (
        <div className="font-serif bg-ivory text-charcoal min-h-screen">

            {/* NAV */}
            <nav className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-sand/40 bg-ivory/95 backdrop-blur-sm sticky top-0 z-50">
                <Link href="/" className="font-sans font-bold text-lg tracking-[0.08em] text-charcoal">
                    LEGACY VAULT
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/how-it-works" className="font-sans text-sm text-charcoal/60 hover:text-charcoal transition-colors">
                        How it works
                    </Link>
                    <Link href="/pricing" className="font-sans text-sm text-charcoal/60 hover:text-charcoal transition-colors">
                        Pricing
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="px-5 py-2.5 text-sm font-sans font-medium rounded-lg border border-charcoal/30 text-charcoal hover:bg-sand/10 transition-colors"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/create"
                        className="px-5 py-2.5 text-sm font-sans font-medium rounded-lg bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors"
                    >
                        Start creating
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="px-6 py-24 md:py-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-8">
                        Family Memory &middot; Transmission &middot; Permanence
                    </span>

                    <h1 className="text-[clamp(2rem,5vw,3.2rem)] font-normal leading-[1.2] max-w-2xl mx-auto mb-6">
                        What deserves to be passed on<br />must not be lost.
                    </h1>

                    <p className="text-lg text-charcoal/60 max-w-xl mx-auto mb-10 leading-relaxed">
                        Legacy Vault is a private, structured, and durable space to organize texts, images, voices, documents,
                        and values — and transmit them to the people who matter.
                    </p>

                    <div className="flex gap-4 justify-center flex-wrap">
                        <Link
                            href="/create"
                            className="px-8 py-3.5 text-base font-sans font-medium rounded-lg bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors"
                        >
                            Create my archive
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="px-8 py-3.5 text-base font-sans font-medium rounded-lg border border-charcoal/25 text-charcoal hover:bg-sand/10 transition-colors"
                        >
                            See how it works
                        </Link>
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/30" />

            {/* HOW IT WORKS SUMMARY */}
            <section className="px-6 py-20 bg-white border-b border-sand/30">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                        The Journey
                    </span>
                    <h2 className="text-3xl font-normal mb-12">
                        Three steps to permanence.
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {howSteps.map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <div key={i}>
                                    <div className="w-12 h-12 rounded-xl bg-parchment flex items-center justify-center mb-5">
                                        <Icon size={22} className="text-charcoal/60" />
                                    </div>
                                    <span className="text-xs font-sans uppercase tracking-[0.15em] text-charcoal/40 block mb-2">
                                        Step {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                    <p className="text-sm text-charcoal/60 leading-relaxed">{step.body}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/how-it-works"
                            className="inline-flex items-center gap-2 text-sm font-sans text-charcoal/60 hover:text-charcoal transition-colors"
                        >
                            See detailed walkthrough <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* WHAT IS IT */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                            What it is
                        </span>
                        <h2 className="text-3xl font-normal leading-snug mb-5">
                            Not a social network. Not a virtual cemetery.
                        </h2>
                        <p className="text-charcoal/60 leading-relaxed mb-4">
                            Legacy Vault is a space for <em>clarity</em> — not entertainment. A place to gather what defines
                            a lineage: decisions, values, exiles, sacrifices, silences.
                        </p>
                        <p className="text-charcoal/60 leading-relaxed">
                            The interface is deliberately calm, so as never to overwhelm a subject that is already emotionally
                            significant. The goal is not to display — it is to transmit.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-sage/10 via-terracotta/10 to-lavender/10 rounded-xl h-80 flex items-center justify-center text-charcoal/40 text-sm tracking-wide border border-sand/30">
                        [Interface preview]
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/30" />

            {/* PILLARS */}
            <section className="px-6 py-20 bg-parchment">
                <div className="max-w-4xl mx-auto">
                    <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                        Principles
                    </span>
                    <h2 className="text-3xl font-normal mb-12">
                        An emotional and cultural safeguard.
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {pillars.map(p => (
                            <div key={p.title} className="bg-ivory rounded-xl p-7 border border-sand/30">
                                <div className="w-8 h-[3px] bg-sage rounded-sm mb-4" />
                                <h3 className="font-semibold text-base mb-2">{p.title}</h3>
                                <p className="text-sm text-charcoal/60 leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TECHNOLOGY */}
            <section className="px-6 py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="max-w-xl mb-14">
                        <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                            Infrastructure
                        </span>
                        <h2 className="text-3xl font-normal leading-snug mb-5">
                            Technology as a silent guarantee.
                        </h2>
                        <p className="text-charcoal/60 leading-relaxed mb-4">
                            Arweave inscribes your archive into a permanent, decentralized storage layer —
                            replicated across hundreds of nodes worldwide. Your data cannot be deleted, even by us.
                        </p>
                        <p className="text-charcoal/60 leading-relaxed">
                            Users configure nothing. You create — we ensure continuity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-sand/30 p-6 text-center">
                            <Globe size={22} className="text-mist mx-auto mb-3" />
                            <p className="text-sm font-medium mb-1">600+ nodes</p>
                            <p className="text-xs text-charcoal/50">Worldwide replication</p>
                        </div>
                        <div className="bg-white rounded-xl border border-sand/30 p-6 text-center">
                            <Clock size={22} className="text-mist mx-auto mb-3" />
                            <p className="text-sm font-medium mb-1">200+ years</p>
                            <p className="text-xs text-charcoal/50">Storage endowment</p>
                        </div>
                        <div className="bg-white rounded-xl border border-sand/30 p-6 text-center">
                            <Shield size={22} className="text-mist mx-auto mb-3" />
                            <p className="text-sm font-medium mb-1">Certificate</p>
                            <p className="text-xs text-charcoal/50">Blockchain verification</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="border-t border-sand/30" />

            {/* TRUST / SOCIAL PROOF */}
            <section className="px-6 py-20 bg-parchment/50">
                <div className="max-w-4xl mx-auto text-center">
                    <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                        Trust
                    </span>

                    <div className="grid md:grid-cols-3 gap-8 mb-14">
                        <div>
                            <p className="text-2xl font-serif mb-1">2024</p>
                            <p className="text-xs text-charcoal/50 uppercase tracking-wider">Operational since</p>
                        </div>
                        <div>
                            <p className="text-2xl font-serif mb-1">200+ years</p>
                            <p className="text-xs text-charcoal/50 uppercase tracking-wider">Preservation guarantee</p>
                        </div>
                        <div>
                            <p className="text-2xl font-serif mb-1">Arweave</p>
                            <p className="text-xs text-charcoal/50 uppercase tracking-wider">Blockchain verified</p>
                        </div>
                    </div>

                    <blockquote className="max-w-2xl mx-auto">
                        <p className="text-lg italic text-charcoal/70 leading-relaxed mb-4">
                            &ldquo;The peace of mind knowing my mother&rsquo;s story will outlast any server,
                            any company, any technology cycle — that is what I was looking for.&rdquo;
                        </p>
                        <cite className="text-sm text-charcoal/40 not-italic">
                            — A Legacy Vault member
                        </cite>
                    </blockquote>
                </div>
            </section>

            {/* VALUE PROPOSITION + PRICING PREVIEW */}
            <section className="px-6 py-20">
                <div className="max-w-xl mx-auto text-center">
                    <span className="inline-block border border-sand px-4 py-1.5 rounded-full text-[0.7rem] uppercase tracking-[0.12em] text-charcoal/70 bg-sand/10 mb-6">
                        Preservation
                    </span>
                    <h2 className="text-3xl font-normal mb-5">
                        Create freely. Preserve when you are ready.
                    </h2>
                    <p className="text-charcoal/60 leading-relaxed mb-8">
                        Start building your memorial at no cost. Add stories, photos, timelines, and voices.
                        When you are satisfied with what you have created, choose to preserve it permanently.
                    </p>

                    <div className="bg-white rounded-xl border border-sand/30 p-8 text-left mb-6">
                        <div className="text-center mb-6">
                            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50 mb-2">Starting from</p>
                            <p className="text-4xl font-serif">$1,470</p>
                            <p className="text-sm text-charcoal/50 mt-1">One-time payment. No subscriptions.</p>
                        </div>

                        <div className="border-t border-sand/20 pt-6 space-y-3">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-charcoal/70">
                                    <span className="w-5 h-[1.5px] bg-sage flex-shrink-0" />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 text-sm font-sans text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        Compare plans <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            <div className="border-t border-sand/30" />

            {/* CTA */}
            <section className="px-6 py-24 text-center">
                <h2 className="text-3xl font-normal mb-4">
                    Start preserving what matters.
                </h2>
                <p className="text-charcoal/60 mb-10 text-base leading-relaxed max-w-lg mx-auto">
                    Legacy Vault is not for everyone.<br />
                    It is for those who believe transmission is not a trivial act.
                </p>
                <Link
                    href="/create"
                    className="inline-block px-8 py-3.5 text-base font-sans font-medium rounded-lg bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors"
                >
                    Create my archive
                </Link>
            </section>
        </div>
    );
}
