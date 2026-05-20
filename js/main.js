document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initContactForm();
});

/**
 * Lógica del Carrusel Infinito
 * Clona los elementos para lograr una animación CSS continua y suave
 */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    // Clonar los elementos hijos y agregarlos al final para el efecto de bucle infinito
    const items = [...track.children];
    items.forEach(item => {
        const clone = item.cloneNode(true);
        // Ocultar al lector de pantalla para evitar lectura duplicada
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
}

/**
 * Lógica del Formulario y Conexión con la API de WhatsApp
 */
function initContactForm() {
    const form = document.getElementById('waForm');
    const waNumber = "5491155791196"; // Número en formato internacional, sin el '+'

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevenir el envío tradicional (recarga de página)

        // 1. Validar el formulario
        if (!validateForm(form)) {
            return; // Si no es válido, detenemos el proceso
        }

        // 2. Extraer y sanitizar datos (Hardening Frontend)
        const rawData = {
            name: form.name.value,
            brand: form.brand.value,
            model: form.model.value,
            year: form.year.value,
            query: form.query.value
        };

        const safeData = sanitizeData(rawData);

        // 3. Armar el mensaje para WhatsApp
        const waMessage = `Hola *Taller Sosa*, quiero pedir un turno.%0A%0A` +
                          `👤 *Nombre:* ${safeData.name}%0A` +
                          `🚗 *Vehículo:* ${safeData.brand} ${safeData.model} (Año: ${safeData.year})%0A` +
                          `🛠 *Consulta:* ${safeData.query}`;

        // 4. Crear URL final
        const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

        // 5. Redirigir abriendo en una nueva pestaña
        window.open(waUrl, '_blank', 'noopener,noreferrer');
        
        // Opcional: limpiar el formulario tras el envío
        form.reset();
    });

    // Añadir validación interactiva al perder el foco
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

/**
 * Funciones de Validación de Seguridad y UX
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateInput(input) {
    let valid = true;

    // Validación nativa de HTML5
    if (!input.checkValidity()) {
        valid = false;
    }

    // Validaciones específicas
    if (input.name === 'name') {
        // Solo letras y espacios
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
        valid = regex.test(input.value.trim());
    }

    if (input.name === 'year') {
        const year = parseInt(input.value, 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1950 || year > (currentYear + 1)) {
            valid = false;
        }
    }

    // Toggle de clases para mostrar/ocultar estado de error UI
    if (valid) {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }

    return valid;
}

/**
 * Sanitización Básica de Inputs (Frontend Hardening)
 * - Strip tags HTML para prevenir inyección XSS de base
 * - encodeURIComponent se aplica globalmente en la construcción del query, 
 *   pero aquí limpiamos caracteres peligrosos manualmente antes de armar el String.
 */
function sanitizeData(dataObj) {
    const sanitizedObj = {};
    const tempElement = document.createElement('div'); // Contenedor para escapar HTML

    for (const key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {
            let str = dataObj[key];
            
            // Reemplazo básico de caracteres peligrosos para evitar escapes en URLs maliciosas
            str = str.replace(/[<>]/g, ""); // Elimina tags directos
            
            // Utilizar TextNode nativo del navegador para escapar entidades
            tempElement.textContent = str;
            let escapedStr = tempElement.innerHTML;
            
            // Finalmente se codifica con encodeURIComponent para la URL (maneja saltos de línea y símbolos permitidos)
            sanitizedObj[key] = encodeURIComponent(escapedStr);
        }
    }
    return sanitizedObj;
}