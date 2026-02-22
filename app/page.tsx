"use client";

import { useState } from "react";

const CHARCOAL = "#36454F";
const BG = "#F5F2ED";
const BG_ALT = "#EDE9E1";
const SAND_BORDER = "#D8D2C4";
const TEXT = "#1a2428";
const TEXT_MUTED = "#6b7c84";

function Btn({ children, outline = false, large = false }: { children: React.ReactNode; outline?: boolean; large?: boolean }) {
    const [hov, setHov] = useState(false);
    return (
        <button
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                padding: large ? "14px 36px" : "10px 24px",
                fontSize: large ? "1rem" : "0.875rem",
                fontFamily: "inherit",
                borderRadius: "999px",
                border: `1.5px solid ${CHARCOAL}`,
                cursor: "pointer",
                letterSpacing: "0.04em",
                fontWeight: 500,
                transition: "all 0.2s",
                background: outline
                    ? hov ? CHARCOAL : "transparent"
                    : hov ? "#2a343c" : CHARCOAL,
                color: outline ? (hov ? "#fff" : CHARCOAL) : "#fff",
            }}
        >
            {children}
        </button>
    );
}

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
            border: `1px solid ${CHARCOAL}`,
            color: CHARCOAL,
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            padding: "4px 14px",
            borderRadius: "999px",
            marginBottom: 24,
            background: "transparent",
        }}>{label}</span>
    );
}

const plans = [
    {
        name: "Personal Archive",
        desc: "A complete archive for one person. Private, durable, exportable, and transferable. No subscription.",
        features: ["Individual archive", "Full export", "Designated transfer", "Universal formats"],
    },
    {
        name: "Family Archive",
        desc: "Multiple archives within a single family framework. Hierarchical access, planned transmissions, cross-linked legacies.",
        features: ["Multiple archives", "Access management", "Cross-linked legacies", "Complex scenarios"],
        highlight: true,
    },
    {
        name: "Concierge Archive",
        desc: "Full white-glove service. Legacy Vault handles everything: collection, organization, digitization, and writing.",
        features: ["Human guidance", "Digitization included", "Biographical writing", "Delivered complete"],
    },
];

const pillars = [
    { title: "Private by default", body: "You share only what you choose, with whom you choose, when you choose." },
    { title: "Readable formats", body: "JPEG, PNG, MP4, MP3, PDF. Nothing proprietary. Nothing that requires special software to read twenty years from now." },
    { title: "Exportable", body: "Every archive can leave Legacy Vault in a readable, standalone form — even if the platform were to disappear." },
    { title: "One-time payment", body: "No subscription. No dependency. No surprises. The business model is aligned with the product's promise: continuity." },
];

export default function App() {
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
                    <Btn outline>Sign in</Btn>
                    <Btn>Get started</Btn>
                </div>
            </nav>

            {/* HERO */}
            <Section style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
                <Tag label="Family Memory · Transmission · Durability" />
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
                    <Btn large>Create my archive</Btn>
                    <Btn large outline>Explore plans</Btn>
                </div>
            </Section>

            {/* DIVIDER */}
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
                        background: "#E8E3DA", borderRadius: 12, height: 320,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: TEXT_MUTED, fontSize: "0.85rem", letterSpacing: "0.06em",
                        border: `1px solid ${SAND_BORDER}`,
                    }}>
                        [Illustration / Interface preview]
                    </div>
                </div>
            </Section>

            {/* DIVIDER */}
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
                            <div style={{ width: 32, height: 3, background: CHARCOAL, marginBottom: 16, borderRadius: 2 }} />
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
                        IPFS distributes content without relying on a single central server.
                        Polygon records key archive states to provide timestamped proof of existence.
                        Arweave inscribes select elements into a long-term preservation layer.
                    </p>
                    <p style={{ color: TEXT_MUTED, lineHeight: 1.8 }}>
                        Users configure nothing. You create — we ensure continuity.
                    </p>
                </div>
            </Section>

            {/* DIVIDER */}
            <div style={{ borderTop: `1px solid ${SAND_BORDER}` }} />

            {/* PLANS */}
            <Section style={{ background: BG_ALT }}>
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                    <Tag label="Plans" />
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 400 }}>Three tiers, one standard of excellence.</h2>
                    <p style={{ color: TEXT_MUTED, marginTop: 12 }}>One-time payment. No subscription. No surprises.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
                    {plans.map(plan => (
                        <div key={plan.name} style={{
                            background: plan.highlight ? CHARCOAL : BG,
                            color: plan.highlight ? "#fff" : TEXT,
                            border: `1.5px solid ${plan.highlight ? CHARCOAL : SAND_BORDER}`,
                            borderRadius: 12, padding: "36px 28px",
                            display: "flex", flexDirection: "column", gap: 16,
                            boxShadow: plan.highlight ? "0 4px 24px rgba(54,69,79,0.13)" : "none",
                        }}>
                            <div>
                                <div style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8, opacity: 0.6 }}>
                                    {plan.name}
                                </div>
                            </div>
                            <p style={{ fontSize: "0.9rem", lineHeight: 1.7, opacity: 0.85 }}>{plan.desc}</p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                                {plan.features.map(f => (
                                    <li key={f} style={{ fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8, opacity: 0.9 }}>
                                        <span style={{ width: 16, height: 1, background: plan.highlight ? "#fff" : CHARCOAL, display: "inline-block", flexShrink: 0 }} />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: "auto", paddingTop: 8 }}>
                                {plan.highlight
                                    ? <button style={{
                                        width: "100%", padding: "12px", background: "#fff", color: CHARCOAL,
                                        border: "none", borderRadius: "999px", fontFamily: "inherit", fontWeight: 600,
                                        fontSize: "0.875rem", cursor: "pointer", letterSpacing: "0.04em",
                                    }}>Choose this plan</button>
                                    : <button style={{
                                        width: "100%", padding: "12px", background: "transparent", color: CHARCOAL,
                                        border: `1.5px solid ${CHARCOAL}`, borderRadius: "999px", fontFamily: "inherit",
                                        fontWeight: 500, fontSize: "0.875rem", cursor: "pointer", letterSpacing: "0.04em",
                                    }}>Choose this plan</button>
                                }
                            </div>
                        </div>
                    ))}
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
                <Btn large>Create my archive</Btn>
            </Section>

            {/* FOOTER */}
            <footer style={{
                borderTop: `1px solid ${SAND_BORDER}`, padding: "32px 40px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: 16, color: TEXT_MUTED, fontSize: "0.8rem",
                background: BG,
            }}>
                <span style={{ fontWeight: 700, color: CHARCOAL, letterSpacing: "0.08em" }}>LEGACY VAULT</span>
                <div style={{ display: "flex", gap: 24 }}>
                    {["Privacy", "Terms", "Contact", "FAQ"].map(l => (
                        <span key={l} style={{ cursor: "pointer" }}>{l}</span>
                    ))}
                </div>
                <span>© 2025 Legacy Vault. All rights reserved.</span>
            </footer>
        </div>
    );
}