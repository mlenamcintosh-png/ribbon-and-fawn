(() => {
  const key = 'ribbon-fawn-dressing-room';
  const byId = id => document.getElementById(id);
  const closetForm = byId('closet-form');
  const outfitForm = byId('outfit-form');
  const status = byId('dressing-status');
  const shop = finds.map(item => ({
    id: 'shop-' + item.id, name: item.name, category: item.category,
    image: item.photos?.[0]?.src, symbol: item.symbol,
    cutout: item.id === 'pink-lace-knit-sweater' ? 'top-photos/pink-knit-cutout.webp' : undefined
  }));
  let state = { closet: [], board: [], outfits: [] };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (Array.isArray(saved?.closet) && Array.isArray(saved.board) && Array.isArray(saved.outfits)) state = saved;
  } catch {
    // Start with an empty closet when browser storage is unavailable.
  }

  function commit(next, message) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      status.textContent = 'This browser could not save the change. Try a smaller photo or free up browser storage.';
      return false;
    }
    state = next;
    render();
    status.textContent = message;
    return true;
  }

  function button(label, accessibleLabel, action, pressed) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.setAttribute('aria-label', accessibleLabel);
    if (pressed !== undefined) element.setAttribute('aria-pressed', String(pressed));
    element.addEventListener('click', action);
    return element;
  }

  function pieceCard(piece, onBoard = false) {
    const element = document.createElement('div');
    element.className = 'dressing-piece';
    if (piece.image) {
      const image = document.createElement('img');
      image.src = piece.image;
      image.alt = '';
      image.loading = 'lazy';
      element.append(image);
    } else {
      const symbol = document.createElement('div');
      symbol.className = 'swatch';
      symbol.textContent = piece.symbol;
      symbol.setAttribute('aria-hidden', 'true');
      element.append(symbol);
    }
    const label = document.createElement('strong');
    label.textContent = piece.name;
    const category = document.createElement('span');
    category.textContent = piece.category;
    const included = state.board.includes(piece.id);
    const toggle = button(onBoard ? 'Remove' : included ? 'On board ♡' : 'Style it',
      (included ? 'Remove ' : 'Style ') + piece.name, () => {
        const board = included ? state.board.filter(id => id !== piece.id) : [...state.board, piece.id];
        if (commit({ ...state, board }, included ? 'Piece removed from board.' : 'Piece added to board.')) {
          const replacement = [...byId('dressing-room').querySelectorAll('button')].find(node => node.dataset.piece === piece.id);
          (replacement ?? outfitForm.elements.name).focus();
        }
      }, onBoard ? undefined : included);
    if (!onBoard) toggle.dataset.piece = piece.id;
    element.append(label, category, toggle);
    return element;
  }

  function renderMannequin(board) {
    const slots = { Tops: 'top', Bottoms: 'bottom', Dresses: 'dress', Shoes: 'shoes', Accessories: 'accessory' };
    const fittedPieces = {
      'shop-white-stockings': 'stockings',
      'shop-cream-leg-warmers': 'warmers',
      'shop-pink-ballet-flats': 'flats',
      'shop-pink-bow-mary-janes': 'mary-janes',
      'shop-pink-bow-platform-heels': 'heels'
    };
    const layers = new Map();
    board.forEach(piece => {
      const fitted = fittedPieces[piece.id];
      const slot = fitted === 'stockings' || piece.category === 'Stockings' ? 'stockings' :
        fitted === 'warmers' || piece.category === 'Leg warmers' ? 'warmers' : slots[piece.category];
      if (slot && (piece.cutout || piece.image)) layers.set(slot, piece);
    });
    const clothes = [...layers].map(([slot, piece]) => {
      const fitted = fittedPieces[piece.id];
      if (fitted) {
        const pair = document.createElement('div');
        pair.className = 'fitted-pair fitted-' + fitted;
        pair.setAttribute('role', 'img');
        pair.setAttribute('aria-label', piece.name);
        pair.append(document.createElement('span'), document.createElement('span'));
        return pair;
      }
      const image = document.createElement('img');
      image.className = 'dress-layer dress-layer-' + slot;
      if (!piece.cutout && piece.id.startsWith('shop-')) image.classList.add('dress-layer-photo');
      image.src = piece.cutout ?? piece.image;
      image.alt = piece.name;
      return image;
    });
    byId('dress-form-layers').replaceChildren(...clothes);
  }

  function render() {
    const pieces = [...state.closet, ...shop];
    byId('closet-empty').hidden = state.closet.length > 0;
    byId('closet-pieces').replaceChildren(...state.closet.map(piece => pieceCard(piece)));
    byId('dressing-finds').replaceChildren(...shop.map(piece => pieceCard(piece)));
    const board = state.board.map(id => pieces.find(piece => piece.id === id)).filter(Boolean);
    renderMannequin(board);
    byId('outfit-board').replaceChildren(...board.map(piece => pieceCard(piece, true)));
    byId('outfit-empty').hidden = board.length > 0;
    outfitForm.querySelector('button').disabled = !board.length;
    byId('outfit-saves').replaceChildren(...state.outfits.map(outfit => {
      const entry = document.createElement('li');
      entry.append(
        button('Open', 'Open ' + outfit.name, () => {
          if (commit({ ...state, board: [...outfit.pieces] }, 'Opened ' + outfit.name + '.')) {
            outfitForm.elements.name.value = outfit.name;
            outfitForm.elements.name.focus();
          }
        }),
        button('Delete', 'Delete ' + outfit.name, () => {
          const outfits = state.outfits.filter(saved => saved.id !== outfit.id);
          if (commit({ ...state, outfits }, 'Saved outfit deleted.')) outfitForm.elements.name.focus();
        }),
        document.createTextNode(outfit.name)
      );
      return entry;
    }));
  }

  async function photoPreview(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw Error('Choose a JPG, PNG, or WebP photo.');
    if (file.size > 15 * 1024 * 1024) throw Error('Choose a photo under 15 MB.');
    const image = await createImageBitmap(file);
    try {
      const scale = Math.min(1, 420 / Math.max(image.width, image.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', 0.78);
    } finally {
      image.close();
    }
  }

  closetForm.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(closetForm);
    const name = data.get('name').trim();
    if (!name) {
      status.textContent = 'Give your piece a name first.';
      return;
    }
    const submit = closetForm.querySelector('button');
    submit.disabled = true;
    try {
      const image = await photoPreview(data.get('photo'));
      const piece = { id: crypto.randomUUID(), name, category: data.get('category'), image };
      if (commit({ ...state, closet: [...state.closet, piece] }, name + ' hung in your wardrobe.')) {
        closetForm.reset();
        byId('wardrobe').open = true;
        byId('closet-drawer').open = false;
        byId('closet-pieces').lastElementChild.querySelector('button').focus();
      }
    } catch (error) {
      status.textContent = error instanceof DOMException ? 'That photo could not be opened. Try a different photo.' : error.message;
    } finally {
      submit.disabled = false;
    }
  });

  outfitForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = outfitForm.elements.name.value.trim();
    if (!name || !state.board.length) {
      status.textContent = 'Choose at least one piece and give your outfit a name.';
      return;
    }
    const outfit = { id: crypto.randomUUID(), name, pieces: [...state.board] };
    if (commit({ ...state, outfits: [...state.outfits, outfit] }, 'Saved ' + name + '.')) outfitForm.reset();
  });
  render();
})();
