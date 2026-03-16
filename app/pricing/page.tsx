import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, Shield, Globe, Clock } from 'lucide-react';

const personalFeatures = [
    'Permanent Arweave blockchain storage',
    '50-100 GB for photos, videos, documents',
    'Unique permanent URL — accessible forever',
    'End-to-end encryption',
    'Certificate of Digital Permanence (PDF)',
    'Stories, photos, timeline, voice recordings',
    'Letters to the Future — time-delayed messages',
    'Succession planning — designate a steward',
    'Full ZIP export in universal formats',
    'No subscription. No recurring fees. Ever.',
];

const familyFeatures = [
    'Everything in Personal Archive',
    'Anchor system — sync to every family device',
    'Link multiple family memorials together',
    'Distributed backup across family devices',
    'Shared family timeline',
    'Family contributor invitations',
    'Priority support from preservation team',
];

const faqs = [
    {
        q: 'What happens after I pay?',
        a: 'Your memorial is sealed and inscribed onto the Arweave blockchain — replicated across hundreds of nodes worldwide. You receive a Certificate of Digital Permanence with your unique transaction ID as cryptographic proof.',
    },
    {
        q: 'Can I update a preserved memorial?',
        a: "Preserved memorials are immutable — that is what makes them permanent. You can create a new version and preserve it alongside the original, which remains intact as a historical record.",
    },
    {
        q: 'What if Legacy Vault shuts down?',
        a: "Your memorial lives on the Arweave blockchain, completely independent of our servers. Even if Legacy Vault ceases to exist, the archive remains permanently accessible through any Arweave gateway worldwide.",
    },
    {
        q: 'What is Arweave?',
        a: 'Arweave is a decentralized data storage protocol designed for permanent information storage. It uses a novel "blockweave" technology and an economic endowment model calculated to sustain data for 200+ years — likely much longer as storage costs continue to fall.',
    },
    {
        q: 'Is there a refund policy?',
        a: 'Yes. We offer a 30-day refund policy for memorials that have not yet been inscribed to the blockchain. Once preserved on Arweave, the process is irreversible. See our full refund policy for details.',
    },
    {
        q: 'What formats are supported?',
        a: 'JPEG, PNG, MP4, MP3, PDF, and plain text. Nothing proprietary — only formats that will remain readable decades from now.',
    },
];

export default function PricingPage() {
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
                        <Shield size={14} />
                        Preservation Plans
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif text-charcoal leading-tight mb-6">
                        Create freely.<br />
                        <span className="text-charcoal/60">Preserve when you are ready.</span>
                    </h1>

                    <p className="text-lg text-charcoal/60 leading-relaxed max-w-2xl mx-auto">
                        Start building your memorial at no cost. When you are satisfied with what
                        you have created, choose a preservation plan to seal it permanently.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="px-6 py-16 bg-white border-y border-sand/30">
                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Personal */}
                    <div className="rounded-xl border border-sand/30 bg-ivory p-8 flex flex-col">
                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50 mb-4">
                            Personal Archive
                        </p>
                        <div className="text-4xl md:text-5xl font-serif text-charcoal mb-1">
                            $1,470
                        </div>
                        <p className="text-sm text-charcoal/50 mb-8">One-time payment</p>

                        <div className="border-t border-sand/20 pt-6 mb-8 flex-1">
                            <div className="space-y-3">
                                {personalFeatures.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-sage flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-charcoal/70 leading-relaxed">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/create"
                            className="block w-full text-center px-6 py-3.5 bg-charcoal text-ivory rounded-lg font-sans font-medium text-sm hover:bg-charcoal/90 transition-colors"
                        >
                            Start creating
                        </Link>
                    </div>

                    {/* Family */}
                    <div className="rounded-xl border-2 border-mist/30 bg-ivory p-8 flex flex-col relative">
                        <div className="absolute -top-3 left-8">
                            <span className="text-[11px] uppercase tracking-[0.15em] bg-mist/10 text-mist px-3 py-1 rounded-full border border-mist/20">
                                For families
                            </span>
                        </div>

                        <p className="text-xs uppercase tracking-[0.18em] text-charcoal/50 mb-4">
                            Family Legacy Network
                        </p>
                        <div className="text-4xl md:text-5xl font-serif text-charcoal mb-1">
                            $2,940
                        </div>
                        <p className="text-sm text-charcoal/50 mb-8">One-time payment</p>

                        <div className="border-t border-sand/20 pt-6 mb-8 flex-1">
                            <div className="space-y-3">
                                {familyFeatures.map((f, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle size={16} className="text-mist flex-shrink-0 mt-0.5" />
                                        <span className="text-sm text-charcoal/70 leading-relaxed">{f}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="mailto:contact@legacyvault.example?subject=Family Legacy Network inquiry"
                            className="block w-full text-center px-6 py-3.5 bg-mist text-ivory rounded-lg font-sans font-medium text-sm hover:bg-mist/90 transition-colors"
                        >
                            Book a consultation
                        </Link>
                    </div>
                </div>
            </section>

            {/* Free Tier */}
            <section className="px-6 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    <h3 className="text-2xl font-serif mb-4">Not ready to preserve?</h3>
                    <p className="text-charcoal/60 leading-relaxed mb-6">
                        Continue editing your memorial without preserving. Your work is saved
                        for 30 days — no payment required, no signup needed to start.
                    </p>
                    <Link
                        href="/create"
                        className="inline-flex items-center gap-2 text-sm font-sans text-charcoal/70 hover:text-charcoal transition-colors underline underline-offset-4"
                    >
                        Start building for free <ArrowRight size={14} />
                    </Link>
                </div>
            </section>

            {/* FAQ */}
            <section className="px-6 py-16 bg-white border-y border-sand/30">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl font-serif text-center mb-10">Common Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group bg-ivory rounded-xl border border-sand/30 overflow-hidden">
                                <summary className="px-6 py-4 cursor-pointer text-sm font-medium text-charcoal hover:bg-sand/5 transition-colors list-none flex items-center justify-between">
                                    {faq.q}
                                    <ArrowRight size={14} className="text-charcoal/30 group-open:rotate-90 transition-transform flex-shrink-0 ml-4" />
                                </summary>
                                <div className="px-6 pb-4 text-sm text-charcoal/60 leading-relaxed">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 text-center">
                <h2 className="text-2xl md:text-3xl font-serif mb-4">
                    Start preserving what matters.
                </h2>
                <p className="text-charcoal/60 mb-8 max-w-lg mx-auto leading-relaxed">
                    Legacy Vault is not for everyone. It is for those who believe
                    transmission is not a trivial act.
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
