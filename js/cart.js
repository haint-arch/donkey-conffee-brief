/* Donkey Coffee Roastery — cart store + drawer + checkout (prototype, localStorage only) */
(function () {
  "use strict";

  var STORE_KEY = "donkeyCart";
  var SHIP_FEE = 30000;
  var FREE_SHIP_THRESHOLD = 500000;
  var EVT = "donkey:cart";

  var t = window.t || function (k) { return k; };
  var fmt = window.formatVnd || function (n) { return n.toLocaleString("vi-VN") + "đ"; };

  /* ---------- Store ---------- */
  function read() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function write(items) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(items)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent(EVT, { detail: { items: items } })); } catch (e2) {
      var ev = document.createEvent("Event"); ev.initEvent(EVT, true, true); window.dispatchEvent(ev);
    }
  }
  function keyOf(it) { return it.slug + "|" + (it.grind || "") + "|" + (it.weightG || 0); }
  function count() {
    return read().reduce(function (s, x) { return s + (x.qty || 0); }, 0);
  }
  function subtotal() {
    return read().reduce(function (s, x) { return s + (x.unitPrice || 0) * (x.qty || 0); }, 0);
  }
  function shipFee(sub) {
    var s = sub != null ? sub : subtotal();
    if (s <= 0) return 0;
    return s >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FEE;
  }
  function total() { var s = subtotal(); return s + shipFee(s); }

  function addItem(item) {
    if (!item || !item.slug) return;
    var qty = Math.max(1, parseInt(item.qty || 1, 10));
    var line = {
      slug: String(item.slug),
      qty: qty,
      grind: item.grind || "",
      weightG: parseInt(item.weightG || 0, 10),
      unitPrice: Math.max(0, parseInt(item.unitPrice || 0, 10))
    };
    line.key = keyOf(line);
    var items = read();
    var idx = -1;
    for (var i = 0; i < items.length; i++) {
      if (keyOf(items[i]) === line.key) { idx = i; break; }
    }
    if (idx >= 0) {
      items[idx].qty = (items[idx].qty || 0) + line.qty;
      items[idx].unitPrice = line.unitPrice;
    } else {
      items.push(line);
    }
    write(items);
  }
  function setQty(key, qty) {
    var items = read();
    var next = [];
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (keyOf(it) === key) {
        var q = parseInt(qty, 10);
        if (!isFinite(q) || q <= 0) continue;
        it.qty = q;
      }
      next.push(it);
    }
    write(next);
  }
  function removeItem(key) {
    var items = read().filter(function (it) { return keyOf(it) !== key; });
    write(items);
  }
  function clear() { write([]); }

  window.Cart = {
    items: read,
    addItem: addItem,
    setQty: setQty,
    removeItem: removeItem,
    clear: clear,
    count: count,
    subtotal: subtotal,
    shipFee: shipFee,
    total: total,
    keyOf: keyOf,
    SHIP_FEE: SHIP_FEE,
    FREE_SHIP_THRESHOLD: FREE_SHIP_THRESHOLD,
    EVENT: EVT
  };

  /* ---------- Sync .cart-count badges ---------- */
  function syncBadges() {
    var n = count();
    document.querySelectorAll(".cart-count").forEach(function (el) {
      var prev = el.textContent;
      el.textContent = n;
      el.classList.toggle("is-empty", n === 0);
      if (String(prev) !== String(n) && el.animate) {
        el.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.4)" }, { transform: "scale(1)" }],
          { duration: 280, easing: "ease-out" }
        );
      }
    });
  }

  /* ---------- Lookup product info ---------- */
  function product(slug) {
    if (typeof window.getProductBySlug === "function") return window.getProductBySlug(slug);
    var list = window.DONKEY_PRODUCTS || [];
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }

  /* ---------- Icons (local) ---------- */
  var X_SVG = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var TRASH_SVG = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>';

  /* ---------- Drawer ---------- */
  var drawer, overlay, listEl, emptyEl, subEl, shipEl, freeNoteEl, footerEl;

  function buildDrawer() {
    if (document.querySelector(".cart-drawer")) return;
    overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.setAttribute("aria-hidden", "true");
    document.body.appendChild(overlay);

    drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", t("cart.title"));
    drawer.setAttribute("aria-hidden", "true");
    drawer.innerHTML =
      '<div class="cart-drawer__head">' +
        '<h2 class="cart-drawer__title">' + t("cart.title") + '</h2>' +
        '<button type="button" class="cart-drawer__close" aria-label="' + t("cart.close") + '">' + X_SVG + '</button>' +
      '</div>' +
      '<div class="cart-drawer__body">' +
        '<ul class="cart-list" id="cart-list"></ul>' +
        '<div class="cart-empty" id="cart-empty">' +
          '<p class="cart-empty__title">' + t("cart.empty") + '</p>' +
          '<p class="cart-empty__sub">' + t("cart.emptySub") + '</p>' +
          '<a href="collection.html" class="btn">' + t("cart.continueShop") + '</a>' +
        '</div>' +
      '</div>' +
      '<div class="cart-drawer__foot" id="cart-foot">' +
        '<p class="cart-free-note" id="cart-free-note"></p>' +
        '<div class="cart-totals">' +
          '<span>' + t("cart.subtotal") + '</span>' +
          '<strong id="cart-subtotal">0</strong>' +
        '</div>' +
        '<div class="cart-totals cart-totals--ship">' +
          '<span>' + t("cart.shipping") + '</span>' +
          '<span id="cart-ship">' + t("cart.calcAtCheckout") + '</span>' +
        '</div>' +
        '<a class="btn cart-drawer__checkout" href="checkout.html">' + t("cart.checkout") + '</a>' +
        '<button type="button" class="btn btn--ghost cart-drawer__continue">' + t("cart.continueShop") + '</button>' +
      '</div>';
    document.body.appendChild(drawer);

    listEl = drawer.querySelector("#cart-list");
    emptyEl = drawer.querySelector("#cart-empty");
    subEl = drawer.querySelector("#cart-subtotal");
    shipEl = drawer.querySelector("#cart-ship");
    freeNoteEl = drawer.querySelector("#cart-free-note");
    footerEl = drawer.querySelector("#cart-foot");

    overlay.addEventListener("click", closeDrawer);
    drawer.querySelector(".cart-drawer__close").addEventListener("click", closeDrawer);
    drawer.querySelector(".cart-drawer__continue").addEventListener("click", closeDrawer);

    /* line item interactions */
    listEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cart-act]");
      if (!btn) return;
      var li = btn.closest("[data-key]");
      if (!li) return;
      var key = li.getAttribute("data-key");
      var items = read();
      var cur = null;
      for (var i = 0; i < items.length; i++) if (keyOf(items[i]) === key) { cur = items[i]; break; }
      if (!cur) return;
      var act = btn.getAttribute("data-cart-act");
      if (act === "inc") setQty(key, (cur.qty || 0) + 1);
      else if (act === "dec") {
        var next = (cur.qty || 0) - 1;
        if (next <= 0) removeItem(key); else setQty(key, next);
      }
      else if (act === "remove") removeItem(key);
    });
  }

  function openDrawer() {
    buildDrawer();
    renderDrawer();
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("cart-open");
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cart-open");
  }

  function lineHtml(it) {
    var p = product(it.slug);
    var name = p ? (p.shortName || p.name) : it.slug;
    var img = p ? p.image : "assets/logo-donkey.png";
    var href = "product.html?slug=" + encodeURIComponent(it.slug);
    var meta = [];
    if (it.weightG) meta.push(it.weightG + "g");
    if (it.grind) meta.push(it.grind);
    var lineTotal = (it.unitPrice || 0) * (it.qty || 0);
    return (
      '<li class="cart-line" data-key="' + keyOf(it) + '">' +
        '<a class="cart-line__media" href="' + href + '"><img src="' + img + '" alt="' + name + '" loading="lazy" /></a>' +
        '<div class="cart-line__info">' +
          '<a class="cart-line__name" href="' + href + '">' + name + '</a>' +
          (meta.length ? '<p class="cart-line__meta">' + meta.join(" · ") + '</p>' : "") +
          '<p class="cart-line__price">' + fmt(it.unitPrice || 0) + '</p>' +
          '<div class="cart-line__row">' +
            '<div class="cart-stepper" role="group" aria-label="' + t("cart.qtyAria") + '">' +
              '<button type="button" data-cart-act="dec" aria-label="' + t("prod.qtyMinus") + '">−</button>' +
              '<span>' + (it.qty || 0) + '</span>' +
              '<button type="button" data-cart-act="inc" aria-label="' + t("prod.qtyPlus") + '">+</button>' +
            '</div>' +
            '<span class="cart-line__total">' + fmt(lineTotal) + '</span>' +
            '<button type="button" class="cart-line__remove" data-cart-act="remove" aria-label="' + t("cart.remove") + '">' + TRASH_SVG + '</button>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  }

  function renderDrawer() {
    if (!drawer) return;
    var items = read();
    if (!items.length) {
      listEl.innerHTML = "";
      listEl.style.display = "none";
      emptyEl.style.display = "";
      footerEl.style.display = "none";
      return;
    }
    listEl.style.display = "";
    emptyEl.style.display = "none";
    footerEl.style.display = "";
    listEl.innerHTML = items.map(lineHtml).join("");
    var sub = subtotal();
    subEl.textContent = fmt(sub);
    var ship = shipFee(sub);
    shipEl.textContent = ship === 0 ? t("cart.freeShip") : fmt(ship);
    if (sub > 0 && sub < FREE_SHIP_THRESHOLD) {
      var left = FREE_SHIP_THRESHOLD - sub;
      freeNoteEl.style.display = "";
      freeNoteEl.textContent = t("cart.freeShipHint1") + fmt(left) + t("cart.freeShipHint2");
    } else if (sub >= FREE_SHIP_THRESHOLD) {
      freeNoteEl.style.display = "";
      freeNoteEl.textContent = t("cart.freeShipReached");
    } else {
      freeNoteEl.style.display = "none";
      freeNoteEl.textContent = "";
    }
  }

  /* ---------- Bind cart button on every page ---------- */
  function bindCartButtons() {
    document.querySelectorAll("#cart-btn, [data-open-cart]").forEach(function (btn) {
      if (btn.__cartBound) return;
      btn.__cartBound = true;
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openDrawer();
      });
    });
  }

  /* ---------- Checkout page ---------- */
  function genOrderId() {
    var d = new Date();
    var pad = function (x) { return String(x).padStart(2, "0"); };
    var rand = Math.floor(1000 + Math.random() * 9000);
    return "DK-" + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand;
  }

  function checkoutLineHtml(it) {
    var p = product(it.slug);
    var name = p ? (p.shortName || p.name) : it.slug;
    var img = p ? p.image : "assets/logo-donkey.png";
    var meta = [];
    if (it.weightG) meta.push(it.weightG + "g");
    if (it.grind) meta.push(it.grind);
    var lineTotal = (it.unitPrice || 0) * (it.qty || 0);
    return (
      '<li class="co-line">' +
        '<div class="co-line__media"><img src="' + img + '" alt="' + name + '" /><span class="co-line__qty">' + (it.qty || 0) + '</span></div>' +
        '<div class="co-line__info">' +
          '<p class="co-line__name">' + name + '</p>' +
          (meta.length ? '<p class="co-line__meta">' + meta.join(" · ") + '</p>' : "") +
        '</div>' +
        '<span class="co-line__price">' + fmt(lineTotal) + '</span>' +
      '</li>'
    );
  }

  function renderCheckoutSummary() {
    var sumRoot = document.getElementById("checkout-summary");
    if (!sumRoot) return;
    var items = read();
    var sub = subtotal();
    var ship = shipFee(sub);
    var tot = sub + ship;
    sumRoot.innerHTML =
      '<h3 class="checkout-summary__title">' + t("checkout.orderTitle") + '</h3>' +
      (items.length
        ? '<ul class="co-list">' + items.map(checkoutLineHtml).join("") + '</ul>'
        : '<p class="muted">' + t("cart.empty") + '</p>') +
      '<dl class="co-totals">' +
        '<div><dt>' + t("cart.subtotal") + '</dt><dd>' + fmt(sub) + '</dd></div>' +
        '<div><dt>' + t("cart.shipping") + '</dt><dd>' + (ship === 0 && sub > 0 ? t("cart.freeShip") : fmt(ship)) + '</dd></div>' +
        '<div class="co-totals__grand"><dt>' + t("checkout.total") + '</dt><dd>' + fmt(tot) + '</dd></div>' +
      '</dl>';

    var placeBtn = document.getElementById("place-order");
    if (placeBtn) placeBtn.disabled = items.length === 0;
  }

  function initCheckout() {
    var root = document.getElementById("checkout-root");
    if (!root) return;

    renderCheckoutSummary();
    window.addEventListener(EVT, renderCheckoutSummary);

    var form = document.getElementById("checkout-form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!read().length) return;

      var required = form.querySelectorAll("[required]");
      var ok = true;
      var firstBad = null;
      required.forEach(function (el) {
        var bad = !el.value || !String(el.value).trim();
        el.classList.toggle("is-invalid", bad);
        if (bad && !firstBad) firstBad = el;
        if (bad) ok = false;
      });
      var emailEl = form.querySelector('input[type="email"]');
      if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.classList.add("is-invalid"); if (!firstBad) firstBad = emailEl; ok = false;
      }
      var phoneEl = form.querySelector('input[name="phone"]');
      if (phoneEl && phoneEl.value && !/^[0-9+\-\s()]{8,}$/.test(phoneEl.value)) {
        phoneEl.classList.add("is-invalid"); if (!firstBad) firstBad = phoneEl; ok = false;
      }
      if (!ok) {
        if (firstBad) firstBad.focus();
        return;
      }

      var orderId = genOrderId();
      var name = (form.querySelector('input[name="fullname"]') || {}).value || "";
      var pay = (form.querySelector('input[name="payment"]:checked') || {}).value || "cod";

      var success = document.getElementById("order-success");
      var formWrap = document.getElementById("checkout-form-wrap");
      var sumWrap = document.getElementById("checkout-summary-wrap");
      if (success) {
        var orderEl = success.querySelector("#success-order");
        var nameEl = success.querySelector("#success-name");
        var payEl = success.querySelector("#success-pay");
        if (orderEl) orderEl.textContent = orderId;
        if (nameEl) nameEl.textContent = name;
        if (payEl) payEl.textContent = pay === "bank" ? t("checkout.payBank") : t("checkout.payCod");
        success.hidden = false;
      }
      if (formWrap) formWrap.hidden = true;
      if (sumWrap) sumWrap.hidden = true;
      clear();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* live clear of invalid */
    form.addEventListener("input", function (e) {
      var el = e.target;
      if (el && el.classList && el.classList.contains("is-invalid")) el.classList.remove("is-invalid");
    });
  }

  /* ---------- Wire up on every page ---------- */
  function init() {
    bindCartButtons();
    syncBadges();
    initCheckout();
  }

  window.addEventListener(EVT, function () {
    syncBadges();
    if (drawer && drawer.classList.contains("is-open")) renderDrawer();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer();
  });

  window.openCart = openDrawer;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
