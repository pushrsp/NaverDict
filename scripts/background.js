const URL = "https://dict.naver.com/search.dict?dicQuery=";

chrome.runtime.onMessage.addListener(function({text}, sender, sendResponse) {
    fetch(URL + text, {method: "GET", headers: {"Content-Type":"text/html"}}).then(function(response) {
        return response.text().then(function(text) {
            sendResponse([{
                body: text,
                status: response.status,
                statusText: response.statusText,
            }, null]);
        });
    }, function(error) {
        sendResponse([null, error]);
    });

    return true;
});
