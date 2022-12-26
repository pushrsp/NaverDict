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

function GetPopup(top, left) {
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
    document.body.appendChild(GetPopup(top, left));
}

function OnClick(event) {
    const popup = document.getElementById("Naver-Dict-Popup");
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
