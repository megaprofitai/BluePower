/* =========================================================
   SILO — vietinė puslapio logika.
   1) technologijų kortelės — atidaro TĄ PATĮ modalą kaip rent puslapyje
   2) DUK — atsakymas išsiskleidžia toje pačioje dėžutėje
   3) dengiamumo žemėlapio išskleidimas
   ========================================================= */
(function () {
  'use strict';

  function toggler(btn, panel) {
    btn.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function lang() {
    return (document.documentElement.lang === 'no' ||
            new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';
  }

  /* =========================================================
     ATMOSPHERE O2 — srauto schema, atkurta 1:1 pagal kliento
     paveikslėlį (O2Control.webp). Dėžutės, užrašai ir rodyklių
     kryptys nekeistos; pridėtas tik judantis brūkšnelių srautas,
     kad matytųsi, kur dujos teka.
       žalia   = N2 iš tiekimo
       tamsi   = siurbimo žarna
       oranžinė= karštas N2 iš kompresoriaus
       mėlyna  = atvėsintas N2 atgal
     ========================================================= */
  function o2svg() {
    var G = '#548235', K = '#0B2A4A', O = '#E46A1E', B = '#2E86D9';
    function mk(id, c) {
      return '<marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" ' +
             'markerHeight="6" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="' + c + '"/></marker>';
    }
    function line(d, c, m) {
      return '<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2" opacity=".38"' +
             (m ? ' marker-end="url(#' + m + ')"' : '') + '/>' +
             '<path class="flow" d="' + d + '" fill="none" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/>';
    }
    function box(x, y, w, h, label) {
      return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="3" ' +
             'fill="#fff" stroke="' + K + '" stroke-width="1.6"/>' +
             '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4.5) + '" text-anchor="middle" ' +
             'font-size="13.5" font-weight="700" fill="' + K + '">' + label + '</text>';
    }
    function t(x, y, s, anchor) {
      return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || 'start') +
             '" font-size="11.5" fill="' + K + '">' + s + '</text>';
    }

    return '<svg class="o2" viewBox="0 0 760 450" xmlns="http://www.w3.org/2000/svg" ' +
      'font-family="Inter, system-ui, sans-serif" role="img" aria-label="Atmosphere O2 Control flow diagram">' +
      '<defs>' + mk('aG', G) + mk('aK', K) + mk('aO', O) + mk('aB', B) + '</defs>' +

      /* --- silosas --- */
      '<path d="M92 100v148h104V100" fill="#fff" stroke="' + K + '" stroke-width="1.6"/>' +
      '<ellipse cx="144" cy="100" rx="52" ry="14" fill="#fff" stroke="' + K + '" stroke-width="1.6"/>' +
      '<text x="144" y="180" text-anchor="middle" font-size="13.5" font-weight="700" fill="' + K + '">Silo</text>' +

      box(500, 58, 122, 42, 'N2-Supply') +
      box(305, 198, 142, 52, 'Vacuumtruck') +
      box(487, 322, 82, 46, 'Cooler') +

      /* 1. N2 -> silosas */
      line('M500 79H210v111h-14', G, 'aG') +
      t(214, 66, 'N2 for purging into silo/sluice') +

      /* 2. N2 -> vakuuminis sunkvežimis */
      line('M376 79v113', G, 'aG') +
      t(384, 144, 'N2 for purging into vacuumtruck') +

      /* 3. siurbimo žarna */
      line('M196 224h103', K, 'aK') +
      t(202, 214, 'Suction hose') +

      /* 4. karštas oras -> aušintuvas */
      line('M453 224h253v121H575', O, 'aO') +
      t(536, 213, 'Hot air (N2) from compressor') +
      t(590, 236, '(rubber hose)') +

      /* 5. atvėsintas N2 atgal į silosą */
      line('M487 345H62V78h82v14', B, 'aB') +
      t(172, 372, 'Cooled air (N2) from compressor back to silo') +
      t(238, 394, 'Light flexible hose') +

      /* 6. aušinantis N2 į kompresorių */
      line('M470 345v-45H352v-44', B, 'aB') +
      line('M400 300v-44', B, 'aB') +
      t(128, 293, 'Cooling air (N2) to compressor') +
      t(180, 315, '(flexible hose)') +
      '</svg>';
  }

  /* =========================================================
     TECHNOLOGIJŲ TURINYS
     EN tekstai — iš kliento. NO — MŪSŲ vertimas, prieš rodant
     klientui reikia peržiūros.
     ========================================================= */
  var TECH = {
    'binwhip': {
      name: 'BinWhip',
      list: {
        en: ['Remote-controlled system, carefully removes any deposits',
             'Can be used for virtually any type of bulk materials',
             'Fully restores the storage capacity of the silo',
             'Does not damage the silo walls'],
        no: ['Fjernstyrt system som forsiktig fjerner avleiringer',
             'Kan brukes på så godt som alle typer bulkmaterialer',
             'Gjenoppretter siloens lagerkapasitet fullt ut',
             'Skader ikke siloveggene']
      }
    },
    'bindrill': {
      name: 'BinDrill',
      list: {
        en: ['Ideal for loosening content when a silo is completely bridged (up to 45 metres)',
             'Fully restores the storage capacity of the silo',
             'Can be used for virtually any type of bulk materials',
             'Does not damage the silo walls'],
        no: ['Ideelt for å løsne materiale når siloen er helt brodannet (opptil 45 meter)',
             'Gjenoppretter siloens lagerkapasitet fullt ut',
             'Kan brukes på så godt som alle typer bulkmaterialer',
             'Skader ikke siloveggene']
      }
    },
    'cardox': {
      name: 'Cardox',
      list: {
        en: ['Breaks up compacted materials in storage tanks through the rapid release of liquid carbon dioxide',
             'Permanent Cardox® pipe sleeves can be installed on the outside of the silo'],
        no: ['Bryter opp sammenpakket materiale i lagertanker ved hurtig frigjøring av flytende karbondioksid',
             'Permanente Cardox®-rørhylser kan monteres på utsiden av siloen']
      }
    },
    'atmosphere-o2': {
      name: 'Atmosphere O<sub>2</sub> Control',
      nameNo: 'Atmosfærisk O<sub>2</sub>-kontroll',
      svg: true,
      list: {
        en: ['Reduces oxygen levels inside the silo to suppress active fires and prevent re-ignition',
             'Protects both material and silo structure without requiring human entry or water-based suppression'],
        no: ['Senker oksygennivået inne i siloen for å slokke aktiv brann og hindre gjenantenning',
             'Beskytter både materiale og silokonstruksjon uten entring og uten vannbasert slokking']
      }
    }
  };
  var EYEBROW = { en: 'No-entry technology', no: 'Teknologi uten entring' };

  var modal = null, lastFocus = null;

  function modalHTML(t, card) {
    var L = lang();
    var fig = t.svg ? o2svg() : card.querySelector('.si-tfig').innerHTML;
    var desc = card.querySelector('.si-tbody p').innerHTML;

    return '' +
    '<div class="bm-overlay" data-close></div>' +
    '<div class="bm bm-tech' + (t.svg ? ' is-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="bmTitle">' +
      '<header class="bm-head">' +
        '<div><p class="bm-eyebrow">' + EYEBROW[L] + '</p>' +
          '<h2 id="bmTitle">' + ((L === 'no' && t.nameNo) ? t.nameNo : t.name) + '</h2></div>' +
        '<button class="bm-close" type="button" data-close aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="bm-body one">' +
        '<div class="bm-left">' +
          '<figure class="bm-fig">' + fig + '</figure>' +
          '<div class="bm-txt">' +
            '<p class="bm-desc">' + desc + '</p>' +
            '<ul class="bm-list">' +
              t.list[L].map(function (i) { return '<li>' + i + '</li>'; }).join('') +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openModal(card) {
    var t = TECH[card.getAttribute('data-tech')];
    if (!t || modal) return;
    lastFocus = document.activeElement;
    modal = document.createElement('div');
    modal.className = 'bm-wrap';
    modal.innerHTML = modalHTML(t, card);
    document.body.appendChild(modal);
    document.body.classList.add('locked');
    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeModal();
    });
    modal.addEventListener('keydown', trapTab);
    document.addEventListener('keydown', onKey);
    var c = modal.querySelector('.bm-close');
    if (c) c.focus();
  }

  function onKey(e) { if (e.key === 'Escape') closeModal(); }

  function trapTab(e) {
    if (e.key !== 'Tab' || !modal) return;
    var f = [].slice.call(modal.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'))
      .filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function closeModal() {
    if (!modal) return;
    document.removeEventListener('keydown', onKey);
    modal.remove(); modal = null;
    document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    if (modal) return;
    var card = e.target.closest ? e.target.closest('.si-tcard') : null;
    if (card) openModal(card);
  });

  /* ---------- DUK ---------- */
  var qs = document.querySelectorAll('.si-qi');
  for (var j = 0; j < qs.length; j++) {
    var qb = qs[j].querySelector('.si-q');
    var qa = qs[j].querySelector('.si-qa');
    if (qb && qa) toggler(qb, qa);
  }

  /* ---------- dengiamumo žemėlapis ---------- */
  var covBtn = document.getElementById('covBtn');
  var covMap = document.getElementById('covMap');
  if (covBtn && covMap) toggler(covBtn, covMap);
})();
