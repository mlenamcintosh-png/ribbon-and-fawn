(() => {
  const styles = [{"name":"Classic Academia","palette":3,"fit":2,"accessories":[0],"outfit":"A cream shirt, a brown plaid blazer, and a leather satchel","collage":0},{"name":"Cottagecore","palette":1,"fit":3,"accessories":[1],"outfit":"A floral dress, cream cardigan, and a silk neck scarf","collage":1},{"name":"Goblin Core","palette":1,"fit":5,"accessories":[2],"outfit":"A moss knit, a brown corduroy skirt, and chunky boots","collage":2},{"name":"Fairy Core","palette":1,"fit":3,"accessories":[3],"outfit":"A layered olive skirt, a brown lace top, and delicate jewellery","collage":3},{"name":"Kawaii Core","palette":0,"fit":0,"accessories":[4],"outfit":"A pastel cardigan, short pleated skirt, colourful clips, and pink flats","collage":4},{"name":"Gothic","palette":2,"fit":4,"accessories":[5],"outfit":"A black lace dress, ornate silver jewellery, and lace-up boots","collage":5},{"name":"Decora","palette":7,"fit":5,"accessories":[6],"outfit":"A bright tee with layered beads, colourful clips, and star sunglasses","collage":6},{"name":"Gyaru","palette":0,"fit":0,"accessories":[7],"outfit":"A fitted leopard-print top, denim skirt, and glossy makeup","collage":7},{"name":"Y2K","palette":5,"fit":4,"accessories":[8],"outfit":"A fitted zip-up, flared jeans, and a small shoulder bag","collage":8}];
  const accessories = [["Brown satchel and plaid scarf",0],["Straw hats and woven bags",1],["Earthy beads and vintage belts",2],["Botanical jewellery and ivy pearls",3],["Pink bow headphones and ribbon leg warmers",4],["Black lace chokers and ornate silver rings",5],["Rainbow beads and colourful clips",6],["Furry charms and rhinestone belts",7],["Studded belts and silver jewellery",8]];
  const palettes = [["Soft pastels","Blush, ivory and powder blue",["#e8b6c9","#fff0db","#a6c9ec"]],["Earth tones","Moss, rust and warm brown",["#686b3f","#aa573b","#77503b"]],["Deep tones","Black, wine and plum",["#24222a","#6b263c","#4d305b"]],["Warm neutrals","Cream, camel and chocolate",["#f4e4cc","#b08561","#57392e"]],["Primary brights","Cherry red, sunny yellow and electric blue",["#c72544","#f6d452","#1644c9"]],["Washed denim","Faded denim, charcoal and cool grey",["#7f9aba","#30333c","#929ba6"]],["Cloud tones","Cloud white, sky blue and silver",["#f4f5fa","#a3d8f1","#bec4d0"]],["Rainbow brights","Hot pink, lime, tangerine and turquoise",["#ef39a2","#a7d122","#ff762f","#22bcca"]],["Rainy neutrals","Slate grey, washed black and dark chocolate",["#5b6573","#34313a","#483331"]],["Muted cool tones","Stone grey, olive and dusty lavender",["#a7a6ae","#81856b","#a894b1"]]];
  const fits = [["Fitted and flared","https://static.housebrand.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/7/7/775GG-03X-001-1-1010647_2.jpg"],["Loose and oversized","https://ae01.alicdn.com/kf/Sad628b29741a4642a61dcfaf2ddc5651T.jpg"],["Structured and tailored","https://novorathelabel.com/cdn/shop/files/P1565_5.png?v=1778835187&width=928"],["Soft and flowy","https://cdn.hstatic.net/200000503583/file/xanh-baby-blue-mac-voi-mau-gi__5__11b53ad4a2614ddab641bd6c4460358b.jpg"],["Fitted on top, roomy below","https://us.princesspolly.com/cdn/shop/files/2-modelinfo-summer-us2_d781acdb-2a3d-4f7b-b8bc-7f7b51d5f1d7.jpg?v=1722316146&width=1800"],["Layered and textured","https://c.imgz.jp/538/71311538/71311538b_80_d_500.jpg"]];
  const experiments = [["Dark layers","https://www.grazia.it/content/uploads/2023/09/05_Total_black.jpg",[2,8]],["Romantic lace","https://chezanntique.com/cdn/shop/files/IMG_2042_1024x1024.jpg?v=1761068969",[0,6]],["Floral linen","https://www.linennaive.com/cdn/shop/files/747396041_18457625404119542_5825935049295726668_n_1800x1800.jpg?v=1784016464",[1,3]],["Relaxed cargo layers","https://d1flfk77wl2xk4.cloudfront.net/Assets/58/276/XXL_p0215327658.jpg",[5,9]],["An ivory statement dress","https://cdn.shopify.com/s/files/1/0066/6943/4950/products/image_d0ad7a7e-b2a2-4fda-9bc3-1e0a2bc862d2_2048x.jpg?v=1668668089",[0,6]],["A retro street-style look","https://s.yimg.com/ny/api/res/1.2/uNvMjSs20tNlQGbbTYeHfQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTE0NDQ7Y2Y9d2VicA--/https%3A/media.zenfs.com/en/elle_570/356883d1a1839a9bd3a8e14d8c64caef",[4,5]],["Colourful layered accessories","https://64.media.tumblr.com/3fefc6e4e64b73434126965bf817b907/tumblr_nzu3efGOZg1tvwfkzo1_1280.jpg",[7,4]],["An autumn blazer outfit","https://i.pinimg.com/736x/1a/78/26/1a7826cccfde78c67640e655b6e18d69.jpg",[3,8]]];
  const byId = id => document.getElementById(id);
  const quiz = byId('quiz-content');
  const questions = [
    ['Which outfit would you most like to wear?', 1],
    ['Which finishing touches would you add to your outfit?', 3],
    ['Which colours would you actually reach for when getting dressed?', 2],
    ['Which outfit shape feels most like you?', 2],
    ['Which outfit would you be excited to try, even if it’s different from what you usually wear?', 1]
  ];
  let step = 0;
  let answers = questions.map(() => []);
  let showingResults = false;
  const texture = 'https://ohsewcrafty.co.uk/72507-large_default/100-cotton-washed-denim-fabric-8oz-medium-287gsm.jpg';

  function collage(kind, index) {
    const sheet = Math.floor(index / 3);
    return `<span class="quiz-user-collage" aria-hidden="true" style="background-image:url(quiz-photos/user-${kind}-${sheet}.webp);background-position:${index % 3 * 50}% center"></span>`;
  }

  function chartPhotos(style) {
    return collage(1, style.collage);
  }

  function photo(label, url) {
    return `<img class="quiz-photo" src="${url}" alt="" loading="lazy" referrerpolicy="no-referrer"><span>${label}</span>`;
  }

  function rankedStyles() {
    return styles.map((style, index) => {
      const details = [];
      let score = 0;
      if (answers[0].includes(index)) {
        score += 5;
        details.push('your first outfit pick');
      }
      style.accessories.filter(accessory => answers[1].includes(accessory)).forEach(accessory => {
        score += 2;
        details.push(accessories[accessory][0].toLowerCase());
      });
      if (answers[2].includes(style.palette)) {
        score += 3;
        details.push(palettes[style.palette][0].toLowerCase());
      }
      if (answers[3].includes(style.fit)) {
        score += 3;
        details.push(fits[style.fit][0].toLowerCase() + ' shapes');
      }
      return { style, score, details };
    }).sort((a, b) => b.score - a.score);
  }

  function experimentChoices() {
    const preferences = [...new Set([...answers[2], ...rankedStyles().slice(0, 3).map(result => result.style.palette)])];
    return experiments.map((experiment, id) => ({ experiment, id, score: experiment[2].filter(value => preferences.includes(value)).length }))
      .sort((a, b) => b.score - a.score).slice(0, 4);
  }

  function choicesForStep() {
    if (step === 0) return styles.map((style, id) => [id, 'Outfit ' + (id + 1), chartPhotos(style)]);
    if (step === 1) return accessories.map(([label, url], id) => [id, label, collage(2, url) + '<span>' + label + '</span>']);
    if (step === 2) return palettes.map(([label, description, colors], id) => [id, description,
      `<span class="quiz-fabric" aria-hidden="true">${colors.map(color =>
        `<i style="--fabric-tone:${color};background-image:linear-gradient(${color}b0,${color}b0),url('${texture}')"></i>`).join('')}</span><span>${description}</span>`]);
    if (step === 3) return fits.map(([label, url], id) => [id, label, photo(label, url)]);
    return [...experimentChoices().map(({ experiment: [label, url], id }) => [id, label, photo(label, url)]),
      [-1, 'I’d stick with my usual style', 'I’d stick with my usual style']];
  }

  function updateSelection() {
    const selected = answers[step];
    const limit = questions[step][1];
    quiz.querySelectorAll('[data-answer]').forEach(button => {
      button.setAttribute('aria-pressed', String(selected.includes(Number(button.dataset.answer))));
    });
    quiz.querySelector('[data-next]').disabled = !selected.length;
    quiz.querySelector('[data-selection-count]').textContent = selected.length + ' of ' + limit + ' selected';
  }

  function renderQuestion(focus = true) {
    const [title, limit] = questions[step];
    quiz.innerHTML = `<p>Question ${step + 1} of ${questions.length} · ${limit === 1 ? 'Choose one' : 'Choose up to ' + limit}</p>
      <h2 tabindex="-1">${title}</h2>
      <div class="quiz-choices new-quiz-choices">${choicesForStep().map(([id, label, view]) =>
        `<button type="button" data-answer="${id}" aria-label="${label}" aria-pressed="false">${view}</button>`).join('')}</div>
      <p data-selection-count role="status"></p>
      <div class="quiz-navigation">${step ? '<button type="button" class="ribbon-button" data-back>Back</button>' : ''}
      <button type="button" class="ribbon-button" data-next>${step === questions.length - 1 ? 'Reveal my style' : 'Next question'}</button></div>`;
    updateSelection();
    if (focus) quiz.querySelector('h2').focus();
  }

  function renderResults() {
    showingResults = true;
    const rank = rankedStyles();
    const experiment = experiments[answers[4][0]];
    quiz.innerHTML = '<h2 tabindex="-1">Your style reveal</h2>' + rank.slice(0, 2).map(({ style, details }, index) => `
      <div class="quiz-match">
        <h3>${index ? 'Runner-up' : 'Main aesthetic'} · ${style.name}</h3>${chartPhotos(style)}
        <p>${details.length ? 'What matched: ' + details.join(', ') + '.' : 'An aesthetic to explore for a different look.'}</p>
        <p><strong>Try this outfit</strong> ${style.outfit}.</p>
      </div>`).join('') +
      (experiment ? `<div class="quiz-match"><h3>Something new to try</h3>${photo(experiment[0], experiment[1])}</div>` : '') +
      '<p><a href="#finds">Browse Shopping Finds</a></p><button type="button" class="ribbon-button" data-restart>Retake quiz</button>';
    quiz.querySelector('h2').focus();
  }

  quiz.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-restart')) {
      step = 0;
      answers = questions.map(() => []);
      showingResults = false;
      renderQuestion();
    } else if (!showingResults && target.hasAttribute('data-back')) {
      step--;
      renderQuestion();
    } else if (!showingResults && target.hasAttribute('data-next') && answers[step].length) {
      if (step === questions.length - 1) renderResults();
      else {
        step++;
        if (step === 4) {
          const available = experimentChoices().map(choice => choice.id);
          answers[4] = answers[4].filter(id => id === -1 || available.includes(id));
        }
        renderQuestion();
      }
    } else if (!showingResults && target.hasAttribute('data-answer')) {
      const id = Number(target.dataset.answer);
      const selected = answers[step];
      const limit = questions[step][1];
      if (selected.includes(id)) answers[step] = selected.filter(value => value !== id);
      else if (limit === 1) answers[step] = [id];
      else if (selected.length < limit) selected.push(id);
      else {
        quiz.querySelector('[data-selection-count]').textContent = 'You’ve picked ' + limit + '. Tap one again to swap it.';
        return;
      }
      updateSelection();
    }
  });
  renderQuestion(false);

  const play = byId('music-play');
  const mute = byId('music-mute');
  const status = byId('music-status');
  let player;
  let ready = false;
  let playing = false;
  function musicUnavailable() {
    status.textContent = 'Playback is unavailable here. Open the track in the soundtrack section below.';
    play.disabled = true;
    mute.disabled = true;
  }
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('music-player', {
      videoId: 'jcPmCOUrwNA',
      playerVars: { autoplay: 1, loop: 1, playlist: 'jcPmCOUrwNA', playsinline: 1, origin: location.origin },
      events: {
        onReady() {
          ready = true;
          play.disabled = false;
          mute.disabled = false;
          status.textContent = 'Tap Play if the track has not started.';
        },
        onStateChange(event) {
          playing = event.data === YT.PlayerState.PLAYING;
          play.textContent = playing ? '♫ Pause music' : '♫ Play music';
          if (playing) status.textContent = '';
        },
        onAutoplayBlocked() { status.textContent = 'Tap Play music or use the YouTube player below.'; },
        onError: musicUnavailable
      }
    });
  };
  play.addEventListener('click', () => {
    if (ready) {
      if (playing) player.pauseVideo();
      else player.playVideo();
      return;
    }
    byId('site-music').hidden = false;
    play.disabled = true;
    status.textContent = 'Loading music…';
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.addEventListener('error', musicUnavailable);
    document.head.append(script);
    setTimeout(() => { if (!ready) musicUnavailable(); }, 15000);
  });
  mute.setAttribute('aria-pressed', 'false');
  mute.addEventListener('click', () => {
    if (!ready) return;
    const muted = !player.isMuted();
    if (muted) player.mute();
    else player.unMute();
    mute.textContent = muted ? 'Unmute' : 'Mute';
    mute.setAttribute('aria-pressed', String(muted));
  });
})();
