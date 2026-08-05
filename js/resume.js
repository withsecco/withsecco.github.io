document.addEventListener('DOMContentLoaded', function () {
  var menuButton = document.querySelector('.menu-toggle');
  var menu = document.querySelector('.navbar-collapse');
  var links = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('main section[id]');

  if (menuButton && menu) {
    menuButton.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu) menu.classList.remove('open');
      if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    });
  });

  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(function (element) {
    revealObserver.observe(element);
  });

  var sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      links.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });

  sections.forEach(function (section) {
    sectionObserver.observe(section);
  });

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fillHeading(heading) {
    heading.querySelectorAll('.type-segment').forEach(function (segment) {
      segment.textContent = segment.getAttribute('data-text') || '';
    });
  }

  function typeHeading(heading, speed) {
    var segments = Array.from(heading.querySelectorAll('.type-segment'));
    var segmentIndex = 0;

    function typeNextSegment() {
      var segment = segments[segmentIndex];
      if (!segment) return;
      var characters = Array.from(segment.getAttribute('data-text') || '');
      var characterIndex = 0;
      segment.classList.add('is-typing');

      var timer = window.setInterval(function () {
        segment.textContent += characters[characterIndex];
        characterIndex += 1;
        if (characterIndex === characters.length) {
          window.clearInterval(timer);
          segment.classList.remove('is-typing');
          segment.classList.add('is-done');
          segmentIndex += 1;
          window.setTimeout(typeNextSegment, 180);
        }
      }, speed);
    }

    typeNextSegment();
  }

  var heroHeading = document.querySelector('.hero-typing');
  var typingHeading = document.querySelector('.typing-heading');

  if (reducedMotion) {
    if (heroHeading) fillHeading(heroHeading);
    if (typingHeading) fillHeading(typingHeading);
  } else {
    if (heroHeading) window.setTimeout(function () { typeHeading(heroHeading, 72); }, 250);
    if (typingHeading) {
      var typingObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          typingObserver.unobserve(entry.target);
          typeHeading(typingHeading, 85);
        });
      }, { threshold: 0.5 });
      typingObserver.observe(typingHeading);
    }
  }
});
