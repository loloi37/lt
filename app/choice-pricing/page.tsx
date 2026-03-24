'use client';

import { useState } from 'react';
import { FileEdit, User, Users, Sparkles, Check, ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

const features = [
    { label: 'Number of archives', draft: '—', personal: '1', family: 'Unlimited', concierge: 'Unlimited' },
    { label: 'Structured biography', draft: '—', personal: '✓', family: '✓', concierge: '✓' },
    { label: 'Photo & video gallery', draft: '—', personal: '✓', family: '✓', concierge: '✓' },
    { label: 'Witness invitations', draft: '—', personal: '✓', family: '✓', concierge: '✓' },
    { label: 'Quarterly Ark export', draft: '—', personal: '✓', family: '✓', concierge: '✓' },
    { label: 'Successor designation', draft: '—', personal: '✓', family: '✓', concierge: '✓' },
    { label: 'Archive linking', draft: '—', personal: '—', family: '✓', concierge: '✓' },
    { label: 'Visual family tree', draft: '—', personal: '—', family: '✓', concierge: '✓' },
    { label: 'Family steward', draft: '—', personal: '—', family: '✓', concierge: '✓' },
    { label: 'Professional interview', draft: '—', personal: '—', family: '—', concierge: '✓' },
    { label: 'Document digitization', draft: '—', personal: '—', family: '—', concierge: '✓' },
    { label: 'Biographical writing', draft: '—', personal: '—', family: '—', concierge: '✓' },
    { label: 'Physical certificate', draft: '—', personal: 'Optional', family: 'Optional', concierge: 'Included' },
];

const faqs = [
    {
        question: 'Why a one-time payment instead of a subscription?',
        answer: 'Because subscriptions can be forgotten, canceled, or interrupted. Memory should not depend on a monthly charge.',
    },
    {
        question: 'Does the price include storage?',
        answer: 'Yes. Unlimited storage for the lifetime of the archive. No additional fees.',
    },
    {
        question: 'What happens if Legacy Vault shuts down?',
        answer: 'Your data is exportable at any time. In addition, an escrow arrangement guarantees continuity.',
    },
    {
        question: 'Can I upgrade from Personal to Family later?',
        answer: 'Yes. You only pay the difference ($1,470). Your existing archive is automatically integrated.',
    },
    {
        question: 'Are there hidden fees?',
        answer: 'No. The displayed price is final. No storage fees. No annual fees. No export fees.',
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-sand/20 pb-4">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex justify-between items-center font-semibold text-left cursor-pointer text-charcoal"
            >
                {question}
                <ChevronDown
                    size={20}
                    className={`text-charcoal/50 transition-transform flex-shrink-0 ml-4 ${open ? 'rotate-180' : ''}`}
                />
            </button>
            {open && (
                <p className="mt-4 text-sm text-charcoal/60 leading-relaxed">
                    {answer}
                </p>
            )}
        </div>
    );
}

export default function ChoicePricingPage() {
    const router = useRouter();
    const auth = useAuth();
    const userId = auth.user?.id || null;
    const ready = !auth.loading;

    const hasPaidPlan = auth.hasPaid;

    const requireAuth = (nextPath: string): boolean => {
        if (userId) return true;
        router.push(`/signup?next=${encodeURIComponent(nextPath)}`);
        return false;
    };

    const handleDraftStart = () => {
        if (!requireAuth('/choice-pricing')) return;
        router.replace(`/dashboard/draft/${userId}`);
    };

    const handleModeSelection = (mode: 'personal' | 'family') => {
        if (hasPaidPlan && auth.plan === mode) {
            router.replace(`/dashboard/${mode}/${userId}`);
            return;
        }
        const confirmPath = mode === 'personal' ? '/personal-confirmation' : '/family-confirmation';
        if (!requireAuth(confirmPath)) return;
        router.replace(confirmPath);
    };

    const handleConciergeSelection = () => {
        router.push('/concierge/request');
    };

    return (
        <main className="pt-16 pb-24 px-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-16">
                <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 bg-sand/20 border border-sand/30 rounded-full text-xs uppercase tracking-widest text-charcoal/60 hover:text-charcoal transition-all mb-8 group hover-grow"
                >
                    <ArrowLeft
                        size={14}
                        className="mr-2 group-hover:-translate-x-1 transition-transform"
                    />
                    Back to Home
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-6xl md:text-8xl font-serif text-charcoal leading-none mb-4">
                            Choose Your <br />
                            <span className="italic text-mist">Experience</span>
                        </h1>
                        <p className="max-w-xl text-lg text-charcoal/70 leading-relaxed">
                            Each path offers a different way to preserve your legacy.
                            A single payment for permanent memory.
                        </p>
                    </div>

                    {/* Active Plan Banner */}
                    {hasPaidPlan && auth.plan !== 'none' && (
                        <div className="bg-parchment p-6 flex items-start gap-4 border-l-4 border-sage max-w-sm">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-sage font-bold mb-1">
                                    Current Plan
                                </p>
                                <p className="text-sm text-charcoal">
                                    You have an active <strong className="capitalize">{auth.plan}</strong> plan.{' '}
                                    {auth.plan === 'personal'
                                        ? 'You can upgrade to Family to create additional archives.'
                                        : auth.plan === 'family'
                                            ? 'You can upgrade to Concierge for a fully managed experience.'
                                            : 'You are on the highest plan.'}
                                </p>
                                <button
                                    onClick={() => router.replace(`/dashboard/${auth.plan}/${userId}`)}
                                    className="mt-3 px-4 py-2 glass-btn-primary text-xs uppercase tracking-widest hover-grow"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Pricing Cards Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mb-32 gap-8">
                {/* Draft */}
                <button
                    onClick={handleDraftStart}
                    disabled={!ready}
                    className="bg-white p-8 flex flex-col border border-sand/40 hover:bg-parchment/30 transition-colors text-left disabled:opacity-50 group"
                >
                    <div className="mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-charcoal/80 to-charcoal/60 flex items-center justify-center mb-4">
                            <FileEdit size={28} className="text-ivory" />
                        </div>
                        <h3 className="font-serif text-3xl text-charcoal mb-1">Draft</h3>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40">
                            Free Start
                        </p>
                    </div>
                    <div className="mb-12">
                        <span className="font-serif text-5xl text-charcoal">$0</span>
                        <span className="text-charcoal/50 ml-2">/ forever</span>
                    </div>
                    <ul className="space-y-4 mb-16 flex-grow text-sm text-charcoal/70">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                            Full memorial builder access
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                            Save your progress anytime
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                            Preview with watermark
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                            Upgrade to Personal anytime
                        </li>
                    </ul>
                    <div className="w-full py-4 glass-btn border border-sand/30 text-charcoal text-xs uppercase tracking-widest text-center hover-grow">
                        Start for Free
                    </div>
                </button>

                {/* Personal */}
                <button
                    onClick={() => handleModeSelection('personal')}
                    disabled={!ready}
                    className="bg-parchment/50 p-8 flex flex-col border border-sand/40 hover:bg-parchment transition-colors text-left disabled:opacity-50 relative group"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-mist text-ivory px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap">
                        Most Chosen
                    </div>
                    <div className="mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-mist to-mist/80 flex items-center justify-center mb-4">
                            <User size={28} className="text-ivory" />
                        </div>
                        <h3 className="font-serif text-3xl text-charcoal mb-1">Personal</h3>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40">
                            Dedicated Archive
                        </p>
                    </div>
                    <div className="mb-12">
                        <span className="font-serif text-5xl text-charcoal">$1,470</span>
                        <span className="text-charcoal/50 ml-2">/ one time</span>
                    </div>
                    <ul className="space-y-4 mb-16 flex-grow text-sm text-charcoal/70">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                            One complete archive
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                            Structured biography & gallery
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                            Witness invitations
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                            Quarterly Ark export
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                            Successor designation
                        </li>
                    </ul>
                    <div className="w-full py-4 glass-btn-primary text-xs uppercase tracking-widest text-center hover-grow">
                        Select Plan
                    </div>
                </button>

                {/* Family */}
                <button
                    onClick={() => handleModeSelection('family')}
                    disabled={!ready}
                    className="bg-sand/20 p-8 flex flex-col border border-sand/40 hover:bg-sand/40 transition-colors text-left disabled:opacity-50 group"
                >
                    <div className="mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-stone to-stone/80 flex items-center justify-center mb-4">
                            <Users size={28} className="text-ivory" />
                        </div>
                        <h3 className="font-serif text-3xl text-charcoal mb-1">Family</h3>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40">
                            Shared Heritage
                        </p>
                    </div>
                    <div className="mb-12">
                        <span className="font-serif text-5xl text-charcoal">$2,940</span>
                        <span className="text-charcoal/50 ml-2">/ one time</span>
                    </div>
                    <ul className="space-y-4 mb-16 flex-grow text-sm text-charcoal/70">
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                            Unlimited archives
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                            Everything in Personal
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                            Archive linking & family tree
                        </li>
                        <li className="flex items-start gap-2">
                            <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                            Family steward designation
                        </li>
                    </ul>
                    <div className="w-full py-4 glass-btn-dark text-xs uppercase tracking-widest text-center hover-grow">
                        Select Plan
                    </div>
                </button>

                {/* Concierge */}
                <button
                    onClick={handleConciergeSelection}
                    className="bg-parchment p-8 flex flex-col border border-sand/40 hover:bg-sand/30 transition-colors text-left relative group"
                >
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-charcoal text-ivory px-3 py-1 text-[10px] uppercase tracking-widest whitespace-nowrap">
                        Premium
                    </div>
                    <div className="mb-12">
                        <div className="w-14 h-14 bg-gradient-to-br from-mist via-stone to-mist/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Sparkles size={28} className="text-ivory" />
                        </div>
                        <h3 className="font-serif text-3xl text-charcoal mb-1">Conciergerie</h3>
                        <p className="text-xs uppercase tracking-widest text-charcoal/40">
                            Estate Preservation
                        </p>
                    </div>
                    <div className="mb-12">
                        <span className="font-serif text-5xl text-charcoal">$6,300</span>
                        <span className="text-charcoal/50 ml-2">/ per memorial</span>
                    </div>
                    <div className="mb-16 flex-grow text-sm text-charcoal/70">
                        <p className="mb-4 italic leading-relaxed">
                            Full curation by our team. We interview, digitize, write, and structure. Delivery within 60 days.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                Everything in Family
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                Phone/video interview
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                Professional biographical writing
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                2 revision cycles included
                            </li>
                        </ul>
                    </div>
                    <div className="w-full py-4 glass-btn-primary text-xs uppercase tracking-widest text-center hover-grow">
                        Enquire Now
                    </div>
                </button>
            </section>

            {/* Comparison Table */}
            <section className="mb-32">
                <h2 className="font-serif text-4xl text-charcoal mb-12 text-center">
                    Compare Plans
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="uppercase tracking-widest text-[10px] text-charcoal/40 border-b border-sand/20">
                                <th className="py-6 px-4">Feature</th>
                                <th className="py-6 px-4">Draft</th>
                                <th className="py-6 px-4">Personal</th>
                                <th className="py-6 px-4">Family</th>
                                <th className="py-6 px-4">Concierge</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-charcoal/70">
                            {features.map((f, i) => (
                                <tr
                                    key={f.label}
                                    className={`border-b border-sand/10 ${i % 2 === 0 ? 'bg-sand/5' : ''}`}
                                >
                                    <td className="py-6 px-4 font-semibold text-charcoal">{f.label}</td>
                                    <td className="py-6 px-4">{f.draft}</td>
                                    <td className="py-6 px-4">{f.personal}</td>
                                    <td className="py-6 px-4">{f.family}</td>
                                    <td className="py-6 px-4">{f.concierge}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Satisfaction & FAQ */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div>
                    <h3 className="font-serif text-3xl text-charcoal mb-8">Our Guarantee</h3>
                    <div className="bg-parchment/50 p-10 border-t-8 border-sage relative overflow-hidden">
                        <p className="text-lg text-charcoal mb-6 italic leading-relaxed">
                            &ldquo;Independent archive export + 30-day satisfaction guarantee.
                            If you are not satisfied, contact us within 30 days of payment
                            for a full refund, as long as the archive has not been published.
                            Your draft remains accessible.&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-charcoal/80 flex items-center justify-center">
                                <Sparkles size={20} className="text-ivory" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-widest font-bold text-charcoal">
                                    Legacy Vault
                                </p>
                                <p className="text-xs text-charcoal/50">
                                    Permanent Digital Memorials
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-serif text-3xl text-charcoal mb-8">Frequently Asked</h3>
                    <div className="space-y-6">
                        {faqs.map((faq) => (
                            <FAQItem
                                key={faq.question}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bottom note */}
            <div className="mt-16 text-center">
                <p className="text-sm text-charcoal/50">
                    Not sure which to choose? <strong>Draft</strong> is free to start — you can upgrade to Personal at any time.
                    Personal and Family are self-service tools. Conciergerie is a fully managed, human-led service.
                </p>
            </div>
        </main>
    );
}
