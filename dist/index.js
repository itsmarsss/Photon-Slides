"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
const display_list = document.getElementById("display_list");
function switchView(view) {
    var _a;
    css === null || css === void 0 ? void 0 : css.classList.remove("active");
    html === null || html === void 0 ? void 0 : html.classList.remove("active");
    js === null || js === void 0 ? void 0 : js.classList.remove("active");
    (_a = tabList[view]) === null || _a === void 0 ? void 0 : _a.classList.add("active");
}
var activeSlide = 0;
function selectSlide(slideIndex) {
    var _a, _b;
    const slides = document.getElementsByClassName("slide_card");
    (_a = slides[activeSlide]) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
    (_b = slides[slideIndex]) === null || _b === void 0 ? void 0 : _b.classList.add("active");
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
    var _a;
    const slide = document.getElementById("slide-" + activeSlide.toString());
    (_a = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(slide);
}
