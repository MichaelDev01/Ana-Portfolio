(function () {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const THEME_KEY = 'ana-theme';

    function setTheme(theme) {
        body.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (error) {
            /* localStorage might be unavailable; fail gracefully */
        }
    }

    function initTheme() {
        let preferred = 'light';
        try {
            const stored = localStorage.getItem(THEME_KEY);
            if (stored) {
                preferred = stored;
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                preferred = 'dark';
            }
        } catch (error) {
            preferred = 'light';
        }
        setTheme(preferred);
    }

    if (themeToggle) {
        initTheme();
        themeToggle.addEventListener('click', () => {
            const current = body.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    const yearNode = document.getElementById('year');
    if (yearNode) {
        yearNode.textContent = new Date().getFullYear();
    }

    const reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const revealElements = document.querySelectorAll('.reveal');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const supportsIntersectionObserver = 'IntersectionObserver' in window;

    if (!supportsIntersectionObserver) {
        revealElements.forEach((el) => el.classList.add('is-visible'));
        timelineItems.forEach((item) => item.classList.add('is-visible'));
    } else if (reduceMotionQuery && reduceMotionQuery.matches) {
        revealElements.forEach((el) => el.classList.add('is-visible'));
        timelineItems.forEach((item) => item.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: '0px 0px -10%'
        });

        revealElements.forEach((el) => revealObserver.observe(el));

        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.35,
            rootMargin: '0px 0px -12%'
        });

        timelineItems.forEach((item) => timelineObserver.observe(item));
    }
})();
