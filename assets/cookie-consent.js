/*
 * Cookie-баннер + отложенная загрузка Яндекс.Метрики.
 * Аналитика (Метрика) подключается ТОЛЬКО после явного согласия пользователя.
 * Согласие сохраняется в localStorage, чтобы баннер не показывался повторно.
 */
(function () {
  'use strict';

  var KEY = 'msg_cookie_consent';     // 'accepted' | 'declined'
  var YM_ID = 110599203;

  function getConsent() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function setConsent(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  // --- Загрузка Яндекс.Метрики (стандартный счётчик) ---
  function loadMetrika() {
    if (window.__ymLoaded) return;
    window.__ymLoaded = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) { return; } }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + YM_ID, 'ym');
    ym(YM_ID, 'init', { ssr: true, clickmap: true, trackLinks: true, accurateTrackBounce: true, ecommerce: 'dataLayer' });
  }

  // --- Баннер ---
  function injectStyles() {
    if (document.getElementById('cc-styles')) return;
    var css =
      '#cookie-consent{position:fixed;left:0;right:0;bottom:0;z-index:99999;' +
      'background:#0d0d0d;color:#e9e9e9;box-shadow:0 -6px 24px rgba(0,0,0,.28);' +
      'font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;' +
      'transform:translateY(100%);transition:transform .35s ease}' +
      '#cookie-consent.cc-show{transform:translateY(0)}' +
      '#cookie-consent .cc-in{max-width:1180px;margin:0 auto;padding:14px 22px;' +
      'display:flex;gap:18px;align-items:center;justify-content:space-between;flex-wrap:wrap}' +
      '#cookie-consent .cc-txt{margin:0;font-size:13px;line-height:1.55;color:#cfcfcf;flex:1 1 340px}' +
      '#cookie-consent .cc-txt a{color:#fff;text-decoration:underline}' +
      '#cookie-consent .cc-btns{display:flex;gap:10px;flex:0 0 auto}' +
      '#cookie-consent button{font:inherit;font-size:13px;font-weight:700;padding:10px 20px;' +
      'border:0;border-radius:3px;cursor:pointer;line-height:1;transition:background .15s,border-color .15s,color .15s}' +
      '#cookie-consent .cc-accept{background:#e30613;color:#fff}' +
      '#cookie-consent .cc-accept:hover{background:#b70510}' +
      '#cookie-consent .cc-decline{background:transparent;color:#bbb;border:1px solid #555}' +
      '#cookie-consent .cc-decline:hover{color:#fff;border-color:#8a8a8a}' +
      '@media (max-width:560px){#cookie-consent .cc-in{padding:14px 16px}' +
      '#cookie-consent .cc-btns{width:100%}#cookie-consent .cc-btns button{flex:1 1 auto}}';
    var st = document.createElement('style');
    st.id = 'cc-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function showBanner() {
    if (!document.body) { document.addEventListener('DOMContentLoaded', showBanner); return; }
    if (document.getElementById('cookie-consent')) return;
    injectStyles();

    var bar = document.createElement('div');
    bar.id = 'cookie-consent';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Согласие на использование cookie');
    bar.innerHTML =
      '<div class="cc-in">' +
        '<p class="cc-txt">Мы используем файлы cookie и сервис Яндекс.Метрика для аналитики посещаемости. ' +
        'Аналитика подключается только после вашего согласия. Подробнее — в ' +
        '<a href="/politika-konfidencialnosti/">Политике конфиденциальности</a>.</p>' +
        '<div class="cc-btns">' +
          '<button type="button" class="cc-decline">Отклонить</button>' +
          '<button type="button" class="cc-accept">Принять</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(bar);
    requestAnimationFrame(function () { bar.classList.add('cc-show'); });

    function close() { bar.classList.remove('cc-show'); setTimeout(function () { bar.remove(); }, 350); }

    bar.querySelector('.cc-accept').addEventListener('click', function () {
      setConsent('accepted'); loadMetrika(); close();
    });
    bar.querySelector('.cc-decline').addEventListener('click', function () {
      setConsent('declined'); close();
    });
  }

  // --- Точка входа ---
  var consent = getConsent();
  if (consent === 'accepted') { loadMetrika(); }
  else if (consent === 'declined') { /* аналитику не грузим */ }
  else { showBanner(); }
})();
