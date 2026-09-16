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

    // 3. A contents list: a left sidebar on wide screens, a collapsible
    //    "On this page" block on tablet and phone.
    var heads = [].slice.call(document.querySelectorAll('h2[id], h3[id]'))
      .filter(function (h) { return h.id && h.id !== 'table-of-contents'; });
    if (heads.length < 4) return;

    var nav = document.createElement('nav');
    nav.id = 'guide-toc';
    nav.setAttribute('aria-label', 'On this page');

    var html = '<details open><summary>On this page</summary><ol>';
    heads.forEach(function (h) {
      // Join the leading emoji to the first real word with a non-breaking
      // space so a narrow column never wraps between them.
      var label = h.textContent.trim().replace(/^(\S+)\s+/, '$1 ');
      html += '<li><a href="#' + h.id + '">' + label + '</a></li>';
    });
    nav.innerHTML = html + '</ol></details>';

    document.body.insertBefore(nav, document.body.firstChild);

    // 4. Highlight the section currently in view.
    if (!('IntersectionObserver' in window)) return;
    var links = {};
    nav.querySelectorAll('a').forEach(function (a) {
      links[a.getAttribute('href').slice(1)] = a;
    });
    var activeLink = null;
    function setActive(id) {
      var a = links[id];
      if (!a || a === activeLink) return;
      if (activeLink) activeLink.classList.remove('is-active');
      a.classList.add('is-active');
      activeLink = a;
    }

    var observer = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function (a, b) {
        return a.boundingClientRect.top - b.boundingClientRect.top;
      });
      setActive(visible[0].target.id);
    }, { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] });

    heads.forEach(function (h) { observer.observe(h); });
  });
})();
