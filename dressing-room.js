(() => {
  const key = 'ribbon-fawn-dressing-room';
  const byId = id => document.getElementById(id);
  const closetForm = byId('closet-form');
  const outfitForm = byId('outfit-form');
  const status = byId('dressing-status');
  const shop = finds.filter(item => item.category !== 'Shoes').map(item => ({
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

  const deleteDialog = byId('closet-delete-dialog');
  let pendingDeletion;
  function confirmDeletion(piece, trigger) {
    const affected = state.outfits.filter(outfit => outfit.pieces.includes(piece.id)).map(outfit => outfit.name);
    byId('closet-delete-warning').textContent = `“${piece.name}” will be permanently deleted from your wardrobe and removed from your current outfit and any saved outfits that use it.` +
      (affected.length ? ' Affected outfits: ' + affected.join(', ') + '.' : '');
    pendingDeletion = { piece, trigger };
    deleteDialog.returnValue = 'cancel';
    deleteDialog.showModal();
  }

  deleteDialog.addEventListener('close', () => {
    if (!pendingDeletion) return;
    const { piece, trigger } = pendingDeletion;
    pendingDeletion = undefined;
    if (deleteDialog.returnValue !== 'delete') {
      trigger.focus();
      return;
    }
    const closet = state.closet.filter(item => item.id !== piece.id);
    const board = state.board.filter(id => id !== piece.id);
    const outfits = state.outfits.map(outfit => ({
      ...outfit, pieces: outfit.pieces.filter(id => id !== piece.id)
    }));
    if (commit({ ...state, closet, board, outfits }, 'Deleted ' + piece.name + ' from your wardrobe and outfits.')) {
      byId('wardrobe').querySelector('summary').focus();
    } else trigger.focus();
  });

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
    element.append(label, category);
    if (piece.category !== 'Shoes') element.append(toggle);
    if (!onBoard && !piece.id.startsWith('shop-')) {
      const remove = button('Delete', 'Delete ' + piece.name + ' from wardrobe', () => confirmDeletion(piece, remove));
      if (piece.category !== 'Shoes') element.append(button('Fit', 'Fit ' + piece.name + ' to mannequin', () => openFitting(piece)));
      element.append(remove);
    }
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
      if (!piece.fit && (slot === 'stockings' || slot === 'warmers')) {
        const pair = document.createElement('div');
        pair.className = 'fitted-pair fitted-' + slot;
        pair.setAttribute('role', 'img');
        pair.setAttribute('aria-label', piece.name);
        pair.style.setProperty('--garment', 'url("' + (fitted ? 'dressing-assets/' + fitted + '.webp' : piece.image) + '")');
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
      if (piece.fit) {
        image.classList.add('custom-garment');
        applyGarmentFit(image, piece.fit);
      }
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
    const board = state.board.map(id => pieces.find(piece => piece.id === id)).filter(piece => piece && piece.category !== 'Shoes');
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

  const tip = byId('upload-tip');
  const fitDialog = byId('closet-fit');
  const fitForm = byId('closet-fit-form');
  const removeBackground = byId('closet-remove-bg');
  const fitInputs = ['x', 'y', 'size'].map(name => byId('closet-fit-' + name));
  const defaultFit = {
    Tops: [50, 32, 56], Bottoms: [50, 59, 44], Dresses: [50, 43, 56],
    Stockings: [50, 64, 35], 'Leg warmers': [50, 77, 32], Accessories: [68, 28, 22]
  };
  let activeFit;
  let cutout;
  let previewImage;

  byId('upload-tip-open').addEventListener('click', () => tip.showModal());
  const tipKey = 'ribbon-fawn-hide-upload-tip';
  const dismissTip = byId('upload-tip-dismiss');
  dismissTip.checked = readLocal(tipKey) === 'yes';
  dismissTip.addEventListener('change', () => writeLocal(tipKey, dismissTip.checked ? 'yes' : 'no'));
  let tipShown = false;
  byId('closet-drawer').addEventListener('toggle', event => {
    if (!event.target.open || dismissTip.checked || tipShown || fitDialog.open || tip.open) return;
    tipShown = true;
    tip.showModal();
  });

  function fitValues() {
    const [x, y, size] = fitInputs.map(input => Number(input.value));
    return { x, y, size };
  }

  function applyGarmentFit(image, { x, y, size }) {
    image.style.left = x + '%';
    image.style.top = y + '%';
    image.style.width = size + '%';
    image.style.right = 'auto';
    image.style.bottom = 'auto';
  }

  function openFitting(piece, isNew = false) {
    activeFit = { piece, isNew };
    cutout = piece.cutout;
    const initial = piece.fit ? [piece.fit.x, piece.fit.y, piece.fit.size] : defaultFit[piece.category] ?? defaultFit.Tops;
    fitInputs.forEach((input, index) => { input.value = initial[index]; });
    removeBackground.checked = Boolean(cutout);
    removeBackground.disabled = false;
    fitForm.querySelector('[type="submit"]').disabled = false;
    byId('closet-fit-status').textContent = '';
    const stage = byId('mannequin-fit').parentElement.cloneNode(true);
    stage.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
    const form = stage.querySelector('.mannequin-fit');
    form.classList.remove('wearing-stockings', 'wearing-sweater');
    form.querySelector('[role="group"]').replaceChildren();
    previewImage = document.createElement('img');
    previewImage.className = 'dress-layer custom-garment';
    previewImage.alt = piece.name;
    previewImage.draggable = false;
    previewImage.src = cutout ?? piece.image;
    applyGarmentFit(previewImage, fitValues());
    form.append(previewImage);
    byId('closet-fit-preview').replaceChildren(stage);
    let drag;
    previewImage.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      previewImage.setPointerCapture(event.pointerId);
      const bounds = form.getBoundingClientRect();
      drag = { x: event.clientX, y: event.clientY, bounds, start: fitValues() };
    });
    previewImage.addEventListener('pointermove', event => {
      if (!drag || !previewImage.hasPointerCapture(event.pointerId)) return;
      fitInputs[0].value = Math.round(drag.start.x + (event.clientX - drag.x) / drag.bounds.width * 100);
      fitInputs[1].value = Math.round(drag.start.y + (event.clientY - drag.y) / drag.bounds.height * 100);
      applyGarmentFit(previewImage, fitValues());
    });
    previewImage.addEventListener('lostpointercapture', () => { drag = undefined; });
    fitDialog.showModal();
  }

  fitInputs.forEach(input => input.addEventListener('input', () => applyGarmentFit(previewImage, fitValues())));

  async function cutPlainBackground(source) {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    const { naturalWidth: width, naturalHeight: height } = image;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, width, height);
    const data = pixels.data;
    const corners = [0, width - 1, width * (height - 1), width * height - 1];
    const samples = corners.filter(index => data[index * 4 + 3] >= 20)
      .map(index => Array.from(data.slice(index * 4, index * 4 + 3)));
    const similar = (a, b) => a.every((value, channel) => Math.abs(value - b[channel]) <= 14);
    const reference = samples.find(sample => samples.filter(other => similar(sample, other)).length >= 3);
    if (samples.length && !reference) throw Error('Try tracing the garment outline for this photo.');
    const visited = new Uint8Array(width * height);
    const queue = [];
    function visit(index) {
      if (visited[index]) return;
      visited[index] = 1;
      const p = index * 4;
      const matches = data[p + 3] < 20 || (reference && similar(reference, data.subarray(p, p + 3)));
      if (matches) {
        data[p + 3] = 0;
        queue.push(index);
      }
    }
    for (let x = 0; x < width; x++) {
      visit(x);
      visit((height - 1) * width + x);
    }
    for (let y = 0; y < height; y++) {
      visit(y * width);
      visit((y + 1) * width - 1);
    }
    for (let i = 0; i < queue.length; i++) {
      const p = queue[i], x = p % width;
      if (x > 0) visit(p - 1);
      if (x < width - 1) visit(p + 1);
      if (p >= width) visit(p - width);
      if (p < width * (height - 1)) visit(p + width);
    }
    if (queue.length > width * height * .96 || queue.length < width * height * .03) {
      throw Error('The background could not be separated cleanly. Try a higher-contrast photo or a transparent cutout.');
    }
    context.putImageData(pixels, 0, 0);
    let left = width, right = -1, top = height, bottom = -1;
    for (let i = 0; i < width * height; i++) {
      if (data[i * 4 + 3] < 20) continue;
      const x = i % width, y = Math.floor(i / width);
      left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
    if (right < left) throw Error('No garment was found in this photo.');
    const cropped = document.createElement('canvas');
    cropped.width = right - left + 1;
    cropped.height = bottom - top + 1;
    cropped.getContext('2d').drawImage(canvas, -left, -top);
    return cropped.toDataURL('image/png');
  }

  removeBackground.addEventListener('change', async () => {
    const session = activeFit;
    const message = byId('closet-fit-status');
    const save = fitForm.querySelector('[type="submit"]');
    if (!removeBackground.checked) {
      previewImage.src = session.piece.image;
      message.textContent = '';
      return;
    }
    removeBackground.disabled = true;
    save.disabled = true;
    try {
      const result = cutout ?? await cutPlainBackground(session.piece.image);
      if (activeFit !== session) return;
      cutout = result;
      previewImage.src = result;
      message.textContent = 'Check the edges before saving.';
    } catch (error) {
      if (activeFit !== session) return;
      removeBackground.checked = false;
      message.textContent = error.message;
    } finally {
      if (activeFit === session) {
        removeBackground.disabled = false;
        save.disabled = false;
      }
    }
  });

  const outline = byId('closet-outline');
  const outlineCanvas = byId('outline-canvas');
  const outlineContext = outlineCanvas.getContext('2d');
  const useOutline = byId('outline-apply');
  let outlineImage;
  let points = [];

  function drawOutline() {
    outlineContext.clearRect(0, 0, outlineCanvas.width, outlineCanvas.height);
    outlineContext.drawImage(outlineImage, 0, 0);
    if (points.length) {
      outlineContext.beginPath();
      points.forEach(([x, y], i) => i ? outlineContext.lineTo(x, y) : outlineContext.moveTo(x, y));
      outlineContext.closePath();
      outlineContext.strokeStyle = '#a53168';
      outlineContext.lineWidth = 2;
      outlineContext.stroke();
      points.forEach(([x, y]) => outlineContext.fillRect(x - 2, y - 2, 4, 4));
    }
    useOutline.disabled = points.length < 3;
  }

  byId('closet-outline-open').addEventListener('click', async () => {
    const session = activeFit;
    const image = new Image();
    image.src = session.piece.image;
    try { await image.decode(); } catch {
      byId('closet-fit-status').textContent = 'This photo could not be opened.';
      return;
    }
    if (activeFit !== session || outline.open) return;
    outlineImage = image;
    points = [];
    outlineCanvas.width = image.naturalWidth;
    outlineCanvas.height = image.naturalHeight;
    drawOutline();
    outline.showModal();
  });

  outlineCanvas.addEventListener('click', event => {
    const box = outlineCanvas.getBoundingClientRect();
    points.push([(event.clientX - box.left) * outlineCanvas.width / box.width,
      (event.clientY - box.top) * outlineCanvas.height / box.height]);
    drawOutline();
  });
  byId('outline-undo').addEventListener('click', () => { points.pop(); drawOutline(); });
  useOutline.addEventListener('click', () => {
    const left = Math.max(0, Math.floor(Math.min(...points.map(([x]) => x))));
    const top = Math.max(0, Math.floor(Math.min(...points.map(([, y]) => y))));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.ceil(Math.max(...points.map(([x]) => x))) - left);
    canvas.height = Math.max(1, Math.ceil(Math.max(...points.map(([, y]) => y))) - top);
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    points.forEach(([x, y], i) => i ? ctx.lineTo(x - left, y - top) : ctx.moveTo(x - left, y - top));
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(outlineImage, -left, -top);
    cutout = canvas.toDataURL('image/png');
    removeBackground.checked = true;
    previewImage.src = cutout;
    byId('closet-fit-status').textContent = 'Outline applied. Save fit to keep it.';
    outline.close();
  });

  byId('closet-fit-cancel').addEventListener('click', () => fitDialog.close());
  fitDialog.addEventListener('close', () => { activeFit = undefined; });
  fitForm.addEventListener('submit', event => {
    event.preventDefault();
    const { piece, isNew } = activeFit;
    const fitted = { ...piece, fit: fitValues(), cutout: removeBackground.checked ? cutout : undefined };
    const closet = isNew ? [...state.closet, fitted] : state.closet.map(item => item.id === piece.id ? fitted : item);
    const board = [...state.board.filter(id => id !== piece.id), piece.id];
    if (!commit({ ...state, closet, board }, piece.name + ' fitted and added to your outfit.')) {
      byId('closet-fit-status').textContent = status.textContent;
      return;
    }
    fitDialog.close();
    if (isNew) closetForm.reset();
    byId('wardrobe').open = true;
    byId('closet-drawer').open = false;
    byId('wardrobe').querySelector('summary').focus();
  });

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
      if (piece.category !== 'Shoes') {
        openFitting(piece, true);
        return;
      }
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
