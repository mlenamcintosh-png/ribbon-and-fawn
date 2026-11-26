(() => {
  const styles = [["Coquette","top-photos/pink-knit-231941.webp","","Pink lace and ribbon details"],["Cottagecore","https://i.pinimg.com/736x/1e/4f/1d/1e4f1d6603fbc15360773e7f037567e3.jpg","https://www.pinterest.com/pin/green-floral-cottagecore-dress-from-hill-house--150941025001453960/","Green floral dress in a garden"],["Dark Academia","https://cdn.mos.cms.futurecdn.net/8BeqaLcunVS49pHkovrqQ9.jpg","https://www.womanandhome.com/fashion/what-is-dark-academia-style-the-book-smart-trend-taking-over-social-media/","Vintage-inspired blazers in brown and gray"],["Gothic","https://punkdesign.shop/cdn/shop/files/kobine-women-s-gothic-lace-lace-up-ruffled-flared-long-sleeved-shirt-33536011534451_1024x1024.jpg?v=1706854551","https://punkdesign.shop/collections/lace-tops","Black lace with flared sleeves"],["Coastal Casual","https://i.etsystatic.com/61721758/r/il/c5623c/7773228931/il_1140xN.7773228931_hp55.jpg","https://www.etsy.com/listing/4459962113/light-blue-linen-two-piece-set-for-women","Relaxed light-blue linen layers"],["Streetwear","https://ae01.alicdn.com/kf/Sad628b29741a4642a61dcfaf2ddc5651T.jpg","https://ae01.alicdn.com/kf/Sad628b29741a4642a61dcfaf2ddc5651T.jpg","Relaxed streetwear with sneakers"],["Y2K","https://www.lavanguardia.com/uploads/2022/09/01/6310a33bdf1b1.jpeg","https://www.lavanguardia.com/magazine/moda/20220902/8496508/guia-combinar-pantalon-cargo-estrella-otono.html","Statement cargo trousers in a street-style outfit"],["Minimalist","https://img.ramonki.by/b/7/79/798/7985/79858.jpg","https://ramonki.com/blog/sovremennye-stili-odezdy-v-2026-godu-polnyi-gid-po-modnym-napravleniyam-i-trendam","Clean-lined beige monochrome outfit"]];
  const byId = id => document.getElementById(id);
  const questions = [
    'Which outfit would you pick for a day out?',
    'Which outfit’s colours would you wear most?',
    'Which outfit has details you’d save for inspiration?',
    'Which look would you most enjoy styling with your own closet?',
    'Which outfit feels most like you?'
  ];
  const quiz = byId('quiz-content');
  let answers = [];
  const photo = ([name, url, source, description]) => `<img class="quiz-photo" src="${url}" alt="${description}" loading="lazy" referrerpolicy="no-referrer">`;
  const credit = ([name, url, source]) => source ? `<a class="quiz-credit" href="${source}" target="_blank" rel="noopener noreferrer">Photo source<span class="quiz-source-name"> · ${name}</span></a>` : '';
  function showQuiz(focus = false) {
    const step = answers.length;
    if (step === questions.length) {
      const ranked = styles.map((style, index) => ({
        style, score: answers.filter(answer => answer === index).length, lastChoice: answers.lastIndexOf(index)
      })).sort((a, b) => b.score - a.score || b.lastChoice - a.lastChoice);
      quiz.innerHTML = '<h2 tabindex="-1">Your style matches</h2>' + ranked.slice(0, 2).map(({style, score}, index) => `
        <div class="quiz-match"><h3>${index ? (score ? 'Runner-up' : 'Try next') : 'Main aesthetic'} · ${style[0]}</h3>${photo(style)}
        <p>${credit(style)}</p><a href="#finds" data-style-link="${style[0]}">Shop ${style[0]}</a></div>`).join('') +
        '<button type="button" class="ribbon-button" data-restart>Retake quiz</button>';
    } else {
      const choices = styles.map((_, index) => (index + step * 3) % styles.length);
      quiz.innerHTML = `<p>Question ${step + 1} of ${questions.length}</p><h2 tabindex="-1">${questions[step]}</h2>
        <div class="quiz-choices">${choices.map(index => {
          const style = styles[index];
          return `<div class="quiz-photo-option"><button type="button" data-answer="${index}">${photo(style)}<span>${style[3]}</span></button>${credit(style)}</div>`;
        }).join('')}</div>
        ${step ? '<button class="ribbon-button" type="button" data-back>Back</button>' : ''}`;
    }
    if (focus) quiz.querySelector('h2').focus();
  }
  quiz.addEventListener('click', event => {
    const link = event.target.closest('[data-style-link]');
    if (link) {
      filterByAesthetic(link.dataset.styleLink);
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
