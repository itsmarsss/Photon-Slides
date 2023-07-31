const manifest = chrome.runtime.getManifest();

document.getElementById("title").innerHTML += `v${manifest.version}`;

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": "import", "value": "heehee" }, function (response) {
        console.log(response);
    });
});

Array.prototype.forEach.call(document.getElementsByClassName("scroll"), (element) => {
    element.addEventListener("wheel", (event) => {
        event.preventDefault();
        event.stopPropagation();
        element.scrollLeft += event.deltaY;
    });
});

document.getElementById("cloud_new").addEventListener("click", () => {

});
document.getElementById("local_new").addEventListener("click", () => {

});