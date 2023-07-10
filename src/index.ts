const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");

const tabList = [css, html, js];

const display_list = document.getElementById("display_list") as HTMLElement;
const slide_preview = document.getElementById("slide_preview") as HTMLElement;

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

slide_preview?.addEventListener("mousedown", function () {
  setSlide(activeSlide + 1);

  selectSlide(activeSlide + 1);
});

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

slide_preview.addEventListener("wheel", (event) => {
  const iframe = document.getElementById("container") as HTMLIFrameElement;

  const scrollAmt = event?.deltaY / 5000;

  if (scale + scrollAmt < 0.05) {
    return;
  }

  scale += scrollAmt;
  iframe.style.transform = `scale(${scale})`;
});

var x: number;
var y: number;
var isDragging: boolean = false;

slide_preview.addEventListener("mousedown", (event) => {
  x = event.clientX;
  y = event.clientY;

  isDragging = true;
});

slide_preview.addEventListener("mouseup", () => {
  isDragging = false;
});

slide_preview.addEventListener("mousemove", (event) => {
  if (isDragging) {
    const xOffset = event.clientX - x;
    const yOffset = event.clientY - y;
    const iframe = document.getElementById("container") as HTMLIFrameElement;

    iframe.style.top = yOffset + "px";
    iframe.style.left = xOffset + "px";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  addSlide();
});
