document.addEventListener("DOMContentLoaded", function () {
  var menuToggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  document.querySelectorAll("[data-hero]").forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        show(current + 1);
      }, 5200);
    }
  });

  document.querySelectorAll("[data-filter-zone]").forEach(function (zone) {
    var input = zone.querySelector("[data-filter-input]");
    var selects = Array.prototype.slice.call(zone.querySelectorAll("[data-filter-select]"));
    var reset = zone.querySelector("[data-filter-reset]");
    var cards = Array.prototype.slice.call(zone.querySelectorAll(".movie-card, .ranking-card"));
    var noResults = zone.querySelector(".no-results");

    function valueOf(selector) {
      var field = zone.querySelector('[data-filter-select="' + selector + '"]');
      return field ? field.value.trim() : "";
    }

    function applyFilter() {
      var query = input ? input.value.trim().toLowerCase() : "";
      var type = valueOf("type");
      var region = valueOf("region");
      var year = valueOf("year");
      var visible = 0;

      cards.forEach(function (card) {
        var search = (card.getAttribute("data-search") || "").toLowerCase();
        var cardType = card.getAttribute("data-type") || "";
        var cardRegion = card.getAttribute("data-region") || "";
        var cardYear = card.getAttribute("data-year") || "";
        var ok = true;

        if (query && search.indexOf(query) === -1) {
          ok = false;
        }
        if (type && cardType.indexOf(type) === -1) {
          ok = false;
        }
        if (region && cardRegion.indexOf(region) === -1) {
          ok = false;
        }
        if (year && cardYear.indexOf(year) === -1) {
          ok = false;
        }

        card.classList.toggle("is-hidden", !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (noResults) {
        noResults.hidden = visible !== 0;
      }
    }

    if (input) {
      input.addEventListener("input", applyFilter);
    }

    selects.forEach(function (select) {
      select.addEventListener("change", applyFilter);
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        selects.forEach(function (select) {
          select.value = "";
        });
        applyFilter();
      });
    }
  });

  document.querySelectorAll(".video-player").forEach(function (player) {
    var video = player.querySelector("video");
    var cover = player.querySelector(".player-cover");
    var streamUrl = player.getAttribute("data-stream");
    var started = false;
    var hlsInstance = null;

    function playVideo() {
      if (!video || !streamUrl) {
        return;
      }

      if (!started) {
        started = true;
        player.classList.add("is-playing");

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = streamUrl;
          video.load();
          video.play().catch(function () {});
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = streamUrl;
          video.load();
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener("click", playVideo);
    }

    if (video) {
      video.addEventListener("click", function () {
        if (!started) {
          playVideo();
        }
      });
      video.addEventListener("play", function () {
        player.classList.add("is-playing");
      });
    }

    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
});
