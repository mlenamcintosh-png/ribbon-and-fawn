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

  const fitKey = 'ribbon-fawn-mannequin-fit';
  const sizes = ['Very slim', 'Slim', 'Small', 'Medium', 'Full', 'Large', 'Extra large'];
  const shapes = {
    balanced: [1, 1, 1], straight: [0.94, 1.18, 0.91], curved: [1.05, 0.83, 1.12],
    hips: [0.9, 0.94, 1.2], shoulders: [1.16, 1.02, 0.9], rounded: [1, 1.33, 1.05]
  };
  const sizeControl = byId('mannequin-size');
  const shapeControl = byId('mannequin-shape');
  try {
    const fit = JSON.parse(localStorage.getItem(fitKey));
    if (Number.isFinite(fit?.size)) sizeControl.value = fit.size;
    if (Object.hasOwn(shapes, fit?.shape)) shapeControl.value = fit.shape;
  } catch {
    // Use the controls' defaults when no saved preferences are available.
  }

  function tailorSweater() {
    const canvas = byId('dress-form-layers').querySelector('.tailored-sweater');
    if (!canvas || !canvas.sourceImage?.complete || !canvas.sourceImage.naturalWidth) return;
    const source = canvas.sourceImage;
    const context = canvas.getContext('2d');
    const [shoulders, waist, hips] = shapes[shapeControl.value];
    const bands = [shoulders, shoulders, (shoulders + waist) / 2, waist, (waist + hips) / 2];
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < canvas.height; row++) {
      const progress = row / (canvas.height - 1) * (bands.length - 1);
      const band = Math.min(bands.length - 2, Math.floor(progress));
      const width = canvas.width * 0.77 * (bands[band] + (bands[band + 1] - bands[band]) * (progress - band));
      context.drawImage(source, 0, row / canvas.height * source.naturalHeight, source.naturalWidth,
        source.naturalHeight / canvas.height, (canvas.width - width) / 2, row, width, 1);
    }
  }

  function applyFit() {
    const size = Number(sizeControl.value);
    const shape = shapeControl.value;
    const [shoulders, waist, hips] = shapes[shape];
    tailorSweater();
    const style = byId('mannequin-fit').style;
    style.setProperty('--body-size', 0.76 + size * 0.0048);
    style.setProperty('--shoulders', shoulders);
    style.setProperty('--hips', hips);
    style.setProperty('--waist-inset', (50 - 25 * waist) + '%');
    const sizeName = sizes[Math.round(size / 100 * (sizes.length - 1))];
    byId('mannequin-size-value').textContent = sizeName;
    sizeControl.setAttribute('aria-valuetext', sizeName);
  }

  byId('mannequin-options').addEventListener('input', () => {
    applyFit();
    try {
      localStorage.setItem(fitKey, JSON.stringify({
        size: Number(sizeControl.value), shape: shapeControl.value
      }));
    } catch {
      // The preview remains adjustable when storage is unavailable.
    }
  });
  applyFit();

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
    const mannequin = byId('mannequin-fit');
    mannequin.classList.toggle('wearing-sweater', layers.get('top')?.id === 'shop-pink-lace-knit-sweater');
    mannequin.classList.toggle('wearing-stockings', layers.get('stockings')?.id === 'shop-white-stockings');
    mannequin.classList.toggle('wearing-shoes', layers.has('shoes'));
    const clothes = [...layers].map(([slot, piece]) => {
      const fitted = fittedPieces[piece.id];
      if (fitted) {
        const pair = document.createElement('div');
        pair.className = 'fitted-pair fitted-' + fitted;
        pair.setAttribute('role', 'img');
        pair.setAttribute('aria-label', piece.name);
        pair.style.setProperty('--garment', 'url("dressing-assets/' + fitted + '.webp")');
        pair.append(document.createElement('span'), document.createElement('span'));
        return pair;
      }
      if (piece.id === 'shop-pink-lace-knit-sweater') {
        const canvas = document.createElement('canvas');
        canvas.className = 'dress-layer tailored-sweater';
        canvas.width = 360;
        canvas.height = 300;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', piece.name);
        canvas.sourceImage = new Image();
        canvas.sourceImage.addEventListener('load', tailorSweater);
        canvas.sourceImage.src = piece.cutout;
        return canvas;
      }
      const image = document.createElement('img');
      image.className = 'dress-layer dress-layer-' + slot;
      if (!piece.cutout && piece.id.startsWith('shop-')) image.classList.add('dress-layer-photo');
      image.src = piece.cutout ?? piece.image;
      image.alt = piece.name;
      return image;
    });
    byId('dress-form-layers').replaceChildren(...clothes);
    tailorSweater();
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
