// lib/arche/css.ts

export const ARCHE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Inter:wght@400;500;600&display=swap');

  :root {
    --color-ivory: #fdf6f0;
    --color-charcoal: #5a6b78;
    --color-sand: #e8d8cc;
    --color-terracotta: #d4958a;
    --color-sage: #89b896;
    --color-mist: #8AABB4;
    --color-stone: #9E8E82;
    --color-parchment: #EDE9E1;
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-serif: 'Cormorant Garamond', Georgia, serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--color-ivory);
    color: var(--color-charcoal);
    font-family: var(--font-sans);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 { font-family: var(--font-serif); font-weight: normal; }
  
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  
  /* Layout Spacing */
  .section-gap { margin-bottom: 64px; }
  @media (min-width: 768px) { .section-gap { margin-bottom: 96px; } }

  /* Hero Section */
  .hero {
    position: relative;
    height: 384px;
    background: linear-gradient(to bottom right, #8a9ba8, #6b7f8e);
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }
  @media (min-width: 768px) { .hero { height: 500px; } }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #6b7f8e, rgba(107, 127, 142, 0.2) 50%, rgba(107, 127, 142, 0.1));
  }

  .hero-content {
    width: 100%;
    max-width: 1264px;
    margin: 0 auto;
    padding: 0 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    z-index: 10;
  }
  @media (min-width: 768px) {
    .hero-content { flex-direction: row; align-items: flex-end; padding-bottom: 48px; }
  }

  .profile-photo {
    width: 96px;
    height: 96px;
    border: 4px solid var(--color-ivory);
    border-radius: 16px;
    object-fit: cover;
    background: #fff;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  }
  @media (min-width: 768px) { .profile-photo { width: 192px; height: 192px; } }

  .hero-text { text-align: center; }
  @media (min-width: 768px) { .hero-text { text-align: left; padding-bottom: 16px; } }

  .hero-text h1 {
    font-size: 2rem;
    color: var(--color-ivory);
    margin-bottom: 8px;
    line-height: 1.1;
    text-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
  @media (min-width: 768px) { .hero-text h1 { font-size: 3.75rem; } }

  .hero-dates {
    font-size: 0.875rem;
    color: rgba(255,255,255,0.9);
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }
  @media (min-width: 768px) { .hero-dates { font-size: 1.125rem; justify-content: flex-start; } }

  /* Sections */
  .card-section {
    background: #fff;
    border: 1px solid rgba(232, 216, 204, 0.3);
    border-radius: 24px;
    padding: 32px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  @media (min-width: 768px) { .card-section { padding: 48px; } }

  .section-title {
    font-size: 1.5rem;
    color: var(--color-charcoal);
    margin-bottom: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  @media (min-width: 768px) { .section-title { font-size: 2.25rem; } }

  .icon-box {
    width: 32px;
    height: 32px;
    background: rgba(138, 171, 180, 0.1);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  @media (min-width: 768px) { .icon-box { width: 48px; height: 48px; } }
  .icon-box svg { width: 16px; height: 16px; stroke: var(--color-mist); }
  @media (min-width: 768px) { .icon-box svg { width: 24px; height: 24px; } }

  /* Grid Layouts */
  .grid-facts { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 768px) { .grid-facts { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
  @media (min-width: 1024px) { .grid-facts { grid-template-columns: repeat(4, 1fr); } }

  .fact-item {
    background: #fff;
    padding: 12px;
    border-radius: 20px;
    border: 1px solid rgba(232, 216, 204, 0.3);
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  @media (min-width: 768px) { .fact-item { padding: 24px; } }

  /* Typography */
  .prose { font-size: 1rem; color: rgba(90, 107, 120, 0.8); line-height: 1.8; }
  @media (min-width: 768px) { .prose { font-size: 1.125rem; } }
  .font-serif-italic { font-family: var(--font-serif); font-style: italic; }

  /* Badges */
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    margin-right: 8px;
    margin-bottom: 8px;
  }
  .badge-mist { background: rgba(138, 171, 180, 0.1); color: var(--color-mist); }
  .badge-stone { background: rgba(158, 142, 130, 0.1); color: var(--color-stone); }

  /* Timeline/Chapters */
  .chapter-card {
    background: #fff;
    padding: 16px;
    border-radius: 20px;
    border-left: 4px solid var(--color-mist);
    margin-bottom: 12px;
    display: flex;
    gap: 16px;
  }
  @media (min-width: 768px) { .chapter-card { padding: 32px; margin-bottom: 24px; } }

  .chapter-number {
    width: 32px;
    height: 32px;
    background: var(--color-mist);
    color: var(--color-ivory);
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-serif);
    font-weight: bold;
    flex-shrink: 0;
  }
  @media (min-width: 768px) { .chapter-number { width: 48px; height: 48px; font-size: 1.25rem; } }

  /* Gallery */
  .gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  @media (min-width: 768px) { .gallery-grid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
  @media (min-width: 1024px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); } }

  .gallery-item {
    position: relative;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(232, 216, 204, 0.2);
  }
  .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
  .gallery-item:hover img { transform: scale(1.1); }

  /* Interactive Photo Stories */
  .interactive-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 640px) { .interactive-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1024px) { .interactive-grid { grid-template-columns: repeat(3, 1fr); } }

  .interactive-card {
    position: relative;
    aspect-ratio: 16/9;
    border-radius: 20px;
    overflow: hidden;
    border: 2px solid rgba(232, 216, 204, 0.3);
    background: #fff;
    cursor: crosshair;
  }

  .interactive-text {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    z-index: 1;
    text-align: center;
  }
  .interactive-text p {
    background: linear-gradient(135deg, rgba(138, 171, 180, 0.1), rgba(253, 246, 240, 0.9), rgba(158, 142, 130, 0.1));
    backdrop-blur: 4px;
    padding: 16px;
    border-radius: 20px;
    font-family: var(--font-serif);
    font-size: 1rem;
    color: var(--color-charcoal);
  }
  @media (min-width: 768px) { .interactive-text p { font-size: 1.5rem; } }

  .interactive-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 2;
  }

  /* Videos */
  .video-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
  @media (min-width: 768px) { .video-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }

  .video-card {
    background: #fff;
    padding: 12px;
    border-radius: 20px;
    border: 1px solid rgba(232, 216, 204, 0.3);
  }
  .video-container { aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden; margin-bottom: 8px; }
  .video-container video { width: 100%; height: 100%; }

  /* Tributes */
  .tribute-card {
    background: #fff;
    padding: 32px;
    border-radius: 20px;
    border: 1px solid rgba(232, 216, 204, 0.3);
  }
  .tribute-card h4 { font-size: 1.25rem; margin-bottom: 8px; color: var(--color-charcoal); }
  .tribute-card p { font-style: italic; color: rgba(90, 107, 120, 0.7); margin-bottom: 12px; }
  .tribute-author { text-align: right; font-size: 0.875rem; font-weight: 500; color: var(--color-stone); }

  /* Legacy Section */
  .legacy-section {
    background: linear-gradient(to bottom right, rgba(138, 171, 180, 0.2), #fdf6f0, rgba(158, 142, 130, 0.2));
    border: 2px solid rgba(232, 216, 204, 0.3);
    border-radius: 32px;
    padding: 48px 24px;
    text-align: center;
  }
  @media (min-width: 768px) { .legacy-section { padding: 64px 48px; } }
  .legacy-section h2 { font-size: 1.875rem; margin-bottom: 16px; }
  @media (min-width: 768px) { .legacy-section h2 { font-size: 3rem; } }
  .legacy-section p { font-size: 1.125rem; font-family: var(--font-serif); color: rgba(90, 107, 120, 0.8); max-width: 896px; margin: 0 auto; }
  @media (min-width: 768px) { .legacy-section p { font-size: 1.5rem; } }

  /* Footer */
  .footer { background: var(--color-charcoal); color: var(--color-ivory); padding: 48px 0; text-align: center; }
  .footer p { opacity: 0.6; margin-bottom: 16px; }
  .footer .credits { opacity: 0.4; font-size: 0.875rem; }

  /* Integrity Badge */
  .integrity-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 30;
    pointer-events: none;
    background: rgba(253, 246, 240, 0.8);
    backdrop-blur: 4px;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    color: var(--color-charcoal);
    border: 1px solid var(--color-sand);
    opacity: 0.7;
  }

  @media print {
    .hero { height: auto; background: none; color: #000; }
    .hero-overlay { display: none; }
    .hero-text h1 { color: #000; text-shadow: none; }
    .hero-dates { color: #555; }
    .card-section { box-shadow: none; border: 1px solid #ccc; page-break-inside: avoid; }
  }
`;
