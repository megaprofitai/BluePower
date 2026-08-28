/* =========================================================
   Straipsnio turinys — pazymi sekcija, kuria dabar skaitai.
   IntersectionObserver, o ne scroll klausymas: nauria naršykle
   pati praneša, kada sekcija ivaziuoja i ekrana, tad silpname
   kompiuteryje nieko neskaiciuojama kiekvienam kadrui.
   ========================================================= */
(function () {
  'use strict';
  var links = [].slice.call(document.querySelectorAll('.ar-toc a[href^="#"]'));
  if (!links.length || !('IntersectionObserver' in window)) return;

  var map = {};
  var targets = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) { map[el.id] = a; targets.push(el); }
  });

  var visible = {};
  function paint() {
    var current = null;
    for (var i = 0; i < targets.length; i++) {
      if (visible[targets[i].id]) { current = targets[i].id; break; }
    }
    links.forEach(function (a) { a.classList.remove('is-here'); });
    if (current && map[current]) map[current].classList.add('is-here');
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
    paint();
  }, { rootMargin: '-88px 0px -55% 0px' });

  targets.forEach(function (t) { io.observe(t); });
})();
