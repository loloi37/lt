import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — ULUMAE',
  description:
    'Learn how ULUMAE preserves life stories permanently on Arweave in four simple steps.',
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-surface-low text-warm-dark font-serif">
      {/* Header */}
      <section className="py-20 md:py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-8 bg-surface-mid/50">
            How It Works
          </span>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            Four steps to permanence.
          </h1>
          <p className="text-lg text-warm-muted font-sans leading-relaxed max-w-xl mx-auto">
            Creating a lasting memorial is a deliberate, structured process.
            Every step is designed to honour the depth of a life.
          </p>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* Steps */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {[
            {
              step: '01',
              title: 'Build',
              description:
                'Use our structured editor to document a life — biography, photos, videos, stories, values. Take your time. Save your progress at any point. There is no deadline for memory.',
            },
            {
              step: '02',
              title: 'Review',
              description:
                'Preview the complete memorial. Invite family members and witnesses to contribute their own memories and verify details. Collaboration enriches the archive.',
            },
            {
              step: '03',
              title: 'Preserve',
              description:
                'A single payment permanently stores your memorial on Arweave — a decentralized storage network with a 200-year endowment. Encrypted, replicated across 800+ nodes, immutable.',
            },
            {
              step: '04',
              title: 'Share',
              description:
                'Share a private link with those who matter. Anchor to local devices for offline access. Designate successors to ensure access continuity across generations.',
            },
          ].map((item) => (
            <div key={item.step} className="grid md:grid-cols-[120px_1fr] gap-6 items-start">
              <span className="text-5xl font-light text-warm-border/60">{item.step}</span>
              <div>
                <h2 className="text-2xl font-light text-warm-dark mb-3">{item.title}</h2>
                <p className="text-warm-muted font-sans leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* Longevity Promise */}
      <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-10 text-center">Our Longevity Promise</h2>
          <blockquote className="border-l-4 border-olive pl-6 py-4 bg-surface-low rounded-r-lg">
            <p className="text-warm-dark font-sans leading-relaxed italic">
              &ldquo;We guarantee that your memories will remain responsible for future generations.
              If technological standards evolve (e.g., the transition from .mp4 to a new protocol),
              we will ensure the automatic migration of your files to the new playback standards,
              without any action required from you.&rdquo;
            </p>
          </blockquote>
          <p className="text-sm text-warm-muted font-sans mt-6 leading-relaxed">
            Memory should not depend on a format. As technology evolves, so does our commitment
            to ensuring your archive remains accessible, intact, and meaningful.
          </p>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* CTA */}
      <section className="py-20 md:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-5">Ready to begin?</h2>
          <p className="text-warm-muted font-sans mb-8 leading-relaxed">
            Start building a memorial at your own pace. Free to begin, with no obligation.
          </p>
          <Link
            href="/choice-pricing"
            className="inline-flex items-center gap-2 px-10 py-4 text-base font-sans font-medium text-white glass-btn-primary rounded-lg"
          >
            Build a Memorial
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
