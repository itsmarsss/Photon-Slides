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

document.getElementById("cloud_new").addEventListener("mouseup", () => {
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
    cloud_list.innerHTML = `<div class="slide">${JSON.parse(slides).name} </div>` + cloud_list.innerHTML;

    document.getElementById("cloud_new").addEventListener("mousedown", () => {
        showSlideSource();
    });
}

function newLocal(slides) {
    local_list.innerHTML = `<div class="slide">${JSON.parse(slides).name}</div>` + local_list.innerHTML;

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