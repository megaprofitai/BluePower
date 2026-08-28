/* =========================================================
   SILO — „Request Help" trijų žingsnių vedlys.
   Naudoja tuos pačius komponentus kaip sell.html (.wz-*, .sl-*)
   ir contact.html (Brønnøysund paieška, .ct-switch).
   Formos duomenys kol kas eina tik į konsolę — sendRequest().
   ========================================================= */
(function () {
  'use strict';

  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';
  var q = function (s) { return document.querySelector(s); };
  var qa = function (s) { return [].slice.call(document.querySelectorAll(s)); };

  var T = {
    need:    { en: 'Please fill in company, contact person and email.',
               no: 'Fyll inn firma, kontaktperson og e-post.' },
    mail:    { en: 'Please enter a valid email address.',
               no: 'Skriv inn en gyldig e-postadresse.' },
    consent: { en: 'Please confirm that we may contact you.',
               no: 'Bekreft at vi kan kontakte deg.' },
    ref:     { en: 'Reference: ', no: 'Referanse: ' },
    offline: { en: 'Registry unavailable — type the name manually.',
               no: 'Registeret er utilgjengelig — skriv navnet manuelt.' },
    sel:     { en: 'Select…', no: 'Velg …' },
    unknown: { en: 'Unknown', no: 'Ukjent' }
  };
  function t(k) { return T[k][lang]; }

  /* ---------- iškrentantys sąrašai ---------- */
  var OPTS = {
    mat:  [['Cement / minerals','Sement / mineraler'], ['Grain / feed','Korn / fôr'],
           ['Biomass / wood','Biomasse / trevirke'], ['Coal / ash','Kull / aske'],
           ['Plastic granulate','Plastgranulat'], ['Chemicals','Kjemikalier'], ['Other','Annet']],
    blk:  [['Bridging','Brodannelse'], ['Ratholing','Kanaldannelse'],
           ['Wall build-up','Belegg på vegg'], ['Hardened / compacted material','Herdet / sammenpakket materiale'],
           ['Blocked discharge','Blokkert utløp'], ['Unknown','Ukjent']],
    insp: [['Recent internal inspection','Nylig innvendig inspeksjon'],
           ['Camera / drone footage','Kamera- eller droneopptak'],
           ['Visual from top hatch only','Kun visuelt fra toppluke'],
           ['No inspection','Ingen inspeksjon']],
    atex: [['Unknown','Ukjent'], ['Zone 20','Sone 20'], ['Zone 21','Sone 21'],
           ['Zone 22','Sone 22'], ['Not ATEX classified','Ikke ATEX-klassifisert']]
  };
  /* Sąrašai piešiami JS'u, todėl data-no čia NEGALIMAS — applyLang() jį
     perrašytų. Kalbą taikom patys ir perpiešiam perjungus. */
  function fillSelects() {
    var i = (lang === 'no') ? 1 : 0;
    Object.keys(OPTS).forEach(function (k) {
      var sel = q('[name=' + k + ']');
      if (!sel) return;
      var keep = sel.value;
      var first = (k === 'atex') ? 'unknown' : 'sel';
      sel.innerHTML = '<option value="">' + t(first) + '</option>' +
        OPTS[k].map(function (o) {
          return '<option value="' + o[0] + '">' + o[i] + '</option>';
        }).join('');
      sel.value = keep;
    });
  }
  fillSelects();

  /* ---------- žingsniai ---------- */
  var steps = qa('.wz-step'), dots = qa('.wz-steps li');
  function go(n) {
    steps.forEach(function (s, i) { s.classList.toggle('is-on', i === n); });
    dots.forEach(function (d, i) {
      d.classList.toggle('is-on', i === n);
      d.classList.toggle('is-done', i < n);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Norvegija / tarptautinis ---------- */
  var loc = 'no';
  qa('.ct-opt').forEach(function (b) {
    b.addEventListener('click', function () {
      qa('.ct-opt').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      loc = b.getAttribute('data-loc');
      q('#noFields').hidden = (loc !== 'no');
      q('#intFields').hidden = (loc !== 'int');
      hideRes();
    });
  });

  /* ---------- Brønnøysund ---------- */
  var co = q('#rqCo'), res = q('#rqCoRes'), timer;
  co.addEventListener('input', function () {
    clearTimeout(timer);
    var term = co.value.trim();
    if (term.length < 2) { hideRes(); return; }
    timer = setTimeout(function () { lookup(term); }, 280);
  });
  function lookup(term) {
    fetch('https://data.brreg.no/enhetsregisteret/api/enheter?size=6&navn=' + encodeURIComponent(term),
          { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        var list = (d._embedded && d._embedded.enheter) || [];
        if (!list.length) { note(t('offline')); return; }
        res.innerHTML = list.map(function (e) {
          return '<button type="button" data-nm="' + esc(e.navn) + '">' +
                 esc(e.navn) + '<small>' + esc(e.organisasjonsnummer) + '</small></button>';
        }).join('');
        res.hidden = false;
      })
      .catch(function () { note(t('offline')); });
  }
  function note(txt) { res.innerHTML = '<p class="ct-note">' + txt + '</p>'; res.hidden = false; }
  function hideRes() { res.hidden = true; res.innerHTML = ''; }
  res.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-nm]');
    if (!b) return;
    co.value = b.getAttribute('data-nm');
    hideRes();
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#noFields')) hideRes();
  });
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- nuotraukos (tik peržiūrai, niekur nesiunčiamos) ---------- */
  var files = [];
  var drop = q('#rqDrop'), input = q('#rqFiles'), thumbs = q('#rqThumbs');
  q('#rqPick').addEventListener('click', function () { input.click(); });
  input.addEventListener('change', function () { add(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach(function (n) {
    drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.add('is-over'); });
  });
  ['dragleave', 'drop'].forEach(function (n) {
    drop.addEventListener(n, function (e) { e.preventDefault(); drop.classList.remove('is-over'); });
  });
  drop.addEventListener('drop', function (e) { add(e.dataTransfer.files); });
  function add(list) {
    [].forEach.call(list, function (f) {
      if (!/^image\/(jpeg|png)$/.test(f.type) || files.length >= 8) return;
      files.push({ name: f.name, url: URL.createObjectURL(f) });
    });
    render();
  }
  function render() {
    thumbs.innerHTML = files.map(function (f, i) {
      return '<figure class="sl-thumb"><img src="' + f.url + '" alt="">' +
             '<button type="button" data-i="' + i + '" aria-label="Remove">&times;</button></figure>';
    }).join('');
  }
  thumbs.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-i]');
    if (!b) return;
    var i = +b.getAttribute('data-i');
    URL.revokeObjectURL(files[i].url);
    files.splice(i, 1);
    render();
  });

  /* ---------- validacija ir siuntimas ---------- */
  function err(k) { var e = q('#rqErr'); e.textContent = t(k); e.hidden = false; }
  function clearErr() { q('#rqErr').hidden = true; }
  qa('.rq-form input, .rq-form textarea').forEach(function (el) {
    el.addEventListener('input', clearErr);
  });

  var REF = '';
  q('#rqNext').addEventListener('click', function () {
    var company = (loc === 'no') ? co.value.trim() : q('[name=coInt]').value.trim();
    var nm = q('[name=nm]').value.trim();
    var em = q('[name=em]').value.trim();
    if (!company || !nm || !em) { err('need'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { err('mail'); return; }
    if (!q('#rqConsent').checked) { err('consent'); return; }
    clearErr();
    go(1);
  });

  function finish() {
    REF = 'BP-S-2026-' + String(Math.floor(1000 + Math.random() * 9000));
    sendRequest(collect());
    q('#rqRef').textContent = t('ref') + REF;
    go(2);
  }
  q('#rqSkip').addEventListener('click', finish);
  q('#rqSend').addEventListener('click', finish);

  function collect() {
    var val = function (n) { var e = q('[name=' + n + ']'); return e ? e.value.trim() : ''; };
    return {
      ref: REF, location: loc,
      company: (loc === 'no') ? co.value.trim() : val('coInt'),
      country: (loc === 'no') ? 'Norway' : val('country'),
      contact: val('nm'), email: val('em'), phone: val('ph'), message: val('msg'),
      plant: { name: val('plant'), address: val('addr'), country: val('ctry') },
      silo: { id: val('siloId'), height: val('h'), diameter: val('d'), volume: val('v') },
      material: val('mat'), blockage: val('blk'), capacity: val('cap'),
      inspection: val('insp'), atex: val('atex'),
      attachments: files.map(function (f) { return f.name; })
    };
  }

  /* Vienintelė vieta, kurią reikės pakeisti prijungiant tikrą endpoint'ą. */
  function sendRequest(data) {
    console.log('sendRequest()', data);
    /* return fetch('https://…', { method:'POST', body: JSON.stringify(data) }); */
  }

  /* ---------- placeholder'iai ir kalba ---------- */
  function applyPh() {
    qa('[data-ph-no]').forEach(function (el) {
      el.placeholder = (lang === 'no') ? el.getAttribute('data-ph-no')
                                       : (el.getAttribute('data-ph-en') || el.placeholder);
    });
  }
  qa('[data-ph-no]').forEach(function (el) { el.setAttribute('data-ph-en', el.placeholder); });
  applyPh();

  var langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      lang = (lang === 'en') ? 'no' : 'en';
      applyPh();
      fillSelects();
      if (REF) q('#rqRef').textContent = t('ref') + REF;
      if (!q('#rqErr').hidden) q('#rqErr').textContent = q('#rqErr').textContent;
    });
  }
})();
