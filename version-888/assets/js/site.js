(function() {
  var header = document.querySelector("[data-site-header]");
  var toggle = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  var backTop = document.querySelector("[data-back-top]");

  if (toggle && mobileNav) {
    toggle.addEventListener("click", function() {
      mobileNav.classList.toggle("is-open");
      document.body.classList.toggle("menu-open", mobileNav.classList.contains("is-open"));
    });
  }

  window.addEventListener("scroll", function() {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
    if (backTop) {
      backTop.classList.toggle("is-visible", window.scrollY > 360);
    }
  }, { passive: true });

  if (backTop) {
    backTop.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function() {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener("click", function() {
        showSlide(index - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener("click", function() {
        showSlide(index + 1);
        startTimer();
      });
    }

    hero.addEventListener("mouseenter", stopTimer);
    hero.addEventListener("mouseleave", startTimer);
    startTimer();
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
  inputs.forEach(function(input) {
    var list = document.querySelector("[data-search-list]") || document;
    var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));
    input.addEventListener("input", function() {
      var keyword = input.value.trim().toLowerCase();
      cards.forEach(function(card) {
        var haystack = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-filtered-out", keyword && haystack.indexOf(keyword) === -1);
      });
    });
  });
})();
