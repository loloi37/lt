// ./app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'Legacy Vault — Permanent Digital Memorials',
  description:
    'Permanent memorials for generations. Preserve life stories, photos, and memories on the Arweave blockchain with a 200-year endowment. Not a social network — a legacy.',
  keywords: ['digital memorial', 'legacy', 'permanent preservation', 'Arweave', 'family archive', 'estate planning', 'digital legacy'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-inter: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
            --font-cormorant: 'Bodoni Moda', Georgia, Cambria, 'Times New Roman', Times, serif;

          }
        `}</style>
      </head>
      <body className="bg-ivory text-charcoal">
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
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
              <a href="/process" className="hover:text-stone">
                Process
              </a>
              <a href="/plans" className="hover:text-stone">
                Plans
              </a>
              <a href="/advisor" className="hover:text-stone">
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
              className="text-sm text-charcoal/80 underline underline-offset-4 hover:text-stone"
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
