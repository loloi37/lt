// ./app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Legacy Vault — The echo that never fades',
  description:
    'A discreet and timeless vessel to preserve the essence of your family story. More than an archive, a form of love that endures through time.',
  keywords: ['family memory', 'legacy', 'heritage', 'archive', 'family history', 'memories'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable}`}
    >
      <body className="bg-ivory text-charcoal">
        {children}
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-sand/40 bg-ivory/95">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-2">
            <p className="font-serif text-lg text-charcoal">
              Legacy Vault
            </p>
            <p className="text-xs text-charcoal/70">
              Architecture of a lasting memory.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/60">
              Navigation
            </p>
            <div className="mt-1 flex flex-col gap-1 text-sm text-charcoal/80">
              <a href="/process" className="hover:text-terracotta">
                Process
              </a>
              <a href="/plans" className="hover:text-terracotta">
                Plans
              </a>
              <a href="/advisor" className="hover:text-terracotta">
                Advisor
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-charcoal/60">
              Contact
            </p>
            <p className="text-sm text-charcoal/80">
              First conversation offered, discreet and without obligation.
            </p>
            {/* remplace l’email par le tien */}
            <a
              href="mailto:contact@legacyvault.example"
              className="text-sm text-charcoal/80 underline underline-offset-4 hover:text-terracotta"
            >
              contact@legacyvault.example
            </a>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between text-[11px] text-charcoal/60">
          <span>© {new Date().getFullYear()} Legacy Vault</span>
          <span className="hidden md:inline">
            Transmission is not an instant act. It is a process.
          </span>
        </div>
      </div>
    </footer>
  );
}
