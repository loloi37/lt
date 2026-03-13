"use client";

import Link from "next/link";

const CHARCOAL = "#5a6b78";
const BG = "#fdf6f0";
const BG_ALT = "#f5ede4";
const SAND_BORDER = "#e8d8cc";
const TEXT = "#4e5d6a";
const TEXT_MUTED = "#94a3af";
const SAGE = "#89b896";

function Section({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <section style={{ padding: "80px 24px", ...style }}>
            <div style={{ maxWidth: 860, margin: "0 auto" }}>{children}</div>
        </section>
    );
}

function Tag({ label }: { label: string }) {
    return (
        <span style={{
            display: "inline-block",
            border: `1px solid ${SAND_BORDER}`,
            color: CHARCOAL,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "4px 14px",
            borderRadius: "20px",
            marginBottom: 24,
            background: "rgba(232, 216, 204, 0.15)",
        }}>{label}</span>
    );
}

const pillars = [
    { title: "Private by default", body: "You share only what you choose, with whom you choose, when you choose." },
    { title: "Readable formats", body: "JPEG, PNG, MP4, MP3, PDF. Nothing proprietary. Nothing that requires special software to read twenty years from now." },
    { title: "Permanently preserved", body: "Every archive is inscribed onto Arweave — a permanent, decentralized storage layer. Once preserved, it cannot be deleted, lost, or forgotten." },
    { title: "One-time payment", body: "No subscription. No dependency. No surprises. The business model is aligned with the product's promise: continuity." },
];

export default function HomePage() {
    return (
        <div style={{ fontFamily: "'Georgia', serif", background: BG, color: TEXT, minHeight: "100vh" }}>

            {/* NAV */}
            <nav style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 40px", borderBottom: `1px solid ${SAND_BORDER}`,
                background: BG, position: "sticky", top: 0, zIndex: 100,
            }}>
                <span style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.08em", color: CHARCOAL }}>
                    LEGACY VAULT
                </span>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Link href="/login" className="btn-paper" style={{
                        padding: "10px 24px", fontSize: "0.875rem", borderRadius: "8px",
                        border: `1.5px solid ${CHARCOAL}`, background: "transparent", color: CHARCOAL,
                        fontWeight: 500, letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                        Sign in
                    </Link>
                    <Link href="/create" className="btn-paper" style={{
                        padding: "10px 24px", fontSize: "0.875rem", borderRadius: "8px",
                        border: "1.5px solid transparent", background: CHARCOAL, color: "#fff",
                        fontWeight: 500, letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                        Start creating
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <Section style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
                <Tag label="Family Memory · Transmission · Permanence" />
                <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.2,
                    marginBottom: 24, color: TEXT, maxWidth: 700, margin: "0 auto 24px",
                }}>
                    What deserves to be passed on<br />must not be lost.
                </h1>
                <p style={{ fontSize: "1.1rem", color: TEXT_MUTED, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}>
                    Legacy Vault is a private, structured, and durable space to organize texts, images, voices, documents,
                    and values — and transmit them to the people who matter.
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link href="/create" style={{
                        padding: "14px 36px", fontSize: "1rem", borderRadius: "8px",
                        border: "1.5px solid transparent", background: CHARCOAL, color: "#fff",
                        fontWeight: 500, letterSpacing: "0.04em", textDecoration: "none",
                    }}>
                        Create my archive
                    </Link>
                </div>
            </Section>

            <div style={{ borderTop: `1px solid ${SAND_BORDER}` }} />

            {/* WHAT IS IT */}
            <Section style={{ background: BG }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
                    <div>
                        <Tag label="What it is" />
                        <h2 style={{ fontSize: "1.8rem", fontWeight: 400, lineHeight: 1.3, marginBottom: 20 }}>
                            Not a social network. Not a virtual cemetery.
                        </h2>
                        <p style={{ color: TEXT_MUTED, lineHeight: 1.8, marginBottom: 16 }}>
                            Legacy Vault is a space for <em>clarity</em> — not entertainment. A place to gather what defines
                            a lineage: decisions, values, exiles, sacrifices, silences.
                        </p>
                        <p style={{ color: TEXT_MUTED, lineHeight: 1.8 }}>
                            The interface is deliberately calm, so as never to overwhelm a subject that is already emotionally
                            significant. The goal is not to display — it is to transmit.
                        </p>
                    </div>
                    <div style={{
                        background: "linear-gradient(135deg, rgba(137,184,150,0.1) 0%, rgba(212,149,138,0.1) 50%, rgba(181,167,199,0.1) 100%)", borderRadius: 12, height: 320,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: TEXT_MUTED, fontSize: "0.85rem", letterSpacing: "0.06em",
                        border: `1px solid ${SAND_BORDER}`,
                    }}>
                        [Illustration / Interface preview]
                    </div>
                </div>
            </Section>

            <div style={{ borderTop: `1px solid ${SAND_BORDER}` }} />

            {/* PILLARS */}
            <Section style={{ background: BG_ALT }}>
                <Tag label="Principles" />
                <h2 style={{ fontSize: "1.8rem", fontWeight: 400, marginBottom: 48 }}>
                    An emotional and cultural safeguard.
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36 }}>
                    {pillars.map(p => (
                        <div key={p.title} style={{
                            background: BG, borderRadius: 10, padding: "28px 24px",
                            border: `1px solid ${SAND_BORDER}`,
                        }}>
                            <div style={{ width: 32, height: 3, background: SAGE, marginBottom: 16, borderRadius: 2 }} />
                            <h3 style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 10, color: TEXT }}>{p.title}</h3>
                            <p style={{ color: TEXT_MUTED, fontSize: "0.9rem", lineHeight: 1.7 }}>{p.body}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* TECHNOLOGY */}
            <Section style={{ background: BG }}>
                <div style={{ maxWidth: 640 }}>
                    <Tag label="Infrastructure" />
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 400, lineHeight: 1.3, marginBottom: 20 }}>
                        Technology as a silent guarantee.
                    </h2>
                    <p style={{ color: TEXT_MUTED, lineHeight: 1.8, marginBottom: 16 }}>
                        Arweave inscribes your archive into a permanent, decentralized storage layer —
                        replicated across hundreds of nodes worldwide. Your data cannot be deleted, even by us.
                    </p>
                    <p style={{ color: TEXT_MUTED, lineHeight: 1.8, marginBottom: 16 }}>
                        A Certificate of Digital Permanence is generated for each preserved archive,
                        proving its existence and integrity on the blockchain.
                    </p>
                    <p style={{ color: TEXT_MUTED, lineHeight: 1.8 }}>
                        Users configure nothing. You create — we ensure continuity.
                    </p>
                </div>
            </Section>

            <div style={{ borderTop: `1px solid ${SAND_BORDER}` }} />

            {/* VALUE PROPOSITION (replaces multi-tier pricing) */}
            <Section style={{ background: BG_ALT }}>
                <div style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
                    <Tag label="Preservation" />
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 400, marginBottom: 20 }}>
                        Create freely. Preserve when you are ready.
                    </h2>
                    <p style={{ color: TEXT_MUTED, lineHeight: 1.8, marginBottom: 32 }}>
                        Start building your memorial at no cost. Add stories, photos, timelines, and voices.
                        When you are satisfied with what you have created, choose to preserve it permanently.
                    </p>
                    <div style={{
                        background: BG, borderRadius: 12, padding: "40px 32px",
                        border: `1.5px solid ${SAND_BORDER}`,
                        textAlign: "left",
                    }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                "Unlimited stories, photos, videos, and voice recordings",
                                "Automatic silent saving — never lose your work",
                                "Invite family and friends to contribute memories",
                                "Letters to the Future — time-delayed messages to loved ones",
                                "Permanent Arweave blockchain preservation",
                                "Certificate of Digital Permanence",
                                "Full export in universal formats (ZIP archive)",
                                "No subscription. No recurring fees. Ever.",
                            ].map(f => (
                                <div key={f} style={{ fontSize: "0.9rem", display: "flex", alignItems: "center", gap: 12, color: TEXT }}>
                                    <span style={{ width: 20, height: 1.5, background: SAGE, display: "inline-block", flexShrink: 0 }} />
                                    {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA */}
            <Section style={{ textAlign: "center", background: BG }}>
                <h2 style={{ fontSize: "2rem", fontWeight: 400, marginBottom: 16 }}>
                    Start preserving what matters.
                </h2>
                <p style={{ color: TEXT_MUTED, marginBottom: 40, fontSize: "1rem", lineHeight: 1.7 }}>
                    Legacy Vault is not for everyone.<br />
                    It is for those who believe transmission is not a trivial act.
                </p>
                <Link href="/create" style={{
                    padding: "14px 36px", fontSize: "1rem", borderRadius: "8px",
                    border: "1.5px solid transparent", background: CHARCOAL, color: "#fff",
                    fontWeight: 500, letterSpacing: "0.04em", textDecoration: "none",
                    display: "inline-block",
                }}>
                    Create my archive
                </Link>
            </Section>
        </div>
    );
}
