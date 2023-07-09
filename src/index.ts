const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");

const tabList = [css, html, js];

function switchView(view: number) {
  css?.classList.remove("active");
  html?.classList.remove("active");
  js?.classList.remove("active");

  tabList[view]?.classList.add("active");
}
