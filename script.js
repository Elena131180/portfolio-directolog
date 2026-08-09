/* ============================================================
   Елена Чиркова — портфолио директолога · интерактив
   ============================================================ */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Шапка: тень при скролле ---------- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  const closeMenu = () => {
    nav.classList.remove("open");
    burger.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });

  nav.querySelectorAll("a").forEach((link) => {
    if (!link.classList.contains("nav__link--dropdown")) link.addEventListener("click", closeMenu);
  });

  /* ---------- Дропдаун «Кейсы» ---------- */
  const closeDropdowns = () => {
    nav
      .querySelectorAll(".nav__item--dropdown.open")
      .forEach((item) => item.classList.remove("open"));
  };

  nav.querySelectorAll(".nav__link--dropdown").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const item = btn.closest(".nav__item--dropdown");
      const wasOpen = item.classList.contains("open");
      closeDropdowns();
      if (!wasOpen) item.classList.add("open");
      btn.setAttribute("aria-expanded", String(!wasOpen));
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav__item--dropdown")) closeDropdowns();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdowns();
      closeMenu();
    }
  });

  /* ---------- Появление блоков ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- Анимированные счётчики ---------- */
  const formatNumber = (num, suffix, decimals) => {
    let value;
    if (decimals) {
      value = num.toFixed(decimals).replace(".", ",");
    } else {
      value = Math.round(num).toLocaleString("ru-RU").replace(/\u00a0/g, " ");
    }
    return value + (suffix || "");
  };

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.count || "0");
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimal || "0", 10);

    if (prefersReduced) {
      el.textContent = formatNumber(target, suffix, decimals);
      return;
    }

    const duration = 1800;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(target * eased, suffix, decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  /* ---------- Подсветка активного пункта меню ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = nav.querySelectorAll(".nav__link");

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === `#${entry.target.id}` ? "var(--gold)" : "";
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((s) => spy.observe(s));

  /* ---------- Лёгкий лайтбокс для скриншотов ---------- */
  const images = document.querySelectorAll(".proof__item img, .case__media img");
  if (images.length) {
    const wrap = document.createElement("div");
    wrap.className = "lightbox";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<button class="lightbox__close" aria-label="Закрыть">&times;</button><img alt="" />';
    document.body.appendChild(wrap);

    const lbImg = wrap.querySelector("img");
    const lbClose = wrap.querySelector(".lightbox__close");

    const close = () => {
      wrap.classList.remove("open");
      wrap.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    images.forEach((img) => {
      img.addEventListener("click", () => {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt || "";
        wrap.classList.add("open");
        wrap.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });

    lbClose.addEventListener("click", close);
    wrap.addEventListener("click", (e) => {
      if (e.target === wrap) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }
})();
