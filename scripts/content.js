const EngRegex = /^[a-z|A-Z]+$/

const Offset = { Y: 100, X: 40, OverflowY: 30 };
const Width = 250;
const Height = 200;

function GetSize(e) {
    let top = e.screenY + document.querySelector('html').scrollTop - Offset.Y;
    let left = e.screenX - Offset.X;

    if(e.screenY + Height >= screen.availHeight)
        top -= Height + Offset.OverflowY;

    return [top, left];
}

function GetPopup(top, left, e) {
    const parent = document.createElement("div");
    parent.id = "Naver-Dict-Popup";
    parent.className = "tooltip";
    parent.style.cssText = `top:${top}px;left:${left}px;margin-left:-60px;`;

    return parent;
}

function OnMouseUp(event) {
    const selection = window.getSelection();
    if(selection.rangeCount <= 0)
        return;

    const text = selection.getRangeAt(0).cloneContents().textContent;
    if(!EngRegex.test(text))
        return;

    const [top, left] = GetSize(event);
    document.body.appendChild(GetPopup(top, left, event));
}

function Init() {
    document.onmouseup = OnMouseUp;
}

window.onload = Init;
