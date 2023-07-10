const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");

const tabList = [css, html, js];

const display_list = document.getElementById("display_list") as HTMLElement;
const preview_cover = document.getElementById("preview_cover") as HTMLElement;

const textarea = document.getElementById("text_editor") as HTMLTextAreaElement;
const lineNumbers = document.getElementById("line_numbers") as HTMLElement;

textarea?.addEventListener("keyup", () => {
  adjustTextArea();
  adjustLineNumber();
});

textarea?.addEventListener("keydown", () => {
  adjustTextArea();
  adjustLineNumber();
});

function adjustTextArea() {
  const numberOfLines = textarea.value?.split("\n").length;

  textarea.style.height = (numberOfLines * 20 + 20).toString() + "px";

  if (editorIndex == 0) {
    slides_css[activeSlide].css = textarea.value;
  }

  if (editorIndex == 1) {
    slide_html = textarea.value;

    const iframe = document.getElementById("container") as HTMLIFrameElement;
    const preview = (iframe?.contentDocument ||
      iframe?.contentWindow?.document) as Document;

    preview.body.innerHTML = slide_html;
  }

  if (editorIndex == 2) {
    slide_js = textarea.value;
  }

  setSlide(activeSlide);
}

function adjustLineNumber() {
  const numberOfLines = textarea.value?.split("\n").length;
  lineNumbers.innerHTML = Array(numberOfLines).fill("<span></span>").join("");
}

var slide_html: string = "";
var slide_js: string = "";

type Slide = {
  css: string;
};

var slides_css: Slide[] = [];
var editorIndex: number = 0;

function switchView(view: number) {
  css?.classList.remove("active");
  html?.classList.remove("active");
  js?.classList.remove("active");

  tabList[view]?.classList.add("active");

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

var activeSlide: number = 0;

function selectSlide(slideIndex: number) {
  if (slideIndex >= slides_css.length || slideIndex < 0) {
    return;
  }

  const slides = document.getElementsByClassName("slide_card");

  slides[activeSlide]?.classList.remove("active");
  slides[slideIndex]?.classList.add("active");

  activeSlide = slideIndex;

  switchView(editorIndex);
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

  const slide: Slide = {
    css: "",
  };

  slides_css.push(slide);

  selectSlide(slides_css?.length - 1);
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

  selectSlide(activeSlide - 1);
}

function getSlides() {
  return slides_css;
}

var scale: number = 1;

preview_cover?.addEventListener("wheel", (event) => {
  const iframe = document.getElementById("container") as HTMLIFrameElement;

  const scrollAmt = event?.deltaY / 5000;

  if (scale - scrollAmt < 0.05 || scale - scrollAmt > 8) {
    return;
  }

  scale -= scrollAmt;
  iframe.style.transform = `scale(${scale})`;
});

var x: number;
var y: number;
var xPos: number;
var yPos: number;
var isDragging: boolean = false;

preview_cover?.addEventListener("mousedown", (event) => {
  const iframe = document.getElementById("container") as HTMLIFrameElement;

  x = event.clientX;
  y = event.clientY;
  xPos = iframe.offsetLeft;
  yPos = iframe.offsetTop;

  isDragging = true;
});

preview_cover?.addEventListener("mouseup", () => {
  isDragging = false;
});

preview_cover?.addEventListener("mouseout", () => {
  isDragging = false;
});

preview_cover?.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const iframe = document.getElementById("container") as HTMLIFrameElement;

    const xOffset = xPos + (event.clientX - x);
    const yOffset = yPos + (event.clientY - y);

    iframe.style.left = xOffset + "px";
    iframe.style.top = yOffset + "px";
  }
});

preview_cover?.addEventListener("keydown", (event) => {
  console.log(event.key);
  if (event.key === "ArrowLeft") {
    setSlide(activeSlide - 1);
    selectSlide(activeSlide - 1);
  }

  if (event.key === "ArrowRight" || event.key === "Space") {
    setSlide(activeSlide + 1);
    selectSlide(activeSlide + 1);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  addSlide();
});

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && (event.key === "s" || event.key === "S")) {
    event.preventDefault();
    event.stopPropagation();
  }
});
