var slideNum = 0;

document.addEventListener("keydown", () => {
  setSlide(slideNum + 1);
});

function setSlide(index: number) {
  const slides_css = getSlides();

  if (index >= slides_css.length || index < 0) {
    return;
  }

  if (index > slideNum) {
    for (var i = index + 1; i <= slideNum; i++) {
      const style = document.createElement("style");

      style.setAttribute("id", "slideNum-" + i);

      style.innerHTML = slides_css[i].css;

      document.body.appendChild(style);
    }
  }

  if (index < slideNum) {
    for (var i = slideNum; i < index; i++) {
      const slide = document.getElementById("slideNum-" + i);
      slide?.parentNode?.removeChild(slide);
    }
  }

  slideNum = index;
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
