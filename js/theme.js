const themeKey = "coffee-house-theme";

function getTheme() {
  const savedTheme = localStorage.getItem(themeKey);

  if (savedTheme === "dark") {
    return "dark";
  }

  return "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(themeKey, theme);

  const buttons = document.querySelectorAll(".theme-btn");

  buttons.forEach(function (button) {
    if (button.dataset.theme === theme) {
      button.classList.add("theme-btn-active");
    } else {
      button.classList.remove("theme-btn-active");
    }
  });

  const toggle = document.querySelector(".theme-toggle");

  if (!toggle) {
    return;
  }

  if (theme === "dark") {
    toggle.setAttribute("aria-label", "Switch to light theme");
    toggle.setAttribute("aria-pressed", "true");
  } else {
    toggle.setAttribute("aria-label", "Switch to dark theme");
    toggle.setAttribute("aria-pressed", "false");
  }
}

setTheme(getTheme());

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  themeToggle.addEventListener("click", function (event) {
    const button = event.target.closest(".theme-btn");

    if (button) {
      setTheme(button.dataset.theme);
      return;
    }

    if (getTheme() === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  });
}
