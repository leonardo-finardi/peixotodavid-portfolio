/* ════════════════════════════════════════════════════════════
   Peixoto David Arquitetura — front-end interactions
   Vanilla JS replacement for the framer-motion behaviours from
   the Lovable reference (reveal, counters, parallax, nav, etc.)
   ════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Smooth scroll navigation ── */
  function go(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
  }

  document.querySelectorAll("[data-go]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      go(btn.getAttribute("data-go"));
      closeMobileMenu();
    });
  });

  /* ── Mobile menu ── */
  var burger = document.getElementById("navBurger");
  var mobileMenu = document.getElementById("mobileMenu");

  function closeMobileMenu() {
    if (!burger || !mobileMenu) return;
    burger.classList.remove("open");
    mobileMenu.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", isOpen);
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { el.classList.add("is-visible"); }, delay);
        obs.unobserve(el);
      });
    }, { rootMargin: "-80px 0px", threshold: 0.05 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Animated counters ── */
  var counters = document.querySelectorAll("[data-counter]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-counter"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (prefersReduced) { el.textContent = target + suffix; return; }
    var duration = 2000;
    var start = null;
    function ease(t) { return 1 - Math.pow(1 - t, 3); }
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.round(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { counterObserver.observe(el); });
  } else {
    counters.forEach(animateCounter);
  }

  /* ── Hero parallax ── */
  var parallax = document.querySelector("[data-parallax]");
  if (parallax && !prefersReduced) {
    var hero = parallax.closest(".hero");
    var ticking = false;
    function updateParallax() {
      var rect = hero.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = Math.min(Math.max((-rect.top) / (rect.height + vh), 0), 1);
      parallax.style.transform = "translateY(" + (progress * 20) + "%)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(updateParallax); ticking = true; }
    }, { passive: true });
    updateParallax();
  }

  /* ── Lazy autoplay videos (play in view, pause out of view) ── */
  var videos = document.querySelectorAll(".work-video");
  function loadVideo(v) {
    if (v.dataset.src && !v.src) { v.src = v.dataset.src; }
  }
  if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) {
          loadVideo(v);
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(function (v) { videoObserver.observe(v); });
  } else {
    videos.forEach(function (v) { loadVideo(v); });
  }

  /* ── Contact form → WhatsApp + success state ── */
  var form = document.getElementById("contatoForm");
  var success = document.getElementById("contatoSuccess");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var lines = [
        "Olá! Gostaria de solicitar uma proposta.",
        "",
        "Nome: " + (data.get("nome") || ""),
        "Empresa: " + (data.get("empresa") || "—"),
        "E-mail: " + (data.get("email") || ""),
        "Telefone: " + (data.get("telefone") || "—"),
        "Mensagem: " + (data.get("mensagem") || "—")
      ];
      var url = "https://wa.me/5511996699892?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");

      form.hidden = true;
      if (success) success.hidden = false;
    });
  }

  /* ── Footer year ── */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
