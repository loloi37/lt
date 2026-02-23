import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Clock, Mail } from 'lucide-react';

export default function PrivacyPage() {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content/legal/privacy.md');
    const content = fs.readFileSync(filePath, 'utf8');

    // Parse the markdown content to extract sections for the TOC
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
            <div className="bg-gradient-to-br from-mist/10 via-ivory to-stone/10 border-b border-sand/30">
                <div className="max-w-4xl mx-auto px-6 py-16 text-center">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-sage/20 text-sage rounded-full border border-sage/30 mb-6">
                        <Shield size={16} />
                        <span className="text-sm font-medium">Your Data is Sacred</span>
                    </div>
                    <h1 className="font-serif text-5xl md:text-6xl text-charcoal mb-4">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        We treat your memorial data with the same care and reverence that you would give to a family archive.
                        Transparency and trust are the foundation of our service.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-charcoal/60">
                        <span className="flex items-center gap-2">
                            <Clock size={16} className="text-sage" />
                            Updated Feb 2026
                        </span>
                        <span className="flex items-center gap-2">
                            <FileText size={16} className="text-stone" />
                            GDPR & CCPA Compliant
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents - Sticky Sidebar */}
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

                            <div className="mt-8 p-4 bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl border border-sand/30">
                                <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                                    <Mail size={16} className="text-sage" />
                                    Questions?
                                </h4>
                                <p className="text-xs text-charcoal/60 mb-3">
                                    Contact our Data Protection Officer for privacy-specific inquiries.
                                </p>
                                <a
                                    href="mailto:privacy@legacyvault.com"
                                    className="text-xs text-sage hover:text-sage/80 underline"
                                >
                                    privacy@legacyvault.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed prose-a:text-mist hover:prose-a:text-mist/80 prose-strong:text-charcoal">
                            {/* Process the content manually for better styling */}
                            <div className="space-y-8">
                                {content.split('## ').slice(1).map((section, idx) => {
                                    const lines = section.split('\\n');
                                    const title = lines[0].replace(/\\*\\*/g, '').trim();
                                    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);

                                    return (
                                        <section key={idx} id={id} className="scroll-mt-24">
                                            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4 flex items-start gap-3">
                                                <span className="text-stone mt-1">§</span>
                                                {title.replace(/\\d+\\.\\d+\\s*/, '').replace(/\\d+\\.\\s*/, '')}
                                            </h2>
                                            <div className="text-charcoal/80 leading-relaxed space-y-4 text-base md:text-lg">
                                                {lines.slice(1).join('\\n').split('\\n\\n').map((paragraph, pidx) => {
                                                    // Handle tables
                                                    if (paragraph.includes('|')) {
                                                        const rows = paragraph.split('\\n').filter(row => row.trim().startsWith('|'));
                                                        if (rows.length > 2) {
                                                            return (
                                                                <div key={pidx} className="my-6 overflow-x-auto">
                                                                    <table className="w-full text-sm border-collapse">
                                                                        <thead>
                                                                            <tr className="border-b-2 border-mist/30">
                                                                                {rows[0].split('|').filter(Boolean).map((cell, cidx) => (
                                                                                    <th key={cidx} className="text-left py-2 px-4 font-semibold text-charcoal bg-mist/5">
                                                                                        {cell.trim().replace(/\\*\\*/g, '')}
                                                                                    </th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rows.slice(2).map((row, ridx) => (
                                                                                <tr key={ridx} className="border-b border-sand/30 hover:bg-mist/5">
                                                                                    {row.split('|').filter(Boolean).map((cell, cidx) => (
                                                                                        <td key={cidx} className="py-2 px-4 text-charcoal/70">
                                                                                            {cell.trim().replace(/\\*\\*/g, '')}
                                                                                        </td>
                                                                                    ))}
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            );
                                                        }
                                                    }

                                                    // Handle bullet points
                                                    if (paragraph.trim().startsWith('-') || paragraph.trim().startsWith('*')) {
                                                        const items = paragraph.split('\\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
                                                        return (
                                                            <ul key={pidx} className="space-y-2 my-4">
                                                                {items.map((item, iidx) => (
                                                                    <li key={iidx} className="flex items-start gap-3 text-charcoal/80">
                                                                        <span className="text-mist mt-1.5">•</span>
                                                                        <span dangerouslySetInnerHTML={{
                                                                            __html: item.replace(/^[-\\*]\\s*/, '').replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
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
                                                                    .replace(/\\[(.+?)\\]\\((.+?)\\)/g, '<a href="$2" class="text-mist hover:underline">$1</a>')
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
                        <div className="mt-16 p-8 bg-gradient-to-br from-mist/10 to-stone/10 rounded-2xl border border-sand/30 text-center">
                            <Lock className="mx-auto mb-4 text-mist" size={32} />
                            <h3 className="font-serif text-2xl text-charcoal mb-3">Your Privacy Matters</h3>
                            <p className="text-charcoal/70 mb-6 max-w-md mx-auto">
                                If you have any questions about how we handle your data or wish to exercise your privacy rights,
                                our team is here to help.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:privacy@legacyvault.com"
                                    className="btn-paper inline-flex items-center justify-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-medium transition-all"
                                >
                                    <Mail size={18} />
                                    Contact DPO
                                </a>
                                <Link
                                    href="/legal/terms"
                                    className="btn-paper inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-sand/40 hover:border-sage text-charcoal rounded-lg font-medium transition-all"
                                >
                                    <FileText size={18} />
                                    View Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}