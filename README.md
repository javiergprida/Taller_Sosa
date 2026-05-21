# Taller Sosa - Landing Page Automotriz 🚗🔧

Una landing page moderna, enfocada en la conversión y orientada a la experiencia del usuario (UX) para **Taller Sosa**, un centro de mecánica integral automotriz ubicado en la Ciudad Autónoma de Buenos Aires (CABA).

## 🎯 Propósito del Proyecto
El objetivo principal de esta web es actuar como un embudo directo de ventas. A través de un diseño oscuro, elegante y de confianza (con acentos en color naranja moderno), la web busca informar rápidamente sobre los servicios clave (desde mantenimiento básico hasta inyección compleja de plataformas VW/Audi) y derivar al cliente a un canal de comunicación directo (WhatsApp) utilizando un formulario que **humaniza la conversación**.

## 🛠️ Tecnologías Utilizadas
Este proyecto está desarrollado bajo la filosofía de "Cero Dependencias", lo que garantiza tiempos de carga ultrarrápidos (crucial para SEO y redes móviles).
- **HTML5:** Estructura semántica accesible.
- **CSS3:** Flexbox, CSS Grid y animaciones Vanilla (Mobile-first puro, sin Bootstrap ni Tailwind).
- **JavaScript (ES6):** Manejo del DOM, validación estricta de formularios y formateo del endpoint hacia la API de WhatsApp.
- **Iconografía SVG Inline Automotriz:** Se utilizan gráficos vectoriales temáticos (motor, llaves, suspensión, aceite) incrustados directamente en el HTML para evitar solicitudes HTTP externas y maximizar el rendimiento.

## 📂 Estructura del Proyecto

```text
/ (Raíz)
├── index.html              # Estructura principal, metadatos y contenido
├── README.md               # Documentación del repositorio
├── /css
│   └── style.css           # Estilos globales, variables y Media Queries
├── /js
│   └── main.js             # Lógica de frontend y parseo de WhatsApp
└── /assets
        ├── logo_taller_sosa-sin-fondo.png  # Identidad corporativa y Favicon
        └── img/
            └── hero-bg.jpg                 # Imagen de fondo del taller