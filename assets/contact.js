/* =========================================================
   BLUEPOWER — contact.js
   Kontaktu forma + nodlinjes mygtukas.

   Firmos paieska naudoja TIKRA Bronoysundo registro API
   (data.brreg.no). Jei ji nepasiekiama — laukas veikia kaip
   paprastas teksto laukas, jokiu isgalvotu rezultatu.

   Forma niekur nesiunciama — zr. sendEnquiry() apacioje.
   ========================================================= */
(function () {
  'use strict';

  var form = document.getElementById('ctFields');
  if (!form) return;

  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';

  var T = {
    errName: { en: 'Please add your name and email so we can reply.',
               no: 'Vennligst oppgi navn og e-post så vi kan svare.' },
    errMail: { en: 'That email address does not look right.',
               no: 'E-postadressen ser ikke riktig ut.' },
    ref:     { en: 'Reference: ', no: 'Referanse: ' },
    none:    { en: 'No companies found', no: 'Ingen firmaer funnet' },
    offline: { en: 'Company search is unavailable — just type the name.',
               no: 'Firmasøk er utilgjengelig — skriv navnet manuelt.' }
  };
  function t(k) { return T[k][lang]; }

  var q = function (s) { return document.querySelector(s); };

  var S = { loc: 'no', reason: 'rent', other: '', co: '', orgnr: '',
            nm: '', role: '', ph: '', em: '', msg: '' };

  /* ---------- laukai ---------- */
  ['other', 'nm', 'role', 'ph', 'em', 'msg'].forEach(function (k) {
    var el = q('[name=' + k + ']');
    el.addEventListener('input', function () { S[k] = el.value; hideErr(); });
  });

  /* ---------- salis ---------- */
  [].forEach.call(document.querySelectorAll('.ct-opt'), function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(document.querySelectorAll('.ct-opt'), function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      S.loc = b.getAttribute('data-loc');
      /* Bronoysundo registras yra tik norvegiskoms imonems */
      q('#coWrap').hidden = (S.loc !== 'no');
      if (S.loc !== 'no') { S.orgnr = ''; hideResults(); }
    });
  });

  /* ---------- priezastis ---------- */
  q('[name=reason]').addEventListener('change', function (e) {
    S.reason = e.target.value;
    q('#otherWrap').hidden = (S.reason !== 'other');
  });

  /* =========================================================
     Bronoysundo registro paieska (tikri duomenys)
     ========================================================= */
  var coInput = q('[name=co]'), results = q('#coResults'), timer = null;

  coInput.addEventListener('input', function () {
    S.co = coInput.value; S.orgnr = '';
    clearTimeout(timer);
    var term = coInput.value.trim();
    if (term.length < 3) return hideResults();
    timer = setTimeout(function () { lookup(term); }, 280);
  });

  function lookup(term) {
    fetch('https://data.brreg.no/enhetsregisteret/api/enheter?size=6&navn=' + encodeURIComponent(term), {
      headers: { 'Accept': 'application/json' }
    })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var list = (d._embedded && d._embedded.enheter) || [];
        if (!list.length) return showNote(t('none'));
        results.innerHTML = list.map(function (e) {
          var city = (e.forretningsadresse && e.forretningsadresse.poststed) || '';
          return '<button type="button" class="ct-res" data-nr="' + e.organisasjonsnummer + '">' +
                 '<b>' + esc(e.navn) + '</b>' +
                 '<span>' + e.organisasjonsnummer + (city ? ' · ' + esc(city) : '') + '</span></button>';
        }).join('');
        results.hidden = false;
      })
      .catch(function () { showNote(t('offline')); });
  }

  function showNote(txt) {
    results.innerHTML = '<p class="ct-note">' + esc(txt) + '</p>';
    results.hidden = false;
  }
  function hideResults() { results.hidden = true; results.innerHTML = ''; }

  results.addEventListener('click', function (e) {
    var b = e.target.closest('.ct-res');
    if (!b) return;
    S.orgnr = b.getAttribute('data-nr');
    S.co = b.querySelector('b').textContent;
    coInput.value = S.co;
    hideResults();
  });

  document.addEventListener('click', function (e) {
    if (!results.contains(e.target) && e.target !== coInput) hideResults();
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  /* =========================================================
     Siuntimas
     ========================================================= */
  function showErr(k) { var e = q('#ctErr'); e.textContent = t(k); e.hidden = false; }
  function hideErr() { q('#ctErr').hidden = true; }

  q('#ctSend').addEventListener('click', function () {
    hideErr();
    if (!S.nm.trim() || !S.em.trim()) return showErr('errName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.em.trim())) return showErr('errMail');

    var ref = 'BP-C-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    sendEnquiry({
      ref: ref, location: S.loc, reason: S.reason, otherReason: S.other,
      company: S.co, orgnr: S.orgnr, name: S.nm, role: S.role,
      phone: S.ph, email: S.em, message: S.msg, lang: lang
    });

    q('#ctRef').textContent = t('ref') + ref;
    form.hidden = true;
    q('#ctOk').hidden = false;
  });

  /* Cia prijungiamas realus gavejas — visi laukai jau surinkti i data. */
  function sendEnquiry(data) {
    console.log('CONTACT — enquiry (not sent anywhere):', data);
    /* return fetch('https://formspree.io/f/XXXX', {
         method:'POST', headers:{'Content-Type':'application/json'},
         body: JSON.stringify(data)
       }); */
  }

  /* =========================================================
     Nodlinjes mygtukas
     Telefone tel: atidaro skambinimo langa su ivestu numeriu.
     Kompiuteryje tel: nieko nedaro — todel numeri kopijuojam.
     ========================================================= */
  var callBtn = q('#callBtn'), copied = q('#copied');
  var isPhone = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (!isPhone) {
    callBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var num = '+47 951 69 552';
      var done = function () {
        copied.hidden = false;
        clearTimeout(callBtn._t);
        callBtn._t = setTimeout(function () { copied.hidden = true; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(num).then(done).catch(fallback);
      } else { fallback(); }

      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = num; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { /* tyliai */ }
        document.body.removeChild(ta);
      }
    });
  }

  /* ---------- placeholder'iai ir kalba ---------- */
  function applyPh() {
    [].forEach.call(document.querySelectorAll('[data-ph-no]'), function (el) {
      if (!el.hasAttribute('data-ph-en')) el.setAttribute('data-ph-en', el.placeholder || '');
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
  }
  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = (lang === 'en') ? 'no' : 'en';
      applyPh();
      hideResults();
      if (!q('#ctOk').hidden) q('#ctRef').textContent = t('ref') + q('#ctRef').textContent.split(': ').pop();
    });
  }

  applyPh();
})();
