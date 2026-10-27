/**
 * AI Traveller - Language, theme and "Explore Near Your City" features.
 * Loaded after data.js, explore-data.js and script.js. Does not touch the planner engine.
 */
(function () {
  "use strict";

  var STORAGE_LANG = "ai_traveller_lang";
  var STORAGE_THEME = "ai_traveller_theme";
  var MAX_RESULTS_SHOWN = 60;

  // ---------------------------------------------------------------------------
  // Safe storage helpers (private windows and blocked storage can throw)
  // ---------------------------------------------------------------------------
  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  // ---------------------------------------------------------------------------
  // Translations (UI labels only; destination descriptions remain in English)
  // ---------------------------------------------------------------------------
  var I18N = {
    en: {
      "nav.home": "Home",
      "nav.explore": "Explore",
      "nav.near": "Near Agra",
      "nav.plan": "Plan a Trip",
      "nav.reviews": "Reviews",
      "nav.benefits": "Benefits",
      "nav.how": "How It Works",
      "nav.faq": "FAQ",
      "nav.saved": "Saved Trips",
      "nav.planBtn": "Plan My Trip",
      "lang.label": "Language",
      "theme.label": "Theme",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "featured.title": "Featured Indian Destinations",
      "planner.title": "Design Your Ideal Itinerary",
      "budget.label": "Total Group Budget (INR)",
      "budget.hint": "Minimum ₹500",
      "near.tag": "Explore Near Home",
      "near.title": "Explore Around Your City",
      "near.desc": "Places to visit, cafes and hotels within a distance of your city, with photos to help you decide.",
      "near.radius": "Distance from",
      "near.filter.all": "All",
      "near.filter.places": "Places to Visit",
      "near.filter.cafes": "Cafes",
      "near.filter.hotels": "Hotels",
      "near.results": "results",
      "near.empty": "Nothing found within this distance. Try a larger radius.",
      "near.note": "Distances are straight-line estimates; road distance is usually longer.",
      "card.away": "km away",
      "card.directions": "Directions",
      "card.readMore": "Read more",
      "card.photos": "See photos & reviews",
      "card.suggested": "Suggested time",
      "card.hours": "hrs",
      "card.noPhoto": "Photo not added yet",
      "card.tier": "Tier"
    },
    hi: {
      "nav.home": "होम",
      "nav.explore": "खोजें",
      "nav.near": "आगरा के पास",
      "nav.plan": "यात्रा योजना",
      "nav.reviews": "समीक्षाएँ",
      "nav.benefits": "लाभ",
      "nav.how": "यह कैसे काम करता है",
      "nav.faq": "सामान्य प्रश्न",
      "nav.saved": "सहेजी गई यात्राएँ",
      "nav.planBtn": "मेरी यात्रा बनाएं",
      "lang.label": "भाषा",
      "theme.label": "थीम",
      "theme.light": "लाइट",
      "theme.dark": "डार्क",
      "featured.title": "प्रमुख भारतीय गंतव्य",
      "planner.title": "अपनी आदर्श यात्रा बनाएं",
      "budget.label": "कुल समूह बजट (INR)",
      "budget.hint": "न्यूनतम ₹500",
      "near.tag": "घर के पास घूमें",
      "near.title": "अपने शहर के आसपास घूमें",
      "near.desc": "आपके शहर से एक निश्चित दूरी के भीतर घूमने की जगहें, कैफ़े और होटल, फ़ोटो के साथ।",
      "near.radius": "दूरी (से)",
      "near.filter.all": "सभी",
      "near.filter.places": "घूमने की जगहें",
      "near.filter.cafes": "कैफ़े",
      "near.filter.hotels": "होटल",
      "near.results": "परिणाम",
      "near.empty": "इस दूरी के भीतर कुछ नहीं मिला। बड़ी दूरी चुनें।",
      "near.note": "दूरी सीधी रेखा में अनुमानित है; सड़क की दूरी आमतौर पर अधिक होती है।",
      "card.away": "km दूर",
      "card.directions": "रास्ता देखें",
      "card.readMore": "और पढ़ें",
      "card.photos": "फ़ोटो और समीक्षाएँ देखें",
      "card.suggested": "सुझाया समय",
      "card.hours": "घंटे",
      "card.noPhoto": "फ़ोटो अभी नहीं जोड़ी गई",
      "card.tier": "श्रेणी"
    }
  };

  var state = {
    lang: "en",
    radiusKm: 100,
    filter: "all",
    wikiImages: {} // place id -> image url (or null when none found)
  };

  function tr(key) {
    var dict = I18N[state.lang] || I18N.en;
    return dict[key] !== undefined ? dict[key] : I18N.en[key] || key;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // ---------------------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------------------
  function applyTheme(theme) {
    var value = theme === "dark" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", value);
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", value === "dark" ? "true" : "false");
      btn.setAttribute("title", value === "dark" ? tr("theme.light") : tr("theme.dark"));
      btn.setAttribute("aria-label", value === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    storageSet(STORAGE_THEME, value);
  }

  function initTheme() {
    var saved = storageGet(STORAGE_THEME);
    applyTheme(saved === "dark" ? "dark" : "light");
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  }

  // ---------------------------------------------------------------------------
  // LANGUAGE
  // ---------------------------------------------------------------------------
  function applyLanguage(lang) {
    state.lang = I18N[lang] ? lang : "en";
    document.documentElement.setAttribute("lang", state.lang);
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = tr(el.getAttribute("data-i18n"));
    });
    var langSelect = document.getElementById("lang-select");
    if (langSelect) langSelect.value = state.lang;
    // Re-render dynamic labels that depend on language
    applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
    renderExplore();
    storageSet(STORAGE_LANG, state.lang);
  }

  function initLanguage() {
    var saved = storageGet(STORAGE_LANG);
    var langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.addEventListener("change", function () {
        applyLanguage(langSelect.value);
      });
    }
    applyLanguage(saved && I18N[saved] ? saved : "en");
  }

  // ---------------------------------------------------------------------------
  // EXPLORE NEAR YOUR CITY
  // ---------------------------------------------------------------------------
  function toRad(deg) { return (deg * Math.PI) / 180; }

  // Straight-line (great-circle) distance in km
  function distanceKm(lat1, lng1, lat2, lng2) {
    var R = 6371;
    var dLat = toRad(lat2 - lat1);
    var dLng = toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  function mapsDirectionsUrl(lat, lng) {
    var home = EXPLORE_DATA.homeCity;
    return "https://www.google.com/maps/dir/?api=1&origin=" + home.lat + "," + home.lng +
           "&destination=" + lat + "," + lng + "&travelmode=driving";
  }

  function mapsPhotosUrl(name, placeId) {
    var q = encodeURIComponent(name + " " + EXPLORE_DATA.homeCity.name);
    var url = "https://www.google.com/maps/search/?api=1&query=" + q;
    if (placeId) url += "&query_place_id=" + encodeURIComponent(placeId);
    return url;
  }

  function wikiPageUrl(title) {
    return "https://en.wikipedia.org/wiki/" + encodeURIComponent(title.replace(/ /g, "_"));
  }

  function starsText(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 1; i <= 5; i++) out += i <= full ? "★" : "☆";
    return out;
  }

  function priceText(level) {
    if (!level) return "";
    var s = "";
    for (var i = 0; i < level; i++) s += "₹";
    return s;
  }

  function buildItems() {
    var home = EXPLORE_DATA.homeCity;
    var items = [];

    EXPLORE_DATA.places.forEach(function (p) {
      items.push({ type: "places", data: p, km: distanceKm(home.lat, home.lng, p.lat, p.lng) });
    });
    EXPLORE_DATA.cafes.forEach(function (c) {
      items.push({ type: "cafes", data: c, km: distanceKm(home.lat, home.lng, c.lat, c.lng) });
    });
    EXPLORE_DATA.hotels.forEach(function (h) {
      items.push({ type: "hotels", data: h, km: distanceKm(home.lat, home.lng, h.lat, h.lng) });
    });

    return items;
  }

  function renderPlaceholder(name, label) {
    var initial = escapeHtml((name || "?").charAt(0).toUpperCase());
    return '<div class="explore-photo-ph" aria-hidden="true"><span>' + initial + '</span>' +
           '<small>' + escapeHtml(label) + '</small></div>';
  }

  function cardHtml(item) {
    var d = item.data;
    var km = item.km.toFixed(item.km < 10 ? 1 : 0);
    var distanceBadge = '<span class="explore-badge explore-badge-dist">' + km + ' ' + escapeHtml(tr("card.away")) + '</span>';
    var directions = '<a class="explore-link" href="' + mapsDirectionsUrl(d.lat, d.lng) +
                     '" target="_blank" rel="noopener">' + escapeHtml(tr("card.directions")) + '</a>';

    if (item.type === "places") {
      var photoId = "wiki-" + d.id;
      var placeHolder = renderPlaceholder(d.name, tr("card.noPhoto"));
      var suggested = d.durationHours ? '<span class="explore-meta">' + escapeHtml(tr("card.suggested")) + ': ' +
                      d.durationHours + ' ' + escapeHtml(tr("card.hours")) + '</span>' : "";
      return '' +
        '<article class="explore-card" data-type="places">' +
          '<div class="explore-photo" id="' + photoId + '" data-wiki="' + escapeHtml(d.wiki) + '">' + placeHolder + '</div>' +
          '<div class="explore-body">' +
            '<div class="explore-badges"><span class="explore-badge">' + escapeHtml(d.category) + '</span>' + distanceBadge + '</div>' +
            '<h3 class="explore-name">' + escapeHtml(d.name) + '</h3>' +
            '<p class="explore-desc">' + escapeHtml(d.description) + '</p>' +
            suggested +
            '<div class="explore-actions">' + directions +
              '<a class="explore-link" href="' + wikiPageUrl(d.wiki) + '" target="_blank" rel="noopener">' +
              escapeHtml(tr("card.readMore")) + '</a></div>' +
          '</div>' +
        '</article>';
    }

    // Cafes and hotels
    var photo = d.image
      ? '<img src="' + escapeHtml(d.image) + '" alt="Photo of ' + escapeHtml(d.name) + '" loading="lazy" data-fallback-name="' + escapeHtml(d.name) + '">'
      : renderPlaceholder(d.name, tr("card.noPhoto"));

    var badges = '<span class="explore-badge">' + escapeHtml(item.type === "cafes" ? tr("near.filter.cafes") : tr("near.filter.hotels")) + '</span>' + distanceBadge;
    if (item.type === "hotels" && d.tier) {
      badges += '<span class="explore-badge explore-badge-tier">' + escapeHtml(tr("card.tier")) + ': ' + escapeHtml(d.tier) + '</span>';
    }

    var ratingLine = '<div class="explore-rating"><span class="explore-stars" aria-label="Rated ' + d.rating + ' out of 5">' +
                     starsText(d.rating) + '</span> <strong>' + d.rating.toFixed(1) + '</strong>' +
                     (d.ratingCount ? ' <span class="explore-muted">(' + Number(d.ratingCount).toLocaleString("en-IN") + ')</span>' : '') +
                     (d.priceLevel ? ' <span class="explore-muted">' + priceText(d.priceLevel) + '</span>' : '') +
                     '</div>';

    var tags = (d.tags || []).map(function (t) {
      return '<span class="explore-tag">' + escapeHtml(t) + '</span>';
    }).join("");

    return '' +
      '<article class="explore-card" data-type="' + item.type + '">' +
        '<div class="explore-photo">' + photo + '</div>' +
        '<div class="explore-body">' +
          '<div class="explore-badges">' + badges + '</div>' +
          '<h3 class="explore-name">' + escapeHtml(d.name) + '</h3>' +
          '<p class="explore-area">' + escapeHtml(d.area) + '</p>' +
          ratingLine +
          (tags ? '<div class="explore-tags">' + tags + '</div>' : '') +
          '<div class="explore-actions">' + directions +
            '<a class="explore-link" href="' + mapsPhotosUrl(d.name, d.placeId) + '" target="_blank" rel="noopener">' +
            escapeHtml(tr("card.photos")) + '</a></div>' +
        '</div>' +
      '</article>';
  }

  function renderExplore() {
    var grid = document.getElementById("explore-grid");
    if (!grid || typeof EXPLORE_DATA === "undefined") return;

    var all = buildItems();
    var filtered = all.filter(function (item) {
      if (item.km > state.radiusKm) return false;
      return state.filter === "all" || state.filter === item.type;
    });
    filtered.sort(function (a, b) { return a.km - b.km; });

    var countEl = document.getElementById("explore-count");
    if (countEl) countEl.textContent = filtered.length + " " + tr("near.results");

    var emptyEl = document.getElementById("explore-empty");
    if (emptyEl) emptyEl.hidden = filtered.length > 0;

    grid.innerHTML = filtered.slice(0, MAX_RESULTS_SHOWN).map(cardHtml).join("");

    // If a custom image link is broken, fall back to the placeholder
    grid.querySelectorAll("img[data-fallback-name]").forEach(function (img) {
      img.addEventListener("error", function () {
        var holder = img.parentNode;
        holder.innerHTML = renderPlaceholder(img.getAttribute("data-fallback-name"), tr("card.noPhoto"));
      });
    });

    // Load real photos for places to visit (Wikipedia lead image)
    filtered.forEach(function (item) {
      if (item.type === "places") loadWikiPhoto(item.data);
    });
  }

  function loadWikiPhoto(place) {
    var key = place.id;
    var container = document.getElementById("wiki-" + key);
    if (!container) return;

    if (state.wikiImages[key] !== undefined) {
      if (state.wikiImages[key]) setPhoto(container, state.wikiImages[key], place.name);
      return;
    }

    if (!window.fetch) return;
    fetch("https://en.wikipedia.org/api/rest_v1/page/summary/" + encodeURIComponent(place.wiki.replace(/ /g, "_")))
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (json) {
        var src = json && json.thumbnail && json.thumbnail.source ? json.thumbnail.source : null;
        state.wikiImages[key] = src;
        if (src) {
          var el = document.getElementById("wiki-" + key);
          if (el) setPhoto(el, src, place.name);
        }
      })
      .catch(function () { state.wikiImages[key] = null; });
  }

  function setPhoto(container, src, name) {
    container.innerHTML = '<img src="' + escapeHtml(src) + '" alt="Photo of ' + escapeHtml(name) + '" loading="lazy">';
    var img = container.querySelector("img");
    if (img) {
      img.addEventListener("error", function () {
        container.innerHTML = renderPlaceholder(name, tr("card.noPhoto"));
      });
    }
  }

  function setActiveButton(selector, attr, value) {
    document.querySelectorAll(selector).forEach(function (btn) {
      var active = btn.getAttribute(attr) === String(value);
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function initExplore() {
    if (typeof EXPLORE_DATA === "undefined") return;

    var homeEl = document.getElementById("explore-home-city");
    if (homeEl) homeEl.textContent = EXPLORE_DATA.homeCity.name;

    state.radiusKm = EXPLORE_DATA.defaultRadiusKm || 100;
    setActiveButton(".explore-radius-btn", "data-radius", state.radiusKm);
    setActiveButton(".explore-filter-btn", "data-filter", state.filter);

    document.querySelectorAll(".explore-radius-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.radiusKm = Number(btn.getAttribute("data-radius"));
        setActiveButton(".explore-radius-btn", "data-radius", state.radiusKm);
        renderExplore();
      });
    });

    document.querySelectorAll(".explore-filter-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        state.filter = btn.getAttribute("data-filter");
        setActiveButton(".explore-filter-btn", "data-filter", state.filter);
        renderExplore();
      });
    });
  }

  // ---------------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------------
  function boot() {
    initExplore();
    initTheme();
    initLanguage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
