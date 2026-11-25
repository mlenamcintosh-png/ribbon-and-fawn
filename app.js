const finds = [
  { id: 'bow', name: 'Satin bow clip', category: 'Accessories', symbol: 'ෆ', color: '#f3ccd9' },
  { id: 'tray', name: 'Heart trinket tray', category: 'Room', symbol: '♡', color: '#f4dfd5' },
  { id: 'pouch', name: 'Gingham pouch', category: 'Accessories', symbol: '❀', color: '#e9d8ef' }
];
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

function renderCards(container, items) {
  container.innerHTML = items.map(item => {
    const isSaved = saved.has(item.id);
    return `<article class="card">
      <div class="swatch" style="--swatch:${item.color}" aria-hidden="true">${item.symbol}</div>
      <h3>${item.name}</h3>
      <p>${item.category}</p>
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
refresh();
showPage();
