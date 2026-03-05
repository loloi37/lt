// lib/arche/htmlGenerator.ts
import { MemorialData } from '@/types/memorial';
import { ARCHE_CSS } from './css';

// Type for mapping cloud URLs to local paths
export type ResourceMap = Map<string, string>;

// --- ICONS (SVG PATHS) ---
const ICONS = {
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>`,
    quote: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1 0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z"/></svg>`,
    home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`,
    mic: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    mouse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>`,
    message: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`,
};

// --- HELPERS ---
function processMedia(url: string | null | undefined, map?: ResourceMap): string {
    if (!url) return '';
    if (map && map.has(url)) return map.get(url) || '';
    return url;
}

function calculateAge(data: MemorialData): number | null {
    if (!data.step1.birthDate) return null;
    try {
        const birth = new Date(data.step1.birthDate);
        const end = data.step1.isStillLiving ? new Date() : (data.step1.deathDate ? new Date(data.step1.deathDate) : new Date());
        return end.getFullYear() - birth.getFullYear();
    } catch (e) {
        return null;
    }
}

// --- RENDERERS ---

function renderFacts(data: MemorialData): string {
    const facts = [];
    if (data.step1.birthPlace) {
        facts.push(`
            <div class="fact-item">
                <div class="icon-box">${ICONS.mapPin}</div>
                <div>
                    <div style="font-size: 11px; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em;">Born in</div>
                    <div style="font-weight: 600; color: var(--color-charcoal);">${data.step1.birthPlace}</div>
                </div>
            </div>
        `);
    }
    if (data.step1.deathPlace && !data.step1.isStillLiving) {
        facts.push(`
            <div class="fact-item">
                <div class="icon-box">${ICONS.mapPin}</div>
                <div>
                    <div style="font-size: 11px; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em;">Passed in</div>
                    <div style="font-weight: 600; color: var(--color-charcoal);">${data.step1.deathPlace}</div>
                </div>
            </div>
        `);
    }
    if (data.step3.occupations && data.step3.occupations.length > 0) {
        facts.push(`
            <div class="fact-item">
                <div class="icon-box">${ICONS.briefcase}</div>
                <div>
                    <div style="font-size: 11px; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em;">Career</div>
                    <div style="font-weight: 600; color: var(--color-charcoal);">${data.step3.occupations[0].title}</div>
                </div>
            </div>
        `);
    }
    if (data.step4.children && data.step4.children.length > 0) {
        facts.push(`
            <div class="fact-item">
                <div class="icon-box">${ICONS.heart}</div>
                <div>
                    <div style="font-size: 11px; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.05em;">Family</div>
                    <div style="font-weight: 600; color: var(--color-charcoal);">${data.step4.children.length} Children</div>
                </div>
            </div>
        `);
    }

    if (facts.length === 0) return '';
    return `<div class="grid-facts section-gap">${facts.join('')}</div>`;
}

function renderBiography(data: MemorialData): string {
    const bio = data.step6.biography;
    const chapters = data.step6.lifeChapters || [];
    if (!bio && chapters.length === 0) return '';

    let html = '';
    if (bio) {
        html += `
            <section class="card-section section-gap">
                <h2 class="section-title">
                    <div class="icon-box">${ICONS.quote}</div>
                    Life Story
                </h2>
                <div class="prose font-serif" style="white-space: pre-wrap;">${bio}</div>
            </section>
        `;
    }

    if (chapters.length > 0) {
        html += `
            <div class="section-gap">
                <h2 class="section-title">Life Chapters</h2>
                ${chapters.map((chapter, index) => `
                    <div class="chapter-card">
                        <div class="chapter-number">${index + 1}</div>
                        <div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--color-charcoal);">${chapter.title}</h3>
                            ${chapter.period ? `<span class="badge badge-mist">${chapter.period}</span>` : ''}
                            ${(chapter as any).ageRange ? `<span class="badge badge-stone">${(chapter as any).ageRange}</span>` : ''}
                            <p style="margin-top: 12px; color: rgba(90, 107, 120, 0.7);">${chapter.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    return html;
}

function renderEarlyLife(data: MemorialData): string {
    if (!data.step2.childhoodHome && !data.step2.familyBackground) return '';

    return `
        <section class="card-section section-gap" style="background: linear-gradient(to bottom right, rgba(138, 171, 180, 0.05), rgba(158, 142, 130, 0.05));">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.home}</div>
                Early Life & Childhood
            </h2>
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${data.step2.childhoodHome ? `<div><h3 style="font-weight: 600; margin-bottom: 8px; color: var(--color-charcoal);">Childhood Home</h3><p style="opacity: 0.8;">${data.step2.childhoodHome}</p></div>` : ''}
                ${data.step2.familyBackground ? `<div><h3 style="font-weight: 600; margin-bottom: 8px; color: var(--color-charcoal);">Family Background</h3><p style="opacity: 0.8;">${data.step2.familyBackground}</p></div>` : ''}
                ${data.step2.childhoodPersonality?.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px;">${data.step2.childhoodPersonality.map((t: string) => `<span class="badge badge-mist">${t}</span>`).join('')}</div>` : ''}
            </div>
        </section>
    `;
}

function renderCareer(data: MemorialData): string {
    const jobs = data.step3.occupations || [];
    if (jobs.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.briefcase}</div>
                Career & Achievements
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${jobs.map(job => `
                    <div class="card-section" style="padding: 24px;">
                        <h3 style="font-weight: 600; font-size: 1.25rem; color: var(--color-charcoal);">${job.title}</h3>
                        <p style="opacity: 0.6; margin-bottom: 8px;">${job.company || ''}</p>
                        <span class="badge badge-stone">${job.yearsFrom} - ${job.yearsTo}</span>
                        ${job.description ? `<p style="margin-top: 12px; opacity: 0.8;">${job.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFamily(data: MemorialData): string {
    const partners = data.step4.partners || [];
    const children = data.step4.children || [];
    if (partners.length === 0 && children.length === 0) return '';

    let html = `<div class="section-gap">
        <h2 class="section-title">
            <div class="icon-box">${ICONS.heart}</div>
            Family & Relationships
        </h2>`;

    if (partners.length > 0) {
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 24px;">
            ${partners.map(p => `
                <div class="card-section" style="padding: 24px;">
                    <h4 style="font-weight: 600; font-size: 1.125rem; color: var(--color-charcoal);">${p.name}</h4>
                    <p style="opacity: 0.6; font-size: 0.875rem;">${p.relationshipType}</p>
                    <p style="opacity: 0.6; font-size: 0.875rem; margin-bottom: 8px;">${p.yearsFrom} - ${p.yearsTo}</p>
                    ${p.description ? `<p style="margin-top: 12px; opacity: 0.8; font-size: 0.95rem;">${p.description}</p>` : ''}
                </div>
            `).join('')}
        </div>`;
    }

    if (children.length > 0) {
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
            ${children.map(c => `
                <div class="card-section" style="padding: 16px;">
                    <h4 style="font-weight: 600; color: var(--color-charcoal);">${c.name}</h4>
                    <p style="opacity: 0.6; font-size: 0.875rem;">Born ${c.birthYear}</p>
                </div>
            `).join('')}
        </div>`;
    }

    html += `</div>`;
    return html;
}

function renderPersonality(data: MemorialData): string {
    const traits = data.step5.personalityTraits || [];
    const values = data.step5.coreValues || [];
    const philosophy = data.step5.lifePhilosophy;
    if (traits.length === 0 && values.length === 0 && !philosophy) return '';

    return `
        <section class="card-section section-gap">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.sparkles}</div>
                Personality, Values & Passions
            </h2>
            <div style="display: flex; flex-direction: column; gap: 24px;">
                ${traits.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 8px;">${traits.map((t: string) => `<span class="badge badge-mist">${t}</span>`).join('')}</div>` : ''}
                ${values.length > 0 ? `<div style="display: flex; flex-wrap: wrap; gap: 8px;">${values.map((v: string) => `<span class="badge badge-stone">${v}</span>`).join('')}</div>` : ''}
                ${philosophy ? `<div style="background: linear-gradient(to bottom right, rgba(138, 171, 180, 0.05), rgba(158, 142, 130, 0.05)); border-radius: 16px; padding: 24px; font-style: italic; opacity: 0.8; font-family: var(--font-serif); font-size: 1.1rem;">${philosophy}</div>` : ''}
            </div>
        </section>
    `;
}

function renderTributes(data: MemorialData): string {
    const memories = data.step7.sharedMemories || [];
    const stories = data.step7.impactStories || [];
    const tributes = [...memories, ...stories];
    if (tributes.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.message}</div>
                Memories & Stories
            </h2>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${tributes.map(t => `
                    <div class="tribute-card">
                        <h4 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 12px; color: var(--color-charcoal);">${t.title}</h4>
                        <p style="margin-bottom: 16px;">${t.content}</p>
                        <div class="tribute-author">— ${t.author}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderInteractiveGallery(data: MemorialData, map?: ResourceMap): string {
    const items = data.step8.interactiveGallery || [];
    if (items.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.mouse}</div>
                Interactive Photo Stories
            </h2>
            <div class="interactive-grid">
                ${items.map(item => `
                    <div class="interactive-card">
                        <div class="interactive-text">
                            <p>${item.description || 'Hover/Touch to reveal photo'}</p>
                        </div>
                        <img src="${processMedia(item.preview, map)}" class="interactive-img" alt="Interactive photo">
                        ${item.sha256_hash ? `<div class="integrity-badge">Verified ✓</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderGallery(data: MemorialData, map?: ResourceMap): string {
    const photos = data.step8.gallery || [];
    if (photos.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">Photo Gallery</h2>
            <div class="gallery-grid">
                ${photos.map(photo => `
                    <div class="gallery-item">
                        <img src="${processMedia(photo.preview, map)}" alt="${photo.caption || 'Photo'}">
                        ${photo.sha256_hash ? `<div class="integrity-badge">Verified ✓</div>` : ''}
                        ${(photo.caption || photo.year) ? `
                            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent); padding: 12px; color: white; transition: opacity 0.3s;">
                                ${photo.caption ? `<div style="font-size: 12px;">${photo.caption}</div>` : ''}
                                ${photo.year ? `<div style="font-size: 10px; opacity: 0.7;">${photo.year}</div>` : ''}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderVideos(data: MemorialData, map?: ResourceMap): string {
    const videos = data.step9.videos || [];
    if (videos.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">Video Memories</h2>
            <div class="video-grid">
                ${videos.map(v => `
                    <div class="video-card">
                        <div class="video-container">
                            <video controls poster="${processMedia(v.thumbnail, map)}">
                                <source src="${processMedia(v.url, map)}" type="video/mp4">
                            </video>
                        </div>
                        <h4 style="font-weight: 600; font-size: 0.95rem; color: var(--color-charcoal);">${v.title || 'Untitled Video'}</h4>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderVoiceRecordings(data: MemorialData): string {
    const recordings = data.step8.voiceRecordings || [];
    if (recordings.length === 0) return '';

    return `
        <div class="section-gap">
            <h2 class="section-title">
                <div class="icon-box">${ICONS.mic}</div>
                Voice Recordings
            </h2>
            <div style="display: flex; flex-direction: column; gap: 12px;">
                ${recordings.map(rec => `
                    <div class="chapter-card" style="align-items: center; border-left: none; border: 1px solid rgba(232, 216, 204, 0.3); margin-bottom: 0;">
                        <div class="chapter-number" style="background: rgba(158, 142, 130, 0.1); color: var(--color-stone);">
                            <div style="width: 20px; height: 20px;">${ICONS.mic}</div>
                        </div>
                        <div style="flex: 1;">
                            <h4 style="font-weight: 600; color: var(--color-charcoal);">${rec.title || 'Untitled Recording'}</h4>
                        </div>
                        ${rec.sha256_hash ? `<div class="badge badge-stone" style="font-size: 10px; margin: 0;">Verified ✓</div>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderLegacy(data: MemorialData): string {
    if (!data.step8.legacyStatement) return '';

    return `
        <div class="section-gap legacy-section">
            <div style="width: 48px; height: 48px; margin: 0 auto 24px; color: var(--color-stone);">${ICONS.star}</div>
            <h2 style="color: var(--color-charcoal);">Legacy</h2>
            <p>${data.step8.legacyStatement}</p>
        </div>
    `;
}

// --- MAIN EXPORT FUNCTION ---
export function generateStandaloneHTML(data: MemorialData, resourceMap?: ResourceMap): string {
    const coverPhotoUrl = processMedia(data.step8.coverPhotoPreview, resourceMap);
    const profilePhotoUrl = processMedia(data.step1.profilePhotoPreview, resourceMap);
    const age = calculateAge(data);
    const fullName = data.step1.fullName || 'Memorial Archive';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fullName}</title>
    <style>${ARCHE_CSS}</style>
</head>
<body>

    <header class="hero">
        ${coverPhotoUrl ? `<img src="${coverPhotoUrl}" style="position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;">` : ''}
        <div class="hero-overlay"></div>
        <div class="hero-content">
            ${profilePhotoUrl ? `<img src="${profilePhotoUrl}" class="profile-photo" alt="${fullName}">` : ''}
            <div class="hero-text">
                <h1>${fullName}</h1>
                <div class="hero-dates">
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="width: 16px; height: 16px; opacity: 0.8;">${ICONS.calendar}</span>
                        <span>${data.step1.birthDate || ''}</span>
                    </div>
                    ${data.step1.deathDate ? `
                        <span style="opacity: 0.6;">—</span> 
                        <span>${data.step1.deathDate}</span>
                    ` : ''}
                    ${age ? `
                        <span style="opacity: 0.6;" class="desktop-bullet">•</span> 
                        <span>${age} years</span>
                    ` : ''}
                </div>
            </div>
        </div>
    </header>

    <main class="container" style="margin-top: 64px;">
        ${data.step1.epitaph ? `
            <div class="section-gap" style="text-align: center; border-top: 1px solid rgba(232, 216, 204, 0.3); border-bottom: 1px solid rgba(232, 216, 204, 0.3); padding: 48px 24px;">
                <div style="width: 32px; height: 32px; margin: 0 auto 16px; color: var(--color-stone); opacity: 0.5;">${ICONS.quote}</div>
                <p class="font-serif-italic" style="font-size: 1.5rem; color: rgba(90, 107, 120, 0.8); max-width: 896px; margin: 0 auto; line-height: 1.6;">"${data.step1.epitaph}"</p>
            </div>
        ` : ''}

        ${renderFacts(data)}
        ${renderBiography(data)}
        ${renderEarlyLife(data)}
        ${renderCareer(data)}
        ${renderFamily(data)}
        ${renderPersonality(data)}
        ${renderTributes(data)}
        ${renderInteractiveGallery(data, resourceMap)}
        ${renderGallery(data, resourceMap)}
        ${renderVideos(data, resourceMap)}
        ${renderVoiceRecordings(data)}
        ${renderLegacy(data)}
    </main>

    <footer class="footer">
        <div class="container" style="text-align: center;">
            <p>Memorial preserved with ❤️ by Legacy Vault</p>
            <div class="credits">© ${new Date().getFullYear()} Legacy Vault. All rights reserved.</div>
        </div>
    </footer>

    <script>
        document.querySelectorAll('.interactive-card').forEach(card => {
            const img = card.querySelector('.interactive-img');
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                img.style.opacity = '1';
                img.style.webkitMaskImage = \`radial-gradient(circle 120px at \${x}px \${y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)\`;
                img.style.maskImage = \`radial-gradient(circle 120px at \${x}px \${y}px, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 70%, black 100%)\`;
            });
            card.addEventListener('mouseleave', () => {
                img.style.opacity = '0';
                img.style.webkitMaskImage = 'none';
                img.style.maskImage = 'none';
            });
        });
    </script>

</body>
</html>`;
}
