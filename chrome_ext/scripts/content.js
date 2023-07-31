var photonslides = (async function () {
    console.log("We're in - Photon Slides Assistant");

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message === "query") {
                sendResponse(document.getElementById("json_export_out").value);
            } else if (request.message === "import") {
                document.getElementById("import_in").value = request.value;

                document.getElementById("import_button").click();
            }
        }
    );

});

photonslides();