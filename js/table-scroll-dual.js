/**
 * Duplikuje poziomy pasek przewijania nad tabelą (zsynchronizowany z .table-scroll).
 * Pasek górny widać tylko przy overflow — tak jak natywny na dole.
 */
(function () {
  function initScrollPair(rail, expander, main) {
    var table = main.querySelector("table");
    if (!table) return;

    var syncing = false;

    function updateRailVisibility() {
      var sw = main.scrollWidth;
      var cw = main.clientWidth;
      var needs = sw > cw + 1;
      rail.hidden = !needs;
      if (needs) {
        rail.scrollLeft = main.scrollLeft;
      }
    }

    function syncWidth() {
      var w = table.scrollWidth;
      expander.style.width = w > 0 ? w + "px" : "0";
      updateRailVisibility();
    }

    function fromMain() {
      if (syncing) return;
      syncing = true;
      rail.scrollLeft = main.scrollLeft;
      requestAnimationFrame(function () {
        syncing = false;
      });
    }

    function fromRail() {
      if (syncing) return;
      syncing = true;
      main.scrollLeft = rail.scrollLeft;
      requestAnimationFrame(function () {
        syncing = false;
      });
    }

    main.addEventListener("scroll", fromMain, { passive: true });
    rail.addEventListener("scroll", fromRail, { passive: true });
    window.addEventListener("resize", syncWidth);

    var ro = new ResizeObserver(syncWidth);
    ro.observe(table);
    ro.observe(main);

    syncWidth();
  }

  function wrapEl(scrollEl) {
    var wrap = document.createElement("div");
    wrap.className = "table-scroll-wrap";

    var rail = document.createElement("div");
    rail.className = "table-scroll-rail";
    rail.setAttribute("aria-hidden", "true");

    var expander = document.createElement("div");
    expander.className = "table-scroll-rail__expander";
    rail.appendChild(expander);

    var parent = scrollEl.parentNode;
    parent.insertBefore(wrap, scrollEl);
    wrap.appendChild(rail);
    wrap.appendChild(scrollEl);

    initScrollPair(rail, expander, scrollEl);
  }

  function initAll() {
    document.querySelectorAll(".table-scroll").forEach(function (el) {
      if (el.parentElement && el.parentElement.classList.contains("table-scroll-wrap")) {
        return;
      }
      wrapEl(el);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
