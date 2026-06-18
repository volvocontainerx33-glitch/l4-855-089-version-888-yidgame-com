(function () {
  var header = document.querySelector('[data-site-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 32) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var active = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === active);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(active - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(active + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var searchInput = document.querySelector('[data-page-search]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var activeFilter = '';

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  }

  function applyFilter() {
    var query = normalize(searchInput ? searchInput.value : '');
    var filter = normalize(activeFilter);

    cards.forEach(function (card) {
      var haystack = normalize(
        (card.getAttribute('data-title') || '') + ' ' +
        (card.getAttribute('data-tags') || '') + ' ' +
        card.textContent
      );
      var visible = (!query || haystack.indexOf(query) !== -1) && (!filter || haystack.indexOf(filter) !== -1);
      card.classList.toggle('is-hidden', !visible);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilter);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (item) {
        item.classList.remove('is-active');
      });
      chip.classList.add('is-active');
      activeFilter = chip.getAttribute('data-filter') || '';
      applyFilter();
    });
  });
})();
