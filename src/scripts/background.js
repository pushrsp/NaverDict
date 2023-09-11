const URL = "https://dic.daum.net/search.do?q=";
/ /
chrome.runtime.onMessage.addListener(function({text}, sender, sendResponse) {
    fetch(URL + text, {method: "GET", headers: {"Content-Type":"text/html;charset=utf-8"}}).then(function(response) {
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
