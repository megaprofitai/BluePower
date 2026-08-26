/* =========================================================
   BLUEPOWER — buy.js
   Korteles + modalas su gaminio info ir pirkimo uzklausos forma.
   Priklauso nuo buy-data.js (BUY_ITEMS).

   Forma NIEKUR nesiunciama. Prijungiant: zr. sendEnquiry() apacioje.
   ========================================================= */
(function () {
  'use strict';
  if (typeof BUY_ITEMS === 'undefined') return;

  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';
  function L(item, key) {
    var noKey = key + 'No';
    return (lang === 'no' && item[noKey]) ? item[noKey] : item[key];
  }
  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---------- kortele ---------- */
  function mediaHTML(it) {
    if (it.photo) return '<img src="' + it.photo + '" alt="' + it.name + '" class="b-photo">';
    return '<div class="b-photo b-empty" data-unit="' + it.id + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>' +
      '<span>Photo to be added</span></div>';
  }

  function priceHTML(it) {
    if (it.price) return '<span class="u-price">from <b>' + fmt(it.price) + ' kr</b></span>';
    return '<span class="u-price muted-price">Price on request</span>';
  }

  function condLabel(it) {
    if (lang === 'no') return it.condition === 'used' ? 'Brukt' : 'Ny';
    return it.condition === 'used' ? 'Used' : 'New';
  }

  function cardHTML(it) {
    return '' +
      '<article class="u-card b-card" data-id="' + it.id + '" tabindex="0" role="button" ' +
        'aria-label="' + it.name + ' — details and enquiry">' +
        '<div class="u-art b-art">' +
          '<span class="u-badge cond-' + it.condition + '"><i></i>' + condLabel(it) + '</span>' +
          mediaHTML(it) +
        '</div>' +
        '<div class="u-body">' +
          '<h3>' + it.name + '</h3>' +
          '<p class="u-tag">' + L(it, 'tagline') + '</p>' +
          '<div class="u-chips">' + it.chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>' +
          '<p class="u-serviced">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>' +
            'CE &amp; EMC certified · delivered by Bluepower</p>' +
          '<div class="u-foot">' + priceHTML(it) +
            '<span class="u-open">Details &amp; enquiry' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
            '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function render() {
    var g = document.getElementById('gridBuy');
    if (g) g.innerHTML = BUY_ITEMS.map(cardHTML).join('');
  }

  /* ---------- modalas ---------- */
  var modal, lastFocus;

  function specsHTML(it) {
    if (!it.specs || !it.specs.length) {
      return '<div class="b-pending">Technical specifications to be added.</div>';
    }
    return '<div class="bm-specs">' + it.specs.map(function (r) {
      return '<div class="sp-row"><span>' + r[0] + '</span><b>' + r[1] + '</b></div>';
    }).join('') + '</div>';
  }

  function modalHTML(it) {
    return '' +
    '<div class="bm-overlay" data-close></div>' +
    '<div class="bm" role="dialog" aria-modal="true" aria-labelledby="bmTitle">' +
      '<header class="bm-head">' +
        '<div><p class="bm-eyebrow">' + it.brand + '</p><h2 id="bmTitle">' + it.name + '</h2></div>' +
        '<button class="bm-close" type="button" data-close aria-label="Close">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="bm-body">' +
        '<div class="bm-left">' +
          '<div class="b-modal-media">' + mediaHTML(it) + '</div>' +
          '<p class="bm-desc">' + L(it, 'desc') + '</p>' +
          '<h4>Typical applications</h4>' +
          '<div class="bm-apps">' + L(it, 'apps').map(function (a) { return '<span>' + a + '</span>'; }).join('') + '</div>' +
          '<h4>Technical specifications</h4>' + specsHTML(it) +
          (it.note ? '<p class="b-note">' + it.note + '</p>' : '') +
        '</div>' +

        '<div class="bm-right">' +
          '<div class="wz">' +
            '<section class="wz-step is-on" data-step="1">' +
              '<h3>Request to buy</h3>' +
              '<p class="wz-hint">Send an enquiry and a specialist gets back to you with availability, configuration and a written offer.</p>' +
              '<div class="wz-fields">' +
                '<label>Name<input type="text" name="nm" placeholder="Your name"></label>' +
                '<label>Company<input type="text" name="co" placeholder="Company"></label>' +
                '<label>Email<input type="email" name="em" placeholder="you@company.no"></label>' +
                '<label>Phone<input type="tel" name="ph" placeholder="+47 …"></label>' +
              '</div>' +
              '<label class="wz-msg">Message' +
                '<textarea name="msg" rows="4" placeholder="Tell us about the job, timing or the configuration you need."></textarea>' +
              '</label>' +
              '<div class="lp lp-sum">' +
                '<div class="lp-head"><span>Your enquiry</span></div>' +
                '<div class="lp-line"><span>Equipment</span><b>' + it.name + '</b></div>' +
                '<div class="lp-line"><span>Condition</span><b>' + condLabel(it) + '</b></div>' +
                '<div class="lp-line"><span>Price</span><b>' +
                  (it.price ? fmt(it.price) + ' kr' : 'On request') + '</b></div>' +
              '</div>' +
              '<p class="wz-err" hidden>Please add an email or phone so we can reply.</p>' +
              '<button class="btn btn-primary wz-send" type="button">Send enquiry' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>' +
              '</button>' +
            '</section>' +

            '<section class="wz-step wz-done" data-step="2">' +
              '<div class="dn-tick">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>' +
              '</div>' +
              '<h3>Enquiry sent</h3>' +
              '<p class="wz-hint">Your reference is <b class="dn-ref"></b>. A specialist replies within one working day.</p>' +
              '<button class="btn btn-outline" type="button" data-close>Close</button>' +
            '</section>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function openModal(it) {
    lastFocus = document.activeElement;
    modal = document.createElement('div');
    modal.className = 'bm-wrap';
    modal.innerHTML = modalHTML(it);
    document.body.appendChild(modal);
    document.body.classList.add('locked');

    var q = function (s) { return modal.querySelector(s); };

    q('.wz-send').addEventListener('click', function () {
      var em = q('[name=em]').value.trim(), ph = q('[name=ph]').value.trim();
      var err = q('.wz-err');
      if (!em && !ph) { err.hidden = false; return; }
      err.hidden = true;
      sendEnquiry({
        item: it.name, itemId: it.id, condition: it.condition,
        price: it.price || 'on request',
        name: q('[name=nm]').value.trim(), company: q('[name=co]').value.trim(),
        email: em, phone: ph, message: q('[name=msg]').value.trim()
      });
      q('.dn-ref').textContent = 'BP-' + new Date().getFullYear() + '-' +
        String(Math.floor(1000 + Math.random() * 9000));
      q('.wz-step[data-step="1"]').classList.remove('is-on');
      q('.wz-step[data-step="2"]').classList.add('is-on');
      q('.bm-right').scrollTop = 0;
    });

    [].slice.call(modal.querySelectorAll('[data-close]')).forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', onKey);
    modal.addEventListener('keydown', trapTab);
    var c = q('.bm-close'); if (c) c.focus();
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
     Kol kas niekur nesiunciama. Prijungiant realu gaveja:
       return fetch('https://formspree.io/f/XXXX', {
         method:'POST', headers:{'Content-Type':'application/json'},
         body: JSON.stringify(data) });
     ========================================================= */
  function sendEnquiry(data) {
    console.log('[Bluepower] Pirkimo uzklausa (dar nesiunciama):', data);
  }

  /* ---------- paleidimas ---------- */
  render();
  function openFromCard(card) {
    var it = BUY_ITEMS.filter(function (x) { return x.id === card.getAttribute('data-id'); })[0];
    if (it) openModal(it);
  }
  document.addEventListener('click', function (e) {
    if (modal) return;
    var card = e.target.closest ? e.target.closest('.b-card') : null;
    if (card) openFromCard(card);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var card = e.target.closest ? e.target.closest('.b-card') : null;
    if (!card) return;
    e.preventDefault();
    openFromCard(card);
  });
})();
