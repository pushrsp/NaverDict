const EngRegex = /^[a-z|A-Z]+$/

const Offset = { Y: 20, X: 10, OverflowY: 30 };
const Width = 250;
const POPUP_ID = "Naver-Dict-Popup";
const POPUP_CLASS_NAME = "Naver-Dict-tooltip";

function GetSize(e) {
    let top = e.clientY + document.querySelector("html").scrollTop + Offset.Y;
    let left = e.clientX - 180 + document.querySelector('html').scrollLeft

    if (e.clientX - 180 < Offset.X)
        left = Offset.X + document.querySelector('html').scrollLeft;

    if (left + Width > window.width)
        left = window.width - Width - Offset.X;

    return [top, left];
}

function GetTitle(title) {
    const div = document.createElement("div");
    div.className = "Naver-Dict-tooltip-title";

    const text = document.createElement("span");
    text.className = "Naver-Dict-tooltip-title-text";
    text.innerText = title.children.item(0).children.item(0).children.item(0).innerHTML.trim();

    div.appendChild(text);

    const pronoun = title.getElementsByClassName("fnt_e25");
    if(pronoun.length > 0) {
        const pn = document.createElement("span");
        pn.className = "Naver-Dict-tooltip-title-pronoun";
        pn.innerText = pronoun.item(0).innerText.trim();

        div.appendChild(pn);
    }

    return div;
}

function GetBody(body) {
    const div = document.createElement("div");
    div.className = "Naver-Dict-tooltip-body";

    const content = body.innerHTML.split("<br>");
    for(let i = 0; i < content.length; i++) {
        const data = document.createElement("div");
        data.className = "Naver-Dict-tooltip-data";
        data.innerHTML = content[i];

        if(i !== content.length - 1)
            data.style.borderBottom = "dashed #32a1ce";

        div.appendChild(data);
    }

    return div;
}

function GetPopup(top, left, dom) {
    const parent = document.createElement("div");
    parent.id = POPUP_ID;
    parent.className = "Naver-Dict-tooltip";
    parent.style.cssText = `top:${top}px;left:${left}px;`;

    const result = dom.getElementsByClassName("dic_search_result").item(0);

    parent.appendChild(GetTitle(result.children.item(0)));
    parent.appendChild(GetBody(result.children.item(1)));

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
    const popup = document.getElementById(POPUP_ID);
    if(popup !== null)
        return;

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
    const popup = document.getElementById(POPUP_ID);
    //popup 이 없는 경우
    if(popup === null)
        return;

    if(event.target.className.includes(POPUP_CLASS_NAME))
        return;

    popup.remove();
}

function Init() {
    document.onmouseup = OnMouseUp;
    document.onclick = OnClick;
}

window.onload = Init;
