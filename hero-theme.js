/* hero-theme.js — comic-book theme for Heroesdle.
   The city goes from day to night as attempts run out (--doom 0→1, from the
   engine's hero:progress event); a comic burst shows on a win or a loss.
   Also fills the footer (sister game, contact, donation). */
(function () {
  'use strict';
  const body = document.body;
  const T = window.__T || {};

  // Comic font for titles (Bangers, SIL Open Font License).
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Bangers&display=swap';
  document.head.appendChild(l);

  // Background scene: sky, searchlights and the city skyline.
  const scene = document.createElement('div');
  scene.className = 'hero-scene';
  scene.setAttribute('aria-hidden', 'true');
  scene.innerHTML = '<div class="hs-night"></div><div class="hs-beam b1"></div><div class="hs-beam b2"></div><div class="hs-city"></div><div class="hs-dots"></div>';
  body.prepend(scene);

  window.addEventListener('hero:progress', function (e) {
    const d = e.detail;
    const doom = d.won ? 0 : d.over ? 1 : Math.min(1, d.attempts / d.max);
    body.style.setProperty('--doom', doom.toFixed(3));
    body.classList.toggle('night', doom >= 0.5 && !d.won);
    body.classList.toggle('lost', d.over && !d.won);
  });

  function burst(text, cls) {
    const b = document.createElement('div');
    b.className = 'comic-burst ' + cls;
    b.textContent = text;
    body.appendChild(b);
    setTimeout(function () { b.remove(); }, 2200);
  }
  window.addEventListener('hero:win', function () {
    burst('POW!', 'win');
    for (let i = 0; i < 24; i++) {
      const s = document.createElement('span');
      s.className = 'hero-confetti';
      s.textContent = ['⭐', '💥', '✨'][i % 3];
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      body.appendChild(s);
      setTimeout(function () { s.remove(); }, 3600);
    }
  });
  window.addEventListener('hero:lose', function () {
    burst('BOOM!', 'lose');
    body.classList.add('shake');
    setTimeout(function () { body.classList.remove('shake'); }, 700);
  });

  // Footer
  const foot = document.getElementById('site-foot');
  if (foot) {
    foot.innerHTML =
      '<p><a href="catalog.html">' + (T.foot_catalog || '📚 All heroes') + '</a></p>' +
      '<p><a class="foot-sister" href="https://dinodle.app" rel="noopener">' + (T.foot_other || '🦖 Also try Dinodle') + '</a></p>' +
      '<p><a class="support-btn" href="https://www.paypal.com/paypalme/MleyeKane" target="_blank" rel="noopener">' + (T.support || '☕ Support the game') + ' · PayPal</a></p>' +
      '<p class="foot-mail">' + (T.foot_contact || 'Contact') + ': <a href="mailto:contact@dinodle.app">contact@dinodle.app</a> · ' +
      'Fan-made game, not affiliated with DC or Marvel. Characters belong to their owners.</p>';
  }
})();
