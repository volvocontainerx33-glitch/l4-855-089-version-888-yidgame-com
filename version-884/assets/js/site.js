(function () {
  var nav = document.querySelector('[data-nav]');
  var menu = document.querySelector('[data-menu-toggle]');

  if (nav && menu) {
    menu.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-slide-dot]'));
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === current);
      });
    }

    function start() {
      if (slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });

    show(0);
    start();
  });

  document.querySelectorAll('[data-filter-form]').forEach(function (form) {
    var targetSelector = form.getAttribute('data-target');
    var grid = document.querySelector(targetSelector);
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state="' + targetSelector.replace('#', '') + '"]');
    var inputs = Array.prototype.slice.call(form.querySelectorAll('input, select'));

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function apply() {
      var q = normalize(form.querySelector('[name="q"]') ? form.querySelector('[name="q"]').value : '');
      var region = normalize(form.querySelector('[name="region"]') ? form.querySelector('[name="region"]').value : '');
      var type = normalize(form.querySelector('[name="type"]') ? form.querySelector('[name="type"]').value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-keywords'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var cardType = normalize(card.getAttribute('data-type'));
        var ok = true;

        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (region && cardRegion !== region) {
          ok = false;
        }
        if (type && cardType !== type) {
          ok = false;
        }

        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    inputs.forEach(function (field) {
      field.addEventListener('input', apply);
      field.addEventListener('change', apply);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      apply();
    });

    apply();
  });

  function loadHlsScript() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve();
        return;
      }
      var existing = document.querySelector('script[data-hls-loader]');
      if (existing) {
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', reject, { once: true });
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
      script.async = true;
      script.setAttribute('data-hls-loader', '1');
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.head.appendChild(script);
    });
  }

  function prepareVideo(video) {
    var source = video.getAttribute('data-src');
    if (!source || video.getAttribute('data-ready') === '1') {
      return Promise.resolve();
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.setAttribute('data-ready', '1');
      return Promise.resolve();
    }

    return loadHlsScript().then(function () {
      if (window.Hls && window.Hls.isSupported()) {
        window.__siteHlsPlayers = window.__siteHlsPlayers || [];
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        window.__siteHlsPlayers.push(hls);
        video.setAttribute('data-ready', '1');
      } else {
        video.src = source;
        video.setAttribute('data-ready', '1');
      }
    }).catch(function () {
      video.src = source;
      video.setAttribute('data-ready', '1');
    });
  }

  document.querySelectorAll('[data-video-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');

    if (!video) {
      return;
    }

    function play() {
      prepareVideo(video).then(function () {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
          promise.catch(function () {});
        }
      });
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
    });
  });
})();
