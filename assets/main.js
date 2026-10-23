// Language switching (en / de / zh) and image placeholders
(function () {
  var LANGS = ['en', 'de', 'zh'];

  function pick() {
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (LANGS.indexOf(q) > -1) return q;
      var s = localStorage.getItem('lang');
      if (LANGS.indexOf(s) > -1) return s;
    } catch (e) {}
    var n = (navigator.language || 'en').slice(0, 2);
    return LANGS.indexOf(n) > -1 ? n : 'en';
  }

  function setLang(l) {
    var h = document.documentElement;
    h.setAttribute('data-lang', l);
    h.lang = l === 'zh' ? 'zh-CN' : l;
    var title = h.getAttribute('data-title-' + l);
    if (title) document.title = title;
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.querySelectorAll('[data-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set') === l));
    });
  }

  window.siteSetLang = setLang;
  setLang(pick());

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-set]');
    if (b) setLang(b.getAttribute('data-set'));
  });

  // Show a labelled placeholder when an image file is not there yet
  window.sitePlaceholders = function () {
    document.querySelectorAll('.ph img').forEach(function (img) {
      var miss = function () { img.parentNode.classList.add('missing'); };
      if (img.complete && !img.naturalWidth) miss();
      img.addEventListener('error', miss);
    });
    document.querySelectorAll('.ph video').forEach(function (v) {
      // Hide only on a real load error; networkState briefly reads NO_SOURCE while loading starts
      var miss = function () { v.parentNode.classList.add('missing'); };
      if (v.error) miss();
      v.addEventListener('error', miss);
      v.addEventListener('loadedmetadata', function () { v.parentNode.classList.remove('missing'); });
      // Optional in/out points: play only data-start..data-end, looping inside that window
      var s = parseFloat(v.getAttribute('data-start')), e = parseFloat(v.getAttribute('data-end'));
      if (!isNaN(s)) {
        var toStart = function () { v.currentTime = s; };
        if (v.readyState >= 1) toStart(); else v.addEventListener('loadedmetadata', toStart);
        v.addEventListener('timeupdate', function () { if (!isNaN(e) && v.currentTime >= e) toStart(); });
        v.addEventListener('ended', function () { toStart(); v.play(); });
      }
    });
    document.querySelectorAll('.snd').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = (b.closest('.gcard') || b.parentNode).querySelector('video');
        v.muted = !v.muted;
        if (!v.muted) v.play();
        b.setAttribute('aria-pressed', String(!v.muted));
      });
    });
    // Clips marked data-inview play only while on screen
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var v = en.target;
          if (en.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { threshold: 0.5 });
      document.querySelectorAll('video[data-inview]').forEach(function (v) { io.observe(v); });
    }
  };
  window.sitePlaceholders();

  // Photo slideshows: cross-fade every 4.5 s (still image if the visitor prefers reduced motion)
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.slides').forEach(function (box) {
    var imgs = box.querySelectorAll('img'), i = 0;
    if (imgs.length < 2 || still) return;
    setInterval(function () {
      if (document.hidden) return;
      imgs[i].classList.remove('on');
      i = (i + 1) % imgs.length;
      imgs[i].classList.add('on');
    }, 4500);
  });
})();
