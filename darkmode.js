document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const siteHeader = document.querySelector(".site-header");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const mobileHeaderMedia = window.matchMedia("(max-width: 768px)");
  const HEADER_HIDE_FROM = 120;
  const HEADER_SHOW_AT = 56;
  let headerCollapsed = false;
  let headerTicking = false;

  function getCurrentLanguage() {
    if (window.siteI18n && typeof window.siteI18n.getLanguage === "function") {
      return window.siteI18n.getLanguage();
    }
    const stored = localStorage.getItem("site_lang");
    if (stored === "zh" || stored === "en") {
      return stored;
    }
    return document.documentElement.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  }

  function getThemeLabel(theme) {
    const isZh = getCurrentLanguage() === "zh";
    if (theme === "dark") {
      return isZh ? "浅色" : "Light";
    }
    return isZh ? "深色" : "Dark";
  }

  function getThemeAriaLabel() {
    return getCurrentLanguage() === "zh" ? "切换深浅主题" : "Toggle color theme";
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";

    body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);

    if (toggleButton) {
      toggleButton.textContent = getThemeLabel(theme);
      toggleButton.setAttribute("aria-label", getThemeAriaLabel());
    }
  }

  function setHeaderCollapsed(nextCollapsed) {
    if (!siteHeader || nextCollapsed === headerCollapsed) {
      return;
    }
    headerCollapsed = nextCollapsed;
    siteHeader.classList.toggle("mobile-collapsed", nextCollapsed);
  }

  function syncMobileHeaderState() {
    if (!siteHeader) {
      return;
    }

    if (!mobileHeaderMedia.matches) {
      setHeaderCollapsed(false);
      return;
    }

    const scrollTop = window.scrollY || window.pageYOffset || 0;

    if (scrollTop >= HEADER_HIDE_FROM) {
      setHeaderCollapsed(true);
      return;
    }

    if (scrollTop <= HEADER_SHOW_AT) {
      setHeaderCollapsed(false);
    }
  }

  function requestMobileHeaderSync() {
    if (headerTicking) {
      return;
    }
    headerTicking = true;
    window.requestAnimationFrame(() => {
      headerTicking = false;
      syncMobileHeaderState();
    });
  }

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme) {
    applyTheme(currentTheme);
  } else if (prefersDarkScheme.matches) {
    applyTheme("dark");
  } else {
    applyTheme("light");
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      applyTheme(body.classList.contains("dark") ? "light" : "dark");
    });
  }

  prefersDarkScheme.addEventListener("change", (event) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });

  document.addEventListener("site-language-changed", () => {
    applyTheme(body.classList.contains("dark") ? "dark" : "light");
  });

  if (siteHeader) {
    window.addEventListener("scroll", requestMobileHeaderSync, { passive: true });
    window.addEventListener("resize", requestMobileHeaderSync);

    if (typeof mobileHeaderMedia.addEventListener === "function") {
      mobileHeaderMedia.addEventListener("change", requestMobileHeaderSync);
    } else if (typeof mobileHeaderMedia.addListener === "function") {
      mobileHeaderMedia.addListener(requestMobileHeaderSync);
    }

    requestMobileHeaderSync();
  }
});
