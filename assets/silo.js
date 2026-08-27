/* =========================================================
   SILO — vietinė puslapio logika.
   1) technologijų kortelės — atidaro TĄ PATĮ modalą kaip rent puslapyje
      (.bm-wrap / .bm-overlay / .bm / .bm-head / .bm-body)
   2) DUK — atsakymas išsiskleidžia toje pačioje dėžutėje
   3) dengiamumo žemėlapio išskleidimas
   ========================================================= */
(function () {
  'use strict';

  /* ---------- bendras „atidaryk / uždaryk" ---------- */
  function toggler(btn, panel) {
    btn.addEventListener('click', function () {
      var open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  function lang() {
    return (new URLSearchParams(location.search).get('lang') === 'no' ||
            document.documentElement.lang === 'no') ? 'no' : 'en';
  }

  /* =========================================================
     1. TECHNOLOGIJŲ MODALAS
     Ilgi aprašymai dar neįkelti — `long` laukas kol kas tuščias.
     Gavus tekstus iš originalo puslapio užpildoma tik čia.
     ========================================================= */
  var TECH = {
    'binwhip':        { eyebrow:{en:'No-entry technology', no:'Teknologi'}, name:'BinWhip',
                        long:{ en:'', no:'' } },
    'bindrill':       { eyebrow:{en:'No-entry technology', no:'Teknologi'}, name:'BinDrill',
                        long:{ en:'', no:'' } },
    'cardox':         { eyebrow:{en:'No-entry technology', no:'Teknologi'}, name:'Cardox',
                        long:{ en:'', no:'' } },
    'atmosphere-o2':  { eyebrow:{en:'No-entry technology', no:'Teknologi'},
                        name:'Atmosphere O<sub>2</sub> Control',
                        nameNo:'Atmosfærisk O<sub>2</sub>-kontroll',
                        long:{ en:'', no:'' } }
  };
  var TODO = { en:'Full description is not loaded yet.', no:'Full beskrivelse er ikke lagt inn ennå.' };

  var modal = null, lastFocus = null;

  function modalHTML(t, card) {
    var L = lang();
    var fig = card.querySelector('.si-tfig').innerHTML;
    var short = card.querySelector('.si-tbody p').innerHTML;
    var body = t.long[L] ||
      ('<p class="bm-desc">' + short + '</p>' +
       '<p class="si-todo-in">⚠ ' + TODO[L] + ' — reikia turinio iš originalo puslapio.</p>');
    if (t.long[L]) body = '<p class="bm-desc">' + short + '</p>' + t.long[L];

    return '' +
    '<div class="bm-overlay" data-close></div>' +
    '<div class="bm" role="dialog" aria-modal="true" aria-labelledby="bmTitle">' +
      '<header class="bm-head">' +
        '<div><p class="bm-eyebrow">' + t.eyebrow[L] + '</p>' +
          '<h2 id="bmTitle">' + ((L === 'no' && t.nameNo) ? t.nameNo : t.name) + '</h2></div>' +
        '<button class="bm-close" type="button" data-close aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="bm-body one">' +
        '<div class="bm-left">' +
          '<figure class="bm-fig">' + fig + '</figure>' +
          body +
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

  /* ---------- 2. DUK ---------- */
  var qs = document.querySelectorAll('.si-qi');
  for (var j = 0; j < qs.length; j++) {
    var qb = qs[j].querySelector('.si-q');
    var qa = qs[j].querySelector('.si-qa');
    if (qb && qa) toggler(qb, qa);
  }

  /* ---------- 3. dengiamumo žemėlapis ---------- */
  var covBtn = document.getElementById('covBtn');
  var covMap = document.getElementById('covMap');
  if (covBtn && covMap) toggler(covBtn, covMap);
})();
