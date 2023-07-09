var slideNum = 0;

document.addEventListener("keydown", jumpNext);

function jumpNext() {
    const slides_css = window.parent.getSlides();

    if (slideNum >= slides_css.length) {
        return;
    }

    const style = document.createElement("style");

    style.setAttribute("id", "slideNum-" + slideNum);

    style.innerHTML = slides_css[slideNum].css;

    document.body.appendChild(style);

    slideNum++;
}