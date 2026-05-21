document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initContactForm();
});

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;
    
    // Clonar los elementos hijos y agregarlos al final para el bucle infinito
    const items = [...track.children];
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });
}

function initContactForm() {
    const form = document.getElementById('waForm');
    const waNumber = "5491155791196"; 

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        if (!validateForm(form)) return;

        // Sanitización (Frontend Hardening)
        const rawData = {
            name: form.name.value,
            brand: form.brand.value,
            model: form.model.value,
            year: form.year.value,
            query: form.query.value
        };

        const safeData = sanitizeData(rawData);

        // Mensaje humanizado y amigable
        const rawMessage = `¡Hola equipo de Taller Sosa! 👋 Soy ${safeData.name}.\n\nLes escribo porque necesito hacerles una consulta sobre mi vehículo, es un ${safeData.brand} ${safeData.model} (Año ${safeData.year}). 🚗\n\nLes cuento un poco lo que ando necesitando:\n"${safeData.query}"\n\n¿Me podrían indicar cómo hacemos para coordinar un turno o para que lo revisen? \n¡Quedo a la espera de su respuesta, muchas gracias! 🛠️`;

        // Codificación segura para URL
        const waMessage = encodeURIComponent(rawMessage);
        const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
        form.reset();
    });

    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
        if (!validateInput(input)) isValid = false;
    });
    return isValid;
}

function validateInput(input) {
    let valid = true;
    if (!input.checkValidity()) valid = false;

    if (input.name === 'name') {
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;
        valid = regex.test(input.value.trim());
    }

    if (input.name === 'year') {
        const year = parseInt(input.value, 10);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year < 1950 || year > (currentYear + 1)) valid = false;
    }

    if (valid) {
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
    }
    return valid;
}

function sanitizeData(dataObj) {
    const sanitizedObj = {};
    const tempElement = document.createElement('div'); 

    for (const key in dataObj) {
        if (dataObj.hasOwnProperty(key)) {
            let str = dataObj[key].replace(/[<>]/g, ""); 
            tempElement.textContent = str;
            sanitizedObj[key] = tempElement.innerHTML;
        }
    }
    return sanitizedObj;
}