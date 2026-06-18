document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".mobile-menu-button").forEach(function (button) {
    button.addEventListener("click", function () {
      var header = button.closest(".site-header");
      var nav = header ? header.querySelector(".mobile-nav") : null;
      if (!nav) {
        return;
      }
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  document.querySelectorAll(".hero-slider").forEach(function (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    if (!slides.length) {
      return;
    }
    var current = slides.findIndex(function (slide) {
      return slide.classList.contains("is-active");
    });
    if (current < 0) {
      current = 0;
    }
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle("is-active", idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle("is-active", idx === current);
      });
    }
    dots.forEach(function (dot, idx) {
      dot.addEventListener("click", function () {
        show(idx);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  });

  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-search-input]");
    var selects = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-select]"));
    var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .wide-card"));
    var empty = scope.querySelector("[data-empty-state]");
    if (!input && selects.length === 0) {
      return;
    }
    function norm(value) {
      return String(value || "").toLowerCase().trim();
    }
    function cardText(card) {
      return norm([
        card.dataset.title,
        card.dataset.tags,
        card.dataset.year,
        card.dataset.region,
        card.dataset.type,
        card.dataset.category,
        card.textContent
      ].join(" "));
    }
    function apply() {
      var keyword = input ? norm(input.value) : "";
      var visible = 0;
      cards.forEach(function (card) {
        var ok = true;
        if (keyword && cardText(card).indexOf(keyword) === -1) {
          ok = false;
        }
        selects.forEach(function (select) {
          if (select.value && card.dataset[select.name] !== select.value) {
            ok = false;
          }
        });
        card.hidden = !ok;
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }
    if (input) {
      input.addEventListener("input", apply);
    }
    selects.forEach(function (select) {
      select.addEventListener("change", apply);
    });
  });
});
