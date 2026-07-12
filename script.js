const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const drawingNumber = document.getElementById("drawingNumber");
const drawingName = document.getElementById("drawingName");
const drawingMemo = document.getElementById("drawingMemo");
const searchInput = document.getElementById("searchInput");
const latestOnly = document.getElementById("latestOnly");

let drawings = [];

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const drawing = {
        number: drawingNumber.value || "未入力",
        name: drawingName.value || file.name,
        memo: drawingMemo.value,
        date: new Date().toLocaleString("ja-JP"),
        fileName: file.name,
        latest: true
    };

    drawings.forEach(d => {
        if (d.number === drawing.number) {
            d.latest = false;
        }
    });

    drawings.unshift(drawing);

    drawingNumber.value = "";
    drawingName.value = "";
    drawingMemo.value = "";
    fileInput.value = "";

    renderList();
});

searchInput.addEventListener("input", renderList);
latestOnly.addEventListener("change", renderList);

function renderList() {
    fileList.innerHTML = "";

    const keyword = searchInput.value.toLowerCase();

    const list = drawings.filter(d => {
        const hit =
            d.number.toLowerCase().includes(keyword) ||
            d.name.toLowerCase().includes(keyword) ||
            d.fileName.toLowerCase().includes(keyword);

        const latest =
            !latestOnly.checked || d.latest;

        return hit && latest;
    });

    list.forEach(d => {
        fileList.innerHTML += `
        <div class="card">
            <div class="name">${d.number}</div>
            <div>${d.name}</div>
            <div class="type">${d.fileName}</div>
            <div class="memo">${d.memo}</div>
            <div class="date">${d.date}</div>
        </div>
        `;
    });
}
