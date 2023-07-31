const manifest = chrome.runtime.getManifest();

document.getElementById("title").innerHTML += `v${manifest.version}`;

Array.prototype.forEach.call(document.getElementsByClassName("scroll"), (element) => {
    element.addEventListener("wheel", (event) => {
        event.preventDefault();
        event.stopPropagation();
        element.scrollLeft += event.deltaY;
    });
});

const cloud_list = document.getElementById("cloud_list");
const local_list = document.getElementById("local_list");

const slide_source = document.getElementById("slide_source");
const manual_textarea = document.getElementById("manual");
const location_select = document.getElementById("location_select");

document.getElementById("cloud_new").addEventListener("click", () => {
    showSlideSource();
});

document.getElementById("local_new").addEventListener("click", () => {
    showSlideSource();
});

document.getElementById("cancel_new").addEventListener("click", () => {
    hideSlideSource();
});

document.getElementById("manual_button").addEventListener("click", () => {
    if (location_select.value === "cloud") {
        newCloud(manual_textarea.value);
    } else {
        newLocal(manual_textarea.value);
    }

    hideSlideSource();
});

document.getElementById("website_button").addEventListener("click", () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "query" }, function (response) {
            if (location_select.value === "cloud") {
                newCloud(response);
            } else {
                newLocal(response);
            }

            hideSlideSource();
        });
    });
});

function showSlideSource() {
    slide_source.style.opacity = "1";
    slide_source.style.transform = "scale(1)";
}

function hideSlideSource() {
    slide_source.style.opacity = "0";
    slide_source.style.transform = "scale(0)";
}

function newCloud(slides) {
    var jsonSlides = JSON.parse(slides);

    var id = "container-" + Date.now();

    cloud_list.innerHTML = `<div class="slide">
    <span class="title">&nbsp${atob(jsonSlides.name)}</span>
    <iframe style="${atob(jsonSlides.iframe)
            .split("\n")
            .join("")}" id="${id}" class="container"></iframe>
    <div class="iframe_cover" data-iframe="${id}"></div>
    </div>` + cloud_list.innerHTML;

    const iframe = document.getElementById(id);
    const preview = iframe.contentWindow.document;

    iframe.style.transform = `scaleX(${160 / iframe.offsetWidth}) scaleY(${90 / iframe.offsetHeight})`;

    preview.body.innerHTML = atob(jsonSlides.html);

    const style = preview.createElement("style");
    style.innerHTML = atob(jsonSlides.css[0].css);
    preview.body.appendChild(style);

    document.getElementById("cloud_new").addEventListener("mousedown", () => {
        showSlideSource();
    });
}

function newLocal(slides) {
    local_list.innerHTML = `<div class="slide">
    <span class="title">${JSON.parse(slides).name}</span>
    </div>` + local_list.innerHTML;

    document.getElementById("local_new").addEventListener("click", () => {
        showSlideSource();
    });
}

async function setSlides() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "import", "value": "heehee" }, function (response) {
            console.log(response);
        });
    });
} 