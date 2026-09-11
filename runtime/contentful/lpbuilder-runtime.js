/* LP Builder – Contentful runtime contract.
 * The renderer calls init(renderedLpRoot) after inserting the page HTML.
 * No automatic initialization or legacy module behavior belongs here yet.
 */
(function (window) {
  'use strict';

  function isElement(value) {
    if (!value || !value.ownerDocument) return false;
    var ownerWindow = value.ownerDocument.defaultView || window;
    return typeof ownerWindow.Element === 'function' &&
      value instanceof ownerWindow.Element;
  }

  function getTabsRoots(root) {
    var tabsRoots = [];

    if (typeof root.matches === 'function' && root.matches('[data-lpb-tabs]')) {
      tabsRoots.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      tabsRoots = tabsRoots.concat(Array.prototype.slice.call(
        root.querySelectorAll('[data-lpb-tabs]')
      ));
    }

    return tabsRoots;
  }

  function initializeTabs(root) {
    getTabsRoots(root).forEach(function (tabsRoot) {
      if (tabsRoot.getAttribute('data-lpb-tabs-initialized') === 'true') return;

      var tablist = typeof tabsRoot.querySelector === 'function'
        ? tabsRoot.querySelector('[role="tablist"]')
        : null;
      if (!tablist || typeof tablist.querySelectorAll !== 'function') return;

      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var document = tabsRoot.ownerDocument;
      var panels = tabs.map(function (tab) {
        var panelId = tab.getAttribute('aria-controls');
        return panelId && typeof document.getElementById === 'function'
          ? document.getElementById(panelId)
          : null;
      });

      if (!tabs.length || panels.some(function (panel) { return !panel; })) return;

      function activateTab(nextTab, focusTab) {
        var nextIndex = tabs.indexOf(nextTab);
        if (nextIndex < 0) return;

        tabs.forEach(function (tab, index) {
          var active = index === nextIndex;
          tab.setAttribute('aria-selected', active ? 'true' : 'false');
          tab.setAttribute('tabindex', active ? '0' : '-1');
          panels[index].hidden = !active;
        });

        if (focusTab && typeof nextTab.focus === 'function') nextTab.focus();
      }

      var initialTab = tabs.filter(function (tab) {
        return tab.getAttribute('aria-selected') === 'true';
      })[0] || tabs[0];
      activateTab(initialTab, false);

      if (typeof tablist.addEventListener === 'function') {
        tablist.addEventListener('click', function (event) {
          var target = event.target;
          if (target && typeof target.closest === 'function') {
            target = target.closest('[role="tab"]');
          }
          if (tabs.indexOf(target) < 0) return;
          activateTab(target, false);
        });

        tablist.addEventListener('keydown', function (event) {
          var currentIndex = tabs.indexOf(event.target);
          if (currentIndex < 0) return;

          var nextIndex = currentIndex;
          if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
          else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = tabs.length - 1;
          else return;

          if (typeof event.preventDefault === 'function') event.preventDefault();
          activateTab(tabs[nextIndex], true);
        });
      }

      tabsRoot.setAttribute('data-lpb-tabs-initialized', 'true');
    });
  }

  function init(root) {
    if (!isElement(root)) return;

    if (root.getAttribute('data-lpb-runtime-initialized') === 'true') return;

    initializeTabs(root);
    root.setAttribute('data-lpb-runtime-initialized', 'true');
  }

  window.LPBuilderRuntime = { init: init };
}(window));
