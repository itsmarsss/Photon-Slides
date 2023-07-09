"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
const display_list = document.getElementById("display_list");
var slide_html;
var slide_js;
var slides_css = [];
function switchView(view) {
    var _a;
    css === null || css === void 0 ? void 0 : css.classList.remove("active");
    html === null || html === void 0 ? void 0 : html.classList.remove("active");
    js === null || js === void 0 ? void 0 : js.classList.remove("active");
    (_a = tabList[view]) === null || _a === void 0 ? void 0 : _a.classList.add("active");
}
var activeSlide = 0;
function selectSlide(slideIndex) {
    var _a, _b, _c, _d;
    (_b = (_a = slides_css[activeSlide]) === null || _a === void 0 ? void 0 : _a.domValue) === null || _b === void 0 ? void 0 : _b.classList.remove("active");
    (_d = (_c = slides_css[slideIndex]) === null || _c === void 0 ? void 0 : _c.domValue) === null || _d === void 0 ? void 0 : _d.classList.add("active");
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
