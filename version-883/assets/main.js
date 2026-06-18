(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var mobile = document.querySelector(".mobile-nav");
    if (!toggle || !mobile) {
      return;
    }
    toggle.addEventListener("click", function () {
      mobile.classList.toggle("open");
    });
  }

  function initFocus() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".focus-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".focus-dot"));
    if (slides.length < 2 || dots.length !== slides.length) {
      return;
    }
    var current = 0;
    var timer = null;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === current);
      });
    }
    function start() {
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        if (timer) {
          window.clearInterval(timer);
        }
        show(i);
        start();
      });
    });
    start();
  }

  function uniqueValues(cards, name) {
    var values = [];
    cards.forEach(function (card) {
      var value = card.getAttribute(name) || "";
      if (value && values.indexOf(value) === -1) {
        values.push(value);
      }
    });
    return values.sort(function (a, b) {
      return String(b).localeCompare(String(a), "zh-CN", { numeric: true });
    });
  }

  function fillSelect(select, values) {
    if (!select) {
      return;
    }
    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function initFilters() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var input = document.querySelector(".js-filter-input");
    var region = document.querySelector(".js-filter-region");
    var year = document.querySelector(".js-filter-year");
    var type = document.querySelector(".js-filter-type");
    if (!cards.length || (!input && !region && !year && !type)) {
      return;
    }
    fillSelect(region, uniqueValues(cards, "data-region"));
    fillSelect(year, uniqueValues(cards, "data-year"));
    fillSelect(type, uniqueValues(cards, "data-type"));
    function apply() {
      var keyword = input ? input.value.trim().toLowerCase() : "";
      var regionValue = region ? region.value : "";
      var yearValue = year ? year.value : "";
      var typeValue = type ? type.value : "";
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-title") || "").toLowerCase();
        var matched = true;
        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (regionValue && card.getAttribute("data-region") !== regionValue) {
          matched = false;
        }
        if (yearValue && card.getAttribute("data-year") !== yearValue) {
          matched = false;
        }
        if (typeValue && card.getAttribute("data-type") !== typeValue) {
          matched = false;
        }
        card.classList.toggle("is-filtered-out", !matched);
      });
    }
    [input, region, year, type].forEach(function (node) {
      if (node) {
        node.addEventListener("input", apply);
        node.addEventListener("change", apply);
      }
    });
  }

  ready(function () {
    initMenu();
    initFocus();
    initFilters();
  });
})();

function setupPlayer(videoId, buttonId, src) {
  var video = document.getElementById(videoId);
  var button = document.getElementById(buttonId);
  if (!video || !button || !src) {
    return;
  }
  var loaded = false;
  var hls = null;
  function play() {
    if (!loaded) {
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
    }
    button.classList.add("is-hidden");
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        button.classList.remove("is-hidden");
      });
    }
  }
  button.addEventListener("click", play);
  video.addEventListener("click", function () {
    if (video.paused) {
      play();
    }
  });
  video.addEventListener("play", function () {
    button.classList.add("is-hidden");
  });
  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
    }
  });
}
