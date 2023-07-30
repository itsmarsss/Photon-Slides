var photonslides = (async function () {
    console.log("We're in - Photon Slides Assistant");

    setInterval(function () {
        console.log(slides_css);
    }, 100);

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.message === "query") {
                console.log("got it");
                sendResponse("yup");
            }
        }
    );

});

photonslides();