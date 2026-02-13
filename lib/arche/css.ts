// lib/arche/css.ts

export const ARCHE_CSS = `
  :root {
    --color-ivory: #f9f7f3;
    --color-charcoal: #2c3e50;
    --color-sand: #d7ccc8;
    --color-terracotta: #a0522d;
    --color-sage: #8a9a5b;
    --font-sans: system-ui, -apple-system, sans-serif;
    --font-serif: Georgia, 'Times New Roman', serif;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background-color: var(--color-ivory);
    color: var(--color-charcoal);
    font-family: var(--font-sans);
    line-height: 1.6;
    margin: 0;
    padding-bottom: 80px;
  }

  h1, h2, h3, h4, h5 { font-family: var(--font-serif); font-weight: normal; }
  
  .container { max-width: 900px; margin: 0 auto; padding: 20px; }
  
  /* Hero Section */
  .hero {
    position: relative;
    height: 400px;
    background: linear-gradient(to bottom right, #dcdcdc, #b0b0b0);
    margin-bottom: 60px;
    display: flex;
    align-items: flex-end;
  }
  .hero-content {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 20px;
    display: flex;
    align-items: flex-end;
    gap: 30px;
  }
  .profile-photo {
    width: 180px;
    height: 180px;
    border: 6px solid var(--color-ivory);
    border-radius: 12px;
    object-fit: cover;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
  .hero-text h1 {
    font-size: 3.5rem;
    color: var(--color-ivory);
    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    margin-bottom: 10px;
    line-height: 1.1;
  }
  .hero-dates {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.9);
    text-shadow: 0 1px 5px rgba(0,0,0,0.3);
  }

  /* Sections */
  .section {
    background: #fff;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 12px;
    padding: 40px;
    margin-bottom: 40px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
  }
  .section-title {
    font-size: 2rem;
    color: var(--color-charcoal);
    border-bottom: 2px solid var(--color-sand);
    padding-bottom: 15px;
    margin-bottom: 30px;
  }

  /* Grid Layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }

  /* Utility badges */
  .badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    background: rgba(138, 154, 91, 0.1);
    color: var(--color-sage);
    margin-right: 5px;
    margin-bottom: 5px;
  }

  /* Printing */
  @media print {
    .hero { height: auto; background: none; color: #000; page-break-after: always; }
    .hero-text h1 { color: #000; text-shadow: none; }
    .hero-dates { color: #555; text-shadow: none; }
    .section { box-shadow: none; border: 1px solid #ccc; page-break-inside: avoid; }
  }
`;