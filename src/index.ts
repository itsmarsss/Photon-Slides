const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");

const tabList = [css, html, js];

const display_list = document.getElementById("display_list") as HTMLElement;

function switchView(view: number) {
  css?.classList.remove("active");
  html?.classList.remove("active");
  js?.classList.remove("active");

  tabList[view]?.classList.add("active");
}

var activeSlide: number = 0;

function selectSlide(slideIndex: number) {
  const slides = document.getElementsByClassName("slide_card");

  slides[activeSlide]?.classList.remove("active");
  slides[slideIndex]?.classList.add("active");

  activeSlide = slideIndex;
}

function addSlide() {
  const slides = document.getElementsByClassName("slide_card");

  if (display_list !== null) {
    display_list.innerHTML += `
<div class="slide_card" onclick="selectSlide(${slides.length}})" id="slide-${slides.length}">
    <div class="left">${slides.length}</div>
    <div class="right">
        <img src="not_found.jpg">
    </div>
</div>
    `;

    selectSlide(slides.length - 1);
  }
}

function deleteSlide() {
  const slide = document.getElementById("slide-" + activeSlide.toString());

  slide?.parentNode?.removeChild(slide);
}
