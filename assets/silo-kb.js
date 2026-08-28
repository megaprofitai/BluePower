/* Knowledge Base — kategorijų filtras. */
(function () {
  'use strict';
  var btns = document.querySelectorAll('.si-filter');
  var cats = document.querySelectorAll('.si-cat');
  if (!btns.length) return;
  [].forEach.call(btns, function (b) {
    b.addEventListener('click', function () {
      [].forEach.call(btns, function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      var sel = b.getAttribute('data-cat');
      [].forEach.call(cats, function (c) {
        c.hidden = !(sel === 'all' || c.getAttribute('data-cat') === sel);
      });
    });
  });
})();
