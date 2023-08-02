const manifest = chrome.runtime.getManifest();

var local_slides = new Map();
var cloud_slides = new Map();

var currentLocation;
var currentID;

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
const new_name = document.getElementById("new_name");
const slide_JSON = document.getElementById("slide_JSON");

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
    newEntry(manual_textarea.value);

    hideSlideSource();
});

document.getElementById("website_button").addEventListener("click", () => {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "query" }, function (response) {
            newEntry(response);

            hideSlideSource();
        });
    });
});

document.getElementById("ok_button").addEventListener("click", () => {
    if (new_name.value.split(" ").join("").length == 0) {
        new_name.value = "Untitled Photon Slide";
    }

    if (currentLocation === "cloud") {
        cloud_slides.get(currentID).name = btoa(new_name.value);
        setStorageCloud();
    } else {
        local_slides.get(currentID).name = btoa(new_name.value);
        setStorageLocal();
    }

    document.getElementById(currentID + "-name").innerHTML = escapeHtml(new_name.value);

    sendNotification("Update slide name");

});

document.getElementById("import_slides").addEventListener("click", () => {
    var slidesJSON;

    if (currentLocation === "cloud") {
        slidesJSON = JSON.stringify(cloud_slides.get(currentID));
    } else {
        slidesJSON = JSON.stringify(local_slides.get(currentID));
    }

    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "import", "value": slidesJSON }, function (response) {
            console.log(response);
            if (response === undefined) {
                sendNotification("Sending you to Photon Slides");
                window.open(`https://itsmarsss.github.io/Photon-Slides/app/?&data=${btoa(slidesJSON)}`, "_blank");
            } else {
                sendNotification("Successfully imported slide into Photon Slides");
            }
        });
    });
});

document.getElementById("delete_slides").addEventListener("click", () => {
    if (currentLocation === "cloud") {
        cloud_slides.delete(currentID);
        setStorageCloud();
    } else {
        local_slides.delete(currentID);
        setStorageLocal();
    }

    var elem = document.getElementById(currentID + "-cont");
    elem.parentNode.removeChild(elem);

    hideSlideEdit();

    sendNotification(`Selected ${currentLocation} entry deleted`);
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

function newEntry(slides) {
    const jsonSlides = JSON.parse(slides);

    const id = "container-" + Date.now();

    var element;

    if (location_select.value === "cloud") {
        element = cloud_list;
        cloud_slides.set(id, jsonSlides);
        setStorageCloud();
    } else {
        element = local_list;
        local_slides.set(id, jsonSlides);
        setStorageLocal();
    }

    element.innerHTML = `<div class="slide" id="${id}-cont">
    <span class="title" id="${id}-name">&nbsp${atob(jsonSlides.name)}</span>
    <iframe style="${atob(jsonSlides.iframe)
            .split("\n")
            .join("")}" id="${id}" class="container"></iframe>
    <div class="iframe_cover" data-id="${id}" data-location="${location_select.value}"></div>
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

    sendNotification(`New ${location_select.value} entry added`);
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
            currentID = element.getAttribute("data-id");
            currentLocation = element.getAttribute("data-location");

            var slideJSON;

            if (currentLocation === "cloud") {
                slideJSON = cloud_slides.get(currentID);
            } else {
                slideJSON = local_slides.get(currentID);
            }

            new_name.value = atob(slideJSON.name);
            slide_JSON.value = JSON.stringify(slideJSON, null, "   ");

            const iframe = document.getElementById("throwaway_joke");
            const iframe_style = document.getElementById("parent_of_joke");

            iframe_style.innerHTML = `#throwaway_joke {${atob(slideJSON.iframe)}}`;

            const preview = iframe.contentWindow.document;

            preview.body.innerHTML = atob(slideJSON.html);

            const style = preview.createElement("style");
            style.innerHTML = atob(slideJSON.css[0].css);
            preview.body.appendChild(style);

            iframe.style.transform = `scaleX(${240 / iframe.offsetWidth}) scaleY(${135 / iframe.offsetHeight})`;

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

async function sendNotification(text) {
    const id = Date.now();
    const notif = document.createElement("div");
    notif.setAttribute("class", "notif");
    notif.setAttribute("id", id);
    notif.setAttribute("style", "transition: 200ms;")
    notif.innerHTML = text;
    document.body.appendChild(notif);

    notif.style.opacity = "1";
    notif.style.transform = "scale(1)";

    setTimeout(() => {
        notif.style.opacity = "0";
        notif.style.transform = "scale(0)";
    }, 1000)
}

function setStorageLocal() {
    var local_array = [];

    local_slides.forEach((value, key) => {
        local_array.push(value);
    });

    chrome.storage.local.set({ local: btoa(JSON.stringify(local_array)) }, function () {
        console.log("Local slides setted");
    });
}

function getStorageLocal() {
    chrome.storage.local.get(["local"], function (result) {
        var local_array = JSON.parse(atob(result.local));

        local_array.forEach((slide) => {
            location_select.value = "local";
            newEntry(JSON.stringify(slide));
        });
    });
}

function setStorageCloud() {
    var cloud_array = [];

    cloud_slides.forEach((value, key) => {
        cloud_array.push(value);
    });

    chrome.storage.sync.set({ cloud: btoa(JSON.stringify(cloud_array)) }, function () {
        console.log("Cloud slides setted");
    });
}

function getStorageCloud() {
    chrome.storage.sync.get(["cloud"], function (result) {
        var cloud_array = JSON.parse(atob(result.cloud));

        cloud_array.forEach((slide) => {
            location_select.value = "cloud";
            newEntry(JSON.stringify(slide));
        });
    });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "\"")
        .replace(/'/g, "'");
}

getStorageLocal();
getStorageCloud();

setTimeout(() => {
    sendNotification("Extension Loaded!");
}, 100);