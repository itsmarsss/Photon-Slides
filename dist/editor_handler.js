"use strict";
document.addEventListener("keydown", () => {
    setSlide(activeSlide + 1);
});
function setSlide(index) {
    var _a, _b;
    const slides_css = getSlides();
    if (index >= slides_css.length || index < 0) {
        return;
    }
    if (index > activeSlide) {
        for (var i = index + 1; i <= activeSlide; i++) {
            const style = preview.createElement("style");
            style.setAttribute("id", "slideNum-" + i);
            style.innerHTML = slides_css[i].css;
            preview.body.appendChild(style);
        }
    }
    if (index < activeSlide) {
        for (var i = activeSlide; i < index; i++) {
            const slide = preview.getElementById("slideNum-" + i);
            (_a = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(slide);
        }
    }
    if (index == activeSlide) {
        const slide = preview.getElementById("slideNum-" + index);
        (_b = slide === null || slide === void 0 ? void 0 : slide.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(slide);
        const style = preview.createElement("style");
        style.setAttribute("id", "slideNum-" + index);
        style.innerHTML = slides_css[index].css;
        preview.body.appendChild(style);
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
