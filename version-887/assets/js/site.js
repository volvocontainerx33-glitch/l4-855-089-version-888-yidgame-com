const getAll = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function setupNavigation() {
    const button = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!button || !nav) {
        return;
    }
    button.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        button.setAttribute("aria-expanded", String(open));
    });
}

function setupHero() {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
        return;
    }
    const slides = getAll("[data-hero-slide]", hero);
    const dots = getAll("[data-hero-dot]", hero);
    const prev = hero.querySelector("[data-hero-prev]");
    const next = hero.querySelector("[data-hero-next]");
    if (!slides.length) {
        return;
    }
    let index = 0;
    let timer = null;
    const show = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, current) => slide.classList.toggle("is-active", current === index));
        dots.forEach((dot, current) => dot.classList.toggle("is-active", current === index));
    };
    const goNext = () => show(index + 1);
    const start = () => {
        stop();
        timer = window.setInterval(goNext, 5200);
    };
    const stop = () => {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    };
    dots.forEach((dot, current) => {
        dot.addEventListener("click", () => {
            show(current);
            start();
        });
    });
    if (prev) {
        prev.addEventListener("click", () => {
            show(index - 1);
            start();
        });
    }
    if (next) {
        next.addEventListener("click", () => {
            show(index + 1);
            start();
        });
    }
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
}

function setupFilters() {
    getAll("[data-filter-box]").forEach((box) => {
        const scope = box.parentElement || document;
        const input = box.querySelector("[data-filter-query]");
        const year = box.querySelector("[data-filter-year]");
        const type = box.querySelector("[data-filter-type]");
        const region = box.querySelector("[data-filter-region]");
        const cards = getAll("[data-card]", scope);
        const empty = scope.querySelector(".filter-empty");
        const normalize = (value) => String(value || "").trim().toLowerCase();
        const apply = () => {
            const query = normalize(input && input.value);
            const y = normalize(year && year.value);
            const t = normalize(type && type.value);
            const r = normalize(region && region.value);
            let visible = 0;
            cards.forEach((card) => {
                const haystack = normalize(card.getAttribute("data-title"));
                const okQuery = !query || haystack.includes(query);
                const okYear = !y || normalize(card.getAttribute("data-year")) === y;
                const okType = !t || normalize(card.getAttribute("data-type")) === t;
                const okRegion = !r || normalize(card.getAttribute("data-region")) === r;
                const show = okQuery && okYear && okType && okRegion;
                card.hidden = !show;
                if (show) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", visible === 0);
            }
        };
        [input, year, type, region].forEach((control) => {
            if (control) {
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            }
        });
        apply();
    });
}

setupNavigation();
setupHero();
setupFilters();
