/* LP Builder – Contentful runtime contract.
 * The renderer calls init(renderedLpRoot) after inserting the page HTML.
 * No automatic initialization or legacy module behavior belongs here yet.
 */
(function (window) {
  'use strict';

  function init(root) {
    if (!root || !root.ownerDocument) return;

    // Accept elements from the root's own window as well as detached elements.
    var ownerWindow = root.ownerDocument.defaultView || window;
    if (typeof ownerWindow.Element !== 'function' ||
        !(root instanceof ownerWindow.Element)) return;

    if (root.getAttribute('data-lpb-runtime-initialized') === 'true') return;

    root.setAttribute('data-lpb-runtime-initialized', 'true');
  }

  window.LPBuilderRuntime = { init: init };
}(window));
