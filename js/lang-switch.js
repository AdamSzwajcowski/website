(function () {
  var PL_TO_EN = {
    muzyka: "music",
    kompozycja: "composition",
    "na-zywo": "live",
    fingerstyle: "fingerstyle",
    kontakt: "contact",
    it: "it",
  };

  var EN_TO_PL = {};
  Object.keys(PL_TO_EN).forEach(function (pl) {
    EN_TO_PL[PL_TO_EN[pl]] = pl;
  });

  function normalizePathname(pathname) {
    var p = pathname || "/";
    if (p.endsWith("/index.html")) {
      p = p.slice(0, -"/index.html".length);
    }
    if (p.length > 1 && p.endsWith("/")) {
      p = p.slice(0, -1);
    }
    return p || "/";
  }

  function swapLang(pathname) {
    var p = normalizePathname(pathname);
    var parts = p === "/" ? [] : p.split("/").filter(Boolean);

    if (parts[0] === "en") {
      var rest = parts.slice(1);
      if (rest.length === 0) {
        return "/index.html";
      }
      var plParts = rest.map(function (seg) {
        return EN_TO_PL[seg] || seg;
      });
      return "/" + plParts.join("/") + "/index.html";
    }

    if (parts.length === 0) {
      return "/en/index.html";
    }

    var enParts = ["en"].concat(
      parts.map(function (seg) {
        return PL_TO_EN[seg] || seg;
      })
    );
    return "/" + enParts.join("/") + "/index.html";
  }

  function init() {
    var link = document.querySelector("[data-lang-switch]");
    if (!link) return;

    var isEn = /^\/en(\/|$)/.test(location.pathname);
    link.href = swapLang(location.pathname);
    link.setAttribute(
      "aria-label",
      isEn ? "Przełącz na polski" : "Switch to English"
    );
    link.setAttribute("title", isEn ? "Polski" : "English");
    link.classList.toggle("lang-switch--to-pl", isEn);
    link.classList.toggle("lang-switch--to-en", !isEn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
