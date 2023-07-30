const manifest = chrome.runtime.getManifest();

document.getElementById("title").innerHTML += `v${manifest.version}`;

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": "start" }, function (response) {
        console.log(response);
    });
});