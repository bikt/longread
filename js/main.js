(function () {
  'use strict';

  // ── Panel interaction ────────────────────────────────────────────────────
  // States:
  //   is-expanding  — panel open, content hidden  (phase 1 on enter)
  //   is-active     — panel open, content visible (phase 2 on enter)
  //   is-collapsing — panel open, content hidden  (phase 1 on leave)
  //   is-inactive   — panel closed, numbers/titles dimmed

  var DURATION  = 250; // ms — must match CSS transition duration
  var container = document.querySelector('.about__panels');
  var panels    = document.querySelectorAll('.panel');
  var current   = null;
  var timer     = null;

  var ALL_STATES = ['is-expanding', 'is-active', 'is-collapsing', 'is-inactive'];

  function setState(panel, state) {
    ALL_STATES.forEach(function (s) { panel.classList.remove(s); });
    if (state) panel.classList.add(state);
  }

  // ── Enter: expand first, then show content ───────────────────────────────
  function enter(panel) {
    if (timer) { clearTimeout(timer); timer = null; }

    if (current === panel) return;

    // Instantly reset previous panel (content already hidden by CSS)
    if (current) setState(current, 'is-inactive');

    current = panel;

    // Dim all other panels
    panels.forEach(function (p) {
      if (p !== panel) setState(p, 'is-inactive');
    });

    // Phase 1: expand width
    setState(panel, 'is-expanding');

    // Phase 2: reveal content after expansion completes
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

    // Phase 1: hide content, keep panel open
    setState(prev, 'is-collapsing');

    // Phase 2: collapse panel after content is gone
    timer = setTimeout(function () {
      panels.forEach(function (p) { setState(p, null); });
    }, DURATION);
  }

  panels.forEach(function (panel) {
    panel.addEventListener('mouseenter', function () { enter(panel); });
  });

  container.addEventListener('mouseleave', leave);
}());
