// lib/arche/htmlGenerator.ts
import { MemorialData } from '@/types/memorial';
import { ARCHE_CSS } from './css';

// Type for mapping cloud URLs to local paths
// Key: Original Cloud URL, Value: Local Relative Path (e.g., "media/photos/original/img.jpg")
export type ResourceMap = Map<string, string>;

// --- HELPER: Process Media URL ---
// If a resource map is provided, swap the cloud URL for the local path.
// Otherwise, keep the cloud URL (for previews).
function processMedia(url: string | null | undefined, map?: ResourceMap): string {
    if (!url) return '';
    if (map && map.has(url)) {
        return map.get(url) || '';
    }
    return url;
}

// --- HELPER: Render Quick Facts Grid ---
function renderFacts(data: MemorialData): string {
    const facts = [];

    if (data.step1.birthPlace) {
        facts.push(`
            <div class="fact-card">
                <strong>Born in</strong>
                <div>${data.step1.birthPlace}</div>
            </div>
        `);
    }
    if (data.step1.deathPlace && !data.step1.isStillLiving) {
        facts.push(`
            <div class="fact-card">
                <strong>Passed in</strong>
                <div>${data.step1.deathPlace}</div>
            </div>
        `);
    }
    if (data.step3.occupations && data.step3.occupations.length > 0) {
        facts.push(`
            <div class="fact-card">
                <strong>Career</strong>
                <div>${data.step3.occupations[0].title}</div>
            </div>
        `);
    }
    if (data.step4.children && data.step4.children.length > 0) {
        facts.push(`
            <div class="fact-card">
                <strong>Family</strong>
                <div>${data.step4.children.length} Children</div>
            </div>
        `);
    }

    if (facts.length === 0) return '';

    return `
    <style>
        .fact-card { background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #ddd; }
        .fact-card strong { display: block; font-size: 0.8rem; color: #888; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
    <div class="section">
        <h2 class="section-title">Quick Facts</h2>
        <div class="grid-4">
            ${facts.join('')}
        </div>
    </div>`;
}

// --- HELPER: Render Biography & Chapters ---
function renderBiography(data: MemorialData): string {
    const bio = data.step6.biography;
    const chapters = data.step6.lifeChapters || [];

    if (!bio && chapters.length === 0) return '';

    let html = `<div class="section"><h2 class="section-title">Life Story</h2>`;

    if (bio) {
        html += `<div style="white-space: pre-wrap; margin-bottom: 40px; font-size: 1.1rem;">${bio}</div>`;
    }

    if (chapters.length > 0) {
        html += `<div style="border-left: 4px solid var(--color-mist); padding-left: 20px; margin-top: 30px;">`;
        chapters.forEach((chapter, index) => {
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 5px; color: var(--color-stone);">
                        Chapter ${index + 1}: ${chapter.title}
                    </h3>
                    ${chapter.period ? `<span class="badge">${chapter.period}</span>` : ''}
                    <p style="margin-top: 10px;">${chapter.description}</p>
                </div>
            `;
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

// --- HELPER: Render Timeline ---
function renderTimeline(data: MemorialData): string {
    const events = data.step4.majorLifeEvents || [];
    if (events.length === 0) return '';

    const sortedEvents = [...events].sort((a, b) => (a.year || '').localeCompare(b.year || ''));

    const rows = sortedEvents.map(event => `
        <div class="timeline-item">
            <div class="timeline-year">${event.year}</div>
            <div class="timeline-content">
                <div class="timeline-title">${event.title}</div>
                <div class="timeline-desc">${event.description}</div>
                <span class="badge">${event.category}</span>
            </div>
        </div>
    `).join('');

    return `
    <style>
        .timeline-item { display: flex; gap: 20px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px dashed #eee; }
        .timeline-year { font-weight: bold; font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-stone); width: 80px; flex-shrink: 0; }
        .timeline-title { font-weight: bold; margin-bottom: 5px; }
        .timeline-desc { color: #555; font-size: 0.95rem; margin-bottom: 8px; }
    </style>
    <div class="section">
        <h2 class="section-title">Timeline</h2>
        <div>${rows}</div>
    </div>`;
}

// --- HELPER: Render Photo Gallery ---
function renderGallery(data: MemorialData, map?: ResourceMap): string {
    const photos = data.step8.gallery || [];
    if (photos.length === 0) return '';

    const items = photos.map(photo => `
        <div class="gallery-item">
            <img src="${processMedia(photo.preview, map)}" alt="${photo.caption || 'Photo'}" loading="lazy">
            ${(photo.caption || photo.year) ? `
            <div class="gallery-caption">
                ${photo.caption ? `<div>${photo.caption}</div>` : ''}
                ${photo.year ? `<small>${photo.year}</small>` : ''}
            </div>` : ''}
        </div>
    `).join('');

    return `
    <style>
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .gallery-item { position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 1; background: #eee; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .gallery-item:hover img { transform: scale(1.05); }
        .gallery-caption { 
            position: absolute; bottom: 0; left: 0; right: 0; 
            background: rgba(0,0,0,0.7); color: #fff; padding: 10px; 
            font-size: 0.9rem; transform: translateY(100%); transition: transform 0.3s ease;
        }
        .gallery-item:hover .gallery-caption { transform: translateY(0); }
    </style>
    <div class="section">
        <h2 class="section-title">Gallery</h2>
        <div class="gallery-grid">
            ${items}
        </div>
    </div>`;
}

// --- HELPER: Render Interactive Photo Stories ---
function renderInteractiveGallery(data: MemorialData, map?: ResourceMap): string {
    const items = data.step8.interactiveGallery || [];
    if (items.length === 0) return '';

    const cards = items.map(item => `
        <div class="interactive-item">
            <div class="interactive-card">
                <div class="interactive-text">
                    <p>${item.description || 'Move your cursor to reveal the photo'}</p>
                </div>
                <img src="${processMedia(item.preview, map)}" alt="Interactive photo" class="interactive-img" loading="lazy">
            </div>
        </div>
    `).join('');

    return `
    <style>
        .interactive-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
        .interactive-card { position: relative; border-radius: 12px; overflow: hidden; aspect-ratio: 16/9; border: 2px solid #ddd; cursor: none; }
        .interactive-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; padding: 30px; z-index: 1; }
        .interactive-text p { background: linear-gradient(135deg, rgba(138,171,180,0.2), rgba(253,246,240,0.9), rgba(90,107,120,0.2)); border-radius: 16px; padding: 20px; font-family: var(--font-serif); font-size: 1.2rem; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .interactive-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 2; opacity: 0; transition: opacity 0.3s ease; }
        .interactive-card:hover .interactive-img { opacity: 1; }
        @media (max-width: 600px) { .interactive-grid { grid-template-columns: 1fr; } }
    </style>
    <div class="section">
        <h2 class="section-title">Interactive Photo Stories</h2>
        <p style="color: #888; margin-bottom: 20px; font-size: 0.9rem;">Hover over each card to reveal the photo behind the story.</p>
        <div class="interactive-grid">
            ${cards}
        </div>
    </div>`;
}

// --- HELPER: Render Voice Recordings ---
function renderVoiceRecordings(data: MemorialData): string {
    const recordings = data.step8.voiceRecordings || [];
    if (recordings.length === 0) return '';

    const items = recordings.map(rec => `
        <div class="voice-item">
            <div class="voice-icon">&#127908;</div>
            <div class="voice-title">${rec.title || 'Untitled Recording'}</div>
        </div>
    `).join('');

    return `
    <style>
        .voice-list { display: flex; flex-direction: column; gap: 12px; }
        .voice-item { display: flex; align-items: center; gap: 15px; background: #fff; padding: 16px 20px; border-radius: 12px; border: 1px solid #eee; }
        .voice-icon { font-size: 1.5rem; flex-shrink: 0; }
        .voice-title { font-weight: 600; color: var(--color-charcoal); }
    </style>
    <div class="section">
        <h2 class="section-title">Voice Recordings</h2>
        <div class="voice-list">
            ${items}
        </div>
    </div>`;
}

// --- HELPER: Render Early Life & Childhood ---
function renderEarlyLife(data: MemorialData): string {
    if (!data.step2.childhoodHome && !data.step2.familyBackground) return '';

    let html = `<div class="section"><h2 class="section-title">Early Life & Childhood</h2>`;

    if (data.step2.childhoodHome) {
        html += `<div style="margin-bottom: 20px;"><h3 style="margin-bottom: 8px; color: var(--color-charcoal);">Childhood Home</h3><p>${data.step2.childhoodHome}</p></div>`;
    }
    if (data.step2.familyBackground) {
        html += `<div style="margin-bottom: 20px;"><h3 style="margin-bottom: 8px; color: var(--color-charcoal);">Family Background</h3><p>${data.step2.familyBackground}</p></div>`;
    }
    if (data.step2.childhoodPersonality && data.step2.childhoodPersonality.length > 0) {
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px;">${data.step2.childhoodPersonality.map((trait: string) => `<span class="badge">${trait}</span>`).join('')}</div>`;
    }

    html += `</div>`;
    return html;
}

// --- HELPER: Render Career & Achievements ---
function renderCareer(data: MemorialData): string {
    const jobs = data.step3.occupations || [];
    if (jobs.length === 0) return '';

    const items = jobs.map(job => `
        <div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 15px;">
            <h3 style="margin-bottom: 5px;">${job.title}</h3>
            <p style="color: #888; font-size: 0.9rem; margin-bottom: 8px;">${job.company || ''}</p>
            <span class="badge">${job.yearsFrom} - ${job.yearsTo}</span>
            ${job.description ? `<p style="margin-top: 10px; color: #555;">${job.description}</p>` : ''}
        </div>
    `).join('');

    return `
    <div class="section">
        <h2 class="section-title">Career & Achievements</h2>
        ${items}
    </div>`;
}

// --- HELPER: Render Family & Relationships ---
function renderFamily(data: MemorialData): string {
    const partners = data.step4.partners || [];
    const children = data.step4.children || [];
    if (partners.length === 0 && children.length === 0) return '';

    let html = `<div class="section"><h2 class="section-title">Family & Relationships</h2>`;

    if (partners.length > 0) {
        html += `<div class="grid-2" style="margin-bottom: 20px;">`;
        partners.forEach(p => {
            html += `<div style="background: #fff; padding: 20px; border-radius: 8px; border: 1px solid #eee;">
                <h4 style="margin-bottom: 4px;">${p.name}</h4>
                <p style="color: #888; font-size: 0.85rem;">${p.relationshipType}</p>
                <p style="color: #888; font-size: 0.85rem;">${p.yearsFrom} - ${p.yearsTo}</p>
                ${p.description ? `<p style="color: #555; margin-top: 8px; font-size: 0.9rem;">${p.description}</p>` : ''}
            </div>`;
        });
        html += `</div>`;
    }

    if (children.length > 0) {
        html += `<div class="grid-2">`;
        children.forEach(c => {
            html += `<div style="background: #fff; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                <h4 style="margin-bottom: 4px;">${c.name}</h4>
                <p style="color: #888; font-size: 0.85rem;">Born ${c.birthYear}</p>
            </div>`;
        });
        html += `</div>`;
    }

    html += `</div>`;
    return html;
}

// --- HELPER: Render Personality & Values ---
function renderPersonality(data: MemorialData): string {
    const traits = data.step5.personalityTraits || [];
    const values = data.step5.coreValues || [];
    const philosophy = data.step5.lifePhilosophy;
    if (traits.length === 0 && !philosophy) return '';

    let html = `<div class="section"><h2 class="section-title">Personality, Values & Passions</h2>`;

    if (traits.length > 0) {
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">${traits.map((t: string) => `<span class="badge">${t}</span>`).join('')}</div>`;
    }
    if (values.length > 0) {
        html += `<div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;">${values.map((v: string) => `<span class="badge" style="background: rgba(90,107,120,0.1); color: var(--color-charcoal);">${v}</span>`).join('')}</div>`;
    }
    if (philosophy) {
        html += `<div style="background: linear-gradient(135deg, rgba(138,171,180,0.05), rgba(90,107,120,0.05)); border-radius: 12px; padding: 25px; border: 1px solid #eee; font-style: italic; color: #555;">${philosophy}</div>`;
    }

    html += `</div>`;
    return html;
}

// --- HELPER: Render Legacy Statement ---
function renderLegacy(data: MemorialData): string {
    if (!data.step8.legacyStatement) return '';

    return `
    <style>
        .legacy-section { background: linear-gradient(135deg, rgba(138,171,180,0.2), var(--color-ivory), rgba(90,107,120,0.2)); border: 2px solid var(--color-sand); border-radius: 16px; padding: 60px 40px; text-align: center; margin-bottom: 40px; }
        .legacy-section h2 { font-size: 2rem; margin-bottom: 20px; }
        .legacy-section p { font-size: 1.3rem; font-family: var(--font-serif); color: #555; max-width: 700px; margin: 0 auto; line-height: 1.8; }
    </style>
    <div class="legacy-section">
        <h2>Legacy</h2>
        <p>${data.step8.legacyStatement}</p>
    </div>`;
}

// --- HELPER: Render Videos ---
function renderVideos(data: MemorialData, map?: ResourceMap): string {
    const videos = data.step9.videos || [];
    if (videos.length === 0) return '';

    const items = videos.map(video => `
        <div class="video-item">
            <video controls poster="${processMedia(video.thumbnail, map)}">
                <source src="${processMedia(video.url, map)}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <div class="video-meta">
                <strong>${video.title || 'Untitled Video'}</strong>
                ${video.duration ? `<span>${video.duration}</span>` : ''}
            </div>
        </div>
    `).join('');

    return `
    <style>
        .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .video-item video { width: 100%; border-radius: 8px; background: #000; aspect-ratio: 16/9; }
        .video-meta { display: flex; justify-content: space-between; padding: 10px 5px; font-size: 0.9rem; }
        @media (max-width: 600px) { .video-grid { grid-template-columns: 1fr; } }
    </style>
    <div class="section">
        <h2 class="section-title">Videos</h2>
        <div class="video-grid">
            ${items}
        </div>
    </div>`;
}

// --- HELPER: Render Tributes ---
function renderTributes(data: MemorialData): string {
    const memories = data.step7.sharedMemories || [];
    const stories = data.step7.impactStories || [];
    const tributes = [...memories, ...stories];

    if (tributes.length === 0) return '';

    const items = tributes.map(t => `
        <div class="tribute-card">
            <h3>${t.title}</h3>
            <p>${t.content}</p>
            <div class="tribute-author">
                — ${t.author} ${(t as any).relationship ? `(${(t as any).relationship})` : ''}
            </div>
        </div>
    `).join('');

    return `
    <style>
        .tribute-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .tribute-card { background: #fdfdfd; border: 1px solid #eee; padding: 25px; border-radius: 8px; }
        .tribute-card h3 { margin-bottom: 10px; font-size: 1.2rem; color: var(--color-charcoal); }
        .tribute-card p { font-style: italic; color: #555; margin-bottom: 15px; }
        .tribute-author { text-align: right; font-weight: bold; font-size: 0.9rem; color: var(--color-stone); }
    </style>
    <div class="section">
        <h2 class="section-title">Tributes & Memories</h2>
        <div class="tribute-grid">
            ${items}
        </div>
    </div>`;
}

// --- MAIN EXPORT FUNCTION ---
export function generateStandaloneHTML(data: MemorialData, resourceMap?: ResourceMap): string {
    // Process cover photo
    const coverPhotoUrl = processMedia(data.step8.coverPhotoPreview, resourceMap);

    // Process profile photo
    const profilePhotoUrl = processMedia(data.step1.profilePhotoPreview, resourceMap);

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.step1.fullName} - Memorial Archive</title>
    <style>
        ${ARCHE_CSS}
        ${coverPhotoUrl ? `
        .hero {
            background-image: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1)), url('${coverPhotoUrl}');
            background-size: cover;
            background-position: center;
        }
        .hero-text h1, .hero-dates { text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
        ` : ''}
    </style>
</head>
<body>

    <!-- HERO HEADER -->
    <header class="hero">
        <div class="hero-content">
            ${profilePhotoUrl
            ? `<img src="${profilePhotoUrl}" alt="${data.step1.fullName}" class="profile-photo">`
            : ''}
            
            <div class="hero-text">
                <h1>${data.step1.fullName}</h1>
                <div class="hero-dates">
                    ${data.step1.birthDate} 
                    ${data.step1.deathDate ? `— ${data.step1.deathDate}` : ''}
                </div>
            </div>
        </div>
    </header>

    <main class="container">
        <!-- EPITAPH -->
        ${data.step1.epitaph ? `
        <div class="section" style="text-align: center; font-style: italic; font-size: 1.5rem; font-family: var(--font-serif); color: #555;">
            "${data.step1.epitaph}"
        </div>
        ` : ''}

        <!-- 1. QUICK FACTS -->
        ${renderFacts(data)}

        <!-- 2. LIFE STORY -->
        ${renderBiography(data)}

        <!-- 3. EARLY LIFE & CHILDHOOD -->
        ${renderEarlyLife(data)}

        <!-- 4. CAREER & ACHIEVEMENTS -->
        ${renderCareer(data)}

        <!-- 5. FAMILY & RELATIONSHIPS -->
        ${renderFamily(data)}

        <!-- 6. PERSONALITY & VALUES -->
        ${renderPersonality(data)}

        <!-- 7. TIMELINE -->
        ${renderTimeline(data)}

        <!-- 8. TRIBUTES & MEMORIES -->
        ${renderTributes(data)}

        <!-- 9. INTERACTIVE PHOTO STORIES -->
        ${renderInteractiveGallery(data, resourceMap)}

        <!-- 10. GALLERY -->
        ${renderGallery(data, resourceMap)}

        <!-- 11. VIDEOS -->
        ${renderVideos(data, resourceMap)}

        <!-- 12. VOICE RECORDINGS -->
        ${renderVoiceRecordings(data)}

        <!-- 13. LEGACY STATEMENT -->
        ${renderLegacy(data)}

    </main>

    <footer style="text-align: center; padding: 40px; color: #888; font-size: 0.8rem; border-top: 1px solid #ddd; margin-top: 40px;">
        <p>Preserved by Legacy Vault. Generated on ${new Date().toLocaleDateString()}.</p>
    </footer>

</body>
</html>`;
}