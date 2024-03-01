const slider = document.getElementById("slider");
const imageBefore = document.querySelector(".slider__image-before-wrapper");
const imageAfter = document.querySelector(".slider__image-after-wrapper");

function updateSlider() {
  const isMobile = window.innerWidth <= 767;

  if (isMobile) {
    slider.step = "100";
    slider.value = "0";

    imageBefore.style.clipPath = `inset(0% 0% 0% 0%)`;
    imageAfter.style.clipPath = `inset(0% 0% 0% 100%)`;
  } else {
    slider.value = "50";
    slider.step = "1";
  }
}


updateSlider();

// resize для обновления настроек при изменении размера окна
window.addEventListener("resize", updateSlider);

slider.addEventListener("input", () => {
  const value = slider.value;
  imageBefore.style.clipPath = `inset(0% ${value}% 0% 0%)`;
  imageAfter.style.clipPath = `inset(0% 0% 0% ${100 - value}%)`;
});
