const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");

fileInput.addEventListener("change", function () {

    for (const file of this.files) {

        const url = URL.createObjectURL(file);

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="name">${file.name}</div>
            <div class="type">${file.type}</div>
        `;

        card.onclick = () => {
            window.open(url, "_blank");
        };

        fileList.prepend(card);
    }

    this.value = "";

});
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const keyword = this.value.toLowerCase();
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();

    if (text.includes(keyword)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }
  });
});
