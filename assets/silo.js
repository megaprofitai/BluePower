/* =========================================================
   SILO — vietinė puslapio logika.
   1) dengiamumo žemėlapio išskleidimas
   2) technologijų kortelės — spaudžiama visa kortelė
   3) DUK — atsakymas išsiskleidžia toje pačioje dėžutėje
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

  var covBtn = document.getElementById('covBtn');
  var covMap = document.getElementById('covMap');
  if (covBtn && covMap) toggler(covBtn, covMap);

  var cards = document.querySelectorAll('.si-tcard');
  for (var i = 0; i < cards.length; i++) {
    var b = cards[i].querySelector('.si-tbtn');
    var p = cards[i].querySelector('.si-texp');
    if (b && p) toggler(b, p);
  }

  var qs = document.querySelectorAll('.si-qi');
  for (var j = 0; j < qs.length; j++) {
    var qb = qs[j].querySelector('.si-q');
    var qa = qs[j].querySelector('.si-qa');
    if (qb && qa) toggler(qb, qa);
  }
})();
