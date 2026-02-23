// app/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Share2, Mail, Copy, Eye, Home, Sparkles } from 'lucide-react';

export default function SuccessPage() {
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    // Simulated memorial URL (in real app, this would come from database)
    const memorialUrl = 'https://legacyvault.com/memorial/eleanor-thompson';

    useEffect(() => {
        // Hide confetti after animation
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(memorialUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent('Memorial for [Name]');
        const body = encodeURIComponent(`I've created a memorial page. View it here: ${memorialUrl}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-mist/10 via-ivory to-stone/10 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Confetti Effect */}
            {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-fall"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-${Math.random() * 20}%`,
                                animationDelay: `${Math.random() * 2}s`,
                                animationDuration: `${2 + Math.random() * 3}s`,
                            }}
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: ['#89b896', '#d4958a', '#b5a7c7', '#f0c4c8', '#f0c4a8'][Math.floor(Math.random() * 5)],
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content */}
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative z-10">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-mist to-mist/80 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircle size={48} className="text-ivory" strokeWidth={2.5} />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-stone rounded-full flex items-center justify-center animate-bounce">
                            <Sparkles size={16} className="text-ivory" />
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-3">
                        Memorial Published! 🎉
                    </h1>
                    <p className="text-lg text-charcoal/70">
                        Your beautiful memorial is now live and ready to share with the world.
                    </p>
                </div>

                {/* Memorial URL Card */}
                <div className="mb-8 p-6 bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl border-2 border-sand/30">
                    <label className="block text-sm font-medium text-charcoal/70 mb-2">
                        Memorial Page URL
                    </label>
                    <div className="flex gap-2">
                        <div className="flex-1 px-4 py-3 bg-white border border-sand/40 rounded-lg text-sm text-charcoal break-all">
                            {memorialUrl}
                        </div>
                        <button
                            onClick={copyToClipboard}
<<<<<<< HEAD
                            className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${copied
                                    ? 'bg-mist text-ivory'
=======
                            className={`btn-paper px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${copied
                                    ? 'bg-sage text-ivory'
>>>>>>> origin/claude/pastel-color-palette-avZIb
                                    : 'bg-white border border-sand/40 text-charcoal hover:bg-sand/10'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <CheckCircle size={18} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Copy
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 mb-8">
                    <Link
                        href={memorialUrl}
<<<<<<< HEAD
                        className="w-full py-4 bg-gradient-to-r from-mist to-mist/90 hover:shadow-lg text-ivory rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
=======
                        className="btn-paper w-full py-4 bg-gradient-to-r from-sage to-sage/90 hover:shadow-lg text-ivory rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    >
                        <Eye size={20} />
                        View Memorial Page
                    </Link>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={shareViaEmail}
<<<<<<< HEAD
                            className="py-3 bg-white border-2 border-sand/40 hover:border-mist hover:bg-mist/5 text-charcoal rounded-xl font-medium transition-all flex items-center justify-center gap-2"
=======
                            className="btn-paper py-3 bg-white border-2 border-sand/40 hover:border-sage hover:bg-sage/5 text-charcoal rounded-lg font-medium transition-all flex items-center justify-center gap-2"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                        >
                            <Mail size={18} />
                            Share via Email
                        </button>

                        <button
                            onClick={copyToClipboard}
<<<<<<< HEAD
                            className="py-3 bg-white border-2 border-sand/40 hover:border-stone hover:bg-stone/5 text-charcoal rounded-xl font-medium transition-all flex items-center justify-center gap-2"
=======
                            className="btn-paper py-3 bg-white border-2 border-sand/40 hover:border-terracotta hover:bg-terracotta/5 text-charcoal rounded-lg font-medium transition-all flex items-center justify-center gap-2"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                        >
                            <Share2 size={18} />
                            Share Link
                        </button>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-4 mb-8">
                    <div className="p-4 bg-mist/10 border border-mist/30 rounded-xl">
                        <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                            <CheckCircle size={18} className="text-mist" />
                            What happens next?
                        </h3>
                        <ul className="text-sm text-charcoal/70 space-y-1.5 ml-6">
                            <li>• Your memorial is now publicly accessible</li>
                            <li>• You can edit it anytime from your dashboard</li>
                            <li>• Share the link with family and friends</li>
                            <li>• Visitors can leave their own memories</li>
                        </ul>
                    </div>

                    <div className="p-4 bg-stone/10 border border-stone/30 rounded-xl">
                        <h3 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                            <Sparkles size={18} className="text-stone" />
                            Want to enhance your memorial?
                        </h3>
                        <ul className="text-sm text-charcoal/70 space-y-1.5 ml-6">
                            <li>• Add more photos and stories over time</li>
                            <li>• Invite others to contribute memories</li>
                            <li>• Customize the design and layout</li>
                            <li>• Download a PDF version for printing</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                        href="/"
                        className="btn-paper flex-1 py-3 border-2 border-sand/40 hover:bg-sand/10 text-charcoal rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    <Link
                        href="/create"
<<<<<<< HEAD
                        className="flex-1 py-3 bg-stone/10 border-2 border-stone/30 hover:bg-stone/20 text-stone rounded-xl font-medium transition-all flex items-center justify-center gap-2"
=======
                        className="btn-paper flex-1 py-3 bg-terracotta/10 border-2 border-terracotta/30 hover:bg-terracotta/20 text-terracotta rounded-lg font-medium transition-all flex items-center justify-center gap-2"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                    >
                        <Sparkles size={18} />
                        Create Another
                    </Link>
                </div>
            </div>

            {/* Custom animation for confetti */}
            <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
        </div>
    );
}