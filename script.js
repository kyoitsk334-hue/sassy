const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", function () {

  const file = this.files[0];

  if (!file) return;

  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="name">${file.name}</div>
    <div class="type">${file.type || "ファイル"}</div>
  `;

  fileList.prepend(card);

});
