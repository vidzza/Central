# Central Automatizada de Alarmas

Landing page para Central Automatizada de Alarmas, empresa de seguridad y monitoreo 24/7 en Cuauhtémoc, Chihuahua, con más de 25 años de experiencia.

---

## Información del Negocio

- **Nombre:** Central Automatizada de Alarmas
- **Giro:** Seguridad — monitoreo de alarmas, CCTV, control de acceso, cercas eléctricas, automatización
- **Teléfono:** +52 625 581 3313 (sin WhatsApp — solo llamadas)
- **Email:** centralautomatizada@gmail.com
- **Dirección:** Morelos #3325, Col. Francisco Villa, Cuauhtémoc, Chihuahua 31530
- **Facebook:** https://www.facebook.com/p/Central-Automatizada-de-Alarmas-100063617767956/

---

## Estructura

```
Central/
├── index.html       — Página principal (una sola página)
├── styles.css       — Estilos + sistema de movimiento premium
├── script.js        — Menú, reveals, contadores, parallax de mouse, panel en vivo
├── logo_header.png  — Logo optimizado para header/footer (38 KB)
├── favicon.png      — Favicon / apple-touch-icon (19 KB)
├── logo_final.png   — Original 1500px (solo og:image para redes)
├── CNAME            — Dominio personalizado (GitHub Pages)
└── README.md
```

---

## Secciones

1. **Hero** — Titular grande + panel de monitoreo "en vivo" (zonas activas, monitor de pulso, feed de eventos, reloj)
2. **Ticker** — Banda diagonal animada con los servicios
3. **Servicios** — 6 tarjetas numeradas con copy breve
4. **Cómo funciona** — Detección → Verificación → Respuesta
5. **Nosotros** — Diferenciador local + estadísticas con contadores animados
6. **Contacto** — Teléfono gigante (solo llamadas), correo y dirección con link a Maps
7. **Footer** + botón flotante de llamada (aparece al hacer scroll)

---

## Identidad Visual

Derivada del logo (escudo rojo con rayo amarillo):

- Rojo primario: `#E31C25`
- Amarillo acento: `#FACC15`
- Fondo: `#08080a` (tema oscuro tipo "centro de comando")
- Tipografías: Big Shoulders (display), Archivo (cuerpo), JetBrains Mono (etiquetas técnicas)

---

## Despliegue

Sitio estático sin build. Compatible con GitHub Pages (workflow en `.github/workflows/`), Netlify o Vercel.

Para verlo localmente:

```bash
python3 -m http.server 8000
# http://localhost:8000
```
