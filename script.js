const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// Smooth scrolling for same-page anchors
function setupSmoothScroll() {
  document.addEventListener("click", (e) => {
    const link = e.target?.closest?.('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const el = document.querySelector(href);
    if (!el) return;

    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function setupNavToggle() {
  const btn = $(".nav-toggle");
  const nav = $(".nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    const isOpen = nav.getAttribute("data-open") === "true";
    nav.setAttribute("data-open", String(!isOpen));
    btn.setAttribute("aria-expanded", String(!isOpen));
  });

  // Close on link click (mobile)
  nav.addEventListener("click", (e) => {
    const link = e.target?.closest?.("a");
    if (!link) return;
    nav.setAttribute("data-open", "false");
    btn.setAttribute("aria-expanded", "false");
  });
}

function setupFooterYear() {
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

// Form backend: Formspree (recommended) - sign up at formspree.io, create a form, paste your endpoint ID
// Replace YOUR_FORMSPREE_ID with the ID from your Formspree form URL (e.g. formspree.io/f/xYzAbC → xYzAbC)
const FORMSPREE_ID = "xnjgeayk";

function setupContactForm() {
  const form = $("#contactForm");
  const note = $("#formNote");
  if (!form || !note) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const testType = String(data.get("testType") || "").trim();
    const grade = String(data.get("grade") || "").trim();
    const targetScore = String(data.get("targetScore") || "").trim();
    const testDate = String(data.get("testDate") || "").trim();

    if (!name || !email || !message || !testType) {
      note.textContent = "Please fill out all required fields.";
      return;
    }

    if (!FORMSPREE_ID || FORMSPREE_ID === "YOUR_FORMSPREE_ID") {
      note.textContent = "Form not configured. Add your Formspree ID in script.js";
      return;
    }

    note.textContent = "Sending...";

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          testType,
          grade: grade || undefined,
          targetScore: targetScore || undefined,
          testDate: testDate || undefined,
          message,
          _replyto: email
        }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        note.textContent = "Thank you! Your message has been sent.";
        note.style.color = "var(--accent)";
        form.reset();
      } else {
        note.textContent = "Something went wrong. Please try again or email us directly.";
      }
    } catch {
      note.textContent = "Something went wrong. Please try again or email us directly.";
    }

    setTimeout(() => {
      note.textContent = "";
      note.style.color = "";
    }, 5000);
  });
}

setupSmoothScroll();
setupNavToggle();
setupFooterYear();
setupContactForm();
// Theme toggle (light/dark) + background animation (particles.js)
const THEME_KEY = "satact-theme";

function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // Ignore storage errors (privacy mode, etc.)
  }

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}

function setupParticles(theme) {
  // Respect reduced motion preferences
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reducedMotion) return;

  const el = document.getElementById("particles-js");
  if (!el) return;

  // particles.js defines a global `particlesJS` function
  if (typeof window.particlesJS !== "function") return;

  // Clear any existing canvas so theme changes update colors.
  el.innerHTML = "";

  const isDark = theme === "dark";
  const particleColors = isDark ? ["#d1d5db", "#9ca3af"] : ["#fbbf24", "#f59e0b"];
  const lineColor = isDark ? "#d1d5db" : "#fbbf24";

  const isMobile = window.innerWidth <= 768;
  const particleCount = isMobile ? 25 : 78;
  const densityArea = isMobile ? 1800 : 900;

  window.particlesJS("particles-js", {
    particles: {
      number: {
        value: particleCount,
        density: { enable: true, value_area: densityArea }
      },
      color: { value: particleColors },
      shape: { type: "circle" },
      opacity: { value: 0.55, random: false },
      size: { value: 2.2, random: true },
      line_linked: {
        enable: true,
        distance: 130,
        color: lineColor,
        opacity: 0.25,
        width: 1
      },
      move: {
        enable: true,
        speed: 2.6,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "repulse" },
        onclick: { enable: true, mode: "push" },
        resize: true
      },
      modes: {
        repulse: { distance: 140, duration: 0.35 },
        push: { particles_nb: 6 }
      }
    },
    retina_detect: true
  });
}

function setTheme(theme, persist) {
  document.documentElement.setAttribute("data-theme", theme);

  const themeToggle = $("#themeToggle");
  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore storage errors
    }
  }

  setupParticles(theme);
}

function setupThemeToggle() {
  const themeToggle = $("#themeToggle");
  if (!themeToggle) return;

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme, false);

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || initialTheme;
    const nextTheme = current === "dark" ? "light" : "dark";
    setTheme(nextTheme, true);
  });
}

setupThemeToggle();

