# Taller Sosa — Landing Page Automotriz v2.0 🏁

> High-Conversion Landing Page para **Taller Sosa**, centro de mecánica integral automotriz ubicado en Muñecas 1014, CABA, Argentina. Diseñada bajo filosofía **Zero Dependencies** con estética **Racing Premium** en tema oscuro.

---

## 🎯 Propósito del Proyecto

Actúa como un **embudo directo de conversión** hacia WhatsApp. A través de un diseño oscuro, elegante y de alto contraste (fondo `#0a0a0c` + acento `#FF5000`), la web:

1. **Informa** — Servicios clave, marcas soportadas, ubicación con Google Maps embebido.
2. **Genera confianza** — Galería curada de trabajos reales (rotación diaria automática), carrusel infinito de marcas.
3. **Convierte** — Formulario humanizado que arma un mensaje conversacional y redirige a `wa.me/` para contacto directo.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Estructura** | HTML5 semántico | `<article>`, `<section>`, `<nav>`, `<main>`, `<footer>`. Roles ARIA explícitos. |
| **Estilos** | CSS3 Vanilla (Mobile-first) | Custom Properties, Grid, Flexbox, `clamp()`, `@keyframes`. Sin Bootstrap, Tailwind ni preprocesadores. |
| **Lógica** | JavaScript ES6+ | Módulos funcionales, `IntersectionObserver`, `DOMParser`, `requestAnimationFrame`. Sin jQuery ni frameworks. |
| **Iconografía** | SVG Inline | Vectores temáticos incrustados en HTML. Cero requests HTTP para iconos. |
| **Logos de Marcas** | SimpleIcons CDN | Vectores livianos (~1KB cada uno) via `cdn.simpleicons.org`. |
| **Tipografía** | Google Fonts (Inter) | Variable weight 300-800, `font-display: swap` implícito. |

---

## 📂 Estructura del Proyecto

```
/ (Raíz)
├── Index.html              # Documento principal, metadatos, Schema.org
├── README.md               # Documentación técnica (este archivo)
├── /css
│   └── style.css           # Design system, animaciones, responsive
├── /js
│   └── main.js             # Lógica de frontend, validación, galería
└── /assets
    ├── logo_taller_sosa-sin-fondo.png
    ├── logo_taller_sosa.png
    └── /gallery
        ├── gallery_01.png  # Motor y reparación
        ├── gallery_02.png  # Aire acondicionado
        ├── gallery_03.png  # Elevador hidráulico
        ├── gallery_04.png  # Diagnóstico electrónico
        ├── gallery_05.png  # Suspensión y tren delantero
        └── gallery_06.png  # Service y cambio de aceite
```

---

## 🔒 Políticas de Seguridad

### Honeypot Anti-Bot

Un campo `<input name="website">` invisible (posicionado fuera de viewport con CSS, **no** con `display:none`) actúa como trampa. Los bots que rellenan todos los campos automáticamente caen en él. El JS verifica silenciosamente — si está relleno, simula éxito sin ejecutar la acción real.

```html
<!-- Invisible para humanos, irresistible para bots -->
<div class="hp-field" aria-hidden="true">
    <input type="text" name="website" tabindex="-1" autocomplete="off">
</div>
```

### Sanitización Multi-Capa (XSS Prevention)

La función `sanitizeData()` implementa un pipeline de 5 pasos:

| Paso | Acción | Protege contra |
|------|--------|----------------|
| 1 | `str.replace(/[\x00-\x1F\x7F]/g, '')` | Caracteres de control / null bytes |
| 2 | `str.replace(/(?:javascript\|data\|vbscript)\s*:/gi, '')` | Protocol injection |
| 3 | `DOMParser().parseFromString(str, 'text/html').body.textContent` | DOM-based XSS, tag injection |
| 4 | `str.normalize('NFC')` | Unicode normalization attacks |
| 5 | `str.substring(0, maxLen)` | Payload flooding / DoS |

### Content Security Policy (CSP) — Cabeceras HTTP Recomendadas

Añadir estas cabeceras en el servidor web para máxima protección:

**Nginx:**
```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self';
    style-src 'self' https://fonts.googleapis.com;
    font-src https://fonts.gstatic.com;
    img-src 'self' https://cdn.simpleicons.org data:;
    frame-src https://maps.google.com;
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
" always;

add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
```

**Apache (.htaccess):**
```apache
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' https://cdn.simpleicons.org data:; frame-src https://maps.google.com; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self';"
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

---

## ♿ Auditoría de Accesibilidad (a11y) — WCAG 2.1 AA

| Criterio | Implementación |
|----------|---------------|
| **`:focus-visible`** | Todos los elementos interactivos tienen un ring naranja de 3px con offset, solo visible por teclado. No afecta la experiencia de mouse. |
| **`aria-live="polite"`** | Los mensajes de error de validación se anuncian automáticamente a lectores de pantalla al aparecer. |
| **`aria-hidden="true"`** | El honeypot y los clones del carrusel están ocultos del árbol de accesibilidad. |
| **`aria-label`** | Botones sin texto visible (redes sociales, back-to-top, lightbox close) tienen etiquetas descriptivas. |
| **`aria-modal="true"`** | El lightbox bloquea la interacción con el contenido de fondo y se cierra con `Escape`. |
| **Semantic HTML** | Un solo `<h1>`, jerarquía `<h2>`→`<h3>` correcta, `<nav>` con `aria-label`, `<main>`, `<article>`, `<footer>`. |
| **Contraste** | Texto primario (#f0f0f2) sobre fondo (#0a0a0c) = ratio **18.1:1** (supera el mínimo AAA de 7:1). |
| **Reduced Motion** | Las animaciones usan `transition` (no `animation` forzada) para respetar `prefers-reduced-motion` del sistema. |

---

## 🖼️ Galería Curada — Rotación Diaria

El sistema de galería muestra **6 imágenes** de un pool estático, rotadas diariamente usando un algoritmo determinístico:

```
Día del año → Seed → Fisher-Yates shuffle (LCG PRNG) → Slice(0, 6)
```

- **Determinístico**: Todos los visitantes del mismo día ven el mismo orden.
- **Sin backend**: La rotación es 100% client-side basada en `Date`.
- **Lightbox nativo**: Click en imagen → overlay fullscreen con blur, cierre con `×`, click fuera, o tecla `Escape`.

Para actualizar el pool: agregar imágenes a `/assets/gallery/` y actualizar el array `GALLERY_POOL` en `main.js`.

---

## 🎨 Sistema de Diseño

### Micro-interacciones

| Elemento | Efecto | Implementación |
|----------|--------|---------------|
| **Service Cards** | Reveal suave al scroll, hover con elevación + línea naranja superior | `IntersectionObserver` + CSS `transform`/`opacity` |
| **Header** | Glassmorphism progresivo al scrollear (blur 24px + saturate 180%) | `scroll` listener + `requestAnimationFrame` throttle |
| **Gallery** | Hover con zoom + overlay gradient naranja | CSS `transform: scale(1.08)` + gradient overlay |
| **Botón Submit** | Feedback visual "Abriendo WhatsApp... ✓" con delay de 1.2s | JS `setTimeout` + clase `.btn-sending` |
| **Back to Top** | Aparece con spring animation al pasar el hero | `IntersectionObserver` en `#heroSection` |
| **Logo Hero** | Floating animation continua (6s ease-in-out) | `@keyframes heroFloat` |
| **Brand Logos** | Desaturados por defecto, color y scale al hover | CSS `filter: grayscale(100%)` + `:hover` |

### Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--bg-dark` | `#0a0a0c` | Fondo base |
| `--bg-surface` | `#121214` | Secciones alternadas |
| `--bg-card` | `#18181c` | Tarjetas y contenedores |
| `--accent` | `#FF5000` | CTA, highlights, acentos |
| `--text-light` | `#f0f0f2` | Texto primario |
| `--text-muted` | `#8a8a95` | Texto secundario |

---

## 📊 Métricas Lighthouse Esperadas

| Métrica | Target | Justificación |
|---------|--------|---------------|
| **Performance** | 95-100 | Zero JS frameworks, SVG inline, `loading="lazy"` en imágenes y mapa, CSS optimizado sin unused rules, Google Fonts con `preconnect`. |
| **Accessibility** | 100 | `:focus-visible` ring, `aria-live`, `aria-label`, contraste AAA (18.1:1), HTML semántico, roles explícitos. |
| **Best Practices** | 100 | HTTPS ready, `rel="noopener noreferrer"` en links externos, `referrerpolicy`, sin APIs deprecated. CSP headers documentadas. |
| **SEO** | 100 | `<meta description>`, `<title>` descriptivo, Schema.org `AutoRepair`, Open Graph tags, `robots` meta, heading hierarchy, `alt` en todas las imágenes, `width`/`height` attributes. |

---

## 🚀 Despliegue

### Desarrollo Local
```bash
# Cualquier servidor estático. Ejemplo con Python:
python -m http.server 8000

# O con Node.js:
npx serve .
```

### Producción
1. Subir todos los archivos a tu hosting estático (Netlify, Vercel, GitHub Pages, hosting LAMP tradicional).
2. Configurar las **cabeceras HTTP de seguridad** (CSP) documentadas arriba.
3. Comprimir imágenes del pool de galería a WebP para optimización extra (mantener los PNG como fallback).

---

## 📄 Licencia

© 2026 Taller Sosa. Todos los derechos reservados.

Desarrollado con 🔧 y ☕ en Buenos Aires, Argentina.