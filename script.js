/**
 * CENTRAL AUTOMATIZADA DE ALARMAS
 */

document.addEventListener('DOMContentLoaded', () => {

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

    // ── Reveal on scroll ──
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // ── Contadores animados ──
    const animateCount = el => {
        const target = parseInt(el.dataset.count, 10);
        const duration = 1400;
        const start = performance.now();

        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased);
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
        // "2010" se muestra fijo, solo animamos los que arrancan en 0
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

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── Botón de llamada flotante (aparece al pasar el hero) ──
    const fab = document.querySelector('.call-fab');
    if (fab) {
        const toggleFab = () => {
            fab.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
        };
        window.addEventListener('scroll', toggleFab, { passive: true });
        toggleFab();
    }

    // ── Láser de progreso de scroll ──
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

    // ── Barrido láser por sección ──
    if (!reduceMotion) {
        const scanObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scanning');
                    scanObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });

        document.querySelectorAll('main > section').forEach(s => scanObserver.observe(s));
    }

    // ── Texto "desencriptándose" en títulos ──
    const scramble = (el, duration = 750) => {
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) {
            const text = walker.currentNode.nodeValue;
            if (text.trim()) nodes.push({ node: walker.currentNode, text });
        }
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#<>/_';
        const start = performance.now();

        const tick = now => {
            const p = Math.min((now - start) / duration, 1);
            nodes.forEach(({ node, text }) => {
                const solved = Math.floor(p * text.length);
                let out = text.slice(0, solved);
                for (let i = solved; i < text.length; i++) {
                    out += /\S/.test(text[i])
                        ? charset[Math.floor(Math.random() * charset.length)]
                        : text[i];
                }
                node.nodeValue = out;
            });
            if (p < 1) requestAnimationFrame(tick);
            else nodes.forEach(({ node, text }) => { node.nodeValue = text; });
        };
        requestAnimationFrame(tick);
    };

    if (!reduceMotion) {
        const scrambleObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    scramble(entry.target);
                    scrambleObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.hero-title, .section-title, .contact-title')
            .forEach(el => scrambleObserver.observe(el));
    }

    // ── Parallax en el hero ──
    const bolt = document.querySelector('.hero-bolt');
    const glow = document.querySelector('.hero-glow');
    if (bolt && glow && !reduceMotion) {
        let parallaxTicking = false;
        const updateParallax = () => {
            const y = window.scrollY;
            if (y < window.innerHeight * 1.2) {
                bolt.style.transform = `rotate(12deg) translateY(${y * 0.22}px)`;
                glow.style.transform = `translateY(${y * 0.14}px)`;
            }
            parallaxTicking = false;
        };
        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                parallaxTicking = true;
                requestAnimationFrame(updateParallax);
            }
        }, { passive: true });
    }

    // ── Spotlight en tarjetas de servicio (desktop) ──
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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

    // El hero limpia el resaltado (no está en el menú)
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
