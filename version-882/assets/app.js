(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function initMobileNav() {
    var button = document.querySelector(".mobile-toggle");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function initHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function initFilters() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-filter-input]"));
    inputs.forEach(function (input) {
      var targetSelector = input.getAttribute("data-filter-input");
      var target = targetSelector ? document.querySelector(targetSelector) : null;
      if (!target) {
        return;
      }
      var cards = Array.prototype.slice.call(target.querySelectorAll(".movie-card, .horizontal-item"));

      function apply() {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = [
            card.getAttribute("data-title"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.textContent
          ].join(" ").toLowerCase();
          card.hidden = query.length > 0 && text.indexOf(query) === -1;
        });
      }

      input.addEventListener("input", apply);
      var params = new URLSearchParams(window.location.search);
      var initial = params.get("q");
      if (initial) {
        input.value = initial;
        apply();
      }
    });
  }

  function initPlayer(streamUrl) {
    ready(function () {
      var video = document.getElementById("movie-player");
      var overlay = document.getElementById("player-overlay");
      if (!video || !overlay || !streamUrl) {
        return;
      }
      var started = false;
      var hlsInstance = null;

      function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
          promise.catch(function () {});
        }
      }

      function load() {
        if (started) {
          playVideo();
          return;
        }
        started = true;
        overlay.classList.add("hidden");
        video.controls = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          video.addEventListener("loadedmetadata", playVideo, { once: true });
          video.load();
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
          return;
        }

        video.src = streamUrl;
        video.addEventListener("loadedmetadata", playVideo, { once: true });
        video.load();
      }

      overlay.addEventListener("click", load);
      video.addEventListener("click", function () {
        if (!started) {
          load();
        }
      });
      window.addEventListener("pagehide", function () {
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
      });
    });
  }

  ready(function () {
    initMobileNav();
    initHero();
    initFilters();
  });

  window.MovieSite = {
    initPlayer: initPlayer
  };
})();
