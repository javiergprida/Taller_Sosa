/**
 * Taller Sosa v2.0 — Main JavaScript
 * Zero Dependencies | ES6+ | Security Hardened
 * 
 * Modules:
 *  - Carousel (infinite loop)
 *  - Contact Form (honeypot, sanitize, WhatsApp redirect)
 *  - Scroll Reveal (IntersectionObserver)
 *  - Header Glassmorphism (scroll listener)
 *  - Back to Top
 *  - Gallery (daily rotation + lightbox)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initContactForm();
    initScrollReveal();
    initHeaderScroll();
    initBackToTop();
    initGallery();
});

/* =============================================
   1. INFINITE CAROUSEL
   ============================================= */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    const items = [...track.children];
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
}

/* =============================================
   2. CONTACT FORM (Honeypot + Sanitize + WA)
   ============================================= */
function initContactForm() {
    const form = document.getElementById('waForm');
    const submitBtn = document.getElementById('submitBtn');
    const waNumber = '5491155791196';

    if (!form || !submitBtn) return;

    // --- Real-time validation on input ---
    const fields = form.querySelectorAll('input:not([name="website"]), textarea');
    fields.forEach(input => {
        input.addEventListener('input', () => validateInputRealTime(input));
        input.addEventListener('blur', () => validateInputRealTime(input, true));
    });

    // --- Submit handler ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Honeypot check — if filled, silently abort (bot detected)
        const honeypot = form.querySelector('[name="website"]');
        if (honeypot && honeypot.value.trim() !== '') {
            // Fake success for bots
            submitBtn.textContent = 'Enviado ✓';
            return;
        }

        // Validate all required fields
        if (!validateForm(form)) return;

        // Sanitize data (5-step pipeline)
        const rawData = {
            name:  form.name.value,
            brand: form.brand.value,
            model: form.model.value,
            year:  form.year.value,
            query: form.query.value
        };

        const safeData = sanitizeData(rawData);

        // Conversational WhatsApp message
        const rawMessage = `¡Hola, equipo de Taller Sosa! 👋 Soy ${safeData.name}.

Quería consultarles para coordinar un turno para mi ${safeData.brand} ${safeData.model} (Año ${safeData.year}). 🚗

Les detallo lo que ando necesitando:
"${safeData.query}"

¿Me avisan qué disponibilidad tienen para que lo revisemos? ¡Muchas gracias! 🛠️`;

        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(rawMessage)}`;

        // --- Submit button feedback ---
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Abriendo WhatsApp... ✓';
        submitBtn.classList.add('btn-sending');

        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            form.reset();
            // Clear validation styles
            fields.forEach(f => {
                f.classList.remove('invalid', 'field-valid');
                const errSpan = f.closest('.form-group')?.querySelector('.field-error');
                if (errSpan) errSpan.textContent = '';
            });
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('btn-sending');
        }, 1200);
    });
}

/* =============================================
   3. FORM VALIDATION
   ============================================= */

/**
 * Error messages map per field name
 */
const ERROR_MESSAGES = {
    name:  'Ingresá solo letras y espacios (mínimo 3 caracteres)',
    brand: 'Ingresá la marca del vehículo',
    model: 'Ingresá el modelo del vehículo',
    year:  'Año inválido (entre 1950 y ' + (new Date().getFullYear() + 1) + ')',
    query: 'Describí brevemente lo que necesitás'
};

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        if (!validateInputRealTime(input, true)) isValid = false;
    });
    return isValid;
}

/**
 * Validates a single input and updates visual feedback.
 * @param {HTMLElement} input - The input/textarea element
 * @param {boolean} showError - If true, shows error message (used on blur/submit)
 * @returns {boolean} - Whether the input is valid
 */
function validateInputRealTime(input, showError = false) {
    let valid = true;
    const value = input.value.trim();
    const errSpan = input.closest('.form-group')?.querySelector('.field-error');

    // Skip honeypot
    if (input.name === 'website') return true;

    // --- Per-field validation ---
    if (input.name === 'name') {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]{3,50}$/;
        valid = regex.test(value);
    } else if (input.name === 'year') {
        const year = parseInt(value, 10);
        const currentYear = new Date().getFullYear();
        valid = !isNaN(year) && year >= 1950 && year <= (currentYear + 1);
    } else if (input.name === 'brand' || input.name === 'model') {
        valid = value.length >= 1 && value.length <= 30;
    } else if (input.name === 'query') {
        valid = value.length >= 5 && value.length <= 300;
    } else {
        valid = input.checkValidity();
    }

    // --- Visual feedback ---
    if (value.length === 0) {
        // Empty: remove all validation styles
        input.classList.remove('invalid', 'field-valid');
        if (errSpan) errSpan.textContent = showError ? (ERROR_MESSAGES[input.name] || 'Campo requerido') : '';
        if (showError) {
            input.classList.add('invalid');
            return false;
        }
        return false;
    }

    if (valid) {
        input.classList.remove('invalid');
        input.classList.add('field-valid');
        if (errSpan) errSpan.textContent = '';
    } else {
        input.classList.remove('field-valid');
        input.classList.add('invalid');
        if (errSpan && showError) {
            errSpan.textContent = ERROR_MESSAGES[input.name] || 'Campo inválido';
        }
    }

    return valid;
}

/* =============================================
   4. SANITIZATION (5-Step XSS Pipeline)
   ============================================= */
function sanitizeData(dataObj) {
    const sanitized = {};
    const MAX_LENGTHS = { name: 50, brand: 30, model: 30, year: 4, query: 300 };

    for (const key in dataObj) {
        if (!Object.prototype.hasOwnProperty.call(dataObj, key)) continue;

        let str = String(dataObj[key]);

        // Step 1: Remove control characters (ASCII 0x00-0x1F, 0x7F)
        str = str.replace(/[\x00-\x1F\x7F]/g, '');

        // Step 2: Strip dangerous protocol prefixes
        str = str.replace(/(?:javascript|data|vbscript)\s*:/gi, '');

        // Step 3: HTML entity encode via DOMParser (robust XSS prevention)
        str = domSanitize(str);

        // Step 4: Normalize unicode
        str = str.normalize('NFC');

        // Step 5: Truncate to max length per field
        const maxLen = MAX_LENGTHS[key] || 200;
        str = str.substring(0, maxLen).trim();

        sanitized[key] = str;
    }
    return sanitized;
}

/**
 * Uses the browser's DOMParser to safely extract text content,
 * stripping any HTML tags and preventing DOM-based XSS.
 */
function domSanitize(input) {
    const doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.body.textContent || '';
}

/* =============================================
   5. SCROLL REVEAL (IntersectionObserver)
   ============================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* =============================================
   6. HEADER GLASSMORPHISM ON SCROLL
   ============================================= */
function initHeaderScroll() {
    const header = document.getElementById('siteHeader');
    if (!header) return;

    let ticking = false;

    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('header--scrolled', window.scrollY > 80);
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Check initial state
    onScroll();
}

/* =============================================
   7. BACK TO TOP BUTTON
   ============================================= */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    const heroSection = document.getElementById('heroSection');
    if (!btn || !heroSection) return;

    // Show button after scrolling past hero
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            btn.classList.toggle('visible', !entry.isIntersecting);
        });
    }, { threshold: 0 });

    observer.observe(heroSection);

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =============================================
   8. GALLERY — Daily Rotation + Lightbox
   ============================================= */

/**
 * Pool of gallery images. The grid shows 6 at a time,
 * rotated daily using a seed based on the current date.
 */
const GALLERY_POOL = [
    { src: './assets/gallery/gallery_01.png', alt: 'Reparación de motor — Taller Sosa' },
    { src: './assets/gallery/gallery_02.png', alt: 'Servicio de aire acondicionado automotor' },
    { src: './assets/gallery/gallery_03.png', alt: 'Vehículo en elevador hidráulico' },
    { src: './assets/gallery/gallery_04.png', alt: 'Diagnóstico electrónico con scanner OBD' },
    { src: './assets/gallery/gallery_05.png', alt: 'Trabajo de suspensión y tren delantero' },
    { src: './assets/gallery/gallery_06.png', alt: 'Service de cambio de aceite y filtros' }
];

function initGallery() {
    const grid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!grid) return;

    // --- Daily rotation: shuffle based on day-of-year ---
    const dayOfYear = getDayOfYear();
    const shuffled = seededShuffle([...GALLERY_POOL], dayOfYear);
    const todayImages = shuffled.slice(0, 6);

    // --- Render gallery items ---
    todayImages.forEach((img, i) => {
        const item = document.createElement('div');
        item.className = `gallery-item reveal reveal-delay-${i + 1}`;
        item.innerHTML = `
            <img src="${img.src}" alt="${img.alt}" loading="lazy" width="400" height="400">
            <div class="gallery-overlay">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h6v6"></path>
                    <path d="M10 14L21 3"></path>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
                <span>Ver</span>
            </div>
        `;

        // Lightbox trigger
        item.addEventListener('click', () => openLightbox(img.src, img.alt));

        grid.appendChild(item);
    });

    // Re-observe newly created gallery items for scroll reveal
    const galleryReveals = grid.querySelectorAll('.reveal');
    if (galleryReveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        galleryReveals.forEach(el => observer.observe(el));
    }

    // --- Lightbox controls ---
    function openLightbox(src, alt) {
        if (!lightbox || !lightboxImg) return;
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
            closeLightbox();
        }
    });
}

/**
 * Returns the day of the year (1-366) for daily rotation seed.
 */
function getDayOfYear() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Deterministic Fisher-Yates shuffle using a simple seeded PRNG.
 * Ensures the same order for the same day across all visitors.
 */
function seededShuffle(arr, seed) {
    let m = arr.length;
    let s = seed;
    while (m) {
        // Simple LCG PRNG
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF;
        const i = ((s >>> 0) % m);
        m--;
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
}