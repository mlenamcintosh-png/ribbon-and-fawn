const finds = [
  {
    id: 'cream-leg-warmers',
    name: 'Cream Leg Warmers',
    category: 'Accessories',
    photos: [
      { src: 'accessory-photos/224219.webp', alt: 'Cream leg warmers styled with lace tights and bow shoes' },
      { src: 'accessory-photos/224221.webp', alt: 'Cream leg warmers in a pink and cream outfit' }
    ]
  },
  {
    id: 'pink-bow-platform-heels',
    name: 'Pink Bow Platform Heels',
    category: 'Shoes',
    photos: [
      { src: 'shoe-photos/224155.webp', alt: 'Pink platform heels with bows and lace-trimmed straps' },
      { src: 'shoe-photos/224157.webp', alt: 'Front view of the pink platforms with crossed straps' },
      { src: 'shoe-photos/224159.webp', alt: 'Close-up of the heart buckles and block heels' }
    ]
  },
  {
    id: 'pink-ballet-flats',
    name: 'Pink ballet flats',
    category: 'Shoes',
    photos: [
      { src: 'shoe-photos/224145.webp', alt: 'Pink bow flats and lace socks beside a mirror' },
      { src: 'shoe-photos/224147.webp', alt: 'Front view of the pink flats with bows and straps' },
      { src: 'shoe-photos/224143.webp', alt: 'Side view of the pink flats on floral fabric' }
    ]
  },
  {
    id: 'pink-bow-mary-janes',
    name: 'Pink Bow Mary Janes',
    category: 'Shoes',
    photos: [
      { src: 'shoe-photos/224151.webp', alt: 'Pink Mary Janes with toe bows and lace socks' },
      { src: 'shoe-photos/224153.webp', alt: 'Another view of the pink bow Mary Janes and block heels' }
    ]
  },
  { id: 'bow', name: 'Satin bow clip', category: 'Accessories', symbol: 'ෆ', color: '#f3ccd9' },
  { id: 'tray', name: 'Heart trinket tray', category: 'Room', symbol: '♡', color: '#f4dfd5' },
  { id: 'pouch', name: 'Gingham pouch', category: 'Accessories', symbol: '❀', color: '#e9d8ef' }
];
const orderSettings = {
  email: '',
  pricesInCents: {},
  shippingInCents: null
};
const money = cents => `BBD ${(cents / 100).toFixed(2)}`;
const bagKey = 'ribbon-fawn-shopping-bag';
const suggestionKey = 'ribbon-fawn-suggestion';
function readLocal(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function writeLocal(key, value) {
  try { localStorage.setItem(key, value); } catch {
    // Browser storage may be unavailable in some sessions.
  }
}
const bag = new Map();
try {
  const stored = JSON.parse(readLocal(bagKey));
  if (stored && typeof stored === 'object') {
    finds.filter(item => item.photos).forEach(item => {
      const quantity = stored[item.id];
      if (Number.isInteger(quantity) && quantity > 0 && quantity <= 99) bag.set(item.id, quantity);
    });
  }
} catch {
  // A corrupt saved bag starts empty.
}

const pages = [...document.querySelectorAll('[data-page]')];
const navLinks = [...document.querySelectorAll('nav a')];
const filters = [...document.querySelectorAll('[data-filter]')];
const cards = id => document.getElementById(id);
const storageKey = 'ribbon-fawn-wishlist';
let saved = new Set();
try {
  const stored = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(stored)) saved = new Set(finds.filter(find => stored.includes(find.id)).map(find => find.id));
} catch {
  // The wishlist remains usable for the current visit if storage is unavailable.
}
let activeFilter = 'All';

function renderGallery(item) {
  const photo = item.photos[0];
  return `<div class="find-gallery">
    <img src="${photo.src}" alt="${photo.alt}" width="650" height="650" loading="lazy">
    <div class="photo-controls" data-gallery="${item.id}" data-photo="0">
      <button type="button" class="photo-switch" data-step="-1" aria-label="Previous photo of ${item.name}">‹</button>
      <span aria-live="polite">1 of ${item.photos.length}</span>
      <button type="button" class="photo-switch" data-step="1" aria-label="Next photo of ${item.name}">›</button>
    </div>
  </div>`;
}

function renderCards(container, items) {
  container.innerHTML = items.map(item => {
    const isSaved = saved.has(item.id);
    return `<article class="card">
      ${item.photos ? renderGallery(item) : `<div class="swatch" style="--swatch:${item.color}" aria-hidden="true">${item.symbol}</div>`}
      <h3>${item.name}</h3>
      <p>${item.category}</p>
      ${item.photos ? `<button class="bag-add" type="button" data-bag-add="${item.id}">Add to bag</button>` : ''}
      <button class="heart" type="button" data-save="${item.id}" aria-label="Save ${item.name} to wishlist" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button>
    </article>`;
  }).join('');
}

function refresh() {
  cards('count').textContent = saved.size;
  cards('empty').hidden = saved.size > 0;
  renderCards(cards('featured'), finds);
  renderCards(cards('catalog'), finds.filter(item => activeFilter === 'All' || item.category === activeFilter));
  renderCards(cards('saved'), finds.filter(item => saved.has(item.id)));
}

function showPage(moveFocus = false) {
  const requested = location.hash.slice(1);
  const page = pages.find(item => item.id === requested) ?? pages[0];
  pages.forEach(item => { item.hidden = item !== page; });
  navLinks.forEach(link => {
    if (link.hash === '#' + page.id) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (moveFocus) cards('content').focus();
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.step) {
    const controls = button.parentElement;
    const item = finds.find(find => find.id === controls.dataset.gallery);
    const index = (Number(controls.dataset.photo) + Number(button.dataset.step) + item.photos.length) % item.photos.length;
    const photo = item.photos[index];
    const image = controls.previousElementSibling;
    image.src = photo.src;
    image.alt = photo.alt;
    controls.dataset.photo = index;
    controls.querySelector('span').textContent = `${index + 1} of ${item.photos.length}`;
  }
  if (button.dataset.bagAdd) {
    const id = button.dataset.bagAdd;
    setQuantity(id, (bag.get(id) ?? 0) + 1);
  }
  if (button.dataset.remove) {
    setQuantity(button.dataset.remove, 0);
    cards('bag').querySelector('h1').focus();
  }
  if (button.dataset.help) {
    const answers = {
      shoes: 'Open <a href="#finds">Shopping finds</a> and choose Shoes. Use the little arrows to see each angle.',
      save: 'Tap a heart to save a find, or add shoes to your bag. Both are saved in this browser for your next visit.',
      pay: 'Open <a href="#bag">My bag</a> to review your items and delivery costs. Your order must be paid before you receive it.'
    };
    cards('fawn-answer').innerHTML = answers[button.dataset.help];
  }
  if (button.dataset.filter) {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderCards(cards('catalog'), finds.filter(item => activeFilter === 'All' || item.category === activeFilter));
  }
  if (button.dataset.save) {
    const id = button.dataset.save;
    const container = button.closest('.cards');
    const index = [...container.querySelectorAll('.heart')].indexOf(button);
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch {
      // The current wishlist continues to work without browser storage.
    }
    refresh();
    const hearts = container.querySelectorAll('.heart');
    (hearts[Math.min(index, hearts.length - 1)] ?? cards('empty').querySelector('a')).focus();
  }
});
window.addEventListener('hashchange', () => showPage(true));
function bagSummary() {
  const lines = finds.filter(item => bag.has(item.id)).map(item => ({
    item, quantity: bag.get(item.id), price: orderSettings.pricesInCents[item.id]
  }));
  const priced = lines.every(line => Number.isInteger(line.price));
  const subtotal = priced ? lines.reduce((sum, line) => sum + line.price * line.quantity, 0) : null;
  const shipping = orderSettings.shippingInCents;
  return { lines, subtotal, shipping, total: subtotal !== null && shipping !== null ? subtotal + shipping : null };
}

function renderBag() {
  const { lines, subtotal, shipping, total } = bagSummary();
  cards('bag-count').textContent = lines.reduce((count, line) => count + line.quantity, 0);
  cards('bag-empty').hidden = lines.length > 0;
  cards('bag-checkout').hidden = lines.length === 0;
  cards('bag-lines').innerHTML = lines.map(({ item, quantity, price }) => `
    <div class="bag-line">
      <strong>${item.name}</strong>
      <label>Qty <input type="number" min="1" max="99" data-quantity="${item.id}" value="${quantity}"></label>
      <span>${Number.isInteger(price) ? `${money(price)} × ${quantity} = ${money(price * quantity)}` : 'Price pending'}</span>
      <button type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button>
    </div>`).join('');
  cards('bag-total').innerHTML = `
    <dt>Items subtotal</dt><dd>${subtotal === null ? 'Pending prices' : money(subtotal)}</dd>
    <dt>Shipping or delivery</dt><dd>${shipping === null ? 'Pending confirmation' : money(shipping)}</dd>
    <dt>Total due</dt><dd>${total === null ? 'Pending confirmation' : money(total)}</dd>`;
  const available = total !== null && Boolean(orderSettings.email);
  cards('order-email').disabled = !available;
  cards('order-status').textContent = available ? 'Review and send the order from your email app.' :
    'Ordering opens once prices, delivery costs, and the order email are confirmed.';
}

function setQuantity(id, quantity) {
  if (quantity) bag.set(id, Math.min(quantity, 99));
  else bag.delete(id);
  writeLocal(bagKey, JSON.stringify(Object.fromEntries(bag)));
  renderBag();
}

cards('bag').querySelector('h1').tabIndex = -1;
cards('bag-lines').addEventListener('change', event => {
  const input = event.target;
  if (!input.dataset.quantity) return;
  const id = input.dataset.quantity;
  setQuantity(id, input.validity.valid && input.value ? Number(input.value) : bag.get(id));
  cards('bag-lines').querySelector(`[data-quantity="${id}"]`)?.focus();
});

function openEmail(subject, body) {
  location.href = `mailto:${orderSettings.email}?${new URLSearchParams({ subject, body }).toString().replaceAll('+', '%20')}`;
}

cards('order-email').addEventListener('click', () => {
  const { lines, subtotal, shipping, total } = bagSummary();
  if (!lines.length || total === null || !orderSettings.email) return;
  const items = lines.map(({ item, quantity, price }) => `${item.name} × ${quantity}: ${money(price * quantity)}`);
  openEmail('Ribbon & Fawn order', [...items, '', `Items subtotal: ${money(subtotal)}`,
    `Shipping or delivery: ${money(shipping)}`, `Total due: ${money(total)}`, '',
    'Shoe sizes:', 'Preferred delivery or pickup:', '',
    'I understand that full payment, including any shipping, is due before I receive my order.'].join('\n'));
});

cards('suggestion').value = readLocal(suggestionKey) ?? '';
cards('suggestion').addEventListener('input', event => writeLocal(suggestionKey, event.target.value));
cards('suggestion-form').addEventListener('submit', event => {
  event.preventDefault();
  const message = cards('suggestion').value.trim();
  if (!message) {
    cards('suggestion-status').textContent = 'Write a suggestion first.';
    return;
  }
  if (!orderSettings.email) {
    cards('suggestion-status').textContent = 'Your draft is saved in this browser. The suggestion inbox is being set up.';
    return;
  }
  openEmail('Ribbon & Fawn suggestion', message);
  cards('suggestion-status').textContent = 'Send your suggestion from your email app.';
});

renderBag();
refresh();
showPage();
