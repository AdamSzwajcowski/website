(function () {
  "use strict";

  /* Jednoznakowe i krótkie wyrazy — spacja po nich zamieniana na &nbsp; (wiążą z następnym słowem). */
  var SIEROTKI_RE =
    /\b([AaĄIiOoUuWwZzżŻ]|Do|Na|Od|Po|Ku|We|Ze|W)\s+(?=[^\s])/g;

  var SKIP_TAGS = {
    SCRIPT: 1,
    STYLE: 1,
    NOSCRIPT: 1,
    CODE: 1,
    PRE: 1,
    TEXTAREA: 1,
  };

  function shouldSkip(node) {
    var el = node.parentElement;
    while (el) {
      if (SKIP_TAGS[el.tagName] || el.closest("[data-no-sierotki]")) {
        return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  function fixText(text) {
    return text.replace(SIEROTKI_RE, function (match, word) {
      return word + "\u00A0";
    });
  }

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!shouldSkip(node) && node.textContent.trim()) {
        var fixed = fixText(node.textContent);
        if (fixed !== node.textContent) {
          node.textContent = fixed;
        }
      }
      return;
    }

    var child = node.firstChild;
    while (child) {
      var next = child.nextSibling;
      walk(child);
      child = next;
    }
  }

  function run() {
    var root = document.querySelector("main") || document.body;
    walk(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
