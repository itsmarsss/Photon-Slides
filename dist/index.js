"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const notes = document.getElementById("tab_notes");
const tabList = [css, html, notes];
const slide_name = document.getElementById("slide_name");
const display_list = document.getElementById("display_list");
const preview_cover = document.getElementById("preview_cover");
const textarea = document.getElementById("text_editor");
const highlighting = document.getElementById("highlighting");
const highlighting_content = document.getElementById("highlighting_content");
const lineNumbers = document.getElementById("line_numbers");
const download_popup = document.getElementById("download");
const upload_popup = document.getElementById("upload");
const import_in = document.getElementById("import_in");
const json_out = document.getElementById("json_export_out");
const embed_out = document.getElementById("embed_export_out");
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
        slides_css[activeSlide].notes = textarea.value;
    }
    setSlide(activeSlide);
}
function adjustLineNumber() {
    const numberOfLines = textarea.value.split("\n").length;
    lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
}
var slide_html = "";
var slides_css = [];
var editorIndex = 0;
function switchView(view) {
    var _a;
    css === null || css === void 0 ? void 0 : css.classList.remove("active");
    html === null || html === void 0 ? void 0 : html.classList.remove("active");
    notes === null || notes === void 0 ? void 0 : notes.classList.remove("active");
    (_a = tabList[view]) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    highlighting_content.classList.remove("language-css");
    highlighting_content.classList.remove("language-html");
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
        textarea.value = slides_css[activeSlide].notes;
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
function displayListAppend(index) {
    display_list.innerHTML += `
<div class="slide_card" id="slide-${index}">
    <div class="left">${index}</div>
    <div class="right">
        <iframe id="container-${index}" class="container" name="preview-${index}">
        </iframe>
    </div>
    <div class="card_cover" onclick="selectSlide(${index}); updateCode();"></div>
</div>
    `;
}
function addSlide() {
    displayListAppend(slides_css.length);
    const slide = {
        css: "",
        notes: "",
    };
    slides_css.push(slide);
    selectSlide(slides_css.length - 1);
    highlighting_content.innerHTML = "";
}
function deleteSlide() {
    display_list.innerHTML = "";
    slides_css.splice(activeSlide, 1);
    rerenderSlides();
}
function rerenderSlides() {
    slides_css.forEach((slide, index) => {
        slide = slide;
        displayListAppend(index);
    });
    selectSlide(activeSlide - 1);
}
function getSlides() {
    return slides_css;
}
var scale = 1;
preview_cover.addEventListener("wheel", (event) => {
    const iframe = document.getElementById("container");
    var scrollAmt = event.deltaY / 2500;
    if (event.altKey) {
        scrollAmt /= 5;
    }
    else if (event.shiftKey) {
        scrollAmt *= 5;
    }
    if (scale - scrollAmt < 0.005 || scale - scrollAmt > 8) {
        return;
    }
    scale -= scrollAmt;
    iframe.style.transition = "100ms";
    iframe.style.transform = `scale(${scale})`;
    setTimeout(() => {
        iframe.style.transition = "0ms";
    }, 110);
});
function scaleToFit() {
    const iframe = document.getElementById("container");
    const cover = document.getElementById("preview_cover");
    console.log(iframe.offsetWidth);
    scale = Math.min(cover.offsetWidth / iframe.offsetWidth, cover.offsetHeight / iframe.offsetHeight);
    iframe.style.transition = "100ms";
    iframe.style.transform = `scale(${scale})`;
    setTimeout(() => {
        iframe.style.transition = "0ms";
    }, 110);
}
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
    slide_name.value = atob(slidesJSONinput.name);
    slide_html = atob(slidesJSONinput.html);
    display_list.innerHTML = "";
    slides_css = [];
    slidesJSONinput.css.forEach((element) => {
        displayListAppend(slides_css.length);
        const slide = {
            css: atob(element.css),
            notes: atob(element.notes),
        };
        slides_css.push(slide);
    });
    selectSlide(0);
    hidePopups();
}
function copyJSON() {
    navigator.clipboard.writeText(json_out.value);
    json_out.focus();
    json_out.select();
}
function copyEmbed() {
    navigator.clipboard.writeText(embed_out.value);
    embed_out.focus();
    embed_out.select();
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
setInterval(() => {
    var css = "";
    slides_css.forEach((element) => {
        css += `
      {
        "${btoa(element.css)}",
        "${btoa(element.notes)}"
      }`;
    });
    var json = `{
  "name": "${btoa(slide_name.value)}",
  "html": "${btoa(slide_html)}",
  "css": [${css.slice(0, -1)}
  ]
}`;
    json_out.value = json;
}, 1000);
document.addEventListener("DOMContentLoaded", () => {
    addSlide();
    scaleToFit();
});
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        event.stopPropagation();
    }
});
