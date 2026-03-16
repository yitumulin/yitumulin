document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

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
});
