'use client';

import { useEffect, useState } from 'react';
import { User, Users, Sparkles, ArrowRight, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ChoicePricingPage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        initUser();
    }, []);

    const initUser = async () => {
        let savedUserId = localStorage.getItem('user-id');

        // If it's a real UUID (doesn't start with 'user-'), we use it
        if (savedUserId && !savedUserId.startsWith('user-')) {
            setUserId(savedUserId);
            return;
        }

        // Otherwise (missing or mock), create a REAL database user
        console.log("Pricing: Initializing real user session...");
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([{ email: `user-pricing-${Date.now()}@legacyvault.temp` }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                localStorage.setItem('user-id', data.id);
                setUserId(data.id);
                console.log("Pricing: Real user initialized:", data.id);
            }
        } catch (err) {
            console.error("Pricing: Failed to auto-init user:", err);
            // We set it to null so the click handlers can try again
            setUserId(null);
        }
    };

    const handleModeSelection = async (mode: 'personal' | 'family') => {
        let currentUserId = userId || localStorage.getItem('user-id');

        if (!currentUserId || currentUserId.startsWith('user-')) {
            console.log("Pricing: Creating user on demand...");
            try {
                const { data, error } = await supabase
                    .from('users')
                    .insert([{ email: `user-pricing-onclick-${Date.now()}@legacyvault.temp` }])
                    .select()
                    .single();

                if (data) {
                    currentUserId = data.id;
                    localStorage.setItem('user-id', data.id);
                    setUserId(data.id);
                }
            } catch (err) {
                console.error("Pricing: Failed to create user on click:", err);
            }
        }

        if (!currentUserId) {
            alert('We are having trouble setting up your session. Please try again.');
            return;
        }

        localStorage.setItem('legacy-vault-mode', mode);

        if (mode === 'personal') {
            router.push('/personal-confirmation');
        } else if (mode === 'family') {
            router.push('/family-confirmation');
        }
    };

    const handleConciergeSelection = () => {
        // UPDATED: Point to the Request page (which is now Under Construction), NOT confirmation
        router.push('/concierge/request');
    };

    const handleFreeStart = async (mode: 'personal' | 'family') => {
        let currentUserId = userId || localStorage.getItem('user-id');

        if (!currentUserId || currentUserId.startsWith('user-')) {
            // Creation logic
            try {
                const { data } = await supabase
                    .from('users')
                    .insert([{ email: `user-free-onclick-${Date.now()}@legacyvault.temp` }])
                    .select()
                    .single();

                if (data) {
                    currentUserId = data.id;
                    localStorage.setItem('user-id', data.id);
                    setUserId(data.id);
                }
            } catch (err) {
                console.error(err);
            }
        }

        localStorage.setItem('legacy-vault-mode', mode);
        // REDIRECT TO /create to start the ritual immediately, 
        // /create is smart and will handle the user session there too.
        router.push(`/dashboard/${mode}/${currentUserId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full">
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

                <div className="text-center mb-12">
                    <h1 className="font-serif text-5xl text-charcoal mb-4">
                        Choose Your Experience
                    </h1>
                    <p className="text-lg text-charcoal/70">
                        Each path offers a different way to preserve your legacy
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Personal Mode */}
                    <button
                        onClick={() => handleModeSelection('personal')}
                        disabled={!userId}
                        className="p-8 rounded-2xl border-2 border-sand/40 bg-white hover:border-sage/40 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-sage to-sage/80 rounded-2xl flex items-center justify-center mb-6">
                            <User size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Personal</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-sage">$1,500</span>
                                <span className="text-sm text-charcoal/60">one time</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-6">Create one memorial yourself</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>One complete memorial</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>Full multimedia support</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>Interactive photo stories</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>Lifetime hosting</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-sage font-medium group-hover:gap-3 transition-all">
                            Choose Personal <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Family Mode */}
                    <button
                        onClick={() => handleModeSelection('family')}
                        disabled={!userId}
                        className="p-8 rounded-2xl border-2 border-sand/40 bg-white hover:border-terracotta/40 hover:shadow-lg transition-all text-left disabled:opacity-50 group"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-terracotta to-terracotta/80 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Family</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-terracotta">$3,000</span>
                                <span className="text-sm text-charcoal/60">one time</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-6">Create unlimited memorials</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-terracotta mt-0.5 flex-shrink-0" />
                                <span>Unlimited memorials</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-terracotta mt-0.5 flex-shrink-0" />
                                <span>All Personal features</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-terracotta mt-0.5 flex-shrink-0" />
                                <span>Family tree integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-terracotta mt-0.5 flex-shrink-0" />
                                <span>Priority support</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-terracotta font-medium group-hover:gap-3 transition-all">
                            Choose Family <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Concierge Mode */}
                    <button
                        onClick={handleConciergeSelection}
                        className="p-8 rounded-2xl border-2 border-sage/40 bg-gradient-to-br from-sage/5 to-terracotta/5 hover:border-sage/60 hover:shadow-xl transition-all text-left relative overflow-hidden group"
                    >
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-sage/20 text-sage text-xs font-semibold rounded-full border border-sage/30">
                            Premium
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-sage via-terracotta to-sage/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Conciergerie</h2>

                        {/* Price */}
                        <div className="mb-4">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-sage">$6,500</span>
                                <span className="text-sm text-charcoal/60">per memorial</span>
                            </div>
                        </div>

                        <p className="text-charcoal/70 mb-6">We create everything for you</p>

                        {/* Features */}
                        <ul className="space-y-2 mb-6 text-sm text-charcoal/70">
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>Personal dedicated service</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>We handle everything</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>You just share materials</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check size={16} className="text-sage mt-0.5 flex-shrink-0" />
                                <span>White-glove service</span>
                            </li>
                        </ul>

                        <div className="inline-flex items-center gap-2 text-sage font-medium group-hover:gap-3 transition-all">
                            Request First Call <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                {/* Comparison note and Free Draft option */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-charcoal/50 mb-8">
                        Not sure which to choose? Personal and Family are self-service tools. Conciergerie is a fully managed, human-led service.
                    </p>

                    <div className="mt-12 pt-12 border-t border-sand/20">
                        <p className="text-charcoal/60 mb-4 text-sm font-serif italic">
                            "The memory belongs to you before it belongs to the world."
                        </p>
                        <button
                            onClick={() => handleFreeStart('personal')}
                            className="px-8 py-3 border border-sand/40 rounded-xl text-charcoal/60 hover:text-charcoal hover:border-sage transition-all text-sm font-medium"
                        >
                            Begin your draft for free
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}