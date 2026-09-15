// Vanilla JS lightbox για galleries — χωρίς εξωτερική βιβλιοθήκη.
// Χρήση: <div class="gallery"><a href="big.jpg" data-lightbox data-alt="...">...</a></div>
(function () {
  var items = document.querySelectorAll('.gallery [data-lightbox]');
  if (!items.length) return;

  var order = Array.prototype.slice.call(items);
  var current = -1;

  var overlay = document.createElement('div');
  overlay.className = 'lightbox';
  overlay.innerHTML =
    '<button type="button" class="lightbox__close" aria-label="Κλείσιμο">×</button>' +
    '<button type="button" class="lightbox__prev" aria-label="Προηγούμενη">‹</button>' +
    '<img class="lightbox__img" alt="">' +
    '<button type="button" class="lightbox__next" aria-label="Επόμενη">›</button>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('.lightbox__img');

  function show(i) {
    current = (i + order.length) % order.length;
    var el = order[current];
    img.src = el.getAttribute('href');
    img.alt = el.getAttribute('data-alt') || '';
    overlay.classList.add('is-open');
  }

  order.forEach(function (el, i) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
    });
  });

  overlay.querySelector('.lightbox__close').addEventListener('click', function () {
    overlay.classList.remove('is-open');
  });
  overlay.querySelector('.lightbox__prev').addEventListener('click', function () { show(current - 1); });
  overlay.querySelector('.lightbox__next').addEventListener('click', function () { show(current + 1); });

  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape') overlay.classList.remove('is-open');
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) overlay.classList.remove('is-open');
  });
})();
