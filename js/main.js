/* Donkey Coffee Roastery — prototype interactions */
(function () {
  "use strict";

  var PRODUCTS = window.DONKEY_PRODUCTS || [];

  /* ---------- Collection page: reflect ?cat=... in the eyebrow ---------- */
  (function initCatBadge() {
    var eyebrow = document.querySelector(".page-head .eyebrow");
    if (!eyebrow) return;
    var params = new URLSearchParams(window.location.search);
    var cat = params.get("cat");
    if (!cat) return;
    var lang = (window.getLang && window.getLang()) || "en";
    var LABELS = {
      beans:     { en: "Donkey Beans",     vi: "Cà phê hạt Donkey" },
      selection: { en: "Donkey Selection", vi: "Tuyển chọn Donkey" }
    };
    var label = LABELS[cat];
    if (!label) return;
    eyebrow.textContent = label[lang] || label.en;
    eyebrow.removeAttribute("data-i18n");
  })();
  var NOTES = window.DONKEY_NOTES || [];
  var fmt = window.formatVnd || function (n) { return n + "đ"; };
  var t = window.t || function (k) { return k; };
  var L = window.L || function (v) { return (v && typeof v === "object" && ("en" in v || "vi" in v)) ? (v.en || v.vi) : v; };

  /* Display label for a canonical country key (keeps filter/flag keys stable) */
  function countryLabel(c) {
    return c === "Việt Nam" ? t("country.vietnam") : c;
  }

  /* ---------- Intro (gallop open) + reveal trigger ---------- */
  (function initIntro() {
    var body = document.body;
    var intro = document.getElementById("intro");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function ready() { body.classList.add("is-ready"); }
    if (!intro) { ready(); return; }
    if (reduce || sessionStorage.getItem("donkeyIntroSeen")) {
      if (intro.parentNode) intro.parentNode.removeChild(intro);
      ready();
      return;
    }
    sessionStorage.setItem("donkeyIntroSeen", "1");
    body.classList.add("intro-active");
    var done = false;
    function leave() {
      if (done) return;
      done = true;
      intro.classList.add("is-leaving");
      ready();
      body.classList.remove("intro-active");
      setTimeout(function () { if (intro.parentNode) intro.parentNode.removeChild(intro); }, 800);
    }
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 720px)").matches;
    var t = setTimeout(leave, isMobile ? 720 : 1150);
    intro.addEventListener("click", function () { clearTimeout(t); leave(); });
    intro.addEventListener("touchend", function () { clearTimeout(t); leave(); }, { passive: true });
  })();

  /* ---------- Scroll progress ---------- */
  var sp = document.getElementById("scroll-progress");
  if (sp) {
    var updProgress = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      sp.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    updProgress();
    window.addEventListener("scroll", updProgress, { passive: true });
    window.addEventListener("resize", updProgress);
  }

  /* ---------- Parallax (editorial images) ---------- */
  var prefersReduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parallaxEls = document.querySelectorAll("[data-parallax]");
  if (parallaxEls.length && !prefersReduce) {
    var ticking = false;
    var applyParallax = function () {
      var vh = window.innerHeight;
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var r = el.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        var off = (r.top + r.height / 2 - vh / 2) / vh;
        var y = (off * -34).toFixed(1);
        el.style.transform = "translate3d(0," + y + "px,0) scale(1.16)";
      }
      ticking = false;
    };
    var onParallax = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(applyParallax); }
    };
    window.addEventListener("scroll", onParallax, { passive: true });
    window.addEventListener("resize", onParallax);
    applyParallax();
  }

  /* ---------- Click burst (confetti + flash ring) ---------- */
  function spawnBurst(cx, cy) {
    if (prefersReduce) return;
    var colors = ["#bf8740", "#17233f", "#e0492f", "#f0d8c8", "#5e5d3f"];

    var ring = document.createElement("span");
    ring.className = "burst-ring";
    ring.style.cssText = "left:" + cx + "px;top:" + cy + "px;width:24px;height:24px;";
    document.body.appendChild(ring);
    ring.animate(
      [
        { opacity: 0.7, transform: "translate(-50%,-50%) scale(0.4)" },
        { opacity: 0, transform: "translate(-50%,-50%) scale(4.2)" }
      ],
      { duration: 560, easing: "cubic-bezier(0.2,0.6,0.4,1)" }
    ).onfinish = function () { ring.remove(); };

    for (var i = 0; i < 22; i++) {
      (function (idx) {
        var el = document.createElement("span");
        el.className = "burst-particle";
        var size = 5 + Math.random() * 8;
        el.style.cssText =
          "left:" + cx + "px;top:" + cy + "px;width:" + size + "px;height:" + size + "px;" +
          "background:" + colors[idx % colors.length] + ";" +
          (idx % 3 === 0 ? "border-radius:50%;" : "");
        document.body.appendChild(el);
        var ang = Math.random() * Math.PI * 2;
        var dist = 70 + Math.random() * 120;
        var dx = Math.cos(ang) * dist;
        var dy = Math.sin(ang) * dist;
        var rot = Math.random() * 720 - 360;
        var dur = 650 + Math.random() * 500;
        el.animate(
          [
            { transform: "translate(-50%,-50%) translate(0,0) rotate(0deg) scale(1)", opacity: 1, offset: 0 },
            { transform: "translate(-50%,-50%) translate(" + (dx * 0.7) + "px," + (dy * 0.7 - 34) + "px) rotate(" + (rot * 0.6) + "deg) scale(1)", opacity: 1, offset: 0.4 },
            { transform: "translate(-50%,-50%) translate(" + dx + "px," + (dy + 80) + "px) rotate(" + rot + "deg) scale(0.5)", opacity: 0, offset: 1 }
          ],
          { duration: dur, easing: "cubic-bezier(0.2,0.7,0.3,1)" }
        ).onfinish = function () { el.remove(); };
      })(i);
    }
  }

  function celebrate(btn) {
    var r = btn.getBoundingClientRect();
    spawnBurst(r.left + r.width / 2, r.top + r.height / 2);
    btn.classList.remove("is-popped");
    void btn.offsetWidth;
    btn.classList.add("is-popped");
  }

  /* ---------- Lookbook: smooth drag + momentum ---------- */
  (function initLookbookDrag() {
    var track = document.getElementById("lookbook");
    if (!track) return;

    track.style.scrollBehavior = "auto";

    var LERP       = 0.14;  /* drag smoothing: lower = more lag, higher = snappier */
    var FRICTION   = 0.88;  /* momentum decay per frame (0–1) */
    var MIN_VEL    = 0.5;   /* px/frame — stop threshold */

    var isDragging = false;
    var moved      = false;
    var startX     = 0;
    var scrollStart= 0;

    /* "target" is where we want scrollLeft to be; current lerps toward it */
    var targetScroll = 0;
    var rafId        = null;
    var vel = 0;

    /* Velocity samples for momentum */
    var samples  = [];
    var VEL_WIN  = 80; /* ms */

    function loop() {
      if (isDragging) {
        var diff = targetScroll - track.scrollLeft;
        if (Math.abs(diff) < 0.3) { track.scrollLeft = targetScroll; }
        else { track.scrollLeft += diff * LERP; }
        rafId = requestAnimationFrame(loop);
      } else {
        track.scrollLeft += vel;
        vel *= FRICTION;
        if (Math.abs(vel) < MIN_VEL) { vel = 0; rafId = null; return; }
        rafId = requestAnimationFrame(loop);
      }
    }
    function startLoop() { if (!rafId) rafId = requestAnimationFrame(loop); }
    function stopLoop() { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } vel = 0; }

    track.addEventListener("mousedown", function (e) {
      stopLoop();
      isDragging   = true;
      moved        = false;
      startX       = e.clientX;
      scrollStart  = track.scrollLeft;
      targetScroll = track.scrollLeft;
      samples      = [{ t: performance.now(), x: e.clientX }];
      track.classList.add("is-dragging");
      e.preventDefault();
      startLoop();
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDragging) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      targetScroll = scrollStart - dx;
      var maxScroll = track.scrollWidth - track.clientWidth;
      if (targetScroll < 0) targetScroll = 0;
      if (targetScroll > maxScroll) targetScroll = maxScroll;
      var now = performance.now();
      samples.push({ t: now, x: e.clientX });
      samples = samples.filter(function (s) { return now - s.t <= VEL_WIN; });
    });

    window.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove("is-dragging");
      if (samples.length >= 2) {
        var first = samples[0], last = samples[samples.length - 1];
        var dt = last.t - first.t;
        if (dt > 0) {
          vel = ((first.x - last.x) / dt) * 16.67;
          vel = Math.max(-40, Math.min(40, vel));
        }
      }
      samples = [];
      if (Math.abs(vel) > MIN_VEL) { startLoop(); }
      else { vel = 0; rafId = null; }
    });

    track.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
  })();

  /* ---------- Cart bump (badge sync handled by cart.js) ---------- */
  function bump() { /* no-op: Cart.addItem dispatches donkey:cart, cart.js updates badges */ }

  /* ---------- Card markup (shared) ---------- */
  /* SVG status icons (inline, currentColor) */
  var ICONS = {
    fire: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2c.5 3-1.8 4.2-2.8 5.8C8 9.6 8.4 11 9.6 11.8c.3-1 .9-1.8 1.7-2.3-.2 1.6.6 2.4 1.5 3.2.9.8 1.5 1.7 1.5 3 0 2.2-1.9 4-4.3 4-2.7 0-4.8-1.9-4.8-4.7 0-1.7.7-3 1.6-4.4C8.9 11 6.8 12.3 6.5 14.6 5.6 13.4 5 11.8 5 10c0-3.6 3-5.4 4.4-8 .4 1.6 1.5 2.6 2.6 3.6.9.8 1.7 1.7 2 3-.6-.4-1.3-.6-2-.6.3-1.1.1-2.3-.0-4z"/></svg>',
    spark: '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 5.9 6.6 1-4.7 4.6 1.1 6.5L12 17.9 6.1 20.5l1.1-6.5L2.5 9.4l6.6-1z"/></svg>',
    gem: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18M9 3 6 9l6 12 6-12-3-6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    clock2: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
    arrowUp: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>'
  };

  /* Mini SVG flags by origin (consistent across OS, unlike emoji flags) */
  var FLAGS = {
    "Ethiopia":
      '<svg class="flag" viewBox="0 0 18 13" aria-hidden="true">' +
        '<rect width="18" height="4.34" y="0" fill="#1f8a3b"/>' +
        '<rect width="18" height="4.34" y="4.33" fill="#f7d116"/>' +
        '<rect width="18" height="4.34" y="8.66" fill="#d81e34"/>' +
        '<circle cx="9" cy="6.5" r="3" fill="#0f4ea8"/>' +
      '</svg>',
    "Colombia":
      '<svg class="flag" viewBox="0 0 18 13" aria-hidden="true">' +
        '<rect width="18" height="6.5" y="0" fill="#fcd116"/>' +
        '<rect width="18" height="3.25" y="6.5" fill="#003893"/>' +
        '<rect width="18" height="3.25" y="9.75" fill="#ce1126"/>' +
      '</svg>',
    "Việt Nam":
      '<svg class="flag" viewBox="0 0 18 13" aria-hidden="true">' +
        '<rect width="18" height="13" fill="#da251d"/>' +
        '<polygon points="9,2.5 10,5.13 12.8,5.26 10.62,7.03 11.35,9.74 9,8.2 6.65,9.74 7.38,7.03 5.2,5.26 8,5.13" fill="#ff0"/>' +
      '</svg>'
  };
  function countryFlag(c) {
    return FLAGS[c] ||
      '<svg class="flag" viewBox="0 0 18 13" aria-hidden="true"><rect width="18" height="13" fill="#8b8fa0"/></svg>';
  }

  function isOnSale(p) { return p.salePriceVnd && p.salePriceVnd < p.priceVnd; }
  function saleOff(p) { return Math.round((1 - p.salePriceVnd / p.priceVnd) * 100); }

  /* Status badge stack markup (shared by card + product detail) */
  function statusBadgesHtml(p) {
    var s = "";
    if (p.bestseller) s += '<span class="status status--best">' + ICONS.fire + t("status.best") + '</span>';
    if (p.isNew)      s += '<span class="status status--new">' + ICONS.star + t("status.new") + '</span>';
    if (p.limited)    s += '<span class="status status--limited">' + ICONS.gem + t("status.limited") + '</span>';
    if (p.lowStock)   s += '<span class="status status--low">' + ICONS.clock + t("status.low") + '</span>';
    return s;
  }
  function saleBadgeHtml(p) {
    return isOnSale(p) ? '<span class="card__sale">' + ICONS.spark + '-' + saleOff(p) + '%</span>' : "";
  }

  function cardHtml(p) {
    var tags = (p.flavorNotes || "")
      .split(",").map(function (t) { return t.trim(); }).filter(Boolean)
      .slice(0, 3)
      .map(function (t) { return '<span class="tag">' + t + '</span>'; }).join("");

    var status = statusBadgesHtml(p);

    var onSale = isOnSale(p);
    var saleBadge = saleBadgeHtml(p);
    var priceHtml = '<span class="card__price">' + fmt(p.priceVnd) + '</span>';
    if (onSale) {
      priceHtml =
        '<span class="card__price-group">' +
          '<span class="card__price card__price--sale">' + fmt(p.salePriceVnd) + '</span>' +
          '<span class="card__price-old">' + fmt(p.priceVnd) + '</span>' +
        '</span>';
    }

    var unit = onSale ? p.salePriceVnd : p.priceVnd;
    return (
      '<a href="product.html?slug=' + p.slug + '" class="card card--catalog reveal" data-country="' + p.country + '" data-price="' + unit + '">' +
        '<div class="card__media">' +
          (status ? '<div class="card__status">' + status + '</div>' : '') +
          saleBadge +
          '<span class="card__country">' + countryFlag(p.country) + countryLabel(p.country) + '</span>' +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" />' +
          '<button class="card__add" type="button" data-add data-slug="' + p.slug + '" data-price="' + unit + '" aria-label="' + t("prod.addToCart") + '">+</button>' +
        '</div>' +
        '<div class="card__info">' +
          (tags ? '<div class="card__tags">' + tags + '</div>' : '') +
          '<div class="card__foot">' +
            priceHtml +
            '<span class="card__cta" aria-hidden="true">→</span>' +
          '</div>' +
        '</div>' +
      '</a>'
    );
  }

  /* ---------- Render: collection grid ---------- */
  var grid = document.getElementById("grid");
  if (grid) {
    var filters = document.getElementById("filters");
    var sortSel = document.getElementById("sort");
    var emptyMsg = document.getElementById("empty-msg");
    var activeFilter = "all";

    function renderGrid() {
      var list = PRODUCTS.filter(function (p) {
        return activeFilter === "all" || p.country === activeFilter;
      });
      var sort = sortSel ? sortSel.value : "featured";
      if (sort === "price-asc") list.sort(function (a, b) { return a.priceVnd - b.priceVnd; });
      else if (sort === "price-desc") list.sort(function (a, b) { return b.priceVnd - a.priceVnd; });

      grid.innerHTML = list.map(cardHtml).join("");
      if (emptyMsg) emptyMsg.style.display = list.length ? "none" : "block";
      initReveal();
      initAddButtons();
    }

    if (filters) {
      filters.addEventListener("click", function (e) {
        var chip = e.target.closest(".chip");
        if (!chip) return;
        filters.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
        chip.classList.add("is-active");
        activeFilter = chip.dataset.filter;
        renderGrid();
      });
    }
    if (sortSel) sortSel.addEventListener("change", renderGrid);
    renderGrid();
  }

  /* ---------- Render: homepage featured ---------- */
  var featured = document.getElementById("featured");
  if (featured) {
    featured.innerHTML = PRODUCTS.slice(0, 3).map(cardHtml).join("");
  }

  /* ---------- Render: product detail ---------- */
  var productRoot = document.getElementById("product-root");
  if (productRoot) {
    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");
    var p = window.getProductBySlug(slug) || PRODUCTS[0];

    document.title = p.name + " — Donkey Coffee Roastery";
    var crumb = document.getElementById("crumb-name");
    if (crumb) crumb.textContent = p.shortName || p.name;

    var gallery = [p.image, p.regionImage, p.farmImage]
      .concat((p.extraImages || []).map(function (x) { return x.src; }))
      .filter(Boolean);

    var notes = p.flavorNotes.split(",").map(function (n) {
      return "<span>" + n.trim() + "</span>";
    }).join("");

    var specs = [
      [t("prod.specProducer"), p.producer],
      [t("prod.specVarietal"), p.varietal],
      [t("prod.specProcess"), p.process],
      [t("prod.specRegion"), p.region],
      [t("prod.specAltitude"), p.altitude],
      [t("prod.specYear"), p.year]
    ].filter(function (r) { return r[1]; })
      .map(function (r) { return '<li><span class="k">' + r[0] + '</span><span>' + r[1] + '</span></li>'; })
      .join("");

    var dOnSale = isOnSale(p);
    var dStatus = statusBadgesHtml(p);
    var priceBlock = dOnSale
      ? '<div class="price price--sale" id="price">' +
          '<span class="price-now">' + fmt(p.salePriceVnd) + '</span>' +
          '<span class="price-old">' + fmt(p.priceVnd) + '</span>' +
          '<span class="price-off">-' + saleOff(p) + '%</span>' +
        '</div>'
      : '<div class="price" id="price">' + fmt(p.priceVnd) + '</div>';

    productRoot.innerHTML =
      '<section class="product">' +
        '<div class="gallery">' +
          '<div class="gallery__main">' +
            (dStatus ? '<div class="card__status">' + dStatus + '</div>' : '') +
            saleBadgeHtml(p) +
            '<span class="card__country">' + countryFlag(p.country) + countryLabel(p.country) + '</span>' +
            '<img id="gallery-main" src="' + gallery[0] + '" alt="' + p.name + '" />' +
          '</div>' +
          '<div class="gallery__thumbs">' +
            gallery.map(function (src, i) {
              return '<button class="gallery__thumb' + (i === 0 ? " is-active" : "") + '" data-src="' + src + '"><img src="' + src + '" alt="" loading="lazy" /></button>';
            }).join("") +
          '</div>' +
        '</div>' +
        '<div class="product-info">' +
          '<span class="eyebrow">' + p.process + ' · ' + p.region + '</span>' +
          '<h1>' + p.name + '</h1>' +
          priceBlock +
          '<div class="flavor-tags">' + notes + '</div>' +
          '<p class="desc">' + L(p.description) + '</p>' +
          '<div class="option-group">' +
            '<span class="option-group__label">' + t("prod.weight") + '</span>' +
            '<div class="weight" id="weight">' +
              '<div class="weight__stage lvl-0">' +
                '<div class="weight__mascot">' +
                  '<span class="weight__aura"></span>' +
                  '<span class="weight__bolts"><i></i><i></i><i></i></span>' +
                  '<img class="weight__donkey" src="assets/logo-donkey.png" alt="" />' +
                '</div>' +
                '<div class="weight__mood">' +
                  '<span class="weight__mood-label">' + t("prod.w0Label") + '</span>' +
                  '<span class="weight__mood-sub">' + t("prod.w0Sub") + '</span>' +
                '</div>' +
              '</div>' +
              '<input class="weight__range" id="weight-range" type="range" min="0" max="2" step="1" value="0" aria-label="' + t("prod.weightAria") + '" />' +
              '<div class="weight__marks">' +
                '<button type="button" class="weight__mark is-active" data-i="0"><span class="weight__caf">&#9749;</span>100g</button>' +
                '<button type="button" class="weight__mark" data-i="1"><span class="weight__caf">&#9749;&#9749;</span>250g</button>' +
                '<button type="button" class="weight__mark" data-i="2"><span class="weight__caf">&#9889;&#9889;&#9889;</span>500g</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="option-group"><span class="option-group__label">' + t("prod.form") + '</span>' +
            '<div class="option-row" data-group="grind">' +
              '<button class="option is-active" data-hint="' + t("prod.grindWholeHint") + '">' + t("prod.grindWhole") + '</button>' +
              '<button class="option" data-hint="' + t("prod.grindPouroverHint") + '">' + t("prod.grindPourover") + '</button>' +
              '<button class="option" data-hint="' + t("prod.grindEspressoHint") + '">' + t("prod.grindEspresso") + '</button>' +
              '<button class="option" data-hint="' + t("prod.grindPhinHint") + '">' + t("prod.grindPhin") + '</button>' +
            '</div>' +
            '<p class="option-hint" id="grind-hint"></p>' +
          '</div>' +
          '<div class="buy-row">' +
            '<div class="qty"><button id="qty-minus" aria-label="' + t("prod.qtyMinus") + '">−</button>' +
            '<input id="qty" type="text" value="1" inputmode="numeric" aria-label="' + t("prod.qtyAria") + '" />' +
            '<button id="qty-plus" aria-label="' + t("prod.qtyPlus") + '">+</button></div>' +
            '<button class="btn" id="add-to-cart">' + t("prod.addToCart") + '</button>' +
            '<button class="btn btn--ghost" id="buy-now">' + t("prod.buyNow") + '</button>' +
          '</div>' +
          '<ul class="spec-list">' + specs + '</ul>' +
        '</div>' +
      '</section>';

    var basePrice = dOnSale ? p.salePriceVnd : p.priceVnd;
    var baseOrig = p.priceVnd;

    /* Story block (integrated) */
    var storyRoot = document.getElementById("story-root");
    if (storyRoot) {
      storyRoot.innerHTML =
        '<div class="container">' +
          '<p class="eyebrow reveal" style="text-align:center;margin-bottom:1rem">' + t("prod.storyEyebrow") + '</p>' +
          '<h2 class="reveal" style="text-align:center;font-size:clamp(1.8rem,4vw,3rem);max-width:20ch;margin-inline:auto;margin-bottom:var(--sp-5)">' + t("prod.storyFrom") + p.region + t("prod.storyToCup") + '</h2>' +
          '<div class="editorial">' +
            '<div class="editorial__media reveal"><span class="editorial__tag">' + t("prod.tagRegion") + '</span><img src="' + p.regionImage + '" alt="' + t("prod.altRegion") + p.region + '" /></div>' +
            '<div class="editorial__body reveal story-prose">' + L(p.storyHtml) + '</div>' +
          '</div>' +
          (p.farmImage ?
            '<div class="editorial editorial--reverse" style="margin-top:var(--sp-5)">' +
              '<div class="editorial__media reveal"><span class="editorial__tag">' + t("prod.tagFarm") + '</span><img src="' + p.farmImage + '" alt="' + t("prod.altFarm") + p.producer + '" /></div>' +
              '<div class="editorial__body reveal">' +
                '<p class="eyebrow">' + t("prod.producerEyebrow") + '</p>' +
                '<h2>' + p.producer + '</h2>' +
                '<div class="story-stat">' +
                  '<div><span class="n">' + (p.altitude || "—") + '</span><span class="l">' + t("prod.statAltitude") + '</span></div>' +
                  '<div><span class="n">' + p.process + '</span><span class="l">' + t("prod.statProcess") + '</span></div>' +
                  '<div><span class="n">' + p.varietal + '</span><span class="l">' + t("prod.statVarietal") + '</span></div>' +
                '</div>' +
              '</div>' +
            '</div>' : "") +
        '</div>';
    }

    /* Related */
    var relatedRoot = document.getElementById("related-grid");
    if (relatedRoot) {
      relatedRoot.innerHTML = PRODUCTS.filter(function (x) { return x.slug !== p.slug; })
        .slice(0, 4).map(cardHtml).join("");
    }

    /* Gallery thumbs */
    var galleryMain = document.getElementById("gallery-main");
    document.querySelectorAll(".gallery__thumb").forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        document.querySelectorAll(".gallery__thumb").forEach(function (t) { t.classList.remove("is-active"); });
        thumb.classList.add("is-active");
        if (galleryMain && thumb.dataset.src) galleryMain.src = thumb.dataset.src;
      });
    });

    var priceEl = document.getElementById("price");
    var roundK = function (n) { return Math.round(n / 1000) * 1000; };
    function updatePrice(mult) {
      if (!priceEl) return;
      if (dOnSale) {
        var now = priceEl.querySelector(".price-now");
        var old = priceEl.querySelector(".price-old");
        if (now) now.textContent = fmt(roundK(basePrice * mult));
        if (old) old.textContent = fmt(roundK(baseOrig * mult));
      } else {
        priceEl.textContent = fmt(roundK(basePrice * mult));
      }
    }

    /* Grind options (no price change) + explainer hint */
    var grindHint = document.getElementById("grind-hint");
    function setGrindHint(opt) {
      if (grindHint && opt && opt.dataset.hint) grindHint.textContent = opt.dataset.hint;
    }
    document.querySelectorAll(".option-row").forEach(function (row) {
      row.addEventListener("click", function (e) {
        var opt = e.target.closest(".option");
        if (!opt) return;
        row.querySelectorAll(".option").forEach(function (o) { o.classList.remove("is-active"); });
        opt.classList.add("is-active");
        if (row.dataset.group === "grind") setGrindHint(opt);
      });
    });
    setGrindHint(document.querySelector('[data-group="grind"] .option.is-active'));

    /* Weight slider — donkey gets more caffeinated by level */
    var WEIGHT_LEVELS = [
      { mult: 1,   label: t("prod.w0Label"), sub: t("prod.w0Sub"), img: "assets/logo-donkey.png" },
      { mult: 2.3, label: t("prod.w1Label"), sub: t("prod.w1Sub"), img: "assets/logo-donkey.png" },
      { mult: 4.2, label: t("prod.w2Label"), sub: t("prod.w2Sub"), img: "assets/logo-donkey.png" }
    ];
    var weightEl = document.getElementById("weight");
    if (weightEl) {
      var range = document.getElementById("weight-range");
      var stage = weightEl.querySelector(".weight__stage");
      var donkeyImg = weightEl.querySelector(".weight__donkey");
      var moodLabel = weightEl.querySelector(".weight__mood-label");
      var moodSub = weightEl.querySelector(".weight__mood-sub");
      var marks = weightEl.querySelectorAll(".weight__mark");

      var setWeight = function (i, bounce) {
        i = Math.max(0, Math.min(2, i | 0));
        var lv = WEIGHT_LEVELS[i];
        if (range) range.value = i;
        stage.className = "weight__stage lvl-" + i + (bounce ? " is-pop" : "");
        if (donkeyImg && donkeyImg.getAttribute("src") !== lv.img) donkeyImg.src = lv.img;
        moodLabel.textContent = lv.label;
        moodSub.textContent = lv.sub;
        marks.forEach(function (m, mi) { m.classList.toggle("is-active", mi === i); });
        updatePrice(lv.mult);
        if (bounce) { void stage.offsetWidth; stage.classList.add("is-pop"); }
      };

      if (range) range.addEventListener("input", function () { setWeight(parseInt(range.value, 10), true); });
      marks.forEach(function (m) {
        m.addEventListener("click", function () { setWeight(parseInt(m.dataset.i, 10), true); });
      });
      setWeight(0, false);
    }

    /* Quantity */
    var qty = document.getElementById("qty");
    function setQty(v) { if (qty) qty.value = Math.max(1, v); }
    var minus = document.getElementById("qty-minus");
    var plus = document.getElementById("qty-plus");
    if (minus) minus.addEventListener("click", function () { setQty(parseInt(qty.value || "1", 10) - 1); });
    if (plus) plus.addEventListener("click", function () { setQty(parseInt(qty.value || "1", 10) + 1); });
    if (qty) qty.addEventListener("input", function () { qty.value = qty.value.replace(/\D/g, ""); });
    var WEIGHT_GRAMS = [100, 250, 500];
    function currentSelection() {
      var idx = 0;
      var activeMark = weightEl && weightEl.querySelector(".weight__mark.is-active");
      if (activeMark) idx = parseInt(activeMark.dataset.i, 10) || 0;
      var lv = WEIGHT_LEVELS[idx] || { mult: 1 };
      var grindBtn = document.querySelector('[data-group="grind"] .option.is-active');
      var grind = grindBtn ? grindBtn.textContent.trim() : t("prod.grindWhole");
      var unit = Math.round((basePrice * lv.mult) / 1000) * 1000;
      var q = parseInt((qty && qty.value) || "1", 10);
      if (!isFinite(q) || q < 1) q = 1;
      return { qty: q, grind: grind, weightG: WEIGHT_GRAMS[idx] || 100, unitPrice: unit };
    }

    var atc = document.getElementById("add-to-cart");
    if (atc) atc.addEventListener("click", function () {
      var sel = currentSelection();
      if (window.Cart) {
        window.Cart.addItem({ slug: p.slug, qty: sel.qty, grind: sel.grind, weightG: sel.weightG, unitPrice: sel.unitPrice });
      }
      celebrate(atc);
      var orig = atc.dataset.label || atc.textContent;
      atc.dataset.label = orig;
      atc.classList.add("is-success");
      atc.textContent = t("prod.added");
      clearTimeout(atc._t);
      atc._t = setTimeout(function () {
        atc.classList.remove("is-success");
        atc.textContent = orig;
      }, 1400);
    });

    var buyNow = document.getElementById("buy-now");
    if (buyNow) buyNow.addEventListener("click", function () {
      var sel = currentSelection();
      if (window.Cart) {
        window.Cart.addItem({ slug: p.slug, qty: sel.qty, grind: sel.grind, weightG: sel.weightG, unitPrice: sel.unitPrice });
      }
      celebrate(buyNow);
      setTimeout(function () { window.location.href = "checkout.html"; }, 220);
    });
  }

  /* ---------- Field Notes ---------- */
  function noteCardHtml(n) {
    return (
      '<a class="note reveal" href="field-note.html?slug=' + n.slug + '">' +
        '<div class="note__media"><img src="' + n.cover + '" alt="' + L(n.title) + '" loading="lazy" /></div>' +
        '<div class="note__body">' +
          '<p class="note__meta">' + L(n.category) + ' · ' + L(n.readTime) + '</p>' +
          '<h3 class="note__title">' + L(n.title) + '</h3>' +
          '<p>' + L(n.excerpt) + '</p>' +
        '</div>' +
      '</a>'
    );
  }

  var noteFeatured = document.getElementById("note-featured");
  if (noteFeatured && NOTES.length) {
    var f = NOTES[0];
    noteFeatured.innerHTML =
      '<a class="editorial reveal" href="field-note.html?slug=' + f.slug + '">' +
        '<div class="editorial__media"><span class="editorial__tag">' + L(f.category) + '</span><img src="' + f.cover + '" alt="' + L(f.title) + '" /></div>' +
        '<div class="editorial__body">' +
          '<p class="note__meta">' + f.date + ' · ' + L(f.readTime) + '</p>' +
          '<h2 style="font-size:clamp(2rem,4.5vw,3.4rem);margin:0.5rem 0 1rem">' + L(f.title) + '</h2>' +
          '<p class="lead">' + L(f.excerpt) + '</p>' +
          '<span class="link-arrow" style="display:inline-block;margin-top:1.5rem">' + t("notes.read") + '</span>' +
        '</div>' +
      '</a>';
  }

  var notesGrid = document.getElementById("notes-grid");
  if (notesGrid) {
    notesGrid.innerHTML = NOTES.slice(1).map(noteCardHtml).join("");
  }

  var homeNotes = document.getElementById("home-notes");
  if (homeNotes) {
    homeNotes.innerHTML = NOTES.slice(0, 3).map(noteCardHtml).join("");
  }

  var articleRoot = document.getElementById("article-root");
  if (articleRoot) {
    var nparams = new URLSearchParams(window.location.search);
    var note = window.getNoteBySlug(nparams.get("slug")) || NOTES[0];
    document.title = L(note.title) + " — Donkey Coffee Roastery";
    var ncrumb = document.getElementById("crumb-name");
    if (ncrumb) ncrumb.textContent = L(note.title);

    var related = PRODUCTS && note.productSlug ? window.getProductBySlug(note.productSlug) : null;
    var productCta = related
      ? '<aside class="article-cta reveal">' +
          '<div class="article-cta__media"><img src="' + related.image + '" alt="' + related.name + '" /></div>' +
          '<div><p class="eyebrow">' + t("note.ctaEyebrow") + '</p><h3 style="font-family:var(--font-display);font-size:1.5rem;margin:0.3rem 0 0.6rem">' + related.shortName + '</h3>' +
          '<p class="muted" style="margin:0 0 1rem">' + related.flavorNotes + '</p>' +
          '<a class="btn" href="product.html?slug=' + related.slug + '">' + t("note.ctaView") + fmt(related.priceVnd) + '</a></div>' +
        '</aside>'
      : "";

    articleRoot.innerHTML =
      '<header class="article-head container container--narrow">' +
        '<p class="eyebrow reveal">' + L(note.category) + '</p>' +
        '<h1 class="reveal">' + L(note.title) + '</h1>' +
        '<p class="article-meta reveal">' + note.date + ' · ' + L(note.readTime) + '</p>' +
      '</header>' +
      '<div class="article-cover reveal"><img src="' + note.cover + '" alt="' + L(note.title) + '" /></div>' +
      '<div class="article-body container container--narrow reveal">' + L(note.contentHtml) + productCta + '</div>';

    var notesRelated = document.getElementById("notes-related");
    if (notesRelated) {
      notesRelated.innerHTML = NOTES.filter(function (n) { return n.slug !== note.slug; })
        .slice(0, 3).map(noteCardHtml).join("");
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById("header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var mobileNav = document.getElementById("mobile-nav");
  var navToggle = document.getElementById("nav-toggle");
  var navClose = document.getElementById("nav-close");
  if (navToggle) navToggle.addEventListener("click", function () { mobileNav.classList.add("is-open"); });
  if (navClose) navClose.addEventListener("click", function () { mobileNav.classList.remove("is-open"); });
  if (mobileNav) mobileNav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { mobileNav.classList.remove("is-open"); });
  });

  /* ---------- Add-to-cart (delegated for dynamic + static cards) ---------- */
  function initAddButtons() {
    document.querySelectorAll("[data-add]").forEach(function (btn) {
      if (btn.__bound) return;
      btn.__bound = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var slug = btn.dataset.slug;
        if (!slug || !window.Cart) return;
        var p = window.getProductBySlug ? window.getProductBySlug(slug) : null;
        var unit = parseInt(btn.dataset.price, 10);
        if (!isFinite(unit) || unit <= 0) {
          unit = p ? (p.salePriceVnd && p.salePriceVnd < p.priceVnd ? p.salePriceVnd : p.priceVnd) : 0;
        }
        window.Cart.addItem({
          slug: slug, qty: 1,
          grind: t("prod.grindWhole"),
          weightG: 100,
          unitPrice: unit
        });
        celebrate(btn);
      });
    });
  }
  initAddButtons();

  /* ---------- Scroll reveal ---------- */
  var io;
  function initReveal() {
    var reveals = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    reveals.forEach(function (el) { io.observe(el); });
  }
  initReveal();

  /* ---------- Product card 3D tilt ---------- */
  (function initCardTilt() {
    var noHover = window.matchMedia("(hover: none)").matches;
    var reduce  = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noHover || reduce) return;

    var MAX_TILT = 7; /* degrees */
    var LIFT     = "translateY(-8px)";

    function applyTilt(card, e) {
      var r  = card.getBoundingClientRect();
      var cx = (e.clientX - r.left) / r.width  - 0.5;  /* -0.5 … 0.5 */
      var cy = (e.clientY - r.top)  / r.height - 0.5;
      var rx = (-cy * MAX_TILT).toFixed(2);
      var ry = ( cx * MAX_TILT).toFixed(2);
      card.style.transform = LIFT + " perspective(600px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
    }

    function resetTilt(card) {
      card.style.transform = "";
    }

    /* Use event delegation on document so dynamically added cards work */
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest(".card--catalog");
      if (card) applyTilt(card, e);
    });
    document.addEventListener("mouseleave", function (e) {
      var card = e.target.closest && e.target.closest(".card--catalog");
      if (card) resetTilt(card);
    }, true);
    document.addEventListener("mouseout", function (e) {
      var card = e.target.closest && e.target.closest(".card--catalog");
      if (card && !card.contains(e.relatedTarget)) resetTilt(card);
    });
  })();

  /* ---------- Shared footer (rendered on every page) ---------- */
  (function renderFooter() {
    var footers = document.querySelectorAll(".site-footer");
    if (!footers.length) return;

    var social = {
      ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
      fb: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/></svg>',
      tt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.1 3c.3 2 1.5 3.5 3.5 3.7v2.6c-1.1.1-2.3-.2-3.5-.9v6c0 3.1-2.2 5.3-5.1 5.3-2.9 0-4.9-2.2-4.9-4.9 0-2.7 2.1-4.8 5.1-4.6v2.7c-.4-.1-.9-.2-1.3-.1-1.1.1-1.9 1-1.9 2.1 0 1.2 1 2.1 2.1 2.1 1.3 0 2.1-1 2.1-2.5V3h3.8z"/></svg>',
      st: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.6 2 4.5 14.4h3.6L10.6 9l2.5 5.4h3.5L10.6 2zm2.9 12.4-1.5 3-1.5-3H8.1l3.9 7.6 3.9-7.6h-2.4z"/></svg>'
    };
    function socialBtn(key, label, href) {
      return '<a class="social" href="' + href + '" target="_blank" rel="noopener" aria-label="' + label + '">' + social[key] + '</a>';
    }

    var ADDRESS = "37/139 Chương Dương Độ, Hoàn Kiếm, Hà Nội, 100000";
    var FB_URL = "https://web.facebook.com/profile.php?id=61556406970426";
    var IG_URL = "https://www.instagram.com/donkey.coffee.roastery/";
    var mapSrc = "https://www.google.com/maps?q=" + encodeURIComponent(ADDRESS) + "&output=embed";
    var mapLink = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ADDRESS);

    var html =
      '<div class="container">' +
        /* Top: invite + map */
        '<div class="footer-top">' +
          '<div class="footer-cta">' +
            '<p class="eyebrow">' + t("footer.visitEyebrow") + '</p>' +
            '<h3 class="footer-cta__title">' + t("footer.visitTitle") + '</h3>' +
            '<ul class="footer-info">' +
              '<li><span class="footer-info__ic" aria-hidden="true">' + ICONS.pin + '</span>37/139 Chương Dương Độ, Hoàn Kiếm, Hà Nội</li>' +
              '<li><span class="footer-info__ic" aria-hidden="true">' + ICONS.clock2 + '</span>' + t("footer.hours") + '</li>' +
              '<li><span class="footer-info__ic" aria-hidden="true">' + ICONS.phone + '</span><a href="tel:+84919993638">091 999 36 38</a></li>' +
            '</ul>' +
            '<a class="btn" href="' + mapLink + '" target="_blank" rel="noopener">' + t("footer.directions") + '</a>' +
          '</div>' +
          '<a class="footer-map" href="' + mapLink + '" target="_blank" rel="noopener" aria-label="' + t("footer.mapAria") + '">' +
            '<iframe title="' + t("footer.mapAria") + '" src="' + mapSrc + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
            '<span class="footer-map__pin">' + ICONS.pin + '</span>' +
          '</a>' +
        '</div>' +

        /* Mid: brand + links + social */
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a href="index.html" class="brand" aria-label="Donkey Coffee Roastery"><img class="brand__logo brand__logo--mark" src="assets/logo-full.png" alt="Donkey Coffee Roastery" /></a>' +
            '<p class="muted" style="max-width:34ch;margin-top:1rem">' + t("footer.brandDesc") + '</p>' +
            '<div class="socials">' +
              socialBtn("ig", "Instagram", IG_URL) +
              socialBtn("fb", "Facebook", FB_URL) +
            '</div>' +
          '</div>' +
          '<div><h4>' + t("footer.shopHead") + '</h4><ul><li><a href="collection.html">' + t("footer.shopBeans") + '</a></li><li><a href="collection.html">' + t("footer.shopOutdoor") + '</a></li><li><a href="collection.html">' + t("footer.shopTools") + '</a></li><li><a href="collection.html">' + t("footer.shopGift") + '</a></li></ul></div>' +
          '<div><h4>' + t("footer.donkeyHead") + '</h4><ul><li><a href="about.html">' + t("footer.story") + '</a></li><li><a href="field-notes.html">' + t("footer.notes") + '</a></li><li><a href="about.html#visit">' + t("footer.visit") + '</a></li><li><a href="#">' + t("footer.contact") + '</a></li></ul></div>' +
        '</div>' +

        /* Bottom */
        '<div class="footer-bottom">' +
          '<span>' + t("footer.copy") + '</span>' +
          '<button class="footer-totop" type="button" data-totop>' + t("footer.backToTop") + ' ' + ICONS.arrowUp + '</button>' +
          '<span>' + t("footer.legal") + '</span>' +
        '</div>' +
      '</div>';

    footers.forEach(function (f) { f.innerHTML = html; });
  })();

  /* ---------- Slogan typewriter (vanilla port of the React component) ---------- */
  (function initTypewriter() {
    var root = document.getElementById("slogan-tw");
    if (!root) return;
    var textEl = root.querySelector(".tw-text");
    if (!textEl) return;
    var iconEl = root.querySelector(".tw-icon");

    var phrases = ["love", "care", "share", "fun"];
    var ICON = {
      love: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
      fun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>',
      care: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>',
      share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>'
    };
    function setIcon(word) {
      if (!iconEl) return;
      iconEl.innerHTML = ICON[word] || "";
      iconEl.classList.remove("is-pop");
      void iconEl.offsetWidth;
      iconEl.classList.add("is-pop");
    }
    var speed = 55;        // typing speed (ms/char)
    var deleteSpeed = 28;  // deleting speed
    var waitTime = 6000;   // pause when a phrase is fully typed
    var initialDelay = 350;
    var loop = true;

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || phrases.length === 0) {
      textEl.textContent = phrases[0] || "";
      if (iconEl) iconEl.innerHTML = ICON[phrases[0]] || "";
      return;
    }

    var ti = 0, ci = 0, deleting = false, timer = null, shownTi = -1;

    function tick() {
      var cur = phrases[ti];
      if (!deleting && ci === 0 && shownTi !== ti) {
        setIcon(cur);
        shownTi = ti;
      }
      if (deleting) {
        if (ci > 0) {
          ci -= 1;
          textEl.textContent = cur.slice(0, ci);
          timer = setTimeout(tick, deleteSpeed);
        } else {
          deleting = false;
          ti = (ti + 1) % phrases.length;
          if (ti === 0 && !loop) return;
          timer = setTimeout(tick, speed);
        }
      } else {
        if (ci < cur.length) {
          ci += 1;
          textEl.textContent = cur.slice(0, ci);
          timer = setTimeout(tick, speed);
        } else if (phrases.length > 1 || loop) {
          timer = setTimeout(function () { deleting = true; tick(); }, waitTime);
        }
      }
    }

    textEl.textContent = "";
    timer = setTimeout(tick, initialDelay);
  })();

  /* ---------- Homepage image carousel (coverflow) ---------- */
  (function initHomeCarousel() {
    var root = document.getElementById("home-carousel");
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var n = slides.length;
    if (n < 2) return;

    var cur = 0;

    function render() {
      slides.forEach(function (s, i) {
        s.classList.remove("is-center", "is-prev", "is-next");
        var off = (i - cur + n) % n;
        if (off === 0) s.classList.add("is-center");
        else if (off === n - 1) s.classList.add("is-prev");
        else if (off === 1) s.classList.add("is-next");
      });
    }

    function go(i) { cur = (i + n) % n; render(); }

    slides.forEach(function (s, i) {
      s.addEventListener("click", function () {
        if (!s.classList.contains("is-center")) go(i);
      });
    });

    render();
  })();

  /* ---------- Homepage 4-cell nav (touch tap-to-open) ---------- */
  (function initHomeNav() {
    /* Mobile now shows all sub-items always visible — no accordion needed.
       Title and sub links both navigate directly on tap. */
  })();

  /* ---------- Back-to-top (floating + footer button) ---------- */
  (function initBackToTop() {
    var btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.type = "button";
    btn.setAttribute("aria-label", t("common.backToTop"));
    btn.innerHTML = ICONS.arrowUp;
    document.body.appendChild(btn);

    var scrollTop = function () {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    };
    btn.addEventListener("click", scrollTop);
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-totop]")) scrollTop();
    });

    var onScroll = function () {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

})();
