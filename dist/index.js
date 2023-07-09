"use strict";
var _a;
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
const display_list = document.getElementById("display_list");
const slide_preview = document.getElementById("slide_preview");
const textarea = document.getElementById("text_editor");
const lineNumbers = document.getElementById("line_numbers");
const iframe = document.getElementById("container");
const preview = ((iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) ||
    ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener("keyup", () => {
    var _a;
    adjustTextAreaSize();
    const numberOfLines = (_a = textarea.value) === null || _a === void 0 ? void 0 : _a.split("\n").length;
    lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
});
textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener("keydown", () => {
    var _a;
    adjustTextAreaSize();
    const numberOfLines = (_a = textarea.value) === null || _a === void 0 ? void 0 : _a.split("\n").length;
    lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
});
function adjustTextAreaSize() {
    var _a;
    const numberOfLines = (_a = textarea.value) === null || _a === void 0 ? void 0 : _a.split("\n").length;
    textarea.style.height = (numberOfLines * 20 + 20).toString() + "px";
    if (editorIndex == 0) {
        slides_css[activeSlide].css = textarea.value;
    }
    if (editorIndex == 1) {
        slide_html = textarea.value;
        preview.body.innerHTML = slide_html;
    }
    if (editorIndex == 2) {
        slide_js = textarea.value;
    }
    setSlide(activeSlide);
}
slide_preview === null || slide_preview === void 0 ? void 0 : slide_preview.addEventListener("mousedown", function () {
    setSlide(activeSlide + 1);
    selectSlide(activeSlide + 1);
});
var slide_html = "";
var slide_js = "";
var slides_css = [];
var editorIndex = 0;
function switchView(view) {
    var _a;
    css === null || css === void 0 ? void 0 : css.classList.remove("active");
    html === null || html === void 0 ? void 0 : html.classList.remove("active");
    js === null || js === void 0 ? void 0 : js.classList.remove("active");
    (_a = tabList[view]) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    editorIndex = view;
    if (view == 0) {
        textarea.value = slides_css[activeSlide].css;
    }
    if (view == 1) {
        textarea.value = slide_html;
    }
    if (view == 2) {
        textarea.value = slide_js;
    }
    adjustTextAreaSize();
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
    display_list.innerHTML += `
<div class="slide_card" onclick="selectSlide(${slides_css.length})" id="slide-${slides_css.length}">
    <div class="left">${slides_css.length}</div>
    <div class="right">
        <img src="not_found.jpg">
    </div>
</div>
    `;
    const slide = {
        css: "",
    };
    slides_css.push(slide);
    selectSlide((slides_css === null || slides_css === void 0 ? void 0 : slides_css.length) - 1);
}
function deleteSlide() {
    display_list.innerHTML = "";
    slides_css.splice(activeSlide, 1);
    rerenderSlides();
}
function rerenderSlides() {
    slides_css.forEach((slide, index) => {
        slide = slide;
        display_list.innerHTML += `
<div class="slide_card" onclick="selectSlide(${index})" id="slide-${index}">
    <div class="left">${index}</div>
    <div class="right">
        <img src="not_found.jpg">
    </div>
</div>
      `;
    });
}
function getSlides() {
    return slides_css;
}
addSlide();
