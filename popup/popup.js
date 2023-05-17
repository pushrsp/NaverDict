async function onClickSearchButton() {
    const input = document.getElementById("Naver-Dict-word-input");
    if(input.value.length === 0)
        return;

    alert(input.value);
}

document.getElementById("Naver-Dict-word-button").addEventListener("click", onClickSearchButton);
