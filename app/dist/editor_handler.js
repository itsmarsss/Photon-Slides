"use strict";
function setSlide(index) {
    var _a, _b;
    if (index >= slides_css.length || index < 0) {
        return;
    }
    const iframe = document.getElementById("container");
    const preview = (iframe.contentDocument ||
        ((_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
    for (var i = 0; i < slides_css.length; i++) {
        const slide = preview.getElementById("slideNum-" + i);
        (_b = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(slide);
    }
    for (var i = 0; i <= index; i++) {
        const style = preview.createElement("style");
        style.setAttribute("id", "slideNum-" + i);
        style.innerHTML = slides_css[i].css;
        preview.body.appendChild(style);
    }
}
function left() {
    setSlide(activeSlide - 1);
    selectSlide(activeSlide - 1);
}
function right() {
    setSlide(activeSlide + 1);
    selectSlide(activeSlide + 1);
}
