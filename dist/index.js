"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
const display_list = document.getElementById("display_list");
const preview_cover = document.getElementById("preview_cover");
const textarea = document.getElementById("text_editor");
const lineNumbers = document.getElementById("line_numbers");
textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener("keyup", () => {
    adjustTextArea();
    adjustLineNumber();
});
textarea === null || textarea === void 0 ? void 0 : textarea.addEventListener("keydown", () => {
    adjustTextArea();
    adjustLineNumber();
});
function adjustTextArea() {
    var _a, _b;
    const numberOfLines = (_a = textarea.value) === null || _a === void 0 ? void 0 : _a.split("\n").length;
    textarea.style.height = (numberOfLines * 20 + 20).toString() + "px";
    if (editorIndex == 0) {
        slides_css[activeSlide].css = textarea.value;
    }
    if (editorIndex == 1) {
        slide_html = textarea.value;
        const iframe = document.getElementById("container");
        const preview = ((iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) ||
            ((_b = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _b === void 0 ? void 0 : _b.document));
        preview.body.innerHTML = slide_html;
    }
    if (editorIndex == 2) {
        slide_js = textarea.value;
    }
    setSlide(activeSlide);
}
function adjustLineNumber() {
    var _a;
    const numberOfLines = (_a = textarea.value) === null || _a === void 0 ? void 0 : _a.split("\n").length;
    lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
}
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
    adjustTextArea();
    adjustLineNumber();
}
var activeSlide = 0;
function selectSlide(slideIndex) {
    var _a, _b;
    if (slideIndex >= slides_css.length || slideIndex < 0) {
        return;
    }
    const slides = document.getElementsByClassName("slide_card");
    (_a = slides[activeSlide]) === null || _a === void 0 ? void 0 : _a.classList.remove("active");
    (_b = slides[slideIndex]) === null || _b === void 0 ? void 0 : _b.classList.add("active");
    activeSlide = slideIndex;
    switchView(editorIndex);
}
function addSlide() {
    display_list.innerHTML += `
<div class="slide_card" onclick="selectSlide(${slides_css.length})" id="slide-${slides_css.length}">
    <div class="left">${slides_css.length}</div>
    <div class="right">
        <iframe id="container-${slides_css.length}" name="preview-${slides_css.length}">
        </iframe>
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
        <iframe id="container-${index}" name="preview-${index}">
        </iframe>
    </div>
</div>
      `;
    });
    selectSlide(activeSlide - 1);
}
function getSlides() {
    return slides_css;
}
var scale = 1;
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("wheel", (event) => {
    const iframe = document.getElementById("container");
    const scrollAmt = (event === null || event === void 0 ? void 0 : event.deltaY) / 5000;
    if (scale - scrollAmt < 0.05 || scale - scrollAmt > 8) {
        return;
    }
    scale -= scrollAmt;
    iframe.style.transform = `scale(${scale})`;
});
var x;
var y;
var xPos;
var yPos;
var isDragging = false;
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("mousedown", (event) => {
    const iframe = document.getElementById("container");
    x = event.clientX;
    y = event.clientY;
    xPos = iframe.offsetLeft;
    yPos = iframe.offsetTop;
    isDragging = true;
});
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("mouseup", () => {
    isDragging = false;
});
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("mouseout", () => {
    isDragging = false;
});
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("mousemove", (event) => {
    if (isDragging) {
        const iframe = document.getElementById("container");
        const xOffset = xPos + (event.clientX - x);
        const yOffset = yPos + (event.clientY - y);
        iframe.style.left = xOffset + "px";
        iframe.style.top = yOffset + "px";
    }
});
preview_cover === null || preview_cover === void 0 ? void 0 : preview_cover.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        setSlide(activeSlide - 1);
        selectSlide(activeSlide - 1);
    }
    if (event.key === "ArrowRight" || event.key === " ") {
        setSlide(activeSlide + 1);
        selectSlide(activeSlide + 1);
    }
});
function updateiFrames() {
    var _a, _b;
    console.log("updated");
    for (var i = 0; i < slides_css.length; i++) {
        const iframe = document.getElementById("container-" + i);
        const preview = ((iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) ||
            ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
        console.log(i);
        preview.body.innerHTML = slide_html;
        for (var j = 0; j <= i; j++) {
            const style = preview.createElement("style");
            style.setAttribute("id", "slideNum-" + j);
            style.innerHTML = slides_css[j].css;
            (_b = preview === null || preview === void 0 ? void 0 : preview.body) === null || _b === void 0 ? void 0 : _b.appendChild(style);
        }
    }
}
setInterval(function () {
    updateiFrames();
}, 5000);
document.addEventListener("DOMContentLoaded", function () {
    addSlide();
});
document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        event.stopPropagation();
    }
});
