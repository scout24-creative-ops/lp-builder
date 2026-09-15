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
   * Accordion
   *
   * Root-scoped adaptation of the active accordion contract. Each item
   * keeps its own state so multiple panels and multiple accordions may be
   * open independently.
   */
  var initializedAccordions = new WeakSet();

  function getAccordionRoots(root) {
    var accordions = [];

    if (typeof root.matches === 'function' && root.matches('.lpb-accordion')) {
      accordions.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      accordions = accordions.concat(Array.prototype.slice.call(
        root.querySelectorAll('.lpb-accordion')
      ));
    }

    return accordions;
  }

  function initializeAccordions(root) {
    getAccordionRoots(root).forEach(function (accordion) {
      if (initializedAccordions.has(accordion) ||
        typeof accordion.querySelectorAll !== 'function') return;

      Array.prototype.slice.call(
        accordion.querySelectorAll('.accordion__trigger')
      ).forEach(function (trigger) {
        var item = typeof trigger.closest === 'function'
          ? trigger.closest('.accordion__item')
          : null;
        var panel = item && typeof item.querySelector === 'function'
          ? item.querySelector('.accordion__panel')
          : null;

        if (!item || !panel || typeof panel.style !== 'object') return;

        function setExpanded(expanded) {
          item.classList.toggle('is-open', expanded);
          trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
          panel.style.maxHeight = expanded ? panel.scrollHeight + 'px' : '0px';
        }

        setExpanded(item.classList.contains('is-open'));

        if (typeof trigger.addEventListener === 'function') {
          trigger.addEventListener('click', function () {
            setExpanded(!item.classList.contains('is-open'));
          });
        }
      });

      initializedAccordions.add(accordion);
    });
  }

  /*
   * Sticky footer
   *
   * Each footer follows its nearest preceding split hero within the rendered
   * LP root. Library-static previews are deliberately excluded: their
   * visibility is owned by the visual module library, not this runtime.
   */
  var initializedStickyFooters = new WeakSet();

  function getStickyFooters(root) {
    var footers = [];
    var selector = '.lpb-sticky-footer:not(.lpb-sticky-footer--library-static)';

    if (typeof root.matches === 'function' && root.matches(selector)) {
      footers.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      footers = footers.concat(Array.prototype.slice.call(
        root.querySelectorAll(selector)
      ));
    }

    return footers;
  }

  function getStickyHeroes(root) {
    var heroes = [];
    var selector = '.hero-split, .lpb-hero--split';

    if (typeof root.matches === 'function' && root.matches(selector)) {
      heroes.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      heroes = heroes.concat(Array.prototype.slice.call(
        root.querySelectorAll(selector)
      ));
    }

    return heroes;
  }

  function closestPrecedingStickyHero(footer, heroes) {
    var precedingHeroes = heroes.filter(function (hero) {
      return hero !== footer && typeof hero.compareDocumentPosition === 'function' &&
        (hero.compareDocumentPosition(footer) & 4) !== 0;
    });

    return precedingHeroes.length ? precedingHeroes[precedingHeroes.length - 1] : null;
  }

  function initializeStickyFooters(root) {
    var heroes = getStickyHeroes(root);

    getStickyFooters(root).forEach(function (footer) {
      if (initializedStickyFooters.has(footer)) return;

      footer.classList.remove('is-visible');
      var hero = closestPrecedingStickyHero(footer, heroes);
      var ownerWindow = footer.ownerDocument.defaultView || window;

      // Fail safely when the page has no unambiguous preceding hero or the
      // browser lacks IntersectionObserver: the footer remains hidden.
      if (!hero || typeof ownerWindow.IntersectionObserver !== 'function') {
        initializedStickyFooters.add(footer);
        return;
      }

      var heroVisible = true;
      var lastScrollY = ownerWindow.scrollY || 0;
      var observer = new ownerWindow.IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.target !== hero) return;
          heroVisible = entry.isIntersecting;
          if (heroVisible) footer.classList.remove('is-visible');
        });
      }, { threshold: 0.45, rootMargin: '160px 0px 0px' });

      observer.observe(hero);

      if (typeof ownerWindow.addEventListener === 'function') {
        ownerWindow.addEventListener('scroll', function () {
          var currentY = ownerWindow.scrollY || 0;
          if (currentY > lastScrollY && !heroVisible) {
            footer.classList.add('is-visible');
          }
          lastScrollY = currentY;
        }, { passive: true });
      }

      initializedStickyFooters.add(footer);
    });
  }

  /*
   * Card carousel
   *
   * The AEM card-carousel behaviour is adapted to the root-scoped
   * Contentful runtime. Only explicitly marked carousel roots opt in, so
   * existing LP markup remains untouched.
   */
  var initializedCardCarousels = new WeakSet();

  function getCardCarousels(root) {
    var carousels = [];

    if (typeof root.matches === 'function' && root.matches('[data-lpb-card-carousel]')) {
      carousels.push(root);
    }

    if (typeof root.querySelectorAll === 'function') {
      carousels = carousels.concat(Array.prototype.slice.call(
        root.querySelectorAll('[data-lpb-card-carousel]')
      ));
    }

    return carousels;
  }

  function initializeCardCarousels(root) {
    getCardCarousels(root).forEach(function (carousel) {
      if (initializedCardCarousels.has(carousel)) return;

      var track = typeof carousel.querySelector === 'function'
        ? carousel.querySelector('[data-lpb-card-carousel-track]')
        : null;
      var previous = typeof carousel.querySelector === 'function'
        ? carousel.querySelector('[data-lpb-card-carousel-prev]')
        : null;
      var next = typeof carousel.querySelector === 'function'
        ? carousel.querySelector('[data-lpb-card-carousel-next]')
        : null;
      var dots = typeof carousel.querySelector === 'function'
        ? carousel.querySelector('[data-lpb-card-carousel-dots]')
        : null;
      var slides = track && typeof track.querySelectorAll === 'function'
        ? Array.prototype.slice.call(track.querySelectorAll('.lpb-card-carousel__slide'))
        : [];

      if (!track || !previous || !next || !dots || !slides.length) return;

      var ownerWindow = carousel.ownerDocument.defaultView || window;
      var ownerDocument = carousel.ownerDocument;
      var index = 0;

      function visibleCount() {
        if (typeof ownerWindow.matchMedia !== 'function') return 3;
        if (ownerWindow.matchMedia('(max-width: 668px)').matches) return 1;
        if (ownerWindow.matchMedia('(max-width: 1023px)').matches) return 2;
        return 3;
      }

      function isPalm() {
        return typeof ownerWindow.matchMedia === 'function' &&
          ownerWindow.matchMedia('(max-width: 668px)').matches;
      }

      function maximumIndex() {
        return Math.max(0, slides.length - visibleCount());
      }

      function stepSize() {
        var firstSlide = slides[0];
        var styles = typeof ownerWindow.getComputedStyle === 'function'
          ? ownerWindow.getComputedStyle(track)
          : null;
        var gap = styles ? parseFloat(styles.gap) || 0 : 0;
        var width = typeof firstSlide.getBoundingClientRect === 'function'
          ? firstSlide.getBoundingClientRect().width
          : firstSlide.offsetWidth || 0;

        return width + gap;
      }

      function update() {
        var maximum = maximumIndex();
        index = Math.max(0, Math.min(index, maximum));
        track.style.transform = isPalm()
          ? ''
          : 'translateX(' + (-index * stepSize()) + 'px)';
        previous.disabled = index === 0;
        next.disabled = index === maximum;

        Array.prototype.forEach.call(dots.children, function (dot, dotIndex) {
          var active = dotIndex === index;
          dot.classList.toggle('lpb-card-carousel__dot--active', active);
          if (active) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
      }

      function buildDots() {
        while (dots.firstChild) dots.removeChild(dots.firstChild);

        for (var dotIndex = 0; dotIndex <= maximumIndex(); dotIndex += 1) {
          (function (targetIndex) {
            var dot = ownerDocument.createElement('button');
            dot.type = 'button';
            dot.className = 'lpb-card-carousel__dot';
            dot.setAttribute('aria-label', 'Carousel-Position ' + (targetIndex + 1));
            dot.addEventListener('click', function () {
              index = targetIndex;
              update();
            });
            dots.appendChild(dot);
          }(dotIndex));
        }
      }

      previous.addEventListener('click', function () {
        index -= 1;
        update();
      });
      next.addEventListener('click', function () {
        index += 1;
        update();
      });

      if (typeof ownerWindow.addEventListener === 'function') {
        ownerWindow.addEventListener('resize', function () {
          buildDots();
          update();
        });
      }

      buildDots();
      update();
      initializedCardCarousels.add(carousel);
      carousel.setAttribute('data-lpb-card-carousel-initialized', 'true');
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
    initializeAccordions(root);
    initializeStickyFooters(root);
    initializeCardCarousels(root);
    initializeLibraryCopyControls(root);
    root.setAttribute('data-lpb-runtime-initialized', 'true');
  }

  window.LPBuilderRuntime = { init: init };
}(window));
