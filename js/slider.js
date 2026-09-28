const track = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".slider-btn-prev");
const nextBtn = document.querySelector(".slider-btn-next");
const dashes = document.querySelectorAll(".slider-dash");
const viewport = document.querySelector(".slider-viewport");

if (track && slides.length > 0) {
  let current = 0;
  const total = slides.length;
  let touchStartX = 0;
  let touchEndX = 0;

  function goToSlide(index) {
    if (index < 0) {
      current = total - 1;
    } else if (index >= total) {
      current = 0;
    } else {
      current = index;
    }

    track.style.transform = "translateX(-" + current * 100 + "%)";

    dashes.forEach(function (dash, i) {
      if (i === current) {
        dash.classList.add("slider-dash-active");
      } else {
        dash.classList.remove("slider-dash-active");
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      goToSlide(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      goToSlide(current + 1);
    });
  }

  // swipe on tablet/mobile — Figma hides arrow buttons below 769px
  if (viewport) {
    viewport.addEventListener("touchstart", function (event) {
      touchStartX = event.changedTouches[0].screenX;
    });

    viewport.addEventListener("touchend", function (event) {
      touchEndX = event.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) < 50) {
        return;
      }

      if (diff > 0) {
        goToSlide(current + 1);
      } else {
        goToSlide(current - 1);
      }
    });
  }

  window.addEventListener("resize", function () {
    goToSlide(current);
  });

  goToSlide(0);
}
