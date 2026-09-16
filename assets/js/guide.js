// Small progressive enhancements for the guide page. Everything still reads
// fine without it — this only adds colour cues and the side contents list.
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // 1. Colour the callouts by their opening bold word.
    var kinds = { tip: 'is-tip', careful: 'is-careful', remember: 'is-remember', done: 'is-done' };
    document.querySelectorAll('blockquote').forEach(function (q) {
      var strong = q.querySelector('strong');
      var word = strong ? strong.textContent.trim().replace(/[:\s].*$/, '').toLowerCase() : '';
      if (kinds[word]) { q.classList.add(kinds[word]); return; }
      if (/^\s*Done\s/.test(q.textContent)) q.classList.add('is-done');
    });

    // 2. Wide tables scroll sideways on a phone instead of breaking the page.
    document.querySelectorAll('table').forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains('table-scroll')) return;
      var box = document.createElement('div');
      box.className = 'table-scroll';
      t.parentNode.insertBefore(box, t);
      box.appendChild(t);
    });

    // 3. A sticky contents list, on wide screens only.
    var heads = [].slice.call(document.querySelectorAll('h2[id], h3[id]'))
      .filter(function (h) { return h.id && h.id !== 'table-of-contents'; });
    if (heads.length < 4) return;
    var nav = document.createElement('nav');
    nav.id = 'guide-toc';
    nav.setAttribute('aria-label', 'On this page');
    var html = '<h4>On this page</h4><ol>';
    heads.forEach(function (h) {
      html += '<li><a href="#' + h.id + '">' + h.textContent.trim() + '</a></li>';
    });
    nav.innerHTML = html + '</ol>';
    document.body.appendChild(nav);
  });
})();
