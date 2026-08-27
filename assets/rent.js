/* =========================================================
   BLUEPOWER — rent.js
   Katalogas, paieška, filtrai ir 3 žingsnių rezervacijos vedlys.
   Priklauso nuo rent-data.js (ART + PRODUCTS).

   Forma NIEKUR nesiunčiama — parodo patvirtinimą su numeriu.
   Prijungiant realų siuntimą: žr. sendBooking() apačioje.
   ========================================================= */
(function () {
  'use strict';
  if (typeof PRODUCTS === 'undefined') return;

  var MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var WEEKS_SHOWN = 8;

  /* ---------- datos skaičiuojamos nuo šiandien ---------- */
  function mondayOf(d) {
    var x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    var day = (x.getDay() + 6) % 7;          /* pirmadienis = 0 */
    x.setDate(x.getDate() - day);
    return x;
  }
  function addDays(d, n) {
    var x = new Date(d.getTime());
    x.setDate(x.getDate() + n);
    return x;
  }
  function weekStarts() {
    var m = mondayOf(new Date()), out = [];
    for (var i = 0; i < WEEKS_SHOWN; i++) out.push(addDays(m, i * 7));
    return out;
  }
  function dLabel(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].charAt(0) + MONTHS[d.getMonth()].slice(1, 3).toLowerCase(); }
  function iso(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var WK = weekStarts();

  /* pirma laisva savaitė po užimtų */
  function firstFree(p) {
    for (var i = 0; i < WEEKS_SHOWN; i++) if (p.status.taken.indexOf(i) === -1) return WK[i];
    return WK[0];
  }
  function isFreeNow(p) { return p.status.taken.indexOf(0) === -1; }

  /* ---------- kainodara (kaip ankstesniame demo) ---------- */
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function calc(p, from, to, post, op) {
    var days = Math.max(1, Math.round((to - from) / 86400000));
    var weeks = Math.max(1, Math.ceil(days / 7));
    var rental = p.week * weeks;
    var pc = (post || '').trim();
    var transport = 3900 + (pc ? (parseInt(pc[0], 10) || 3) * 420 : 1260);
    var operator = op ? weeks * 5 * 8 * 1150 : 0;
    var insurance = Math.round(rental * 0.04);
    return { days: days, weeks: weeks, rental: rental, transport: transport,
             operator: operator, insurance: insurance,
             total: rental + transport + operator + insurance, pc: pc };
  }

  /* ---------- katalogo kortelės ---------- */
  function artFor(p) {
    /* Jei produktui nurodyta nuotrauka — naudojam ją vietoj SVG piešinio. */
    if (p.photo) return '<img src="' + p.photo + '" alt="' + p.name + '" class="u-photo">';
    return ART[p.art] || '';
  }

  function cardHTML(p) {
    var free = isFreeNow(p);
    var badge = free
      ? '<span class="u-badge free"><i></i>Available now</span>'
      : '<span class="u-badge busy"><i></i>On hire · free ' + dLabel(firstFree(p)) + '</span>';
    return '' +
      '<article class="u-card" data-id="' + p.id + '" data-cat="' + p.cat + '" ' +
        'tabindex="0" role="button" aria-label="' + p.name + ' — details and booking" ' +
        'data-search="' + (p.name + ' ' + p.tagline + ' ' + p.chips.join(' ')).toLowerCase().replace(/"/g, '') + '">' +
        '<div class="u-art">' + badge + artFor(p) + '</div>' +
        '<div class="u-body">' +
          '<h3>' + p.name + '</h3>' +
          '<p class="u-tag">' + p.tagline + '</p>' +
          '<div class="u-chips">' + p.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
          '<p class="u-serviced">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' +
            'Fully serviced · hoses &amp; nozzles included</p>' +
          '<div class="u-foot">' +
            '<span class="u-price">from <b>' + fmt(p.week) + ' kr</b>/week</span>' +
            '<span class="u-open">Details &amp; booking' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderGrids() {
    var map = { pump: 'gridPumps', robot: 'gridRobots', atex: 'gridAtex' };
    var buckets = { gridPumps: [], gridRobots: [], gridAtex: [] };
    PRODUCTS.forEach(function (p) { buckets[map[p.cat]].push(cardHTML(p)); });
    Object.keys(buckets).forEach(function (k) {
      var el = document.getElementById(k);
      if (el) el.innerHTML = buckets[k].join('');
    });
  }

  /* ---------- paieška + filtrai ---------- */
  function wireFilters() {
    var input = document.getElementById('unitSearch');
    var pills = [].slice.call(document.querySelectorAll('.f-pill'));
    var cat = 'all';

    function apply() {
      var q = (input ? input.value : '').trim().toLowerCase();
      PRODUCTS.forEach(function (p) {
        var el = document.querySelector('.u-card[data-id="' + p.id + '"]');
        if (!el) return;
        var okCat = (cat === 'all' || p.cat === cat);
        var okQ = !q || el.getAttribute('data-search').indexOf(q) !== -1;
        el.style.display = (okCat && okQ) ? '' : 'none';
      });
      /* sekcija slepiama, jei joje neliko nė vienos kortelės */
      ['pumps', 'robots', 'atex'].forEach(function (id) {
        var sec = document.getElementById(id);
        if (!sec) return;
        var any = [].slice.call(sec.querySelectorAll('.u-card')).some(function (c) { return c.style.display !== 'none'; });
        sec.style.display = any ? '' : 'none';
      });
      var none = document.getElementById('noResults');
      if (none) none.hidden = PRODUCTS.some(function (p) {
        var el = document.querySelector('.u-card[data-id="' + p.id + '"]');
        return el && el.style.display !== 'none';
      });
    }

    if (input) input.addEventListener('input', apply);
    pills.forEach(function (b) {
      b.addEventListener('click', function () {
        pills.forEach(function (x) { x.classList.remove('is-on'); });
        b.classList.add('is-on');
        cat = b.getAttribute('data-cat');
        apply();
      });
    });
  }

  /* ---------- modalas su vedliu ---------- */
  var modal, lastFocus, state;

  function specRows(p) {
    return p.table.map(function (r) {
      return '<div class="sp-row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
    }).join('');
  }

  function weekStripHTML(p) {
    return WK.map(function (d, i) {
      var taken = p.status.taken.indexOf(i) !== -1;
      return '<button type="button" class="wk' + (taken ? ' taken' : '') + '" data-i="' + i + '"' +
        (taken ? ' disabled aria-disabled="true"' : '') + '>' +
        '<span class="wk-d">' + d.getDate() + '</span>' +
        '<span class="wk-m">' + MONTHS[d.getMonth()] + '</span></button>';
    }).join('');
  }

  function modalHTML(p) {
    return '' +
    '<div class="bm-overlay" data-close></div>' +
    '<div class="bm" role="dialog" aria-modal="true" aria-labelledby="bmTitle">' +
      '<header class="bm-head">' +
        '<div><p class="bm-eyebrow">' + catName(p.cat) + '</p><h2 id="bmTitle">' + p.name + '</h2></div>' +
        '<button class="bm-close" type="button" data-close aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="bm-body">' +
        '<div class="bm-left">' +
          '<p class="bm-desc">' + p.desc + '</p>' +
          '<h4>Typical applications</h4>' +
          '<div class="bm-apps">' + p.apps.map(function (a) { return '<span>' + a + '</span>'; }).join('') + '</div>' +
          '<h4>Technical specifications</h4>' +
          '<div class="bm-specs">' + specRows(p) + '</div>' +
        '</div>' +

        '<div class="bm-right">' +
          '<div class="wz">' +
            '<ol class="wz-steps">' +
              '<li class="is-on" data-s="1"><b>1</b>When</li>' +
              '<li data-s="2"><b>2</b>Where</li>' +
              '<li data-s="3"><b>3</b>Who</li>' +
            '</ol>' +

            '<section class="wz-step is-on" data-step="1">' +
              '<h3>When do you need it?</h3>' +
              '<p class="wz-hint">Tap a start week, then an end week. Amber weeks are on hire.</p>' +
              '<div class="avail-strip">' + weekStripHTML(p) + '</div>' +
              '<div class="wz-legend"><span class="lg free">Available</span><span class="lg busy">Booked</span></div>' +
              '<p class="wz-sel">Selected period: <b class="sel-txt">—</b></p>' +
              '<div class="wz-dates">' +
                '<label>From<input type="date" name="from"></label>' +
                '<label>To<input type="date" name="to"></label>' +
              '</div>' +
              '<button class="btn btn-primary wz-next" type="button" disabled>Continue' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
              '</button>' +
            '</section>' +

            '<section class="wz-step" data-step="2">' +
              '<h3>Where &amp; how?</h3>' +
              '<p class="wz-hint">We work out transport from Porsgrunn instantly — no button to press.</p>' +
              '<div class="wz-fields">' +
                '<label>Delivery postcode<input type="text" name="post" inputmode="numeric" placeholder="e.g. 3937" maxlength="4"></label>' +
                '<label>With operator?<select name="op">' +
                  '<option value="">No — bare rental</option>' +
                  '<option value="1">Yes — with operator</option>' +
                '</select></label>' +
              '</div>' +
              '<div class="lp">' +
                '<div class="lp-head"><span>Your price</span><span class="lp-live">Live</span></div>' +
                '<div class="lp-lines"></div>' +
                '<p class="lp-note">All prices ex. VAT · incl. wear parts &amp; service check</p>' +
              '</div>' +
              '<div class="wz-nav">' +
                '<button class="btn btn-outline wz-back" type="button">Back</button>' +
                '<button class="btn btn-primary wz-next" type="button">Continue' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
                '</button>' +
              '</div>' +
            '</section>' +

            '<section class="wz-step" data-step="3">' +
              '<h3>Almost done — who\'s it for?</h3>' +
              '<p class="wz-hint">A specialist confirms every booking within one working hour (08–16 CET).</p>' +
              '<div class="wz-fields">' +
                '<label>Name<input type="text" name="nm" placeholder="Your name"></label>' +
                '<label>Company<input type="text" name="co" placeholder="Company"></label>' +
                '<label>Email<input type="email" name="em" placeholder="you@company.no"></label>' +
                '<label>Phone<input type="tel" name="ph" placeholder="+47 …"></label>' +
              '</div>' +
              '<div class="lp lp-sum">' +
                '<div class="lp-head"><span>Booking summary</span></div>' +
                '<div class="lp-lines"></div>' +
              '</div>' +
              '<p class="wz-err" hidden>Please add an email or phone so we can confirm.</p>' +
              '<div class="wz-nav">' +
                '<button class="btn btn-outline wz-back" type="button">Back</button>' +
                '<button class="btn btn-primary wz-send" type="button">Send booking request' +
                  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>' +
                '</button>' +
              '</div>' +
            '</section>' +

            '<section class="wz-step wz-done" data-step="4">' +
              '<div class="dn-tick">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
              '</div>' +
              '<h3>Booking request sent</h3>' +
              '<p class="wz-hint">Your reference is <b class="dn-ref"></b>. A specialist confirms within one working hour.</p>' +
              '<ol class="dn-steps">' +
                '<li><b>1</b>Confirmed by a specialist</li>' +
                '<li><b>2</b>Transport booked from Porsgrunn</li>' +
                '<li><b>3</b>Delivered <span class="dn-date"></span></li>' +
              '</ol>' +
              '<button class="btn btn-outline" type="button" data-close>Close</button>' +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function catName(c) {
    return c === 'pump' ? 'High-pressure pumps' : (c === 'robot' ? 'Robots' : 'ATEX vacuum equipment');
  }

  /* ---------- vedlio logika ---------- */
  function openModal(p) {
    lastFocus = document.activeElement;
    modal = document.createElement('div');
    modal.className = 'bm-wrap';
    modal.innerHTML = modalHTML(p);
    document.body.appendChild(modal);
    document.body.classList.add('locked');

    state = { p: p, a: null, b: null, from: null, to: null, post: '', op: false, step: 1 };

    var q = function (s) { return modal.querySelector(s); };
    var qa = function (s) { return [].slice.call(modal.querySelectorAll(s)); };

    /* --- savaičių juosta --- */
    var weekBtns = qa('.avail-strip .wk');
    function paint() {
      weekBtns.forEach(function (b, i) {
        b.classList.remove('sel', 'in');
        if (state.a !== null && state.b !== null && i > state.a && i < state.b) b.classList.add('in');
        if (i === state.a || i === state.b) b.classList.add('sel');
      });
      var ok = state.a !== null;
      if (ok) {
        var a = WK[state.a];
        var endIdx = (state.b === null ? state.a : state.b);
        var b = addDays(WK[endIdx], 6);
        state.from = a; state.to = b;
        q('[name=from]').value = iso(a);
        q('[name=to]').value = iso(b);
        var w = endIdx - state.a + 1;
        q('.sel-txt').textContent = dLabel(a) + ' → ' + dLabel(b) + ' · ' + w + (w === 1 ? ' week' : ' weeks');
      }
      q('.wz-step[data-step="1"] .wz-next').disabled = !ok;
    }
    weekBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        if (state.a === null || state.b !== null) { state.a = i; state.b = null; }
        else if (i < state.a) { state.a = i; state.b = null; }
        else {
          /* neleidžiam peršokti per užimtą savaitę */
          for (var k = state.a; k <= i; k++) {
            if (p.status.taken.indexOf(k) !== -1) { state.a = i; state.b = null; paint(); return; }
          }
          state.b = i;
        }
        paint();
      });
    });
    /* rankinis datų įvedimas */
    ['from', 'to'].forEach(function (nm) {
      q('[name=' + nm + ']').addEventListener('change', function (e) {
        var v = e.target.value; if (!v) return;
        var d = new Date(v + 'T00:00:00');
        if (nm === 'from') state.from = d; else state.to = d;
        if (state.from && state.to && state.to > state.from) {
          q('.wz-step[data-step="1"] .wz-next').disabled = false;
          q('.sel-txt').textContent = dLabel(state.from) + ' → ' + dLabel(state.to);
        }
      });
    });

    /* --- gyva kaina --- */
    function refreshPrice() {
      if (!state.from || !state.to) return;
      var c = calc(p, state.from, state.to, state.post, state.op);
      var rows = [
        ['Rental · ' + c.weeks + (c.weeks === 1 ? ' week' : ' weeks'), c.rental],
        ['Transport &amp; mobilisation' + (c.pc ? ' · ' + c.pc : ''), c.transport]
      ];
      if (c.operator) rows.push(['Operator · ' + (c.weeks * 5) + ' days', c.operator]);
      rows.push(['Damage waiver (4%)', c.insurance]);
      var html = rows.map(function (r) {
        return '<div class="lp-line"><span>' + r[0] + '</span><b>' + fmt(r[1]) + ' kr</b></div>';
      }).join('') +
        '<div class="lp-line tot"><span>Estimated total</span><b>' + fmt(c.total) + ' kr</b></div>';
      qa('.lp-lines').forEach(function (el) { el.innerHTML = html; });
    }
    q('[name=post]').addEventListener('input', function (e) {
      state.post = e.target.value.replace(/\D/g, ''); e.target.value = state.post; refreshPrice();
    });
    q('[name=op]').addEventListener('change', function (e) { state.op = !!e.target.value; refreshPrice(); });

    /* --- žingsnių navigacija --- */
    function go(n) {
      state.step = n;
      qa('.wz-step').forEach(function (s) { s.classList.toggle('is-on', +s.getAttribute('data-step') === n); });
      qa('.wz-steps li').forEach(function (li) {
        var s = +li.getAttribute('data-s');
        li.classList.toggle('is-on', s === n);
        li.classList.toggle('is-done', s < n);
      });
      if (n === 2 || n === 3) refreshPrice();
      var body = q('.bm-right'); if (body) body.scrollTop = 0;
    }
    qa('.wz-next').forEach(function (b) { b.addEventListener('click', function () { go(state.step + 1); }); });
    qa('.wz-back').forEach(function (b) { b.addEventListener('click', function () { go(state.step - 1); }); });

    /* --- siuntimas --- */
    q('.wz-send').addEventListener('click', function () {
      var em = q('[name=em]').value.trim(), ph = q('[name=ph]').value.trim();
      var err = q('.wz-err');
      if (!em && !ph) { err.hidden = false; return; }
      err.hidden = true;
      sendBooking({
        unit: p.name, unitId: p.id,
        from: state.from ? iso(state.from) : '', to: state.to ? iso(state.to) : '',
        postcode: state.post, operator: state.op,
        name: q('[name=nm]').value.trim(), company: q('[name=co]').value.trim(),
        email: em, phone: ph,
        price: calc(p, state.from, state.to, state.post, state.op)
      });
      var ref = 'BP-' + new Date().getFullYear() + '-' + String(Math.floor(1000 + Math.random() * 9000));
      q('.dn-ref').textContent = ref;
      q('.dn-date').textContent = state.from ? dLabel(state.from) : '';
      go(4);
    });

    /* --- uždarymas --- */
    qa('[data-close]').forEach(function (el) { el.addEventListener('click', closeModal); });
    document.addEventListener('keydown', onKey);
    modal.addEventListener('keydown', trapTab);
    var cl = q('.bm-close'); if (cl) cl.focus();

    paint();
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

  /* =========================================================
     SIUNTIMAS — kol kas niekur nekeliauja.
     Prijungiant realų gavėją, pakeisti šios funkcijos vidų, pvz.:

       return fetch('https://formspree.io/f/XXXX', {
         method:'POST',
         headers:{'Content-Type':'application/json'},
         body: JSON.stringify(data)
       });

     Visi laukai jau surinkti į `data`.
     ========================================================= */
  function sendBooking(data) {
    console.log('[BluePower] Rezervacijos užklausa (dar nesiunčiama):', data);
  }

  /* ---------- paleidimas ---------- */
  renderGrids();
  wireFilters();
  function openFromCard(card) {
    var p = PRODUCTS.filter(function (x) { return x.id === card.getAttribute('data-id'); })[0];
    if (p) openModal(p);
  }
  document.addEventListener('click', function (e) {
    if (modal) return;                      /* modalas jau atidarytas */
    var card = e.target.closest ? e.target.closest('.u-card') : null;
    if (card) openFromCard(card);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest ? e.target.closest('.u-card') : null;
    if (!card) return;
    e.preventDefault();
    openFromCard(card);
  });
})();
