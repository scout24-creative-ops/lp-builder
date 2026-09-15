/* LP Builder – Contentful runtime contract.
 * The renderer calls init(renderedLpRoot) after inserting the page HTML.
 * No automatic initialization belongs here; the renderer owns the lifecycle.
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

  /*
   * Counter Animated
   *
   * This is the root-scoped adaptation of the proven Core Runtime counter:
   * it observes each direct heading child at a 0.4 threshold, counts for
   * 1200ms with the original ease-out curve, and restores its exact final
   * string when complete. The final text therefore remains the non-JS and
   * reduced-motion fallback.
   */
  var observedCounters = new WeakSet();
  var startedCounters = new WeakSet();

  function getCounterItems(root) {
    if (typeof root.querySelectorAll !== 'function') return [];

    return Array.prototype.slice.call(root.querySelectorAll(
      '.counter-animated__item > [class^="font-heading-"], ' +
      '.counter-animated__item > [class*=" font-heading-"]'
    ));
  }

  function prefersReducedMotion(ownerWindow) {
    if (!ownerWindow || typeof ownerWindow.matchMedia !== 'function') return false;
    return ownerWindow.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function requestFrame(ownerWindow, callback) {
    if (ownerWindow && typeof ownerWindow.requestAnimationFrame === 'function') {
      return ownerWindow.requestAnimationFrame(callback);
    }

    if (ownerWindow && typeof ownerWindow.setTimeout === 'function') {
      return ownerWindow.setTimeout(function () { callback(Date.now()); }, 16);
    }

    return window.setTimeout(function () { callback(Date.now()); }, 16);
  }

  function startCounter(item, ownerWindow) {
    if (startedCounters.has(item)) return;

    var originalText = item.textContent.trim();
    var match = originalText.match(/(\d+[.,]?\d*)/);
    if (!match) return;

    var numberPart = match[1];
    var prefix = originalText.slice(0, match.index);
    var suffix = originalText.slice(match.index + numberPart.length);
    var hasComma = numberPart.indexOf(',') !== -1;
    var cleaned = numberPart.replace(/\./g, '').replace(',', '.');
    var decimals = cleaned.indexOf('.') !== -1 ? cleaned.split('.')[1].length : 0;
    var target = parseFloat(cleaned);
    if (isNaN(target)) return;

    startedCounters.add(item);

    var duration = 1200;
    var startedAt = null;

    function easeOut(progress) {
      return progress * (2 - progress);
    }

    function step(timestamp) {
      if (startedAt === null) startedAt = timestamp;

      var progress = Math.min((timestamp - startedAt) / duration, 1);
      var value = target * easeOut(progress);
      var display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
      if (hasComma) display = display.replace('.', ',');

      item.textContent = prefix + display + suffix;
      if (progress < 1) requestFrame(ownerWindow, step);
      else item.textContent = originalText;
    }

    requestFrame(ownerWindow, step);
  }

  function initializeCounters(root) {
    var items = getCounterItems(root);
    if (!items.length) return;

    var ownerWindow = root.ownerDocument.defaultView || window;
    if (prefersReducedMotion(ownerWindow)) return;

    if (typeof ownerWindow.IntersectionObserver !== 'function') {
      items.forEach(function (item) {
        startCounter(item, ownerWindow);
      });
      return;
    }

    var observer = new ownerWindow.IntersectionObserver(function (entries, activeObserver) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || startedCounters.has(entry.target)) return;
        startCounter(entry.target, ownerWindow);
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });

    items.forEach(function (item) {
      if (observedCounters.has(item) || startedCounters.has(item)) return;
      observedCounters.add(item);
      observer.observe(item);
    });
  }

  /*
   * Video YouTube
   *
   * Root-scoped adaptation of the legacy single-video module. No YouTube
   * player is requested during initialization: the existing notice remains
   * the privacy disclosure and an explicit click loads the nocookie player.
   */
  var initializedYoutubeModules = new WeakSet();

  function getYoutubeModules(root) {
    var modules = [];

    if (typeof root.matches === 'function' && root.matches('.video--youtube')) {
      modules.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      modules = modules.concat(Array.prototype.slice.call(root.querySelectorAll('.video--youtube')));
    }

    return modules;
  }

  function initializeYoutubeVideos(root) {
    getYoutubeModules(root).forEach(function (module) {
      if (initializedYoutubeModules.has(module)) return;

      var media = typeof module.querySelector === 'function'
        ? module.querySelector('.video-module__media')
        : null;
      var player = typeof module.querySelector === 'function'
        ? module.querySelector('.video-module__player')
        : null;
      var playButton = typeof module.querySelector === 'function'
        ? module.querySelector('.video-module__play')
        : null;

      if (!media || !player || !playButton || typeof media.addEventListener !== 'function') return;

      media.addEventListener('click', function () {
        if (module.classList.contains('is-playing')) return;

        var videoId =
          playButton.getAttribute('data-video-id') ||
          media.getAttribute('data-video-id') ||
          module.getAttribute('data-video-id');
        if (!videoId) return;

        player.setAttribute(
          'src',
          'https://www.youtube-nocookie.com/embed/' + videoId +
          '?autoplay=1&rel=0&modestbranding=1&playsinline=1'
        );
        player.hidden = false;
        module.classList.add('is-playing');
      });

      initializedYoutubeModules.add(module);
    });
  }

  /*
   * Library copy controls
   *
   * Contentful sanitizes scripts and inline event handlers from htmlSource.
   * The visual module library therefore opts in declaratively with
   * data-lpb-library-copy; generated LP modules never use this attribute.
   */
  function getLibraryCopyControls(root) {
    if (typeof root.querySelectorAll !== 'function') return [];

    return Array.prototype.slice.call(root.querySelectorAll('[data-lpb-library-copy]'));
  }

  function copyLibraryModuleName(ownerDocument, value) {
    var ownerWindow = ownerDocument && ownerDocument.defaultView;
    var navigator = ownerWindow && ownerWindow.navigator;

    function fallbackCopy() {
      if (!ownerDocument || typeof ownerDocument.createElement !== 'function' ||
        !ownerDocument.body || typeof ownerDocument.execCommand !== 'function') {
        return Promise.reject(new Error('Clipboard API is unavailable.'));
      }

      var textarea = ownerDocument.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', 'readonly');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      ownerDocument.body.appendChild(textarea);
      textarea.select();

      var copied = ownerDocument.execCommand('copy');
      textarea.remove();

      return copied
        ? Promise.resolve()
        : Promise.reject(new Error('Clipboard copy failed.'));
    }

    if (navigator && navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function') {
      return navigator.clipboard.writeText(value).catch(fallbackCopy);
    }

    return fallbackCopy();
  }

  function initializeLibraryCopyControls(root) {
    getLibraryCopyControls(root).forEach(function (control) {
      if (control.getAttribute('data-lpb-library-copy-initialized') === 'true') return;

      var button = typeof control.querySelector === 'function'
        ? control.querySelector('.module-copy__button')
        : null;
      var moduleName = control.getAttribute('data-module');
      if (!button || !moduleName || typeof button.addEventListener !== 'function') return;

      button.addEventListener('click', function () {
        copyLibraryModuleName(control.ownerDocument, moduleName).then(function () {
          control.classList.add('is-copied');

          var ownerWindow = control.ownerDocument.defaultView || window;
          var clearSuccessState = function () {
            control.classList.remove('is-copied');
          };

          if (typeof ownerWindow.setTimeout === 'function') {
            ownerWindow.setTimeout(clearSuccessState, 700);
          } else {
            window.setTimeout(clearSuccessState, 700);
          }
        }).catch(function () {
          // Preserve the default icon when neither clipboard mechanism succeeds.
        });
      });

      control.setAttribute('data-lpb-library-copy-initialized', 'true');
    });
  }

  function init(root) {
    if (!isElement(root)) return;

    if (root.getAttribute('data-lpb-runtime-initialized') === 'true') return;

    initializeTabs(root);
    initializeCounters(root);
    initializeYoutubeVideos(root);
    initializeLibraryCopyControls(root);
    root.setAttribute('data-lpb-runtime-initialized', 'true');
  }

  window.LPBuilderRuntime = { init: init };
}(window));
