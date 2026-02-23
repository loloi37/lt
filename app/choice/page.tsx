'use client';
import { useState, useEffect } from 'react';
import { User, Users, Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ChoicePage() {
    const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        initUser();
    }, []);

    const initUser = async () => {
        let savedUserId = localStorage.getItem('user-id');
        if (!savedUserId) {
            const { data, error } = await supabase
                .from('users')
                .insert([{ email: `user-${Date.now()}@legacyvault.temp` }])
                .select()
                .single();

            if (data) {
                savedUserId = data.id;
                localStorage.setItem('user-id', data.id);
            }
        }
        setUserId(savedUserId);
    };

    const handleModeSelection = (mode: 'personal' | 'family') => {
        if (!userId) {
            alert('Setting up your account...');
            return;
        }
        localStorage.setItem('legacy-vault-mode', mode);
        router.push(`/dashboard/${mode}/${userId}`);
    };

    const handleConciergeSelection = () => {
        // Go directly to request page - no userId needed yet
        router.push('/concierge/request');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10 flex items-center justify-center p-6">
            <div className="max-w-6xl w-full">
                <div className="text-center mb-12">
                    <h1 className="font-serif text-5xl text-charcoal mb-4">Choose Your Experience</h1>
                    <p className="text-lg text-charcoal/70">Each path offers a different way to preserve your legacy</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Personal Mode */}
                    <button
                        onClick={() => handleModeSelection('personal')}
                        disabled={!userId}
<<<<<<< HEAD
                        className="p-8 rounded-2xl border-2 border-sand/40 bg-white hover:border-mist/40 hover:shadow-lg transition-all text-left disabled:opacity-50"
=======
                        className="btn-paper p-8 rounded-xl border-2 border-sand/40 bg-white hover:border-sage/40 hover:shadow-lg transition-all text-left disabled:opacity-50"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-mist to-mist/80 rounded-2xl flex items-center justify-center mb-6">
                            <User size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Personal</h2>
                        <p className="text-charcoal/70 mb-6">Create one memorial yourself</p>
                        <div className="inline-flex items-center gap-2 text-mist font-medium">
                            Choose Personal <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Family Mode */}
                    <button
                        onClick={() => handleModeSelection('family')}
                        disabled={!userId}
<<<<<<< HEAD
                        className="p-8 rounded-2xl border-2 border-sand/40 bg-white hover:border-stone/40 hover:shadow-lg transition-all text-left disabled:opacity-50"
=======
                        className="btn-paper p-8 rounded-xl border-2 border-sand/40 bg-white hover:border-terracotta/40 hover:shadow-lg transition-all text-left disabled:opacity-50"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-stone to-stone/80 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={32} className="text-ivory" />
                        </div>
                        <h2 className="font-serif text-3xl text-charcoal mb-3">Family</h2>
                        <p className="text-charcoal/70 mb-6">Create unlimited memorials</p>
                        <div className="inline-flex items-center gap-2 text-stone font-medium">
                            Choose Family <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* NEW: Concierge Mode */}
                    <button
                        onClick={handleConciergeSelection}
<<<<<<< HEAD
                        className="p-8 rounded-2xl border-2 border-mist/40 bg-gradient-to-br from-mist/5 to-stone/5 hover:border-mist/60 hover:shadow-xl transition-all text-left relative overflow-hidden group"
=======
                        className="btn-paper p-8 rounded-xl border-2 border-sage/40 bg-gradient-to-br from-sage/5 to-terracotta/5 hover:border-sage/60 hover:shadow-xl transition-all text-left relative overflow-hidden group"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    >
                        {/* Premium badge */}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-mist/20 text-mist text-xs font-semibold rounded-full border border-mist/30">
                            Premium
                        </div>

                        <div className="w-16 h-16 bg-gradient-to-br from-mist via-stone to-mist/80 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles size={32} className="text-ivory" />
                        </div>

                        <h2 className="font-serif text-3xl text-charcoal mb-3">Conciergerie</h2>
                        <p className="text-charcoal/70 mb-6">We create everything for you</p>

                        <div className="space-y-2 mb-6 text-sm text-charcoal/60">
                            <p className="flex items-start gap-2">
                                <span className="text-mist mt-0.5">✓</span>
                                <span>Personal dedicated service</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-mist mt-0.5">✓</span>
                                <span>We handle everything</span>
                            </p>
                            <p className="flex items-start gap-2">
                                <span className="text-mist mt-0.5">✓</span>
                                <span>You just share materials</span>
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 text-mist font-medium group-hover:gap-3 transition-all">
                            Request First Call <ArrowRight size={18} />
                        </div>
                    </button>
                </div>

                {/* Comparison note */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-charcoal/50">
                        Not sure which to choose? Personal and Family are self-service tools. Conciergerie is a fully managed, human-led service.
                    </p>
                </div>
            </div>
        </div>
    );
}