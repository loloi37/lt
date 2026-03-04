'use client';

import { useEffect, useState } from 'react';
import { FileEdit, User, Users, Sparkles, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';

export default function ChoicePricingPage() {
    const router = useRouter();
    const auth = useAuth();
    const userId = auth.user?.id || null;
    const ready = !auth.loading;

    // If user already has a paid plan, show a banner and redirect options
    const hasPaidPlan = auth.hasPaid;

    // Redirect to signup/login if not authenticated, with ?next to come back
    const requireAuth = (nextPath: string): boolean => {
        if (userId) return true;
        router.push(`/signup?next=${encodeURIComponent(nextPath)}`);
        return false;
    };

    // Draft: free start → dashboard/draft
    const handleDraftStart = () => {
        if (!requireAuth('/choice-pricing')) return;
        router.push(`/dashboard/draft/${userId}`);
    };

    // Personal or Family: paid → confirmation page
    const handleModeSelection = (mode: 'personal' | 'family') => {
        // If user already has a paid plan at or above this level, redirect to dashboard
        if (hasPaidPlan && auth.plan === mode) {
            router.push(`/dashboard/${mode}/${userId}`);
            return;
        }
        const confirmPath = mode === 'personal' ? '/personal-confirmation' : '/family-confirmation';
        if (!requireAuth(confirmPath)) return;
        router.push(confirmPath);
    };

    const handleConciergeSelection = () => {
        router.push('/concierge/request');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10 flex items-center justify-center p-6">
            <div className="max-w-7xl w-full">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </Link>
                </div>

                {/* Active plan banner — reminds user of their current state */}
                {hasPaidPlan && auth.plan !== 'none' && (
                    <div className="mb-8 bg-white border border-sage/30 rounded-xl p-5 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-charcoal">
                                You have an active <strong className="capitalize">{auth.plan}</strong> plan
                            </p>
                            <p className="text-xs text-charcoal/50 mt-0.5">
                                {auth.plan === 'personal'
                                    ? 'You can upgrade to Family to create additional archives.'
                                    : auth.plan === 'family'
                                        ? 'You can upgrade to Concierge for a fully managed experience.'
                                        : 'You are on the highest plan.'}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(`/dashboard/${auth.plan}/${userId}`)}
                            className="px-4 py-2 bg-charcoal text-ivory text-sm rounded-lg font-medium hover:bg-charcoal/90 transition-colors"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}

                <div className="text-center mb-12">
                    <h1 className="font-serif text-5xl text-charcoal mb-4">
                        Choose Your Experience
                    </h1>
                    <p className="text-lg text-charcoal/70">
                        Each path offers a different way to preserve your legacy
                    </p>
                </div>

                {/* Cards Grid — 4 cards: Draft | Personal | Family | Concierge */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Draft — free, independent plan */}
                    <button
                        onClick={handleDraftStart}
                        disabled={!ready}
                        className="btn-paper p-8 rounded-xl border-2 border-sand/40 bg-white hover:border-charcoal/30 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-charcoal/80 to-charcoal/60 rounded-2xl flex items-center justify-center mb-6">
                            <FileEdit size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Draft</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-charcoal/70">Free</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-6">Build your memorial at your own pace</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                                <span>Full memorial builder access</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                                <span>Save your progress anytime</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                                <span>Preview with watermark</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-charcoal/50 mt-0.5 flex-shrink-0" />
                                <span>Upgrade to Personal anytime</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-charcoal/60 font-medium group-hover:gap-3 transition-all">
                            Start for Free <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Personal */}
                    <button
                        onClick={() => handleModeSelection('personal')}
                        disabled={!ready}
                        className="btn-paper p-8 rounded-xl border-2 border-sand/40 bg-white hover:border-sage/40 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-mist to-mist/80 rounded-2xl flex items-center justify-center mb-6">
                            <User size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Personal</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-mist">$1,470</span>
                                <span className="text-sm text-charcoal/60">one time</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-1">A single payment for a permanent archive.</p>
                        <p className="text-xs text-charcoal/40 mb-6">No monthly fees. No renewals. No surprises.</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>One complete archive</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Structured biography & gallery</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Witness invitations</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Quarterly Ark export</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Successor designation</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-mist font-medium group-hover:gap-3 transition-all">
                            Choose Personal <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Family */}
                    <button
                        onClick={() => handleModeSelection('family')}
                        disabled={!ready}
                        className="btn-paper p-8 rounded-xl border-2 border-sand/40 bg-white hover:border-terracotta/40 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-stone to-stone/80 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Family</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-stone">$2,940</span>
                                <span className="text-sm text-charcoal/60">one time</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-1">Multiple archives with family links.</p>
                        <p className="text-xs text-charcoal/40 mb-6">Exactly 2 x Personal. No surprises.</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                                <span>Unlimited archives</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                                <span>Everything in Personal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                                <span>Archive linking & family tree</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-stone mt-0.5 flex-shrink-0" />
                                <span>Family steward designation</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-stone font-medium group-hover:gap-3 transition-all">
                            Choose Family <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Concierge */}
                    <button
                        onClick={handleConciergeSelection}
                        className="btn-paper p-8 rounded-xl border-2 border-sage/40 bg-gradient-to-br from-sage/5 to-terracotta/5 hover:border-sage/60 hover:shadow-xl transition-all text-left relative overflow-hidden group"
                    >
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-mist/20 text-mist text-xs font-semibold rounded-full border border-mist/30">
                            Premium
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-mist via-stone to-mist/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Conciergerie</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-mist">$6,300</span>
                                <span className="text-sm text-charcoal/60">per memorial</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-1">Full curation by our team. Delivery within 60 days.</p>
                        <p className="text-xs text-charcoal/40 mb-6">We interview, digitize, write, and structure.</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Everything in Family</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Phone/video interview</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>Professional biographical writing</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-mist mt-0.5 flex-shrink-0" />
                                <span>2 revision cycles included</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-mist font-medium group-hover:gap-3 transition-all">
                            Request First Call <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                {/* Feature Comparison Table */}
                <div className="mt-16 max-w-4xl mx-auto">
                    <h2 className="font-serif text-2xl text-charcoal text-center mb-8">Compare Plans</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-sand/30">
                                    <th className="text-left py-3 px-4 text-charcoal/50 font-medium">Feature</th>
                                    <th className="text-center py-3 px-4 text-mist font-semibold">Personal</th>
                                    <th className="text-center py-3 px-4 text-stone font-semibold">Family</th>
                                    <th className="text-center py-3 px-4 text-mist font-semibold">Concierge</th>
                                </tr>
                            </thead>
                            <tbody className="text-charcoal/70">
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Number of archives</td><td className="text-center py-3 px-4">1</td><td className="text-center py-3 px-4">Unlimited</td><td className="text-center py-3 px-4">Unlimited</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Structured biography</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Photo & video gallery</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Witness invitations</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Quarterly Ark export</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Successor designation</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Archive linking</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Visual family tree</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Family steward</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Professional interview</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Document digitization</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15 bg-sand/5"><td className="py-3 px-4 font-medium">Biographical writing</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-charcoal/20">&mdash;</td><td className="text-center py-3 px-4 text-sage">&#10003;</td></tr>
                                <tr className="border-b border-sand/15"><td className="py-3 px-4 font-medium">Physical certificate</td><td className="text-center py-3 px-4 text-charcoal/50 text-xs">Optional</td><td className="text-center py-3 px-4 text-charcoal/50 text-xs">Optional</td><td className="text-center py-3 px-4 text-sage font-medium">Included</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Satisfaction Guarantee */}
                <div className="mt-12 max-w-3xl mx-auto text-center">
                    <div className="bg-white border border-sand/30 rounded-2xl p-8">
                        <h3 className="font-serif text-xl text-charcoal mb-3">All plans include</h3>
                        <p className="text-charcoal/70 mb-4">
                            Independent archive export + 30-day satisfaction guarantee.
                        </p>
                        <p className="text-sm text-charcoal/50 leading-relaxed">
                            If you are not satisfied, contact us within 30 days of payment for a full refund, as long as the archive has not been published. Your draft remains accessible.
                        </p>
                    </div>
                </div>

                {/* Pricing FAQ */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <h2 className="font-serif text-2xl text-charcoal text-center mb-10">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="border-b border-sand/20 pb-6">
                            <h4 className="font-semibold text-charcoal mb-2">Why a one-time payment instead of a subscription?</h4>
                            <p className="text-sm text-charcoal/60 leading-relaxed">Because subscriptions can be forgotten, canceled, or interrupted. Memory should not depend on a monthly charge.</p>
                        </div>
                        <div className="border-b border-sand/20 pb-6">
                            <h4 className="font-semibold text-charcoal mb-2">Does the price include storage?</h4>
                            <p className="text-sm text-charcoal/60 leading-relaxed">Yes. Unlimited storage for the lifetime of the archive. No additional fees.</p>
                        </div>
                        <div className="border-b border-sand/20 pb-6">
                            <h4 className="font-semibold text-charcoal mb-2">What happens if Legacy Vault shuts down?</h4>
                            <p className="text-sm text-charcoal/60 leading-relaxed">Your data is exportable at any time. In addition, an escrow arrangement guarantees continuity. <a href="/legal/durability" className="text-charcoal underline">Learn more about our durability</a>.</p>
                        </div>
                        <div className="border-b border-sand/20 pb-6">
                            <h4 className="font-semibold text-charcoal mb-2">Can I upgrade from Personal to Family later?</h4>
                            <p className="text-sm text-charcoal/60 leading-relaxed">Yes. You only pay the difference ($1,470). Your existing archive is automatically integrated.</p>
                        </div>
                        <div className="pb-6">
                            <h4 className="font-semibold text-charcoal mb-2">Are there hidden fees?</h4>
                            <p className="text-sm text-charcoal/60 leading-relaxed">No. The displayed price is final. No storage fees. No annual fees. No export fees.</p>
                        </div>
                    </div>
                </div>

                {/* Comparison note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-charcoal/50">
                        Not sure which to choose? <strong>Draft</strong> is free to start — you can upgrade to Personal at any time. Personal and Family are self-service tools. Conciergerie is a fully managed, human-led service.
                    </p>
                </div>
            </div>
        </div>
    );
}
