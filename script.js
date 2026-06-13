/**
 * CENTRAL AUTOMATIZADA DE ALARMAS
 * Sistema de interacción y movimiento premium
 */

document.addEventListener('DOMContentLoaded', () => {

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // ── Header scroll ──
    const header = document.getElementById('header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ── Menú móvil ──
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('active');
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) closeMenu();
    });

    // ── Revelación de títulos letra por letra ──
    const splitChars = root => {
        root.setAttribute('aria-label', root.textContent.trim());
        let i = 0;
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) {
            if (walker.currentNode.nodeValue.trim()) textNodes.push(walker.currentNode);
        }
        textNodes.forEach(node => {
            const frag = document.createDocumentFragment();
            node.nodeValue.split(/(\s+)/).forEach(part => {
                if (!part) return;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                    return;
                }
                const word = document.createElement('span');
                word.className = 'word';
                word.setAttribute('aria-hidden', 'true');
                [...part].forEach(c => {
                    const ch = document.createElement('span');
                    ch.className = 'ch';
                    ch.textContent = c;
                    ch.style.setProperty('--i', i++);
                    word.appendChild(ch);
                });
                frag.appendChild(word);
            });
            node.parentNode.replaceChild(frag, node);
        });
    };

    if (!reduceMotion) {
        document.querySelectorAll('.char-title').forEach(splitChars);
    }

    // ── Reveal on scroll ──
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .char-title').forEach(el => revealObserver.observe(el));

    // ── Contadores animados ──
    const animateCount = el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();

        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 4);
            el.textContent = Math.round(target * eased).toLocaleString('es-MX');
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    };

    const countObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-count]').forEach(el => {
        if (el.textContent.trim() === '0') countObserver.observe(el);
    });

    // ── Reloj del panel ──
    const clock = document.getElementById('panelClock');
    if (clock) {
        const tickClock = () => {
            clock.textContent = new Date().toLocaleTimeString('es-MX', { hour12: false });
        };
        tickClock();
        setInterval(tickClock, 1000);
    }

    // ── Feed de eventos en vivo ──
    const log = document.getElementById('eventLog');
    if (log) {
        const events = [
            ['PERÍMETRO NORTE', 'OK', 'ok'],
            ['CÁMARA 04', 'GRABANDO', 'ok'],
            ['PANEL CENTRO', 'ARMADO', 'ok'],
            ['CERCA ELÉCTRICA', 'ACTIVA', 'ok'],
            ['SENSOR P2', 'VERIFICADO', 'warn'],
            ['ENLACE CELULAR', 'ESTABLE', 'ok'],
            ['ACCESO PRINCIPAL', 'OK', 'ok'],
            ['BATERÍA', '100%', 'ok'],
            ['CÁMARA 02', 'GRABANDO', 'ok'],
            ['SEÑAL GPRS', 'OK', 'ok']
        ];
        let idx = 0;

        const pushEvent = () => {
            const [label, status, cls] = events[idx % events.length];
            idx++;

            const time = new Date().toLocaleTimeString('es-MX', { hour12: false });
            const line = document.createElement('div');
            line.className = 'ev';
            line.innerHTML = `<span class="t">${time}</span>${label} · <span class="${cls}">${status}</span>`;
            log.appendChild(line);

            while (log.children.length > 6) log.removeChild(log.firstChild);
        };

        for (let i = 0; i < 4; i++) pushEvent();
        setInterval(pushEvent, 2600);
    }

    // ── Botón de llamada flotante ──
    const fab = document.querySelector('.call-fab');
    if (fab) {
        const toggleFab = () => {
            fab.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
        };
        window.addEventListener('scroll', toggleFab, { passive: true });
        toggleFab();
    }

    // ── Barra de progreso de scroll ──
    const progress = document.createElement('div');
    progress.className = 'scan-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.appendChild(progress);

    let progressTicking = false;
    const updateProgress = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        progressTicking = false;
    };
    window.addEventListener('scroll', () => {
        if (!progressTicking) {
            progressTicking = true;
            requestAnimationFrame(updateProgress);
        }
    }, { passive: true });
    updateProgress();

    // ── Parallax del hero: mouse + scroll combinados ──
    const hero = document.getElementById('inicio');
    const depthLayers = [...document.querySelectorAll('.hero-bg [data-depth]')];
    const panel = document.querySelector('.hero-panel');

    if (hero && !reduceMotion) {
        // Posición objetivo (mouse) y posición suavizada (lerp) para movimiento orgánico
        let mx = 0, my = 0, cx = 0, cy = 0;
        let scrollY = window.scrollY;
        let rafActive = false;
        let panelRX = 0, panelRY = 0, panelTRX = 0, panelTRY = 0;

        const lerp = (a, b, n) => a + (b - a) * n;

        const render = () => {
            cx = lerp(cx, mx, 0.06);
            cy = lerp(cy, my, 0.06);
            panelRX = lerp(panelRX, panelTRX, 0.08);
            panelRY = lerp(panelRY, panelTRY, 0.08);

            // Capas de fondo: cada una se desplaza según su profundidad
            const inHero = scrollY < window.innerHeight * 1.2;
            if (inHero) {
                depthLayers.forEach(layer => {
                    const d = parseFloat(layer.dataset.depth) || 0;
                    const base = layer.classList.contains('hero-bolt') ? 'rotate(12deg) ' : '';
                    const sy = scrollY * (d * 2.6);
                    layer.style.transform = `${base}translate3d(${cx * d * 600}px, ${cy * d * 600 + sy}px, 0)`;
                });
            }

            // Inclinación 3D del panel
            if (panel) {
                panel.style.transform = `perspective(1100px) rotateX(${panelRX}deg) rotateY(${panelRY}deg)`;
            }

            // Continúa mientras haya movimiento perceptible
            if (Math.abs(cx - mx) > 0.0005 || Math.abs(cy - my) > 0.0005 ||
                Math.abs(panelRX - panelTRX) > 0.01 || Math.abs(panelRY - panelTRY) > 0.01) {
                requestAnimationFrame(render);
            } else {
                rafActive = false;
            }
        };

        const kick = () => {
            if (!rafActive) { rafActive = true; requestAnimationFrame(render); }
        };

        if (finePointer) {
            window.addEventListener('mousemove', e => {
                mx = (e.clientX / window.innerWidth) - 0.5;
                my = (e.clientY / window.innerHeight) - 0.5;
                kick();
            }, { passive: true });

            // Inclinación del panel según el cursor sobre él
            if (panel) {
                let panelReady = false;
                panel.addEventListener('mousemove', e => {
                    if (!panelReady) { panel.style.transition = 'none'; panelReady = true; }
                    const r = panel.getBoundingClientRect();
                    const px = (e.clientX - r.left) / r.width - 0.5;
                    const py = (e.clientY - r.top) / r.height - 0.5;
                    panelTRY = px * 9;
                    panelTRX = -py * 9;
                    kick();
                });
                panel.addEventListener('mouseleave', () => {
                    panelTRX = 0; panelTRY = 0; kick();
                });
            }
        }

        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            if (scrollY < window.innerHeight * 1.2) kick();
        }, { passive: true });
    }

    // ── Botones magnéticos (desktop) ──
    if (finePointer && !reduceMotion) {
        document.querySelectorAll('.btn, .nav-phone, .call-fab').forEach(btn => {
            const strength = btn.classList.contains('call-fab') ? 0.35 : 0.25;
            btn.addEventListener('mousemove', e => {
                const r = btn.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
            });
            btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
        });
    }

    // ── Spotlight en tarjetas de servicio (desktop) ──
    if (finePointer) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', `${e.clientX - r.left}px`);
                card.style.setProperty('--my', `${e.clientY - r.top}px`);
            });
        });
    }

    // ── Scrollspy en el nav ──
    const spyLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
    const spyTargets = spyLinks
        .map(l => document.querySelector(l.getAttribute('href')))
        .filter(Boolean);

    const heroSection = document.getElementById('inicio');
    if (heroSection) spyTargets.push(heroSection);

    if (spyTargets.length) {
        const spyObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    spyLinks.forEach(l =>
                        l.classList.toggle('active', l.getAttribute('href') === `#${entry.target.id}`)
                    );
                }
            });
        }, { rootMargin: '-40% 0px -55% 0px' });

        spyTargets.forEach(t => spyObserver.observe(t));
    }
});
