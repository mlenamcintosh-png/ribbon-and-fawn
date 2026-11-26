(() => {
  const styles = [{"name":"Dezacore","palette":8,"fit":1,"accessories":[5,7,10],"outfit":"A charcoal graphic top, muted cargos, and heavy boots","tiles":[[0,0]]},{"name":"Classic Academia","palette":3,"fit":2,"accessories":[0,3,11],"outfit":"A cream shirt, a brown plaid blazer, and a leather satchel","tiles":[[0,1]]},{"name":"Dark Academia","palette":2,"fit":2,"accessories":[3,7,13],"outfit":"A wine knit layered under a dark blazer with pleated trousers","tiles":[[0,2],[0,4]]},{"name":"Witchy Academia","palette":2,"fit":5,"accessories":[1,7,11],"outfit":"A plum blouse, long black skirt, silver rings, and lace-up boots","tiles":[[0,3]]},{"name":"Adventure Core","palette":1,"fit":4,"accessories":[3,8,11],"outfit":"An olive utility vest, roomy trousers, and walking shoes","tiles":[[0,5]]},{"name":"Cottagecore","palette":1,"fit":3,"accessories":[9,11,16],"outfit":"A floral dress, cream cardigan, and a silk neck scarf","tiles":[[0,6]]},{"name":"Goblin Core","palette":1,"fit":5,"accessories":[3,7,11],"outfit":"A moss knit, a brown corduroy skirt, and chunky boots","tiles":[[0,7]]},{"name":"Granda Core","palette":3,"fit":5,"accessories":[3,13,16],"outfit":"A textured vest, floral skirt, and tortoiseshell clip","tiles":[[0,8]]},{"name":"Fairy Core","palette":1,"fit":3,"accessories":[1,9,16],"outfit":"A layered olive skirt, a brown lace top, and delicate jewellery","tiles":[[0,9]]},{"name":"Kawaii Core","palette":0,"fit":0,"accessories":[4,12,15],"outfit":"A pastel cardigan, short pleated skirt, colourful clips, and pink flats","tiles":[[1,0]]},{"name":"Dark Core","palette":2,"fit":4,"accessories":[1,5,10],"outfit":"A fitted black top, dark flares, chunky rings, and a studded belt","tiles":[[1,1]]},{"name":"Kidcore","palette":4,"fit":1,"accessories":[2,8,15],"outfit":"A primary-colour striped knit, baggy denim, and retro sneakers","tiles":[[1,2]]},{"name":"Dream Core","palette":9,"fit":5,"accessories":[2,14,17],"outfit":"A muted star-print knit, wide jeans, and playful jewellery","tiles":[[1,3]]},{"name":"Decora","palette":7,"fit":5,"accessories":[2,15,17],"outfit":"A bright tee with layered beads, colourful clips, and star sunglasses","tiles":[[1,4]]},{"name":"Gyaru","palette":0,"fit":0,"accessories":[4,12,14],"outfit":"A fitted leopard-print top, denim skirt, and glossy makeup","tiles":[[1,5]]},{"name":"Art Core","palette":1,"fit":5,"accessories":[2,9,11],"outfit":"A patchwork dress, textured bag, and bright handmade jewellery","tiles":[[1,6]]},{"name":"Crowncore","palette":2,"fit":3,"accessories":[1,5,7],"outfit":"A dramatic layered black skirt, fitted bodice, and antique-style jewellery","tiles":[[1,7]]},{"name":"Ethereal","palette":6,"fit":3,"accessories":[0,6,9],"outfit":"An airy ivory skirt, soft blue top, and delicate pearl accents","tiles":[[1,8]]},{"name":"Rain Core","palette":8,"fit":1,"accessories":[5,7,16],"outfit":"A charcoal graphic sweatshirt, washed black denim, and boots","tiles":[[2,0]]},{"name":"Downtown","palette":8,"fit":4,"accessories":[3,7,13],"outfit":"A red fitted top, relaxed jeans, and a worn leather jacket","tiles":[[2,1]]},{"name":"Hyper Feminine","palette":0,"fit":0,"accessories":[4,6,12],"outfit":"A lace-trim top, a ribbon bag, a soft skirt, and bow flats","tiles":[[2,2]]},{"name":"Tomboy","palette":5,"fit":1,"accessories":[5,8,10],"outfit":"A roomy tee, wide denim, and low-profile sneakers","tiles":[[2,3]]},{"name":"Real Indie","palette":1,"fit":4,"accessories":[3,11,16],"outfit":"A moss-green top, faded straight-leg jeans, and a vintage bag","tiles":[[2,4]]},{"name":"2000s Japanese","palette":5,"fit":4,"accessories":[5,12,15],"outfit":"A lace camisole, embroidered denim, and cute hair clips","tiles":[[2,5]]},{"name":"Dull Core","palette":5,"fit":5,"accessories":[1,5,16],"outfit":"A washed-grey striped layer, dark denim, and a black shoulder bag","tiles":[[2,6]]},{"name":"Royal Core","palette":3,"fit":3,"accessories":[0,6,9],"outfit":"An ivory embroidered dress, pearls, and an elegant scarf","tiles":[[2,7]]},{"name":"Acubi","palette":9,"fit":4,"accessories":[1,5,10],"outfit":"A muted fitted top, wide grey cargos, and a compact black bag","tiles":[[2,8]]},{"name":"Cloud Core","palette":6,"fit":1,"accessories":[0,8,15],"outfit":"A white knit, pale blue wide-leg jeans, and silver-toned details","tiles":[[2,9]]},{"name":"Old Money","palette":3,"fit":2,"accessories":[0,3,9],"outfit":"A camel blazer, cream tailored trousers, and pearl studs","tiles":[[3,0]]},{"name":"Skate Girl","palette":5,"fit":1,"accessories":[7,8,10],"outfit":"A graphic tee, loose denim, a studded belt, and skate sneakers","tiles":[[3,1]]},{"name":"Y2K","palette":5,"fit":4,"accessories":[5,12,17],"outfit":"A fitted zip-up, flared jeans, and a small shoulder bag","tiles":[[3,2]]},{"name":"E-girl","palette":2,"fit":5,"accessories":[1,10,14],"outfit":"A black graphic tee over stripes, silver rings, and chunky boots","tiles":[[3,3]]},{"name":"Yellow Pink","palette":7,"fit":0,"accessories":[2,4,15],"outfit":"A pink-and-yellow knit, denim skirt, and colourful clips","tiles":[[3,4]]}];
  const accessories = [["Pearl studs","https://amyojewelry.com/cdn/shop/files/E301-S8_1WH.jpg?v=1741122966&width=400"],["Chunky silver rings","https://www.publicdesire.com/cdn/shop/files/PFACC12297-3_1024x1024.jpg?v=1757674680"],["Rainbow beaded necklace","https://lauragravestock.com/cdn/shop/files/Rainbow_Beaded_Necklace_Gold.jpg?v=1732282608&width=420"],["Vintage brown satchel","https://wildvintagebags.com/cdn/shop/files/IMG_3659.jpg?v=1768200942&width=420"],["Pink bow bag","https://www.emersonsloan.com/cdn/shop/files/911f77a5891bb4c85590c9f9b45ddc9b0f2731357c3dac2663a5bf2c2eb6170f_1200x1200.webp?v=1762611183&width=420"],["Slouchy black shoulder bag","https://assets.kmart.com.au/transform/bab3c9cb-fccf-4b6f-abc9-e77814d8c4fc/73157410-1?io=transform%3Afill%2Cwidth%3A420%2Cheight%3A520"],["Pink ballet flats","shoe-photos/224145.webp"],["Chunky black boots","https://cf.shopee.com.br/file/724f60d8dcd66f73434dec760df966a2"],["Green retro sneakers","https://cdn11.bigcommerce.com/s-fp4euyuo86/images/stencil/1280x1280/products/38610/164284/diadora-cross-running-trainers-green-peas-cream-501-181570-1__85565.1741697090.jpg?c=1"],["Pastel floral scarf","https://image.made-in-china.com/202f0j00MOyqrcVlwbkZ/Silk-Square-Neckwear-Scarf-Customize-Your-Own-Design.webp"],["Black studded belt","https://i5.walmartimages.com/seo/SWSMCLT-Women-s-Autumn-Belt-Loops-Casual-All-Seasons-Adjustable-Belts-2025-Biker-Cyberpunk-Date-Harem-Black-X-Small-Large_4185698c-5d63-4047-92ed-f38bd570ab3c.ad9d2664dcda2c68036ab3dafa988ffa.jpeg"],["Brown belt with brass buckle","https://i.ebayimg.com/images/g/Ev0AAeSw4h1pu-jG/s-l1200.jpg"],["Glossy pink lips","https://assetswabi.wpdev247.com/assets/images/5200703612448/5200703612448.jpg?v=1773744040"],["Soft brown eyeliner","https://sakidorico.s3.amazonaws.com/wp/wp-content/uploads/2023/09/650a717f1a193.jpg"],["Electric-blue eyeliner","https://www.hola.com/us/horizon/original_aspect_ratio/35418e96f8d0-blue-eyeliner.jpg"],["Colourful hair clips","https://aurorapin.com/cdn/shop/files/aurorapinhairclipbarrettelarge.jpg?v=1686029568&width=420"],["Tortoiseshell claw clip","https://www.lifestoryshop.com/cdn/shop/files/e03836478db8a5dd02a818eba1437e78b4a9466f01714623c46bf499f65dbf2b.jpg?v=1750543333&width=420"],["Star-shaped sunglasses","https://pastelkitten.com/cdn/shop/products/H832f52e7adae45a8b00b687b2c9c8e4cL.jpg?v=1679676378&width=420"]];
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

  function chartPhotos(style) {
    return '<span class="quiz-chart-pictures">' + style.tiles.map(([sheet, cell]) =>
      `<span class="quiz-chart-tile" aria-hidden="true" style="background-image:url(quiz-photos/chart-${sheet}.webp);background-position:${cell % 3 * 50}% ${Math.floor(cell / 3) * 100 / 3}%"></span>`).join('') + '</span>';
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
    if (step === 1) return accessories.map(([label, url], id) => [id, label, photo(label, url)]);
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
