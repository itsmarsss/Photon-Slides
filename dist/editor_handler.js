"use strict";
document.addEventListener("keydown", () => {
    setSlide(activeSlide + 1);
});
function setSlide(index) {
    var _a, _b, _c, _d, _e;
    const slides_css = getSlides();
    if (index >= slides_css.length || index < 0) {
        return;
    }
    const iframe = document.getElementById("container");
    const preview = ((iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) ||
        ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document));
    if (index > activeSlide) {
        for (var i = index + 1; i <= activeSlide; i++) {
            const style = preview.createElement("style");
            style.setAttribute("id", "slideNum-" + i);
            style.innerHTML = slides_css[i].css;
            (_b = preview === null || preview === void 0 ? void 0 : preview.body) === null || _b === void 0 ? void 0 : _b.appendChild(style);
        }
    }
    if (index < activeSlide) {
        for (var i = activeSlide; i < index; i++) {
            const slide = preview.getElementById("slideNum-" + i);
            (_c = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(slide);
        }
    }
    if (index == activeSlide) {
        const slide = preview.getElementById("slideNum-" + index);
        (_d = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _d === void 0 ? void 0 : _d.removeChild(slide);
        const style = preview.createElement("style");
        style.setAttribute("id", "slideNum-" + index);
        style.innerHTML = slides_css[index].css;
        (_e = preview === null || preview === void 0 ? void 0 : preview.body) === null || _e === void 0 ? void 0 : _e.appendChild(style);
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
