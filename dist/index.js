"use strict";
const css = document.getElementById("tab_css");
const html = document.getElementById("tab_html");
const js = document.getElementById("tab_js");
const tabList = [css, html, js];
function switchView(view) {
    var _a;
    css === null || css === void 0 ? void 0 : css.classList.remove("active");
    html === null || html === void 0 ? void 0 : html.classList.remove("active");
    js === null || js === void 0 ? void 0 : js.classList.remove("active");
    (_a = tabList[view]) === null || _a === void 0 ? void 0 : _a.classList.add("active");
}
