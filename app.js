const finds = [
  {
    id: 'pink-lace-knit-sweater',
    name: 'Pink Lace-Trim Knit Sweater',
    category: 'Tops',
    photos: [
      { src: 'top-photos/pink-knit-231941.webp', alt: 'Front view of the pink off-shoulder knit sweater with a lace collar and bow' },
      { src: 'top-photos/pink-knit-232329.webp', alt: 'Side view showing the sweater’s lace trim and ribbed sleeve' },
      { src: 'top-photos/pink-knit-product.webp', alt: 'Pink lace-trim knit sweater on a white background' }
    ]
  },
  {
    id: 'white-stockings',
    name: 'White Stockings',
    category: 'Accessories',
    photos: [
      { src: 'accessory-photos/224243-square.webp', alt: 'White stockings styled with a pink plaid skirt and white boots while seated' },
      { src: 'accessory-photos/224244-square.webp', alt: 'Standing outfit view with white stockings, a pink plaid skirt, and bow details' },
      { src: 'accessory-photos/224245-square.webp', alt: 'Plain white stockings on a white background' }
    ]
  },
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
].map(item => ({ aesthetic: 'Coquette', ...item }));
const orderSettings = {
  email: 'ribbonandfawn@gmail.com',
  pricesInCents: {
    'pink-lace-knit-sweater': 5000,
    'pink-bow-platform-heels': 6200,
    'pink-bow-mary-janes': 5500,
    'pink-ballet-flats': 5000,
    'white-stockings': 1200,
    'cream-leg-warmers': 1500
  },
  shippingInCents: 1200
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
const sizesByItem = {
  'pink-ballet-flats': ['US 6','US 6.5','US 7','US 7.5','US 8','US 9'],
  'pink-bow-mary-janes': ['US 5','US 6','US 6.5','US 7','US 8','US 9','US 9.5'],
  'pink-bow-platform-heels': ['US 5','US 6','US 6.5','US 7','US 8','US 9','US 9.5','US 10.5'],
  'pink-lace-knit-sweater': ['XS','S','M','L','XL'],
  'white-stockings': ['S','M','L','XL','2XL']
};
const variantKey = (id, size) => id + '|' + size;
const bag = new Map();
try {
  const stored = JSON.parse(readLocal(bagKey));
  if (stored && typeof stored === 'object') {
    Object.entries(stored).forEach(([key, quantity]) => {
      const [id, size = ''] = key.split('|');
      if (finds.some(item => item.id === id && item.photos) &&
          (!size || sizesByItem[id]?.includes(size)) &&
          Number.isInteger(quantity) && quantity > 0 && quantity <= 99) {
        bag.set(variantKey(id, size), quantity);
      }
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
const aestheticFilter = cards('aesthetic-filter');
function renderCatalog() {
  const aesthetic = aestheticFilter.value;
  const matches = finds.filter(item => (activeFilter === 'All' || item.category === activeFilter) &&
    (!aesthetic || item.aesthetic === aesthetic));
  renderCards(cards('catalog'), matches);
  const empty = cards('catalog-empty');
  empty.hidden = matches.length > 0;
  empty.textContent = aesthetic && !finds.some(item => item.aesthetic === aesthetic)
    ? 'No ' + aesthetic + ' pieces yet.' : 'No pieces match both filters.';
}

function filterByAesthetic(aesthetic) {
  aestheticFilter.value = aesthetic;
  activeFilter = 'All';
  filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.filter === 'All')));
  renderCatalog();
}
aestheticFilter.addEventListener('change', renderCatalog);

function renderGallery(item) {
  const photo = item.photos[0];
  return `<div class="find-gallery">
    <a class="product-photo-link" href="#item/${item.id}" aria-label="View ${item.name}"><img src="${photo.src}" alt="${photo.alt}" width="650" height="650" loading="lazy"></a>
    <div class="photo-controls" data-gallery="${item.id}" data-photo="0">
      <button type="button" class="photo-switch" data-step="-1" aria-label="Previous photo of ${item.name}">‹</button>
      <span aria-live="polite">1 of ${item.photos.length}</span>
      <button type="button" class="photo-switch" data-step="1" aria-label="Next photo of ${item.name}">›</button>
    </div>
  </div>`;
}

function sizeOptions(id, selected = '') {
  return '<option value="">Choose size</option>' + (sizesByItem[id] ?? []).map(size =>
    `<option${selected === size ? ' selected' : ''}>${size}</option>`).join('');
}

function renderCards(container, items) {
  container.innerHTML = items.map(item => {
    const isSaved = saved.has(item.id);
    return `<article class="card" data-find="${item.id}">
      ${item.photos ? renderGallery(item) : `<div class="swatch" style="--swatch:${item.color}" aria-hidden="true">${item.symbol}</div>`}
      <h3><a href="#item/${item.id}">${item.name}</a></h3>
      <p>${item.category}</p>
      ${Number.isInteger(orderSettings.pricesInCents[item.id]) ? `<p class="card-price">${money(orderSettings.pricesInCents[item.id])}</p>` : ''}
      ${item.photos ? `<a class="card-shop" href="#item/${item.id}">View item</a>` : ''}
      <button class="heart" type="button" data-save="${item.id}" aria-label="Save ${item.name} to wishlist" aria-pressed="${isSaved}">${isSaved ? '♥' : '♡'}</button>
    </article>`;
  }).join('');
}

function refresh() {
  cards('count').textContent = saved.size;
  cards('empty').hidden = saved.size > 0;
  renderCards(cards('featured'), finds);
  renderCatalog();
  renderCards(cards('saved'), finds.filter(item => saved.has(item.id)));
}

function renderProduct(item) {
  const photo = item.photos?.[0];
  const price = orderSettings.pricesInCents[item.id];
  const sizes = sizesByItem[item.id];
  const inWishlist = saved.has(item.id);
  const gallery = photo ? `
    <div class="detail-gallery">
      <img id="detail-photo" src="${photo.src}" alt="${photo.alt}" width="650" height="650">
      <div class="detail-thumbnails" aria-label="Product photos">
        ${item.photos.map((image, index) => `<button type="button" data-detail-photo="${index}" aria-pressed="${index === 0}" aria-label="View photo ${index + 1}"><img src="${image.src}" alt="" width="60" height="60"></button>`).join('')}
      </div>
    </div>` : `<div class="swatch" style="--swatch:${item.color}" aria-hidden="true">${item.symbol}</div>`;
  cards('product-info').innerHTML = `<article class="product-detail" data-find="${item.id}">
    ${gallery}
    <div class="detail-copy">
      <p>${item.category} · ${item.aesthetic}</p>
      <h1>${item.name}</h1>
      <p>${Number.isInteger(price) ? money(price) : 'Price on request'}</p>
      ${sizes ? `<fieldset class="detail-sizes"><legend>Choose a size</legend>${sizes.map(size =>
        `<label><input type="radio" name="detail-size" value="${size}"><span>${size}</span></label>`).join('')}</fieldset>` :
        item.id === 'cream-leg-warmers' ? '<p>One size</p>' : ''}
      <div class="detail-actions">
        ${item.photos ? `<button class="ribbon-button" type="button" data-bag-add="${item.id}">Add to bag</button>` : ''}
        <button type="button" class="ribbon-button detail-heart" data-save="${item.id}" aria-pressed="${inWishlist}">${inWishlist ? '♥ Saved to wishlist' : '♡ Save to wishlist'}</button>
      </div>
      <p id="detail-status" role="status"></p>
    </div>
  </article>`;
  const matches = finds.filter(other => other.id !== item.id && other.photos && other.aesthetic === item.aesthetic);
  const pairings = matches.filter(other => other.category !== item.category);
  const similar = matches.filter(other => other.category === item.category);
  renderCards(cards('related-finds'), [...pairings, ...similar].slice(0, 3));
}

function showPage(moveFocus = false) {
  const requested = location.hash === '#aesthetics' ? 'finds' : location.hash.slice(1);
  const product = requested.startsWith('item/') ? finds.find(item => item.id === requested.slice(5)) : null;
  const page = product ? cards('product') : pages.find(item => item.id === requested) ?? pages[0];
  if (product) renderProduct(product);
  pages.forEach(item => { item.hidden = item !== page; });
  navLinks.forEach(link => {
    if (link.hash === '#' + (product ? 'finds' : page.id)) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (moveFocus) {
    cards('content').focus();
    if (product) cards('product').scrollIntoView({ block: 'start' });
  }
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-detail-photo')) {
    const item = finds.find(find => find.id === button.closest('[data-find]').dataset.find);
    const photo = item.photos[Number(button.dataset.detailPhoto)];
    cards('detail-photo').src = photo.src;
    cards('detail-photo').alt = photo.alt;
    button.parentElement.querySelectorAll('button').forEach(thumbnail =>
      thumbnail.setAttribute('aria-pressed', String(thumbnail === button)));
  }
  if (button.dataset.step) {
    const controls = button.parentElement;
    const item = finds.find(find => find.id === controls.dataset.gallery);
    const index = (Number(controls.dataset.photo) + Number(button.dataset.step) + item.photos.length) % item.photos.length;
    const photo = item.photos[index];
    const image = controls.previousElementSibling.querySelector('img');
    image.src = photo.src;
    image.alt = photo.alt;
    controls.dataset.photo = index;
    controls.querySelector('span').textContent = `${index + 1} of ${item.photos.length}`;
  }
  if (button.dataset.bagAdd) {
    const id = button.dataset.bagAdd;
    const itemView = button.closest('[data-find]');
    const detail = itemView.classList.contains('product-detail');
    const selected = itemView.querySelector('[name="detail-size"]:checked')?.value;
    if (detail && sizesByItem[id] && !selected) {
      cards('detail-status').textContent = 'Choose a size first.';
      itemView.querySelector('[name="detail-size"]').focus();
      return;
    }
    const key = variantKey(id, selected ?? '');
    const quantity = bag.get(key) ?? 0;
    setQuantity(key, quantity + 1);
    if (detail) cards('detail-status').textContent = quantity >= 99 ? 'This size already has 99 in your bag.' : 'Added to your bag.';
  }
  if (button.dataset.remove) {
    setQuantity(button.dataset.remove, 0);
    cards('bag').querySelector('h1').focus();
  }
  if (button.dataset.help) {
    const answers = {
      shoes: 'Open <a href="#finds">Shopping finds</a> and choose Shoes. Use the little arrows to see each angle.',
      save: 'Tap a heart to save a find to your <a href="#wishlist">Wishlist</a>. Your wishlist and bag stay saved in this browser.',
      pay: 'Open the item, choose a size if needed, and add it to <a href="#bag">My bag</a>. Choose pickup, meetup, or delivery and email your request. Pay in full before receiving your items.'
    };
    cards('fawn-answer').innerHTML = answers[button.dataset.help];
  }
  if (button.dataset.filter) {
    activeFilter = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    renderCatalog();
  }
  if (button.dataset.save) {
    const id = button.dataset.save;
    const container = button.closest('.cards');
    const index = container ? [...container.querySelectorAll('.heart')].indexOf(button) : -1;
    if (saved.has(id)) saved.delete(id);
    else saved.add(id);
    try {
      localStorage.setItem(storageKey, JSON.stringify([...saved]));
    } catch {
      // The current wishlist continues to work without browser storage.
    }
    refresh();
    if (!container) {
      button.setAttribute('aria-pressed', String(saved.has(id)));
      button.textContent = saved.has(id) ? '♥ Saved to wishlist' : '♡ Save to wishlist';
      return;
    }
    if (container.id === 'related-finds') {
      button.setAttribute('aria-pressed', String(saved.has(id)));
      button.textContent = saved.has(id) ? '♥' : '♡';
      return;
    }
    const hearts = container.querySelectorAll('.heart');
    (hearts[Math.min(index, hearts.length - 1)] ?? cards('empty').querySelector('a')).focus();
  }
});
window.addEventListener('hashchange', () => showPage(true));
const fulfillment = cards('fulfillment');
const fulfillmentKey = 'ribbon-fawn-fulfillment';
const referenceKey = 'ribbon-fawn-order-reference';
const receipt = cards('order-receipt');
const previousFulfillment = readLocal(fulfillmentKey);
if ([...fulfillment.options].some(option => option.value === previousFulfillment)) fulfillment.value = previousFulfillment;

function bagSummary() {
  const lines = [...bag].map(([key, quantity]) => {
    const [id, size] = key.split('|');
    return { key, item: finds.find(item => item.id === id), quantity, size, price: orderSettings.pricesInCents[id] };
  });
  const subtotal = lines.every(line => Number.isInteger(line.price))
    ? lines.reduce((sum, line) => sum + line.price * line.quantity, 0) : null;
  const shipping = fulfillment.value === 'Delivery' ? orderSettings.shippingInCents : 0;
  const total = subtotal === null ? null : subtotal + shipping;
  return { lines, subtotal, shipping, total, method: fulfillment.value };
}

function totals(summary) {
  return [
    ['Items subtotal', summary.subtotal === null ? 'Pending prices' : money(summary.subtotal)],
    ['Receiving method', summary.method],
    ['Receiving fee', summary.shipping === 0 ? 'Free' : money(summary.shipping)],
    ['Total due', summary.total === null ? 'Pending confirmation' : money(summary.total)]
  ];
}

function renderTotals(target, summary) {
  target.innerHTML = totals(summary).map(([label, value]) => `<dt>${label}</dt><dd>${value}</dd>`).join('');
}

function renderBag() {
  const summary = bagSummary();
  const { lines } = summary;
  cards('bag-count').textContent = lines.reduce((count, line) => count + line.quantity, 0);
  cards('bag-empty').hidden = lines.length > 0;
  cards('bag-checkout').hidden = lines.length === 0;
  cards('bag-lines').innerHTML = lines.map(({ key, item, quantity, price, size }) => `
    <div class="bag-line">
      <strong>${item.name}</strong>
      ${sizesByItem[item.id] ? `<label>Size <select data-variant="${key}">${sizeOptions(item.id, size)}</select></label>` : ''}
      <label>Qty <input type="number" min="1" max="99" data-quantity="${key}" value="${quantity}"></label>
      <span>${Number.isInteger(price) ? `${money(price)} × ${quantity} = ${money(price * quantity)}` : 'Price pending'}</span>
      <button type="button" data-remove="${key}" aria-label="Remove ${item.name}${size ? ' ' + size : ''}">Remove</button>
    </div>`).join('');
  renderTotals(cards('bag-total'), summary);
  const missing = lines.some(line => sizesByItem[line.item.id] && !line.size);
  cards('order-email').disabled = missing || !lines.length;
  cards('receipt-open').disabled = missing || !lines.length;
  cards('order-email').textContent = summary.total === null ? 'Email for an order quote' : 'Prepare order email';
  cards('order-status').textContent = missing ? 'Choose a size for each sized item.' :
    summary.total === null ? 'Any unlisted item prices will be confirmed by email.' :
    'Review and send your order in Gmail.';
}

function setQuantity(key, quantity) {
  if (quantity) bag.set(key, Math.min(quantity, 99));
  else bag.delete(key);
  saveBag();
}

function saveBag() {
  writeLocal(bagKey, JSON.stringify(Object.fromEntries(bag)));
  renderBag();
}

cards('bag').querySelector('h1').tabIndex = -1;
fulfillment.addEventListener('change', () => {
  writeLocal(fulfillmentKey, fulfillment.value);
  renderBag();
});
cards('bag-lines').addEventListener('change', event => {
  const input = event.target;
  if (input.dataset.quantity) {
    const key = input.dataset.quantity;
    setQuantity(key, input.validity.valid && input.value ? Number(input.value) : bag.get(key));
    cards('bag-lines').querySelector(`[data-quantity="${key}"]`)?.focus();
  }
  if (input.dataset.variant) {
    const previous = input.dataset.variant;
    const key = variantKey(previous.split('|')[0], input.value);
    if (key !== previous) {
      const quantity = bag.get(previous) + (bag.get(key) ?? 0);
      if (quantity > 99) {
        input.value = previous.split('|')[1];
        cards('order-status').textContent = 'This size already has too many items in the bag. Reduce its quantity first.';
        return;
      }
      bag.delete(previous);
      setQuantity(key, quantity);
      cards('bag-lines').querySelector(`[data-variant="${key}"]`)?.focus();
    }
  }
});

let latestReference;
function orderReference(summary) {
  const signature = JSON.stringify([summary.lines.map(line => [line.key, line.quantity]).sort(), totals(summary)]);
  try {
    latestReference ??= JSON.parse(readLocal(referenceKey));
  } catch {
    latestReference = undefined;
  }
  if (latestReference?.signature !== signature || !/^RF-[A-Z0-9]{6}$/.test(latestReference.reference)) {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const code = Array.from(crypto.getRandomValues(new Uint8Array(6)), n => alphabet[n % alphabet.length]).join('');
    latestReference = { signature, reference: 'RF-' + code };
    writeLocal(referenceKey, JSON.stringify(latestReference));
  }
  return latestReference.reference;
}

function orderLines(summary) {
  return summary.lines.map(({ item, size, quantity, price }) =>
    `${item.name}${size ? ' (' + size + ')' : ''} × ${quantity} · ${Number.isInteger(price) ? money(price * quantity) : 'Price pending'}`);
}

function openEmail(subject, body) {
  const query = new URLSearchParams({ view: 'cm', fs: '1', to: orderSettings.email, su: subject, body });
  window.open('https://mail.google.com/mail/?' + query, '_blank', 'noopener,noreferrer');
}

cards('receipt-open').addEventListener('click', () => {
  const summary = bagSummary();
  cards('receipt-ref').textContent = orderReference(summary);
  cards('receipt-lines').replaceChildren(...orderLines(summary).map(line => {
    const item = document.createElement('li');
    item.textContent = line;
    return item;
  }));
  renderTotals(cards('receipt-totals'), summary);
  receipt.showModal();
});
cards('receipt-print').addEventListener('click', () => window.print());

cards('order-email').addEventListener('click', () => {
  const summary = bagSummary();
  const reference = orderReference(summary);
  const purpose = summary.total === null ? 'quote request' : 'order request';
  openEmail('Ribbon & Fawn ' + purpose + ' · ' + reference,
    [reference, 'Payment pending', '', ...orderLines(summary), '',
    ...totals(summary).map(([label, value]) => label + ': ' + value), '',
    'I understand that full payment, including any applicable delivery fee, is due before I receive my order.'].join('\n'));
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
  cards('suggestion-status').textContent = 'Send your suggestion in Gmail.';
});

const fawnAliases = {
  'pink-ballet-flats': /\b(ballet|flats?|ballerinas?)\b/,
  'pink-bow-mary-janes': /\bmary\s*jane[s]?\b/,
  'pink-bow-platform-heels': /\b(platforms?|heels?)\b/,
  'pink-lace-knit-sweater': /\b(sweaters?|knits?|tops?|shirt)\b/,
  'white-stockings': /\b(stockings?|tights|leggings)\b/,
  'cream-leg-warmers': /\bleg\s*warmers?\b/
};

function answerFawn(question) {
  const words = question.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  const items = finds.filter(item => fawnAliases[item.id]?.test(words));
  const asksPrice = /\b(price|prices|cost|costs|much|total|bd[d]?|budget)\b/.test(words);
  const asksSize = /\b(size|sizes|sizing|fit)\b/.test(words);
  const productLinks = products => '<ul>' + products.map(item => {
    const price = orderSettings.pricesInCents[item.id];
    return `<li><a href="#item/${item.id}">${item.name}</a>${asksPrice ?
      ' · ' + (Number.isInteger(price) ? money(price) : 'Price on request') : ''}</li>`;
  }).join('') + '</ul>';

  if (items.length) return (asksSize ? 'Open the item to see its size choices.' :
    asksPrice ? 'Here’s what I found.' : 'Take a look at these pieces.') + productLinks(items);
  if (/\b(shipping|delivery|deliver|pickup|pick up|meetup|meet up)\b/.test(words)) {
    return 'Pickup and meetups at BCC, Sky Mall, or Warrens are free. Delivery is BBD $12 extra per order. Choose your option in <a href="#bag">My Bag</a>.';
  }
  if (/\b(pay|payment|order|checkout|buy|receipt|reference|bag|cart)\b/.test(words)) {
    return 'Add items from their product pages, then open <a href="#bag">My Bag</a> for your RF reference and email request. Full payment is due before you receive your items.';
  }
  if (/\b(contact|email|whatsapp|phone|help)\b/.test(words)) {
    return 'You can reach Ribbon &amp; Fawn by email or WhatsApp on the <a href="#contact">Contact page</a>.';
  }
  if (/\b(wishlist|save|favourites|favorites)\b/.test(words)) {
    return 'Tap the heart on any item. Your <a href="#wishlist">Wishlist</a> is saved in this browser.';
  }
  if (/\b(quiz|aesthetic|aesthetics)\b/.test(words)) return 'Try the <a href="#style-quiz">Style Quiz</a> to find your main aesthetic and runner-up.';
  if (/\b(outfit|mannequin|wardrobe|dressing|style)\b/.test(words)) return 'Try styling pieces in the <a href="#dressing-room">Dressing Room</a>.';
  if (/\b(shoes|sneakers|footwear)\b/.test(words)) return 'Here are the shoes in the shop.' + productLinks(finds.filter(item => item.category === 'Shoes'));
  if (asksPrice) return 'Try asking about a specific piece, or open <a href="#finds">Shopping Finds</a> to see listed prices.';
  if (asksSize) return 'Click a product photo to see its size choices. Try asking me where to find a specific piece.';
  return 'Try “How much are the Mary Janes?”, “Where do I choose a size?”, or “Can I pick up my order?”';
}

cards('fawn-form').addEventListener('submit', event => {
  event.preventDefault();
  const question = cards('fawn-question').value.trim();
  if (question) cards('fawn-answer').innerHTML = answerFawn(question);
});

renderBag();
refresh();
showPage();
