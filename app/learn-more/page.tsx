import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Shield, Globe, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Learn More — ULUMAE',
  description:
    'Discover why ULUMAE exists, the technology behind permanent preservation, and our commitment to future generations.',
};

export default function LearnMorePage() {
  return (
    <div className="min-h-screen bg-surface-low text-warm-dark font-serif">
      {/* Header */}
      <section className="py-20 md:py-28 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block text-xs font-sans tracking-widest uppercase text-warm-outline border border-warm-border/30 rounded-full px-4 py-1.5 mb-8 bg-surface-mid/50">
            Learn More
          </span>
          <h1 className="text-4xl md:text-5xl font-light leading-tight mb-6">
            What is ULUMAE?
          </h1>
          <p className="text-lg text-warm-muted font-sans leading-relaxed max-w-xl mx-auto">
            A private, structured space to preserve the essence of a life —
            backed by technology designed to last centuries.
          </p>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* Why Permanence */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Why permanence matters</h2>
          <div className="space-y-4 text-warm-muted font-sans leading-relaxed">
            <p>
              Most digital content disappears within a generation. Social media accounts are deactivated.
              Cloud storage subscriptions lapse. Hard drives fail. The stories, values, and voices
              that define a family are lost — not because they were unimportant, but because
              no system was built to keep them.
            </p>
            <p>
              ULUMAE exists to change that. We provide a structured, respectful process for
              documenting a life, and permanent technology to ensure it endures.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* Technology */}
      <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-light mb-10">The technology behind permanence</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-surface-low rounded-xl flex items-center justify-center border border-warm-border/30">
                <Globe size={22} className="text-warm-muted" />
              </div>
              <h3 className="text-sm font-semibold font-sans text-warm-dark mb-2">Arweave Network</h3>
              <p className="text-sm text-warm-muted font-sans leading-relaxed">
                A decentralized storage protocol funded by a 200-year endowment model.
                Your memorial is replicated across 800+ independent nodes worldwide.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-surface-low rounded-xl flex items-center justify-center border border-warm-border/30">
                <Shield size={22} className="text-warm-muted" />
              </div>
              <h3 className="text-sm font-semibold font-sans text-warm-dark mb-2">AES-256 Encryption</h3>
              <p className="text-sm text-warm-muted font-sans leading-relaxed">
                All memorial data is encrypted client-side before it ever leaves your browser.
                Only you and your designated successors hold the keys.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-surface-low rounded-xl flex items-center justify-center border border-warm-border/30">
                <Lock size={22} className="text-warm-muted" />
              </div>
              <h3 className="text-sm font-semibold font-sans text-warm-dark mb-2">Multi-Gateway Access</h3>
              <p className="text-sm text-warm-muted font-sans leading-relaxed">
                Accessible via 3+ independent gateways. No single point of failure.
                Even if one gateway disappears, your data remains reachable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* Longevity Promise */}
      <section className="py-20 md:py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-10 text-center">Our Longevity Promise</h2>
          <blockquote className="border-l-4 border-olive pl-6 py-4 bg-surface-mid/30 rounded-r-lg">
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

      {/* Trust */}
      <section className="py-20 md:py-24 px-6 bg-surface-mid/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Built on trust</h2>
          <div className="space-y-4 text-warm-muted font-sans leading-relaxed">
            <p>
              <strong className="text-warm-dark">No subscription dependency.</strong> One payment. Funded for 200+ years.
              Memory should not depend on a monthly charge.
            </p>
            <p>
              <strong className="text-warm-dark">Fully exportable.</strong> JPEG, PNG, MP4, PDF.
              Download everything at any time. Standard formats, no lock-in.
            </p>
            <p>
              <strong className="text-warm-dark">Succession planning.</strong> Designate successors.
              Configure dead man&apos;s switch. Access transfers automatically when needed.
            </p>
          </div>
        </div>
      </section>

      <div className="border-t border-warm-border/30" />

      {/* CTA */}
      <section className="py-20 md:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-5">Start preserving what matters.</h2>
          <p className="text-warm-muted font-sans mb-8 leading-relaxed">
            Free to begin. No account required. Pay only when you&apos;re ready to preserve permanently.
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
