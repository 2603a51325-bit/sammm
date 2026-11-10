document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#main-menu");

if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        menuButton.setAttribute("aria-expanded", String(!isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
        menu.classList.toggle("is-open", !isOpen);
    });

    menu.addEventListener("click", (event) => {
        if (event.target instanceof HTMLAnchorElement) {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation menu");
            menu.classList.remove("is-open");
        }
    });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

const heroArt = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (heroArt && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
    heroArt.addEventListener("pointermove", (event) => {
        const bounds = heroArt.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        heroArt.style.setProperty("--tilt-x", `${-y * 8}deg`);
        heroArt.style.setProperty("--tilt-y", `${x * 10}deg`);
    });

    heroArt.addEventListener("pointerleave", () => {
        heroArt.style.setProperty("--tilt-x", "0deg");
        heroArt.style.setProperty("--tilt-y", "0deg");
    });
}
