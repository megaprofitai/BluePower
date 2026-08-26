/* =========================================================
   BLUEPOWER — sell.js
   3 zingsniu skelbimo vedlys: What -> Condition -> Who.
   Skelbimo kortele parodoma TIK issiuntus (4 zingsnis).

   Nuotraukos rodomos tik per objectURL, niekur nesiunciamos.
   Forma niekur nesiunciama — zr. sendListing() apacioje.
   ========================================================= */
(function () {
  'use strict';

  var wz = document.querySelector('.sl-wz');
  if (!wz) return;

  /* ---------- kalba (ta pati logika kaip site.js) ---------- */
  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';

  /* Tekstai, kuriuos piesia JS (data-no jiems netinka — juos perrasom) */
  var T = {
    pvHead:  { en: 'Your listing',                 no: 'Din oppføring' },
    pvEmpty: { en: 'No photos added',              no: 'Ingen bilder lagt til' },
    pvName:  { en: 'Untitled equipment',           no: 'Utstyr uten navn' },
    sent:    { en: 'Submitted for review',         no: 'Sendt til gjennomgang' },
    ref:     { en: 'Your enquiry has been sent. Your reference is ',
               no: 'Forespørselen din er sendt. Referansen din er ' },
    refEnd:  { en: '.',                            no: '.' },

    nxHead:  { en: 'What happens next',            no: 'Hva skjer videre' },
    nx1:     { en: 'We review your listing',       no: 'Vi gjennomgår oppføringen din' },
    nx1d:    { en: 'A specialist goes through the details and asks if anything is missing.',
               no: 'En spesialist går gjennom detaljene og spør dersom noe mangler.' },
    nx2:     { en: 'We match it with buyers in our network',
               no: 'Vi kobler den mot kjøpere i nettverket vårt' },
    nx2d:    { en: 'Your equipment is put in front of buyers looking for that type.',
               no: 'Utstyret ditt presenteres for kjøpere som ser etter denne typen.' },
    nx3:     { en: 'You are contacted directly',   no: 'Du blir kontaktet direkte' },
    nx3d:    { en: 'We come back to you with any interest — you decide what happens next.',
               no: 'Vi kommer tilbake til deg med eventuell interesse — du bestemmer hva som skjer videre.' },
    nxNote:  { en: 'Listing an item is free and without obligation.',
               no: 'Å legge ut utstyr er gratis og uforpliktende.' },

    errName: { en: 'Please add your name and email so we can reply.',
               no: 'Vennligst oppgi navn og e-post så vi kan svare.' },
    errMail: { en: 'That email address does not look right.',
               no: 'E-postadressen ser ikke riktig ut.' },
    errCons: { en: 'Please tick the box so we may contact you.',
               no: 'Vennligst huk av boksen så vi kan kontakte deg.' },

    photos:  { en: 'photos',                       no: 'bilder' },

    new:     { en: 'New',             no: 'Ny' },
    likenew: { en: 'Used – like new', no: 'Brukt – som ny' },
    good:    { en: 'Used – good',     no: 'Brukt – god' },
    fair:    { en: 'Used – fair',     no: 'Brukt – akseptabel' },
    poor:    { en: 'Used – poor',     no: 'Brukt – dårlig' }
  };
  function t(k) { return T[k][lang]; }

  var DOT = { new: '#28A45C', likenew: '#57B07C', good: '#1F4F82', fair: '#E0902F', poor: '#B4574A' };

  var q  = function (s) { return document.querySelector(s); };
  var qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  /* ---------- busena ---------- */
  var S = blank();
  function blank() {
    return { step: 1, type: '', make: '', year: '', cond: '', loc: '', photos: [],
             nm: '', co: '', em: '', ph: '', msg: '', consent: false };
  }

  /* =========================================================
     1. Laukai
     ========================================================= */
  function bind(sel, key, filter) {
    var el = q(sel);
    if (!el) return;
    el.addEventListener('input', function () {
      if (filter) el.value = filter(el.value);
      S[key] = el.value;
      refreshNav();
    });
  }
  bind('[name=type]', 'type');
  bind('[name=make]', 'make');
  bind('[name=year]', 'year', function (v) { return v.replace(/\D/g, '').slice(0, 4); });
  bind('[name=loc]',  'loc');
  bind('[name=nm]',   'nm');
  bind('[name=co]',   'co');
  bind('[name=em]',   'em');
  bind('[name=ph]',   'ph');
  bind('[name=msg]',  'msg');

  q('[name=cond]').addEventListener('change', function (e) {
    S.cond = e.target.value;
    refreshNav();
  });

  q('[name=consent]').addEventListener('change', function (e) {
    S.consent = e.target.checked;
    hideErr();
  });

  /* =========================================================
     2. Nuotraukos — tik perziura, niekur nesiunciamos
     ========================================================= */
  var MAX = 8;
  var drop = q('#drop'), fileInput = q('#files');

  q('#pickBtn').addEventListener('click', function () { fileInput.click(); });
  fileInput.addEventListener('change', function () { addFiles(fileInput.files); fileInput.value = ''; });

  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });

  function addFiles(list) {
    [].slice.call(list).forEach(function (f) {
      if (!/^image\/(jpeg|png)$/.test(f.type)) return;
      if (S.photos.length >= MAX) return;
      S.photos.push({ file: f, url: URL.createObjectURL(f) });
    });
    renderThumbs();
  }

  function renderThumbs() {
    q('#thumbs').innerHTML = S.photos.map(function (p, i) {
      return '<div class="sl-thumb"><img src="' + p.url + '" alt="">' +
             '<button type="button" data-i="' + i + '" aria-label="Remove">' +
             '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
             '</button></div>';
    }).join('');
  }

  q('#thumbs').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    URL.revokeObjectURL(S.photos[i].url);
    S.photos.splice(i, 1);
    renderThumbs();
  });

  /* =========================================================
     3. Zingsniai
     ========================================================= */
  function canLeave(step) {
    if (step === 1) return !!S.type.trim();
    if (step === 2) return !!S.cond;
    return true;
  }

  function refreshNav() {
    [1, 2].forEach(function (n) {
      var b = q('.wz-step[data-step="' + n + '"] .wz-next');
      if (b) b.disabled = !canLeave(n);
    });
  }

  function goto(n) {
    S.step = n;
    qa('.wz-step').forEach(function (s) {
      s.classList.toggle('is-on', +s.getAttribute('data-step') === n);
    });
    qa('.sl-steps li').forEach(function (li) {
      var i = +li.getAttribute('data-s');
      li.classList.toggle('is-on', i === n);
      li.classList.toggle('is-done', i < n || n === 4);
    });
    var top = wz.getBoundingClientRect().top + window.pageYOffset - 96;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  qa('.wz-next').forEach(function (b) {
    b.addEventListener('click', function () { if (canLeave(S.step)) goto(S.step + 1); });
  });
  qa('.wz-back').forEach(function (b) {
    b.addEventListener('click', function () { goto(S.step - 1); });
  });

  /* =========================================================
     4. Skelbimo kortele — piesiama tik po issiuntimo
     ========================================================= */
  function renderResult() {
    q('#pvHead').textContent = t('pvHead');
    q('#nxHead').textContent = t('nxHead');
    q('#nxNote').textContent = t('nxNote');

    q('#pvName').textContent = S.make.trim() || t('pvName');
    q('#pvName').classList.toggle('is-ghost', !S.make.trim());
    q('#pvType').textContent = S.type.trim();

    var badge = q('#pvBadge');
    if (S.cond) {
      badge.hidden = false;
      badge.querySelector('i').style.background = DOT[S.cond];
      badge.querySelector('span').textContent = t(S.cond);
    } else { badge.hidden = true; }

    var img = q('#pvImg'), empty = q('#pvEmpty');
    empty.querySelector('span').textContent = t('pvEmpty');
    if (S.photos.length) { img.src = S.photos[0].url; img.hidden = false; empty.hidden = true; }
    else { img.hidden = true; empty.hidden = false; }

    var chips = [];
    if (S.year.trim()) chips.push(S.year.trim());
    if (S.loc.trim())  chips.push(S.loc.trim());
    if (S.photos.length > 1) chips.push(S.photos.length + ' ' + t('photos'));
    q('#pvChips').innerHTML = chips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('');

    var d = q('#pvDesc');
    d.textContent = S.msg.trim();
    d.hidden = !S.msg.trim();

    q('#pvState').textContent = t('sent');

    q('#nxSteps').innerHTML = [1, 2, 3].map(function (i) {
      return '<li><b>' + i + '</b><div><strong>' + t('nx' + i) + '</strong>' +
             '<span>' + t('nx' + i + 'd') + '</span></div></li>';
    }).join('');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  /* =========================================================
     5. Siuntimas
     ========================================================= */
  var lastRef = '';

  function showErr(k) { var e = q('#err'); e.textContent = t(k); e.hidden = false; }
  function hideErr() { q('#err').hidden = true; }

  q('.wz-send').addEventListener('click', function () {
    hideErr();
    if (!S.nm.trim() || !S.em.trim()) return showErr('errName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.em.trim())) return showErr('errMail');
    if (!S.consent) return showErr('errCons');

    lastRef = 'BP-S-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    sendListing({
      ref: lastRef, type: S.type, make: S.make, year: S.year,
      condition: S.cond, location: S.loc, photos: S.photos.length,
      name: S.nm, company: S.co, email: S.em, phone: S.ph,
      details: S.msg, consent: S.consent, lang: lang
    });

    renderResult();
    paintRef();
    goto(4);
  });

  function paintRef() {
    q('#doneRef').innerHTML = esc(t('ref')) + '<b class="dn-ref">' + lastRef + '</b>' + esc(t('refEnd'));
  }

  q('#againBtn').addEventListener('click', function () {
    S.photos.forEach(function (p) { URL.revokeObjectURL(p.url); });
    S = blank();
    qa('.sl-wz input, .sl-wz textarea').forEach(function (i) {
      if (i.type === 'checkbox') i.checked = false; else i.value = '';
    });
    q('[name=cond]').selectedIndex = 0;
    renderThumbs(); refreshNav(); hideErr(); goto(1);
  });

  /* Cia prijungiamas realus gavejas — visi laukai jau surinkti i data.
     Nuotraukos siunciamos atskirai (FormData), jei to prireiks. */
  function sendListing(data) {
    console.log('SELL — listing (not sent anywhere):', data);
    /* return fetch('https://formspree.io/f/XXXX', {
         method:'POST', headers:{'Content-Type':'application/json'},
         body: JSON.stringify(data)
       }); */
  }

  /* =========================================================
     6. Placeholder'iai ir kalbos perjungimas
     ========================================================= */
  function applyPh() {
    qa('[data-ph-no]').forEach(function (el) {
      if (!el.hasAttribute('data-ph-en')) el.setAttribute('data-ph-en', el.placeholder || '');
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
  }

  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = (lang === 'en') ? 'no' : 'en';
      applyPh();
      if (S.step === 4) { renderResult(); paintRef(); }
    });
  }

  /* ---------- startas ---------- */
  applyPh();
  refreshNav();
})();
