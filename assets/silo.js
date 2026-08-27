/* =========================================================
   SILO — vietinė puslapio logika.
   Kol kas tik dengiamumo žemėlapio išskleidimas.
   ========================================================= */
(function () {
  'use strict';
  var btn = document.getElementById('covBtn');
  var map = document.getElementById('covMap');
  if (!btn || !map) return;
  btn.addEventListener('click', function () {
    var open = map.hasAttribute('hidden');
    if (open) map.removeAttribute('hidden'); else map.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
