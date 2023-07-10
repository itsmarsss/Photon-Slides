"use strict";
function setSlide(index) {
    var _a, _b, _c;
    const slides_css = getSlides();
    if (index >= slides_css.length || index < 0) {
        return;
    }
    const iframe = document.getElementById("container");
    const preview = ((iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) ||
        ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
    for (var i = 0; i < slides_css.length; i++) {
        const slide = preview.getElementById("slideNum-" + i);
        (_b = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(slide);
    }
    for (var i = 0; i <= index; i++) {
        const style = preview.createElement("style");
        style.setAttribute("id", "slideNum-" + i);
        style.innerHTML = slides_css[i].css;
        (_c = preview === null || preview === void 0 ? void 0 : preview.body) === null || _c === void 0 ? void 0 : _c.appendChild(style);
    }
}
// var reader = new XMLHttpRequest() || new ActiveXObject("MSXML2.XMLHTTP");
// function loadFile(url: URL) {
//   reader.open("GET", url, true);
//   reader.onreadystatechange = displayContents;
//   reader.send(null);
// }
// function displayContents() {
//   if (reader.readyState == 4) {
//     console.log(reader.responseText);
//   }
// }
