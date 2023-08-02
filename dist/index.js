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
const frame_setup = document.getElementById("setup");
const download_popup = document.getElementById("download");
const upload_popup = document.getElementById("upload");
const setup_in = document.getElementById("setup_in");
const import_in = document.getElementById("import_in");
const json_out = document.getElementById("json_export_out");
const embed_out = document.getElementById("embed_export_out");
const iframe_setup = document.getElementById("iframe_setup");
const auto_play = document.getElementById("auto_play");
const slide_length = document.getElementById("slide_length");
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
var iframe_css = `width: 1280px;
height: 720px;
background: #fff;
border: none;`;
var editorIndex = 0;
var scale = 1;
var rotation = 0;
var activeSlide = 0;
var x;
var y;
var xPos;
var yPos;
var isDragging = false;
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
    var _a;
    var elem = document.getElementById("add");
    (_a = elem === null || elem === void 0 ? void 0 : elem.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(elem);
    const iframe = document.getElementById("container");
    display_list.innerHTML += `
<div class="slide_card" id="slide-${index}">
    <div class="left">${index}</div>
    <div class="right">
        <iframe style="transform: scaleX(${220 / iframe.offsetWidth}) scaleY(${120 / iframe.offsetHeight})" id="container-${index}" class="container" name="preview-${index}">
        </iframe>
    </div>
    <div class="card_cover" onclick="selectSlide(${index}); updateCode();"></div>
</div>
    `;
    display_list.innerHTML += `<i class="fa-solid fa-plus" id="add" onclick="addSlide()"></i>`;
}
function addSlide() {
    displayListAppend(slides_css.length);
    const slide = {
        css: "",
        notes: "",
    };
    slides_css.push(slide);
    selectSlide(slides_css.length - 1);
    textarea.dispatchEvent(new Event("input"));
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
function scaleToFit() {
    const iframe = document.getElementById("container");
    const cover = document.getElementById("preview_cover");
    scale = Math.min(cover.offsetWidth / iframe.offsetWidth, cover.offsetHeight / iframe.offsetHeight);
    iframe.style.transition = "100ms";
    iframe.style.transform = `scale(${scale})`;
    iframe.style.left = "";
    iframe.style.top = "";
    setTimeout(() => {
        iframe.style.transition = "0ms";
    }, 110);
}
function scaleTo(percent) {
    const iframe = document.getElementById("container");
    const cover = document.getElementById("preview_cover");
    scale = Math.min(cover.offsetWidth / iframe.offsetWidth, cover.offsetHeight / iframe.offsetHeight);
    iframe.style.transition = "100ms";
    iframe.style.transform = `scale(${scale * (percent / 100)}) rotate(${rotation}deg)`;
    setTimeout(() => {
        iframe.style.transition = "0ms";
    }, 110);
}
function updateiFrames() {
    var _a;
    for (var i = 0; i < slides_css.length; i++) {
        const iframe = document.getElementById("container-" + i);
        iframe.style.transform = `scaleX(${220 / iframe.offsetWidth}) scaleY(${120 / iframe.offsetHeight})`;
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
function frameSetup() {
    frame_setup.style.transform = "scale(1)";
    frame_setup.style.opacity = "1";
    setup_in.value = iframe_css;
}
function importSlides() {
    upload_popup.style.transform = "scale(1)";
    upload_popup.style.opacity = "1";
}
function exportSlides() {
    download_popup.style.transform = "scale(1)";
    download_popup.style.opacity = "1";
}
function updateSetupAction() {
    iframe_css = setup_in.value;
    iframe_setup.innerHTML = `.container {
  ${iframe_css}
}
  `;
    hidePopups();
}
function importAction() {
    var _a;
    var slidesJSONinput = JSON.parse(import_in.value);
    slide_name.value = atob(slidesJSONinput.name);
    slide_html = atob(slidesJSONinput.html);
    setup_in.value = atob(slidesJSONinput.iframe);
    updateSetupAction();
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
    hidePopups();
    selectSlide(0);
    const iframe = document.getElementById("container");
    const preview = (iframe.contentDocument ||
        ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
    preview.body.innerHTML = slide_html;
    textarea.dispatchEvent(new Event("input"));
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
    frame_setup.style.opacity = "0";
    download_popup.style.opacity = "0";
    upload_popup.style.opacity = "0";
    setTimeout(() => {
        frame_setup.style.transform = "scale(0)";
        download_popup.style.transform = "scale(0)";
        upload_popup.style.transform = "scale(0)";
    }, 250);
}
function toggleFullScreen() {
    const iframe = document.getElementById("container");
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    else {
        iframe.requestFullscreen();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    preview_cover.addEventListener("wheel", (event) => {
        const iframe = document.getElementById("container");
        if (event.altKey && event.shiftKey) {
            var rotate;
            if (event.deltaY > 0) {
                rotate = 15;
            }
            else {
                rotate = -15;
            }
            rotation += rotate;
        }
        else {
            var scrollAmt = event.deltaY / 2500;
            if (event.altKey) {
                scrollAmt /= 5;
            }
            else if (event.shiftKey) {
                scrollAmt *= 5;
            }
            if (scale - scrollAmt < 0.005 || scale - scrollAmt > 50) {
                return;
            }
            scale -= scrollAmt;
        }
        iframe.style.transition = "100ms";
        iframe.style.transform = `scale(${scale}) rotate(${rotation}deg`;
        setTimeout(() => {
            iframe.style.transition = "0ms";
            if (rotation >= 360 || rotation <= -360) {
                rotation %= 360;
                iframe.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
            }
        }, 110);
    });
    document.addEventListener("keydown", (event) => {
        if (document.fullscreenElement) {
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
        }
    });
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
        if (e.shiftKey) {
            if (scale - 0.5 < 0) {
                return;
            }
            scale -= 0.5;
        }
        else {
            if (scale + 0.5 > 50) {
                return;
            }
            scale += 0.5;
        }
        iframe.style.transition = "200ms";
        iframe.style.transform = `scale(${scale})`;
        setTimeout(() => {
            iframe.style.transition = "";
        }, 200);
    });
    setInterval(() => {
        updateiFrames();
    }, 5000);
    setInterval(() => {
        var css = "";
        var cssArray = "[";
        slides_css.forEach((element) => {
            css += `
      {
        "css": "${btoa(element.css)}",
        "notes": "${btoa(element.notes)}"
      },`;
            cssArray += `"${btoa(element.css)}",`;
        });
        cssArray = cssArray.slice(0, -1) + "]";
        var json = `{
  "name": "${btoa(slide_name.value.split(" ").join("").length == 0
            ? "Untitled Photon Slide"
            : slide_name.value)}",
  "html": "${btoa(slide_html)}",
  "iframe": "${btoa(iframe_css)}",
  "css": [${css.slice(0, -1)}
  ]
}`;
        json_out.value = json;
        var slideProgression;
        if (auto_play.checked) {
            slideProgression = `setInterval(() => {
      advanceSlide();
    }, ${slide_length.value});`;
        }
        else {
            slideProgression = `document.addEventListener("mousedown", () => {
      advanceSlide();
    });
    document.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "Enter":
        case " ":
          advanceSlide();
      }
    });`;
        }
        var embed = `_____ Place iFrame into your HTML file; make sure to edit <path to Photon Slides [.html]> _____
  
  <iframe style="${iframe_css
            .split("\n")
            .join("")}" src="<path to Photon Slides [.html]>"></iframe>
  

_____ This is your <path to Photon Slides [.html]> content _____
  ${slide_html.split("\n").join("")}
  <style id="styles">
  </style>
  
  <script>
    const slides_css = ${cssArray};
    const styles = document.getElementById("styles");

    var slide_num = 0;
    styles.innerHTML = atob(slides_css[slide_num]);
    
    ${slideProgression}

    function advanceSlide() {
      slide_num++;

        if (slide_num >= slides_css.length) {
          styles.innerHTML= "";
          slide_num = 0
        }
        
        styles.innerHTML += atob(slides_css[slide_num]);
    }
  </script>`;
        embed_out.value = embed;
    }, 1000);
    addSlide();
    scaleToFit();
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get("data");
    if (data != null) {
        import_in.value = atob(data);
        importAction();
    }
});
document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
        event.preventDefault();
        event.stopPropagation();
    }
});
