/* ==========================================================================
   Vovó Maza - Interatividade
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initScrollProgress();
  initReveal();
  initCounters();
  initProductFilters();
  initOrderButtons();
  initSearchShortcut();
  initContactForm();
});

/* 1. Menu mobile -------------------------------------------------------- */
function initMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const openBtn = document.getElementById("mobileMenuBtn");
  const closeBtn = document.getElementById("closeMenu");

  function setMenu(open) {
    menu.classList.toggle("active", open);
    menu.setAttribute("aria-hidden", String(!open));
    openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  openBtn.addEventListener("click", () => setMenu(true));
  closeBtn.addEventListener("click", () => setMenu(false));
  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
}

/* 2. Barra de progresso da rolagem ------------------------------------- */
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");

  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${percent}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

/* 3. Animação de entrada dos elementos ---------------------------------- */
function initReveal() {
  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("active"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 4. Contadores da seção de estatísticas -------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  function animate(el) {
    const target = Number(el.dataset.target) || 0;
    const duration = 1500;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * progress);
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (!("IntersectionObserver" in window)) {
    counters.forEach((el) => (el.textContent = el.dataset.target));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* 5. Filtro por categoria e busca por nome ------------------------------ */
function initProductFilters() {
  const buttons = document.querySelectorAll(".product-category");
  const products = document.querySelectorAll(".product-item");
  const searchInput = document.getElementById("productSearch");
  const noResults = document.getElementById("noResults");

  let activeCategory = "todos";

  function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    products.forEach((item) => {
      const matchesCategory =
        activeCategory === "todos" || item.dataset.category === activeCategory;
      const matchesName = item.dataset.name.toLowerCase().includes(term);
      const show = matchesCategory && matchesName;

      item.hidden = !show;
      if (show) visibleCount++;
    });

    noResults.hidden = visibleCount > 0;
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      applyFilters();
    });
  });

  searchInput.addEventListener("input", applyFilters);
  applyFilters();
}

/* 6. Botões "Encomendar" preenchem a mensagem de contato ---------------- */
function initOrderButtons() {
  const message = document.getElementById("mensagem");
  const name = document.getElementById("nome");

  document.querySelectorAll(".order-btn").forEach((button) => {
    button.addEventListener("click", () => {
      message.value = `Gostaria de encomendar 1 ${button.dataset.product}. `;
      document.getElementById("contato").scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        name.focus({ preventScroll: true });
      }, 600);
    });
  });
}

/* 7. Botão de pesquisa do header leva ao campo de busca ----------------- */
function initSearchShortcut() {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("productSearch");

  searchBtn.addEventListener("click", () => {
    document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      searchInput.focus({ preventScroll: true });
    }, 600);
  });
}

/* 8. Formulário de contato ---------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const feedback = document.getElementById("formFeedback");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const name = form.nome.value.trim();
    feedback.textContent = `Obrigado, ${name}! Recebemos sua mensagem e entraremos em contato em breve.`;
    form.reset();
  });
}
