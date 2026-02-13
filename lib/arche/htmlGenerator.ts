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
        html += `<div style="border-left: 4px solid var(--color-sage); padding-left: 20px; margin-top: 30px;">`;
        chapters.forEach((chapter, index) => {
            html += `
                <div style="margin-bottom: 30px;">
                    <h3 style="margin-bottom: 5px; color: var(--color-terracotta);">
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
        .timeline-year { font-weight: bold; font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-terracotta); width: 80px; flex-shrink: 0; }
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
        .tribute-author { text-align: right; font-weight: bold; font-size: 0.9rem; color: var(--color-terracotta); }
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

        <!-- 3. TIMELINE -->
        ${renderTimeline(data)}

        <!-- 4. GALLERY -->
        ${renderGallery(data, resourceMap)}

        <!-- 5. VIDEOS -->
        ${renderVideos(data, resourceMap)}

        <!-- 6. TRIBUTES -->
        ${renderTributes(data)}

    </main>

    <footer style="text-align: center; padding: 40px; color: #888; font-size: 0.8rem; border-top: 1px solid #ddd; margin-top: 40px;">
        <p>Preserved by Legacy Vault. Generated on ${new Date().toLocaleDateString()}.</p>
    </footer>

</body>
</html>`;
}