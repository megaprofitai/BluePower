/* =========================================================
   BLUEPOWER — sell.js
   3 zingsniu skelbimo vedlys: What -> Condition -> Who
   + gyva skelbimo perziura desineje.

   Nuotraukos NIEKUR nesiunciamos — rodomos tik per objectURL.
   Forma NIEKUR nesiunciama — zr. sendListing() apacioje.
   ========================================================= */
(function () {
  'use strict';

  var wz = document.querySelector('.sl-wz');
  if (!wz) return;

  /* ---------- kalba (ta pati logika kaip site.js) ---------- */
  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';

  /* Tekstai, kuriuos valdo JS (jiems data-no netinka, nes juos perrasom) */
  var T = {
    pvHead:   { en: 'Your listing',            no: 'Din oppføring' },
    pvEmpty:  { en: 'Your equipment appears here', no: 'Utstyret ditt vises her' },
    pvName:   { en: 'Untitled equipment',      no: 'Utstyr uten navn' },
    pvType:   { en: 'Not specified yet',       no: 'Ikke angitt ennå' },
    draft:    { en: 'Draft · not published',   no: 'Utkast · ikke publisert' },
    sent:     { en: 'Submitted for review',    no: 'Sendt til gjennomgang' },
    nxHead:   { en: 'What happens next',       no: 'Hva skjer videre' },
    nx1:      { en: 'We review your listing',  no: 'Vi gjennomgår oppføringen din' },
    nx2:      { en: 'We match it with buyers in our network', no: 'Vi kobler den mot kjøpere i nettverket vårt' },
    nx3:      { en: 'You are contacted directly', no: 'Du blir kontaktet direkte' },
    nxNote:   { en: 'Listing an item is free and without obligation.',
                no: 'Å legge ut utstyr er gratis og uforpliktende.' },
    errName:  { en: 'Please add your name and email so we can reply.',
                no: 'Vennligst oppgi navn og e-post så vi kan svare.' },
    errMail:  { en: 'That email address does not look right.',
                no: 'E-postadressen ser ikke riktig ut.' },
    errCons:  { en: 'Please tick the box so we may contact you.',
                no: 'Vennligst huk av boksen så vi kan kontakte deg.' },
    ref:      { en: 'Your reference is ',      no: 'Referansen din er ' },
    refEnd:   { en: '. We will be in touch about this equipment.',
                no: '. Vi tar kontakt angående dette utstyret.' },
    condNew:      { en: 'New',              no: 'Ny' },
    condLikenew:  { en: 'Used – like new',  no: 'Brukt – som ny' },
    condGood:     { en: 'Used – good',      no: 'Brukt – god' },
    condFair:     { en: 'Used – fair',      no: 'Brukt – akseptabel' },
    condPoor:     { en: 'Used – poor',      no: 'Brukt – dårlig' },
    catPump:  { en: 'Pump',         no: 'Pumpe' },
    catRobot: { en: 'Robot',        no: 'Robot' },
    catAtex:  { en: 'ATEX vacuum',  no: 'ATEX-støvsuger' },
    catOther: { en: 'Other',        no: 'Annet' }
  };
  function t(k) { return T[k][lang]; }

  var CONDS = {
    new:     { key: 'condNew',     dot: '#28A45C' },
    likenew: { key: 'condLikenew', dot: '#57B07C' },
    good:    { key: 'condGood',    dot: '#1F4F82' },
    fair:    { key: 'condFair',    dot: '#E0902F' },
    poor:    { key: 'condPoor',    dot: '#B4574A' }
  };
  var CATS = { pump: 'catPump', robot: 'catRobot', atex: 'catAtex', other: 'catOther' };

  var q  = function (s) { return document.querySelector(s); };
  var qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  /* ---------- busena ---------- */
  var S = {
    step: 1, cat: '', type: '', make: '', year: '',
    cond: '', loc: '', photos: [],
    nm: '', co: '', em: '', ph: '', msg: '', consent: false, sent: false
  };

  /* =========================================================
     1. Perziuros kortele
     ========================================================= */
  function renderPreview() {
    q('#pvHead').textContent = t('pvHead');
    q('#nxHead').textContent = t('nxHead');
    q('#nxNote').textContent = t('nxNote');
    q('#pvEmpty').querySelector('span').textContent = t('pvEmpty');

    /* pavadinimas ir tipas */
    var name = S.make.trim() || (S.cat ? t(CATS[S.cat]) : '');
    q('#pvName').textContent = name || t('pvName');
    q('#pvName').classList.toggle('is-ghost', !name);

    var typeTxt = S.type.trim() || (S.cat ? t(CATS[S.cat]) : '');
    q('#pvType').textContent = typeTxt || t('pvType');
    q('#pvType').classList.toggle('is-ghost', !typeTxt);

    /* zenkliukas su bukle */
    var badge = q('#pvBadge');
    if (S.cond) {
      badge.hidden = false;
      badge.querySelector('i').style.background = CONDS[S.cond].dot;
      badge.querySelector('span').textContent = t(CONDS[S.cond].key);
    } else {
      badge.hidden = true;
    }

    /* nuotrauka */
    var img = q('#pvImg'), empty = q('#pvEmpty');
    if (S.photos.length) {
      img.src = S.photos[0].url; img.hidden = false; empty.hidden = true;
    } else {
      img.hidden = true; empty.hidden = false;
    }

    /* chip'ai: metai, vieta, nuotrauku skaicius */
    var chips = [];
    if (S.year.trim()) chips.push(S.year.trim());
    if (S.loc.trim())  chips.push(S.loc.trim());
    if (S.photos.length > 1) chips.push(S.photos.length + ' ' + (lang === 'no' ? 'bilder' : 'photos'));
    q('#pvChips').innerHTML = chips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('');

    q('#pvState').textContent = S.sent ? t('sent') : t('draft');

    /* "kas toliau" sarasas */
    q('#nxSteps').innerHTML = [1, 2, 3].map(function (i) {
      return '<li><b>' + i + '</b>' + t('nx' + i) + '</li>';
    }).join('');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  /* =========================================================
     2. Laukai
     ========================================================= */
  function bind(sel, key, filter) {
    var el = q(sel);
    if (!el) return;
    el.addEventListener('input', function () {
      if (filter) el.value = filter(el.value);
      S[key] = el.value;
      renderPreview();
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

  q('[name=consent]').addEventListener('change', function (e) {
    S.consent = e.target.checked;
    hideErr();
  });

  /* kategorijos plyteles */
  qa('.sl-type').forEach(function (b) {
    b.addEventListener('click', function () {
      var c = b.getAttribute('data-cat');
      var on = (S.cat === c);
      qa('.sl-type').forEach(function (x) { x.classList.remove('is-on'); });
      S.cat = on ? '' : c;
      if (!on) b.classList.add('is-on');
      /* jei tipo laukas dar tuscias — uzpildom kategorijos pavadinimu */
      var ti = q('[name=type]');
      if (!on && !ti.value.trim()) { ti.value = t(CATS[c]); S.type = ti.value; }
      renderPreview(); refreshNav();
    });
  });

  /* bukles pasirinkimas */
  qa('.sl-cond').forEach(function (b) {
    b.addEventListener('click', function () {
      qa('.sl-cond').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      S.cond = b.getAttribute('data-cond');
      renderPreview(); refreshNav();
    });
  });

  /* =========================================================
     3. Nuotraukos — tik perziura, niekur nesiunciamos
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
    renderThumbs(); renderPreview();
  }

  function renderThumbs() {
    q('#thumbs').innerHTML = S.photos.map(function (p, i) {
      return '<div class="sl-thumb"><img src="' + p.url + '" alt="">' +
             '<button type="button" data-i="' + i + '" aria-label="Remove">' +
             '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
             '</button></div>';
    }).join('');
  }

  q('#thumbs').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    URL.revokeObjectURL(S.photos[i].url);
    S.photos.splice(i, 1);
    renderThumbs(); renderPreview();
  });

  /* =========================================================
     4. Zingsniai
     ========================================================= */
  function canLeave(step) {
    if (step === 1) return !!(S.cat || S.type.trim());
    if (step === 2) return !!S.cond;
    return true;
  }

  function refreshNav() {
    [1, 2].forEach(function (n) {
      var btn = q('.wz-step[data-step="' + n + '"] .wz-next');
      if (btn) btn.disabled = !canLeave(n);
    });
  }

  function goto(n) {
    S.step = n;
    qa('.wz-step').forEach(function (s) {
      s.classList.toggle('is-on', +s.getAttribute('data-step') === n);
    });
    qa('.wz-steps li').forEach(function (li) {
      var i = +li.getAttribute('data-s');
      li.classList.toggle('is-on', i === n);
      li.classList.toggle('is-done', i < n || n === 4);
    });
    /* mobiliame — grazinam i vedlio virsu */
    if (window.innerWidth < 980) {
      var top = wz.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }

  qa('.wz-next').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!canLeave(S.step)) return;
      goto(S.step + 1);
    });
  });
  qa('.wz-back').forEach(function (b) {
    b.addEventListener('click', function () { goto(S.step - 1); });
  });

  /* =========================================================
     5. Siuntimas
     ========================================================= */
  function showErr(k) {
    var e = q('#err');
    e.textContent = t(k);
    e.hidden = false;
  }
  function hideErr() { q('#err').hidden = true; }

  q('.wz-send').addEventListener('click', function () {
    hideErr();
    if (!S.nm.trim() || !S.em.trim()) return showErr('errName');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(S.em.trim())) return showErr('errMail');
    if (!S.consent) return showErr('errCons');

    var ref = 'BP-S-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    sendListing({
      ref: ref, category: S.cat, type: S.type, make: S.make, year: S.year,
      condition: S.cond, location: S.loc, photos: S.photos.length,
      name: S.nm, company: S.co, email: S.em, phone: S.ph,
      details: S.msg, consent: S.consent, lang: lang
    });

    S.sent = true;
    renderPreview();
    q('#doneRef').innerHTML = esc(t('ref')) + '<b class="dn-ref">' + ref + '</b>' + esc(t('refEnd'));
    q('#doneSteps').innerHTML = q('#nxSteps').innerHTML;
    goto(4);
  });

  q('#againBtn').addEventListener('click', function () {
    S.photos.forEach(function (p) { URL.revokeObjectURL(p.url); });
    S = { step: 1, cat: '', type: '', make: '', year: '', cond: '', loc: '', photos: [],
          nm: '', co: '', em: '', ph: '', msg: '', consent: false, sent: false };
    qa('.sl-wz input, .sl-wz textarea').forEach(function (i) {
      if (i.type === 'checkbox') i.checked = false; else i.value = '';
    });
    qa('.sl-type, .sl-cond').forEach(function (x) { x.classList.remove('is-on'); });
    renderThumbs(); renderPreview(); refreshNav(); hideErr(); goto(1);
  });

  /* Cia prijungiamas realus gavejas — visi laukai jau surinkti i data.
     Nuotraukos siunciamos atskirai (FormData), jei to reikes. */
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
      renderPreview();
      /* jei jau issiusta — perpiesiam ir patvirtinimo sarasa */
      if (S.sent) q('#doneSteps').innerHTML = q('#nxSteps').innerHTML;
    });
  }

  /* ---------- startas ---------- */
  applyPh();
  renderPreview();
  refreshNav();
})();
