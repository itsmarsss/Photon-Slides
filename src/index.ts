const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");

const tabList = [css, html, js];

const display_list = document.getElementById("display_list") as HTMLElement;

var slide_html: String;
var slide_js: String;

type Slide = {
  css: String;
  domValue: HTMLElement;
};

var slides_css: Slide[] = [];

function switchView(view: number) {
  css?.classList.remove("active");
  html?.classList.remove("active");
  js?.classList.remove("active");

  tabList[view]?.classList.add("active");
}

var activeSlide: number = 0;

function selectSlide(slideIndex: number) {
  slides_css[activeSlide]?.domValue?.classList.remove("active");
  slides_css[slideIndex]?.domValue?.classList.add("active");

  activeSlide = slideIndex;
}

function addSlide() {
  display_list.innerHTML += `
<div class="slide_card" onclick="selectSlide(${slides_css.length}})" id="slide-${slides_css.length}">
    <div class="left">${slides_css.length}</div>
    <div class="right">
        <img src="not_found.jpg">
    </div>
</div>
    `;

  selectSlide(slides_css.length - 1);
}

function deleteSlide() {
  display_list.innerHTML = "";

  slides_css.splice(activeSlide, 1);
}
