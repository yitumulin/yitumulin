document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("darkModeToggle");
  const body = document.body;
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  function applyTheme(theme) {
    const isDark = theme === "dark";

    body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);

    if (toggleButton) {
      toggleButton.textContent = isDark ? "Light" : "Dark";
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
});
