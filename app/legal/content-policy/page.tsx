import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, FileText, Clock, Mail, Heart, AlertTriangle } from 'lucide-react';

export default function ContentPolicyPage() {
    // Read the markdown file
    const filePath = path.join(process.cwd(), 'content/legal/content-policy.md');
    let content = '';

    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        console.error('Error reading content policy file:', e);
        content = '# Content Policy\n\nContent not found.';
    }

    // Parse the markdown content to extract sections for the TOC
    // We filter for H2 headers (##)
    const sections = content.split('\n').filter(line => line.startsWith('## ')).map(line => {
        const title = line.replace('## ', '').trim();
        return {
            id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50),
            title: title.replace(/\*\*/g, '').replace(/^\d+\.\s*/, '').trim()
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
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-mist/20 text-mist rounded-full border border-mist/30 mb-6">
                        <Heart size={16} />
                        <span className="text-sm font-medium">Community Standards</span>
                    </div>
                    <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
                        Content Policy
                    </h1>
                    <p className="text-lg text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
                        Ensuring our platform remains a dignified and safe space for memorialization and remembrance.
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-6 text-sm text-charcoal/60">
                        <span className="flex items-center gap-2">
                            <Clock size={16} className="text-mist" />
                            Updated Feb 2026
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield size={16} className="text-stone" />
                            Safety Focused
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
                                        className="block text-sm text-charcoal/60 hover:text-mist hover:pl-2 transition-all py-1 border-l-2 border-transparent hover:border-mist"
                                    >
                                        {section.title}
                                    </a>
                                ))}
                            </nav>

                            <div className="mt-8 p-4 bg-gradient-to-br from-mist/5 to-stone/5 rounded-xl border border-sand/30">
                                <h4 className="font-medium text-charcoal mb-2 flex items-center gap-2">
                                    <AlertTriangle size={16} className="text-stone" />
                                    Report Issue
                                </h4>
                                <p className="text-xs text-charcoal/60 mb-3">
                                    Found content that violates our policies?
                                </p>
                                <a
                                    href="mailto:reports@legacyvault.com"
                                    className="text-xs text-stone hover:text-stone/80 underline"
                                >
                                    Report Violation
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-3">
                        <article className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-charcoal prose-p:text-charcoal/80 prose-p:leading-relaxed prose-a:text-mist hover:prose-a:text-mist/80 prose-strong:text-charcoal">
                            {/* Process the content manually for better styling */}
                            <div className="space-y-8">
                                {content.split(/^## /m).slice(1).map((section, idx) => {
                                    const lines = section.split('\n');
                                    const rawTitle = lines[0].trim();
                                    const title = rawTitle.replace(/\*\*/g, '');
                                    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 50);

                                    // Reconstruct the rest of the content
                                    const sectionContent = lines.slice(1).join('\n');

                                    return (
                                        <section key={idx} id={id} className="scroll-mt-24">
                                            <h2 className="font-serif text-2xl md:text-3xl text-charcoal mb-4 flex items-start gap-3">
                                                <span className="text-stone mt-1">§</span>
                                                {title.replace(/^\d+\.\s*/, '')}
                                            </h2>
                                            <div className="text-charcoal/80 leading-relaxed space-y-4 text-base md:text-lg">
                                                {sectionContent.split(/\n\n+/).map((paragraph, pidx) => {
                                                    // Handle tables
                                                    if (paragraph.trim().startsWith('|')) {
                                                        const rows = paragraph.split('\n').filter(row => row.trim().startsWith('|'));
                                                        if (rows.length > 2) {
                                                            return (
                                                                <div key={pidx} className="my-6 overflow-x-auto">
                                                                    <table className="w-full text-sm border-collapse">
                                                                        <thead>
                                                                            <tr className="border-b-2 border-mist/30">
                                                                                {rows[0].split('|').filter(Boolean).map((cell, cidx) => (
                                                                                    <th key={cidx} className="text-left py-2 px-4 font-semibold text-charcoal bg-mist/5">
                                                                                        {cell.trim().replace(/\*\*/g, '')}
                                                                                    </th>
                                                                                ))}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {rows.slice(2).map((row, ridx) => (
                                                                                <tr key={ridx} className="border-b border-sand/30 hover:bg-mist/5">
                                                                                    {row.split('|').filter(Boolean).map((cell, cidx) => (
                                                                                        <td key={cidx} className="py-2 px-4 text-charcoal/70">
                                                                                            {cell.trim().replace(/\*\*/g, '')}
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
                                                    if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
                                                        const items = paragraph.split('\n').filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'));
                                                        return (
                                                            <ul key={pidx} className="space-y-2 my-4">
                                                                {items.map((item, iidx) => (
                                                                    <li key={iidx} className="flex items-start gap-3 text-charcoal/80">
                                                                        <span className="text-mist mt-1.5">•</span>
                                                                        <span dangerouslySetInnerHTML={{
                                                                            __html: item.replace(/^[-\*]\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                                                                        }} />
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        );
                                                    }

                                                    // Handle sub-headers (###)
                                                    if (paragraph.trim().startsWith('### ')) {
                                                        return (
                                                            <h3 key={pidx} className="font-serif text-xl text-charcoal mt-6 mb-3 font-medium">
                                                                {paragraph.replace('### ', '').replace(/\*\*/g, '')}
                                                            </h3>
                                                        );
                                                    }

                                                    // Regular paragraph
                                                    if (paragraph.trim()) {
                                                        // Check if it's a separator
                                                        if (paragraph.trim() === '---') {
                                                            return <hr key={pidx} className="my-8 border-sand/30" />;
                                                        }

                                                        return (
                                                            <p key={pidx} className="text-charcoal/80" dangerouslySetInnerHTML={{
                                                                __html: paragraph
                                                                    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-charcoal">$1</strong>')
                                                                    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-mist hover:underline">$1</a>')
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
                            <Shield className="mx-auto mb-4 text-mist" size={32} />
                            <h3 className="font-serif text-2xl text-charcoal mb-3">Commitment to Safety</h3>
                            <p className="text-charcoal/70 mb-6 max-w-md mx-auto">
                                We are dedicated to maintaining a respectful environment. If you encounter any issues, please let us know.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a
                                    href="mailto:reports@legacyvault.com"
<<<<<<< HEAD
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-mist hover:bg-mist/90 text-ivory rounded-xl font-medium transition-all"
=======
                                    className="btn-paper inline-flex items-center justify-center gap-2 px-6 py-3 bg-sage hover:bg-sage/90 text-ivory rounded-lg font-medium transition-all"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                                >
                                    <Mail size={18} />
                                    Report Content
                                </a>
                                <Link
                                    href="/legal/terms"
<<<<<<< HEAD
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-sand/40 hover:border-mist text-charcoal rounded-xl font-medium transition-all"
=======
                                    className="btn-paper inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-sand/40 hover:border-sage text-charcoal rounded-lg font-medium transition-all"
>>>>>>> origin/claude/pastel-color-palette-avZIb
                                >
                                    <FileText size={18} />
                                    Terms of Service
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
