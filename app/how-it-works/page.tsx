import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Image, Eye, Lock, Shield, Globe, Clock, CheckCircle } from 'lucide-react';

const steps = [
    {
        number: '01',
        title: 'Start building',
        icon: BookOpen,
        description: 'Begin immediately — no signup, no payment, no commitment. Legacy Vault opens a calm, private workspace where you start capturing what matters.',
    },
    {
        number: '02',
        title: 'Add memories',
        icon: Image,
        description: 'Explore four ways to tell a story:',
        subItems: [
            'Stories — Written narratives, anecdotes, wisdom passed down',
            'Photos — Images and videos that capture moments',
            'Timeline — Key life events in chronological order',
            'Voices — Audio recordings, spoken memories',
        ],
        footnote: 'Everything auto-saves silently as you work. Never lose a word.',
    },
    {
        number: '03',
        title: 'Preview your memorial',
        icon: Eye,
        description: 'See exactly how your memorial will appear to those you share it with. A structured, beautiful presentation of a life well lived.',
    },
    {
        number: '04',
        title: 'Save your work',
        icon: Lock,
        description: 'Create an account to save your progress permanently. Your work is stored securely and you can return anytime to continue editing.',
        footnote: 'Without an account, your work is saved locally for 30 days.',
    },
    {
        number: '05',
        title: 'Preserve permanently',
        icon: Shield,
        description: 'When you are ready, choose to preserve your memorial on the Arweave blockchain. A single payment ensures your archive endures for 200+ years.',
        link: { label: 'See pricing', href: '/pricing' },
    },
];

const deliverables = [
    'Permanent blockchain-inscribed memorial',
    'Unique, shareable URL that never expires',
    'Certificate of Digital Permanence (PDF)',
    'Succession planning tools',
    'Letters to the Future capability',
    'Full data export (ZIP) in universal formats',
    'Contributor invitation system',
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-ivory text-charcoal font-serif selection:bg-mist/20">
            {/* Hero */}
            <section className="px-6 py-20 md:py-28 text-center">
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-charcoal/50 hover:text-charcoal transition-colors mb-12 font-sans"
                    >
                        <ArrowLeft size={14} />
                        Back to home
                    </Link>

                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-mist mb-8 border border-mist/20 px-4 py-2 rounded-full">
                        The Journey
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight mb-6">
                        How Legacy Vault Works
                    </h1>

                    <p className="text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
                        From first memory to permanent preservation — a guided journey
                        through building something that endures.
                    </p>
                </div>
            </section>

            {/* Steps */}
            <section className="px-6 py-16">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-0">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const isLast = i === steps.length - 1;
                            return (
                                <div key={step.number} className="relative flex gap-6 md:gap-10">
                                    {/* Left: number + line */}
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full border border-sand/40 bg-white flex items-center justify-center flex-shrink-0">
                                            <Icon size={20} className="text-charcoal/60" />
                                        </div>
                                        {!isLast && (
                                            <div className="w-px flex-1 bg-sand/30 my-2" />
                                        )}
                                    </div>

                                    {/* Right: content */}
                                    <div className={`pb-12 ${isLast ? 'pb-0' : ''}`}>
                                        <span className="text-xs font-sans uppercase tracking-[0.15em] text-charcoal/40 mb-1 block">
                                            Step {step.number}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-serif mb-3">{step.title}</h3>
                                        <p className="text-charcoal/60 leading-relaxed mb-3">{step.description}</p>

                                        {step.subItems && (
                                            <ul className="space-y-2 mb-3">
                                                {step.subItems.map((item, j) => (
                                                    <li key={j} className="flex items-start gap-3 text-sm text-charcoal/60">
                                                        <span className="w-4 h-px bg-sage mt-2.5 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {step.footnote && (
                                            <p className="text-sm text-charcoal/40 italic">{step.footnote}</p>
                                        )}

                                        {step.link && (
                                            <Link
                                                href={step.link.href}
                                                className="inline-flex items-center gap-2 text-sm font-sans text-mist hover:text-mist/80 transition-colors mt-2"
                                            >
                                                {step.link.label} <ArrowRight size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section className="px-6 py-16 bg-white border-y border-sand/30">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center mb-12">
                        Arweave: The Permanent Archive
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Globe size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">Decentralized Storage</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                Replicated across 600+ independent nodes worldwide.
                                No single company, server, or government can remove it.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Clock size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">200-Year Endowment</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                One-time payment funds permanent storage mathematically
                                designed to sustain the archive for centuries.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-14 h-14 bg-mist/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Shield size={24} className="text-mist" />
                            </div>
                            <h3 className="font-serif text-lg mb-2">Certificate of Permanence</h3>
                            <p className="text-sm text-charcoal/60 leading-relaxed">
                                Cryptographic proof your memorial exists permanently
                                on the blockchain, with a unique verifiable transaction ID.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You Receive */}
            <section className="px-6 py-16">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center mb-10">
                        What You Receive
                    </h2>
                    <div className="space-y-4">
                        {deliverables.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sand/30">
                                <CheckCircle size={18} className="text-sage flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-charcoal/80">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 text-center bg-parchment border-t border-sand/30">
                <h2 className="text-2xl md:text-3xl font-serif mb-4">
                    Ready to begin?
                </h2>
                <p className="text-charcoal/60 mb-8 max-w-lg mx-auto leading-relaxed">
                    Start building your memorial today. It is free, private,
                    and takes only a few minutes to begin.
                </p>
                <Link
                    href="/create"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-charcoal text-ivory rounded-lg font-sans font-medium text-sm hover:bg-charcoal/90 transition-colors"
                >
                    Create my archive <ArrowRight size={16} />
                </Link>
            </section>
        </div>
    );
}
