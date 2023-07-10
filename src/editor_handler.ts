function setSlide(index: number) {
  const slides_css = getSlides();

  if (index >= slides_css.length || index < 0) {
    return;
  }

  const iframe = document.getElementById("container") as HTMLIFrameElement;
  const preview = (iframe?.contentDocument ||
    iframe?.contentWindow?.document) as Document;

  for (var i = 0; i < slides_css.length; i++) {
    const slide = preview.getElementById("slideNum-" + i);
    slide?.parentNode?.removeChild(slide);
  }

  for (var i = 0; i <= index; i++) {
    const style = preview.createElement("style");
    style.setAttribute("id", "slideNum-" + i);
    style.innerHTML = slides_css[i].css;

    preview?.body?.appendChild(style);
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
