"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
const display_list = document.getElementById("display_list");
const preview_cover = document.getElementById("preview_cover");
const textarea = document.getElementById("text_editor");
const highlighting = document.getElementById("highlighting");
const highlighting_content = document.getElementById("highlighting_content");
const lineNumbers = document.getElementById("line_numbers");
const download_popup = document.getElementById("download");
const upload_popup = document.getElementById("upload");
const import_in = document.getElementById("import_in");
const export_out = document.getElementById("export_out");
textarea.addEventListener("keyup", () => {
    adjustTextArea();
    adjustLineNumber();
});
textarea.addEventListener("keydown", () => {
    adjustTextArea();
    adjustLineNumber();
});
function adjustTextArea() {
    var _a;
    const numberOfLines = textarea.value.split("\n").length;
    const height = numberOfLines * 20 + 20 + "px";
    const lines = textarea.value.split("\n");
    var max = 0;
    for (var i = 0; i < lines.length; i++) {
        max = Math.max(max, lines[i].length);
    }
    const width = max * 7.5 + 20 + "px";
    textarea.style.width = width;
    highlighting.style.width = width;
    highlighting_content.style.width = width;
    textarea.style.height = height;
    highlighting.style.height = height;
    highlighting_content.style.height = height;
    if (editorIndex == 0) {
        slides_css[activeSlide].css = textarea.value;
    }
    if (editorIndex == 1) {
        slide_html = textarea.value;
        const iframe = document.getElementById("container");
        const preview = (iframe.contentDocument ||
            ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
        preview.body.innerHTML = slide_html;
    }
    if (editorIndex == 2) {
        slide_js = textarea.value;
    }
    setSlide(activeSlide);
}
function adjustLineNumber() {
    const numberOfLines = textarea.value.split("\n").length;
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
    highlighting_content.classList.remove("language-css");
    highlighting_content.classList.remove("language-html");
    highlighting_content.classList.remove("language-js");
    editorIndex = view;
    if (view == 0) {
        textarea.value = slides_css[activeSlide].css;
        highlighting_content.classList.add("language-css");
    }
    if (view == 1) {
        textarea.value = slide_html;
        highlighting_content.classList.add("language-html");
    }
    if (view == 2) {
        textarea.value = slide_js;
        highlighting_content.classList.add("language-js");
    }
    adjustTextArea();
    adjustLineNumber();
    updateiFrames();
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
<div class="slide_card" id="slide-${slides_css.length}">
    <div class="left">${slides_css.length}</div>
    <div class="right">
        <iframe id="container-${slides_css.length}" name="preview-${slides_css.length}">
        </iframe>
    </div>
    <div class="card_cover" onclick="selectSlide(${slides_css.length}); updateCode();"></div>
</div>
    `;
    const slide = {
        css: "",
    };
    slides_css.push(slide);
    selectSlide(slides_css.length - 1);
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
<div class="slide_card" id="slide-${index}">
    <div class="left">${index}</div>
    <div class="right">
        <iframe id="container-${index}" name="preview-${index}">
        </iframe>
    </div>
    <div class="card_cover" onclick="selectSlide(${index}); updateCode();"></div>
</div>
      `;
    });
    selectSlide(activeSlide - 1);
}
function getSlides() {
    return slides_css;
}
var scale = 1;
preview_cover.addEventListener("wheel", (event) => {
    const iframe = document.getElementById("container");
    const scrollAmt = event.deltaY / 2500;
    if (scale - scrollAmt < 0.05 || scale - scrollAmt > 8) {
        return;
    }
    scale -= scrollAmt;
    iframe.style.transition = "100ms";
    iframe.style.transform = `scale(${scale})`;
    setTimeout(() => {
        iframe.style.transition = "0ms";
    }, 110);
});
var x;
var y;
var xPos;
var yPos;
var isDragging = false;
preview_cover.addEventListener("mousedown", (event) => {
    const iframe = document.getElementById("container");
    x = event.clientX;
    y = event.clientY;
    xPos = iframe.offsetLeft;
    yPos = iframe.offsetTop;
    isDragging = true;
});
preview_cover.addEventListener("mouseup", () => {
    isDragging = false;
});
preview_cover.addEventListener("mouseout", () => {
    isDragging = false;
});
preview_cover.addEventListener("mousemove", (event) => {
    if (isDragging) {
        const iframe = document.getElementById("container");
        const xOffset = xPos + (event.clientX - x);
        const yOffset = yPos + (event.clientY - y);
        iframe.style.left = xOffset + "px";
        iframe.style.top = yOffset + "px";
    }
});
preview_cover.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowLeft":
        case "ArrowUp":
        case "Delete":
            setSlide(activeSlide - 1);
            selectSlide(activeSlide - 1);
            break;
        case "ArrowRight":
        case "ArrowDown":
        case " ":
            setSlide(activeSlide + 1);
            selectSlide(activeSlide + 1);
            break;
    }
});
preview_cover.addEventListener("dblclick", (e) => {
    const iframe = document.getElementById("container");
    if (scale + 1 > 8) {
        return;
    }
    iframe.style.transition = "200ms";
    if (e.shiftKey) {
        scale -= 1;
    }
    else {
        scale += 1;
    }
    iframe.style.transform = `scale(${scale})`;
    setTimeout(() => {
        iframe.style.transition = "";
    }, 200);
});
function updateiFrames() {
    var _a;
    for (var i = 0; i < slides_css.length; i++) {
        const iframe = document.getElementById("container-" + i);
        const preview = (iframe.contentDocument ||
            ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
        preview.body.innerHTML = slide_html;
        for (var j = 0; j <= i; j++) {
            const style = preview.createElement("style");
            style.setAttribute("id", "slideNum-" + j);
            style.innerHTML = slides_css[j].css;
            preview.body.appendChild(style);
        }
    }
}
function importSlides() {
    download_popup.style.transform = "scale(0)";
    download_popup.style.opacity = "0";
    upload_popup.style.transform = "scale(1)";
    upload_popup.style.opacity = "1";
}
function exportSlides() {
    download_popup.style.transform = "scale(1)";
    download_popup.style.opacity = "1";
    upload_popup.style.transform = "scale(0)";
    upload_popup.style.opacity = "0";
}
function importAction() {
    var slidesJSONinput = JSON.parse(import_in.value);
    slide_html = slidesJSONinput.html;
    slide_js = slidesJSONinput.js;
    display_list.innerHTML = "";
    slides_css = [];
    slidesJSONinput.css.forEach((element) => {
        display_list.innerHTML += `
<div class="slide_card" id="slide-${slides_css.length}">
    <div class="left">${slides_css.length}</div>
    <div class="right">
        <iframe id="container-${slides_css.length}" name="preview-${slides_css.length}">
        </iframe>
    </div>
    <div class="card_cover" onclick="selectSlide(${slides_css.length}); updateCode();"></div>
</div>
    `;
        const slide = {
            css: element,
        };
        slides_css.push(slide);
    });
    selectSlide(0);
    hidePopups();
}
function copyAction() {
    navigator.clipboard.writeText("Hello World");
}
function hidePopups() {
    download_popup.style.opacity = "0";
    upload_popup.style.opacity = "0";
    setTimeout(() => {
        download_popup.style.transform = "scale(0)";
        upload_popup.style.transform = "scale(0)";
    }, 250);
    download_popup.classList.remove("showing");
    upload_popup.classList.remove("showing");
}
setInterval(() => {
    updateiFrames();
}, 5000);
document.addEventListener("DOMContentLoaded", () => {
    addSlide();
});
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        event.stopPropagation();
    }
});
