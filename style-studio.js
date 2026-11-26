(() => {
  const styles = [
    { id: 'coquette', name: 'Coquette', palette: ['#f4c9db','#fff4e3','#a85b7a'], details: 'Blush pink, lace, and ribbon bows.', items: ['pink-lace-knit-sweater','pink-bow-mary-janes'] },
    { id: 'cottagecore', name: 'Cottagecore', palette: ['#ae9870','#d5dbad','#fbefcd'], details: 'Moss green, warm cream, and soft layers.', items: ['cream-leg-warmers','pouch'] },
    { id: 'dark-romantic', name: 'Dark Romantic', palette: ['#27232c','#643444','#bda1c5'], details: 'Black, plum, and wine with striking details.', items: ['white-stockings','pink-bow-platform-heels'] },
    { id: 'coastal', name: 'Coastal Casual', palette: ['#9fc7d7','#24768e','#f2dfbd'], details: 'Ocean blue, sand, and airy basics.', items: ['white-stockings','pouch'] }
  ];
  const byId = id => document.getElementById(id);
  const swatches = style => `<span class="style-swatches" aria-hidden="true">${style.palette.map(color => `<i style="background:${color}"></i>`).join('')}</span>`;
  byId('aesthetic-collections').innerHTML = styles.map(style => `
    <section class="style-collection" id="style-${style.id}" tabindex="-1" style="--collection-color:${style.palette[1]}">
      ${swatches(style)}<h2>${style.name}</h2><p>${style.details}</p>
      <h3>Pieces to style</h3><div class="cards" id="finds-${style.id}"></div>
    </section>`).join('');
  function renderCollections() {
    styles.forEach(style => renderCards(byId('finds-' + style.id), finds.filter(item => style.items.includes(item.id))));
  }
  renderCollections();
  document.addEventListener('fawn-catalog-update', renderCollections);

  const questions = [
    { title: 'Which palette would you reach for first?', choices: ['Blush and ivory','Moss and cream','Wine and black','Ocean blue and sand'] },
    { title: 'Pick an outfit detail.', choices: ['A satin ribbon bow','A soft knit layer','A dramatic dark lace trim','A clean linen texture'] },
    { title: 'Pick a setting for your outfit.', choices: ['A vintage vanity','A garden picnic','A candlelit bookshop','A breezy seaside café'] },
    { title: 'What would you wear on repeat?', choices: ['Bow shoes and a lace-trim top','A floral skirt and cozy cardigan','A dark fitted top and statement shoes','An airy shirt and easy layers'] },
    { title: 'What mood feels most like you today?', choices: ['Sweet and romantic','Earthy and cozy','Moody and bold','Fresh and relaxed'] }
  ];
  const quiz = byId('quiz-content');
  let answers = [];
  function focusQuiz() { quiz.querySelector('h2').focus(); }
  function showQuiz(focus = false) {
    const step = answers.length;
    if (step === questions.length) {
      const ranked = styles.map((style, index) => ({
        style, score: answers.filter(answer => answer === index).length, lastChoice: answers.lastIndexOf(index)
      })).sort((a, b) => b.score - a.score || b.lastChoice - a.lastChoice);
      quiz.innerHTML = '<h2 tabindex="-1">Your style matches</h2>' + ranked.slice(0, 2).map(({style, score}, index) => `
        <div class="quiz-match">${swatches(style)}<h3>${index ? 'Runner-up' : 'Main aesthetic'} · ${style.name}</h3>
        <p>${score ? style.details : 'Try this palette for a different mood.'}</p><a href="#aesthetics" data-style-link="${style.id}">See ${style.name} finds</a></div>`).join('') +
        '<button type="button" class="ribbon-button" data-restart>Retake quiz</button>';
    } else {
      const question = questions[step];
      quiz.innerHTML = `<p>Question ${step + 1} of ${questions.length}</p><h2 tabindex="-1">${question.title}</h2>
        <div class="quiz-choices">${question.choices.map((choice, index) =>
          `<button type="button" data-answer="${index}">${swatches(styles[index])}<span>${choice}</span></button>`).join('')}</div>
        ${step ? '<button class="ribbon-button" type="button" data-back>Back</button>' : ''}`;
    }
    if (focus) focusQuiz();
  }
  quiz.addEventListener('click', event => {
    const link = event.target.closest('[data-style-link]');
    if (link) {
      window.addEventListener('hashchange', () => byId('style-' + link.dataset.styleLink).focus(), { once: true });
      return;
    }
    const target = event.target.closest('button');
    if (!target) return;
    if (target.hasAttribute('data-restart')) answers = [];
    else if (target.hasAttribute('data-back')) answers.pop();
    else if (target.hasAttribute('data-answer')) answers.push(Number(target.dataset.answer));
    showQuiz(true);
  });
  showQuiz();

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
