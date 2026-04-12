(function () {
  'use strict';

  // ── Panel interaction ────────────────────────────────────────────────────
  // States:
  //   is-expanding  — panel open, content hidden  (phase 1 on enter)
  //   is-active     — panel open, content visible (phase 2 on enter)
  //   is-collapsing — panel open, content hidden  (phase 1 on leave)
  //   is-inactive   — panel closed, numbers/titles dimmed

  var DURATION    = 250;   // ms — must match CSS transition duration
  var BREAKPOINT  = 1280;  // px — mobile threshold
  var container   = document.querySelector('.about__panels');
  var panels      = document.querySelectorAll('.panel');
  var current     = null;
  var timer       = null;

  var ALL_STATES = ['is-expanding', 'is-active', 'is-collapsing', 'is-inactive'];

  function isMobile() {
    return window.innerWidth < BREAKPOINT;
  }

  function setState(panel, state) {
    ALL_STATES.forEach(function (s) { panel.classList.remove(s); });
    if (state) panel.classList.add(state);
  }

  // ── Enter: expand first, then show content ───────────────────────────────
  function enter(panel) {
    if (timer) { clearTimeout(timer); timer = null; }

    if (current === panel) return;

    if (current) setState(current, 'is-inactive');

    current = panel;

    panels.forEach(function (p) {
      if (p !== panel) setState(p, 'is-inactive');
    });

    setState(panel, 'is-expanding');

    timer = setTimeout(function () {
      if (current === panel) setState(panel, 'is-active');
    }, DURATION);
  }

  // ── Leave: hide content first, then collapse ─────────────────────────────
  function leave() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!current) return;

    var prev = current;
    current  = null;

    setState(prev, 'is-collapsing');

    timer = setTimeout(function () {
      panels.forEach(function (p) { setState(p, null); });
    }, DURATION);
  }

  // ── Desktop: hover ───────────────────────────────────────────────────────
  panels.forEach(function (panel) {
    panel.addEventListener('mouseenter', function () {
      if (isMobile()) return;
      enter(panel);
    });
  });

  container.addEventListener('mouseleave', function () {
    if (isMobile()) return;
    leave();
  });

  // ── Mobile: tap to toggle ────────────────────────────────────────────────
  panels.forEach(function (panel) {
    panel.addEventListener('click', function () {
      if (!isMobile()) return;
      if (current === panel) {
        leave();
      } else {
        enter(panel);
      }
    });
  });

  // ── Reset on breakpoint cross ────────────────────────────────────────────
  var wasMobile = isMobile();

  window.addEventListener('resize', function () {
    var nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      if (timer) { clearTimeout(timer); timer = null; }
      current = null;
      panels.forEach(function (p) { setState(p, null); });
    }
  });
}());
