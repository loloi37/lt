'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Hammer, Mail } from 'lucide-react';

export default function ConciergeRequestPage() {
    const [email, setEmail] = useState('');
    const [notified, setNotified] = useState(false);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save to a DB, but for now we just show success
        setNotified(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10">

            {/* Header */}
            <div className="border-b border-sand/30 bg-white/80 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/choice"
                        className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to options</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-6 py-20 text-center">

                {/* Icon */}
                <div className="w-24 h-24 bg-gradient-to-br from-sage to-terracotta rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-sage/20">
                    <Sparkles size={40} className="text-ivory" />
                </div>

                <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">
                    Concierge Service
                </h1>

                <div className="bg-white p-8 rounded-2xl border border-sand/30 shadow-sm mb-8">
                    <div className="flex items-center justify-center gap-2 text-terracotta font-medium mb-4">
                        <Hammer size={20} />
                        <span>Currently Under Construction</span>
                    </div>

                    <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
                        We are currently upgrading our white-glove Concierge experience to better serve families.
                        Due to high demand and these improvements, we are not accepting new Concierge projects at this moment.
                    </p>

                    <p className="text-sm text-charcoal/60 bg-sand/10 p-4 rounded-xl">
                        <strong>Note:</strong> You can still create a <strong>Personal</strong> or <strong>Family</strong> archive immediately using our self-service tools. They include all the same digital preservation features.
                    </p>
                </div>

                {/* Waitlist Form */}
                {!notified ? (
                    <form onSubmit={handleNotify} className="max-w-md mx-auto">
                        <label className="block text-sm font-medium text-charcoal/60 mb-2">
                            Notify me when Concierge re-opens
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-sand/40 focus:outline-none focus:ring-2 focus:ring-sage/30 bg-white"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-charcoal text-ivory rounded-xl font-medium hover:bg-charcoal/90 transition-all"
                            >
                                Notify Me
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-sage/10 text-sage border border-sage/20 p-4 rounded-xl inline-flex items-center gap-2 animate-fadeIn">
                        <Mail size={18} />
                        <span>Thank you! We've added you to the priority list.</span>
                    </div>
                )}

                <div className="mt-12">
                    <Link
                        href="/choice"
                        className="text-sage hover:text-sage/80 font-medium underline underline-offset-4"
                    >
                        Create a Personal Memorial instead &rarr;
                    </Link>
                </div>

            </div>
        </div>
    );
}