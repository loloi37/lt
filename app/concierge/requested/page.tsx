'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Mail, ArrowRight, FileText, Calendar } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function RequestedContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get('id');
    const [contactPreference, setContactPreference] = useState<'email' | 'call'>('email');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (projectId) {
            // Store projectId in localStorage for later access
            localStorage.setItem('concierge-project-id', projectId);

            // Fetch the project to get contact preference
            const fetchProject = async () => {
                const { data, error } = await supabase
                    .from('concierge_projects')
                    .select('contact_preference')
                    .eq('id', projectId)
                    .single();

                if (data) {
                    setContactPreference(data.contact_preference || 'email');
                }
                setLoading(false);
            };

            fetchProject();
        } else {
            // If no ID, redirect back
            router.push('/concierge/request');
        }
    }, [projectId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-mist/5 via-ivory to-stone/5 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/5 via-ivory to-stone/5 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Success Icon */}
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-mist to-mist/80 rounded-full flex items-center justify-center shadow-xl">
                            <Check size={48} className="text-ivory" strokeWidth={3} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-stone rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-ivory text-xl">✓</span>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl border border-sand/30 shadow-lg p-8 md:p-12 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                        Request Received
                    </h1>
                    <p className="text-lg text-charcoal/70 mb-8 leading-relaxed">
                        Thank you for entrusting us with this important work. We've received your request and will respond within 24 hours.
                    </p>

                    {/* What happens next - Different based on preference */}
                    <div className="text-left bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl p-6 mb-8">
                        <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
                            {contactPreference === 'email' ? (
                                <>
                                    <Mail size={20} className="text-mist" />
                                    What happens next
                                </>
                            ) : (
                                <>
                                    <Calendar size={20} className="text-mist" />
                                    What happens next
                                </>
                            )}
                        </h2>

                        {contactPreference === 'email' ? (
                            <div className="space-y-3 text-sm text-charcoal/70">
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">1.</span>
                                    <span>We'll send you a personalized email within 24 hours with a detailed plan based on your request</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">2.</span>
                                    <span>You'll receive a link to your personal space where you can upload materials at your own pace</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">3.</span>
                                    <span>We'll guide you step by step via email — you respond when convenient</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">4.</span>
                                    <span>We'll keep you updated as we build the archive, showing you progress along the way</span>
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm text-charcoal/70">
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">1.</span>
                                    <span>We'll email you within 24 hours to schedule a convenient time for our conversation</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">2.</span>
                                    <span>During the call, we'll discuss your needs, materials, and answer all your questions</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">3.</span>
                                    <span>After our conversation, you'll receive access to your personal space for uploading materials</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="text-mist mt-1 flex-shrink-0">4.</span>
                                    <span>We'll handle everything from there, keeping you informed at each step</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Your Space Access */}
                    <div className="bg-mist/5 border border-mist/20 rounded-xl p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <FileText size={20} className="text-mist mt-0.5 flex-shrink-0" />
                            <div className="text-left flex-1">
                                <h3 className="font-semibold text-charcoal mb-2">Your Personal Space</h3>
                                <p className="text-sm text-charcoal/70 mb-3">
                                    We've created a dedicated space for you. You can access it now or wait for our guidance.
                                </p>
                                <Link
                                    href={`/concierge/${projectId}`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-mist hover:bg-mist/90 text-ivory rounded-lg text-sm font-medium transition-all"
                                >
                                    Visit Your Space
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Check email reminder */}
                    <div className="flex items-center justify-center gap-2 text-sm text-charcoal/60 mb-8">
                        <Mail size={16} />
                        <span>Please check your email inbox (and spam folder)</span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/choice-pricing"
                            className="flex-1 py-3 border-2 border-sand/40 hover:bg-sand/10 text-charcoal rounded-xl font-medium transition-all text-center"
                        >
                            Back to Home
                        </Link>

                        <a
                            href="mailto:contact@legacyvault.com"
                            className="flex-1 py-3 bg-mist hover:bg-mist/90 text-ivory rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                        >
                            Contact Us Directly
                            <ArrowRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-8 space-y-3">
                    <p className="text-center text-sm text-charcoal/50">
                        Your request ID: <span className="font-mono text-charcoal/70">{projectId?.slice(0, 8)}</span>
                    </p>
                    <p className="text-center text-xs text-charcoal/40 max-w-lg mx-auto leading-relaxed">
                        We treat every archive with the utmost care and discretion. Your materials and information are secure and private.
                    </p>
                </div>
            </div>
        </div >
    );
}

export default function RequestedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-ivory flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-mist/30 border-t-mist rounded-full animate-spin" />
            </div>
        }>
            <RequestedContent />
        </Suspense>
    );
}