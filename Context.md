# UI Design System Migration — Context & Progress

## Design System (Source of Truth: `app/choice-pricing/page.tsx`)

### Color Mapping (Old → New)
| Old Token | New Token | Usage |
|-----------|-----------|-------|
| `ivory` | `surface-low` | Backgrounds |
| `charcoal` | `warm-dark` | Primary text |
| `charcoal/60-70` | `warm-muted` | Secondary text |
| `charcoal/30-50` | `warm-outline` | Tertiary text |
| `sand` | `warm-border` | Borders (typically /30 opacity) |
| `sage` | `olive` | Primary accent |
| `mist` | `olive` or `plum` | Active states → olive; Info/premium → plum |
| `stone` | `warm-brown` | Secondary accent / warning |
| `parchment` | `surface-high` | Elevated surfaces |
| `lavender` | `plum` | Info accent |
| `aurora-*` | warm/surface equivalents | See below |
| `vault-*`, `obsidian`, `midnight` | warm equivalents | Dark palette removed |
| `gold` | `olive` | Accent |
| `btn-paper` | removed | Use `glass-btn` variants |
| `ivory` (on dark bg) | `warm-bg` | Light text on dark |

### Aurora Mapping
- `aurora-deep` → `surface-high`, `aurora-surface` → `surface-mid`, `aurora-card` → white/`surface-low`
- `aurora-border` → `warm-border`, `aurora-glow`/`aurora-accent` → `warm-brown`
- `aurora-text` → `warm-dark`, `aurora-muted` → `warm-muted`
- `aurora-emerald` → `olive`, `aurora-lavender` → `plum`

### Design Tokens
- **Colors**: warm-dark (#393830), warm-muted (#66645b), warm-outline (#838176), warm-border (#bdb9ae), olive (#5b6a31), warm-brown (#7b5e52), plum (#695e88), warm-bg (#fffbff)
- **Surfaces**: surface-low (#fdf9f0), surface-mid (#f8f3e9), surface-high (#f2eee3), surface-highest (#ece8dc)
- **Typography**: Dual-font serif system (`SerifDual`), Sans=Inter/system, Labels=`text-xs uppercase tracking-widest`
  - **Alphabetic (A-Z)**: Cinzel Bold — sharp, Roman-inspired serif forms (Google Fonts)
  - **Numeric (0-9) & symbols**: Bodoni Moda — high contrast, thin hairlines (Google Fonts)
  - Implemented via `@font-face` with `unicode-range` splitting in `globals.css`
  - Italic text falls back entirely to Bodoni Moda (Cinzel has no italic variant)
  - CSS class: `.font-serif` → `font-family: 'SerifDual', ...`
- **Buttons**: `.glass-btn`, `.glass-btn-primary`, `.glass-btn-dark`, `.glass-btn-danger`
- **Cards**: `border border-warm-border/30 rounded-xl/2xl`
- **Forms**: `.glass-input` (surface-mid bg, olive focus ring)
- **Modals**: `.glass-modal-overlay` + `.glass-modal`

### Decisions Log
1. Body base: `bg-surface-low text-warm-dark`
2. Form inputs → `.glass-input`
3. Modals → `.glass-modal` with warm-dark/60 backdrop
4. Error states keep standard red
5. Success/active → `olive`, Warning → `warm-brown`, Info/premium → `plum`
6. Family tree CSS kept structurally intact
7. Pricing page (`app/choice-pricing/page.tsx`) is NOT modified — source of truth
8. `app/invitation/accept/[id]/page.tsx` — does NOT exist (removed from list)

---

## Migration Progress

### Global Foundation
- [x] tailwind.config.ts — old palettes removed, semantic colors added
- [x] globals.css — base updated, new utilities (glass-card, glass-input, glass-modal, etc.)
- [x] layout.tsx — fonts verified

### Pages — Session 1 (via parallel agents)
- [x] app/page.tsx (Landing)
- [x] app/login/page.tsx
- [x] app/signup/page.tsx
- [x] app/dashboard/page.tsx
- [x] app/dashboard/personal/[userId]/page.tsx
- [x] app/dashboard/family/[userId]/page.tsx
- [x] app/dashboard/family/[userId]/tree/page.tsx
- [x] app/dashboard/draft/[userId]/page.tsx
- [x] app/preserve/page.tsx
- [x] app/person/[id]/page.tsx
- [x] app/personal-confirmation/page.tsx
- [x] app/family-confirmation/page.tsx
- [x] app/seal-confirmation/page.tsx
- [x] app/concierge-confirmation/page.tsx
- [x] app/archive/[memorialId]/page.tsx
- [x] app/archive/[memorialId]/view/page.tsx + view components
- [x] app/archive/[memorialId]/contribute/page.tsx
- [x] app/archive/[memorialId]/family/page.tsx
- [x] app/archive/[memorialId]/steward/page.tsx
- [x] app/archive/[memorialId]/welcome/page.tsx
- [x] app/concierge/request/page.tsx
- [x] app/concierge/[id]/page.tsx
- [x] app/concierge/requested/page.tsx
- [x] app/invite/[token]/page.tsx + 4 invite components
- [x] app/invite/[token]/anonymous/page.tsx
- [x] app/succession/request/page.tsx
- [x] app/succession/accept/[token]/page.tsx
- [x] app/payment/page.tsx
- [x] app/payment-success/page.tsx
- [x] app/success/page.tsx

### Pages — Session 2 (via parallel agents)
- [x] app/create/page.tsx
- [x] app/legal/terms/page.tsx — partially migrated (main content done, bottom CTA section still had old refs)
- [x] app/legal/privacy/page.tsx
- [x] app/legal/refund/page.tsx — partially migrated (main done, bottom CTA already fixed)
- [x] app/legal/memorial-authorization/page.tsx
- [x] app/legal/concierge/page.tsx — STILL HAD old refs (ivory, charcoal)

### Pages — Session 3 (this session, fixups)
- [x] app/legal/content-policy/page.tsx — bottom CTA section (from-mist, to-stone, text-charcoal, sage, sand, btn-paper)
- [x] app/legal/concierge/page.tsx — full page (ivory, charcoal)
- [x] app/admin/page.tsx — STATUS_CONFIG (stone, parchment, mist), btn-paper
- [x] app/admin/[id]/page.tsx — text-mist, btn-paper, bg-parchment, border-sand, bg-mist
- [x] app/admin/abandoned/page.tsx — parchment, stone, mist
- [x] app/authorization/[id]/page.tsx — full page migration (ivory, charcoal, sand, mist, stone, parchment, btn-paper)

### Components — Session 2
- [x] Wizard Steps 1-10
- [x] PathCard, PreviewModal, ProgressBar
- [x] MemorialRenderer
- [x] AnchorPanel
- [x] ArweaveEducation, BioWithLinks, CertificateViewer, ContentReviewChecklist
- [x] FamilyLinker, ImageViewer, IntegrityBadge, PreservationStatus
- [x] SaveIndicator, SignaturePad, SocialRecovery, SuccessionSetup
- [x] SuccessorSettings, TutorialPopup, VersionHistory, VideoRecorder

### Session 5 — Rebranding & Fixes
- [x] Rebrand "Legacy Vault" → "ULUMAE" across 49 files (pages, components, lib, legal markdown, API routes, config)
- [x] Fix Save & Continue button visibility — `bg-warm-brown` → `bg-olive` in all 10 wizard steps
- [x] Email domain migration — all @legacyvault.com → @ulumae.com
- [x] package.json name: `legacy-vault-bio` → `ulumae`
- [x] localStorage key: `legacy-vault-tutorial-completed` → `ulumae-tutorial-completed`

### Cleanup
- [x] Final grep for remaining old brand/color references — 0 found
- [ ] Build verification (`npm run build`)
- [x] Commit & push to branch

---

## Required Email Addresses (@ulumae.com)
| Email | Purpose |
|-------|---------|
| contact@ulumae.com | General contact (footer, landing) |
| support@ulumae.com | Customer support |
| legal@ulumae.com | Legal inquiries |
| privacy@ulumae.com | Privacy & GDPR requests |
| refunds@ulumae.com | Refund requests |
| billing@ulumae.com | Billing issues |
| disputes@ulumae.com | Family/content disputes |
| reports@ulumae.com | Content reports |
| appeals@ulumae.com | Appeal decisions |
| copyright@ulumae.com | DMCA / copyright claims |
| authorization@ulumae.com | Authorization document uploads |

---

## Session Log
- **Session 1** (2026-03-24): Created design system, migrated globals/tailwind/layout + all pages listed above
- **Session 2** (2026-03-25): Migrated create page, legal pages (partial), all wizard steps, all components. Hit rate limit before fixing remaining old refs in admin/legal/authorization pages.
- **Session 3** (2026-03-25): Fixed remaining old color refs in 6 files, committed, pushed.
- **Session 4** (2026-03-25): Implemented dual-font serif system — Cinzel Bold for letters (A-Z), Bodoni Moda for numbers/symbols. Uses `@font-face` + `unicode-range` in globals.css. No per-component changes needed (transparent via `font-serif` class).
- **Session 5** (2026-03-26): Rebranded "Legacy Vault" → "ULUMAE" across entire codebase (49 files). Fixed Save button visibility (warm-brown → olive). Migrated all email domains to @ulumae.com. Committed & pushed.
