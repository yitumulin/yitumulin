(function() {
  "use strict";

  var PAGE_LINKS = [
    { label: "Home", href: "index.html", hint: "Portfolio overview" },
    { label: "Projects", href: "posts.html", hint: "Case studies and delivery proof" },
    { label: "Resume", href: "about.html", hint: "Research and software achievements" },
    { label: "Contact", href: "contact.html", hint: "Collaboration and hiring contact" },
    { label: "Search", href: "search.html", hint: "Search content" },
    { label: "Archives", href: "archives.html", hint: "Timeline" },
    { label: "Listening", href: "wudangdao.html", hint: "Audio library" },
    { label: "Tag View", href: "tag-view.html", hint: "Browse by tag/category" }
  ];

  function currentPathName() {
    var path = window.location.pathname || "";
    if (!path || path.endsWith("/")) return "index.html";
    var idx = path.lastIndexOf("/");
    var name = idx >= 0 ? path.slice(idx + 1) : path;
    return name || "index.html";
  }

  function fileNameFromHref(href) {
    if (!href) return "";
    var base = href.split("#")[0].split("?")[0];
    var idx = base.lastIndexOf("/");
    return idx >= 0 ? base.slice(idx + 1) : base;
  }

  function commandHref(href) {
    if (!href) return href;
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) return href;

    var homeAnchor = document.querySelector(
      '.sidebar-nav a[href$="index.html"], .sidebar-brand a[href$="index.html"], .brand[href$="index.html"]'
    );
    if (!homeAnchor) return href;

    var homeHref = homeAnchor.getAttribute("href") || "";
    var marker = "index.html";
    var markerIndex = homeHref.lastIndexOf(marker);
    if (markerIndex < 0) return href;

    return homeHref.slice(0, markerIndex) + href;
  }

  function normalizeInternalHref(href) {
    if (!href) return href;
    if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) return href;

    var hash = "";
    var query = "";
    var base = href;

    var hashIndex = base.indexOf("#");
    if (hashIndex >= 0) {
      hash = base.slice(hashIndex);
      base = base.slice(0, hashIndex);
    }

    var queryIndex = base.indexOf("?");
    if (queryIndex >= 0) {
      query = base.slice(queryIndex);
      base = base.slice(0, queryIndex);
    }

    if (!/\.html$/i.test(base)) return href;
    return base.replace(/-claude\.html$/i, ".html") + query + hash;
  }

  function toOriginalHref(pathname) {
    if (!pathname) return pathname;
    if (pathname.endsWith("/")) return pathname + "index-fix.html";
    if (/-claude\.html$/i.test(pathname)) return pathname.replace(/-claude\.html$/i, "-fix.html");
    if (/-fix\.html$/i.test(pathname)) return pathname.replace(/-fix\.html$/i, ".html");
    if (/\.html$/i.test(pathname)) return pathname.replace(/\.html$/i, "-fix.html");
    return pathname;
  }

  function rewriteInternalLinks(root) {
    (root || document).querySelectorAll("a[href]").forEach(function(anchor) {
      var rawHref = anchor.getAttribute("href");
      if (!rawHref) return;
      var nextHref = normalizeInternalHref(rawHref);
      if (nextHref !== rawHref) {
        anchor.setAttribute("href", nextHref);
      }
    });
  }

  function createCmdPalette() {
    if (document.querySelector(".cmd-overlay")) return;

    var overlay = document.createElement("div");
    overlay.className = "cmd-overlay";
    overlay.innerHTML = [
      '<div class="cmd-panel" role="dialog" aria-modal="true" aria-label="Command palette">',
      '<input type="text" id="cmdInput" placeholder="Jump to page...">',
      '<ul class="cmd-list" id="cmdList"></ul>',
      "</div>"
    ].join("");

    document.body.appendChild(overlay);

    var input = overlay.querySelector("#cmdInput");
    var list = overlay.querySelector("#cmdList");
    var activeIndex = 0;

    function render(query) {
      var q = (query || "").trim().toLowerCase();
      var items = PAGE_LINKS.filter(function(item) {
        if (!q) return true;
        return item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q);
      });

      list.innerHTML = "";
      items.forEach(function(item, idx) {
        var li = document.createElement("li");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = idx === 0 ? "active" : "";
        btn.innerHTML = item.label + "<span>" + item.hint + "</span>";
        btn.addEventListener("click", function() {
          window.location.href = commandHref(item.href);
        });
        li.appendChild(btn);
        list.appendChild(li);
      });
      activeIndex = 0;
    }

    function open() {
      overlay.classList.add("open");
      render("");
      input.value = "";
      setTimeout(function() { input.focus(); }, 10);
    }

    function close() {
      overlay.classList.remove("open");
    }

    input.addEventListener("input", function() {
      render(input.value);
    });

    input.addEventListener("keydown", function(event) {
      var buttons = Array.prototype.slice.call(list.querySelectorAll("button"));
      if (!buttons.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        buttons[activeIndex].classList.remove("active");
        activeIndex = (activeIndex + 1) % buttons.length;
        buttons[activeIndex].classList.add("active");
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        buttons[activeIndex].classList.remove("active");
        activeIndex = (activeIndex - 1 + buttons.length) % buttons.length;
        buttons[activeIndex].classList.add("active");
      } else if (event.key === "Enter") {
        event.preventDefault();
        buttons[activeIndex].click();
      } else if (event.key === "Escape") {
        close();
      }
    });

    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) close();
    });

    document.addEventListener("keydown", function(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      } else if (event.key === "Escape" && overlay.classList.contains("open")) {
        close();
      }
    });

    document.querySelectorAll("[data-cmd-open]").forEach(function(btn) {
      btn.addEventListener("click", open);
    });
  }

  function markActiveNav() {
    var file = currentPathName();
    document.querySelectorAll(".sidebar-nav a").forEach(function(anchor) {
      var href = anchor.getAttribute("href") || "";
      var target = fileNameFromHref(href);
      if (target === file) {
        anchor.classList.add("active");
      } else {
        anchor.classList.remove("active");
      }
    });
  }

  function mountOriginalLink() {
    var container = document.querySelector(".sidebar-footer");
    if (!container || container.querySelector(".original-link")) return;

    var originalPath = toOriginalHref(window.location.pathname || "");
    var originalHref = originalPath + window.location.search + window.location.hash;

    var link = document.createElement("a");
    link.className = "original-link";
    link.href = originalHref;
    link.textContent = "Open Previous Version";
    container.appendChild(link);
  }

  function initProjectFilter() {
    var filterRoot = document.querySelector("[data-project-filter]");
    if (!filterRoot) return;

    var buttons = Array.prototype.slice.call(filterRoot.querySelectorAll("[data-filter]"));
    var items = Array.prototype.slice.call(document.querySelectorAll(".project-item[data-cat]"));
    if (!buttons.length || !items.length) return;

    buttons.forEach(function(button) {
      button.addEventListener("click", function() {
        var filter = button.getAttribute("data-filter");
        buttons.forEach(function(b) { b.classList.remove("active"); });
        button.classList.add("active");

        items.forEach(function(item) {
          var cat = item.getAttribute("data-cat") || "";
          item.hidden = !(filter === "all" || cat.indexOf(filter) >= 0);
        });
      });
    });
  }

  function initViewToggle() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-view-toggle]"));
    var panes = Array.prototype.slice.call(document.querySelectorAll("[data-view-pane]"));
    if (!toggles.length || !panes.length) return;

    toggles.forEach(function(toggle) {
      toggle.addEventListener("click", function() {
        var target = toggle.getAttribute("data-view-toggle");
        toggles.forEach(function(btn) { btn.classList.remove("active"); });
        toggle.classList.add("active");
        panes.forEach(function(pane) {
          pane.hidden = pane.getAttribute("data-view-pane") !== target;
        });
      });
    });
  }

  function initCopyEmail() {
    document.querySelectorAll("[data-copy-email]").forEach(function(button) {
      button.addEventListener("click", function() {
        var email = button.getAttribute("data-copy-email");
        if (!email) return;

        navigator.clipboard.writeText(email).then(function() {
          var oldText = button.textContent;
          button.textContent = "Copied";
          setTimeout(function() {
            button.textContent = oldText;
          }, 1200);
        });
      });
    });
  }

  function initSidebarToggle() {
    document.querySelectorAll("[data-sidebar-toggle]").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.body.classList.toggle("sidebar-open");
      });
    });

    document.addEventListener("click", function(event) {
      if (!document.body.classList.contains("sidebar-open")) return;
      var sidebar = document.querySelector(".sidebar");
      if (!sidebar) return;
      var clickedInside = sidebar.contains(event.target) || (event.target.closest && event.target.closest("[data-sidebar-toggle]"));
      if (!clickedInside) {
        document.body.classList.remove("sidebar-open");
      }
    });
  }

  function init() {
    document.documentElement.setAttribute("data-ui-variant", "claude");

    rewriteInternalLinks(document);
    markActiveNav();
    mountOriginalLink();
    initSidebarToggle();
    createCmdPalette();
    initProjectFilter();
    initViewToggle();
    initCopyEmail();

    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType !== 1) return;
          rewriteInternalLinks(node);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
