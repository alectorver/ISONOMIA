// Fixed nav overlaps the hero/page-header — measure its real height (varies by
// breakpoint/content) and expose it as --nav-h so the first section can pad
// its content below the nav while its background still extends behind it.
function setNavHeightVar() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px');
}
document.addEventListener('DOMContentLoaded', setNavHeightVar);
window.addEventListener('resize', setNavHeightVar);
window.addEventListener('load', setNavHeightVar);

// Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', function() {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Close menu when clicking a link (but not the dropdown toggle itself,
  // which has its own open/close behaviour below)
  const links = navLinks.querySelectorAll('a:not(.dropdown-toggle)');
  links.forEach(link => {
    link.addEventListener('click', function() {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    });
  });

  // Close menu when clicking outside the nav
  document.addEventListener('click', function(event) {
    if (!event.target.closest('#site-nav') && navLinks.classList.contains('is-open')) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
      navLinks.classList.remove('is-open');
    }
  });

  // Nav dropdowns ("Αντικείμενο", "Εξειδίκευση") — on touch/mobile widths
  // (no hover) the parent link toggles its submenu instead of navigating
  // away immediately. Each dropdown is handled independently.
  const dropdowns = document.querySelectorAll('#site-nav .has-dropdown');
  dropdowns.forEach(dropdown => {
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
    if (!dropdownToggle) return;
    dropdownToggle.addEventListener('click', function(event) {
      if (window.matchMedia('(max-width: 1024px)').matches) {
        event.preventDefault();
        dropdown.classList.toggle('is-open');
      }
    });
    document.addEventListener('click', function(event) {
      if (!dropdown.contains(event.target) && dropdown.classList.contains('is-open')) {
        dropdown.classList.remove('is-open');
      }
    });
  });
});

// Stretch the "Νομικές Υπηρεσίες" tagline (via letter-spacing) to match
// the exact rendered width of "ΙΣΟΝΟΜΙΑ" above it in the header logo.
function justifyLogoTagline() {
  const strong = document.querySelector('.logo-text strong');
  const small = document.querySelector('.logo-text small');
  if (!strong || !small) return;

  small.style.letterSpacing = '0px';
  const targetWidth = strong.getBoundingClientRect().width;
  const naturalWidth = small.getBoundingClientRect().width;
  const gaps = small.textContent.length;
  if (gaps <= 0) return;

  const extraPerChar = (targetWidth - naturalWidth) / gaps;
  small.style.letterSpacing = (extraPerChar > 0 ? extraPerChar : 0) + 'px';
}
document.addEventListener('DOMContentLoaded', justifyLogoTagline);
window.addEventListener('resize', justifyLogoTagline);

// Back to top button
document.addEventListener('DOMContentLoaded', function() {
  const backToTop = document.getElementById('back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function() {
      backToTop.classList.toggle('visible', window.scrollY > 300);
    });

    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
