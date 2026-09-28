const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");

function closeMenu() {
  if (!burger || !nav) {
    return;
  }

  burger.classList.remove("burger-open");
  nav.classList.remove("nav-open");
  burger.setAttribute("aria-label", "Open menu");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function openMenu() {
  burger.classList.add("burger-open");
  nav.classList.add("nav-open");
  burger.setAttribute("aria-label", "Close menu");
  burger.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
}

function toggleMenu() {
  if (nav.classList.contains("nav-open")) {
    closeMenu();
  } else {
    openMenu();
  }
}

if (burger && nav) {
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-controls", "main-nav");
  nav.id = "main-nav";

  burger.addEventListener("click", toggleMenu);

  nav.querySelectorAll(".nav-link").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !document.body.classList.contains("modal-open-body")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });
}
