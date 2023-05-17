function GetResult(text) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({text}, response => {
            const [result, error] = response;

            if(result === null)
                reject(error);
            else
                resolve(result);
        })
    })
}

function SetData(dom) {
    const result = dom.getElementsByClassName("dic_search_result").item(0);
    const body = result.children.item(1);
    const content = body.innerHTML.split("<br>");

    const div = document.createElement("div");
    div.className = "Naver-Dict-Popup-Body";

    for(let i = 0; i < content.length; i++) {
        const data = document.createElement("div");
        data.className = "Naver-Dict-Popup-Body-Data";
        data.innerHTML = content[i];

        div.append(data);
    }

    return div;
}

async function onClickSearchButton() {
    const input = document.getElementById("Naver-Dict-word-input");
    if(input.value.length === 0)
        return;

    const response = await GetResult(input.value);
    const parser = new DOMParser();
    const dom = parser.parseFromString(response.body, "text/html");

    if(dom.getElementById("notfound"))
        return;

    const body = document.getElementById("Naver-Dict-Popup-Body");
    if(body.children.length > 0) {
        for(let i = 0; i < body.children.length; i++)
            body.removeChild(body.children.item(i));
    }

    body.append(SetData(dom));
}

document.getElementById("Naver-Dict-word-button").addEventListener("click", onClickSearchButton);
