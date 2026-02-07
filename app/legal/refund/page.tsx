import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, CreditCard, AlertCircle, Mail, FileText, DollarSign, Shield } from 'lucide-react';

export default function RefundPolicyPage() {
    const filePath = path.join(process.cwd(), 'content/legal/refund-policy.md');
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse sections for TOC
    const sections = content.split('## ').slice(1).map(section => {
        const lines = section.split('\\n');
        const title = lines[0].trim();
        return {
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50),
            title: title.replace(/\\*\\*/g, '').replace(/\\d+\\.\\d+\\s*/, '').trim()
        };
    });

    return (
        <div className="min-h-screen bg-ivory">
            {/* Header */}
            <div className="border-b border-sand/30 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-sage/10 via-ivory to-terracotta/10 border-b border-sand/30">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sage/20 text-sage rounded-full border border-sage/30 mb-6">
                        <RotateCcw size={16} />
                        <span className="text-sm font-medium">Fair & Transparent</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">
                        Refund Policy
                    </h1>
                    <p className="text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        Clear guidelines for cancellations and refunds. We balance fairness with the
                        permanent nature of memorialization services.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-charcoal/60">
                        <span className="flex items-center gap-2">
                            <DollarSign size={16} className="text-sage" />
                            30-Day Cooling Off
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield size={16} className="text-terracotta" />
                            Family Dispute Protection
                        </span>
                        <span className="flex items-center gap-2">
                            <CreditCard size={16} className="text-sage" />
                            No Chargeback Fees
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24 space-y-2">
                            <h3 className="font-serif text-lg text-charcoal mb-4">Contents</h3>
                            <nav className="space-y-1">
                                {sections.map((section, idx) => (
                                    <a
                                        key={idx}
                                        href={`#${section.id}`}
                                        className="block text-sm text-charcoal/60 hover:text-sage hover:pl-2 transition-all py-1 border-l-2 border-transparent hover:border-sage"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-8 p-4 bg-gradient-to-br from-sage/5 to-terracotta/5 rounded-xl border border-sand/30">
                                <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                                    <AlertCircle size={16} className="text-terracotta" />
                                    Request Refund
                                </h4>
                                <p className="text-xs text-charcoal/60 mb-3">
                                    Contact our refunds team for cancellations.
                                </p>
                                <a
                                    href="mailto:refunds@legacyvault.com"
                                    className="text-xs text-sage hover:text-sage/80 underline font-medium"
                                >
                                    refunds@legacyvault.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        {/* Quick Reference Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                            <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-sage/10 rounded-lg">
                                        <DollarSign className="text-sage" size={20} />
                                    </div>
                                    <h3 className="font-serif text-lg text-charcoal">Personal Plan</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-charcoal/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-sage">✓</span>
                                        Full refund before publication
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-terracotta">✗</span>
                                        No refund after publication
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-sage">30</span>
                                        Day cooling-off period
                                    </li>
                                </ul>
                            </div>

                            <div className="p-6 bg-white rounded-xl border border-sand/30 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-terracotta/10 rounded-lg">
                                        <DollarSign className="text-terracotta" size={20} />
                                    </div>
                                    <h3 className="font-serif text-lg text-charcoal">Family Plan</h3>
                                </div>
                                <ul className="space-y-2 text-sm text-charcoal/70">
                                    <li className="flex items-start gap-2">
                                        <span className="text-sage">100%</span>
                                        Before work starts
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-500">50%</span>
                                        During curation work
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-terracotta">0%</span>
                                        After publication
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <article className="prose prose-lg max-w-none">
                            <div className="space-y-8">
                                {content.split('## ').slice(1).map((section, idx) => {
                                    const lines = section.split('\\n');
                                    const title = lines[0].replace(/\\*\\*/g, '').trim();
                                    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);

                                    return (
                                        <section key={idx} id={id} className="scroll-mt-24">
                                            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4 flex items-start gap-3">
                                                <span className="text-terracotta mt-1">§</span>
                                                {title.replace(/\\d+\\.\\d+\\s*/, '').replace(/\\d+\\.\\s*/, '')}
                                            </h2>
                                            <div className="text-charcoal/80 leading-relaxed space-y-4 text-base md:text-lg">
                                                {lines.slice(1).join('\\n').split('\\n\\n').map((paragraph, pidx) => {
                                                    // Handle subheadings
                                                    if (paragraph.startsWith('### ')) {
                                                        const subheading = paragraph.replace('### ', '').replace(/\\*\\*/g, '');
                                                        return (
                                                            <h3 key={pidx} className="font-serif text-xl text-charcoal mt-6 mb-3">
                                                                {subheading}
                                                            </h3>
                                                        );
                                                    }

                                                    // Handle bullet points
                                                    if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                                                        const items = paragraph.split('\\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
                                                        return (
                                                            <ul key={pidx} className="space-y-2 my-4">
                                                                {items.map((item, iidx) => (
                                                                    <li key={iidx} className="flex items-start gap-3 text-charcoal/80">
                                                                        <span className="text-sage mt-1.5">•</span>
                                                                        <span dangerouslySetInnerHTML={{
                                                                            __html: item.replace(/^[-\\*]\\s*/, '').replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="text-charcoal">$1</strong>')
                                                                        }} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        );
                                                    }

                                                    // Regular paragraph
                                                    if (paragraph.trim()) {
                                                        return (
                                                            <p key={pidx} className="text-charcoal/80" dangerouslySetInnerHTML={{
                                                                __html: paragraph
                                                                    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong class="text-charcoal">$1</strong>')
                                                                    .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2" class="text-sage hover:underline">$1</a>')
                                                                    .replace(/^\\s*##?\\s*/, '')
                                                            }} />
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                        </section>
                                    );
                                })}
                            </div>
                        </article>

                        {/* Contact CTA */}
                        <div className="mt-16 p-8 bg-gradient-to-br from-sage/10 to-terracotta/10 rounded-2xl border border-sand/30">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <RotateCcw className="mx-auto mb-3 text-sage" size={28} />
                                    <h4 className="font-medium text-charcoal mb-1">Refund Requests</h4>
                                    <a href="mailto:refunds@legacyvault.com" className="text-sm text-sage hover:underline">
                                        refunds@legacyvault.com
                                    </a>
                                </div>
                                <div>
                                    <FileText className="mx-auto mb-3 text-terracotta" size={28} />
                                    <h4 className="font-medium text-charcoal mb-1">Family Disputes</h4>
                                    <a href="mailto:disputes@legacyvault.com" className="text-sm text-terracotta hover:underline">
                                        disputes@legacyvault.com
                                    </a>
                                </div>
                                <div>
                                    <CreditCard className="mx-auto mb-3 text-sage" size={28} />
                                    <h4 className="font-medium text-charcoal mb-1">Billing Issues</h4>
                                    <a href="mailto:billing@legacyvault.com" className="text-sm text-sage hover:underline">
                                        billing@legacyvault.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Cross-link */}
                        <div className="mt-8 text-center">
                            <p className="text-charcoal/60 text-sm">
                                Also see:{' '}
                                <Link href="/legal/terms" className="text-sage hover:underline">Terms of Service</Link>
                                {' • '}
                                <Link href="/legal/content-policy" className="text-sage hover:underline">Content Policy</Link>
                                {' • '}
                                <Link href="/legal/privacy" className="text-sage hover:underline">Privacy Policy</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
