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

document.getElementById("cloud_new").addEventListener("mouseup", () => {
    newCloud();
});

function newCloud() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "query" }, function (response) {
            cloud_list.innerHTML = `<div class="slide">
            ${JSON.parse(response).name}
            </div>` + cloud_list.innerHTML;

            document.getElementById("cloud_new").addEventListener("mousedown", () => {
                newCloud();
            });
        });
    });
}

document.getElementById("local_new").addEventListener("click", () => {
    newLocal();
});

function newLocal() {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { "message": "query" }, function (response) {
            local_list.innerHTML = `<div class="slide">${JSON.parse(response).name}</div>` + local_list.innerHTML;

            document.getElementById("local_new").addEventListener("click", () => {
                newLocal();
            });
        });
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