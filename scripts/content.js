const EngRegex = /^[a-z|A-Z]+$/

const Offset = { Y: 100, X: 40, OverflowY: 30 };
const Width = 250;
const Height = 200;
const PopupId = "Naver-Dict-Popup";

function GetSize(e) {
    let top = e.screenY + document.querySelector('html').scrollTop - Offset.Y;
    let left = e.screenX - Offset.X;

    if(e.screenY + Height >= screen.availHeight)
        top -= Height + Offset.OverflowY;

    return [top, left];
}

function GetPopup(top, left, dom) {
    const parent = document.createElement("div");
    parent.id = PopupId;
    parent.className = "tooltip";
    parent.style.cssText = `top:${top}px;left:${left}px;margin-left:-60px;`;

    const result = dom.getElementsByClassName("dic_search_result").item(0);
    for(let i = 0; i < result.childElementCount; i++) {
        if(result.children.item(i).tagName !== "DD")
            continue;

        const content = document.createElement("div");
        content.innerHTML = result.children.item(i).innerHTML;
        content.className = "tooltip-text";

        parent.appendChild(content);
    }
    return parent;
}

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

async function OnMouseUp(event) {
    const selection = window.getSelection();
    if(selection.rangeCount <= 0)
        return;

    const text = selection.getRangeAt(0).cloneContents().textContent.trim();
    if(!EngRegex.test(text))
        return;

    const result = await GetResult(text);
    const parser = new DOMParser();
    const dom = parser.parseFromString(result.body, "text/html");

    if(dom.getElementById("notfound"))
        return;

    const [top, left] = GetSize(event);
    document.body.appendChild(GetPopup(top, left, dom));
}

function OnClick(event) {
    const popup = document.getElementById(PopupId);
    //popup 이 없는 경우
    if(popup === null)
        return;

    //현재 클릭한 마우스 좌표 X가 popup 좌표에 속하는 경우
    if(popup.getBoundingClientRect().x <= event.screenX && event.screenX <= popup.getBoundingClientRect().x + Width)
        return;

    popup.remove();
}

function Init() {
    document.onmouseup = OnMouseUp;
    document.onclick = OnClick;
}

window.onload = Init;
