const manifest = chrome.runtime.getManifest();

var local_slides = new Map();
var cloud_slides = new Map();

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

const slide_edit = document.getElementById("slide_edit");

document.getElementById("cloud_new").addEventListener("click", () => {
    location_select.value = "cloud";
    showSlideSource();
});

document.getElementById("local_new").addEventListener("click", () => {
    location_select.value = "local";
    showSlideSource();
});

document.getElementById("cancel_new").addEventListener("click", () => {
    hideSlideSource();
});

document.getElementById("cancel_edit").addEventListener("click", () => {
    hideSlideEdit();
});

document.getElementById("manual_button").addEventListener("click", () => {
    if (location_select.value === "cloud") {
        newEntry(cloud_list, response);
    } else {
        newEntry(local_list, response);
    }

    hideSlideSource();
});

document.getElementById("website_button").addEventListener("click", () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "query" }, function (response) {
            if (location_select.value === "cloud") {
                newEntry("cloud", response);
            } else {
                newEntry("local", response);
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

function showSlideEdit() {
    slide_edit.style.opacity = "1";
    slide_edit.style.transform = "scale(1)";
}

function hideSlideEdit() {
    slide_edit.style.opacity = "0";
    slide_edit.style.transform = "scale(0)";
}

function newEntry(location, slides) {
    var jsonSlides = JSON.parse(slides);

    var id = "container-" + Date.now();

    var element;

    if (location === "cloud") {
        element = cloud_list;
        cloud_slides.set(id, jsonSlides);
    } else {
        element = local_list;
        local_slides.set(id, jsonSlides);
    }


    element.innerHTML = `<div class="slide" id="${id}-cont">
    <span class="title">&nbsp${atob(jsonSlides.name)}</span>
    <iframe style="${atob(jsonSlides.iframe)
            .split("\n")
            .join("")}" id="${id}" class="container"></iframe>
    <div class="iframe_cover" data-id="${id}"></div>
    </div>` + element.innerHTML;

    const iframe = document.getElementById(id);

    iframe.style.transform = `scaleX(${160 / iframe.offsetWidth}) scaleY(${90 / iframe.offsetHeight})`;


    rerenderSlides();

    document.getElementById("cloud_new").addEventListener("click", () => {
        location_select.value = "cloud";
        showSlideSource();
    });

    document.getElementById("local_new").addEventListener("click", () => {
        location_select.value = "local";
        showSlideSource();
    });
}

function rerenderSlides() {
    cloud_slides.forEach((value, key) => {
        addPreview(value, key);
    });

    local_slides.forEach((value, key) => {
        addPreview(value, key);
    });


    Array.prototype.forEach.call(document.getElementsByClassName("iframe_cover"), (element) => {
        element.addEventListener("click", (event) => {
            const id = element.getAttribute("data-id");
            showSlideEdit();
        });
    });
}

function addPreview(jsonSlides, id) {
    const iframe = document.getElementById(id);
    const preview = iframe.contentWindow.document;

    preview.body.innerHTML = atob(jsonSlides.html);

    const style = preview.createElement("style");
    style.innerHTML = atob(jsonSlides.css[0].css);
    preview.body.appendChild(style);
}

async function setSlides() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "import", "value": "heehee" }, function (response) {
            console.log(response);
        });
    });
} 