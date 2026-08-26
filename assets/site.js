/* =========================================================
   BLUEPOWER — bendra svetainės logika
   Vienintelė vieta, kur redaguojamas header, footer ir meniu.
   Pakeitus čia — pasikeičia VISUOSE puslapiuose.

   Svarbu: header/footer generuojami JavaScript'u, o ne fetch()'u,
   nes fetch() neveikia atidarius failą per file:// (CORS).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- 1. NAVIGACIJA — vienintelis šaltinis ---------- */
  var NAV = [
    { id: 'rent',    href: 'rent.html',    en: 'Rent',    no: 'Utleie'  },
    { id: 'buy',     href: 'buy.html',     en: 'Buy',     no: 'Kjøp'    },
    { id: 'sell',    href: 'sell.html',    en: 'Sell',    no: 'Selg'    },
    { id: 'contact', href: 'contact.html', en: 'Contact', no: 'Kontakt' }
  ];

  /* Sritys po logotipu */
  var DIVISIONS = [
    { id: 'silo',  href: 'silo.html',  en: 'Silo cleaning', no: 'Silorengjøring',
      icon: '<path d="M6 21V8a6 6 0 0 1 12 0v13"/><path d="M4 21h16"/><path d="M6 12h12"/><path d="M6 16.5h12"/>' },
    { id: 'water', href: 'index.html', en: 'Water jetting', no: 'Vannjetting',
      icon: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5S5 13 5 15a7 7 0 0 0 7 7z"/>' }
  ];

  /* Tekstai, kurie kartojasi header/footer visuose puslapiuose */
  var T = {
    emergency:  { en: 'Emergency',            no: 'Nødlinje' },
    active:     { en: 'Active',               no: 'Aktiv' },
    back:       { en: 'Back to frontpage',    no: 'Tilbake til forsiden' },
    contactH:   { en: 'Contact',              no: 'Kontakt' },
    quick:      { en: 'Quick Links',          no: 'Hurtiglenker' },
    partners:   { en: 'Partners',             no: 'Partners' },
    partnersL:  { en: 'Check out our partners →', no: 'Sjekk ut våre partnere →' },
    contactUs:  { en: 'Contact Us',           no: 'Kontakt oss' },
    region:     { en: 'Norway · Nordics · EU', no: 'Norge · Norden · EU' },
    org:        { en: 'Org. no. 927159260',   no: 'Org.nr. 927159260' },
    rights:     { en: '© 2026 Bluepower AS. All rights reserved.',
                  no: '© 2026 Bluepower AS. Alle rettigheter reservert.' },
    terms:      { en: 'Terms',                no: 'Brukervilkår' },
    privacy:    { en: 'Privacy',              no: 'Personvern' }
  };

  var ICON = {
    arrow:  '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    chev:   '<path d="m6 9 6 6 6-6"/>',
    phone:  '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    burger: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    back:   '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
    mail:   '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    pin:    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    globe:  '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    chat:   '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'
  };

  function svg(paths, extra) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
      (extra || 1.7) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths + '</svg>';
  }

  /* ---------- 2. KALBA (per URL, ne localStorage) ---------- */
  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';

  /* Prie kiekvienos vidinės nuorodos prikabinam kalbą,
     kad perėjus į kitą puslapį ji nedingtų. */
  function withLang(href) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
    return lang === 'no' ? href + '?lang=no' : href;
  }

  function applyLang() {
    document.documentElement.lang = lang;
    var nodes = document.querySelectorAll('[data-no]');
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.hasAttribute('data-en')) n.setAttribute('data-en', n.innerHTML);
      n.innerHTML = n.getAttribute('data-' + lang);
    }
    var t = document.querySelector('title');
    if (t && t.dataset.no) {
      if (!t.dataset.en) t.dataset.en = t.textContent;
      t.textContent = t.dataset[lang];
    }
    /* Vidinės nuorodos gauna/praranda ?lang=no */
    var as = document.querySelectorAll('a[href]');
    for (var j = 0; j < as.length; j++) {
      var raw = as[j].getAttribute('href').split('?')[0];
      if (/^(https?:|mailto:|tel:|#)/.test(raw)) continue;
      as[j].setAttribute('href', withLang(raw));
    }
  }

  /* ---------- 3. HEADER ---------- */
  function buildHeader(page) {
    var navHtml = NAV.map(function (item) {
      return '<a href="' + item.href + '" data-no="' + item.no + '"' +
             (page === item.id ? ' class="is-active"' : '') + '>' + item.en + '</a>';
    }).join('');

    var divHtml = DIVISIONS.map(function (d) {
      var isHere = (page === d.id);
      return '<a class="vitem' + (isHere ? ' is-here' : '') + '" href="' + d.href + '">' +
        svg(d.icon) +
        '<span class="vlabel" data-no="' + d.no + '">' + d.en + '</span>' +
        (isHere ? '<span class="vactive" data-no="' + T.active.no + '">' + T.active.en + '</span>' : '') +
        '</a>';
    }).join('');

    return '' +
    '<header class="hdr">' +
      '<div class="brand-wrap">' +
        '<button class="brand" id="brandBtn" aria-expanded="false" aria-haspopup="true" aria-label="Bluepower">' +
          '<span class="wm"><img src="assets/logo.png" alt="Bluepower"></span>' +
          svg(ICON.chev, 2).replace('<svg', '<svg class="chev"') +
        '</button>' +
        '<div class="vdrop" id="vdrop">' + divHtml +
          '<div class="vsep"></div>' +
          '<a class="vback" href="index.html">' + svg(ICON.back, 2) +
            '<span data-no="' + T.back.no + '">' + T.back.en + '</span></a>' +
        '</div>' +
      '</div>' +
      '<nav class="nav">' + navHtml + '</nav>' +
      '<div class="hdr-right">' +
        '<button class="lang" id="langBtn" aria-label="Change language">' +
          (lang === 'en' ? 'no' : 'en') + '</button>' +
        '<a class="emg" href="tel:+4795169552">' + svg(ICON.phone, 2) +
          '<span data-no="' + T.emergency.no + '">' + T.emergency.en + '</span></a>' +
        '<button class="burger" id="burger" aria-label="Menu" aria-expanded="false">' +
          svg(ICON.burger, 2) + '</button>' +
      '</div>' +
    '</header>' +
    '<div class="mmenu" id="mmenu">' +
      NAV.map(function (i) {
        return '<a href="' + i.href + '" data-no="' + i.no + '">' + i.en + '</a>';
      }).join('') +
    '</div>';
  }

  /* ---------- 4. FOOTER ---------- */
  function buildFooter() {
    return '' +
    '<footer class="ftr">' +
      '<div class="ftr-grid">' +
        '<div>' +
          '<span class="wm"><img src="assets/logo.png" alt="Bluepower"></span>' +
          '<p class="tag">Keep it simple.</p>' +
          '<div class="meta">' + svg(ICON.globe) +
            '<span data-no="' + T.region.no + '">' + T.region.en + '</span></div>' +
          '<p class="org" data-no="' + T.org.no + '">' + T.org.en + '</p>' +
        '</div>' +
        '<div><h4 data-no="' + T.contactH.no + '">' + T.contactH.en + '</h4><ul>' +
          '<li>' + svg(ICON.mail) + '<a href="mailto:post@bluepower.no">post@bluepower.no</a></li>' +
          '<li>' + svg(ICON.phone) + '<a href="tel:+4795169552">+47 951 69 552</a></li>' +
          '<li>' + svg(ICON.pin) + '<span>Versvikvegen 9, 3937 Porsgrunn</span></li>' +
        '</ul></div>' +
        '<div><h4 data-no="' + T.quick.no + '">' + T.quick.en + '</h4><ul>' +
          NAV.slice(0, 3).map(function (i) {
            return '<li><a href="' + i.href + '" data-no="' + i.no + '">' + i.en + '</a></li>';
          }).join('') +
          '<li><a href="contact.html" data-no="' + T.contactUs.no + '">' + T.contactUs.en + '</a></li>' +
        '</ul></div>' +
        '<div class="partners"><h4 data-no="' + T.partners.no + '">' + T.partners.en + '</h4>' +
          '<a href="partners.html" data-no="' + T.partnersL.no + '">' + T.partnersL.en + '</a></div>' +
      '</div>' +
      '<div class="ftr-bottom">' +
        '<span data-no="' + T.rights.no + '">' + T.rights.en + '</span>' +
        '<span class="dot">·</span><a href="terms.html" data-no="' + T.terms.no + '">' + T.terms.en + '</a>' +
        '<span class="dot">·</span><a href="privacy.html" data-no="' + T.privacy.no + '">' + T.privacy.en + '</a>' +
      '</div>' +
    '</footer>' +
    '<button class="chat-fab" aria-label="Open chat">' + svg(ICON.chat, 1.8) + '</button>';
  }

  /* ---------- 5. Sąveikos ---------- */
  function wire() {
    var burger = document.getElementById('burger');
    var mmenu  = document.getElementById('mmenu');
    if (burger && mmenu) {
      burger.addEventListener('click', function () {
        var open = mmenu.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    var brandBtn = document.getElementById('brandBtn');
    var vdrop    = document.getElementById('vdrop');
    if (brandBtn && vdrop) {
      brandBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = vdrop.classList.toggle('open');
        brandBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.addEventListener('click', function (e) {
        if (!vdrop.contains(e.target) && !brandBtn.contains(e.target)) {
          vdrop.classList.remove('open');
          brandBtn.setAttribute('aria-expanded', 'false');
        }
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          vdrop.classList.remove('open');
          brandBtn.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        lang = (lang === 'en') ? 'no' : 'en';
        langBtn.textContent = (lang === 'en') ? 'no' : 'en';
        applyLang();
        /* URL atnaujinam be perkrovimo, kad refresh išlaikytų kalbą */
        var u = new URL(location.href);
        if (lang === 'no') u.searchParams.set('lang', 'no');
        else u.searchParams.delete('lang');
        history.replaceState(null, '', u);
      });
    }
  }

  /* ---------- 6. Paleidimas ---------- */
  var page = document.body.getAttribute('data-page') || '';
  var hEl = document.getElementById('site-header');
  var fEl = document.getElementById('site-footer');
  if (hEl) hEl.outerHTML = buildHeader(page);
  if (fEl) fEl.outerHTML = buildFooter();
  applyLang();
  wire();
})();
