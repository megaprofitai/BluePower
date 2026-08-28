/* =========================================================
   Priekinis puslapis — tik kalbos perjungimas.
   Antraštės/poraštės čia nėra, todėl site.js nenaudojamas.
   Kalba, kaip ir visoje svetainėje, keliauja per ?lang=no.
   ========================================================= */
(function () {
  'use strict';
  var lang = (new URLSearchParams(location.search).get('lang') === 'no') ? 'no' : 'en';

  function apply() {
    document.documentElement.lang = lang;
    var n = document.querySelectorAll('[data-no]');
    for (var i = 0; i < n.length; i++) {
      if (!n[i].hasAttribute('data-en')) n[i].setAttribute('data-en', n[i].innerHTML);
      n[i].innerHTML = n[i].getAttribute('data-' + lang);
    }
    var t = document.querySelector('title');
    if (t && t.dataset.no) {
      if (!t.dataset.en) t.dataset.en = t.textContent;
      t.textContent = t.dataset[lang];
    }
    var links = document.querySelectorAll('a[href]');
    for (var j = 0; j < links.length; j++) {
      var h = links[j].getAttribute('href').split('?')[0].split('#')[0];
      if (!h || /^(https?:|mailto:|tel:)/.test(h)) continue;
      links[j].setAttribute('href', h + (lang === 'no' ? '?lang=no' : ''));
    }
    var b = document.getElementById('fpLang');
    if (b) b.textContent = (lang === 'en') ? 'no' : 'en';
  }

  var btn = document.getElementById('fpLang');
  if (btn) {
    btn.addEventListener('click', function () {
      lang = (lang === 'en') ? 'no' : 'en';
      apply();
    });
  }
  apply();
})();
